const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const { OMOSProcess } = require("./src/runtime/omos");
const { runCouncil, getCouncilRun, listCouncilRuns, setHumanDecision, getPersistenceStatus } = require("./src/runtime/orchestrator");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();
const PORT = process.env.PORT || 3000;
const OMOS_VERSION = process.env.OMOS_VERSION || "1.1.0";
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || "https://omos.onegodian.com";
const STORE_URL = process.env.ONEGODIAN_STORE_URL || "https://onegodian.com";
const ORG_URL = process.env.ONEGODIAN_ORG_URL || "https://onegodian.org";
const APP_URL = process.env.ONEGODIAN_APP_URL || "https://app.onegodian.com";
const ACC_URL = process.env.ACC_APP_URL || "https://acc.onegodian.com";
const QUANTUM_OHI_URL = process.env.QUANTUMOHI_URL || process.env.QUANTUM_OHI_URL || "https://quantumohi.com";
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`).split(",").map((x) => x.trim()).filter(Boolean);

const publicRoutes = [
  "/","/omos","/workspace","/council","/ollm","/tools","/developers","/pricing",
  "/ohi","/models","/artifacts","/docs","/shop","/latest-news","/dashboard","/legal","/contact",
  "/protocol","/algorithm","/digital-sanctuary","/ohi-output-pipeline"
];

const staticPageRoutes = {
  "/status": "status-2026-09-10.html",
  "/omos-ref-0001": "omos-ref-0001.html",
  "/connections": "connections.html",
  "/engineering-council": "engineering-council.html",
  "/mcp": "mcp.html",
  "/council-provenance": "council-provenance.html",
  "/verification": "verification.html",
  "/tools/belief-mapper": "tools/belief-mapper.html",
  "/tools/declaration-generator": "tools/declaration-generator.html",
  "/tools/time-converter": "tools/time-converter.html",
  "/tools/protocol-explorer": "tools/protocol-explorer.html",
  "/tools/algorithm-visualizer": "tools/algorithm-visualizer.html",
  "/models/openai": "models/openai.html",
  "/models/anthropic": "models/anthropic.html",
  "/models/gemini": "models/gemini.html",
  "/models/xai": "models/xai.html",
  "/docs/protocol-spec": "docs/protocol-spec.html",
  "/docs/algorithm-spec": "docs/algorithm-spec.html",
  "/docs/system-prompt": "docs/system-prompt.html",
  "/docs/api-manifest": "docs/api-manifest.html",
  "/docs/compliance": "docs/compliance.html",
  "/docs/version-history": "docs/version-history.html",
  "/docs/sitemap": "docs/sitemap.html"
};

const pageMeta = {
  "/": ["OMOS — OneGodian Metaphysical Operating System","OMOS.OneGodian.com","OneGodian Metaphysical Operating System™","Operational intelligence, governed multi-model synthesis, runtime tools, and cross-site infrastructure for the OneGodian ecosystem.","home.html"],
  "/omos": ["OMOS Architecture","OMOS","OMOS","Start with the OMOS operating model, architecture, Algorithm, O-H-I, standards, and current maturity.","omos.html"],
  "/workspace": ["OMOS Workspace","Workspace","OMOS Workspace","Ask OMOS, inspect governed runs, review decisions, documents, records, and runtime history.","workspace.html"],
  "/council": ["OMOS Council","Council","OMOS Council","Independent model outputs, cross-model review, governed synthesis, human review, and Council results.","council.html"],
  "/ollm": ["OneGodian LLM","OLLM","OneGodian LLM","The OneGodian model/intelligence layer and planned first-class OMOS Model Gateway provider.","ollm.html"],
  "/tools": ["OMOS Tools","Tools","OMOS Tools","Layer 1, Alignment, verification, intelligence, identity reflection, time, and runtime utilities.","tools.html"],
  "/developers": ["OMOS Developer Hub","Developers","OMOS Developer Hub","APIs, connections, Engineering Council, MCP, standards, runtime status, and documentation.","developers.html"],
  "/pricing": ["OMOS Pricing","Pricing","OMOS Products & Services","Outcome-based, capability-gated OMOS plans and implementation services.","shop.html"],
  "/ohi": ["O-H-I — OneGodian Hyper-Conscious Intelligence","O-H-I","O-H-I Runtime and Synthesis Layer","Multi-model comparison, cross-review, governed synthesis, provenance and human-reviewed outputs.","ohi.html"],
  "/models": ["OMOS Model Connectors","Council of Models","Model Connectors Control Center","Provider configuration, model gateway readiness, persistence state and Council boundaries.","models.html"],
  "/artifacts": ["OMOS Artifacts","Artifacts","Artifacts, Source Documents, and Runtime Evidence","Whitepapers, prompts, manifests, animations, schemas, standards and implementation records.","artifacts.html"],
  "/docs": ["OMOS Documentation Center","Documentation","OMOS Documentation","Public-safe and developer documentation for the live Functional runtime.","docs.html"],
  "/shop": ["OMOS Products & Services","Shop","OMOS Products & Services","Customer outcomes, provisional launch pricing, capability boundaries and OneGodian.com checkout pathways.","shop.html"],
  "/latest-news": ["OMOS Build Notes","Updates","OMOS News, Releases, and Build Status","Track implementation milestones, runtime changes, Council updates and production evidence.","latest-news.html"],
  "/dashboard": ["OMOS Runtime Dashboard","Workspace","OMOS Runtime Dashboard","Runtime health, provider status, Council runs, manifests, and Decision Record history.","dashboard.html"],
  "/admin": ["OMOS Control Plane","Admin","OMOS Control Plane","Administrative execution and API management.","admin.html"],
  "/legal": ["OMOS Legal and Institutional Positioning","Compliance","Legal and Institutional Positioning","OMOS is a voluntary educational, identity-reflection, documentation, and runtime-support framework; civil law remains controlling.","legal.html"],
  "/contact": ["Contact OMOS","Contact","Contact and Ecosystem Links","Connect the runtime to the wider OneGodian ecosystem.","contact.html"],
  "/protocol": ["The OneGodian Protocol™","Protocol","The OneGodian Protocol™","Identity, semantic, agent, and interface guidance for OneGodian-controlled deployments and integrations.","protocol.html"],
  "/algorithm": ["The OneGodian Algorithm™","Algorithm","The OneGodian Algorithm™","Observe → Distill → Align → Select → Execute → Verify.","algorithm.html"],
  "/digital-sanctuary": ["The OneGodian Digital Sanctuary","Experience","The Digital Sanctuary Experience","Immersive, motion-led presentation of OneGodian identity and OMOS architecture.","digital-sanctuary.html"],
  "/ohi-output-pipeline": ["O-H-I Output Pipeline","Council","O-H-I Cross-Model Review Pipeline","Human Question → independent model outputs → cross-review → signals → human synthesis → governed output.","ohi-output-pipeline.html"]
};

const megaMenu = [
  { label: "OMOS", groups: [
    ["Start Here", [["What Is OMOS?","/omos"],["How OMOS Works","/algorithm"],["Platform Overview","/"],["Current Status","/status"]]],
    ["Foundation", [["OneGodian Protocol™","/protocol"],["OneGodian Algorithm™","/algorithm"],["O-H-I™","/ohi"],["Digital Sanctuary","/digital-sanctuary"]]],
    ["Architecture", [["OMOS Architecture","/omos"],["Connections","/connections"],["Reference Run","/omos-ref-0001"],["Decision Records","/dashboard"]]],
    ["O-H-I", [["Council of Models","/models"],["Council Provenance","/council-provenance"],["Output Pipeline","/ohi-output-pipeline"],["Verification Boundary","/verification"]]],
    ["Standards", [["Runtime Documentation","/docs"],["Engineering Council","/engineering-council"],["OneGodian MCP","/mcp"],["Runtime Health","/api/health"]]],
    ["About", [["Development History","/latest-news"],["Artifacts & Canon","/artifacts"],["Legal & Compliance","/legal"],["Contact","/contact"]]]
  ]},
  { label: "Workspace", groups: [
    ["Ask", [["Ask OMOS","/ask/"],["New Run","/ask/"],["Recent Runs","/dashboard"],["Workspace Home","/workspace"]]],
    ["Decisions", [["Decision Review","/ask/"],["Compare Options","/ask/"],["Human Review","/dashboard"],["Decision Records","/dashboard"]]],
    ["Documents", [["Document Review","/ask/"],["Artifacts","/artifacts"],["Saved Records","/dashboard"],["Documentation","/docs"]]],
    ["Projects", [["Project Analysis","/ask/"],["Project Runs","/dashboard"],["Build Notes","/latest-news"],["Implementation Help","/contact"]]],
    ["Records", [["Run History","/dashboard"],["Provider Provenance","/council-provenance"],["Verification State","/verification"],["Persistence Status","/api/v1/persistence"]]],
    ["Account", [["Dashboard","/dashboard"],["OneGodian App",APP_URL],["ACC",ACC_URL],["Pricing","/pricing"]]]
  ]},
  { label: "Council", groups: [
    ["AI Council", [["Council Overview","/council"],["Council Workspace","/ask/"],["Model Connectors","/models"],["Recent Runs","/dashboard"]]],
    ["Models", [["OpenAI / GPT-6 Astra","/models/openai"],["Anthropic Claude","/models/anthropic"],["Google Gemini","/models/gemini"],["xAI Grok","/models/xai"]]],
    ["Council Process", [["Independent Outputs","/ohi-output-pipeline"],["Cross-Model Review","/ohi-output-pipeline"],["Agreement Mapping","/council-provenance"],["Contradictions","/council-provenance"]]],
    ["Synthesis", [["Governed Synthesis","/ohi"],["GCD-Inspired Synthesis","/ohi"],["Supported Dissent","/council-provenance"],["Confidence & Limits","/verification"]]],
    ["Reviews", [["Human Review","/dashboard"],["Approval Gate","/dashboard"],["Verification Boundary","/verification"],["Council History","/dashboard"]]],
    ["Results", [["Decision Record","/dashboard"],["Run History","/dashboard"],["Provider Status","/api/v1/providers"],["Production Proof","/omos-ref-0001"]]]
  ]},
  { label: "OLLM", groups: [
    ["OneGodian LLM", [["OLLM Overview","/ollm"],["O-H-I Intelligence","/ohi"],["OMOS Integration","/omos"],["OLLM Application","https://llm.onegodian.org"]]],
    ["Runtime", [["Runtime Dashboard","/dashboard"],["Provider Status","/api/v1/providers"],["Persistence","/api/v1/persistence"],["Health","/api/health"]]],
    ["Model Gateway", [["OpenAI","/models/openai"],["Claude","/models/anthropic"],["Gemini","/models/gemini"],["Grok","/models/xai"]]],
    ["Knowledge", [["Documentation","/docs"],["Artifacts","/artifacts"],["Protocol","/protocol"],["Algorithm","/algorithm"]]],
    ["Evaluations", [["Alignment Engine","/tools"],["Layer 1 / Distill","/tools"],["Council Review","/council"],["Verification","/verification"]]],
    ["Developers", [["Developer Hub","/developers"],["API Manifest","/api/manifest"],["Connections","/connections"],["Contact","/contact"]]]
  ]},
  { label: "Tools", groups: [
    ["Layer 1", [["Ask OMOS","/ask/"],["Distillation","/tools"],["Signal Classification","/tools"],["Algorithm Visualizer","/tools/algorithm-visualizer"]]],
    ["Alignment", [["Alignment Engine","/tools"],["Algorithm","/algorithm"],["Decision Review","/ask/"],["Execution Readiness","/tools"]]],
    ["Identity", [["Belief Mapper","/tools/belief-mapper"],["Declaration Generator","/tools/declaration-generator"],["Digital Sanctuary","/digital-sanctuary"],["Protocol Explorer","/tools/protocol-explorer"]]],
    ["Time", [["OTS-V5 Converter","/tools/time-converter"],["OTS-V5 Documentation","/docs"],["System Time","/api/health"],["Version History","/docs/version-history"]]],
    ["Verification", [["Verification Boundary","/verification"],["Decision Records","/dashboard"],["Persistence","/api/v1/persistence"],["Compliance","/legal"]]],
    ["Intelligence", [["Council of Models","/models"],["Output Pipeline","/ohi-output-pipeline"],["Governed Synthesis","/ohi"],["All Tools","/tools"]]]
  ]},
  { label: "Developers", groups: [
    ["Developer Hub", [["Developers","/developers"],["Getting Started","/docs"],["Documentation","/docs"],["GitHub","https://github.com/ohi-stack/omos-site"]]],
    ["APIs", [["API Manifest","/api/manifest"],["Health API","/api/health"],["Provider API","/api/v1/providers"],["Persistence API","/api/v1/persistence"]]],
    ["Connections", [["Connection Layer","/connections"],["Model Connectors","/models"],["ACC",ACC_URL],["QuantumOHI",QUANTUM_OHI_URL]]],
    ["Engineering", [["Engineering Council","/engineering-council"],["Runtime Status","/status"],["Build Notes","/latest-news"],["Production Evidence","/omos-ref-0001"]]],
    ["Standards", [["OneGodian Protocol™","/docs/protocol-spec"],["OneGodian Algorithm™","/docs/algorithm-spec"],["OneGodian MCP","/mcp"],["Compliance","/docs/compliance"]]],
    ["Runtime", [["Runtime Dashboard","/dashboard"],["Manifest","/api/manifest"],["Providers","/api/v1/providers"],["History","/dashboard"]]]
  ]},
  { label: "Pricing", groups: [
    ["Free", [["Ask OMOS","/ask/"],["Tools","/tools"],["Documentation","/docs"],["Start Here","/omos"]]],
    ["Plans", [["OMOS Personal","/pricing"],["OMOS Pro","/pricing"],["OMOS Team","/pricing"],["OMOS Business","/pricing"]]],
    ["Pay Per Use", [["Decision Report","/pricing"],["AI Answer Compare","/pricing"],["Document Review","/pricing"],["Decision Review","/pricing"]]],
    ["Developers", [["OMOS API","/developers"],["API Manifest","/api/manifest"],["Connections","/connections"],["Contact","/contact"]]],
    ["Services", [["Implementation Services","/pricing"],["AI Workflow Design","/contact"],["Integration Planning","/contact"],["Contact Sales","/contact"]]],
    ["Shop", [["OMOS Shop","/shop"],["OneGodian.com",STORE_URL],["Products & Downloads","/shop"],["Product Docs","/docs"]]]
  ]}
];

function manifestPayload() {
  const persistence = getPersistenceStatus();
  return {
    id: "omos-site",
    name: "OMOS Runtime",
    fullName: "OMOS — OneGodian Metaphysical Operating System",
    version: OMOS_VERSION,
    status: "functional",
    environment: process.env.NODE_ENV || "development",
    canonicalHost: CANONICAL_HOST,
    ui: {
      designSystem: "OMOS UI v2.1 — Customer-First Operational Workspace",
      sharedHeader: true,
      sharedFooter: true,
      megaMenu: true,
      megaMenuColumns: 6,
      responsive: true,
      assets: ["/omos-ui.css","/mega-menu-v2.css","/omos-ui.js","/ask-workspace.js","/content-pages.css"]
    },
    navigation: megaMenu.map((item) => ({ label: item.label, groups: item.groups.map(([title]) => title) })),
    routes: {
      public: [...publicRoutes, ...Object.keys(staticPageRoutes), "/ask/"],
      api: ["/health","/manifest","/api/health","/api/manifest","/process","/api/v1/council/run","/api/v1/council/runs","/api/v1/council/runs/:id","/api/v1/council/runs/:id/human-decision","/api/v1/providers","/api/v1/persistence"]
    },
    endpoints: {
      health: { method: "GET", path: "/health", authRequired: false },
      manifest: { method: "GET", path: "/api/manifest", authRequired: false },
      process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
      councilRun: { method: "POST", path: "/api/v1/council/run", authRequired: true, authHeader: "x-omos-key" },
      councilRuns: { method: "GET", path: "/api/v1/council/runs", authRequired: true, authHeader: "x-omos-key" },
      councilRunRecord: { method: "GET", path: "/api/v1/council/runs/:id", authRequired: true, authHeader: "x-omos-key" },
      humanDecision: { method: "POST", path: "/api/v1/council/runs/:id/human-decision", authRequired: true, authHeader: "x-omos-key" },
      providers: { method: "GET", path: "/api/v1/providers", authRequired: false },
      persistence: { method: "GET", path: "/api/v1/persistence", authRequired: false }
    },
    orchestration: {
      modes: ["simulation","hybrid","live"],
      providers: ["openai","anthropic","gemini","xai"],
      stages: ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"],
      rounds: ["independent_outputs","cross_model_review","human_synthesis"],
      crossReviewMatrix: "4x4 excluding self-review",
      signals: ["agreement_zones","contradictions","missing_evidence","novel_insights","supported_dissent"],
      humanReviewRequired: true,
      modelAgreementIsNotFactualVerification: true,
      runRecord: true,
      runRecordStorage: persistence.backend,
      durableStorageStatus: persistence.durable ? "configured" : "memory_fallback_not_durable",
      persistence
    },
    wordpressPlugin: {
      compatibleHosts: ALLOWED_PLUGIN_ORIGINS,
      requiredEndpoints: ["/api/health","/api/manifest","/api/v1/providers"],
      shortcodes: ["[omos_manifest]","[omos_runtime_status]","[omos_bridge_builder]","[omos_tool_grid]","[omos_docs_grid]","[omos_ohi_pipeline]"],
      pluginTargets: ["OneGodian.com","OneGodian.org","QuantumOHI.com"]
    },
    commerceBridge: { primaryStore: STORE_URL, target: STORE_URL, authority: "stripe_payment_then_omos_entitlement" },
    appBridge: { target: APP_URL, acc: ACC_URL, recommendedWidgets: ["runtime_health","provider_status","recent_council_runs","run_record","verification_status"] },
    links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, acc: ACC_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
  };
}

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

function requireApiKey(req, res, next) {
  const meta = verifyApiKey(req.headers["x-omos-key"]);
  if (!meta) return res.status(401).json({ error: "unauthorized", message: "A valid x-omos-key header is required." });
  req.apiKeyMeta = meta;
  next();
}

function escapeHtml(value) {
  return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");
}

function megaHtml(item, index) {
  const groups = item.groups.map(([title, links]) => `<div class="omos-mega-group"><div class="omos-mega-title">${escapeHtml(title)}</div>${links.map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}</div>`).join("");
  return `<div class="omos-nav-item"><button class="omos-nav-button" aria-expanded="false" aria-controls="mega-${index}">${escapeHtml(item.label)} <span>⌄</span></button><div class="omos-mega" id="mega-${index}">${groups}</div></div>`;
}

function homeMegaHtml(item) {
  const groups = item.groups.map(([title, items]) => `<div class="home-mega-group"><span class="home-mega-title">${escapeHtml(title)}</span>${items.map(([label, href]) => `<a href="${escapeHtml(href)}">${escapeHtml(label)}<span aria-hidden="true">↗</span></a>`).join("")}</div>`).join("");
  return `<details class="nav-group"><summary>${escapeHtml(item.label)}</summary><div class="mega-panel mega-panel-v2"><div class="home-mega-grid">${groups}</div></div></details>`;
}

function applyHomeNavigation(html) {
  let out = String(html || "").replace(/<div class="nav-groups">[\s\S]*?<\/div>\s*<div class="nav-actions">/, `<div class="nav-groups">${megaMenu.map(homeMegaHtml).join("")}</div><div class="nav-actions">`);
  if (!out.includes("/mega-menu-v2.css")) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  return out;
}

function shellHeader() {
  return `<header class="omos-site-header"><div class="omos-header-inner"><a class="omos-brand" href="/"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>Operational Intelligence</small><strong>OMOS.OneGodian.com</strong></span></a><nav class="omos-nav" aria-label="Primary navigation">${megaMenu.map(megaHtml).join("")}</nav><div class="omos-header-actions"><a class="omos-btn" href="/api/health">Runtime</a><a class="omos-btn" href="/dashboard">Sign In</a><a class="omos-btn omos-btn-primary" href="/ask/">Ask OMOS</a><button class="omos-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button></div></div></header>`;
}

