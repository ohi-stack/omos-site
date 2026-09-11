const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");

const { OMOSProcess } = require("./src/runtime/omos");
const { runCouncil, getCouncilRun, listCouncilRuns, setHumanDecision, getPersistenceStatus } = require("./src/runtime/orchestrator");
const { verifyApiKey } = require("./src/runtime/keys");
const { rateLimit } = require("./src/runtime/rateLimit");

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
  "/","/omos","/workspace","/council","/ollm","/tools","/developers","/pricing",
  "/ohi","/models","/artifacts","/docs","/shop","/latest-news","/dashboard","/legal","/contact",
  "/protocol","/algorithm","/digital-sanctuary","/ohi-output-pipeline","/reference-run","/belief-mapper"
];

const pageMeta = {
  "/": ["OMOS — Make Better Decisions With AI","OMOS.OneGodian.com","OneGodian Metaphysical Operating System™","OMOS turns complex questions, conflicting AI answers, messy information, and difficult decisions into structured results users can understand, review, and revisit.","home.html"],
  "/omos": ["OMOS Architecture","OMOS","OMOS","Start with the OMOS operating model, architecture, Algorithm, O-H-I, standards, and current maturity.","omos.html"],
  "/workspace": ["OMOS Workspace","Workspace","OMOS Workspace","Ask OMOS, inspect governed runs, review decisions, documents, records, and runtime history.","workspace.html"],
  "/council": ["OMOS Council","Council","OMOS Council","Independent model outputs, cross-model review, governed synthesis, human review, and Council results.","council.html"],
  "/ollm": ["OneGodian LLM","OLLM","OneGodian LLM","The OneGodian intelligence layer, model gateway, knowledge interfaces, evaluations, and developer access.","ollm.html"],
  "/tools": ["OMOS Tools","Tools","OMOS Tools","Layer 1, Alignment, verification, intelligence, artifacts, and runtime utilities.","tools.html"],
  "/developers": ["OMOS Developer Hub","Developers","OMOS Developer Hub","APIs, connections, Engineering Council, standards, runtime status, and documentation.","developers.html"],
  "/pricing": ["OMOS Pricing","Pricing","OMOS Pricing","Free access, Decision Reports, AI Answer Compare, Personal, Pro, Team, Business, and implementation services, capability-gated by production readiness.","pricing.html"],
  "/ohi": ["O-H-I — OneGodian Hyper-Conscious Intelligence","O-H-I","O-H-I Runtime and Synthesis Layer","Multi-model comparison, cross-review, governed synthesis, and human-reviewed outputs.","ohi.html"],
  "/models": ["OMOS Model Connectors","Council of Models","Model Connectors and Council Health","Inspect provider configuration and separately verified health without exposing provider credentials.","models.html"],
  "/artifacts": ["OMOS Artifacts","Artifacts","Artifacts, Source Documents, and Runtime Evidence","Whitepapers, prompts, manifests, animations, schemas, and implementation records.","artifacts.html"],
  "/docs": ["OMOS Documentation Center","Documentation","OMOS Documentation","Public-safe and developer documentation for the live Functional runtime.","docs.html"],
  "/shop": ["OMOS Product Bridge","Shop","Products and Downloads","Commercial checkout remains on OneGodian.com while OMOS provides technical context and product pathways.","shop.html"],
  "/latest-news": ["OMOS Build Notes","Updates","OMOS News, Releases, and Build Status","Track implementation milestones, runtime changes, Council updates, and release status.","latest-news.html"],
  "/dashboard": ["OMOS Runtime Dashboard","Workspace","OMOS Runtime Dashboard","Runtime health, provider status, Council runs, manifests, and Decision Record history.","dashboard.html"],
  "/admin": ["OMOS Control Plane","Admin","OMOS Control Plane","Administrative execution and API management.","admin.html"],
  "/legal": ["OMOS Legal and Institutional Positioning","Compliance","Legal and Institutional Positioning","OMOS is a voluntary educational, identity-reflection, documentation, and runtime-support framework; civil law remains controlling.","legal.html"],
  "/contact": ["Contact OMOS","Contact","Contact and Ecosystem Links","Connect the runtime to the wider OneGodian ecosystem.","contact.html"],
  "/protocol": ["The OneGodian Protocol™","Protocol","The OneGodian Protocol™","Identity, semantic, agent, and interface guidance for OneGodian-controlled deployments and integrations.","protocol.html"],
  "/algorithm": ["The OneGodian Algorithm™","Algorithm","The OneGodian Algorithm™","Observe → Distill → Align → Select → Execute → Verify.","algorithm.html"],
  "/digital-sanctuary": ["The OneGodian Digital Sanctuary","Experience","The Digital Sanctuary Experience","Immersive, motion-led presentation of OneGodian identity and OMOS architecture.","digital-sanctuary.html"],
  "/ohi-output-pipeline": ["O-H-I Output Pipeline","Council","O-H-I Cross-Model Review Pipeline","Human Question → independent model outputs → cross-review → signals → human synthesis → governed output.","ohi-output-pipeline.html"],
  "/reference-run": ["OMOS-REF-0001 Production Proof","Verification","OMOS-REF-0001","The nine-gate production-proof standard for a complete, persistent, repeatable governed OMOS transaction.","reference-run.html"],
  "/belief-mapper": ["Belief Mapper — OMOS","Identity","Belief Mapper","Seven-dimensional belief reflection and journey-stage specification with explicit maturity and privacy boundaries.","belief-mapper.html"]
};

