const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

const { OMOSProcess } = require("./src/runtime/omos");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

const app = express();

const PORT = process.env.PORT || 3000;

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
  res.json({ status: "ok" });
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