function shellFooter() {
  return `<footer class="omos-site-footer"><div class="omos-footer-inner"><div class="omos-footer-grid"><div class="omos-footer-brand"><div class="omos-brand"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>OneGodian</small><strong>OMOS Runtime</strong></span></div><p>Governed AI-assisted decision infrastructure, multi-model orchestration, documentation, and controlled execution interfaces. Functional components remain subject to documented maturity limits and human review.</p></div><div class="omos-footer-col"><h4>Workspace</h4><a href="/ask/">Ask OMOS</a><a href="/workspace">Workspace</a><a href="/dashboard">History</a><a href="/tools">Tools</a></div><div class="omos-footer-col"><h4>Council</h4><a href="/council">AI Council</a><a href="/models">Models</a><a href="/council-provenance">Provenance</a><a href="/ohi">O-H-I</a></div><div class="omos-footer-col"><h4>Developers</h4><a href="/developers">Developer Hub</a><a href="/connections">Connections</a><a href="/engineering-council">Engineering Council</a><a href="/api/manifest">Manifest</a></div><div class="omos-footer-col"><h4>Ecosystem</h4><a href="${ORG_URL}">OneGodian.org</a><a href="${STORE_URL}">OneGodian.com</a><a href="${ACC_URL}">ACC</a><a href="${QUANTUM_OHI_URL}">QuantumOHI.com</a></div></div><div class="omos-footer-bottom"><span>OMOS Runtime ${OMOS_VERSION} · Component maturity: Functional where implemented</span><span><a href="/status">Status</a> · <a href="/pricing">Pricing</a> · <a href="/legal">Legal</a> · <a href="/contact">Contact</a></span></div></div></footer>`;
}

