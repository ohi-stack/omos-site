const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const { OMOSProcess } = require("./src/runtime/omos");
const { runCouncil, getCouncilRun, listCouncilRuns, setHumanDecision, getPersistenceStatus } = require("./src/runtime/orchestrator");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");
const { mapBeliefs } = require("./src/runtime/beliefMapper");

const app = express();
const PORT = process.env.PORT || 3000;
const OMOS_VERSION = process.env.OMOS_VERSION || "1.1.0";
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || "https://omos.onegodian.com";
const STORE_URL = process.env.ONEGODIAN_STORE_URL || "https://onegodian.com";
const ORG_URL = process.env.ONEGODIAN_ORG_URL || "https://onegodian.org";
const APP_URL = process.env.ONEGODIAN_APP_URL || "https://app.onegodian.com";
const QUANTUM_OHI_URL = process.env.QUANTUMOHI_URL || process.env.QUANTUM_OHI_URL || "https://quantumohi.com";
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`).split(",").map((x) => x.trim()).filter(Boolean);

const publicRoutes = [
  "/", "/omos", "/workspace", "/council", "/ollm", "/tools", "/developers", "/pricing",
  "/ohi", "/models", "/artifacts", "/docs", "/shop", "/latest-news", "/dashboard", "/legal", "/contact",
  "/protocol", "/algorithm", "/digital-sanctuary", "/ohi-output-pipeline",
  "/distill", "/alignment", "/decision-records", "/gcd-synthesis", "/council-provenance", "/verification",
  "/connections", "/engineering-council", "/mcp", "/reference-run", "/status", "/founder", "/standards",
  "/research", "/ecosystem", "/developers/agents"
];

const pageMeta = {
  "/": ["OMOS — OneGodian Metaphysical Operating System", "OMOS.OneGodian.com", "OneGodian Metaphysical Operating System™", "Make better decisions with AI through structured reasoning, comparison, verification boundaries, human authorization, and reviewable records.", "home.html"],
  "/omos": ["What Is OMOS?", "OMOS", "OMOS", "The operating model for governed reasoning, OHI synthesis, persistence, interfaces, and Decision Records.", "omos.html"],
  "/workspace": ["OMOS Workspace", "Workspace", "OMOS Workspace", "Ask OMOS, compare perspectives, review decisions, and reopen governed history.", "workspace.html"],
  "/council": ["OMOS Council", "Council", "OMOS Council", "Independent reasoning, structured disagreement, cross-model review, and governed synthesis.", "council.html"],
  "/ollm": ["OneGodian LLM", "OLLM", "OneGodian LLM", "The OneGodian model and multi-model application track inside the OMOS model architecture.", "ollm.html"],
  "/tools": ["OMOS Tools", "Tools", "OMOS Tools", "Distill, Alignment, Council, verification, Decision Records, identity, and runtime utilities.", "tools.html"],
  "/developers": ["OMOS Developer Hub", "Developers", "OMOS Developer Hub", "APIs, connections, MCP, Engineering Council, developer agents, standards, and runtime evidence.", "developers.html"],
  "/developers/agents": ["AI Developer Agents", "Developers", "AI Developer Agents", "Role-based engineering automation with separation of duties and human production authority.", "developer-agents.html"],
  "/pricing": ["OMOS Pricing", "Pricing", "OMOS Pricing", "Capability-gated plans and services for structured decisions, Council usage, business governance, and implementation.", "pricing.html"],
  "/ohi": ["OHI — OneGodian Hyper-Conscious Intelligence", "OHI", "OHI Runtime and Synthesis Layer", "Multi-model comparison, critique, disagreement preservation, GCD synthesis, and human-reviewed output.", "ohi.html"],
  "/models": ["OMOS Model Connectors", "Council", "Model Connectors", "Provider interfaces and connection state for OpenAI, Anthropic, Gemini, xAI, and future OMOS-compatible models.", "models.html"],
  "/artifacts": ["OMOS Artifacts", "Artifacts", "Artifacts, Source Documents, and Runtime Evidence", "Whitepapers, prompts, manifests, schemas, research, release records, and implementation evidence.", "artifacts.html"],
  "/docs": ["OMOS Documentation Center", "Documentation", "OMOS Documentation", "Customer, developer, standards, research, integration, and production-evidence documentation.", "docs.html"],
  "/shop": ["OMOS Product Bridge", "Shop", "Products and Downloads", "Commercial checkout remains on OneGodian.com while OMOS provides product context and entitlement boundaries.", "shop.html"],
  "/latest-news": ["OMOS Build Notes", "Updates", "OMOS News, Releases, and Build Status", "Implementation milestones, runtime changes, Council updates, and release status.", "latest-news.html"],
  "/dashboard": ["OMOS Runtime Dashboard", "Workspace", "OMOS Runtime Dashboard", "Runtime health, provider status, Council runs, manifests, Human Gate state, and Decision Record history.", "dashboard.html"],
  "/admin": ["OMOS Control Plane", "Admin", "OMOS Control Plane", "Administrative execution and API management.", "admin.html"],
  "/legal": ["OMOS Legal and Institutional Positioning", "Compliance", "Legal and Institutional Positioning", "Public-safe entity, authority, compliance, and professional-advice boundaries.", "legal.html"],
  "/contact": ["Contact OMOS", "Contact", "Contact and Ecosystem Links", "Connect with the OMOS and wider OneGodian ecosystem.", "contact.html"],
  "/protocol": ["The OneGodian Protocol™", "Protocol", "The OneGodian Protocol™", "Identity, semantic, alignment, agent-interaction, governance, verification, and interoperability guidance.", "protocol.html"],
  "/algorithm": ["The OneGodian Algorithm™", "Algorithm", "The OneGodian Algorithm™", "Observe → Distill → Align → Select → Execute → Verify.", "algorithm.html"],
  "/digital-sanctuary": ["The OneGodian Digital Sanctuary", "Experience", "The Digital Sanctuary Experience", "Immersive, motion-led presentation of OneGodian identity and OMOS architecture.", "digital-sanctuary.html"],
  "/ohi-output-pipeline": ["OHI Output Pipeline", "Council", "OHI Cross-Model Review Pipeline", "Independent model outputs → cross-review → signals → synthesis → human review.", "ohi-output-pipeline.html"],
  "/distill": ["OMOS Distill", "Workspace", "OMOS Distill — Layer 1", "Structured intake, Meaning Units, constraints, ambiguity, evidence cues, and instruction quarantine.", "distill.html"],
  "/alignment": ["Alignment Engine", "Workspace", "OMOS Alignment Engine", "Dimension-based decision-support signals and hard gates without treating a score as factual truth.", "alignment.html"],
  "/decision-records": ["Decision Records", "Workspace", "OMOS Decision Records", "Governed run history, Human Gate disposition, persistence, ownership, and revision lineage.", "decision-records.html"],
  "/gcd-synthesis": ["GCD Synthesis", "Council", "GCD Synthesis", "Repeated reduction for common ground while preserving material remainders and contradictions.", "gcd-synthesis.html"],
  "/council-provenance": ["Council Provenance", "Council", "Council Provenance", "Provider attribution, execution origin, hashes, simulation state, disputes, and correction discipline.", "council-provenance.html"],
  "/verification": ["Verification", "Council", "Evidence and Verification", "Separate factual evidence, uncertainty, and verification status from model agreement and confidence.", "verification.html"],
  "/connections": ["Connections", "Developers", "OMOS Connection & Adaptation Layer", "Provider-neutral model, data, action, and environment integrations.", "connections.html"],
  "/engineering-council": ["Engineering Council", "Developers", "OMOS Engineering Council", "Govern multi-agent software work from issue through deployment proof and Engineering Record.", "engineering-council.html"],
  "/mcp": ["OneGodian MCP", "Developers", "OneGodian MCP Architecture", "Interoperable resources and tools inside OMOS governance and ACC execution controls.", "mcp.html"],
  "/reference-run": ["OMOS-REF-0001", "Production Evidence", "OMOS-REF-0001", "The first governed browser-to-record production reference run and restart-survival proof.", "reference-run.html"],
  "/status": ["OMOS Platform Status", "Status", "OMOS Platform Status", "Distinguish implemented, staged, deployed, verified, and Production states.", "status.html"],
  "/founder": ["Founder & Origin", "About", "Founder & Origin", "Gregory Lamar Jones and the authorship/origin role behind the OneGodian framework and OMOS development.", "founder.html"],
  "/standards": ["OMOS Standards", "Standards", "OMOS Standards & Compliance", "Protocol, Algorithm, runtime, conformance, connection, provenance, MCP, and time standards.", "standards.html"],
  "/research": ["OMOS Research", "Research", "OMOS Research & Experimental Work", "Research, theoretical models, exploratory architecture, and source-classification boundaries.", "research.html"],
  "/ecosystem": ["OneGodian Ecosystem", "Architecture", "OneGodian Ecosystem Architecture", "How OMOS, ACC, commerce, public education, verification, learning, and enterprise systems remain distinct and connected.", "ecosystem.html"]
};

const megaMenu = [
  { label: "OMOS", groups: [
    ["Start Here", [["What Is OMOS?", "/omos"], ["How OMOS Works", "/workspace"], ["Ask OMOS", "/ask/"], ["Platform Status", "/status"]]],
    ["Foundation", [["OneGodian Protocol™", "/protocol"], ["OneGodian Algorithm™", "/algorithm"], ["OHI™", "/ohi"], ["Digital Sanctuary", "/digital-sanctuary"]]],
    ["Architecture", [["Runtime Architecture", "/omos"], ["Ecosystem Architecture", "/ecosystem"], ["Reference Run", "/reference-run"], ["Decision Records", "/decision-records"]]],
    ["OHI", [["Council of Models", "/council"], ["GCD Synthesis", "/gcd-synthesis"], ["Output Pipeline", "/ohi-output-pipeline"], ["Verification", "/verification"]]],
    ["Standards", [["Standards Hub", "/standards"], ["Runtime Specification", "/docs"], ["Compliance Test Suite", "/standards"], ["Runtime Health", "/api/health"]]],
    ["About", [["Founder & Origin", "/founder"], ["Development History", "/latest-news"], ["Research", "/research"], ["Legal & Compliance", "/legal"]]]
  ]},
  { label: "Workspace", groups: [
    ["Ask", [["Ask OMOS", "/ask/"], ["New Run", "/ask/"], ["Workspace Overview", "/workspace"], ["Recent Runs", "/dashboard"]]],
    ["Distill", [["OMOS Distill", "/distill"], ["Meaning Units", "/distill"], ["Constraints", "/distill"], ["Instruction Quarantine", "/distill"]]],
    ["Alignment", [["Alignment Engine", "/alignment"], ["Hard Gates", "/alignment"], ["Verification Boundary", "/verification"], ["Algorithm", "/algorithm"]]],
    ["Decisions", [["Decision Review", "/ask/"], ["Compare Options", "/ask/"], ["Decision Records", "/decision-records"], ["Human Review", "/decision-records"]]],
    ["Records", [["Run History", "/dashboard"], ["Provider Provenance", "/council-provenance"], ["Persistence Status", "/api/v1/persistence"], ["Reference Run", "/reference-run"]]],
    ["Account", [["Dashboard", "/dashboard"], ["Pricing", "/pricing"], ["App Console", APP_URL], ["Contact", "/contact"]]]
  ]},
  { label: "Council", groups: [
    ["AI Council", [["Council Overview", "/council"], ["Council Workspace", "/ask/"], ["Model Connectors", "/models"], ["Recent Runs", "/dashboard"]]],
    ["Models", [["OpenAI", "/models"], ["Anthropic Claude", "/models"], ["Google Gemini", "/models"], ["xAI Grok", "/models"]]],
    ["Council Process", [["Independent Outputs", "/ohi-output-pipeline"], ["Cross-Model Review", "/ohi-output-pipeline"], ["Contradictions", "/gcd-synthesis"], ["Missing Evidence", "/verification"]]],
    ["Synthesis", [["Governed Synthesis", "/ohi"], ["GCD Synthesis", "/gcd-synthesis"], ["Supported Dissent", "/gcd-synthesis"], ["Confidence & Limits", "/verification"]]],
    ["Integrity", [["Council Provenance", "/council-provenance"], ["Evidence Hierarchy", "/verification"], ["Human Gate", "/decision-records"], ["Maturity Status", "/status"]]],
    ["Results", [["Decision Record", "/decision-records"], ["Run History", "/dashboard"], ["Provider Status", "/api/v1/providers"], ["Production Evidence", "/reference-run"]]]
  ]},
  { label: "OLLM", groups: [
    ["OneGodian LLM", [["OLLM Overview", "/ollm"], ["OHI Intelligence", "/ohi"], ["OMOS Integration", "/omos"], ["Status", "/status"]]],
    ["Runtime", [["Runtime Dashboard", "/dashboard"], ["Provider Status", "/api/v1/providers"], ["Persistence", "/api/v1/persistence"], ["Health", "/api/health"]]],
    ["Model Gateway", [["Model Connectors", "/models"], ["Connection Layer", "/connections"], ["Council", "/council"], ["Provenance", "/council-provenance"]]],
    ["Knowledge", [["Documentation", "/docs"], ["Artifacts", "/artifacts"], ["Research", "/research"], ["Standards", "/standards"]]],
    ["Evaluations", [["Alignment Engine", "/alignment"], ["Layer 1 / Distill", "/distill"], ["Council Review", "/council"], ["Verification", "/verification"]]],
    ["Developers", [["Developer Hub", "/developers"], ["API Manifest", "/api/manifest"], ["MCP", "/mcp"], ["Contact", "/contact"]]]
  ]},
  { label: "Tools", groups: [
    ["Layer 1", [["OMOS Distill", "/distill"], ["Prompt Intake", "/ask/"], ["Meaning Units", "/distill"], ["Signal Classification", "/distill"]]],
    ["Alignment", [["Alignment Engine", "/alignment"], ["Hard Gates", "/alignment"], ["Decision Review", "/ask/"], ["Execution Readiness", "/alignment"]]],
    ["Identity", [["Belief Mapper", "/belief-mapper/"], ["Identity Tools", "/tools"], ["Declaration Tools", "/artifacts"], ["Digital Sanctuary", "/digital-sanctuary"]]],
    ["Verification", [["Verification", "/verification"], ["Decision Records", "/decision-records"], ["Persistence", "/api/v1/persistence"], ["Compliance", "/standards"]]],
    ["Intelligence", [["Council of Models", "/council"], ["GCD Synthesis", "/gcd-synthesis"], ["Output Pipeline", "/ohi-output-pipeline"], ["OHI", "/ohi"]]],
    ["All Tools", [["Tools Home", "/tools"], ["Documentation", "/docs"], ["Artifacts", "/artifacts"], ["Workspace", "/workspace"]]]
  ]},
  { label: "Developers", groups: [
    ["Developer Hub", [["Developers", "/developers"], ["Getting Started", "/docs"], ["Developer Agents", "/developers/agents"], ["GitHub", "https://github.com/ohi-stack/omos-site"]]],
    ["APIs", [["API Manifest", "/api/manifest"], ["Health API", "/api/health"], ["Provider API", "/api/v1/providers"], ["Persistence API", "/api/v1/persistence"]]],
    ["Connections", [["Model Connectors", "/models"], ["Connection Layer", "/connections"], ["MCP", "/mcp"], ["App Console", APP_URL]]],
    ["Engineering", [["Engineering Council", "/engineering-council"], ["Developer Agents", "/developers/agents"], ["Build Notes", "/latest-news"], ["Production Evidence", "/reference-run"]]],
    ["Standards", [["Standards Hub", "/standards"], ["OneGodian Protocol™", "/protocol"], ["OneGodian Algorithm™", "/algorithm"], ["Verification", "/verification"]]],
    ["Runtime", [["Runtime Dashboard", "/dashboard"], ["Platform Status", "/status"], ["Providers", "/api/v1/providers"], ["History", "/dashboard"]]]
  ]},
  { label: "Pricing", groups: [
    ["Free", [["Ask OMOS", "/ask/"], ["Tools", "/tools"], ["Documentation", "/docs"], ["Start Here", "/omos"]]],
    ["Individual", [["Decision Support", "/pricing"], ["AI Answer Compare", "/pricing"], ["Personal / Pro", "/pricing"], ["Capability Status", "/status"]]],
    ["Council", [["OMOS Council", "/pricing"], ["AI Council", "/council"], ["Multi-Model Review", "/models"], ["GCD Synthesis", "/gcd-synthesis"]]],
    ["Business", [["OMOS Business", "/pricing"], ["Decision Governance", "/pricing"], ["Developer Access", "/developers"], ["Contact Sales", "/contact"]]],
    ["Services", [["Decision Review", "/pricing"], ["Document Review", "/pricing"], ["Implementation Services", "/pricing"], ["Contact", "/contact"]]],
    ["Shop", [["OMOS Shop", "/shop"], ["OneGodian.com", STORE_URL], ["Products & Downloads", "/shop"], ["Commerce Boundary", "/pricing"]]]
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
      designSystem: "OMOS UI v2.2 — Consolidated Customer-First Operational Workspace",
      sharedHeader: true,
      sharedFooter: true,
      megaMenu: true,
      megaMenuColumns: 6,
      responsive: true,
      assets: ["/omos-ui.css", "/mega-menu-v2.css", "/omos-ui.js", "/ask-workspace.js"]
    },
    navigation: megaMenu.map((item) => ({ label: item.label, groups: item.groups.map(([title]) => title) })),
    routes: {
      public: [...publicRoutes, "/ask/", "/belief-mapper/"],
      api: ["/health", "/manifest", "/api/health", "/api/manifest", "/process", "/api/v1/council/run", "/api/v1/council/runs", "/api/v1/council/runs/:id", "/api/v1/council/runs/:id/human-decision", "/api/v1/providers", "/api/v1/persistence", "/api/v1/belief-mapper/evaluate"]
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
      persistence: { method: "GET", path: "/api/v1/persistence", authRequired: false },
      beliefMapperEvaluate: { method: "POST", path: "/api/v1/belief-mapper/evaluate", authRequired: true, authHeader: "x-omos-key", persistence: "none_ephemeral" }
    },
    orchestration: {
      modes: ["simulation", "hybrid", "live"],
      providers: ["openai", "anthropic", "gemini", "xai"],
      stages: ["ask", "layer1", "alignment", "council_review", "governed_synthesis", "human_gate", "decision_record"],
      rounds: ["independent_outputs", "cross_model_review", "human_synthesis"],
      crossReviewMatrix: "4x4 excluding self-review",
      signals: ["agreement_zones", "contradictions", "missing_evidence", "novel_insights"],
      humanReviewRequired: true,
      modelAgreementIsNotFactualVerification: true,
      runRecord: true,
      runRecordStorage: persistence.backend,
      durableStorageStatus: persistence.durable ? "configured" : "memory_fallback_not_durable",
      persistence
    },
    tools: {
      beliefMapper: { status: "functional_candidate", route: "/belief-mapper/", api: "/api/v1/belief-mapper/evaluate", persistence: "ephemeral_by_default", dimensions: 7 }
    },
    wordpressPlugin: {
      compatibleHosts: ALLOWED_PLUGIN_ORIGINS,
      requiredEndpoints: ["/api/health", "/api/manifest", "/api/v1/providers"],
      shortcodes: ["[omos_manifest]", "[omos_runtime_status]", "[omos_bridge_builder]", "[omos_tool_grid]", "[omos_docs_grid]", "[omos_ohi_pipeline]"],
      pluginTargets: ["OneGodian.com", "OneGodian.org", "QuantumOHI.com"]
    },
    commerceBridge: { primaryStore: STORE_URL, target: STORE_URL },
    appBridge: { target: APP_URL, recommendedWidgets: ["runtime_health", "provider_status", "recent_council_runs", "run_record", "verification_status"] },
    links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
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
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
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
  if (!out.includes('/mega-menu-v2.css')) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  return out;
}

function shellHeader() {
  return `<header class="omos-site-header"><div class="omos-header-inner"><a class="omos-brand" href="/"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>Operational Intelligence</small><strong>OMOS.OneGodian.com</strong></span></a><nav class="omos-nav" aria-label="Primary navigation">${megaMenu.map(megaHtml).join("")}</nav><div class="omos-header-actions"><a class="omos-btn" href="/status">Status</a><a class="omos-btn" href="/dashboard">Sign In</a><a class="omos-btn omos-btn-primary" href="/ask/">Ask OMOS</a><button class="omos-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button></div></div></header>`;
}

