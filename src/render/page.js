const { SITE, NAV, footerLinks, ecosystem, tools, documents, pluginTargets } = require('../content/rich-content');
const { motionStyles, motionScript, renderMotionSections } = require('./motion-sections');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function navHtml(activePath) {
  const nav = [...NAV, { label: 'Motion', path: '/animations' }];
  return nav.map((item) => {
    const active = activePath === item.path ? ' active' : '';
    return `<a class="nav-link${active}" href="${item.path}">${escapeHtml(item.label)}</a>`;
  }).join('');
}

function footerHtml() {
  return footerLinks.map((item) => `<a href="${item.path}">${escapeHtml(item.label)}</a>`).join('');
}

function sectionCards(page) {
  return (page.sections || []).map((section) => `
    <article class="card section-card reveal-card">
      <div class="card-kicker">OMOS RECORD</div>
      <h2>${escapeHtml(section.title || section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
    </article>
  `).join('');
}

function featureCards(page) {
  if (!page.featureCards) return '';
  return `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">CORE PATHWAYS</div><h2>Open the system layer you need.</h2></div><div class="grid cards">${page.featureCards.map((card) => `
    <article class="card feature-card reveal-card" data-tilt>
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.body)}</p>
      <a class="text-link" href="${card.href}">${escapeHtml(card.link)} →</a>
    </article>`).join('')}</div></section>`;
}

function heroStats(page) {
  if (!page.heroStats) return '';
  return `<div class="stat-row">${page.heroStats.map((stat) => `
    <div class="stat"><strong>${escapeHtml(stat.value)}</strong><span>${escapeHtml(stat.label)}</span><small>${escapeHtml(stat.detail)}</small></div>`).join('')}</div>`;
}

function bulletList(page) {
  if (!page.bullets) return '';
  return `<section class="wrap section-block"><div class="list-panel">${page.bullets.map((item) => `<div><span>✓</span>${escapeHtml(item)}</div>`).join('')}</div></section>`;
}

function processFlow(page) {
  if (!page.process) return '';
  return `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">RUNTIME FLOW</div><h2>Six-phase operating sequence.</h2></div><div class="process-flow">${page.process.map((step, index) => `
    <div class="process-step"><strong>${String(index + 1).padStart(2, '0')}</strong><span>${escapeHtml(step)}</span></div>`).join('')}</div></section>`;
}

function toolCards() {
  return tools.map((tool) => `
    <article class="card compact reveal-card" data-tilt>
      <div class="status ${tool.status}">${escapeHtml(tool.status)}</div>
      <h3>${escapeHtml(tool.title)}</h3>
      <p>${escapeHtml(tool.description)}</p>
      ${tool.shortcode ? `<code>${escapeHtml(tool.shortcode)}</code>` : ''}
      <a class="text-link" href="${tool.path}">View tool →</a>
    </article>
  `).join('');
}

function documentCards() {
  return documents.map((doc) => `
    <article class="card compact reveal-card">
      <div class="status source">${escapeHtml(doc.type)}</div>
      <h3>${escapeHtml(doc.title)}</h3>
      <p>Status: ${escapeHtml(doc.status)}</p>
    </article>
  `).join('');
}

function pluginTargetCards() {
  return pluginTargets.map((target) => `
    <article class="card compact reveal-card">
      <div class="status source">WordPress Target</div>
      <h3>${escapeHtml(target.site)}</h3>
      <p><strong>${escapeHtml(target.role)}</strong></p>
      <p>${escapeHtml(target.pluginUse)}</p>
      <code>${escapeHtml(target.restBaseUrl)}</code>
    </article>
  `).join('');
}

function ecosystemCards() {
  return ecosystem.map((item) => `
    <article class="ecosystem-card reveal-card" data-tilt>
      <div>${escapeHtml(item.role)}</div>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.purpose)}</p>
      <a href="${item.url}">Open ${escapeHtml(item.name)} →</a>
    </article>
  `).join('');
}