function pageTopper(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  return `<div class="omos-page-topper"><div class="omos-breadcrumbs">OMOS / ${escapeHtml(meta[1])}</div><div class="omos-status-pill">Functional Runtime</div></div>`;
}

function applyGlobalShell(html, route) {
  let out = String(html || "");
  if (!/<html/i.test(out)) out = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${out}</body></html>`;
  if (!out.includes("/omos-ui.css")) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/omos-ui.css"><link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  else if (!out.includes("/mega-menu-v2.css")) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  out = out.replace(/<body([^>]*)>/i, `<body$1 class="omos-shell-active"><div class="omos-global-content">${shellHeader()}${pageTopper(route)}`);
  out = out.replace(/<\/body>/i, `${shellFooter()}</div><script src="/omos-ui.js" defer></script></body>`);
  return out;
}

function renderGeneratedPage(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const cards = [["Ask OMOS","Run a governed question through the OMOS workspace.","/ask/"],["Operational Workspace","Inspect runs, decisions, providers and history.","/dashboard"],["Documentation","Read the runtime, Algorithm, Protocol and integration documentation.","/docs"]].map(([t,d,h]) => `<a href="${h}" style="display:block;padding:24px;border:1px solid rgba(255,255,255,.09);border-radius:20px;text-decoration:none;background:rgba(255,255,255,.035)"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></a>`).join("");
  return applyGlobalShell(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(meta[0])}</title></head><body><main style="max-width:1100px;margin:0 auto;padding:72px 24px"><div style="color:#f0d98a;text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800">${escapeHtml(meta[1])}</div><h1>${escapeHtml(meta[2])}</h1><p style="max-width:850px;font-size:18px">${escapeHtml(meta[3])}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:34px">${cards}</div></main></body></html>`, route);
}

