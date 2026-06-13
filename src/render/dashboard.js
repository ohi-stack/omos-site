const { SITE, pages, tools, documents, pluginTargets, ecosystem } = require('../content/rich-content');

function renderDashboard() {
  const publicRoutes = Object.keys(pages);
  const stats = [
    { label: 'Node Runtime', value: 'Active', note: '/health and /manifest available' },
    { label: 'Public Pages', value: String(publicRoutes.length), note: 'Core OMOS content routes mapped' },
    { label: 'Tools', value: String(tools.length), note: 'Registry items prepared' },
    { label: 'Docs', value: String(documents.length), note: 'Source documents indexed' },
    { label: 'Plugin Targets', value: String(pluginTargets.length), note: 'OneGodian.com, OneGodian.org, QuantumOHI.com' },
    { label: 'Ecosystem Nodes', value: String(ecosystem.length), note: 'Mirrored in app.OneGodian.com' }
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OMOS Dashboard | ${SITE.name}</title>
  <style>
    :root{--bg:#07111f;--panel:#0d1b2a;--panel2:#11263a;--text:#eef6ff;--muted:#9fb8d1;--accent:#4fd1ff;--gold:#ffd76b;--green:#90ffcf;--radius:22px}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 20% 20%,rgba(79,209,255,.16),transparent 24%),linear-gradient(180deg,#06101b,#091626);color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif}.wrap{max-width:1240px;margin:0 auto;padding:26px}.top{display:flex;justify-content:space-between;gap:20px;align-items:center;border-bottom:1px solid rgba(255,255,255,.08);position:sticky;top:0;background:rgba(7,17,31,.86);backdrop-filter:blur(16px);z-index:10}a{color:inherit}.brand{font-weight:900;text-decoration:none}.btn{display:inline-flex;padding:12px 15px;border:1px solid rgba(255,255,255,.12);border-radius:999px;text-decoration:none;color:#d8f7ff}.hero{padding:52px 0 28px}h1{font-size:clamp(38px,6vw,68px);line-height:1;margin:0 0 14px;letter-spacing:-.05em}.muted{color:var(--muted);line-height:1.6;max-width:900px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.card{border:1px solid rgba(255,255,255,.09);border-radius:var(--radius);background:linear-gradient(180deg,var(--panel),var(--panel2));padding:22px;min-height:160px}.card .label{font-size:12px;color:var(--gold);letter-spacing:.16em;text-transform:uppercase}.card .value{font-size:34px;font-weight:900;margin:12px 0 8px}.card p{margin:0;color:var(--muted);line-height:1.5}.section{margin-top:38px}.section h2{font-size:clamp(26px,4vw,42px);letter-spacing:-.04em}.checklist,.route-grid{display:grid;gap:12px;margin-top:18px}.check,.route{border:1px solid rgba(255,255,255,.09);border-radius:16px;padding:14px;background:rgba(255,255,255,.035);color:#d8f7ff}.check span{color:var(--green);font-weight:900;margin-right:8px}.route{display:flex;align-items:center;justify-content:space-between;gap:12px}.route code,code{display:block;padding:10px;border-radius:12px;background:#06101a;color:#d8f7ff;border:1px solid rgba(79,209,255,.18);overflow:auto}.pill{display:inline-flex;padding:6px 10px;border-radius:999px;background:rgba(144,255,207,.10);border:1px solid rgba(144,255,207,.22);color:#c8ffe9;font-size:12px;font-weight:900}.targets{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.target{border:1px solid rgba(79,209,255,.14);border-radius:18px;padding:16px;background:rgba(79,209,255,.045)}.target h3{margin:8px 0}.target p{color:var(--muted);line-height:1.55}.target code{font-size:12px}@media(max-width:920px){.grid,.targets{grid-template-columns:1fr}.top{align-items:flex-start;flex-direction:column}.route{align-items:flex-start;flex-direction:column}}
  </style>
</head>
<body>
  <header class="top wrap">
    <a class="brand" href="/">OMOS.OneGodian.com</a>
    <nav><a class="btn" href="/">Public Site</a> <a class="btn" href="${SITE.appUrl}">Open App</a> <a class="btn" href="/manifest">Manifest</a></nav>
  </header>
  <main class="wrap">
    <section class="hero">
      <div class="muted">OMOS NODE CONTROL SURFACE</div>
      <h1>Runtime dashboard for OMOS content, tools, bridge targets, and production readiness.</h1>
      <p class="muted">This dashboard is public-safe. Protected administration should be handled through app.OneGodian.com or WordPress admin until authentication and role-based access controls are implemented on this Node runtime.</p>
    </section>
    <section class="grid">
      ${stats.map((stat) => `<article class="card"><div class="label">${stat.label}</div><div class="value">${stat.value}</div><p>${stat.note}</p></article>`).join('')}
    </section>
    <section class="section">
      <h2>Public Routes</h2>
      <div class="route-grid">
        ${publicRoutes.map((route) => `<div class="route"><code>${route}</code><span class="pill">Mapped</span></div>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>WordPress Plugin Targets</h2>
      <div class="targets">
        ${pluginTargets.map((target) => `<article class="target"><span class="pill">Bridge Target</span><h3>${target.site}</h3><p>${target.pluginUse}</p><code>${target.restBaseUrl}</code></article>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Production Checklist</h2>
      <div class="checklist">
        <div class="check"><span>✓</span> Node routes: /, /omos, /protocol, /algorithm, /ohi, /alignment-api, /tools, /docs, /plugin-bridge</div>
        <div class="check"><span>✓</span> API aliases: /api/health, /api/manifest, /api/tools, /api/stats</div>
        <div class="check"><span>✓</span> Plugin targets documented for OneGodian.com, OneGodian.org, and QuantumOHI.com</div>
        <div class="check"><span>□</span> Install/activate final OMOS plugin on WordPress targets</div>
        <div class="check"><span>□</span> Set production environment variables and bridge keys server-side</div>
        <div class="check"><span>□</span> Build, redeploy, and verify live routes after merge</div>
      </div>
    </section>
    <section class="section">
      <h2>Environment Variables</h2>
      <code>OMOS_PUBLIC_URL=https://omos.onegodian.com<br/>ONEGODIAN_APP_URL=https://app.onegodian.com<br/>ONEGODIAN_PUBLIC_URL=https://onegodian.org<br/>ONEGODIAN_COMMERCE_URL=https://onegodian.com<br/>QUANTUM_OHI_URL=https://quantumohi.com<br/>OMOS_API_KEYS=do-not-commit-real-keys</code>
    </section>
  </main>
</body>
</html>`;
}

module.exports = { renderDashboard };
