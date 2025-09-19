// 表单提交处理器

// 表单提交函数
function submitForm(event) {
    // 阻止表单默认提交行为
    if (event) event.preventDefault();
    
    try {
        // 收集表单数据
        const formData = collectFormData();
        
        // 验证表单数据
        if (!validateFormData(formData)) {
            return;
        }
        
        // 显示提交中状态
        showSubmittingState();
        
        // 发送数据到后端API
        submitToServer(formData)
            .then(response => {
                // 处理成功响应
                handleSuccess(response);
            })
            .catch(error => {
                // 处理错误
                handleError(error);
            })
            .finally(() => {
                // 恢复按钮状态
                resetButtonState();
            });
    } catch (error) {
        console.error('表单提交过程中发生错误:', error);
        alert('提交过程中发生错误，请重试。');
        resetButtonState();
    }
}

// 收集表单数据
function collectFormData() {
    const formData = {
        timestamp: new Date().toISOString(),
        formType: getSelectedFormType()
    };
    
    // 根据表单类型收集不同的数据
    if (formData.formType === 'smbPermission') {
        // 收集SMB存储权限申请数据
        formData.smbConfig = {
            userDomainAccount: document.querySelector('#smbConfigSection input[placeholder="san.zhang"]').value.trim(),
            storagePath: document.querySelector('#smbConfigSection input[placeholder="\\\\server\\\\share\\\\path"]').value.trim(),
            accessPermission: document.querySelector('#smbConfigSection select').value,
            permissionDescription: document.querySelector('#smbConfigSection textarea').value.trim()
        };
    } else if (formData.formType === 'cloudResource') {
        // 收集云资源申请数据
        formData.resourceType = getSelectedResourceType();
        formData.basicInfo = {
            applicantDomainAccount: document.querySelector('#basicInfoSection input[placeholder="san.zhang"]').value.trim(),
            department: document.getElementById('department').value,
            subDepartment: document.getElementById('subDepartment').value,
            usageDurationType: document.getElementById('usageDurationType').value,
            shortTermDays: document.getElementById('daysSelector').classList.contains('hidden') ? null : document.getElementById('shortTermDays').value
        };
        
        // 收集资源配置数据
        formData.resourceConfig = collectResourceConfig(formData.resourceType);
        
        // 收集用途说明
        formData.usageDescription = document.querySelector('#otherInfoSection textarea').value.trim();
    }
    
    return formData;
}

// 获取选中的表单类型
function getSelectedFormType() {
    if (document.getElementById('smbConfigSection').style.display !== 'none') {
        return 'smbPermission';
    } else if (document.getElementById('resourceTypeSection').style.display !== 'none') {
        return 'cloudResource';
    }
    return null;
}

// 获取选中的资源类型
function getSelectedResourceType() {
    const resourceCards = document.querySelectorAll('#resourceTypeSection .resource-card');
    for (const card of resourceCards) {
        if (card.classList.contains('selected')) {
            return card.id.replace('Card', '');
        }
    }
    return null;
}

// 收集资源配置数据
function collectResourceConfig(resourceType) {
    const config = {};
    const configSection = document.getElementById('resourceConfigSection');
    
    switch (resourceType) {
        case 'vm':
            // 收集虚拟机配置
            const vmSelects = configSection.querySelectorAll('select');
            config.cpu = vmSelects[0].value;
            config.memory = vmSelects[1].value;
            config.os = vmSelects[2].value;
            config.systemDiskSize = configSection.querySelector('input[type="number"]').value;
            config.dataDiskNeeded = configSection.querySelector('input[name="data_disk"][value="yes"]').checked;
            if (config.dataDiskNeeded) {
                config.dataDiskSize = document.getElementById('dataDiskConfig').querySelector('input').value;
            }
            break;
        
        case 'db':
            // 收集数据库配置
            const dbSelects = configSection.querySelectorAll('select');
            config.engine = dbSelects[0].value;
            config.spec = dbSelects[1].value;
            config.charset = dbSelects[2].value;
            config.storageSize = configSection.querySelector('input[type="number"]').value;
            config.backupNeeded = configSection.querySelector('input[name="backup"][value="yes"]').checked;
            config.accessType = configSection.querySelector('input[name="access"][checked]').value;
            break;
        
        case 'storage':
            // 收集存储配置
            const storageSelects = configSection.querySelectorAll('select');
            config.storageType = storageSelects[0].value;
            config.protocol = storageSelects[2].value;
            config.redundancy = storageSelects[3].value;
            config.capacity = configSection.querySelectorAll('input[type="number"]')[0].value;
            config.lifecycleDays = configSection.querySelectorAll('input[type="number"]')[1].value;
            config.encryptionNeeded = configSection.querySelector('input[name="encrypt"][value="yes"]').checked;
            break;
    }
    
    return config;
}