function shellFooter() {
  return `<footer class="omos-site-footer"><div class="omos-footer-inner"><div class="omos-footer-grid"><div class="omos-footer-brand"><div class="omos-brand"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>OneGodian</small><strong>OMOS Runtime</strong></span></div><p>Governed reasoning, multi-model comparison, verification boundaries, human authorization, documentation, and Decision Records. Capability maturity remains component-specific.</p></div><div class="omos-footer-col"><h4>Workspace</h4><a href="/ask/">Ask OMOS</a><a href="/distill">Distill</a><a href="/alignment">Alignment</a><a href="/decision-records">Decision Records</a></div><div class="omos-footer-col"><h4>Council</h4><a href="/council">AI Council</a><a href="/models">Model Connectors</a><a href="/gcd-synthesis">GCD Synthesis</a><a href="/verification">Verification</a></div><div class="omos-footer-col"><h4>Developers</h4><a href="/developers">Developer Hub</a><a href="/connections">Connections</a><a href="/engineering-council">Engineering Council</a><a href="/reference-run">Production Evidence</a></div><div class="omos-footer-col"><h4>Ecosystem</h4><a href="/ecosystem">Ecosystem Map</a><a href="${ORG_URL}">OneGodian.org</a><a href="${STORE_URL}">OneGodian.com</a><a href="${APP_URL}">App.OneGodian.com</a></div></div><div class="omos-footer-bottom"><span>OMOS Runtime ${OMOS_VERSION} · Functional where implemented; Production only where verified</span><span><a href="/status">Status</a> · <a href="/pricing">Pricing</a> · <a href="/legal">Legal</a> · <a href="/contact">Contact</a></span></div></div></footer>`;
}

