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

  // Privacy-safe event bridge. Raw prompts, model outputs, Decision Records,
  // names, emails, and other user content must never be placed in event payloads.
  function track(eventName, properties = {}) {
    const payload = { route: window.location.pathname, ...properties };
    window.dispatchEvent(new CustomEvent('omos:analytics', { detail: { eventName, properties: payload } }));

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, payload);
    }
  }

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-omos-event]');
    if (!target) return;
    track(target.dataset.omosEvent, {
      destination: target.dataset.destination || undefined,
    });
  });

  track('omos_page_view');
  window.OMOSAnalytics = { track };
})();