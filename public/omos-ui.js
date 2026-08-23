(() => {
  const nav = document.querySelector('.omos-nav');
  const toggle = document.querySelector('.omos-menu-toggle');
  const items = [...document.querySelectorAll('.omos-nav-item')];

  function closeAll(except) {
    items.forEach((item) => {
      if (item !== except) {
        item.classList.remove('is-open');
        const btn = item.querySelector('.omos-nav-button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  items.forEach((item) => {
    const btn = item.querySelector('.omos-nav-button');
    if (!btn) return;
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const opening = !item.classList.contains('is-open');
      closeAll(item);
      item.classList.toggle('is-open', opening);
      btn.setAttribute('aria-expanded', String(opening));
    });
  });

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const opening = !nav.classList.contains('is-mobile-open');
      nav.classList.toggle('is-mobile-open', opening);
      toggle.setAttribute('aria-expanded', String(opening));
      toggle.textContent = opening ? '×' : '☰';
    });
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.omos-site-header')) closeAll();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1120 && nav) {
      nav.classList.remove('is-mobile-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    }
  });
})();