const megaMenu = [
  { label: "OMOS", groups: [
    ["Start Here", [["What Is OMOS?","/omos"],["How OMOS Works","/algorithm"],["Platform Overview","/"],["Roadmap","/latest-news"]]],
    ["Foundation", [["OneGodian Protocol™","/protocol"],["OneGodian Algorithm™","/algorithm"],["O-H-I™","/ohi"],["Digital Sanctuary","/digital-sanctuary"]]],
    ["Architecture", [["OMOS Architecture","/omos"],["Runtime Architecture","/docs"],["Reference Run","/reference-run"],["Decision Records","/dashboard"]]],
    ["O-H-I", [["Council of Models","/models"],["GCD Synthesis","/ohi"],["Output Pipeline","/ohi-output-pipeline"],["Human Review","/dashboard"]]],
    ["Standards", [["Runtime Specification","/docs"],["Compliance Test Suite","/docs"],["OTS-V5","/docs"],["Runtime Health","/api/health"]]],
    ["About", [["Development History","/latest-news"],["Maturity Model","/docs"],["Legal & Compliance","/legal"],["Contact","/contact"]]]
  ]},
  { label: "Workspace", groups: [
    ["Ask", [["Ask OMOS","/ask/"],["New Run","/ask/"],["Recent Runs","/dashboard"],["Templates","/tools"]]],
    ["Decisions", [["Decision Review","/ask/"],["Compare Options","/ask/"],["Human Review","/dashboard"],["Decision Records","/dashboard"]]],
    ["Documents", [["Document Review","/ask/"],["Artifacts","/artifacts"],["Saved Records","/dashboard"],["Documentation","/docs"]]],
    ["Projects", [["Project Analysis","/ask/"],["Project Runs","/dashboard"],["Build Notes","/latest-news"],["Implementation Help","/contact"]]],
    ["Records", [["Run History","/dashboard"],["Provider Provenance","/dashboard"],["Verification State","/dashboard"],["Persistence Status","/api/v1/persistence"]]],
    ["Account", [["Workspace Home","/workspace"],["Dashboard","/dashboard"],["App Console",APP_URL],["Pricing","/pricing"]]]
  ]},
  { label: "Council", groups: [
    ["AI Council", [["Council Overview","/council"],["Council Workspace","/ask/"],["Council of Models","/models"],["Recent Runs","/dashboard"]]],
    ["Models", [["OpenAI","/models"],["Anthropic Claude","/models"],["Google Gemini","/models"],["xAI Grok","/models"]]],
    ["Council Process", [["Independent Outputs","/ohi-output-pipeline"],["Cross-Model Review","/ohi-output-pipeline"],["Agreement Mapping","/ohi-output-pipeline"],["Contradictions","/ohi-output-pipeline"]]],
    ["Synthesis", [["Governed Synthesis","/ohi"],["GCD Synthesis","/ohi"],["Supported Dissent","/ohi"],["Confidence & Limits","/ohi"]]],
    ["Reviews", [["Human Review","/dashboard"],["Approval Gate","/dashboard"],["Verification Boundary","/docs"],["Council History","/dashboard"]]],
    ["Results", [["Decision Record","/dashboard"],["Run History","/dashboard"],["Provider Status","/api/v1/providers"],["Export & Evidence","/dashboard"]]]
  ]},
  { label: "OLLM", groups: [
    ["OneGodian LLM", [["OLLM Overview","/ollm"],["O-H-I Intelligence","/ohi"],["OMOS Integration","/omos"],["Roadmap","/latest-news"]]],
    ["Runtime", [["Runtime Dashboard","/dashboard"],["Provider Status","/api/v1/providers"],["Persistence","/api/v1/persistence"],["Health","/api/health"]]],
    ["Model Gateway", [["OpenAI","/models"],["Claude","/models"],["Gemini","/models"],["Grok","/models"]]],
    ["Knowledge", [["Documentation","/docs"],["Artifacts","/artifacts"],["Protocol","/protocol"],["Algorithm","/algorithm"]]],
    ["Evaluations", [["Alignment Engine","/tools"],["Layer 1","/tools"],["Council Review","/council"],["Verification","/tools"]]],
    ["Developers", [["Developer Hub","/developers"],["API Manifest","/api/manifest"],["Schemas & Specs","/docs"],["Contact","/contact"]]]
  ]},
  { label: "Tools", groups: [
    ["Layer 1", [["Layer 1 Tools","/tools"],["Prompt Intake","/ask/"],["Distillation","/tools"],["Signal Classification","/tools"]]],
    ["Alignment", [["Alignment Engine","/tools"],["Algorithm","/algorithm"],["Decision Review","/ask/"],["Execution Readiness","/tools"]]],
    ["Identity", [["Belief Mapper","/belief-mapper"],["Identity Tools","/tools"],["Declaration Tools","/tools"],["Digital Sanctuary","/digital-sanctuary"]]],
    ["Verification", [["Verification Tools","/tools"],["Decision Records","/dashboard"],["Persistence","/api/v1/persistence"],["Compliance","/legal"]]],
    ["Intelligence", [["Council of Models","/models"],["Output Pipeline","/ohi-output-pipeline"],["Governed Synthesis","/ohi"],["O-H-I","/ohi"]]],
    ["All Tools", [["Tools Home","/tools"],["Documentation","/docs"],["Artifacts","/artifacts"],["Workspace","/workspace"]]]
  ]},
  { label: "Developers", groups: [
    ["Developer Hub", [["Developers","/developers"],["Getting Started","/docs"],["Documentation","/docs"],["GitHub","https://github.com/ohi-stack/omos-site"]]],
    ["APIs", [["API Manifest","/api/manifest"],["Health API","/api/health"],["Provider API","/api/v1/providers"],["Persistence API","/api/v1/persistence"]]],
    ["Connections", [["Model Connectors","/models"],["Data Connectors","/developers"],["App Console",APP_URL],["QuantumOHI",QUANTUM_OHI_URL]]],
    ["Engineering", [["Engineering Council","/developers"],["Reference Run","/reference-run"],["Build Notes","/latest-news"],["Production Evidence","/reference-run"]]],
    ["Standards", [["OneGodian Protocol™","/protocol"],["OneGodian Algorithm™","/algorithm"],["O-H-I","/ohi"],["Compliance","/legal"]]],
    ["Runtime", [["Runtime Dashboard","/dashboard"],["Manifest","/api/manifest"],["Providers","/api/v1/providers"],["History","/dashboard"]]]
  ]},
  { label: "Pricing", groups: [
    ["Free", [["Ask OMOS","/ask/"],["Tools","/tools"],["Belief Mapper","/belief-mapper"],["Start Here","/omos"]]],
    ["Pro", [["OMOS Pro","/pricing"],["Saved History","/dashboard"],["Decision Records","/dashboard"],["Get Started","/pricing"]]],
    ["Council", [["OMOS Council","/pricing"],["AI Council","/council"],["Multi-Model Review","/models"],["Get Council","/pricing"]]],
    ["Business", [["OMOS Business","/pricing"],["Decision Governance","/pricing"],["Developer Access","/developers"],["Contact Sales","/contact"]]],
    ["Services", [["Decision Review","/pricing"],["AI Council Review","/pricing"],["Document Review","/pricing"],["Implementation Services","/contact"]]],
    ["Shop", [["OMOS Shop","/shop"],["OneGodian.com",STORE_URL],["Products & Downloads","/shop"],["Product Docs","/docs"]]]
  ]}
];

