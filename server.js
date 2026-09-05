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
const QUANTUM_OHI_URL = process.env.QUANTUM_OHI_URL || "https://quantumohi.com";
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`).split(",").map((x) => x.trim()).filter(Boolean);

const publicRoutes = ["/","/omos","/ohi","/models","/tools","/artifacts","/docs","/shop","/latest-news","/dashboard","/legal","/contact","/protocol","/algorithm","/digital-sanctuary","/ohi-output-pipeline","/ollm","/developers","/pricing"];

const pageMeta = {
  "/": ["OMOS — OneGodian Metaphysical Operating System","OMOS.OneGodian.com","OneGodian Metaphysical Operating System™","Operational intelligence, governed multi-model synthesis, runtime tools, and cross-site infrastructure for the OneGodian ecosystem.","home.html"],
  "/omos": ["OMOS Architecture","Operating Layer","OMOS Architecture","The orchestration, routing, documentation, and runtime layer connecting OneGodian identity, OHI synthesis, tools, pages, and integrations.","omos.html"],
  "/ohi": ["OHI — OneGodian Hyper-Conscious Intelligence","Intelligence Layer","OHI Runtime and Synthesis Layer","Multi-model comparison, cross-review, governed synthesis, and human-reviewed outputs.","ohi.html"],
  "/models": ["OMOS Model Council","Council of Models","Multi-Model Reasoning and Comparison","Independent model perspectives are compared without treating model agreement as factual verification.","models.html"],
  "/tools": ["OMOS Tools","Execution Tools","Tools for Distillation, Alignment, Identity, and Runtime Execution","Interactive utilities convert documented OMOS concepts into testable workflows.","tools.html"],
  "/artifacts": ["OMOS Artifacts","Source Materials","Artifacts, Source Documents, and Runtime Evidence","Whitepapers, prompts, manifests, animations, schemas, and implementation records.","artifacts.html"],
  "/docs": ["OMOS Documentation Center","Documentation","Documentation for OMOS, OHI, Protocol, and Algorithm","Public-safe and developer documentation for the live Functional runtime.","docs.html"],
  "/shop": ["OMOS Product Bridge","Commerce Bridge","Products and Downloads","Commercial checkout remains on OneGodian.com while OMOS provides technical context and product pathways.","shop.html"],
  "/latest-news": ["OMOS Build Notes","Updates","OMOS News, Releases, and Build Status","Track implementation milestones, runtime changes, Council updates, and release status.","latest-news.html"],
  "/dashboard": ["OMOS Runtime Dashboard","Runtime Dashboard","OMOS Runtime Dashboard","Runtime health, provider status, Council runs, manifests, and app.OneGodian.com handoff.","dashboard.html"],
  "/admin": ["OMOS Admin Handoff","Admin","OMOS Admin Handoff","Administrative execution belongs in authenticated app and WordPress control surfaces.",null],
  "/legal": ["OMOS Legal and Institutional Positioning","Compliance","Legal and Institutional Positioning","OMOS is a voluntary educational, identity-reflection, documentation, and runtime-support framework; civil law remains controlling.","legal.html"],
  "/contact": ["Contact OMOS","Contact","Contact and Ecosystem Links","Connect the runtime to the wider OneGodian ecosystem.","contact.html"],
  "/protocol": ["The OneGodian Protocol™","Protocol","The OneGodian Protocol™","Identity, semantic, agent, and interface guidance for OneGodian-controlled deployments and integrations.","protocol.html"],
  "/algorithm": ["The OneGodian Algorithm™","Algorithm","The OneGodian Algorithm™","Observe → Distill → Align → Select → Execute → Verify.","algorithm.html"],
  "/digital-sanctuary": ["The OneGodian Digital Sanctuary","Experience","The Digital Sanctuary Experience","Immersive, motion-led presentation of OneGodian identity and OMOS architecture.","digital-sanctuary.html"],
  "/ohi-output-pipeline": ["OHI Output Pipeline","Council Runtime","OHI Cross-Model Review Pipeline","Human Question → independent model outputs → cross-review → signals → human synthesis → governed output.","ohi-output-pipeline.html"],
  "/ollm": ["OneGodian LLM","OLLM","OneGodian LLM (OLLM)","The model and intelligence layer designed to work inside OMOS alongside external provider models, governed by the OneGodian Protocol, Algorithm, and OHI synthesis architecture.",null],
  "/developers": ["OMOS Developer Hub","Developers","Build on OMOS","Developer documentation, APIs, runtime manifests, model connections, health surfaces, and integration contracts for OMOS-compatible systems.",null],
  "/pricing": ["OMOS Pricing","Pricing","Choose the OMOS experience that fits your work","Start with Ask OMOS, then move into governed decision review, Council workflows, professional subscriptions, business usage, or implementation support as those commercial capabilities are activated.",null]
};

// OMOS Mega Menu v2.1 — user-action architecture.
// Until dedicated child routes are implemented, links intentionally land on the closest live workspace or documentation surface.
const megaMenu = [
  { label: "OMOS", groups: [
    ["Start Here", [["What Is OMOS?","/omos"],["How OMOS Works","/algorithm"],["Why OMOS","/omos"],["Getting Started","/docs"],["Platform Overview","/"],["Roadmap","/latest-news"]]],
    ["Foundation", [["OneGodian Protocol™","/protocol"],["OneGodian Algorithm™","/algorithm"],["OneGodian Principle","/protocol"],["Digital Sanctuary","/digital-sanctuary"],["OneGodian Framework","/omos"],["Founder & Origin","/omos"]]],
    ["Architecture", [["OMOS Architecture","/omos"],["Runtime Architecture","/dashboard"],["System Layers","/omos"],["Reference Run","/docs"],["Decision Records","/dashboard"],["Architecture Diagrams","/docs"]]],
    ["OHI", [["What Is OHI?","/ohi"],["Council of Models","/models"],["GCD Model Synthesis","/ohi"],["OHI Output Pipeline","/ohi-output-pipeline"],["Governed Synthesis","/ohi-output-pipeline"],["Human Review","/dashboard"]]],
    ["Standards", [["OMOS-1.0","/docs"],["OMOS Runtime Specification","/docs"],["OMOS Compliance Test Suite","/docs"],["Prompt Enforcement Profile","/docs"],["Robotics Profile","/docs"],["OTS-V5","/artifacts"]]],
    ["About", [["About OMOS","/omos"],["Founder","/omos"],["Development History","/latest-news"],["Maturity Model","/docs"],["Institutional Positioning","/legal"],["Legal & Compliance","/legal"]]]
  ]},
  { label: "WORKSPACE", groups: [
    ["Ask", [["Ask OMOS","/ask/"],["New Run","/ask/"],["Guided Question","/ask/"],["Recent Runs","/dashboard"],["Templates","/ask/"],["Saved Prompts","/dashboard"]]],
    ["Decisions", [["Decision Review","/ask/"],["Compare Options","/ask/"],["Decision Workspace","/dashboard"],["Recommendations","/dashboard"],["Human Approval","/dashboard"],["Decision History","/dashboard"]]],
    ["Documents", [["Document Review","/ask/"],["Upload Document","/ask/"],["Analyze Claims","/ask/"],["Risks & Contradictions","/ask/"],["Saved Documents","/dashboard"],["Review History","/dashboard"]]],
    ["Projects", [["My Projects","/dashboard"],["New Project","/dashboard"],["Project Workspace","/dashboard"],["Project Decisions","/dashboard"],["Project Evidence","/dashboard"],["Project History","/dashboard"]]],
    ["Records", [["Decision Records","/dashboard"],["Evidence Records","/dashboard"],["Council Records","/dashboard"],["Approval Records","/dashboard"],["Exports","/dashboard"],["Audit History","/dashboard"]]],
    ["Account", [["Dashboard","/dashboard"],["Usage",APP_URL],["Plan","/pricing"],["Billing",APP_URL],["Settings",APP_URL],["Security",APP_URL]]]
  ]},
  { label: "COUNCIL", groups: [
    ["AI Council", [["Start AI Council","/ask/"],["Council Workspace","/dashboard"],["How Council Works","/models"],["Council Modes","/models"],["Recent Councils","/dashboard"],["Saved Results","/dashboard"]]],
    ["Models", [["OpenAI","/models"],["Anthropic Claude","/models"],["Google Gemini","/models"],["xAI Grok","/models"],["OLLM","/ollm"],["Provider Status","/api/v1/providers"]]],
    ["Council Process", [["Independent Outputs","/ohi-output-pipeline"],["Cross-Model Review","/ohi-output-pipeline"],["Agreement Zones","/ohi-output-pipeline"],["Contradictions","/ohi-output-pipeline"],["Missing Information","/ohi-output-pipeline"],["Supported Dissent","/ohi-output-pipeline"]]],
    ["Synthesis", [["OHI Synthesis","/ohi"],["GCD Synthesis","/ohi"],["Governed Output","/ohi-output-pipeline"],["Alternatives","/dashboard"],["Uncertainty","/dashboard"],["Recommendations","/dashboard"]]],
    ["Reviews", [["Cross-Review Matrix","/models"],["Evidence Review","/dashboard"],["Alignment Review","/tools"],["Human Review","/dashboard"],["Verification State","/dashboard"],["Revisions","/dashboard"]]],
    ["Results", [["Council Records","/dashboard"],["Saved Syntheses","/dashboard"],["Compare Runs","/dashboard"],["Exports","/dashboard"],["Provenance","/dashboard"],["History","/dashboard"]]]
  ]},
  { label: "OLLM", groups: [
    ["OneGodian LLM", [["What Is OLLM?","/ollm"],["OLLM Overview","/ollm"],["Architecture","/ollm"],["Use Cases","/ollm"],["Roadmap","/latest-news"],["Status","/api/health"]]],
    ["Runtime", [["Local Runtime","/ollm"],["Inference Engine","/ollm"],["Models","/models"],["Runtime Health","/api/health"],["Version","/api/manifest"],["Performance","/dashboard"]]],
    ["Model Gateway", [["OMOS Model Gateway","/models"],["Provider Routing","/models"],["Local OLLM","/ollm"],["External Models","/models"],["Model Selection","/models"],["Failover","/models"]]],
    ["Knowledge", [["Knowledge Base","/artifacts"],["OneGodian Corpus","/artifacts"],["Retrieval","/ollm"],["Context","/ollm"],["Memory","/ollm"],["Provenance","/dashboard"]]],
    ["Evaluations", [["Model Evaluations","/ollm"],["Alignment Tests","/tools"],["Regression Tests","/docs"],["Benchmark Runs","/dashboard"],["Safety Tests","/docs"],["Evaluation History","/dashboard"]]],
    ["Developers", [["OLLM API","/developers"],["OpenAI-Compatible API","/developers"],["SDKs","/developers"],["Integration Guide","/docs"],["Model Adapter","/developers"],["Developer Access","/developers"]]]
  ]},
  { label: "TOOLS", groups: [
    ["Layer 1", [["Layer 1 Distillation","/tools"],["Prompt Cleaner","/tools"],["Signal Classifier","/tools"],["Constraint Extractor","/tools"],["Contradiction Detector","/tools"],["Injection Scanner","/tools"]]],
    ["Alignment", [["Alignment Engine","/tools"],["Alignment Score","/tools"],["Hard Gates","/tools"],["Evidence Support","/tools"],["Verifiability","/tools"],["Execution Readiness","/tools"]]],
    ["Identity", [["Belief Mapper","/tools"],["Declaration Generator","/tools"],["Identity Engine","/tools"],["Journey Stages","/tools"],["Community Matcher","/tools"],["Identity Profile","/tools"]]],
    ["Verification", [["Verification Engine","/tools"],["Evidence Review","/tools"],["Compliance Tests","/docs"],["OMOS-CTS","/docs"],["Runtime Checker","/api/health"],["Decision Verification","/dashboard"]]],
    ["Intelligence", [["Bridge-Builder","/tools"],["OHI Output Pipeline","/ohi-output-pipeline"],["GCD Synthesis","/ohi"],["Council Simulator","/models"],["Protocol Explorer","/protocol"],["Decision Engine","/ask/"]]],
    ["All Tools", [["Tool Directory","/tools"],["Featured Tools","/tools"],["New Tools","/latest-news"],["Developer Tools","/developers"],["Experimental Tools","/tools"],["Tool Status","/api/health"]]]
  ]},
  { label: "DEVELOPERS", groups: [
    ["Developer Hub", [["Getting Started","/developers"],["Architecture","/omos"],["Quickstart","/developers"],["Examples","/docs"],["SDKs","/developers"],["Changelog","/latest-news"]]],
    ["APIs", [["API Reference","/developers"],["Ask OMOS API","/developers"],["Council API","/developers"],["Alignment API","/developers"],["Decision Records API","/developers"],["Verification API","/developers"]]],
    ["Connections", [["Connection Hub","/developers"],["Model Connectors","/api/v1/providers"],["Data Connectors","/developers"],["Action Connectors","/developers"],["Environment Connectors","/developers"],["Custom Adapters","/developers"]]],
    ["Engineering", [["Engineering Council","/developers"],["GitHub Integration","/developers"],["Agent Assignment","/developers"],["Pull Requests","/developers"],["CI / Testing","/developers"],["Deployment Proof","/docs"]]],
    ["Standards", [["OMOS Protocol","/protocol"],["Data Schemas","/docs"],["Alignment Standard","/docs"],["Compliance Test Suite","/docs"],["Prompt Enforcement","/docs"],["Robotics Profile","/docs"]]],
    ["Runtime", [["Runtime Status","/api/health"],["Health","/api/health"],["Persistence","/api/v1/persistence"],["Providers","/api/v1/providers"],["Manifest","/api/manifest"],["System Logs","/dashboard"]]]
  ]},
  { label: "PRICING", groups: [
    ["Free", [["Ask OMOS Free","/ask/"],["Basic Analysis","/pricing"],["Limited Runs","/pricing"],["Learn OMOS","/docs"],["Belief Mapper","/tools"],["Create Account",APP_URL]]],
    ["Pro", [["Pro Workspace","/pricing"],["Saved Decision Records","/pricing"],["More Runs","/pricing"],["Document Analysis","/pricing"],["History","/pricing"],["Exports","/pricing"]]],
    ["Council", [["AI Council","/pricing"],["Multi-Model Runs","/pricing"],["Cross-Review","/pricing"],["Governed Synthesis","/pricing"],["Council History","/pricing"],["Advanced Results","/pricing"]]],
    ["Business", [["Team Workspace","/pricing"],["Business Records","/pricing"],["AI Governance","/pricing"],["Higher Limits","/pricing"],["Team Controls","/pricing"],["Business Support","/pricing"]]],
    ["Services", [["Decision Review","/pricing"],["OMOS Implementation","/pricing"],["Workflow Design","/pricing"],["Business AI Governance","/pricing"],["Integration Services","/pricing"],["Training","/pricing"]]],
    ["Shop", [["Developer Kit","/shop"],["Protocol Documents","/shop"],["Algorithm Resources","/shop"],["Digital Products","/shop"],["Reference Standards","/shop"],["All Products",STORE_URL]]]
  ]}
];

function manifestPayload() {
  const persistence = getPersistenceStatus();
  return {
    id: "omos-site", name: "OMOS Runtime", fullName: "OMOS — OneGodian Metaphysical Operating System", version: OMOS_VERSION,
    status: "functional", environment: process.env.NODE_ENV || "development", canonicalHost: CANONICAL_HOST,
    ui: { designSystem: "OMOS UI v2.1 — Operational Workspace", sharedHeader: true, sharedFooter: true, megaMenu: true, megaMenuVersion: "2.1", responsive: true, assets: ["/omos-ui.css","/omos-ui.js","/ask-workspace.js"] },
    navigation: megaMenu.map((item) => ({ label: item.label })),
    routes: { public: [...publicRoutes, "/ask/"], api: ["/health","/manifest","/api/health","/api/manifest","/process","/api/v1/council/run","/api/v1/council/runs","/api/v1/council/runs/:id","/api/v1/council/runs/:id/human-decision","/api/v1/providers","/api/v1/persistence"] },
    endpoints: {
      health: { method: "GET", path: "/health", authRequired: false }, manifest: { method: "GET", path: "/api/manifest", authRequired: false },
      process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" }, councilRun: { method: "POST", path: "/api/v1/council/run", authRequired: true, authHeader: "x-omos-key" },
      councilRuns: { method: "GET", path: "/api/v1/council/runs", authRequired: true, authHeader: "x-omos-key" }, councilRunRecord: { method: "GET", path: "/api/v1/council/runs/:id", authRequired: true, authHeader: "x-omos-key" },
      humanDecision: { method: "POST", path: "/api/v1/council/runs/:id/human-decision", authRequired: true, authHeader: "x-omos-key" }, providers: { method: "GET", path: "/api/v1/providers", authRequired: false }, persistence: { method: "GET", path: "/api/v1/persistence", authRequired: false }
    },
    orchestration: { modes: ["simulation","hybrid","live"], providers: ["openai","anthropic","gemini","xai"], stages: ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"], rounds: ["independent_outputs","cross_model_review","human_synthesis"], crossReviewMatrix: "4x4 excluding self-review", signals: ["agreement_zones","contradictions","missing_evidence","novel_insights"], humanReviewRequired: true, modelAgreementIsNotFactualVerification: true, runRecord: true, runRecordStorage: persistence.backend, durableStorageStatus: persistence.durable ? "configured" : "memory_fallback_not_durable", persistence },
    wordpressPlugin: { compatibleHosts: ALLOWED_PLUGIN_ORIGINS, requiredEndpoints: ["/api/health","/api/manifest","/api/v1/providers"], shortcodes: ["[omos_manifest]","[omos_runtime_status]","[omos_bridge_builder]","[omos_tool_grid]","[omos_docs_grid]","[omos_ohi_pipeline]"], pluginTargets: ["OneGodian.com","OneGodian.org","QuantumOHI.com"] },
    appBridge: { target: APP_URL, recommendedWidgets: ["runtime_health","provider_status","recent_council_runs","run_record","verification_status"] },
    links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
  };
}

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

function requireApiKey(req,res,next){const meta=verifyApiKey(req.headers["x-omos-key"]);if(!meta)return res.status(401).json({error:"unauthorized",message:"A valid x-omos-key header is required."});req.apiKeyMeta=meta;next();}
function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
function megaHtml(item,index){const groups=item.groups.map(([title,links])=>`<div class="omos-mega-group"><div class="omos-mega-title">${escapeHtml(title)}</div>${links.map(([label,href])=>`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}</div>`).join("");return `<div class="omos-nav-item"><button class="omos-nav-button" aria-expanded="false" aria-controls="mega-${index}">${escapeHtml(item.label)} <span>⌄</span></button><div class="omos-mega" id="mega-${index}">${groups}</div></div>`;}
function shellHeader(){return `<header class="omos-site-header"><div class="omos-header-inner"><a class="omos-brand" href="/"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>Operational Intelligence</small><strong>OMOS.OneGodian.com</strong></span></a><nav class="omos-nav" aria-label="Primary navigation">${megaMenu.map(megaHtml).join("")}</nav><div class="omos-header-actions"><a class="omos-btn" href="/api/health">Runtime ● Functional</a><a class="omos-btn" href="${APP_URL}">Sign In</a><a class="omos-btn omos-btn-primary" href="/ask/">ASK OMOS</a><button class="omos-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button></div></div></header>`;}
function shellFooter(){return `<footer class="omos-site-footer"><div class="omos-footer-inner"><div class="omos-footer-grid"><div class="omos-footer-brand"><div class="omos-brand"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>OneGodian</small><strong>OMOS Runtime</strong></span></div><p>Operational intelligence, multi-model orchestration, documentation, and controlled execution infrastructure. Functional components remain subject to documented maturity limits and human review.</p></div><div class="omos-footer-col"><h4>Platform</h4><a href="/omos">OMOS</a><a href="/ohi">OHI</a><a href="/algorithm">Algorithm</a><a href="/protocol">Protocol</a></div><div class="omos-footer-col"><h4>Runtime</h4><a href="/ask/">Ask OMOS</a><a href="/dashboard">Dashboard</a><a href="/api/health">Health</a><a href="/api/manifest">Manifest</a></div><div class="omos-footer-col"><h4>Resources</h4><a href="/docs">Documentation</a><a href="/tools">Tools</a><a href="/artifacts">Artifacts</a><a href="/latest-news">Build Notes</a></div><div class="omos-footer-col"><h4>Ecosystem</h4><a href="${ORG_URL}">OneGodian.org</a><a href="${STORE_URL}">OneGodian.com</a><a href="${APP_URL}">App.OneGodian.com</a><a href="${QUANTUM_OHI_URL}">QuantumOHI.com</a></div></div><div class="omos-footer-bottom"><span>OMOS Runtime ${OMOS_VERSION} · Component maturity: Functional where implemented</span><span><a href="/legal">Legal</a> · <a href="/contact">Contact</a></span></div></div></footer>`;}
function pageTopper(route){const meta=pageMeta[route]||pageMeta["/"];return `<div class="omos-page-topper"><div class="omos-breadcrumbs">OMOS / ${escapeHtml(meta[1])}</div><div class="omos-status-pill">Functional Runtime</div></div>`;}
function applyGlobalShell(html,route){let out=String(html||"");if(!/<html/i.test(out))out=`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${out}</body></html>`;if(!out.includes('/omos-ui.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/omos-ui.css"></head>');out=out.replace(/<body([^>]*)>/i,`<body$1 class="omos-shell-active"><div class="omos-global-content">${shellHeader()}${pageTopper(route)}`);out=out.replace(/<\/body>/i,`${shellFooter()}</div><script src="/omos-ui.js" defer></script></body>`);return out;}
function renderGeneratedPage(route){const meta=pageMeta[route]||pageMeta["/"];const cards=(meta[3]?[["Explore OMOS",meta[3],"/omos"],["Open Pipeline","See Council Review and governed synthesis.","/ohi-output-pipeline"],["Developer Docs","Inspect runtime and integration documentation.","/docs"]]:[]).map(([t,d,h])=>`<a href="${h}" style="display:block;padding:24px;border:1px solid rgba(255,255,255,.09);border-radius:20px;text-decoration:none;background:rgba(255,255,255,.035)"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></a>`).join("");return applyGlobalShell(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(meta[0])}</title></head><body><main style="max-width:1100px;margin:0 auto;padding:72px 24px"><div style="color:#f0d98a;text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800">${escapeHtml(meta[1])}</div><h1>${escapeHtml(meta[2])}</h1><p style="max-width:850px;font-size:18px">${escapeHtml(meta[3])}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:34px">${cards}</div></main></body></html>`,route);}
function sendPage(res,route){const meta=pageMeta[route]||pageMeta["/"];const filePath=meta[4]?path.join(__dirname,"src/pages",meta[4]):null;if(filePath&&fs.existsSync(filePath)){const html=fs.readFileSync(filePath,"utf8");return res.send(applyGlobalShell(html,route));}return res.send(renderGeneratedPage(route));}

function providerStatus(){return ["openai","anthropic","gemini","xai"].map((name)=>{try{const adapter=require(`./src/adapters/${name}`);const configured=Boolean(adapter.isConfigured());return{provider:name,configured,status:configured?"live_available":"simulation_only"};}catch(error){return{provider:name,configured:false,status:"adapter_error"};}});}
function healthPayload(){const manifest=manifestPayload();const providers=providerStatus();return{status:"ok",service:manifest.id,version:OMOS_VERSION,environment:manifest.environment,canonicalHost:CANONICAL_HOST,ui:manifest.ui,persistence:getPersistenceStatus(),orchestration:{providers,liveProviderCount:providers.filter((p)=>p.configured).length,crossModelReview:true,runRecordApi:true,humanDecisionApi:true,durablePersistence:getPersistenceStatus().durable}};}

app.get(["/health","/api/health"],(req,res)=>res.json(healthPayload()));
app.get(["/manifest","/api/manifest"],(req,res)=>res.json({...manifestPayload(),providerStatus:providerStatus(),generatedAtUtc:new Date().toISOString()}));
app.get("/api/v1/providers",(req,res)=>res.json({status:"ok",providers:providerStatus()}));
app.get("/api/v1/persistence",(req,res)=>res.json({status:"ok",persistence:getPersistenceStatus()}));
for(const route of publicRoutes)app.get(route,(req,res)=>sendPage(res,route));
app.get("/admin",(req,res)=>sendPage(res,"/admin"));
app.post("/process",requireApiKey,rateLimit(),(req,res)=>{const result=OMOSProcess(req.body);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:result});});
app.post("/api/v1/council/run",requireApiKey,rateLimit(),async(req,res)=>{try{const data=await runCouncil({prompt:req.body.prompt||req.body.input||req.body.question,context:req.body.context||{},providers:Array.isArray(req.body.providers)?req.body.providers:undefined,mode:req.body.mode||"auto"});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data});}catch(error){const status=error.message==="prompt_required"||error.message==="provider_required"?400:500;res.status(status).json({error:"council_run_failed",message:error.message});}});
app.get("/api/v1/council/runs",requireApiKey,async(req,res)=>{try{const data=await listCouncilRuns(req.query.limit);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_history_failed",message:error.message});}});
app.get("/api/v1/council/runs/:id",requireApiKey,async(req,res)=>{try{const record=await getCouncilRun(req.params.id);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_read_failed",message:error.message});}});
app.post("/api/v1/council/runs/:id/human-decision",requireApiKey,rateLimit(),async(req,res)=>{try{const decision=String(req.body.decision||'').toUpperCase();if(!['APPROVED','REJECTED'].includes(decision))return res.status(400).json({error:"invalid_human_decision",message:"decision must be APPROVED or REJECTED"});const record=await setHumanDecision(req.params.id,decision,req.body.comment||'',req.apiKeyMeta.name);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"human_decision_failed",message:error.message});}});
app.use((req,res)=>res.status(404).json({error:"not_found",message:"Route not found in OMOS runtime manifest.",manifest:"/manifest"}));
app.listen(PORT,()=>console.log(`OMOS running on ${PORT} · persistence=${getPersistenceStatus().backend}`));