
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
