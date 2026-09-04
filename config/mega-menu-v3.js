// OMOS Mega Menu v3 — Model-First Navigation
// Target: https://omos.onegodian.com/
// This config is intentionally data-only so the shared shell can consume it.

module.exports = {
  version: "3.0.0",
  strategy: "model-first",
  primary: [
    {
      label: "Models",
      groups: [
        ["OneGodian Intelligence", [
          ["OHI™", "/ohi"],
          ["Council of Models", "/models"],
          ["OHI Output Pipeline", "/ohi-output-pipeline"]
        ]],
        ["Model Interfaces", [
          ["ChatGPT / OpenAI", "/models/chatgpt"],
          ["Claude / Anthropic", "/models/claude"],
          ["Gemini / Google", "/models/gemini"],
          ["Grok / xAI", "/models/grok"]
        ]],
        ["Model Operations", [
          ["Provider Status", "/api/v1/providers"],
          ["Ask OMOS", "/ask/"],
          ["Council Runs", "/dashboard"],
          ["Model Documentation", "/docs"]
        ]]
      ]
    },
    {
      label: "OMOS",
      groups: [
        ["Platform", [
          ["What Is OMOS?", "/omos"],
          ["Ask OMOS", "/ask/"],
          ["Operational Workspace", "/dashboard"],
          ["Digital Sanctuary", "/digital-sanctuary"]
        ]],
        ["Core Architecture", [
          ["OneGodian Algorithm™", "/algorithm"],
          ["OneGodian Protocol™", "/protocol"],
          ["OHI™", "/ohi"],
          ["Output Pipeline", "/ohi-output-pipeline"]
        ]],
        ["Runtime", [
          ["Runtime Health", "/api/health"],
          ["Runtime Manifest", "/api/manifest"],
          ["Persistence", "/api/v1/persistence"],
          ["Provider Status", "/api/v1/providers"]
        ]]
      ]
    },
    {
      label: "Tools",
      groups: [
        ["Decision Tools", [
          ["Ask OMOS", "/ask/"],
          ["Layer 1", "/tools/layer-1"],
          ["Alignment Engine", "/tools/alignment"],
          ["Decision Review", "/tools/decision-review"]
        ]],
        ["Identity Tools", [
          ["Belief Mapper", "/belief-mapper"],
          ["Declaration Generator", "/tools/declaration-generator"],
          ["Identity Engine", "/tools/identity"],
          ["All Tools", "/tools"]
        ]],
        ["Resources", [
          ["Artifacts", "/artifacts"],
          ["Documentation", "/docs"],
          ["Schemas", "/docs"],
          ["Runtime Dashboard", "/dashboard"]
        ]]
      ]
    },
    {
      label: "Developers",
      groups: [
        ["Build", [
          ["Developer Docs", "/docs"],
          ["API Manifest", "/api/manifest"],
          ["Provider API", "/api/v1/providers"],
          ["Health API", "/api/health"]
        ]],
        ["Architecture", [
          ["Protocol", "/protocol"],
          ["Algorithm", "/algorithm"],
          ["Council", "/models"],
          ["Pipeline", "/ohi-output-pipeline"]
        ]],
        ["Integration", [
          ["App Console", "https://app.onegodian.com"],
          ["OneGodian.com", "https://onegodian.com"],
          ["OneGodian.org", "https://onegodian.org"],
          ["QuantumOHI.com", "https://quantumohi.com"]
        ]]
      ]
    }
  ],
  direct: [
    ["News", "/latest-news"],
    ["Shop", "/shop"],
    ["Dashboard", "/dashboard"]
  ],
  actions: [
    ["Runtime", "/api/health"],
    ["Ask OMOS", "/ask/"]
  ],
  modelPages: [
    "/ohi",
    "/models/chatgpt",
    "/models/claude",
    "/models/gemini",
    "/models/grok"
  ]
};