function manifestPayload() {
  const persistence = getPersistenceStatus();
  return {
    id: "omos-site", name: "OMOS Runtime", fullName: "OMOS — OneGodian Metaphysical Operating System", version: OMOS_VERSION,
    status: "functional", environment: process.env.NODE_ENV || "development", canonicalHost: CANONICAL_HOST,
    ui: { designSystem: "OMOS UI v2.1 — Customer-First Operational Workspace", sharedHeader: true, sharedFooter: true, megaMenu: true, megaMenuColumns: 6, responsive: true, assets: ["/omos-ui.css","/mega-menu-v2.css","/omos-ui.js","/ask-workspace.js"] },
    navigation: megaMenu.map((item) => ({ label: item.label, groups: item.groups.map(([title]) => title) })),
    routes: { public: [...publicRoutes, "/ask/"], api: ["/health","/manifest","/api/health","/api/manifest","/process","/api/v1/council/run","/api/v1/council/runs","/api/v1/council/runs/:id","/api/v1/council/runs/:id/human-decision","/api/v1/providers","/api/v1/persistence"] },
    endpoints: {
      health: { method: "GET", path: "/health", authRequired: false }, manifest: { method: "GET", path: "/api/manifest", authRequired: false },
      process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" }, councilRun: { method: "POST", path: "/api/v1/council/run", authRequired: true, authHeader: "x-omos-key" },
      councilRuns: { method: "GET", path: "/api/v1/council/runs", authRequired: true, authHeader: "x-omos-key" }, councilRunRecord: { method: "GET", path: "/api/v1/council/runs/:id", authRequired: true, authHeader: "x-omos-key" },
      humanDecision: { method: "POST", path: "/api/v1/council/runs/:id/human-decision", authRequired: true, authHeader: "x-omos-key" }, providers: { method: "GET", path: "/api/v1/providers", authRequired: false }, persistence: { method: "GET", path: "/api/v1/persistence", authRequired: false }
    },
    orchestration: { modes: ["simulation","hybrid","live"], providers: ["openai","anthropic","gemini","xai"], stages: ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"], rounds: ["independent_outputs","cross_model_review","human_synthesis"], crossReviewMatrix: "4x4 excluding self-review", signals: ["agreement_zones","contradictions","missing_evidence","novel_insights"], humanReviewRequired: true, modelAgreementIsNotFactualVerification: true, runRecord: true, runRecordStorage: persistence.backend, durableStorageStatus: persistence.durable ? "configured" : "memory_fallback_not_durable", persistence },
    wordpressPlugin: { compatibleHosts: ALLOWED_PLUGIN_ORIGINS, requiredEndpoints: ["/api/health","/api/manifest","/api/v1/providers"], shortcodes: ["[omos_manifest]","[omos_runtime_status]","[omos_bridge_builder]","[omos_tool_grid]","[omos_docs_grid]","[omos_ohi_pipeline]"], pluginTargets: ["OneGodian.com","OneGodian.org","QuantumOHI.com"] },
    commerceBridge: { primaryStore: STORE_URL, target: STORE_URL }, appBridge: { target: APP_URL, recommendedWidgets: ["runtime_health","provider_status","recent_council_runs","run_record","verification_status"] },
    links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
  };
}

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

function requireApiKey(req,res,next){const meta=verifyApiKey(req.headers["x-omos-key"]);if(!meta)return res.status(401).json({error:"unauthorized",message:"A valid x-omos-key header is required."});req.apiKeyMeta=meta;next();}
function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
function megaHtml(item,index){const groups=item.groups.map(([title,links])=>`<div class="omos-mega-group"><div class="omos-mega-title">${escapeHtml(title)}</div>${links.map(([label,href])=>`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}</div>`).join("");return `<div class="omos-nav-item"><button class="omos-nav-button" aria-expanded="false" aria-controls="mega-${index}">${escapeHtml(item.label)} <span>⌄</span></button><div class="omos-mega" id="mega-${index}">${groups}</div></div>`;}
function homeMegaHtml(item){const groups=item.groups.map(([title,items])=>`<div class="home-mega-group"><span class="home-mega-title">${escapeHtml(title)}</span>${items.map(([label,href])=>`<a href="${escapeHtml(href)}">${escapeHtml(label)}<span aria-hidden="true">↗</span></a>`).join("")}</div>`).join("");return `<details class="nav-group"><summary>${escapeHtml(item.label)}</summary><div class="mega-panel mega-panel-v2"><div class="home-mega-grid">${groups}</div></div></details>`;}
function applyHomeNavigation(html){
  let out=String(html||"").replace(/<div class="nav-groups">[\s\S]*?<\/div>\s*<div class="nav-actions">/,`<div class="nav-groups">${megaMenu.map(homeMegaHtml).join("")}</div><div class="nav-actions">`);
  const hero=`<section class="hero" id="top"><div class="eyebrow"><span class="live-dot"></span>OMOS • Governed AI Decisions • Human-reviewed</div><h1>Make Better Decisions With AI.<br /><span>Distill. Compare. Review. Record.</span></h1><p class="hero-copy">OMOS turns complex questions, conflicting AI answers, messy information, and difficult decisions into structured results you can understand, review, and revisit.</p><div class="hero-actions"><a class="button button-primary" href="/ask/">ASK OMOS <span aria-hidden="true">→</span></a><a class="button button-quiet" href="/workspace">See how OMOS works ↗</a></div><div class="hero-formula" aria-label="OMOS governed decision workflow"><div class="formula-model formula-cyan"><b>Distill</b><span>clarify the problem</span></div><i>+</i><div class="formula-model formula-violet"><b>Compare</b><span>multiple perspectives</span></div><i>+</i><div class="formula-model formula-blue"><b>Review</b><span>evidence + dissent</span></div><i>→</i><div class="formula-result"><span class="result-orbit"></span><b>Decision</b><span>human-reviewed record</span></div></div><div class="trust-strip"><div><strong>7-stage governed workflow</strong><span>Ask → Layer 1 → Align → Council → Synthesis → Human Gate → Record</span></div><div><strong>Provider-aware Council</strong><span>Configuration and verified health remain distinct</span></div><div><strong>Evidence-gated production claims</strong><span>Repository ≠ deployment ≠ production proof</span></div></div></section>`;
  out=out.replace(/<section class="hero" id="top">[\s\S]*?<\/section>/,hero);
  out=out.replace(/<title>[\s\S]*?<\/title>/i,'<title>OMOS — Make Better Decisions With AI | OneGodian Metaphysical Operating System</title>');
  out=out.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/i,'<meta name="description" content="OMOS turns complex questions, conflicting AI answers, messy information, and difficult decisions into structured results you can understand, review, and revisit." />');
  if(!out.includes('/mega-menu-v2.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/mega-menu-v2.css"></head>');
  return out;
}
function shellHeader(){return `<header class="omos-site-header"><div class="omos-header-inner"><a class="omos-brand" href="/"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>Operational Intelligence</small><strong>OMOS.OneGodian.com</strong></span></a><nav class="omos-nav" aria-label="Primary navigation">${megaMenu.map(megaHtml).join("")}</nav><div class="omos-header-actions"><a class="omos-btn" href="/api/health">Runtime</a><a class="omos-btn" href="/dashboard">Sign In</a><a class="omos-btn omos-btn-primary" href="/ask/">Ask OMOS</a><button class="omos-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button></div></div></header>`;}
function shellFooter(){return `<footer class="omos-site-footer"><div class="omos-footer-inner"><div class="omos-footer-grid"><div class="omos-footer-brand"><div class="omos-brand"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>OneGodian</small><strong>OMOS Runtime</strong></span></div><p>Operational intelligence, multi-model orchestration, documentation, and controlled execution infrastructure. Functional components remain subject to documented maturity limits and human review.</p></div><div class="omos-footer-col"><h4>Workspace</h4><a href="/ask/">Ask OMOS</a><a href="/workspace">Workspace</a><a href="/dashboard">History</a><a href="/tools">Tools</a></div><div class="omos-footer-col"><h4>Council</h4><a href="/council">AI Council</a><a href="/models">Models</a><a href="/ohi-output-pipeline">Output Pipeline</a><a href="/ohi">O-H-I</a></div><div class="omos-footer-col"><h4>Developers</h4><a href="/developers">Developer Hub</a><a href="/docs">Documentation</a><a href="/api/manifest">Manifest</a><a href="/reference-run">Production Proof</a></div><div class="omos-footer-col"><h4>Ecosystem</h4><a href="${ORG_URL}">OneGodian.org</a><a href="${STORE_URL}">OneGodian.com</a><a href="${APP_URL}">App.OneGodian.com</a><a href="${QUANTUM_OHI_URL}">QuantumOHI.com</a></div></div><div class="omos-footer-bottom"><span>OMOS Runtime ${OMOS_VERSION} · Component maturity: Functional where implemented</span><span><a href="/pricing">Pricing</a> · <a href="/legal">Legal</a> · <a href="/contact">Contact</a></span></div></div></footer>`;}
function pageTopper(route){const meta=pageMeta[route]||pageMeta["/"];return `<div class="omos-page-topper"><div class="omos-breadcrumbs">OMOS / ${escapeHtml(meta[1])}</div><div class="omos-status-pill">Functional Runtime</div></div>`;}
function applyGlobalShell(html,route){let out=String(html||"");if(!/<html/i.test(out))out=`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${out}</body></html>`;if(!out.includes('/omos-ui.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/omos-ui.css"><link rel="stylesheet" href="/mega-menu-v2.css"></head>');else if(!out.includes('/mega-menu-v2.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/mega-menu-v2.css"></head>');out=out.replace(/<body([^>]*)>/i,`<body$1 class="omos-shell-active"><div class="omos-global-content">${shellHeader()}${pageTopper(route)}`);out=out.replace(/<\/body>/i,`${shellFooter()}</div><script src="/omos-ui.js" defer></script></body>`);return out;}
function renderGeneratedPage(route){const meta=pageMeta[route]||pageMeta["/"];const cards=[["Ask OMOS","Run a governed question through the OMOS workspace.","/ask/"],["Operational Workspace","Inspect runs, decisions, providers, and history.","/dashboard"],["Documentation","Read the runtime, Algorithm, Protocol, and integration documentation.","/docs"]].map(([t,d,h])=>`<a href="${h}" style="display:block;padding:24px;border:1px solid rgba(255,255,255,.09);border-radius:20px;text-decoration:none;background:rgba(255,255,255,.035)"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></a>`).join("");return applyGlobalShell(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(meta[0])}</title></head><body><main style="max-width:1100px;margin:0 auto;padding:72px 24px"><div style="color:#f0d98a;text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800">${escapeHtml(meta[1])}</div><h1>${escapeHtml(meta[2])}</h1><p style="max-width:850px;font-size:18px">${escapeHtml(meta[3])}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:34px">${cards}</div></main></body></html>`,route);}
function sendPage(res,route){const meta=pageMeta[route]||pageMeta["/"];const filePath=meta[4]?path.join(__dirname,"src/pages",meta[4]):null;if(filePath&&fs.existsSync(filePath)){const html=fs.readFileSync(filePath,"utf8");if(route==="/")return res.send(applyHomeNavigation(html));if(route==="/admin")return res.send(html);return res.send(applyGlobalShell(html,route));}return res.send(renderGeneratedPage(route));}

function providerStatus(){return ["openai","anthropic","gemini","xai"].map((name)=>{try{const adapter=require(`./src/adapters/${name}`);const configured=Boolean(adapter.isConfigured());return{provider:name,configured,status:configured?"configured_untested":"simulation_only",healthVerified:false};}catch(error){return{provider:name,configured:false,status:"adapter_error",healthVerified:false};}});}
function healthPayload(){const manifest=manifestPayload();const providers=providerStatus();return{status:"ok",service:manifest.id,version:OMOS_VERSION,environment:manifest.environment,canonicalHost:CANONICAL_HOST,ui:manifest.ui,persistence:getPersistenceStatus(),publicRouteCount:publicRoutes.length,orchestration:{providers,configuredProviderCount:providers.filter((p)=>p.configured).length,liveProviderCount:providers.filter((p)=>p.healthVerified).length,providerHealthVerification:"not_implemented",crossModelReview:true,runRecordApi:true,humanDecisionApi:true,durablePersistence:getPersistenceStatus().durable}};}

app.get(["/health","/api/health"],(req,res)=>res.json(healthPayload()));
app.get(["/manifest","/api/manifest"],(req,res)=>res.json({...manifestPayload(),providerStatus:providerStatus(),generatedAtUtc:new Date().toISOString()}));
app.get("/api/v1/providers",(req,res)=>res.json({status:"ok",providers:providerStatus()}));
app.get("/api/v1/persistence",(req,res)=>res.json({status:"ok",persistence:getPersistenceStatus()}));
for(const route of publicRoutes){app.get(route,(req,res)=>sendPage(res,route));app.get(`${route}/`,(req,res)=>sendPage(res,route));}
app.get("/admin",(req,res)=>sendPage(res,"/admin"));
app.post("/process",requireApiKey,rateLimit(),(req,res)=>{const result=OMOSProcess(req.body);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:result});});
app.post("/api/v1/council/run",requireApiKey,rateLimit(),async(req,res)=>{try{const data=await runCouncil({prompt:req.body.prompt||req.body.input||req.body.question,context:req.body.context||{},providers:Array.isArray(req.body.providers)?req.body.providers:undefined,mode:req.body.mode||"auto"});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data});}catch(error){const status=error.message==="prompt_required"||error.message==="provider_required"?400:500;res.status(status).json({error:"council_run_failed",message:error.message});}});
app.get("/api/v1/council/runs",requireApiKey,async(req,res)=>{try{const data=await listCouncilRuns(req.query.limit);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_history_failed",message:error.message});}});
app.get("/api/v1/council/runs/:id",requireApiKey,async(req,res)=>{try{const record=await getCouncilRun(req.params.id);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_read_failed",message:error.message});}});
app.post("/api/v1/council/runs/:id/human-decision",requireApiKey,rateLimit(),async(req,res)=>{try{const decision=String(req.body.decision||'').toUpperCase();if(!['APPROVED','REJECTED'].includes(decision))return res.status(400).json({error:"invalid_human_decision",message:"decision must be APPROVED or REJECTED"});const record=await setHumanDecision(req.params.id,decision,req.body.comment||'',req.apiKeyMeta.name);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"human_decision_failed",message:error.message});}});
app.use(express.static(path.join(__dirname,"public"),{redirect:false}));
app.use((req,res)=>res.status(404).json({error:"not_found",message:"Route not found in OMOS runtime manifest.",manifest:"/manifest"}));
app.listen(Number(PORT)||3000,"0.0.0.0",()=>console.log(`OMOS running on ${PORT} · persistence=${getPersistenceStatus().backend}`));