function pageTopper(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  return `<div class="omos-page-topper"><div class="omos-breadcrumbs">OMOS / ${escapeHtml(meta[1])}</div><div class="omos-status-pill">Component Status: Functional where implemented</div></div>`;
}

function applyGlobalShell(html, route) {
  let out = String(html || "");
  if (!/<html/i.test(out)) out = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${out}</body></html>`;
  if (!/<meta[^>]+name=["']viewport["']/i.test(out)) out = out.replace(/<head([^>]*)>/i, '<head$1><meta name="viewport" content="width=device-width,initial-scale=1">');
  if (!out.includes('/omos-ui.css')) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/omos-ui.css"><link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  else if (!out.includes('/mega-menu-v2.css')) out = out.replace(/<\/head>/i, '<link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  out = out.replace(/<body([^>]*)>/i, `<body$1 class="omos-shell-active"><div class="omos-global-content">${shellHeader()}${pageTopper(route)}`);
  out = out.replace(/<\/body>/i, `${shellFooter()}</div><script src="/omos-ui.js" defer></script></body>`);
  return out;
}

function renderGeneratedPage(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const cards = [["Ask OMOS", "Run a governed question through the OMOS workspace.", "/ask/"], ["Operational Workspace", "Inspect runs, decisions, providers, and history.", "/dashboard"], ["Documentation", "Read runtime, Algorithm, Protocol, standards, and integration documentation.", "/docs"]].map(([t, d, h]) => `<a href="${h}" style="display:block;padding:24px;border:1px solid rgba(255,255,255,.09);border-radius:20px;text-decoration:none;background:rgba(255,255,255,.035)"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></a>`).join("");
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
  return ["openai", "anthropic", "gemini", "xai"].map((name) => {
    try {
      const adapter = require(`./src/adapters/${name}`);
      const configured = Boolean(adapter.isConfigured());
      return { provider: name, configured, status: configured ? "live_available" : "simulation_only" };
    } catch (error) {
      return { provider: name, configured: false, status: "adapter_error" };
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
      durablePersistence: getPersistenceStatus().durable
    },
    tools: manifest.tools
  };
}

app.get(["/health", "/api/health"], (req, res) => res.json(healthPayload()));
app.get(["/manifest", "/api/manifest"], (req, res) => res.json({ ...manifestPayload(), providerStatus: providerStatus(), generatedAtUtc: new Date().toISOString() }));
app.get("/api/v1/providers", (req, res) => res.json({ status: "ok", providers: providerStatus() }));
app.get("/api/v1/persistence", (req, res) => res.json({ status: "ok", persistence: getPersistenceStatus() }));
app.get("/belief-mapper", (req, res) => res.redirect(302, "/belief-mapper/"));

for (const route of publicRoutes) {
  app.get(route, (req, res) => sendPage(res, route));
  app.get(`${route}/`, (req, res) => sendPage(res, route));
}

app.get("/admin", (req, res) => sendPage(res, "/admin"));

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: result });
});

app.post("/api/v1/belief-mapper/evaluate", requireApiKey, rateLimit(), (req, res) => {
  const answers = req.body && req.body.answers && typeof req.body.answers === "object" ? req.body.answers : req.body;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return res.status(400).json({ error: "answers_required", message: "Provide an answers object for the seven Belief Mapper dimensions." });
  res.set("Cache-Control", "no-store");
  res.json({ status: "ok", persistence: "none_ephemeral", data: mapBeliefs({ answers }) });
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
    const decision = String(req.body.decision || '').toUpperCase();
    if (!["APPROVED", "REJECTED"].includes(decision)) return res.status(400).json({ error: "invalid_human_decision", message: "decision must be APPROVED or REJECTED" });
    const record = await setHumanDecision(req.params.id, decision, req.body.comment || '', req.apiKeyMeta.name);
    if (!record) return res.status(404).json({ error: "run_not_found", requestId: req.params.id });
    res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: record, persistence: getPersistenceStatus() });
  } catch (error) {
    res.status(500).json({ error: "human_decision_failed", message: error.message });
  }
});

app.use(express.static(path.join(__dirname, "public"), { redirect: false }));
app.use((req, res) => res.status(404).json({ error: "not_found", message: "Route not found in OMOS runtime manifest.", manifest: "/manifest" }));
app.listen(Number(PORT) || 3000, "0.0.0.0", () => console.log(`OMOS running on ${PORT} · persistence=${getPersistenceStatus().backend}`));