function sendPage(res, route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const filePath = meta[4] ? path.join(__dirname, "src/pages", meta[4]) : null;
  if (filePath && fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, "utf8");
    if (route === "/") return res.send(applyHomeNavigation(html));
    if (route === "/admin") return res.send(html);
    return res.send(applyGlobalShell(html, route));
  }
  return res.send(renderGeneratedPage(route));
}

function providerStatus() {
  const fallbackModels = {
    openai: process.env.OPENAI_ASTRA_MODEL || process.env.OPENAI_MODEL || "gpt-6-astra",
    anthropic: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    gemini: process.env.GEMINI_MODEL || "gemini-2.5-pro",
    xai: process.env.XAI_MODEL || "grok-4"
  };
  return ["openai","anthropic","gemini","xai"].map((name) => {
    try {
      const adapter = require(`./src/adapters/${name}`);
      const configured = Boolean(adapter.isConfigured());
      const capabilities = typeof adapter.capabilities === "function" ? adapter.capabilities() : null;
      return {
        provider: name,
        configured,
        status: configured ? "configured_not_connection_tested" : "simulation_only",
        model: capabilities?.model || fallbackModels[name],
        connectorId: capabilities?.connector || null,
        api: capabilities?.api || null,
        connectionTested: false,
        omosAuthorization: capabilities?.omosAuthorization || null
      };
    } catch (error) {
      return { provider: name, configured: false, status: "adapter_error", model: fallbackModels[name], connectionTested: false };
    }
  });
}

