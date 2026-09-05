(() => {
  const nav = document.querySelector('.omos-nav');
  const toggle = document.querySelector('.omos-menu-toggle');
  const items = [...document.querySelectorAll('.omos-nav-item')];

  // Official OMOS brand lockup. The global shell is server-rendered, so replace
  // the legacy letter-mark/text lockup at runtime without duplicating header
  // markup across every route.
  const brandStyle = document.createElement('style');
  brandStyle.textContent = `
    .omos-brand{min-width:0}
    .omos-brand-logo{display:block;width:210px;max-width:100%;height:auto;max-height:66px;object-fit:contain;object-position:left center;filter:drop-shadow(0 0 14px rgba(216,179,90,.13))}
    .omos-footer-brand .omos-brand-logo{width:250px;max-height:84px}
    @media(max-width:1280px){.omos-brand-logo{width:176px}.omos-footer-brand .omos-brand-logo{width:230px}}
    @media(max-width:680px){.omos-brand-logo{width:148px;max-height:52px}.omos-footer-brand .omos-brand-logo{width:220px;max-height:76px}}
  `;
  document.head.appendChild(brandStyle);

  document.querySelectorAll('.omos-brand').forEach((brand) => {
    const isLink = brand.tagName === 'A';
    brand.innerHTML = '<img class="omos-brand-logo" src="/omos-logo.svg" alt="OMOS — OneGodian Metaphysical Operating System">';
    brand.setAttribute('aria-label', 'OMOS — OneGodian Metaphysical Operating System');
    if (isLink) brand.setAttribute('title', 'OMOS — OneGodian Metaphysical Operating System');
  });

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