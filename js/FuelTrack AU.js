/**
 * FuelTrack AU - 交互逻辑
 * 实现星级评分系统和复制功能
 */

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化星级评分系统
    initStarRating();
    
    // 初始化复制功能
    initCopyButtons();
    
    // 初始化导航栏
    initNavigation();
});

/**
 * 初始化导航栏功能
 */
function initNavigation() {
    // 获取所有导航链接
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 默认激活第一个链接（可根据实际需求修改）
    navLinks[0].classList.add('active');
    
    // 为每个导航链接添加点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有链接的激活状态
            navLinks.forEach(item => {
                item.classList.remove('active');
            });
            
            // 添加当前点击链接的激活状态
            this.classList.add('active');
        });
        
        // 添加鼠标悬停效果
        link.addEventListener('mouseover', function() {
            if (!this.classList.contains('active')) {
                this.style.setProperty('--hover-width', '100%');
            }
        });
        
        link.addEventListener('mouseout', function() {
            if (!this.classList.contains('active')) {
                this.style.setProperty('--hover-width', '0');
            }
        });
    });
    
    // 检查当前URL是否匹配任何导航链接，并激活相应链接
    const currentUrl = window.location.hash;
    if (currentUrl) {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentUrl) {
                // 移除所有链接的激活状态
                navLinks.forEach(item => {
                    item.classList.remove('active');
                });
                
                // 激活匹配当前URL的链接
                link.classList.add('active');
            }
        });
    }
}

/**
 * 初始化星级评分系统
 */
function initStarRating() {
    // 获取所有星级评分容器
    const starRatingContainers = document.querySelectorAll('.star-rating');
    
    // 为每个星级评分容器添加事件
    starRatingContainers.forEach(container => {
        const stars = container.querySelectorAll('.star');
        const category = container.dataset.category;
        
        // 点击事件 - 固定评分
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const value = parseInt(this.dataset.value);
                updateStars(stars, value);
                
                // 这里可以添加将评分保存到服务器的代码
                console.log(`Rating for ${category}: ${value}`);
            });
        });
        
        // 鼠标悬停事件 - 预览评分
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const value = parseInt(this.dataset.value);
                previewStars(stars, value);
            });
            
            // 鼠标离开事件 - 恢复原始评分
            star.addEventListener('mouseout', function() {
                resetStars(stars);
            });
        });
    });
}

/**
 * 更新星星显示（固定评分）
 * @param {NodeList} stars - 星星元素集合
 * @param {number} value - 评分值（1-5）
 */
function updateStars(stars, value) {
    stars.forEach((star, index) => {
        const starIcon = star.querySelector('i');
        
        if (index < value) {
            // 填充星星
            starIcon.className = 'fas fa-star';
            star.classList.add('selected');
        } else {
            // 空心星星
            starIcon.className = 'far fa-star';
            star.classList.remove('selected');
        }
    });
}

/**
 * 预览星星显示（鼠标悬停）
 * @param {NodeList} stars - 星星元素集合
 * @param {number} value - 评分值（1-5）
 */
function previewStars(stars, value) {
    stars.forEach((star, index) => {
        const starIcon = star.querySelector('i');
        
        if (index < value) {
            // 填充星星
            starIcon.className = 'fas fa-star';
        } else {
            // 空心星星
            starIcon.className = 'far fa-star';
        }
    });
}

/**
 * 重置星星显示（恢复原始评分）
 * @param {NodeList} stars - 星星元素集合
 */
function resetStars(stars) {
    stars.forEach(star => {
        const starIcon = star.querySelector('i');
        
        if (star.classList.contains('selected')) {
            // 如果是已选中的星星，保持填充状态
            starIcon.className = 'fas fa-star';
        } else {
            // 否则恢复为空心
            starIcon.className = 'far fa-star';
        }
    });
}

/**
 * 初始化复制按钮功能
 */
function initCopyButtons() {
    // 获取所有复制按钮
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    // 为每个复制按钮添加点击事件
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 获取要复制的文本
            const textToCopy = this.dataset.clipboardText;
            
            // 复制文本到剪贴板
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // 显示复制成功的图标
                    showCopySuccess(this);
                })
                .catch(err => {
                    console.error('无法复制文本: ', err);
                });
        });
    });
}

/**
 * 显示复制成功的图标
 * @param {HTMLElement} button - 复制按钮元素
 */
function showCopySuccess(button) {
    // 获取图标元素
    const icon = button.querySelector('i');
    
    // 保存原始类名
    const originalClass = icon.className;
    
    // 更改为对号图标
    icon.className = 'fas fa-check';
    button.classList.add('copy-success');
    
    // 2秒后恢复原样
    setTimeout(() => {
        icon.className = originalClass;
        button.classList.remove('copy-success');
    }, 2000);
}