function healthPayload() {
  const manifest = manifestPayload();
  const providers = providerStatus();
  return {
    status: "ok",
    service: manifest.id,
    version: OMOS_VERSION,
    environment: manifest.environment,
    canonicalHost: CANONICAL_HOST,
    ui: manifest.ui,
    persistence: getPersistenceStatus(),
    publicRouteCount: manifest.routes.public.length,
    orchestration: {
      providers,
      liveProviderCount: providers.filter((p) => p.configured).length,
      crossModelReview: true,
      runRecordApi: true,
      humanDecisionApi: true,
      durablePersistence: getPersistenceStatus().durable,
      providerConfigurationIsNotConnectionTest: true
    }
  };
}

app.get(["/health","/api/health"], (req, res) => res.json(healthPayload()));
app.get(["/manifest","/api/manifest"], (req, res) => res.json({ ...manifestPayload(), providerStatus: providerStatus(), generatedAtUtc: new Date().toISOString() }));
app.get("/api/v1/providers", (req, res) => res.json({ status: "ok", providers: providerStatus(), note: "Configured means credentials are present; it is not a live connection-test result." }));
app.get("/api/v1/persistence", (req, res) => res.json({ status: "ok", persistence: getPersistenceStatus() }));

for (const route of publicRoutes) {
  app.get(route, (req, res) => sendPage(res, route));
  app.get(`${route}/`, (req, res) => sendPage(res, route));
}

