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
const OMOS_VERSION = process.env.OMOS_VERSION || "0.4.0";
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || "https://omos.onegodian.com";
const STORE_URL = process.env.ONEGODIAN_STORE_URL || "https://onegodian.com";
const ORG_URL = process.env.ONEGODIAN_ORG_URL || "https://onegodian.org";
const APP_URL = process.env.ONEGODIAN_APP_URL || "https://app.onegodian.com";
const QUANTUM_OHI_URL = process.env.QUANTUM_OHI_URL || "https://quantumohi.com";
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const primaryNav = [
  ["OMOS", "/omos"],
  ["OHI", "/ohi"],
  ["Protocol", "/protocol"],
  ["Algorithm", "/algorithm"],
  ["Pipeline", "/ohi-output-pipeline"],
  ["Tools", "/tools"],
  ["Docs", "/docs"],
  ["Console", "/dashboard"]
];

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
  "/digital-sanctuary",
  "/ohi-output-pipeline"
];

const pageMeta = {
  "/": {
    title: "OMOS — OneGodian Metaphysical Operating System",
    eyebrow: "OMOS.OneGodian.com",
    heading: "The Node Runtime for OneGodian Intelligence Architecture",
    summary: "OMOS is the systems-integration layer for the ONEGODIAN framework. It connects the OneGodian Algorithm, the OneGodian Protocol, OHI synthesis, runtime manifests, developer tools, and public documentation into one navigable platform.",
    cards: [
      ["OMOS Architecture", "The operating layer that connects identity, protocol, algorithm, tools, documentation, and runtime services.", "/omos"],
      ["OHI Output Pipeline", "A visual explanation of how multi-model reasoning becomes an OHI-governed output.", "/ohi-output-pipeline"],
      ["Protocol + Algorithm", "The formal standards for alignment, identity recognition, and implementation.", "/protocol"],
      ["Developer Console", "Runtime health, manifest checks, route inventory, and app console handoff.", "/dashboard"]
    ]
  },
  "/omos": {
    title: "OMOS Architecture",
    eyebrow: "Operating Layer",
    heading: "OMOS Architecture",
    summary: "OMOS is not the storefront. It is the Node-based operating layer for protocol documentation, runtime routes, manifests, tools, and cross-site coordination across OneGodian.com, OneGodian.org, QuantumOHI.com, and app.OneGodian.com.",
    cards: [
      ["Root Identity", "ONEGODIAN remains the root identity and authored framework.", "/docs"],
      ["Runtime Layer", "OMOS handles routes, manifests, protocol pages, tools, and developer-facing runtime services.", "/api/manifest"],
      ["Commerce Bridge", "Products and checkout remain on OneGodian.com through WooCommerce and Stripe.", "/shop"],
      ["App Bridge", "Operational control belongs in app.OneGodian.com, with OMOS serving as the public runtime node.", "/dashboard"]
    ]
  },
  "/ohi": {
    title: "OHI Runtime and Synthesis Layer",
    eyebrow: "Intelligence Layer",
    heading: "OHI — OneGodian Hyper-Conscious Intelligence",
    summary: "OHI organizes multi-model synthesis, GCD-style distillation, and governed outputs. It is the intelligence-processing layer that transforms raw model perspectives into structured, verified, usable OMOS outputs.",
    cards: [
      ["Council of Models", "ChatGPT, Claude, Gemini, Grok, and other systems contribute distinct reasoning perspectives.", "/models"],
      ["GCD Synthesis", "OHI reduces remainders and extracts the highest shared signal.", "/ohi-output-pipeline"],
      ["Verification", "Outputs are checked against scope, source, legal-safe positioning, and production readiness.", "/legal"],
      ["Runtime Output", "Final results become pages, docs, prompts, tools, or manifest entries.", "/artifacts"]
    ]
  },
  "/models": {
    title: "OMOS Model Council",
    eyebrow: "Model Council",
    heading: "Multi-Model Reasoning and Comparison",
    summary: "This area explains how OMOS uses multiple model perspectives without treating any single model as the governing authority. OHI synthesis compares, filters, and structures the result.",
    cards: [
      ["ChatGPT", "Structure, implementation planning, code tasks, and documentation architecture.", "/models"],
      ["Claude", "Caution, careful reasoning, institutional framing, and edge-case review.", "/models"],
      ["Gemini", "Pattern recognition, broad synthesis, multimodal and ecosystem relationships.", "/models"],
      ["Grok", "Direct contrast, raw framing, cultural signal, and fast interpretation.", "/models"]
    ]
  },
  "/tools": {
    title: "OMOS Tools",
    eyebrow: "Execution Tools",
    heading: "Tools for Identity, Alignment, and Runtime Execution",
    summary: "OMOS tools turn the framework into usable experiences: belief mapping, declarations, bridge-building, protocol exploration, algorithm visualization, and runtime inspection.",
    cards: [
      ["Belief Mapper", "Maps a person through Seeker, Believer, OneGodian, and Elder journey stages.", "/tools"],
      ["Declaration Generator", "Produces structured statements for identity, sincerity, and institutional clarity.", "/tools"],
      ["Protocol Explorer", "Shows how the OneGodian Protocol applies across human, semantic, agent, and interface layers.", "/protocol"],
      ["OHI Output Pipeline", "Visualizes model input, synthesis, verification, and final OMOS output.", "/ohi-output-pipeline"]
    ]
  },
  "/artifacts": {
    title: "OMOS Artifacts",
    eyebrow: "Source Materials",
    heading: "Artifacts, Source Documents, and Runtime Evidence",
    summary: "Artifacts are the source materials behind OMOS: whitepapers, system prompts, WXR files, animation files, manifests, product docs, and institutional records.",
    cards: [
      ["Whitepapers", "Algorithm, Protocol, Digital Sanctuary, GCD synthesis, and institutional classification documents.", "/docs"],
      ["Animations", "OHI pipeline and Digital Sanctuary visual experiences.", "/ohi-output-pipeline"],
      ["Manifests", "Machine-readable route, plugin, app, and commerce bridge metadata.", "/api/manifest"],
      ["Build Notes", "Implementation logs and release status for OMOS.OneGodian.com.", "/latest-news"]
    ]
  },
  "/docs": {
    title: "OMOS Documentation Center",
    eyebrow: "Documentation",
    heading: "Documentation for OMOS, OHI, Protocol, and Algorithm",
    summary: "The docs section organizes public-safe explanations, developer specifications, legal positioning, system prompt guidance, and runtime integration notes.",
    cards: [
      ["Protocol Spec", "Identity, semantic, agent, and interface layers for OneGodian interaction.", "/protocol"],
      ["Algorithm Spec", "Observe, Distill, Align, Select, Execute, Verify.", "/algorithm"],
      ["System Prompt", "AI context instructions for OneGodian-aware platforms and agents.", "/docs"],
      ["Compliance", "Clarifies voluntary use, commerce separation, and civil/Gregorian control.", "/legal"]
    ]
  },
  "/shop": {
    title: "OMOS Product Bridge",
    eyebrow: "Commerce Bridge",
    heading: "OMOS Products Live on OneGodian.com",
    summary: "OMOS.OneGodian.com explains and documents the products. OneGodian.com handles WooCommerce, Stripe, downloads, courses, memberships, and checkout.",
    cards: [
      ["Algorithm Whitepaper", "Downloadable PDF and implementation package.", `${STORE_URL}/product-category/omos/`],
      ["Protocol Kit", "Protocol spec, schemas, prompt templates, and developer notes.", `${STORE_URL}/product-category/omos/`],
      ["System Prompt Pack", "Prompt package for AI agents and OneGodian-aware platforms.", `${STORE_URL}/product-category/omos/`],
      ["Courses + Memberships", "Education and access pathways remain inside OneGodian.com.", `${STORE_URL}/product-category/omos/`]
    ]
  },
  "/latest-news": {
    title: "OMOS Build Notes",
    eyebrow: "Updates",
    heading: "OMOS News, Releases, and Build Status",
    summary: "Track OMOS implementation as it moves from documents into a working Node runtime and cross-site infrastructure layer.",
    cards: [
      ["v0.4.0 Navigation Upgrade", "Real content, improved navigation, pipeline route, and stronger manifest architecture.", "/latest-news"],
      ["Node Runtime Direction", "OMOS is now positioned as a Node runtime, not a WordPress storefront.", "/omos"],
      ["Pipeline Added", "The OHI Output Pipeline now has a dedicated public route.", "/ohi-output-pipeline"],
      ["Next Build", "Dashboard widgets, OpenAPI spec, and plugin bridge sync.", "/dashboard"]
    ]
  },
  "/dashboard": {
    title: "OMOS Runtime Dashboard",
    eyebrow: "Runtime Dashboard",
    heading: "OMOS Runtime Dashboard",
    summary: "A public-safe dashboard entry for health checks, manifest viewing, route inventory, OHI pipeline access, and app.OneGodian.com handoff.",
    cards: [
      ["Health", "Check runtime service status.", "/api/health"],
      ["Manifest", "View route, plugin, commerce, and app bridge metadata.", "/api/manifest"],
      ["OHI Pipeline", "Open the visual OHI output process.", "/ohi-output-pipeline"],
      ["App Console", "Operational command belongs in app.OneGodian.com.", APP_URL]
    ]
  },
  "/legal": {
    title: "OMOS Legal and Institutional Positioning",
    eyebrow: "Compliance",
    heading: "Legal and Institutional Positioning",
    summary: "OMOS is a voluntary educational, identity-reflection, protocol documentation, and runtime-support framework. It does not create public authority, legal immunity, or financial guarantees.",
    cards: [
      ["Civil Control", "Gregorian/civil records remain controlling for legal, tax, banking, and institutional matters.", "/legal"],
      ["Commerce Separation", "ONEGODIAN, LLC handles commerce, software, IP, education, and product operations.", "/shop"],
      ["INO Separation", "Governance/religious society language belongs only where legally appropriate.", "/legal"],
      ["No Overclaims", "OMOS does not assert authority over non-members or replace civil law.", "/legal"]
    ]
  },
  "/contact": {
    title: "Contact OMOS",
    eyebrow: "Contact",
    heading: "Contact and Ecosystem Links",
    summary: "Connect the OMOS runtime layer to the wider OneGodian ecosystem: public information, commerce, app console, and QuantumOHI infrastructure.",
    cards: [
      ["OneGodian.org", "Public explanation, education, and institutional content.", ORG_URL],
      ["OneGodian.com", "Products, downloads, memberships, courses, and checkout.", STORE_URL],
      ["QuantumOHI.com", "Enterprise-facing systems and technology positioning.", QUANTUM_OHI_URL],
      ["app.OneGodian.com", "Command center and operational dashboards.", APP_URL]
    ]
  },
  "/protocol": {
    title: "The OneGodian Protocol™",
    eyebrow: "Protocol",
    heading: "The OneGodian Protocol™",
    summary: "The Protocol is the optional identity, semantic, agent, and interface framework for respectful interaction across human users, AI systems, platforms, and future interface environments.",
    cards: [
      ["Human Layer", "Voluntary identity expression and public-safe self-description.", "/protocol"],
      ["Semantic Layer", "Knowledge graph, classification, search, and metadata support.", "/protocol"],
      ["Agent Layer", "AI alignment, tone control, and interaction standards.", "/protocol"],
      ["Interface Layer", "Robotics, dashboards, apps, and user-facing systems.", "/protocol"]
    ]
  },
  "/algorithm": {
    title: "The OneGodian Algorithm™",
    eyebrow: "Algorithm",
    heading: "The OneGodian Algorithm™",
    summary: "The Algorithm is a unity-centered decision and execution model for selecting the clearest, most aligned, least destructive path across human, digital, and AI-mediated systems.",
    cards: [
      ["Observe", "Collect facts, claims, actors, systems, risks, and context.", "/algorithm"],
      ["Distill", "Remove noise, distortion, unnecessary conflict, and weak signal.", "/algorithm"],
      ["Align", "Score against truth, clarity, coherence, dignity, and constructive unity.", "/algorithm"],
      ["Verify", "Check the output against reality, implementation status, and source authority.", "/ohi-output-pipeline"]
    ]
  },
  "/digital-sanctuary": {
    title: "The OneGodian Digital Sanctuary",
    eyebrow: "Digital Sanctuary",
    heading: "The Digital Sanctuary Experience",
    summary: "The Digital Sanctuary is the immersive public-facing experience for OneGodian identity, OMOS architecture, OHI synthesis, and interactive learning.",
    cards: [
      ["Liquid Glass UI", "Premium visual system using dark, gold, and purple OneGodian presentation.", "/digital-sanctuary"],
      ["Typed Definition", "First-contact explanation of OneGodian identity and OMOS architecture.", "/digital-sanctuary"],
      ["Pathway Cards", "Routes into Protocol, Algorithm, Tools, Docs, and Shop.", "/digital-sanctuary"],
      ["Pipeline Link", "Interactive explanation of OHI output synthesis.", "/ohi-output-pipeline"]
    ]
  },
  "/ohi-output-pipeline": {
    file: "ohi-output-pipeline.html",
    title: "OHI Output Pipeline",
    eyebrow: "OHI Visualization",
    heading: "OHI Output Pipeline",
    summary: "A visual OMOS explanation of how a source prompt moves through multiple model perspectives, OHI synthesis, verification, and final structured output.",
    cards: [
      ["Source Prompt", "A single controlled request begins the process.", "/ohi-output-pipeline"],
      ["Council of Models", "Multiple systems contribute different reasoning patterns.", "/models"],
      ["OHI Synthesis", "Signal is distilled into a governed output.", "/ohi"],
      ["OMOS Artifact", "The final result becomes a page, doc, prompt, tool, or manifest item.", "/artifacts"]
    ]
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
  navigation: primaryNav.map(([label, href]) => ({ label, href })),
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
  featuredRoutes: [
    { id: "omos", label: "OMOS Architecture", path: "/omos" },
    { id: "ohi", label: "OHI Synthesis", path: "/ohi" },
    { id: "pipeline", label: "OHI Output Pipeline", path: "/ohi-output-pipeline" },
    { id: "protocol", label: "Protocol", path: "/protocol" },
    { id: "algorithm", label: "Algorithm", path: "/algorithm" },
    { id: "docs", label: "Docs", path: "/docs" }
  ],
  endpoints: {
    health: { method: "GET", path: "/health", authRequired: false },
    apiHealth: { method: "GET", path: "/api/health", authRequired: false },
    manifest: { method: "GET", path: "/manifest", authRequired: false },
    apiManifest: { method: "GET", path: "/api/manifest", authRequired: false },
    process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
    dashboard: { method: "GET", path: "/dashboard", authRequired: false },
    ohiOutputPipeline: { method: "GET", path: "/ohi-output-pipeline", authRequired: false }
  },
  capabilities: ["observe", "distill", "align", "select", "execute", "verify", "document", "route", "integrate", "visualize"],
  contentModel: {
    rootIdentity: "ONEGODIAN™",
    operatingLayer: "OMOS™",
    intelligenceLayer: "OHI™ / Quantum-OHI™",
    protocolLayer: "The OneGodian Protocol™",
    algorithmLayer: "The OneGodian Algorithm™",
    commerceLayer: "OneGodian.com"
  },
  tools: [
    { id: "belief-mapper", name: "Belief Mapper", status: "planned", route: "/tools" },
    { id: "declaration-generator", name: "Declaration Generator", status: "planned", route: "/tools" },
    { id: "ohi-output-pipeline", name: "OHI Output Pipeline", status: "active", route: "/ohi-output-pipeline" },
    { id: "protocol-explorer", name: "Protocol Explorer", status: "planned", route: "/protocol" },
    { id: "algorithm-visualizer", name: "Algorithm Visualizer", status: "planned", route: "/algorithm" }
  ],
  wordpressPlugin: {
    compatibleHosts: ALLOWED_PLUGIN_ORIGINS,
    requiredEndpoints: ["/api/health", "/api/manifest"],
    shortcodes: ["[omos_manifest]", "[omos_runtime_status]", "[omos_bridge_builder]", "[omos_tool_grid]", "[omos_docs_grid]", "[omos_ohi_pipeline]"],
    responsibilities: ["route synchronization", "shortcode registration", "OMOS card rendering", "tool manifest sync", "dashboard launch links", "canonical route verification"],
    pluginTargets: ["OneGodian.com", "OneGodian.org", "QuantumOHI.com"]
  },
  appBridge: {
    appConsole: APP_URL,
    expectedSyncRoutes: ["/api/manifest", "/api/health", "/process", "/ohi-output-pipeline"],
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

function renderCard(card) {
  const [title, body, href] = Array.isArray(card) ? card : [card, "Configured in the OMOS runtime manifest and ready for content expansion.", "#"];
  return `<article class="card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p><a href="${escapeHtml(href)}">Open →</a></article>`;
}

function renderGeneratedPage(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const cards = (meta.cards || []).map(renderCard).join("");
  const nav = primaryNav.map(([label, href]) => `<a href="${href}">${escapeHtml(label)}</a>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(meta.title)}</title>
<style>
:root{--bg:#070607;--panel:#111827;--panel2:#17121f;--gold:#d8b35a;--purple:#6f3cff;--text:#f5f1e8;--muted:rgba(245,241,232,.74);--line:rgba(216,179,90,.24)}*{box-sizing:border-box}body{margin:0;background:radial-gradient(circle at top left,rgba(111,60,255,.16),transparent 35%),radial-gradient(circle at bottom right,rgba(216,179,90,.13),transparent 35%),linear-gradient(180deg,var(--bg),var(--panel2));color:var(--text);font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.65}.wrap{max-width:1180px;margin:0 auto;padding:36px 22px}.top{display:flex;justify-content:space-between;gap:18px;align-items:center;margin-bottom:38px}.brand{font-weight:900;letter-spacing:.08em;color:var(--gold);text-transform:uppercase}.nav{display:flex;gap:10px;flex-wrap:wrap}.nav a{color:var(--text);text-decoration:none;border:1px solid var(--line);border-radius:999px;padding:8px 12px;font-size:13px;background:rgba(255,255,255,.04)}.hero{padding:64px 0 42px}.eyebrow{color:var(--gold);font-weight:800;letter-spacing:.18em;text-transform:uppercase;font-size:12px}h1{font-size:clamp(40px,7vw,74px);line-height:1.02;margin:14px 0 18px;letter-spacing:-.04em}p{color:var(--muted);font-size:18px;max-width:900px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(245px,1fr));gap:18px;margin-top:30px}.card{border:1px solid var(--line);background:linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,.025));border-radius:22px;padding:22px;min-height:180px}.card h3{margin:0 0 10px;color:var(--gold)}.card a{display:inline-block;margin-top:12px;color:var(--gold);font-weight:800;text-decoration:none}.cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:30px}.btn{display:inline-block;text-decoration:none;color:#070607;background:var(--gold);padding:13px 18px;border-radius:999px;font-weight:800}.btn.secondary{color:var(--text);background:transparent;border:1px solid var(--line)}.status{margin-top:26px;border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:16px;background:rgba(255,255,255,.04);color:var(--muted)}footer{border-top:1px solid var(--line);margin-top:60px;padding-top:24px;color:var(--muted);font-size:14px}@media(max-width:720px){.top{display:block}.nav{margin-top:16px}h1{font-size:42px}}
</style>
</head>
<body><main class="wrap"><header class="top"><div class="brand">OMOS</div><nav class="nav">${nav}</nav></header><section class="hero"><div class="eyebrow">${escapeHtml(meta.eyebrow)}</div><h1>${escapeHtml(meta.heading)}</h1><p>${escapeHtml(meta.summary)}</p><div class="cta"><a class="btn" href="/ohi-output-pipeline">View OHI Pipeline</a><a class="btn secondary" href="/api/manifest">View Manifest</a><a class="btn secondary" href="${STORE_URL}/product-category/omos/">OMOS Products</a></div><div class="status">Runtime v${escapeHtml(OMOS_VERSION)} • Node route active • Commerce remains on OneGodian.com • Civil/Gregorian records remain legally controlling.</div></section><section class="grid">${cards}</section><footer>OMOS.OneGodian.com is the Node runtime and protocol documentation layer. Commerce remains on OneGodian.com. Public institutional explanations remain on OneGodian.org.</footer></main></body></html>`;
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
    pluginSync: "available",
    featured: "/ohi-output-pipeline"
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
