// js/main.js — laisse .html naviguer normalement, gère seulement les data-page/#hash
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(a => {
    a.addEventListener('click', e => {
      const href = (a.getAttribute('href')||'').trim();
      // si le lien pointe vers un fichier .html, on laisse le navigateur faire son job
      if (href && href.toLowerCase().endsWith('.html')) return;
      // sinon, c'est un lien interne (hash / data-page) => SPA
      const page = a.dataset.page || (href === '#' ? a.getAttribute('data-page') : null);
      if (page) {
        e.preventDefault();
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const target = document.getElementById(page);
        if (target) target.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        a.classList.add('active');
        history.pushState({page}, '', '#' + page);
      }
    });
  });

  // Activation selon URL lors du chargement (index.html)
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(a => {
    const href = (a.getAttribute('href')||'').split('/').pop();
    if (href === current) a.classList.add('active');
  });
});
