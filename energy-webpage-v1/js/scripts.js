function showPage(pageName) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(function(page) {
    page.classList.add('hidden');
  });

  document.getElementById('page-' + pageName).classList.remove('hidden');

  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(function(link) {
    link.classList.remove('active');
  });

  document.getElementById('nav-' + pageName).classList.add('active');
}