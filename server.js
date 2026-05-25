const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const { OMOSProcess } = require("./src/runtime/omos");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();

const PORT = process.env.PORT || 3000;
const OMOS_VERSION = process.env.OMOS_VERSION || "0.3.0";
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || "https://omos.onegodian.com";
const STORE_URL = process.env.ONEGODIAN_STORE_URL || "https://onegodian.com";
const ORG_URL = process.env.ONEGODIAN_ORG_URL || "https://onegodian.org";
const APP_URL = process.env.ONEGODIAN_APP_URL || "https://app.onegodian.com";
const QUANTUM_OHI_URL = process.env.QUANTUM_OHI_URL || "https://quantumohi.com";
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const publicRoutes = [
  "/",
  "/omos",
  "/ohi",
  "/models",
  "/tools",
  "/artifacts",
  "/docs",
  "/shop",
  "/latest-news",
  "/dashboard",
  "/legal",
  "/contact",
  "/protocol",
  "/algorithm",
  "/digital-sanctuary"
];

const pageMeta = {
  "/": {
    file: "home.html",
    title: "OMOS — OneGodian Metaphysical Operating System",
    eyebrow: "OMOS.OneGodian.com",
    heading: "OneGodian Metaphysical Operating System™",
    summary: "The Node runtime and protocol site for OMOS content, documentation, runtime tools, and cross-site integration across the OneGodian ecosystem.",
    cards: ["Runtime manifest", "Protocol documentation", "Plugin synchronization", "App command-center bridge"]
  },
  "/omos": {
    file: "omos.html",
    title: "OMOS Architecture",
    eyebrow: "Operating Layer",
    heading: "OMOS Architecture",
    summary: "The orchestration, routing, documentation, and runtime layer connecting OneGodian identity, OHI synthesis, tools, pages, and integrations.",
    cards: ["Root identity layer", "Operating layer", "Protocol + Algorithm", "Commercial separation"]
  },
  "/ohi": {
    file: "ohi.html",
    title: "OHI — OneGodian Hyper-Conscious Intelligence",
    eyebrow: "Intelligence Layer",
    heading: "OHI Runtime and Synthesis Layer",
    summary: "OHI organizes multi-model synthesis, GCD-style distillation, and governed outputs for OneGodian-aligned documentation and runtime experiences.",
    cards: ["Council of models", "Signal extraction", "GCD synthesis", "Highest-coherence output"]
  },
  "/models": {
    file: "models.html",
    title: "OMOS Model Layer",
    eyebrow: "Model Council",
    heading: "Multi-Model Reasoning and Comparison",
    summary: "A structured content area for ChatGPT, Claude, Gemini, Grok, OHI synthesis notes, and model-output governance.",
    cards: ["ChatGPT", "Claude", "Gemini", "Grok", "OHI synthesis"]
  },
  "/tools": {
    file: "tools.html",
    title: "OMOS Tools",
    eyebrow: "Execution Tools",
    heading: "OMOS Tools and Runtime Utilities",
    summary: "Tool pages for the Belief Mapper, Bridge Builder, Declaration Generator, runtime processing, and future protocol utilities.",
    cards: ["Belief Mapper", "Bridge Builder", "Declaration Generator", "Runtime processor"]
  },
  "/artifacts": {
    file: "artifacts.html",
    title: "OMOS Artifacts",
    eyebrow: "Documentation Artifacts",
    heading: "OMOS Artifacts and Source Materials",
    summary: "A publication layer for whitepapers, source PDFs, WXR files, animation assets, diagrams, manifests, and institutional documents.",
    cards: ["Whitepapers", "WXR imports", "Animation assets", "Protocol files"]
  },
  "/docs": {
    file: "docs.html",
    title: "OMOS Docs",
    eyebrow: "Documentation",
    heading: "OMOS Documentation Center",
    summary: "Developer, institutional, legal, runtime, and public documentation for OMOS and related OneGodian systems.",
    cards: ["Protocol", "Algorithm", "Runtime", "Deployment", "Compliance"]
  },
  "/shop": {
    file: "shop.html",
    title: "OMOS Shop Bridge",
    eyebrow: "Commerce Bridge",
    heading: "OMOS Products and Downloads",
    summary: "Commercial product paths remain on OneGodian.com. OMOS routes provide explanation, documentation, and bridge links into WooCommerce products.",
    cards: ["Prompt packs", "PDF guides", "Developer kits", "Membership paths"]
  },
  "/latest-news": {
    file: "latest-news.html",
    title: "OMOS Latest News",
    eyebrow: "Updates",
    heading: "OMOS News and Build Notes",
    summary: "Release notes, Council updates, implementation status, route changes, product drops, and runtime milestones.",
    cards: ["Build notes", "Release status", "Council updates", "Product launches"]
  },
  "/dashboard": {
    file: "dashboard.html",
    title: "OMOS Dashboard",
    eyebrow: "Runtime Dashboard",
    heading: "OMOS Runtime Dashboard",
    summary: "Dashboard entry point for manifest status, health checks, process testing, route inventory, and app.OneGodian.com console handoff.",
    cards: ["Health", "Manifest", "Process", "Open App Console"]
  },
  "/admin": {
    title: "OMOS Admin Handoff",
    eyebrow: "Admin",
    heading: "OMOS Admin Handoff",
    summary: "Administrative execution belongs in app.OneGodian.com and authenticated WordPress dashboards. This public route provides safe handoff only.",
    cards: ["App console", "WordPress plugin", "Deployment notes", "Runtime logs"]
  },
  "/legal": {
    file: "legal.html",
    title: "OMOS Legal Positioning",
    eyebrow: "Compliance",
    heading: "Legal and Institutional Positioning",
    summary: "OMOS is presented as a voluntary educational, identity-reflection, documentation, and runtime-support framework. Civil/Gregorian records remain legally controlling.",
    cards: ["Voluntary use", "No public authority claims", "No financial guarantees", "Commercial/IP separation"]
  },
  "/contact": {
    file: "contact.html",
    title: "Contact OMOS",
    eyebrow: "Contact",
    heading: "Contact and Ecosystem Links",
    summary: "Connect OMOS runtime, documentation, products, app console, and OneGodian public properties.",
    cards: ["OneGodian.org", "OneGodian.com", "QuantumOHI.com", "app.OneGodian.com"]
  },
  "/protocol": {
    file: "protocol.html",
    title: "The OneGodian Protocol™",
    eyebrow: "Protocol",
    heading: "The OneGodian Protocol™",
    summary: "An optional identity, semantic, and alignment framework for human identity expression, AI interaction, digital communication, and interface systems.",
    cards: ["Human layer", "Semantic layer", "Agent layer", "Interface layer"]
  },
  "/algorithm": {
    file: "algorithm.html",
    title: "The OneGodian Algorithm™",
    eyebrow: "Algorithm",
    heading: "The OneGodian Algorithm™",
    summary: "A unity-centered decision and execution model that ranks paths by truth, clarity, coherence, dignity, and constructive unity.",
    cards: ["Observe", "Distill", "Align", "Select", "Execute", "Verify"]
  },
  "/digital-sanctuary": {
    file: "digital-sanctuary.html",
    title: "The OneGodian Digital Sanctuary",
    eyebrow: "Digital Sanctuary",
    heading: "The Digital Sanctuary Experience",
    summary: "A premium OMOS landing experience using liquid-glass visual language, motion, typing, sacred geometry, and public-safe system positioning.",
    cards: ["Liquid glass UI", "Typed definition", "Pathway cards", "Runtime architecture"]
  }
};

