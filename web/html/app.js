// 选择功能类型
function selectFunctionType(type) {
    // 更新UI选中状态
    document.querySelectorAll('.resource-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(type + 'Card').classList.add('selected');
    
    // 根据选择的功能类型显示不同的表单区域
    if (type === 'cloudResource') {
        // 显示云资源相关区域
        document.getElementById('resourceTypeSection').style.display = 'block';
        document.getElementById('basicInfoSection').style.display = 'block';
        document.getElementById('resourceConfigSection').style.display = 'block';
        document.getElementById('otherInfoSection').style.display = 'block';
        
        // 隐藏SMB权限相关区域
        document.getElementById('smbConfigSection').style.display = 'none';
        
        // 重置资源配置区域
        const configSection = document.getElementById('resourceConfigSection');
        configSection.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fas fa-arrow-up text-2xl mb-2"></i>
                <p>请从上方选择一个资源类型开始配置</p>
            </div>
        `;
    } else if (type === 'smbPermission') {
        // 显示SMB权限相关区域
        document.getElementById('smbConfigSection').style.display = 'block';
        
        // 隐藏云资源相关区域
        document.getElementById('resourceTypeSection').style.display = 'none';
        document.getElementById('basicInfoSection').style.display = 'none';
        document.getElementById('resourceConfigSection').style.display = 'none';
        document.getElementById('otherInfoSection').style.display = 'none';
    }
}

// 选择资源类型
function selectResourceType(type) {
    // 更新UI选中状态
    document.querySelectorAll('.resource-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.getElementById(type + 'Card').classList.add('selected');
    
    // 加载对应的配置表单
    const configSection = document.getElementById('resourceConfigSection');
    
    // 添加淡出效果
    configSection.style.opacity = '0';
    configSection.style.transform = 'translateY(10px)';
    
    // 延迟加载新内容以显示过渡效果
    setTimeout(() => {
        configSection.innerHTML = resourceTemplates[type];
        configSection.classList.remove('hidden');
        
        // 重新添加淡入效果
        configSection.style.opacity = '1';
        configSection.style.transform = 'translateY(0)';
        
        // 滚动到资源配置区域
        configSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // 如果是虚拟机类型，监听数据盘选项变化
        if (type === 'vm') {
            document.querySelectorAll('input[name="data_disk"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    const dataDiskConfig = document.getElementById('dataDiskConfig');
                    if (this.value === 'yes' && this.checked) {
                        dataDiskConfig.classList.remove('hidden');
                        dataDiskConfig.style.opacity = '0';
                        dataDiskConfig.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            dataDiskConfig.style.opacity = '1';
                            dataDiskConfig.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        dataDiskConfig.style.opacity = '0';
                        dataDiskConfig.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            dataDiskConfig.classList.add('hidden');
                        }, 300);
                    }
                });
            });
        }
    }, 300);
}