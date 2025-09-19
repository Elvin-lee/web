# 资源申请表单提交后端服务

## 概述
这个后端服务用于处理`d:\project\html`页面的表单提交，并将数据保存到MySQL数据库中。服务基于Node.js、Express和MySQL开发。

## 功能特点
- 处理SMB存储权限申请
- 处理云资源（VM、数据库、存储）申请
- 自动创建数据库和表结构（如需）
- 支持事务处理，确保数据一致性
- 提供API接口供前端调用

## 快速开始

### 前提条件
- 安装Node.js (v14.0.0或更高版本)
- 安装MySQL数据库 (v5.7或更高版本)
- 确保MySQL服务正在运行

### 安装步骤

1. 进入server目录
```bash
cd d:\project\server
```

2. 安装依赖
```bash
npm install
```

3. 配置数据库连接
编辑`app.js`文件中的数据库连接配置：
```javascript
const dbConfig = {
    host: 'localhost',      // 数据库主机地址
    user: 'root',           // 数据库用户名
    password: 'password',   // 数据库密码
    database: 'resource_db' // 数据库名称
};
```

4. 启动服务
```bash
# 生产环境启动
npm start

# 开发环境启动（支持热重载）
npm run dev
```

服务启动后，将监听3000端口，API地址为：http://localhost:3000/api

## 数据库表结构
服务自动创建以下表结构（如果不存在）：

### 1. resource_requests（资源申请主表）
- id: 自增主键
- request_id: 唯一请求ID（UUID）
- timestamp: 提交时间戳
- form_type: 表单类型（smbPermission或cloudResource）
- applicant_domain_account: 申请人域账号
- department: 部门
- sub_department: 子部门
- usage_duration_type: 使用时长类型
- short_term_days: 短期使用天数
- usage_description: 使用说明
- created_at: 创建时间
- updated_at: 更新时间

### 2. smb_permissions（SMB权限表）
- id: 自增主键
- request_id: 请求ID（外键）
- user_domain_account: 用户域账号
- storage_path: 存储路径
- access_permission: 访问权限
- permission_description: 权限说明

### 3. vm_configs（虚拟机配置表）
- id: 自增主键
- request_id: 请求ID（外键）
- cpu: CPU核心数
- memory: 内存大小
- os: 操作系统
- system_disk_size: 系统盘大小
- data_disk_needed: 是否需要数据盘
- data_disk_size: 数据盘大小

### 4. db_configs（数据库配置表）
- id: 自增主键
- request_id: 请求ID（外键）
- engine: 数据库引擎
- spec: 实例规格
- storage_size: 存储空间
- charset: 字符集
- backup_needed: 是否需要备份
- access_type: 访问方式

### 5. storage_configs（存储配置表）
- id: 自增主键
- request_id: 请求ID（外键）
- storage_type: 存储类型
- capacity: 容量
- protocol: 协议
- redundancy: 冗余策略
- encryption_needed: 是否需要加密
- lifecycle_days: 生命周期天数

## API接口说明

### 1. 提交资源申请
- **URL**: `/api/submit-resource-request`
- **方法**: POST
- **请求体示例（SMB权限申请）**:
```json
{
  "formType": "smbPermission",
  "timestamp": "2023-11-17T10:30:00Z",
  "smbConfig": {
    "userDomainAccount": "san.zhang",
    "storagePath": "\\server\\share\\path",
    "accessPermission": "readWrite",
    "permissionDescription": "测试SMB权限申请"
  }
}
```

- **请求体示例（云资源申请）**:
```json
{
  "formType": "cloudResource",
  "resourceType": "vm",
  "timestamp": "2023-11-17T10:30:00Z",
  "basicInfo": {
    "applicantDomainAccount": "san.zhang",
    "department": "技术部",
    "subDepartment": "开发组",
    "usageDurationType": "short",
    "shortTermDays": 7
  },
  "resourceConfig": {
    "cpu": "4核",
    "memory": "8GB",
    "os": "CentOS 7",
    "systemDiskSize": 50,
    "dataDiskNeeded": true,
    "dataDiskSize": 100
  },
  "usageDescription": "用于测试环境部署"
}
```

- **成功响应**:
```json
{
  "success": true,
  "requestId": "UUID格式的请求ID",
  "message": "申请提交成功"
}
```

- **失败响应**:
```json
{
  "success": false,
  "message": "保存申请数据失败",
  "error": "错误信息"
}
```

### 2. 获取申请列表
- **URL**: `/api/resource-requests`
- **方法**: GET
- **成功响应**:
```json
{
  "success": true,
  "data": [
    // 申请记录列表
  ]
}
```

## 前端对接说明
前端页面通过引入`submitHandler.js`文件来处理表单提交。该文件会收集表单数据，并发送POST请求到后端API。

确保前端HTML页面中正确引入了`submitHandler.js`文件：
```html
<script src="submitHandler.js"></script>
```

## 常见问题解决

### 数据库连接失败
- 检查MySQL服务是否正在运行
- 确认数据库用户名和密码是否正确
- 检查数据库名称是否已创建或服务是否有权限创建数据库

### API调用跨域问题
- 服务已配置CORS中间件，允许所有来源的请求
- 如果仍有跨域问题，可能是浏览器的安全策略限制，请检查浏览器控制台错误信息

### 服务启动失败
- 检查3000端口是否被占用
- 检查Node.js版本是否满足要求
- 查看控制台错误信息，定位具体问题

## 部署建议

### 生产环境
1. 使用PM2管理Node.js进程
2. 配置MySQL主从复制，提高数据安全性
3. 使用HTTPS加密传输
4. 配置Nginx作为反向代理

### 性能优化
1. 调整MySQL连接池大小
2. 添加请求日志记录
3. 实现数据缓存机制
4. 定期备份数据库

## 注意事项
- 生产环境中请修改默认的数据库密码
- 建议添加请求参数校验和数据清洗逻辑
- 考虑添加用户认证和授权机制
- 定期清理过期数据，优化数据库性能