// 验证表单数据
function validateFormData(formData) {
    // 表单类型验证
    if (!formData.formType) {
        alert('请选择申请类型');
        return false;
    }
    
    // 根据表单类型进行验证
    if (formData.formType === 'smbPermission') {
        // SMB权限申请验证
        const smbConfig = formData.smbConfig;
        
        if (!smbConfig.userDomainAccount) {
            alert('请填写用户域账号');
            return false;
        }
        
        if (!smbConfig.storagePath) {
            alert('请填写存储路径');
            return false;
        }
        
        if (!smbConfig.accessPermission) {
            alert('请选择访问权限');
            return false;
        }
    } else if (formData.formType === 'cloudResource') {
        // 云资源申请验证
        
        if (!formData.resourceType) {
            alert('请选择资源类型');
            return false;
        }
        
        const basicInfo = formData.basicInfo;
        
        if (!basicInfo.applicantDomainAccount) {
            alert('请填写申请人域账号');
            return false;
        }
        
        if (!basicInfo.department) {
            alert('请选择业务');
            return false;
        }
        
        if (!basicInfo.usageDurationType) {
            alert('请选择预计使用时长');
            return false;
        }
        
        if (basicInfo.usageDurationType === 'short' && !basicInfo.shortTermDays) {
            alert('请填写短期使用天数');
            return false;
        }
        
        if (!formData.usageDescription) {
            alert('请填写资源用途说明');
            return false;
        }
    }
    
    return true;
}

// 显示提交中状态
function showSubmittingState() {
    const submitButton = document.querySelector('button');
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> 提交中...';
}

// 重置按钮状态
function resetButtonState() {
    const submitButton = document.querySelector('button');
    submitButton.disabled = false;
    submitButton.innerHTML = '提交申请';
}

// 发送数据到服务器
function submitToServer(formData) {
    // 这里使用fetch API发送数据到后端
    // 实际使用时，需要替换为真实的后端API地址
    const apiUrl = '/api/submit-resource-request'; // 后端API地址
    
    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
        }
        return response.json();
    });
}

// 处理成功响应
function handleSuccess(response) {
    // 显示成功消息
    alert('申请提交成功！申请单号：' + (response.requestId || '未知'));
    
    // 可以选择重置表单
    // resetForm();
    
    // 或者跳转到成功页面
    // window.location.href = '/success.html';
}

// 处理错误
function handleError(error) {
    console.error('提交失败:', error);
    alert('提交失败，请稍后重试。\n错误信息：' + error.message);
}

// 重置表单
function resetForm() {
    // 重置所有表单字段
    document.querySelectorAll('input, select, textarea').forEach(element => {
        if (element.type === 'radio' || element.type === 'checkbox') {
            element.checked = element.hasAttribute('checked');
        } else {
            element.value = '';
        }
    });
    
    // 重置UI状态
    document.querySelectorAll('.resource-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 隐藏所有表单区域
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示功能类型选择区域
    document.getElementById('functionTypeSection').style.display = 'block';
}

// 初始化提交处理
function initSubmitHandler() {
    // 给提交按钮添加点击事件
    const submitButton = document.querySelector('button');
    submitButton.addEventListener('click', submitForm);
}

// 当DOM加载完成后初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSubmitHandler);
} else {
    initSubmitHandler();
}