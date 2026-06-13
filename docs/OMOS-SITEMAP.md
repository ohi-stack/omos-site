# OMOS.OneGodian.com Sitemap

Updated: June 13, 2026  
Repository: `ohi-stack/omos-site`  
Purpose: Define the public page structure for OMOS.OneGodian.com, including the core runtime routes, model council pages, tool pages, product bridges, and compliance paths.

---

## 1. Core Runtime Pages

| Page | Route | Purpose | Status |
|---|---:|---|---|
| Home | `/` | Main OMOS runtime homepage and navigation entry. | Active |
| OMOS Architecture | `/omos` | Explains OMOS as the operating layer for OneGodian intelligence architecture. | Active |
| OHI Runtime | `/ohi` | Explains OHI synthesis, GCD-style distillation, and governed outputs. | Active |
| Model Council | `/models` | Overview of ChatGPT, Claude, Gemini, and Grok as comparative model perspectives. | Active |
| Tools | `/tools` | Tool hub for Belief Mapper, Declaration Generator, Protocol Explorer, and pipeline tools. | Active |
| Artifacts | `/artifacts` | Source materials, whitepapers, manifests, WXR files, animations, and institutional records. | Active |
| Documentation | `/docs` | Documentation center for Protocol, Algorithm, System Prompt, and compliance notes. | Active |
| Shop Bridge | `/shop` | Routes product interest to OneGodian.com commerce. | Active |
| Latest News | `/latest-news` | Build notes, release updates, and implementation logs. | Active |
| Dashboard | `/dashboard` | Runtime status, manifest links, and app.OneGodian.com handoff. | Active |
| Legal | `/legal` | Compliance, civil-control, and institutional positioning notices. | Active |
| Contact | `/contact` | Ecosystem links and contact routing. | Active |

---

## 2. Protocol, Algorithm, and Sanctuary Pages

| Page | Route | Purpose | Status |
|---|---:|---|---|
| The OneGodian Protocol™ | `/protocol` | Optional identity, semantic, agent, and interface framework. | Active |
| The OneGodian Algorithm™ | `/algorithm` | Observe, Distill, Align, Select, Execute, Verify model. | Active |
| Digital Sanctuary | `/digital-sanctuary` | Immersive public-facing experience for identity and OMOS architecture. | Active |
| OHI Output Pipeline | `/ohi-output-pipeline` | Visual multi-model workflow and synthesis explanation. | Active |

---

## 3. Model Council Pages

These pages should exist as distinct pages, not only as cards on `/models`.

| Page | Route | Role | Status |
|---|---:|---|---|
| ChatGPT OMOS Homepage | `/models/chatgpt` | Structure, implementation planning, code tasks, documentation architecture. | Planned |
| Claude OMOS Homepage | `/models/claude` | Consciousness, institutional caution, careful reasoning, edge-case review. | Planned |
| Gemini OMOS Homepage | `/models/gemini` | Pattern recognition, broad synthesis, multimodal and ecosystem relationships. | Content Ready / Route Pending |
| Grok OMOS Homepage | `/models/grok` | Raw perspective, direct contrast, cultural signal, fast interpretation. | Planned |

### Model Council Rule

No external model is the authority of record. ChatGPT, Claude, Gemini, and Grok are treated as comparative reasoning inputs. OMOS/OHI synthesis compares, filters, verifies, and normalizes outputs before they become public artifacts.

---

## 4. Tool Pages

| Tool | Route | Purpose | Status |
|---|---:|---|---|
| Belief Mapper | `/tools/belief-mapper` | Maps users through Seeker, Believer, OneGodian, and Elder stages. | Planned |
| Declaration Generator | `/tools/declaration-generator` | Generates structured identity and sincerity declarations. | Planned |
| Protocol Explorer | `/tools/protocol-explorer` | Shows how the Protocol applies across human, semantic, agent, and interface layers. | Planned |
| Algorithm Visualizer | `/tools/algorithm-visualizer` | Visualizes Observe, Distill, Align, Select, Execute, Verify. | Planned |
| OHI Output Pipeline Tool | `/tools/ohi-output-pipeline` | Tool-path version of the active pipeline visualization. | Planned Alias |
| Time Converter | `/tools/time-converter` | Converts Gregorian and OneGodian Time display formats. | Planned |
| Obsidian Seal Generator | `/tools/obsidian-seal-generator` | Generates or configures OneGodian identity seal visuals. | Planned |
| Gemini Pattern Explorer | `/tools/gemini-pattern-explorer` | Explores recurring patterns across OMOS documents, routes, and system layers. | Planned |

