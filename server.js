const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const { OMOSProcess } = require("./src/runtime/omos");
const { runCouncil, getCouncilRun, listCouncilRuns } = require("./src/runtime/orchestrator");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();

const PORT = process.env.PORT || 3000;
const OMOS_VERSION = process.env.OMOS_VERSION || "1.1.0";
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
  "/", "/omos", "/ohi", "/models", "/tools", "/artifacts", "/docs", "/shop",
  "/latest-news", "/dashboard", "/legal", "/contact", "/protocol", "/algorithm",
  "/digital-sanctuary", "/ohi-output-pipeline"
];

const primaryNav = [
  ["OMOS", "/omos"], ["OHI", "/ohi"], ["Models", "/models"], ["Tools", "/tools"],
  ["Artifacts", "/artifacts"], ["Docs", "/docs"], ["Shop", "/shop"]
];

const pageMeta = {
  "/": { file: "home.html", title: "OMOS — OneGodian Metaphysical Operating System", eyebrow: "OMOS.OneGodian.com", heading: "OneGodian Metaphysical Operating System™", summary: "The Node runtime and protocol site for OMOS content, documentation, runtime tools, and cross-site integration across the OneGodian ecosystem.", cards: ["Runtime manifest", "Protocol documentation", "Plugin synchronization", "App command-center bridge"] },
  "/omos": { file: "omos.html", title: "OMOS Architecture", eyebrow: "Operating Layer", heading: "OMOS Architecture", summary: "The orchestration, routing, documentation, and runtime layer connecting OneGodian identity, OHI synthesis, tools, pages, and integrations.", cards: ["Root identity layer", "Operating layer", "Protocol + Algorithm", "Commercial separation"] },
  "/ohi": { file: "ohi.html", title: "OHI — OneGodian Hyper-Conscious Intelligence", eyebrow: "Intelligence Layer", heading: "OHI Runtime and Synthesis Layer", summary: "OHI organizes multi-model synthesis, GCD-style distillation, and governed outputs for OneGodian-aligned documentation and runtime experiences.", cards: ["Council of models", "Signal extraction", "GCD synthesis", "Highest-coherence output"] },
  "/models": { file: "models.html", title: "OMOS Model Layer", eyebrow: "Model Council", heading: "Multi-Model Reasoning and Comparison", summary: "A structured content area for ChatGPT, Claude, Gemini, Grok, OHI synthesis notes, and model-output governance.", cards: ["ChatGPT", "Claude", "Gemini", "Grok", "OHI synthesis"] },
  "/tools": { file: "tools.html", title: "OMOS Tools", eyebrow: "Execution Tools", heading: "OMOS Tools and Runtime Utilities", summary: "Tool pages for the Belief Mapper, Bridge Builder, Declaration Generator, runtime processing, and future protocol utilities.", cards: ["Belief Mapper", "Bridge Builder", "Declaration Generator", "Runtime processor"] },
  "/artifacts": { file: "artifacts.html", title: "OMOS Artifacts", eyebrow: "Documentation Artifacts", heading: "OMOS Artifacts and Source Materials", summary: "A publication layer for whitepapers, source PDFs, WXR files, animation assets, diagrams, manifests, and institutional documents.", cards: ["Whitepapers", "WXR imports", "Animation assets", "Protocol files"] },
  "/docs": { file: "docs.html", title: "OMOS Docs", eyebrow: "Documentation", heading: "OMOS Documentation Center", summary: "Developer, institutional, legal, runtime, and public documentation for OMOS and related OneGodian systems.", cards: ["Protocol", "Algorithm", "Runtime", "Deployment", "Compliance"] },
  "/shop": { file: "shop.html", title: "OMOS Shop Bridge", eyebrow: "Commerce Bridge", heading: "OMOS Products and Downloads", summary: "Commercial product paths remain on OneGodian.com. OMOS routes provide explanation, documentation, and bridge links into WooCommerce products.", cards: ["Prompt packs", "PDF guides", "Developer kits", "Membership paths"] },
  "/latest-news": { file: "latest-news.html", title: "OMOS Latest News", eyebrow: "Updates", heading: "OMOS News and Build Notes", summary: "Release notes, Council updates, implementation status, route changes, product drops, and runtime milestones.", cards: ["Build notes", "Release status", "Council updates", "Product launches"] },
  "/dashboard": { file: "dashboard.html", title: "OMOS Dashboard", eyebrow: "Runtime Dashboard", heading: "OMOS Runtime Dashboard", summary: "Dashboard entry point for manifest status, health checks, process testing, route inventory, and app.OneGodian.com console handoff.", cards: ["Health", "Manifest", "Process", "Open App Console"] },
  "/admin": { title: "OMOS Admin Handoff", eyebrow: "Admin", heading: "OMOS Admin Handoff", summary: "Administrative execution belongs in app.OneGodian.com and authenticated WordPress dashboards. This public route provides safe handoff only.", cards: ["App console", "WordPress plugin", "Deployment notes", "Runtime logs"] },
  "/legal": { file: "legal.html", title: "OMOS Legal Positioning", eyebrow: "Compliance", heading: "Legal and Institutional Positioning", summary: "OMOS is presented as a voluntary educational, identity-reflection, documentation, and runtime-support framework. Civil/Gregorian records remain legally controlling.", cards: ["Voluntary use", "No public authority claims", "No financial guarantees", "Commercial/IP separation"] },
  "/contact": { file: "contact.html", title: "Contact OMOS", eyebrow: "Contact", heading: "Contact and Ecosystem Links", summary: "Connect OMOS runtime, documentation, products, app console, and OneGodian public properties.", cards: ["OneGodian.org", "OneGodian.com", "QuantumOHI.com", "app.OneGodian.com"] },
  "/protocol": { file: "protocol.html", title: "The OneGodian Protocol™", eyebrow: "Protocol", heading: "The OneGodian Protocol™", summary: "An optional identity, semantic, and alignment framework for human identity expression, AI interaction, digital communication, and interface systems.", cards: ["Human layer", "Semantic layer", "Agent layer", "Interface layer"] },
  "/algorithm": { file: "algorithm.html", title: "The OneGodian Algorithm™", eyebrow: "Algorithm", heading: "The OneGodian Algorithm™", summary: "A unity-centered decision and execution model that ranks paths by truth, clarity, coherence, dignity, and constructive unity.", cards: ["Observe", "Distill", "Align", "Select", "Execute", "Verify"] },
  "/digital-sanctuary": { file: "digital-sanctuary.html", title: "The OneGodian Digital Sanctuary", eyebrow: "Digital Sanctuary", heading: "The Digital Sanctuary Experience", summary: "A premium OMOS landing experience using liquid-glass visual language, motion, typing, sacred geometry, and public-safe system positioning.", cards: ["Liquid glass UI", "Typed definition", "Pathway cards", "Runtime architecture"] },
  "/ohi-output-pipeline": { file: "ohi-output-pipeline.html", title: "OHI Output Pipeline", eyebrow: "Council Runtime", heading: "OHI Cross-Model Review Pipeline", summary: "Independent model outputs, cross-model review, agreement and conflict mapping, human synthesis, and a governed OHI output.", cards: ["Round 1 outputs", "Cross-model review", "Agreement zones", "Human synthesis"] }
};

