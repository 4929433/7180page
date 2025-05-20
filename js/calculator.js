/**
 * calculator.js - 处理calculator页面特定功能
 * 包括footer折叠/展开功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化footer折叠功能
    initCollapsibleFooter();
    
    // 其他可能的calculator页面功能可以在这里添加
  });
  
  /**
   * 初始化可折叠footer功能
   */
  function initCollapsibleFooter() {
    const footerToggle = document.getElementById('footerToggle');
    const footer = document.querySelector('.collapsible-footer');
    
    if (!footerToggle || !footer) return; // 确保元素存在
    
    // 添加点击事件处理
    footerToggle.addEventListener('click', function() {
      // 切换展开/折叠状态
      footer.classList.toggle('expanded');
      
      // 更新按钮文本和图标
      if (footer.classList.contains('expanded')) {
        footerToggle.innerHTML = 'Hide Info <i class="fas fa-chevron-up"></i>';
      } else {
        footerToggle.innerHTML = 'More Info <i class="fas fa-chevron-down"></i>';
      }
    });
    
    // 初始状态设置 - 默认折叠
    footer.classList.remove('expanded');
    footerToggle.innerHTML = 'More Info <i class="fas fa-chevron-down"></i>';
  }