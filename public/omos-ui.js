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

  const generatedPages = {
    '/workspace': `
      <section class="sp-hero"><span class="sp-eyebrow">Workspace • Decisions • History</span><h1>Your OMOS operating workspace.</h1><p class="sp-lead">Start a governed question, inspect the seven-stage run, review provider provenance, make the Human Gate disposition, and reopen prior Decision Records from one place.</p><div class="sp-actions"><a class="sp-btn sp-btn-primary" href="/ask/">New Ask OMOS Run</a><a class="sp-btn" href="/dashboard">Dashboard History</a><a class="sp-btn" href="/models">Model Connectors</a></div></section>
      <section class="sp-section"><div class="sp-grid"><article class="sp-card"><h2>Ask OMOS</h2><p>Questions, decisions, option comparisons, document reviews, and project problems enter through one governed intake.</p></article><article class="sp-card"><h2>Decision Records</h2><p>Preserve structured input, versions, hashes, alignment state, Council provenance, synthesis, human disposition, and revision history.</p></article><article class="sp-card"><h2>Dashboard History</h2><p>Reopen authorized records and inspect the reasoning trail instead of losing important decisions inside disconnected chat sessions.</p></article></div><div class="sp-callout">The Human Gate controls acceptance/rejection of the governed result. It does not automatically authorize financial, legal, credential, registry, infrastructure, or other consequential external actions.</div></section>`,
    '/council': `
      <section class="sp-hero"><span class="sp-eyebrow">Council • Multi-Model Review</span><h1>Four provider interfaces. One governed review process.</h1><p class="sp-lead">OMOS can route the same canonical input to OpenAI, Anthropic, Google Gemini, and xAI, compare independent outputs, run cross-review, preserve dissent, and synthesize a human-reviewed result.</p><div class="sp-actions"><a class="sp-btn sp-btn-primary" href="/ask/">Run Council</a><a class="sp-btn" href="/models">Connector Status</a><a class="sp-btn" href="/ohi-output-pipeline">See the Pipeline</a></div></section>
      <section class="sp-section"><div class="sp-grid"><article class="sp-card"><h2>Independent Outputs</h2><p>Providers reason independently before seeing one another's responses.</p></article><article class="sp-card"><h2>Cross-Review</h2><p>Each available provider can critique other outputs for contradictions, missing evidence, risks, and useful differences.</p></article><article class="sp-card"><h2>Governed Synthesis</h2><p>OMOS combines evidence status, agreement zones, supported dissent, uncertainty, alternatives, and recommendation conditions.</p></article></div><div class="sp-callout"><strong>Boundary:</strong> provider configuration is not a successful connection test, and model agreement is not factual verification. Live, Hybrid, Degraded, and Simulation modes must remain explicit.</div></section>`,
    '/ollm': `
      <section class="sp-hero"><span class="sp-eyebrow">OLLM • OneGodian LLM</span><h1>A first-class OneGodian intelligence provider inside OMOS.</h1><p class="sp-lead">OLLM is being developed as a governed multi-model intelligence product and OneGodian model/intelligence provider. OMOS remains the runtime, orchestration, persistence, audit, and Decision Record layer around it.</p><div class="sp-actions"><a class="sp-btn sp-btn-primary" href="/ohi">OHI Architecture</a><a class="sp-btn" href="/models">Model Gateway</a><a class="sp-btn" href="/developers">Developer Integration</a></div></section>
      <section class="sp-section"><div class="sp-grid"><article class="sp-card"><span class="sp-status warn">Development</span><h2>Provider Abstraction</h2><p>OLLM should participate through the same provider-neutral connector contract rather than bypassing OMOS governance.</p></article><article class="sp-card"><span class="sp-status warn">Development</span><h2>History & Metering</h2><p>Standalone OLLM production requires authentication, saved sessions, usage metering, entitlement controls, structured errors, logging, monitoring, and rollback procedures.</p></article><article class="sp-card"><span class="sp-status">Required</span><h2>Human Authority</h2><p>Raw model output is never authoritative merely because it was generated by OLLM or another provider.</p></article></div></section>`,
    '/developers': `
      <section class="sp-hero"><span class="sp-eyebrow">Developers • APIs • Connections</span><h1>Build against governed interfaces, not hidden provider assumptions.</h1><p class="sp-lead">OMOS developer surfaces expose runtime health, manifests, provider status, persistence status, governed Council runs, Decision Record history, and human disposition while keeping secrets server-side.</p><div class="sp-actions"><a class="sp-btn sp-btn-primary" href="/api/manifest">API Manifest</a><a class="sp-btn" href="/api/health">Health</a><a class="sp-btn" href="/api/v1/providers">Providers</a><a class="sp-btn" href="/api/v1/persistence">Persistence</a></div></section>
      <section class="sp-section"><div class="sp-grid sp-grid-2"><article class="sp-card"><h2>Model Gateway</h2><p>OpenAI, Anthropic, Gemini, xAI, and future providers should implement a normalized connector contract with explicit availability, provenance, errors, latency, and usage.</p></article><article class="sp-card"><h2>Data Connector Gateway</h2><p>GitHub, Drive, WordPress, Stripe, Supabase/PostgreSQL, QRV, and approved OneGodian APIs should retain source-of-record ownership, permissions, sync direction, timestamps, external IDs, provenance, conflict policy, and audit events.</p></article><article class="sp-card"><h2>WordPress Bridge</h2><p>Connected OneGodian sites consume OMOS capabilities as clients. They should not duplicate the central runtime.</p></article><article class="sp-card"><h2>ACC Execution Boundary</h2><p>ACC is the execution control plane for approved tasks/actions. OMOS produces governed reasoning and Decision Records; consequential execution remains separately authorized.</p></article></div><div class="sp-callout">Secrets must never be exposed in client-side JavaScript, public API payloads, logs, Decision Records, or source control.</div></section>`,
    '/pricing': `
      <section class="sp-hero"><span class="sp-eyebrow">Pricing • Capability-Gated</span><h1>Pay for clearer decisions, not abstract AI terminology.</h1><p class="sp-lead">OMOS pricing should map to concrete outcomes: distillation, decision reports, AI answer comparison, durable history, team governance, API usage, and implementation support. Checkout authority remains on OneGodian.com.</p><div class="sp-actions"><a class="sp-btn sp-btn-primary" href="/ask/">Try Ask OMOS</a><a class="sp-btn" href="/shop">Product Bridge</a><a class="sp-btn" href="/contact">Implementation Inquiry</a></div></section>
      <section class="sp-section"><div class="sp-grid"><article class="sp-card"><span class="sp-status">$0</span><h2>OMOS Free</h2><p>Entry-level governed analysis and product trial, subject to active runtime limits.</p></article><article class="sp-card"><span class="sp-status warn">Provisional</span><h2>Decision Report</h2><p>$9–$19 per run when the paid run, entitlement, and record-delivery path is activated.</p></article><article class="sp-card"><span class="sp-status warn">Provisional</span><h2>AI Answer Compare</h2><p>Target $9 per eligible multi-model comparison after live provider and metering gates pass.</p></article><article class="sp-card"><span class="sp-status warn">Provisional</span><h2>OMOS Personal</h2><p>Target $12/month for individual history and enhanced usage after entitlement activation.</p></article><article class="sp-card"><span class="sp-status warn">Provisional</span><h2>OMOS Pro</h2><p>Target $29/month for higher-value professional decision workflows once production capabilities are enabled.</p></article><article class="sp-card"><span class="sp-status warn">Provisional</span><h2>Team / Business</h2><p>Target $79/month Team and Business from $199/month, only after team controls, entitlements, audit, usage, and support are operational.</p></article></div><div class="sp-callout">Do not advertise unlimited Council use, team functionality, API access, durable history, exports, or provider availability unless the corresponding capability is enabled and tested in production.</div></section>`
  };

  function upgradeGeneratedPage() {
    const route = window.location.pathname.replace(/\/$/, '') || '/';
    const markup = generatedPages[route];
    if (!markup) return;
    const main = document.querySelector('.omos-global-content > main');
    if (!main) return;
    if (!document.querySelector('link[href="/section-page.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = '/section-page.css';
      document.head.appendChild(link);
    }
    main.className = 'section-page';
    main.removeAttribute('style');
    main.innerHTML = markup;
  }

  upgradeGeneratedPage();

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