const omosManifest = {
  id: "omos-site",
  name: "OMOS Runtime",
  fullName: "OMOS — OneGodian Metaphysical Operating System",
  version: OMOS_VERSION,
  status: "functional",
  environment: process.env.NODE_ENV || "development",
  canonicalHost: CANONICAL_HOST,
  navigation: primaryNav.map(([label, href]) => ({ label, href })),
  routes: {
    public: publicRoutes,
    api: [
      "/health", "/manifest", "/api/health", "/api/manifest", "/process",
      "/api/v1/council/run", "/api/v1/council/runs", "/api/v1/council/runs/:id",
      "/api/v1/providers"
    ]
  },
  endpoints: {
    health: { method: "GET", path: "/health", authRequired: false },
    manifest: { method: "GET", path: "/api/manifest", authRequired: false },
    process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
    councilRun: { method: "POST", path: "/api/v1/council/run", authRequired: true, authHeader: "x-omos-key" },
    councilRuns: { method: "GET", path: "/api/v1/council/runs", authRequired: true, authHeader: "x-omos-key" },
    councilRunRecord: { method: "GET", path: "/api/v1/council/runs/:id", authRequired: true, authHeader: "x-omos-key" },
    providers: { method: "GET", path: "/api/v1/providers", authRequired: false }
  },
  orchestration: {
    modes: ["simulation", "hybrid", "live"],
    providers: ["openai", "anthropic", "gemini", "xai"],
    rounds: ["independent_outputs", "cross_model_review", "human_synthesis"],
    crossReviewMatrix: "4x4 excluding self-review",
    signals: ["agreement_zones", "contradictions", "missing_evidence", "novel_insights"],
    humanReviewRequired: true,
    modelAgreementIsNotFactualVerification: true,
    runRecord: true,
    runRecordStorage: "in_memory_bounded",
    durableStorageStatus: "planned"
  },
  wordpressPlugin: {
    compatibleHosts: ALLOWED_PLUGIN_ORIGINS,
    requiredEndpoints: ["/api/health", "/api/manifest", "/api/v1/providers"],
    shortcodes: ["[omos_manifest]", "[omos_runtime_status]", "[omos_bridge_builder]", "[omos_tool_grid]", "[omos_docs_grid]", "[omos_ohi_pipeline]"],
    pluginTargets: ["OneGodian.com", "OneGodian.org", "QuantumOHI.com"]
  },
  appBridge: {
    target: APP_URL,
    recommendedWidgets: ["runtime_health", "provider_status", "recent_council_runs", "run_record", "verification_status"]
  },
  links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
};

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