for (const [route, file] of Object.entries(staticPageRoutes)) {
  const handler = (req, res) => res.sendFile(path.join(__dirname, "public", file));
  app.get(route, handler);
  app.get(`${route}/`, handler);
}

app.get("/admin", (req, res) => sendPage(res, "/admin"));

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: result });
});

app.post("/api/v1/council/run", requireApiKey, rateLimit(), async (req, res) => {
  try {
    const data = await runCouncil({
      prompt: req.body.prompt || req.body.input || req.body.question,
      context: req.body.context || {},
      providers: Array.isArray(req.body.providers) ? req.body.providers : undefined,
      mode: req.body.mode || "auto"
    });
    res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data });
  } catch (error) {
    const status = error.message === "prompt_required" || error.message === "provider_required" ? 400 : 500;
    res.status(status).json({ error: "council_run_failed", message: error.message });
  }
});

app.get("/api/v1/council/runs", requireApiKey, async (req, res) => {
  try {
    const data = await listCouncilRuns(req.query.limit);
    res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data, persistence: getPersistenceStatus() });
  } catch (error) {
    res.status(500).json({ error: "run_history_failed", message: error.message });
  }
});

app.get("/api/v1/council/runs/:id", requireApiKey, async (req, res) => {
  try {
    const record = await getCouncilRun(req.params.id);
    if (!record) return res.status(404).json({ error: "run_not_found", requestId: req.params.id });
    res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: record, persistence: getPersistenceStatus() });
  } catch (error) {
    res.status(500).json({ error: "run_read_failed", message: error.message });
  }
});

app.post("/api/v1/council/runs/:id/human-decision", requireApiKey, rateLimit(), async (req, res) => {
  try {
    const decision = String(req.body.decision || "").toUpperCase();
    if (!["APPROVED","REJECTED"].includes(decision)) return res.status(400).json({ error: "invalid_human_decision", message: "decision must be APPROVED or REJECTED" });
    const record = await setHumanDecision(req.params.id, decision, req.body.comment || "", req.apiKeyMeta.name);
    if (!record) return res.status(404).json({ error: "run_not_found", requestId: req.params.id });
    res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: record, persistence: getPersistenceStatus() });
  } catch (error) {
    res.status(500).json({ error: "human_decision_failed", message: error.message });
  }
});

app.use(express.static(path.join(__dirname, "public"), { redirect: false }));
app.use((req, res) => res.status(404).json({ error: "not_found", message: "Route not found in OMOS runtime manifest.", manifest: "/manifest" }));

app.listen(Number(PORT) || 3000, "0.0.0.0", () => console.log(`OMOS running on ${PORT} · persistence=${getPersistenceStatus().backend}`));
