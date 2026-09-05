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

const publicRoutes = ["/","/omos","/ohi","/models","/tools","/artifacts","/docs","/shop","/latest-news","/dashboard","/legal","/contact","/protocol","/algorithm","/digital-sanctuary","/ohi-output-pipeline"];

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
  "/admin": ["OMOS Control Plane","Admin","OMOS Control Plane","Administrative execution and API management.", "admin.html"],
  "/legal": ["OMOS Legal and Institutional Positioning","Compliance","Legal and Institutional Positioning","OMOS is a voluntary educational, identity-reflection, documentation, and runtime-support framework; civil law remains controlling.","legal.html"],
  "/contact": ["Contact OMOS","Contact","Contact and Ecosystem Links","Connect the runtime to the wider OneGodian ecosystem.","contact.html"],
  "/protocol": ["The OneGodian Protocol™","Protocol","The OneGodian Protocol™","Identity, semantic, agent, and interface guidance for OneGodian-controlled deployments and integrations.","protocol.html"],
  "/algorithm": ["The OneGodian Algorithm™","Algorithm","The OneGodian Algorithm™","Observe → Distill → Align → Select → Execute → Verify.","algorithm.html"],
  "/digital-sanctuary": ["The OneGodian Digital Sanctuary","Experience","The Digital Sanctuary Experience","Immersive, motion-led presentation of OneGodian identity and OMOS architecture.","digital-sanctuary.html"],
  "/ohi-output-pipeline": ["OHI Output Pipeline","Council Runtime","OHI Cross-Model Review Pipeline","Human Question → independent model outputs → cross-review → signals → human synthesis → governed output.","ohi-output-pipeline.html"]
};

const megaMenu = [
  { label: "Platform", groups: [
    ["Core", [["What is OMOS?","/omos"],["Framework","/protocol"],["Algorithm","/algorithm"],["Digital Sanctuary","/digital-sanctuary"]]],
    ["Intelligence", [["OHI","/ohi"],["Council of Models","/models"],["Output Pipeline","/ohi-output-pipeline"],["Runtime Dashboard","/dashboard"]]],
    ["Execution", [["Ask OMOS","/ask/"],["Tools","/tools"],["Artifacts","/artifacts"],["Manifest","/api/manifest"]]],
    ["Access", [["Operational Workspace","/dashboard"],["App Console",APP_URL],["OneGodian.org",ORG_URL],["Commerce",STORE_URL]]]
  ]},
  { label: "Build", groups: [
    ["Developer", [["Documentation","/docs"],["Runtime Manifest","/api/manifest"],["Health","/api/health"],["Providers","/api/v1/providers"]]],
    ["Council", [["Ask OMOS","/ask/"],["Models","/models"],["Pipeline","/ohi-output-pipeline"],["Recent Runs","/dashboard"]]],
    ["Standards", [["Protocol","/protocol"],["Algorithm","/algorithm"],["Compliance","/legal"],["Persistence","/api/v1/persistence"]]],
    ["Ecosystem", [["App",APP_URL],["Public Site",ORG_URL],["Commerce",STORE_URL],["Enterprise",QUANTUM_OHI_URL]]]
  ]},
  { label: "Resources", groups: [
    ["Learn", [["Docs","/docs"],["Algorithm","/algorithm"],["Protocol","/protocol"],["OHI","/ohi"]]],
    ["Explore", [["Ask OMOS","/ask/"],["Tools","/tools"],["Artifacts","/artifacts"],["Sanctuary","/digital-sanctuary"]]],
    ["Operational", [["Dashboard","/dashboard"],["Manifest","/api/manifest"],["Health","/api/health"],["Providers","/api/v1/providers"]]],
    ["Support", [["Contact","/contact"],["Legal","/legal"],["Shop","/shop"],["OneGodian.org",ORG_URL]]]
  ]}
];

