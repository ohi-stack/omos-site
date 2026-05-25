const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const { OMOSProcess } = require("./src/runtime/omos");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();

const PORT = process.env.PORT || 3000;
const OMOS_VERSION = process.env.OMOS_VERSION || "0.2.0";
const CANONICAL_HOST = process.env.OMOS_CANONICAL_HOST || "https://omos.onegodian.com";
const STORE_URL = process.env.ONEGODIAN_STORE_URL || "https://onegodian.com";
const ORG_URL = process.env.ONEGODIAN_ORG_URL || "https://onegodian.org";
const APP_URL = process.env.ONEGODIAN_APP_URL || "https://app.onegodian.com";

const omosManifest = {
  id: "omos-site",
  name: "OMOS Runtime",
  fullName: "OMOS — OneGodian Metaphysical Operating System",
  version: OMOS_VERSION,
  status: "active",
  environment: process.env.NODE_ENV || "development",
  canonicalHost: CANONICAL_HOST,
  authority: {
    operator: "ONEGODIAN, LLC",
    founder: "Gregory Lamar Jones / One Gregory Onegodian™",
    framework: "ONEGODIAN™ root identity with OMOS™ runtime architecture",
    classification: "Node runtime, protocol documentation, and agent-facing integration site",
    commercialSeparation: "Products and checkout remain on OneGodian.com; OMOS routes provide protocol, documentation, runtime, and developer access."
  },
  routes: {
    public: ["/", "/omos", "/protocol", "/algorithm", "/tools", "/docs", "/digital-sanctuary", "/legal", "/dashboard"],
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
  integrationTargets: [
    "OneGodian.org public explanation layer",
    "OneGodian.com commerce and membership layer",
    "app.OneGodian.com command center",
    "OMOS dashboard clients",
    "Agent and runtime manifest consumers"
  ],
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
    publicSite: ORG_URL,
    commerceSite: STORE_URL,
    appConsole: APP_URL,
    omosSite: CANONICAL_HOST,
    products: `${STORE_URL}/product-category/omos/`,
    contact: `${ORG_URL}/contact/`
  }
};

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

function requireApiKey(req, res, next) {
  const apiKey = req.headers["x-omos-key"];
  const meta = verifyApiKey(apiKey);

  if (!meta) {
    return res.status(401).json({ error: "unauthorized" });
  }

  req.apiKeyMeta = meta;
  next();
}

function sendPage(res, pageName) {
  res.sendFile(path.join(__dirname, "src/pages", pageName));
}

function healthPayload() {
  return {
    status: "ok",
    service: omosManifest.id,
    name: omosManifest.fullName,
    version: OMOS_VERSION,
    environment: omosManifest.environment,
    canonicalHost: CANONICAL_HOST
  };
}

app.get(["/health", "/api/health"], (req, res) => {
  res.json(healthPayload());
});

app.get(["/manifest", "/api/manifest"], (req, res) => {
  res.json({
    ...omosManifest,
    generatedAtUtc: new Date().toISOString()
  });
});

app.get("/", (req, res) => sendPage(res, "home.html"));
app.get("/omos", (req, res) => sendPage(res, "omos.html"));
app.get("/protocol", (req, res) => sendPage(res, "protocol.html"));
app.get("/algorithm", (req, res) => sendPage(res, "algorithm.html"));
app.get("/tools", (req, res) => sendPage(res, "tools.html"));
app.get("/docs", (req, res) => sendPage(res, "docs.html"));
app.get("/digital-sanctuary", (req, res) => sendPage(res, "digital-sanctuary.html"));
app.get("/legal", (req, res) => sendPage(res, "legal.html"));
app.get("/dashboard", (req, res) => sendPage(res, "dashboard.html"));

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", data: result });
});

app.use((req, res) => {
  res.status(404).json({
    error: "not_found",
    message: "Route not found in OMOS runtime manifest.",
    manifest: "/manifest"
  });
});

app.listen(PORT, () => {
  console.log(`OMOS running on ${PORT}`);
});