function requireApiKey(req, res, next) {
  const meta = verifyApiKey(req.headers["x-omos-key"]);
  if (!meta) return res.status(401).json({ error: "unauthorized", message: "A valid x-omos-key header is required." });
  req.apiKeyMeta = meta;
  next();
}

function escapeHtml(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function renderGeneratedPage(route) {
  const meta = pageMeta[route] || pageMeta["/"];
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(meta.title)}</title></head><body style="background:#070607;color:#f5f1e8;font-family:Arial;padding:40px"><h1>${escapeHtml(meta.heading)}</h1><p>${escapeHtml(meta.summary)}</p><p><a style="color:#d8b35a" href="/api/manifest">Manifest</a> · <a style="color:#d8b35a" href="/ohi-output-pipeline">OHI Pipeline</a></p></body></html>`;
}

function sendPage(res, route) {
  const meta = pageMeta[route] || pageMeta["/"];
  const filePath = meta.file ? path.join(__dirname, "src/pages", meta.file) : null;
  if (filePath && fs.existsSync(filePath)) return res.sendFile(filePath);
  return res.send(renderGeneratedPage(route));
}

function providerStatus() {
  const names = ["openai", "anthropic", "gemini", "xai"];
  return names.map((name) => {
    try {
      const adapter = require(`./src/adapters/${name}`);
      return { provider: name, configured: Boolean(adapter.isConfigured()), status: adapter.isConfigured() ? "live_available" : "simulation_only" };
    } catch (error) {
      return { provider: name, configured: false, status: "adapter_error" };
    }
  });
}

function healthPayload() {
  const providers = providerStatus();
  return {
    status: "ok",
    service: omosManifest.id,
    version: OMOS_VERSION,
    environment: omosManifest.environment,
    canonicalHost: CANONICAL_HOST,
    orchestration: {
      providers,
      liveProviderCount: providers.filter((p) => p.configured).length,
      crossModelReview: true,
      runRecordApi: true
    }
  };
}

app.get(["/health", "/api/health"], (req, res) => res.json(healthPayload()));
app.get(["/manifest", "/api/manifest"], (req, res) => res.json({ ...omosManifest, providerStatus: providerStatus(), generatedAtUtc: new Date().toISOString() }));
app.get("/api/v1/providers", (req, res) => res.json({ status: "ok", providers: providerStatus() }));

for (const route of publicRoutes) app.get(route, (req, res) => sendPage(res, route));
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

app.get("/api/v1/council/runs", requireApiKey, (req, res) => {
  res.json({
    status: "ok",
    apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan },
    data: listCouncilRuns(req.query.limit)
  });
});

app.get("/api/v1/council/runs/:id", requireApiKey, (req, res) => {
  const record = getCouncilRun(req.params.id);
  if (!record) return res.status(404).json({ error: "run_not_found", requestId: req.params.id });
  res.json({
    status: "ok",
    apiKey: { name: req.apiKeyMeta.name, plan: req.apiKeyMeta.plan },
    data: record
  });
});

app.use((req, res) => res.status(404).json({ error: "not_found", message: "Route not found in OMOS runtime manifest.", manifest: "/manifest" }));

app.listen(PORT, () => console.log(`OMOS running on ${PORT}`));
