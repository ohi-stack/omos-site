const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const { OMOSProcess } = require("./src/runtime/omos");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");
const { SITE, pages, tools, documents, pluginTargets, ecosystem } = require("./src/content/rich-content");
const { renderPage } = require("./src/render/page");
const { renderDashboard } = require("./src/render/dashboard");

const app = express();

const PORT = process.env.PORT || 3000;
const OMOS_VERSION = SITE.version || "1.1.0";

const runtimeRoutes = Object.keys(pages);

const omosManifest = {
  id: "omos-site",
  name: "OMOS Runtime",
  fullName: SITE.fullName,
  version: OMOS_VERSION,
  status: "active",
  canonicalUrl: SITE.canonicalUrl,
  environment: process.env.NODE_ENV || "development",
  authority: {
    operator: "ONEGODIAN, LLC",
    framework: "OMOS — OneGodian Metaphysical Operating System",
    classification: "runtime, protocol, specification, documentation, and alignment service"
  },
  publicRoutes: runtimeRoutes,
  appStructure: {
    publicAppLayer: ["/", "/omos", "/protocol", "/algorithm", "/ohi", "/alignment-api", "/tools", "/docs", "/plugin-bridge", "/legal", "/contact"],
    dashboardLayer: ["/dashboard"],
    adminLayer: ["/admin"],
    apiBridgeLayer: ["/health", "/manifest", "/api/health", "/api/manifest", "/api/tools", "/api/stats", "/process"]
  },
  endpoints: {
    health: { method: "GET", path: "/health", authRequired: false },
    manifest: { method: "GET", path: "/manifest", authRequired: false },
    apiHealth: { method: "GET", path: "/api/health", authRequired: false },
    apiManifest: { method: "GET", path: "/api/manifest", authRequired: false },
    apiTools: { method: "GET", path: "/api/tools", authRequired: false },
    apiStats: { method: "GET", path: "/api/stats", authRequired: false },
    process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
    dashboard: { method: "GET", path: "/dashboard", authRequired: false }
  },
  capabilities: ["observe", "distill", "align", "select", "execute", "verify"],
  integrationTargets: [
    "OneGodian.org organization and public identity layer",
    "OneGodian.com commerce and product layer",
    "QuantumOHI.com platform plugin layer",
    "app.OneGodian.com Node control plane",
    "OMOS WordPress Core Tools plugin"
  ],
  ecosystem,
  pluginTargets,
  safety: {
    participation: "voluntary",
    scope: "educational, identity-reflection, protocol documentation, and runtime support tooling",
    legalAuthority: "Gregorian/civil records remain controlling for legal, financial, and institutional purposes",
    prohibitedClaims: [
      "independent nation-state authority",
      "governmental authority over non-members",
      "exemption from U.S. law",
      "financial guarantees"
    ]
  },
  links: {
    publicSite: SITE.orgUrl,
    commerceSite: SITE.storeUrl,
    omosSite: SITE.canonicalUrl,
    appSite: SITE.appUrl,
    quantumOhi: SITE.quantumUrl
  }
};

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-omos-key"] || req.headers["x-omos-app-key"];
  const meta = verifyApiKey(apiKey);

  if (!meta) {
    return res.status(401).json({ error: "unauthorized" });
  }

  req.apiKeyMeta = meta;
  next();
}

function healthPayload() {
  return {
    status: "ok",
    service: omosManifest.id,
    version: OMOS_VERSION,
    environment: omosManifest.environment,
    timestampUtc: new Date().toISOString()
  };
}

function manifestPayload() {
  return { ...omosManifest, generatedAtUtc: new Date().toISOString() };
}

app.get("/health", (req, res) => res.json(healthPayload()));
app.get("/api/health", (req, res) => res.json(healthPayload()));

app.get("/manifest", (req, res) => res.json(manifestPayload()));
app.get("/api/manifest", (req, res) => res.json(manifestPayload()));

app.get("/api/tools", (req, res) => {
  res.json({ status: "ok", count: tools.length, items: tools });
});

app.get("/api/stats", (req, res) => {
  res.json({
    status: "ok",
    publicRoutes: runtimeRoutes.length,
    tools: tools.length,
    documents: documents.length,
    pluginTargets: pluginTargets.length,
    ecosystemNodes: ecosystem.length,
    version: OMOS_VERSION,
    generatedAtUtc: new Date().toISOString()
  });
});

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", data: result });
});

app.get("/dashboard", (req, res) => res.send(renderDashboard()));

for (const [route, page] of Object.entries(pages)) {
  app.get(route, (req, res) => res.send(renderPage(route, page)));
}

app.use((req, res) => {
  res.status(404).send(renderPage("/", {
    title: "OMOS Route Not Found",
    eyebrow: "404",
    summary: "The requested OMOS route is not currently mapped. Return to the OMOS homepage or open the dashboard.",
    cta: { label: "Return Home", href: "/" },
    secondaryCta: { label: "Open Dashboard", href: "/dashboard" },
    sections: [{ title: "Production note", body: "Add new routes to src/content/rich-content.js and the WordPress plugin manifest before treating them as operational." }]
  }));
});

app.listen(PORT, () => {
  console.log(`OMOS running on ${PORT}`);
});
