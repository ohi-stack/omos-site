const { SITE, NAV, tools, documents, pluginTargets } = require('../content/site-content');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function navHtml(activePath) {
  return NAV.map((item) => {
    const active = activePath === item.path ? ' active' : '';
    return `<a class="nav-link${active}" href="${item.path}">${escapeHtml(item.label)}</a>`;
  }).join('');
}

function pageCards(page) {
  const sections = page.sections || [];
  return sections.map((section) => `
    <article class="card">
      <div class="card-kicker">OMOS RECORD</div>
      <h2>${escapeHtml(section.heading)}</h2>
      <p>${escapeHtml(section.body)}</p>
    </article>
  `).join('');
}

function toolCards() {
  return tools.map((tool) => `
    <article class="card compact">
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
    <article class="card compact">
      <div class="status source">${escapeHtml(doc.type)}</div>
      <h3>${escapeHtml(doc.title)}</h3>
      <p>Status: ${escapeHtml(doc.status)}</p>
    </article>
  `).join('');
}

function pluginTargetCards() {
  return pluginTargets.map((target) => `
    <article class="card compact">
      <div class="status source">WordPress Target</div>
      <h3>${escapeHtml(target.site)}</h3>
      <p><strong>${escapeHtml(target.role)}</strong></p>
      <p>${escapeHtml(target.pluginUse)}</p>
      <code>${escapeHtml(target.restBaseUrl)}</code>
    </article>
  `).join('');
}

