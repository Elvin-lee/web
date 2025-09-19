// Node.js后端服务示例 - 用于处理资源申请表单提交并保存到MySQL数据库

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());

// 数据库连接配置
const dbConfig = {
    host: 'localhost',      // 数据库主机地址
    user: 'root',           // 数据库用户名
    password: 'password',   // 数据库密码
    database: 'resource_db' // 数据库名称
};

// 创建数据库连接池
const pool = mysql.createPool(dbConfig);

// 测试数据库连接
async function testDbConnection() {
    try {
        const connection = await pool.getConnection();
        console.log('数据库连接成功！');
        connection.release();
    } catch (error) {
        console.error('数据库连接失败:', error);
        // 可以在这里添加自动创建数据库和表的逻辑
        // await createDatabaseAndTables();
    }
}

// 创建数据库和表（如果不存在）
async function createDatabaseAndTables() {
    try {
        // 先连接到MySQL服务器
        const connection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });
        
        // 创建数据库
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        console.log(`数据库 ${dbConfig.database} 创建成功或已存在`);
        
        // 选择数据库
        await connection.query(`USE ${dbConfig.database}`);
        
        // 创建资源申请主表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS resource_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL UNIQUE,
                timestamp DATETIME NOT NULL,
                form_type VARCHAR(20) NOT NULL,
                applicant_domain_account VARCHAR(100) NOT NULL,
                department VARCHAR(50),
                sub_department VARCHAR(50),
                usage_duration_type VARCHAR(10),
                short_term_days INT,
                usage_description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('resource_requests表创建成功或已存在');
        
        // 创建SMB权限申请表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS smb_permissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL UNIQUE,
                user_domain_account VARCHAR(100) NOT NULL,
                storage_path VARCHAR(255) NOT NULL,
                access_permission VARCHAR(20) NOT NULL,
                permission_description TEXT,
                FOREIGN KEY (request_id) REFERENCES resource_requests(request_id) ON DELETE CASCADE
            )
        `);
        console.log('smb_permissions表创建成功或已存在');
        
        // 创建虚拟机配置表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS vm_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL UNIQUE,
                cpu VARCHAR(20) NOT NULL,
                memory VARCHAR(20) NOT NULL,
                os VARCHAR(50) NOT NULL,
                system_disk_size INT NOT NULL,
                data_disk_needed BOOLEAN NOT NULL DEFAULT FALSE,
                data_disk_size INT,
                FOREIGN KEY (request_id) REFERENCES resource_requests(request_id) ON DELETE CASCADE
            )
        `);
        console.log('vm_configs表创建成功或已存在');
        
        // 创建数据库配置表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS db_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL UNIQUE,
                engine VARCHAR(50) NOT NULL,
                spec VARCHAR(20) NOT NULL,
                storage_size INT NOT NULL,
                charset VARCHAR(20) NOT NULL,
                backup_needed BOOLEAN NOT NULL DEFAULT FALSE,
                access_type VARCHAR(20) NOT NULL,
                FOREIGN KEY (request_id) REFERENCES resource_requests(request_id) ON DELETE CASCADE
            )
        `);
        console.log('db_configs表创建成功或已存在');
        
        // 创建存储配置表
        await connection.query(`
            CREATE TABLE IF NOT EXISTS storage_configs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                request_id VARCHAR(36) NOT NULL UNIQUE,
                storage_type VARCHAR(50) NOT NULL,
                capacity INT NOT NULL,
                protocol VARCHAR(20) NOT NULL,
                redundancy VARCHAR(20) NOT NULL,
                encryption_needed BOOLEAN NOT NULL DEFAULT FALSE,
                lifecycle_days INT NOT NULL,
                FOREIGN KEY (request_id) REFERENCES resource_requests(request_id) ON DELETE CASCADE
            )
        `);
        console.log('storage_configs表创建成功或已存在');
        
        connection.end();
    } catch (error) {
        console.error('创建数据库和表失败:', error);
    }
}

// 生成唯一的请求ID
function generateRequestId() {
    return crypto.randomUUID();
}

// 处理资源申请提交的API
app.post('/api/submit-resource-request', async (req, res) => {
    const formData = req.body;
    const connection = await pool.getConnection();
    
    try {
        // 开始事务
        await connection.beginTransaction();
        
        // 生成请求ID
        const requestId = generateRequestId();
        
        // 根据表单类型处理数据
        if (formData.formType === 'smbPermission') {
            // 处理SMB权限申请
            await saveSmbPermissionRequest(connection, formData, requestId);
        } else if (formData.formType === 'cloudResource') {
            // 处理云资源申请
            await saveCloudResourceRequest(connection, formData, requestId);
        } else {
            throw new Error('不支持的表单类型');
        }
        
        // 提交事务
        await connection.commit();
        
        // 返回成功响应
        res.status(200).json({
            success: true,
            requestId: requestId,
            message: '申请提交成功'
        });
        
        console.log(`申请提交成功: ${requestId}, 类型: ${formData.formType}`);
    } catch (error) {
        // 回滚事务
        await connection.rollback();
        
        console.error('保存申请数据失败:', error);
        res.status(500).json({
            success: false,
            message: '保存申请数据失败',
            error: error.message
        });
    } finally {
        // 释放连接
        connection.release();
    }
});

// 保存SMB权限申请
async function saveSmbPermissionRequest(connection, formData, requestId) {
    const smbConfig = formData.smbConfig;
    
    // 插入主表记录
    await connection.query(
        'INSERT INTO resource_requests (request_id, timestamp, form_type, applicant_domain_account) VALUES (?, ?, ?, ?)',
        [requestId, formData.timestamp, formData.formType, smbConfig.userDomainAccount]
    );
    
    // 插入SMB权限详情
    await connection.query(
        'INSERT INTO smb_permissions (request_id, user_domain_account, storage_path, access_permission, permission_description) VALUES (?, ?, ?, ?, ?)',
        [requestId, smbConfig.userDomainAccount, smbConfig.storagePath, smbConfig.accessPermission, smbConfig.permissionDescription]
    );
}

// 保存云资源申请
async function saveCloudResourceRequest(connection, formData, requestId) {
    const basicInfo = formData.basicInfo;
    
    // 插入主表记录
    await connection.query(
        'INSERT INTO resource_requests (request_id, timestamp, form_type, applicant_domain_account, department, sub_department, usage_duration_type, short_term_days, usage_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
            requestId,
            formData.timestamp,
            formData.formType,
            basicInfo.applicantDomainAccount,
            basicInfo.department,
            basicInfo.subDepartment,
            basicInfo.usageDurationType,
            basicInfo.shortTermDays,
            formData.usageDescription
        ]
    );
    
    // 根据资源类型保存不同的配置
    const resourceType = formData.resourceType;
    const resourceConfig = formData.resourceConfig;
    
    switch (resourceType) {
        case 'vm':
            // 保存虚拟机配置
            await connection.query(
                'INSERT INTO vm_configs (request_id, cpu, memory, os, system_disk_size, data_disk_needed, data_disk_size) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    requestId,
                    resourceConfig.cpu,
                    resourceConfig.memory,
                    resourceConfig.os,
                    resourceConfig.systemDiskSize,
                    resourceConfig.dataDiskNeeded,
                    resourceConfig.dataDiskSize || null
                ]
            );
            break;
            
        case 'db':
            // 保存数据库配置
            await connection.query(
                'INSERT INTO db_configs (request_id, engine, spec, storage_size, charset, backup_needed, access_type) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    requestId,
                    resourceConfig.engine,
                    resourceConfig.spec,
                    resourceConfig.storageSize,
                    resourceConfig.charset,
                    resourceConfig.backupNeeded,
                    resourceConfig.accessType
                ]
            );
            break;
            
        case 'storage':
            // 保存存储配置
            await connection.query(
                'INSERT INTO storage_configs (request_id, storage_type, capacity, protocol, redundancy, encryption_needed, lifecycle_days) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [
                    requestId,
                    resourceConfig.storageType,
                    resourceConfig.capacity,
                    resourceConfig.protocol,
                    resourceConfig.redundancy,
                    resourceConfig.encryptionNeeded,
                    resourceConfig.lifecycleDays
                ]
            );
            break;
    }
}

// 获取申请列表（可选功能）
app.get('/api/resource-requests', async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.query('SELECT * FROM resource_requests ORDER BY created_at DESC LIMIT 100');
        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('获取申请列表失败:', error);
        res.status(500).json({
            success: false,
            message: '获取申请列表失败',
            error: error.message
        });
    } finally {
        connection.release();
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`后端服务已启动，监听端口 ${PORT}`);
    console.log(`API地址: http://localhost:${PORT}/api`);
    console.log('测试数据库连接...');
    testDbConnection();
});

// 导出app供测试使用
module.exports = app;