const omosManifest = {
  id: "omos-site",
  name: "OMOS Runtime",
  fullName: "OMOS — OneGodian Metaphysical Operating System",
  version: OMOS_VERSION,
  status: "active",
  environment: process.env.NODE_ENV || "development",
  canonicalHost: CANONICAL_HOST,
  authority: {
    operator: process.env.OMOS_OPERATOR || "ONEGODIAN, LLC",
    founder: "Gregory Lamar Jones / One Gregory Onegodian™",
    framework: "ONEGODIAN™ root identity with OMOS™ runtime architecture",
    classification: "Node runtime, protocol documentation, and agent-facing integration site",
    commercialSeparation: "Products and checkout remain on OneGodian.com; OMOS routes provide protocol, documentation, runtime, and developer access."
  },
  routes: {
    public: publicRoutes,
    api: ["/health", "/manifest", "/api/health", "/api/manifest", "/process"]
  },
  endpoints: {
    health: { method: "GET", path: "/health", authRequired: false },
    apiHealth: { method: "GET", path: "/api/health", authRequired: false },
    manifest: { method: "GET", path: "/manifest", authRequired: false },
    apiManifest: { method: "GET", path: "/api/manifest", authRequired: false },
    process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
    dashboard: { method: "GET", path: "/dashboard", authRequired: false }
  },
  capabilities: ["observe", "distill", "align", "select", "execute", "verify", "document", "route", "integrate"],
  contentModel: {
    rootIdentity: "ONEGODIAN™",
    operatingLayer: "OMOS™",
    intelligenceLayer: "OHI™ / Quantum-OHI™",
    protocolLayer: "The OneGodian Protocol™",
    algorithmLayer: "The OneGodian Algorithm™",
    commerceLayer: "OneGodian.com"
  },
  wordpressPlugin: {
    compatibleHosts: ALLOWED_PLUGIN_ORIGINS,
    requiredEndpoints: ["/api/health", "/api/manifest"],
    shortcodes: ["[omos_manifest]", "[omos_runtime_status]", "[omos_bridge_builder]", "[omos_tool_grid]", "[omos_docs_grid]"],
    responsibilities: ["route synchronization", "shortcode registration", "OMOS card rendering", "tool manifest sync", "dashboard launch links", "canonical route verification"],
    pluginTargets: ["OneGodian.com", "OneGodian.org", "QuantumOHI.com"]
  },
  appBridge: {
    appConsole: APP_URL,
    expectedSyncRoutes: ["/api/manifest", "/api/health", "/process"],
    role: "app.OneGodian.com is the command center for cross-site runtime monitoring, agent workflows, and OMOS route synchronization."
  },
  commerceBridge: {
    primaryStore: STORE_URL,
    omosCategory: `${STORE_URL}/product-category/omos/`,
    productTypes: ["PDF guides", "prompt packs", "developer kits", "courses", "membership paths"],
    checkoutRule: "Checkout remains on OneGodian.com/WooCommerce/Stripe; OMOS pages explain, route, and document products."
  },
  integrationTargets: [
    "OneGodian.org public explanation layer",
    "OneGodian.com commerce and membership layer",
    "QuantumOHI.com governance and infrastructure layer",
    "app.OneGodian.com command center",
    "OMOS dashboard clients",
    "Agent and runtime manifest consumers"
  ],
  safety: {
    participation: "voluntary",
    scope: "educational, identity-reflection, protocol documentation, and runtime support tooling",
    legalAuthority: "Gregorian/civil records remain controlling for legal, financial, and institutional purposes",
    prohibitedClaims: ["independent nation-state authority", "governmental authority over non-members", "exemption from U.S. law", "financial guarantees"]
  },
  links: {
    publicSite: ORG_URL,
    commerceSite: STORE_URL,
    appConsole: APP_URL,
    quantumOhi: QUANTUM_OHI_URL,
    omosSite: CANONICAL_HOST,
    products: `${STORE_URL}/product-category/omos/`,
    contact: `${ORG_URL}/contact/`
  }
};

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-omos-key"];
  const meta = verifyApiKey(apiKey);

  if (!meta) {
    return res.status(401).json({ error: "unauthorized", message: "A valid x-omos-key header is required." });
  }

  req.apiKeyMeta = meta;
  next();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderGeneratedPage(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const cards = (meta.cards || [])
    .map((card) => `<article class="card"><h3>${escapeHtml(card)}</h3><p>Configured in the OMOS runtime manifest and ready for content expansion.</p></article>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(meta.title)}</title>
<style>
:root{--bg:#070607;--panel:#111827;--panel2:#17121f;--gold:#d8b35a;--text:#f5f1e8;--muted:rgba(245,241,232,.74);--line:rgba(216,179,90,.24)}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,rgba(111,60,255,.16),transparent 35%),radial-gradient(circle at bottom right,rgba(216,179,90,.13),transparent 35%),linear-gradient(180deg,var(--bg),var(--panel2));color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.65}.wrap{max-width:1180px;margin:0 auto;padding:44px 22px}.nav{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:42px}.nav a{color:var(--text);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:8px 12px;font-size:13px;background:rgba(255,255,255,.04)}.hero{padding:70px 0 48px}.eyebrow{color:var(--gold);font-weight:800;letter-spacing:.18em;text-transform:uppercase;font-size:12px}h1{font-size:clamp(42px,7vw,76px);line-height:1.02;margin:14px 0 18px;letter-spacing:-.04em}p{color:var(--muted);font-size:18px;max-width:880px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:18px;margin-top:34px}.card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025));border-radius:22px;padding:22px;min-height:150px}.card h3{margin:0 0 10px;color:var(--gold)}.cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:34px}.btn{display:inline-block;text-decoration:none;color:#070607;background:var(--gold);padding:13px 18px;border-radius:999px;font-weight:800}.btn.secondary{color:var(--text);background:transparent;border:1px solid var(--line)}footer{border-top:1px solid var(--line);margin-top:60px;padding-top:24px;color:var(--muted);font-size:14px}
</style>
</head>
<body><main class="wrap"><nav class="nav"><a href="/omos">OMOS</a><a href="/ohi">OHI</a><a href="/models">Models</a><a href="/tools">Tools</a><a href="/artifacts">Artifacts</a><a href="/docs">Docs</a><a href="/shop">Shop</a><a href="/dashboard">Open Console</a></nav><section class="hero"><div class="eyebrow">${escapeHtml(meta.eyebrow)}</div><h1>${escapeHtml(meta.heading)}</h1><p>${escapeHtml(meta.summary)}</p><div class="cta"><a class="btn" href="/dashboard">Open OMOS Dashboard</a><a class="btn secondary" href="/api/manifest">View Manifest</a><a class="btn secondary" href="${STORE_URL}/product-category/omos/">OMOS Products</a></div></section><section class="grid">${cards}</section><footer>OMOS.OneGodian.com is the Node runtime and protocol documentation layer. Commerce remains on OneGodian.com. Public institutional explanations remain on OneGodian.org.</footer></main></body></html>`;
}

function sendPage(res, route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const filePath = meta.file ? path.join(__dirname, "src/pages", meta.file) : null;

  if (filePath && fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }

  return res.send(renderGeneratedPage(route));
}

function healthPayload() {
  return {
    status: "ok",
    service: omosManifest.id,
    name: omosManifest.fullName,
    version: OMOS_VERSION,
    environment: omosManifest.environment,
    canonicalHost: CANONICAL_HOST,
    publicRouteCount: publicRoutes.length,
    pluginSync: "available"
  };
}

app.get(["/health", "/api/health"], (req, res) => res.json(healthPayload()));

app.get(["/manifest", "/api/manifest"], (req, res) => {
  res.json({ ...omosManifest, generatedAtUtc: new Date().toISOString() });
});

for (const route of publicRoutes) {
  app.get(route, (req, res) => sendPage(res, route));
}

app.get("/admin", (req, res) => sendPage(res, "/admin"));

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan }, data: result });
});

app.use((req, res) => {
  res.status(404).json({ error: "not_found", message: "Route not found in OMOS runtime manifest.", manifest: "/manifest" });
});

app.listen(PORT, () => {
  console.log(`OMOS running on ${PORT}`);
});