function renderPage(pathname, page) {
  const showTools = pathname === '/tools' || pathname === '/';
  const showDocs = pathname === '/docs' || pathname === '/';
  const showPluginTargets = pathname === '/plugin-bridge' || pathname === '/';

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(page.title)} | ${escapeHtml(SITE.shortName)}</title>
  <meta name="description" content="${escapeHtml(page.summary)}" />
  <style>
    :root{--bg:#07111f;--panel:#0d1b2a;--panel2:#11263a;--line:#42c6ff;--text:#eef6ff;--muted:#9fb8d1;--accent:#4fd1ff;--gold:#ffd76b;--green:#90ffcf;--red:#ff8a7a;--shadow:0 18px 50px rgba(0,0,0,.35);--radius:24px}*{box-sizing:border-box}body{margin:0;min-height:100vh;font-family:Inter,Segoe UI,Arial,sans-serif;color:var(--text);background:radial-gradient(circle at 20% 20%,rgba(79,209,255,.16),transparent 24%),radial-gradient(circle at 80% 15%,rgba(144,255,207,.12),transparent 22%),radial-gradient(circle at 50% 85%,rgba(255,215,107,.10),transparent 22%),linear-gradient(180deg,#06101b 0%,#07111f 45%,#091626 100%);overflow-x:hidden}a{color:inherit}.wrap{max-width:1220px;margin:0 auto;padding:24px}.topbar{display:flex;align-items:center;justify-content:space-between;gap:18px;position:sticky;top:0;z-index:10;background:rgba(7,17,31,.84);backdrop-filter:blur(18px);border-bottom:1px solid rgba(255,255,255,.08)}.brand{display:flex;align-items:center;gap:12px;font-weight:900;letter-spacing:.06em}.seal{width:36px;height:36px;border-radius:50%;background:radial-gradient(circle,#9beeff,#0b62a0 45%,#05101d 75%);box-shadow:0 0 30px rgba(79,209,255,.35)}.nav{display:flex;gap:8px;overflow-x:auto}.nav-link{padding:10px 13px;border:1px solid rgba(255,255,255,.08);border-radius:999px;text-decoration:none;color:#cfe6fb;font-size:13px;white-space:nowrap}.nav-link.active,.nav-link:hover{border-color:rgba(79,209,255,.65);background:rgba(79,209,255,.12);color:#fff}.hero{padding:88px 24px 42px}.hero-panel{border:1px solid rgba(255,255,255,.10);border-radius:34px;padding:48px;background:linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.022));box-shadow:var(--shadow);position:relative;overflow:hidden}.hero-panel:before{content:"";position:absolute;inset:-120px;background:radial-gradient(circle at 70% 20%,rgba(79,209,255,.22),transparent 26%),radial-gradient(circle at 20% 70%,rgba(255,215,107,.13),transparent 26%);pointer-events:none}.hero-content{position:relative;z-index:1}.eyebrow{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold);font-weight:800}h1{font-size:clamp(40px,7vw,76px);line-height:.98;margin:14px 0 18px;letter-spacing:-.055em}.summary{font-size:18px;line-height:1.65;color:#c8d9eb;max-width:880px}.actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}.btn{display:inline-flex;align-items:center;justify-content:center;padding:13px 18px;border-radius:14px;text-decoration:none;font-weight:800}.btn-primary{background:linear-gradient(135deg,var(--accent),#16a4ff);color:#04111f}.btn-secondary{border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:#fff}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;margin:26px 0}.card{border:1px solid rgba(255,255,255,.09);border-radius:var(--radius);background:linear-gradient(180deg,var(--panel),var(--panel2));padding:24px;box-shadow:0 12px 34px rgba(0,0,0,.24)}.card.compact{min-height:210px}.card-kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#9beeff;margin-bottom:8px}.card h2,.card h3{margin:0 0 10px}.card p{color:var(--muted);line-height:1.58}.card code,.code{display:block;margin-top:14px;padding:12px;border-radius:12px;border:1px solid rgba(79,209,255,.20);background:#06101a;color:#d8f7ff;overflow:auto}.status{display:inline-flex;margin-bottom:14px;padding:7px 10px;border-radius:999px;font-size:11px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;border:1px solid rgba(255,255,255,.11);color:#d8f7ff;background:rgba(79,209,255,.10)}.status.planned{color:#ffe2a6;background:rgba(255,215,107,.12)}.status.documentation-ready,.status.source{color:#a7f3d0;background:rgba(16,185,129,.12)}.text-link{display:inline-flex;margin-top:12px;color:#9beeff;text-decoration:none;font-weight:800}.section-title{margin:44px 0 18px}.section-title h2{font-size:clamp(26px,4vw,44px);margin:0}.footer{margin-top:48px;padding:34px 24px;color:#9fb8d1;border-top:1px solid rgba(255,255,255,.08)}@media(max-width:820px){.topbar{align-items:flex-start;flex-direction:column}.grid{grid-template-columns:1fr}.hero-panel{padding:30px}.hero{padding-top:42px}}
  </style>
</head>
<body>
  <header class="topbar wrap">
    <a class="brand" href="/"><span class="seal"></span><span>OMOS.OneGodian.com</span></a>
    <nav class="nav" aria-label="Primary navigation">${navHtml(pathname)}</nav>
  </header>

  <main>
    <section class="hero wrap">
      <div class="hero-panel">
        <div class="hero-content">
          <div class="eyebrow">${escapeHtml(page.eyebrow)}</div>
          <h1>${escapeHtml(page.title)}</h1>
          <p class="summary">${escapeHtml(page.summary)}</p>
          <div class="actions">
            <a class="btn btn-primary" href="${page.cta?.href || '/dashboard'}">${escapeHtml(page.cta?.label || 'Open Console')} →</a>
            <a class="btn btn-secondary" href="${page.secondaryCta?.href || SITE.appUrl}">Open OneGodian App</a>
          </div>
        </div>
      </div>
    </section>

    <section class="wrap grid">${pageCards(page)}</section>

    ${showTools ? `<section class="wrap"><div class="section-title"><div class="eyebrow">TOOLS</div><h2>OMOS Tool Registry</h2></div><div class="grid">${toolCards()}</div></section>` : ''}
    ${showDocs ? `<section class="wrap"><div class="section-title"><div class="eyebrow">DOCS</div><h2>Documentation Sources</h2></div><div class="grid">${documentCards()}</div></section>` : ''}
    ${showPluginTargets ? `<section class="wrap"><div class="section-title"><div class="eyebrow">PLUGIN DEPLOYMENT</div><h2>WordPress Plugin Targets</h2></div><div class="grid">${pluginTargetCards()}</div></section>` : ''}
  </main>

  <footer class="footer wrap">
    <strong>${escapeHtml(SITE.name)}</strong><br />
    ${escapeHtml(SITE.classification)}<br />
    Public-safe note: ONEGODIAN, LLC is the commercial/IP/software entity. Governance language belongs only where legally appropriate.
  </footer>
</body>
</html>`;
}

module.exports = { renderPage };