function manifestPayload() {
  const persistence = getPersistenceStatus();
  return {
    id: "omos-site",
    name: "OMOS Runtime",
    fullName: "OMOS — OneGodian Metaphysical Operating System",
    version: OMOS_VERSION,
    status: "functional",
    environment: process.env.NODE_ENV || "development",
    canonicalHost: CANONICAL_HOST,
    ui: { designSystem: "OMOS UI v2 — Operational Workspace", sharedHeader: true, sharedFooter: true, megaMenu: true, responsive: true, assets: ["/omos-ui.css","/omos-ui.js","/ask-workspace.js"] },
    navigation: megaMenu.map((item) => ({ label: item.label })),
    routes: {
      public: [...publicRoutes, "/ask/"],
      api: ["/health","/manifest","/api/health","/api/manifest","/process","/api/v1/council/run","/api/v1/council/runs","/api/v1/council/runs/:id","/api/v1/council/runs/:id/human-decision","/api/v1/providers","/api/v1/persistence"]
    },
    endpoints: {
      health: { method: "GET", path: "/health", authRequired: false },
      manifest: { method: "GET", path: "/api/manifest", authRequired: false },
      process: { method: "POST", path: "/process", authRequired: true, authHeader: "x-omos-key" },
      councilRun: { method: "POST", path: "/api/v1/council/run", authRequired: true, authHeader: "x-omos-key" },
      councilRuns: { method: "GET", path: "/api/v1/council/runs", authRequired: true, authHeader: "x-omos-key" },
      councilRunRecord: { method: "GET", path: "/api/v1/council/runs/:id", authRequired: true, authHeader: "x-omos-key" },
      humanDecision: { method: "POST", path: "/api/v1/council/runs/:id/human-decision", authRequired: true, authHeader: "x-omos-key" },
      providers: { method: "GET", path: "/api/v1/providers", authRequired: false },
      persistence: { method: "GET", path: "/api/v1/persistence", authRequired: false }
    },
    orchestration: {
      modes: ["simulation","hybrid","live"],
      providers: ["openai","anthropic","gemini","xai"],
      stages: ["ask","layer1","alignment","council_review","governed_synthesis","human_gate","decision_record"],
      rounds: ["independent_outputs","cross_model_review","human_synthesis"],
      crossReviewMatrix: "4x4 excluding self-review",
      signals: ["agreement_zones","contradictions","missing_evidence","novel_insights"],
      humanReviewRequired: true,
      modelAgreementIsNotFactualVerification: true,
      runRecord: true,
      runRecordStorage: persistence.backend,
      durableStorageStatus: persistence.durable ? "configured" : "memory_fallback_not_durable",
      persistence
    },
    wordpressPlugin: { compatibleHosts: ALLOWED_PLUGIN_ORIGINS, requiredEndpoints: ["/api/health","/api/manifest","/api/v1/providers"], shortcodes: ["[omos_manifest]","[omos_runtime_status]","[omos_bridge_builder]","[omos_tool_grid]","[omos_docs_grid]","[omos_ohi_pipeline]"], pluginTargets: ["OneGodian.com","OneGodian.org","QuantumOHI.com"] },
    commerceBridge: { primaryStore: STORE_URL, target: STORE_URL },
    appBridge: { target: APP_URL, recommendedWidgets: ["runtime_health","provider_status","recent_council_runs","run_record","verification_status"] },
    links: { publicSite: ORG_URL, commerceSite: STORE_URL, appConsole: APP_URL, quantumOhi: QUANTUM_OHI_URL, omosSite: CANONICAL_HOST }
  };
}

app.use(express.json({ limit: "256kb" }));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

