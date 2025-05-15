document.addEventListener('DOMContentLoaded', function() {

  

  
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

// 移动端汉堡菜单切换
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});