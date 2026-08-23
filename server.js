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
const ALLOWED_PLUGIN_ORIGINS = (process.env.OMOS_PLUGIN_ALLOWED_ORIGINS || `${STORE_URL},${ORG_URL},${QUANTUM_OHI_URL}`).split(",").map(x=>x.trim()).filter(Boolean);
const publicRoutes=["/","/omos","/ohi","/models","/tools","/artifacts","/docs","/shop","/latest-news","/dashboard","/legal","/contact","/protocol","/algorithm","/digital-sanctuary","/ohi-output-pipeline","/bridge-builder"];
const primaryNav=[["Platform","/omos"],["Intelligence","/ohi"],["Build","/tools"],["Ecosystem","/contact"]];
const pageMeta={
"/":{file:"home.html",title:"OMOS — OneGodian Metaphysical Operating System",heading:"OneGodian Metaphysical Operating System™",summary:"The canonical runtime, protocol, OHI synthesis, documentation, and integration node for the OneGodian ecosystem."},
"/omos":{file:"omos.html",title:"OMOS Architecture",heading:"OMOS Architecture",summary:"The operating and orchestration layer connecting OneGodian identity, Protocol, Algorithm, OHI, tools, records, and integrations."},
"/ohi":{file:"ohi.html",title:"OHI — OneGodian Hyper-Conscious Intelligence",heading:"OHI Runtime and Synthesis Layer",summary:"Multi-model review, signal comparison, governed synthesis, and human review."},
"/models":{file:"models.html",title:"Council of Models",heading:"Council of Models",summary:"Independent model outputs, cross-review, agreement zones, contradictions, missing evidence, novel insights, and supported dissent."},
"/tools":{file:"tools.html",title:"OMOS Tools",heading:"OMOS Tools",summary:"Ask OMOS, Layer 1, alignment, runtime, identity, and integration utilities."},
"/artifacts":{file:"artifacts.html",title:"OMOS Artifacts",heading:"OMOS Artifacts",summary:"Whitepapers, source materials, diagrams, manifests, and implementation artifacts."},
"/docs":{file:"docs.html",title:"OMOS Documentation",heading:"Documentation Center",summary:"Protocol, Algorithm, runtime, API, integration, deployment, and compliance documentation."},
"/shop":{file:"shop.html",title:"OMOS Commerce Bridge",heading:"OMOS Products and Downloads",summary:"Commercial paths remain on OneGodian.com; OMOS provides documentation and routing."},
"/latest-news":{file:"latest-news.html",title:"OMOS Updates",heading:"OMOS Updates",summary:"Build notes, release status, Council updates, and runtime milestones."},
"/dashboard":{file:"dashboard.html",title:"OMOS Console",heading:"OMOS Runtime Console",summary:"Runtime health, provider status, Council runs, records, and system history."},
"/legal":{file:"legal.html",title:"OMOS Legal",heading:"Legal and Institutional Positioning",summary:"Public-safe institutional, commercial, and runtime boundaries."},
"/contact":{file:"contact.html",title:"Contact OMOS",heading:"Contact and Ecosystem Links",summary:"Connect to OMOS and related OneGodian properties."},
"/protocol":{file:"protocol.html",title:"The OneGodian Protocol™",heading:"The OneGodian Protocol™",summary:"Identity, semantic, system-interaction, and interoperability standards."},
"/algorithm":{file:"algorithm.html",title:"The OneGodian Algorithm™",heading:"The OneGodian Algorithm™",summary:"Observe → Distill → Align → Select → Execute → Verify."},
"/digital-sanctuary":{file:"digital-sanctuary.html",title:"The OneGodian Digital Sanctuary",heading:"Digital Sanctuary",summary:"The experiential and interactive presentation layer for OMOS."},
"/ohi-output-pipeline":{file:"ohi-output-pipeline.html",title:"OHI Output Pipeline",heading:"OHI Cross-Model Review Pipeline",summary:"Independent outputs → cross-model review → governed synthesis → human review."},
"/bridge-builder":{file:"bridge-builder.html",title:"OMOS Bridge Builder",heading:"Bridge Builder",summary:"Integration utility for OMOS-connected properties."},
"/admin":{file:"admin.html",title:"OMOS Admin Handoff",heading:"OMOS Admin Handoff",summary:"Authenticated administration belongs in controlled application and WordPress environments."}
};
const omosManifest={id:"omos-site",name:"OMOS Runtime",fullName:"OMOS — OneGodian Metaphysical Operating System",version:OMOS_VERSION,status:"functional",environment:process.env.NODE_ENV||"development",canonicalHost:CANONICAL_HOST,navigation:primaryNav.map(([label,href])=>({label,href})),routes:{public:publicRoutes,api:["/health","/manifest","/api/health","/api/manifest","/process","/api/v1/council/run","/api/v1/council/runs","/api/v1/council/runs/:id","/api/v1/providers"]},orchestration:{modes:["simulation","hybrid","live"],providers:["openai","anthropic","gemini","xai"],rounds:["independent_outputs","cross_model_review","human_synthesis"],humanReviewRequired:true,modelAgreementIsNotFactualVerification:true,runRecord:true,runRecordStorage:"in_memory_bounded",durableStorageStatus:"planned"},wordpressPlugin:{compatibleHosts:ALLOWED_PLUGIN_ORIGINS,requiredEndpoints:["/api/health","/api/manifest","/api/v1/providers"],pluginTargets:["OneGodian.com","OneGodian.org","QuantumOHI.com"]},appBridge:{target:APP_URL,recommendedWidgets:["runtime_health","provider_status","recent_council_runs","run_record","verification_status"]},links:{publicSite:ORG_URL,commerceSite:STORE_URL,appConsole:APP_URL,quantumOhi:QUANTUM_OHI_URL,omosSite:CANONICAL_HOST}};
app.use(express.json({limit:"256kb"}));app.use(helmet({contentSecurityPolicy:false}));app.use(compression());app.use(express.static(path.join(__dirname,"public")));
function requireApiKey(req,res,next){const meta=verifyApiKey(req.headers["x-omos-key"]);if(!meta)return res.status(401).json({error:"unauthorized",message:"A valid x-omos-key header is required."});req.apiKeyMeta=meta;next()}
function escapeHtml(v){return String(v).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}
function shellAssets(html){let out=html;if(!out.includes('/omos-shell.css'))out=out.replace(/<\/head>/i,'<link rel="stylesheet" href="/omos-shell.css"></head>');if(!out.includes('/omos-shell.js'))out=out.replace(/<\/body>/i,'<script src="/omos-shell.js" defer></script></body>');return out}
function renderGeneratedPage(route){const m=pageMeta[route]||pageMeta["/"];return shellAssets(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(m.title)}</title></head><body><main style="max-width:1100px;margin:70px auto;padding:0 22px"><p style="color:#d4af37;font-weight:900">OMOS</p><h1 style="font-size:clamp(42px,7vw,78px);line-height:1">${escapeHtml(m.heading)}</h1><p style="max-width:800px;color:#aebdd0;font-size:19px">${escapeHtml(m.summary)}</p></main></body></html>`)}
function sendPage(res,route){const m=pageMeta[route]||pageMeta["/"];const filePath=m.file?path.join(__dirname,"src/pages",m.file):null;if(filePath&&fs.existsSync(filePath)){const html=fs.readFileSync(filePath,"utf8");return res.type("html").send(shellAssets(html))}return res.type("html").send(renderGeneratedPage(route))}
function providerStatus(){return["openai","anthropic","gemini","xai"].map(name=>{try{const adapter=require(`./src/adapters/${name}`);return{provider:name,configured:Boolean(adapter.isConfigured()),status:adapter.isConfigured()?"live_available":"simulation_only"}}catch(e){return{provider:name,configured:false,status:"adapter_error"}}})}
function healthPayload(){const providers=providerStatus();return{status:"ok",service:omosManifest.id,version:OMOS_VERSION,environment:omosManifest.environment,canonicalHost:CANONICAL_HOST,orchestration:{providers,liveProviderCount:providers.filter(p=>p.configured).length,crossModelReview:true,runRecordApi:true}}}
app.get(["/health","/api/health"],(req,res)=>res.json(healthPayload()));app.get(["/manifest","/api/manifest"],(req,res)=>res.json({...omosManifest,providerStatus:providerStatus(),generatedAtUtc:new Date().toISOString()}));app.get("/api/v1/providers",(req,res)=>res.json({status:"ok",providers:providerStatus()}));for(const route of publicRoutes)app.get(route,(req,res)=>sendPage(res,route));app.get("/admin",(req,res)=>sendPage(res,"/admin"));
app.post("/process",requireApiKey,rateLimit(),(req,res)=>{const result=OMOSProcess(req.body);res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:result})});
app.post("/api/v1/council/run",requireApiKey,rateLimit(),async(req,res)=>{try{const data=await runCouncil({prompt:req.body.prompt||req.body.input||req.body.question,context:req.body.context||{},providers:Array.isArray(req.body.providers)?req.body.providers:undefined,mode:req.body.mode||"auto"});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data})}catch(error){const status=error.message==="prompt_required"||error.message==="provider_required"?400:500;res.status(status).json({error:"council_run_failed",message:error.message})}});
app.get("/api/v1/council/runs",requireApiKey,(req,res)=>res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:listCouncilRuns(req.query.limit)}));app.get("/api/v1/council/runs/:id",requireApiKey,(req,res)=>{const record=getCouncilRun(req.params.id);if(!record)return res.status(404).json({error:"run_not_found",requestId:req.params.id});res.json({status:"ok",apiKey:{name:req.apiKeyMeta.name,plan:req.apiKeyMeta.plan},data:record})});app.use((req,res)=>res.status(404).json({error:"not_found",message:"Route not found in OMOS runtime manifest.",manifest:"/manifest"}));app.listen(PORT,()=>console.log(`OMOS running on ${PORT}`));