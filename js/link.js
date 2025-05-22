// Toggle active state of navigation menu
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-links a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// Toggle mobile hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Automatically highlight the current page in the navigation menu
document.addEventListener('DOMContentLoaded', function() {
  // Get current page URL
  const currentPath = window.location.pathname;
  // Extract filename
  const currentPage = currentPath.split('/').pop();
  
  // If it's the homepage or an empty path
  if (currentPath === '/' || currentPath === '/index.html' || currentPath === '') {
    // Highlight the homepage.html link
    document.querySelector('.nav-links a[href="homepage.html"]')?.classList.add('current');
  } 
  else if (currentPage) {
    const matchingLink = document.querySelector(`.nav-links a[href="${currentPage}"]`);
    if (matchingLink) {
      matchingLink.classList.add('current');
    } 

    else if (currentPage === '') {
      document.querySelector('.nav-links a[href="homepage.html"]')?.classList.add('current');
    }
  }
});