function requireApiKey(req,res,next){const meta=verifyApiKey(req.headers["x-omos-key"]);if(!meta)return res.status(401).json({error:"unauthorized",message:"A valid x-omos-key header is required."});req.apiKeyMeta=meta;next();}
function escapeHtml(value){return String(value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;");}
function megaHtml(item,index){const groups=item.groups.map(([title,links])=>`<div class="omos-mega-group"><div class="omos-mega-title">${escapeHtml(title)}</div>${links.map(([label,href])=>`<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>`).join("")}</div>`).join("");return `<div class="omos-nav-item"><button class="omos-nav-button" aria-expanded="false" aria-controls="mega-${index}">${escapeHtml(item.label)} <span>⌄</span></button><div class="omos-mega" id="mega-${index}">${groups}</div></div>`;}
function shellHeader(){return `<header class="omos-site-header"><div class="omos-header-inner"><a class="omos-brand" href="/"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>Operational Intelligence</small><strong>OMOS.OneGodian.com</strong></span></a><nav class="omos-nav" aria-label="Primary navigation">${megaMenu.map(megaHtml).join("")}<a class="omos-nav-link" href="/docs">Docs</a></nav><div class="omos-header-actions"><a class="omos-btn" href="/api/health">Runtime</a><a class="omos-btn omos-btn-primary" href="/ask/">Ask OMOS</a><button class="omos-menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button></div></div></header>`;}
function shellFooter(){return `<footer class="omos-site-footer"><div class="omos-footer-inner"><div class="omos-footer-grid"><div class="omos-footer-brand"><div class="omos-brand"><span class="omos-brand-mark">O</span><span class="omos-brand-text"><small>OneGodian</small><strong>OMOS Runtime</strong></span></div><p>Operational intelligence, multi-model orchestration, documentation, and controlled execution infrastructure. Functional components remain subject to documented maturity limits and human review.</p></div><div class="omos-footer-col"><h4>Platform</h4><a href="/omos">OMOS</a><a href="/ohi">OHI</a><a href="/algorithm">Algorithm</a><a href="/protocol">Protocol</a></div><div class="omos-footer-col"><h4>Runtime</h4><a href="/ask/">Ask OMOS</a><a href="/dashboard">Dashboard</a><a href="/api/health">Health</a><a href="/api/manifest">Manifest</a></div><div class="omos-footer-col"><h4>Resources</h4><a href="/docs">Documentation</a><a href="/tools">Tools</a><a href="/artifacts">Artifacts</a><a href="/latest-news">Build Notes</a></div><div class="omos-footer-col"><h4>Ecosystem</h4><a href="${ORG_URL}">OneGodian.org</a><a href="${STORE_URL}">OneGodian.com</a><a href="${APP_URL}">App.OneGodian.com</a><a href="${QUANTUM_OHI_URL}">QuantumOHI.com</a></div></div><div class="omos-footer-bottom"><span>OMOS Runtime ${OMOS_VERSION} · Component maturity: Functional where implemented</span><span><a href="/legal">Legal</a> · <a href="/contact">Contact</a></span></div></div></footer>`;}
function pageTopper(route){const meta=pageMeta[route]||pageMeta["/"];return `<div class="omos-page-topper"><div class="omos-breadcrumbs">OMOS / ${escapeHtml(meta[1])}</div><div class="omos-status-pill">Functional Runtime</div></div>`;}
function applyGlobalShell(html,route){let out=String(html||"");if(!/<html/i.test(out))out=`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>${out}</body></html>`;if(!out.includes('/omos-ui.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/omos-ui.css"></head>');out=out.replace(/<body([^>]*)>/i,`<body$1 class="omos-shell-active"><div class="omos-global-content">${shellHeader()}${pageTopper(route)}`);out=out.replace(/<\/body>/i,`${shellFooter()}</div><script src="/omos-ui.js" defer></script></body>`);return out;}
function renderGeneratedPage(route){const meta=pageMeta[route]||pageMeta["/"];const cards=(meta[3]?[["Explore OMOS",meta[3],"/omos"],["Open Pipeline","See Council Review and governed synthesis.","/ohi-output-pipeline"],["Developer Docs","Inspect runtime and integration documentation.","/docs"]]:[]).map(([t,d,h])=>`<a href="${h}" style="display:block;padding:24px;border:1px solid rgba(255,255,255,.09);border-radius:20px;text-decoration:none;background:rgba(255,255,255,.035)"><strong>${escapeHtml(t)}</strong><p>${escapeHtml(d)}</p></a>`).join("");return applyGlobalShell(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(meta[0])}</title></head><body><main style="max-width:1100px;margin:0 auto;padding:72px 24px"><div style="color:#f0d98a;text-transform:uppercase;letter-spacing:.16em;font-size:12px;font-weight:800">${escapeHtml(meta[1])}</div><h1>${escapeHtml(meta[2])}</h1><p style="max-width:850px;font-size:18px">${escapeHtml(meta[3])}</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:34px">${cards}</div></main></body></html>`,route);}
function sendPage(res,route){const meta=pageMeta[route]||pageMeta["/"];const filePath=meta[4]?path.join(__dirname,"src/pages",meta[4]):null;if(filePath&&fs.existsSync(filePath)){const html=fs.readFileSync(filePath,"utf8");if(route==="/" || route==="/admin")return res.send(html);return res.send(applyGlobalShell(html,route));}return res.send(renderGeneratedPage(route));}

function providerStatus(){return ["openai","anthropic","gemini","xai"].map((name)=>{try{const adapter=require(`./src/adapters/${name}`);const configured=Boolean(adapter.isConfigured());return{provider:name,configured,status:configured?"live_available":"simulation_only"};}catch(error){return{provider:name,configured:false,status:"adapter_error"};}});}
function healthPayload(){const manifest=manifestPayload();const providers=providerStatus();return{status:"ok",service:manifest.id,version:OMOS_VERSION,environment:manifest.environment,canonicalHost:CANONICAL_HOST,ui:manifest.ui,persistence:getPersistenceStatus(),publicRouteCount:publicRoutes.length,orchestration:{providers,liveProviderCount:providers.filter((p)=>p.configured).length,crossModelReview:true,runRecordApi:true,humanDecisionApi:true,durablePersistence:getPersistenceStatus().durable}};}

app.get(["/health","/api/health"],(req,res)=>res.json(healthPayload()));
app.get(["/manifest","/api/manifest"],(req,res)=>res.json({...manifestPayload(),providerStatus:providerStatus(),generatedAtUtc:new Date().toISOString()}));
app.get("/api/v1/providers",(req,res)=>res.json({status:"ok",providers:providerStatus()}));
app.get("/api/v1/persistence",(req,res)=>res.json({status:"ok",persistence:getPersistenceStatus()}));
for(const route of publicRoutes){
  app.get(route,(req,res)=>sendPage(res,route));
  app.get(`${route}/`,(req,res)=>sendPage(res,route));
}
app.get("/admin",(req,res)=>sendPage(res,"/admin"));
app.post("/process",requireApiKey,rateLimit(),(req,res)=>{const result=OMOSProcess(req.body);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:result});});
app.post("/api/v1/council/run",requireApiKey,rateLimit(),async(req,res)=>{try{const data=await runCouncil({prompt:req.body.prompt||req.body.input||req.body.question,context:req.body.context||{},providers:Array.isArray(req.body.providers)?req.body.providers:undefined,mode:req.body.mode||"auto"});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data});}catch(error){const status=error.message==="prompt_required"||error.message==="provider_required"?400:500;res.status(status).json({error:"council_run_failed",message:error.message});}});
app.get("/api/v1/council/runs",requireApiKey,async(req,res)=>{try{const data=await listCouncilRuns(req.query.limit);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_history_failed",message:error.message});}});
app.get("/api/v1/council/runs/:id",requireApiKey,async(req,res)=>{try{const record=await getCouncilRun(req.params.id);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"run_read_failed",message:error.message});}});
app.post("/api/v1/council/runs/:id/human-decision",requireApiKey,rateLimit(),async(req,res)=>{try{const decision=String(req.body.decision||'').toUpperCase();if(!['APPROVED','REJECTED'].includes(decision))return res.status(400).json({error:"invalid_human_decision",message:"decision must be APPROVED or REJECTED"});const record=await setHumanDecision(req.params.id,decision,req.body.comment||'',req.apiKeyMeta.name);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record,persistence:getPersistenceStatus()});}catch(error){res.status(500).json({error:"human_decision_failed",message:error.message});}});
app.use(express.static(path.join(__dirname, "public"), { redirect: false }));
app.use((req,res)=>res.status(404).json({error:"not_found",message:"Route not found in OMOS runtime manifest.",manifest:"/manifest"}));
app.listen(Number(PORT) || 3000, "0.0.0.0", () => console.log(`OMOS running on ${PORT} · persistence=${getPersistenceStatus().backend}`));