function renderPage(pathname, page) {
  const showTools = pathname === '/tools' || pathname === '/';
  const showDocs = pathname === '/docs' || pathname === '/';
  const showPluginTargets = pathname === '/plugin-bridge' || pathname === '/';
  const showEcosystem = pathname === '/' || pathname === '/omos';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)} | ${escapeHtml(SITE.fullName)}</title>
  <meta name="description" content="${escapeHtml(page.summary)}" />
  <style>
    :root{--bg:#07111f;--panel:#0d1b2a;--panel2:#11263a;--line:#42c6ff;--text:#eef6ff;--muted:#9fb8d1;--accent:#4fd1ff;--gold:#ffd76b;--green:#90ffcf;--purple:#9b7dff;--shadow:0 18px 50px rgba(0,0,0,.35);--radius:26px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;min-height:100vh;font-family:Inter,Segoe UI,Arial,sans-serif;color:var(--text);background:radial-gradient(circle at 20% 20%,rgba(79,209,255,.14),transparent 24%),radial-gradient(circle at 82% 8%,rgba(155,125,255,.12),transparent 24%),linear-gradient(180deg,#06101b 0%,#07111f 45%,#091626 100%);overflow-x:hidden}body:before{content:"";position:fixed;inset:0;pointer-events:none;background-image:linear-gradient(rgba(79,209,255,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(79,209,255,.035) 1px,transparent 1px);background-size:64px 64px;mask-image:radial-gradient(circle at center,black 0%,transparent 78%);opacity:.45}a{color:inherit}.wrap{max-width:1220px;margin:0 auto;padding:24px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;position:sticky;top:0;z-index:10;background:rgba(7,17,31,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:12px;font-weight:950;letter-spacing:.06em;text-decoration:none}.seal{width:38px;height:38px;border-radius:50%;background:radial-gradient(circle,#fff,#9beeff 28%,#0b62a0 55%,#05101d 78%);box-shadow:0 0 30px rgba(79,209,255,.35)}.nav{display:flex;gap:8px;overflow-x:auto;max-width:850px}.nav-link{padding:10px 13px;border:1px solid rgba(255,255,255,.08);border-radius:999px;text-decoration:none;color:#cfe6fb;font-size:13px;white-space:nowrap}.nav-link.active,.nav-link:hover{border-color:rgba(79,209,255,.65);background:rgba(79,209,255,.12);color:#fff}.hero{padding:74px 24px 36px}.hero-panel{border:1px solid rgba(255,255,255,.10);border-radius:36px;padding:54px;background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025));box-shadow:var(--shadow);position:relative;overflow:hidden}.hero-panel:before{content:"";position:absolute;inset:-160px;background:radial-gradient(circle at 70% 20%,rgba(79,209,255,.26),transparent 27%),radial-gradient(circle at 20% 70%,rgba(255,215,107,.13),transparent 26%),radial-gradient(circle at 45% 45%,rgba(155,125,255,.16),transparent 28%);pointer-events:none}.hero-content{position:relative;z-index:1}.eyebrow{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-weight:900}.tm{color:#9beeff}h1{font-size:clamp(48px,8vw,92px);line-height:.92;margin:16px 0 20px;letter-spacing:-.065em}.summary{font-size:clamp(18px,2.3vw,25px);line-height:1.55;color:#d8e6f6;max-width:920px}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 18px;border-radius:15px;text-decoration:none;font-weight:850}.btn-primary{background:linear-gradient(135deg,var(--accent),#16a4ff);color:#04111f}.btn-secondary{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff}.stat-row{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:36px}.stat{border:1px solid rgba(255,255,255,.10);border-radius:18px;padding:18px;background:rgba(255,255,255,.045)}.stat strong{display:block;font-size:38px;line-height:1}.stat span{display:block;font-weight:900;margin:8px 0 4px}.stat small{color:var(--muted)}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:22px 0}.cards{grid-template-columns:repeat(4,minmax(0,1fr))}.card{border:1px solid rgba(255,255,255,.09);border-radius:var(--radius);background:linear-gradient(180deg,var(--panel),var(--panel2));padding:28px;box-shadow:0 12px 34px rgba(0,0,0,.24)}.card.compact{min-height:230px}.feature-card{min-height:260px}.card-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9beeff;margin-bottom:8px}.card h2,.card h3{margin:0 0 12px;font-size:clamp(24px,3vw,36px);letter-spacing:-.03em}.card h3{font-size:26px}.card p{color:var(--muted);line-height:1.65;font-size:16px}.card code,.code{display:block;margin-top:14px;padding:12px;border-radius:12px;border:1px solid rgba(79,209,255,.20);background:#06101a;color:#d8f7ff;overflow:auto}.status{display:inline-flex;margin-bottom:14px;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;border:1px solid rgba(255,255,255,.11);color:#d8f7ff;background:rgba(79,209,255,.10)}.status.planned{color:#ffe2a6;background:rgba(255,215,107,.12)}.status.documentation-ready,.status.source{color:#a7f3d0;background:rgba(16,185,129,.12)}.text-link{display:inline-flex;margin-top:14px;color:#9beeff;text-decoration:none;font-weight:900}.section-block{margin-top:32px}.section-head{margin:48px 0 18px}.section-head h2{font-size:clamp(30px,5vw,52px);line-height:1;margin:8px 0 0;letter-spacing:-.05em}.list-panel{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;border:1px solid rgba(255,255,255,.08);border-radius:24px;background:rgba(255,255,255,.035);padding:18px}.list-panel div{padding:14px;border-radius:16px;background:rgba(255,255,255,.035);color:#d8f7ff}.list-panel span{color:var(--green);font-weight:900;margin-right:8px}.process-flow{display:grid;grid-template-columns:repeat(6,1fr);gap:12px}.process-step{border:1px solid rgba(79,209,255,.20);border-radius:20px;padding:18px;background:rgba(79,209,255,.07)}.process-step strong{display:block;color:var(--gold);margin-bottom:8px}.process-step span{font-weight:900}.ecosystem-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.ecosystem-card{border:1px solid rgba(255,255,255,.08);border-radius:22px;padding:22px;background:rgba(255,255,255,.035)}.ecosystem-card div{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:var(--gold);font-weight:900}.ecosystem-card h3{margin:10px 0;font-size:24px}.ecosystem-card p{color:var(--muted);line-height:1.58}.ecosystem-card a{color:#9beeff;text-decoration:none;font-weight:900}.footer{margin-top:54px;padding:34px 24px;color:#9fb8d1;border-top:1px solid rgba(255,255,255,.08)}.footer-links{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0}.footer-links a{padding:8px 10px;border:1px solid rgba(255,255,255,.08);border-radius:999px;text-decoration:none}.reveal-card{animation:revealUp .9s ease both;animation-timeline:view();animation-range:entry 0% cover 28%}@keyframes revealUp{from{opacity:.18;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}${motionStyles()}@media(max-width:1020px){.cards,.ecosystem-grid,.process-flow{grid-template-columns:repeat(2,1fr)}.stat-row,.list-panel{grid-template-columns:1fr}}@media(max-width:760px){.topbar{align-items:flex-start;flex-direction:column}.grid,.cards,.ecosystem-grid,.process-flow{grid-template-columns:1fr}.hero-panel{padding:32px}.hero{padding-top:34px}.nav{width:100%}.summary{font-size:20px}.card{padding:24px}}
  </style>
</head>
<body>
  <header class="topbar wrap">
    <a class="brand" href="/"><span class="seal"></span><span>OMOS<span class="tm">™</span></span></a>
    <nav class="nav" aria-label="Primary navigation">${navHtml(pathname)}</nav>
  </header>

  <main>
    <section class="hero wrap">
      <div class="hero-panel">
        <div class="motion-canvas"><span class="orb one"></span><span class="orb two"></span><span class="orb three"></span></div>
        <div class="hero-content">
          <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
          <h1>${escapeHtml(page.title)}</h1>
          <p class="summary">${escapeHtml(page.summary)}</p>
          <div class="actions">
            <a class="btn btn-primary" href="${page.cta?.href || '/dashboard'}">${escapeHtml(page.cta?.label || 'Open Dashboard')} →</a>
            <a class="btn btn-secondary" href="${page.secondaryCta?.href || SITE.appUrl}">${escapeHtml(page.secondaryCta?.label || 'Open OneGodian App')}</a>
          </div>
          ${heroStats(page)}
        </div>
      </div>
    </section>

    <section class="wrap grid">${sectionCards(page)}</section>
    ${featureCards(page)}
    ${bulletList(page)}
    ${processFlow(page)}
    ${renderMotionSections(pathname)}

    ${showEcosystem ? `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">ECOSYSTEM MAP</div><h2>Where OMOS fits in the OneGodian stack.</h2></div><div class="ecosystem-grid">${ecosystemCards()}</div></section>` : ''}
    ${showTools ? `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">TOOLS</div><h2>OMOS Tool Registry</h2></div><div class="grid">${toolCards()}</div></section>` : ''}
    ${showDocs ? `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">DOCS</div><h2>Documentation Sources</h2></div><div class="grid">${documentCards()}</div></section>` : ''}
    ${showPluginTargets ? `<section class="wrap section-block"><div class="section-head"><div class="eyebrow">PLUGIN DEPLOYMENT</div><h2>WordPress Plugin Targets</h2></div><div class="grid">${pluginTargetCards()}</div></section>` : ''}
  </main>

  <footer class="footer wrap">
    <strong>${escapeHtml(SITE.fullName)}</strong><br />
    ${escapeHtml(SITE.tagline)}
    <div class="footer-links">${footerHtml()}</div>
    Public-safe note: ONEGODIAN, LLC is the commercial/IP/software entity. Governance language belongs only where legally appropriate.
  </footer>
  ${motionScript()}
</body>
</html>`;
}

module.exports = { renderPage };
