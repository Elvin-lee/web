// 页面初始化
function initApp() {
    // 默认不选择任何资源类型，让用户自行选择
    // 如果需要默认选择虚拟机，可以取消下面这行的注释
    // selectResourceType('vm');
    
    // 二级业务数据
    const subBusinesses = {
        'llm': ['爬虫', '数据处理', '标注','训练'],
        'video': ['爬虫', '数据处理', '标注','训练'],
        'audio': ['爬虫', '数据处理', '标注','训练'],
        'engin': ['UE', 'Art'],
        'aidata': ['数据湖', '数据标注', '标注平台'],
        'general': ['infra', 'IT', '其他']
    };
    
    // 监听一级业务变化
    const departmentSelect = document.getElementById('department');
    const subDepartmentSelect = document.getElementById('subDepartment');
    
    departmentSelect.addEventListener('change', function() {
        const selectedBusiness = this.value;
        
        // 清空二级业务选择框
        subDepartmentSelect.innerHTML = '';
        
        if (selectedBusiness === '') {
            // 未选择一级业务时
            subDepartmentSelect.disabled = true;
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '请先选择一级业务';
            subDepartmentSelect.appendChild(option);
        } else {
            // 选择一级业务后，启用二级业务选择框并填充选项
            subDepartmentSelect.disabled = false;
            
            // 添加默认空选项（表示非必选）
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '请选择二级业务（非必选）';
            subDepartmentSelect.appendChild(emptyOption);
            
            // 添加对应的二级业务选项
            if (subBusinesses[selectedBusiness]) {
                subBusinesses[selectedBusiness].forEach(subBusiness => {
                    const option = document.createElement('option');
                    option.value = subBusiness;
                    option.textContent = subBusiness;
                    subDepartmentSelect.appendChild(option);
                });
            }
        }
    });
    
    // 控制短期天数选择器的显示/隐藏
    const usageDurationType = document.getElementById('usageDurationType');
    const daysSelector = document.getElementById('daysSelector');
    
    usageDurationType.addEventListener('change', function() {
        if (this.value === 'short') {
            // 选择短期时显示天数选择器
            daysSelector.classList.remove('hidden');
            daysSelector.style.opacity = '0';
            daysSelector.style.transform = 'translateY(10px)';
            setTimeout(() => {
                daysSelector.style.opacity = '1';
                daysSelector.style.transform = 'translateY(0)';
            }, 10);
        } else {
            // 选择长期或未选择时隐藏天数选择器
            daysSelector.style.opacity = '0';
            daysSelector.style.transform = 'translateY(10px)';
            setTimeout(() => {
                daysSelector.classList.add('hidden');
            }, 300);
        }
    });
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);