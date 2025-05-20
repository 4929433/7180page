// 导航菜单切换激活状态
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// 移动端汉堡菜单切换
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// 自动标记当前页面的导航项
document.addEventListener('DOMContentLoaded', function() {
  // 获取当前页面URL
  const currentPath = window.location.pathname;
  // 提取文件名
  const currentPage = currentPath.split('/').pop();
  
  // 如果是首页或空路径
  if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
    // 标记 homepage.html 链接
    document.querySelector('.nav-links a[href="homepage.html"]')?.classList.add('current');
  } 
  // 如果当前页面有文件名
  else if (currentPage) {
    // 查找匹配的导航链接
    const matchingLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
    if (matchingLink) {
      matchingLink.classList.add('current');
    } 
    // 特殊情况：如果是index.html或默认页但URL中未显示
    else if (currentPage === '') {
      document.querySelector('.nav-links a[href="homepage.html"]')?.classList.add('current');
    }
  }
});