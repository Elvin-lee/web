// 背景图片轮转功能

// 背景图片路径数组
const backgroundImages = [];

// 尝试加载images目录下的所有常见格式图片
function loadAllImages() {
    // 从文件夹结构中看到的图片格式和命名模式
    const imagePatterns = [
        // 数字命名的图片
        '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '35.jpg',
        // 复杂命名的图片
        '2efa9fbb6e3c9ec21a0f20069e97f269.jpg', '305e6de001cb4acc302f281fe10a2da7.jpg', '31c1acc28cc2c4db288d8d92e806c2ae.jpg',
        '350e85e4a947a6b3d2db1ece09dce853.jpg', '3ca4817fdd9f02976257566a8b569e34.jpg', '5587a5473d71bfabd721584bced66305.jpg',
        '56dc267c61b16a51da9c4768d9942745.jpg', '739e4c72b2aaca15639c91ccd2ea01d4.jpg', '7b88fb8c531335f79aa770821a8e39cc.jpg',
        '847a4dec878357a9a78dba88c7426316.jpg', '8b36ea5e594fb87b324feb2e3c7d488a.jpg', '8f15f944bb7c07effae65c31e45776d2.jpg',
        '9024df570c8e7a144805203f382fb44a.jpg', 'b032903f14aed8cb50d47ab0b9d664e8.jpg', 'd88d05ed2639aaca02314dbc749a4d1c.jpg',
        'e4057ac6a6cb80d13db344152793f3fd.jpg', 'e7aade0eb83f7ec3586f58fb445f6392.jpg', 'ef659f4e06babe84f460eb830f853ec1.jpg',
        'f159cede358c35e06539d88efa41b91c.jpg',
        // 中文命名的图片
        'beijing.jpg'
    ];

    // 用于存储已验证可加载的图片
    const validImages = [];
    
    // 创建一个Promise数组
    const promises = imagePatterns.map((pattern, index) => {
        return new Promise((resolve) => {
            const imgSrc = `images/${pattern}`;
            const img = new Image();
            
            // 设置超时，避免长时间等待不存在的图片
            const timeoutId = setTimeout(() => {
                resolve(false);
            }, 500);
            
            // 图片加载成功
            img.onload = () => {
                clearTimeout(timeoutId);
                validImages.push(imgSrc);
                resolve(true);
            };
            
            // 图片加载失败
            img.onerror = () => {
                clearTimeout(timeoutId);
                resolve(false);
            };
            
            // 开始加载图片
            img.src = imgSrc;
        });
    });
    
    // 当所有图片都尝试加载后，返回有效图片数组
    return Promise.all(promises).then(() => {
        return validImages;
    });
}

// 当前图片索引
let currentImageIndex = 0;

// 初始化背景
function initBackground() {
    // 创建背景图片容器
    const bgContainer = document.createElement('div');
    bgContainer.id = 'background-container';
    document.body.insertBefore(bgContainer, document.body.firstChild);
    
    // 加载所有图片
    loadAllImages().then(images => {
        // 如果找到有效图片
        if (images.length > 0) {
            // 更新backgroundImages数组
            backgroundImages.length = 0; // 清空原有数组
            backgroundImages.push(...images); // 添加所有有效图片
            
            // 设置第一张背景图片
            updateBackgroundImage();
            
            // 开始轮转
            setInterval(() => {
                currentImageIndex = (currentImageIndex + 1) % backgroundImages.length;
                updateBackgroundImage();
            }, 5000); // 每5秒切换一次图片
        } else {
            // 如果没有找到图片，使用默认背景色
            bgContainer.style.backgroundColor = '#f0f2f5';
        }
    });
}

// 更新背景图片
function updateBackgroundImage() {
    const bgContainer = document.getElementById('background-container');
    
    // 创建新的图片元素
    const newBg = document.createElement('div');
    newBg.className = 'bg-image';
    newBg.style.backgroundImage = `url(${backgroundImages[currentImageIndex]})`;
    
    // 清空容器并添加新图片
    bgContainer.innerHTML = '';
    bgContainer.appendChild(newBg);
    
    // 添加入场动画
    setTimeout(() => {
        newBg.style.opacity = '1';
    }, 50);
}

// 当DOM加载完成后初始化背景
document.addEventListener('DOMContentLoaded', initBackground);