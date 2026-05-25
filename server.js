const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const { OMOSProcess } = require("./src/runtime/omos");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();

const PORT = process.env.PORT || 3000;
const OMOS_VERSION = "0.1.0";

const omosManifest = {
  id: "omos-site",
  name: "OMOS Runtime",
  fullName: "OneGodian Metaphysical Operating System Runtime",
  version: OMOS_VERSION,
  status: "active",
  environment: process.env.NODE_ENV || "development",
  authority: {
    operator: "ONEGODIAN, LLC",
    framework: "OMOS — OneGodian Metaphysical Operating System",
    classification: "runtime and protocol service"
  },
  endpoints: {
    health: {
      method: "GET",
      path: "/health",
      authRequired: false
    },
    manifest: {
      method: "GET",
      path: "/manifest",
      authRequired: false
    },
    process: {
      method: "POST",
      path: "/process",
      authRequired: true,
      authHeader: "x-omos-key"
    },
    dashboard: {
      method: "GET",
      path: "/dashboard",
      authRequired: false
    }
  },
  capabilities: [
    "observe",
    "distill",
    "align",
    "select",
    "execute",
    "verify"
  ],
  integrationTargets: [
    "OneGodian.org public explanation layer",
    "OneGodian.com commerce and membership layer",
    "ACC WordPress Adapter",
    "OMOS dashboard clients"
  ],
  safety: {
    participation: "voluntary",
    scope: "educational, identity-reflection, and runtime support tooling",
    legalAuthority: "Gregorian/civil records remain controlling for legal, financial, and institutional purposes",
    prohibitedClaims: [
      "independent nation-state authority",
      "governmental authority over non-members",
      "exemption from U.S. law",
      "financial guarantees"
    ]
  },
  links: {
    publicSite: "https://onegodian.org",
    commerceSite: "https://onegodian.com",
    omosSite: "https://omos.onegodian.com"
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

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: omosManifest.id, version: OMOS_VERSION });
});

app.get("/manifest", (req, res) => {
  res.json({
    ...omosManifest,
    generatedAtUtc: new Date().toISOString()
  });
});

app.post("/process", requireApiKey, rateLimit(), (req, res) => {
  const result = OMOSProcess(req.body);
  res.json({ status: "ok", data: result });
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/dashboard.html"));
});

app.listen(PORT, () => {
  console.log(`OMOS running on ${PORT}`);
});