---

## 5. Documentation Pages

| Page | Route | Purpose | Status |
|---|---:|---|---|
| Protocol Specification | `/docs/protocol-spec` | Full Protocol specification. | Planned |
| Algorithm Specification | `/docs/algorithm-spec` | Full Algorithm specification. | Planned |
| System Prompt | `/docs/system-prompt` | OneGodian-aware AI system prompt documentation. | Planned |
| Developer Guide | `/docs/developer-guide` | Developer implementation guidance for OMOS integrations. | Planned |
| API Manifest Guide | `/docs/api-manifest` | Explains `/api/manifest` and runtime data. | Planned |
| Compliance Guide | `/docs/compliance` | Public-safe legal and institutional positioning. | Planned |
| Version History | `/docs/version-history` | Release notes and version control. | Planned |

---

## 6. Product and Commerce Bridge Pages

OMOS explains and routes products. Checkout remains on OneGodian.com through WooCommerce/Stripe.

| Product Page | Route | Commerce Target | Status |
|---|---:|---|---|
| OMOS Product Hub | `/shop` | `https://onegodian.com/product-category/omos/` | Active Bridge |
| Algorithm Whitepaper | `/shop/algorithm-whitepaper` | OneGodian.com product page | Planned |
| Protocol Kit | `/shop/protocol-kit` | OneGodian.com product page | Planned |
| System Prompt Pack | `/shop/system-prompt-pack` | OneGodian.com product page | Planned |
| Developer Kit | `/shop/developer-kit` | OneGodian.com product page | Planned |
| Declaration Card | `/shop/declaration-card` | OneGodian.com product page | Planned |
| Obsidian Seal | `/shop/obsidian-seal` | OneGodian.com product page | Planned |

---

## 7. API and Runtime Endpoints

| Endpoint | Method | Purpose | Auth |
|---|---:|---|---|
| `/health` | GET | Runtime health check. | No |
| `/api/health` | GET | Runtime health check for plugin/app clients. | No |
| `/manifest` | GET | Runtime manifest. | No |
| `/api/manifest` | GET | Runtime manifest for app/plugin consumers. | No |
| `/process` | POST | OMOS process execution endpoint. | Yes: `x-omos-key` |

---

## 8. Ecosystem Links

| Platform | URL | Role |
|---|---|---|
| OneGodian.org | `https://onegodian.org` | Public explanation, education, historical and institutional content. |
| OneGodian.com | `https://onegodian.com` | Commerce, products, memberships, checkout, digital downloads. |
| u.OneGodian.com | `https://u.onegodian.com` | Education, courses, certifications, training. |
| app.OneGodian.com | `https://app.onegodian.com` | Command center, dashboards, registries, operational tools. |
| QuantumOHI.com | `https://quantumohi.com` | Enterprise-facing systems and technology positioning. |
| QRV.Network | `https://qrv.network` | Verification, credentials, certificates, trust-layer infrastructure. |
| OMOS.OneGodian.com | `https://omos.onegodian.com` | Operating system, protocol documentation, model council, runtime node. |

---

## 9. Implementation Priority

### Phase 1 — Immediate

1. Add `/models/gemini` route and serve `src/pages/gemini-omos-homepage.html`.
2. Update `/models` cards so each model links to its own route.
3. Add model page content files for ChatGPT, Claude, and Grok.
4. Add `/sitemap` or `/docs/sitemap` route.

### Phase 2 — Tool Expansion

1. Add `/tools/belief-mapper`.
2. Add `/tools/declaration-generator`.
3. Add `/tools/gemini-pattern-explorer`.
4. Add `/tools/time-converter`.

### Phase 3 — Documentation Expansion

1. Add `/docs/protocol-spec`.
2. Add `/docs/algorithm-spec`.
3. Add `/docs/system-prompt`.
4. Add `/docs/compliance`.

---

## 10. Compliance Notes

- OMOS pages must not claim governmental authority, legal immunity, or authority over non-members.
- ONEGODIAN, LLC handles commerce, software, IP, education, and product operations.
- INO language belongs only where legally appropriate for body politic / religious society contexts.
- Gemini, ChatGPT, Claude, and Grok pages must not imply endorsement, certification, governance, or legal validation by the companies or model providers.
- Gregorian/civil records remain controlling for legal, financial, tax, banking, and institutional matters.
