"use client";

import { useEffect, useMemo, useState } from "react";

const models = [
  {
    name: "ChatGPT",
    role: "Structure & synthesis",
    color: "cyan",
    output:
      "Frames the issue, organizes the evidence, and identifies a practical response structure.",
  },
  {
    name: "Claude",
    role: "Nuance & constraints",
    color: "violet",
    output:
      "Tests assumptions, preserves important qualifications, and strengthens the reasoning chain.",
  },
  {
    name: "Gemini",
    role: "Breadth & comparison",
    color: "blue",
    output:
      "Adds alternative interpretations, broader context, and useful comparative patterns.",
  },
  {
    name: "Grok",
    role: "Contrast & directness",
    color: "gold",
    output:
      "Surfaces tension points, challenges weak framing, and tests whether the answer is clear.",
  },
];

const stages = [
  "Independent answers",
  "Cross-model review",
  "Agreement mapping",
  "Human synthesis",
  "OHI output",
];

const navigationGroups = [
  {
    label: "OMOS",
    links: [
      { label: "Overview", href: "#top" },
      { label: "Production status", href: "#production" },
      { label: "Architecture", href: "#architecture" },
      { label: "Algorithm", href: "#algorithm" },
      { label: "Standards", href: "#standards" },
    ],
  },
  {
    label: "Workspace",
    links: [
      { label: "Ask OMOS", href: "#pipeline" },
      { label: "Layer 1", href: "#pipeline" },
      { label: "Align", href: "#algorithm" },
      { label: "Council", href: "#pipeline" },
      { label: "Synthesize", href: "#pipeline" },
      { label: "Record", href: "#record" },
      { label: "History", href: "#record" },
    ],
  },
  {
    label: "Council",
    links: [
      { label: "Council workspace", href: "#pipeline" },
      { label: "Engineering Council", href: "#engineering-council" },
      { label: "Review rules", href: "#engineering-council" },
      { label: "Human approval gate", href: "#record" },
    ],
  },
  {
    label: "OLLM",
    links: [
      { label: "Model council", href: "#pipeline" },
      { label: "Independent outputs", href: "#pipeline" },
      { label: "Cross-model review", href: "#pipeline" },
      { label: "O-H-I output", href: "#pipeline" },
      { label: "Runtime environment", href: "#environment" },
    ],
  },
  {
    label: "Tools",
    links: [
      { label: "Algorithm lab", href: "#algorithm" },
      { label: "Decision review", href: "#record" },
      { label: "Timekeeping tools", href: "#products" },
      { label: "Developer kit", href: "#products" },
    ],
  },
  {
    label: "Developers",
    links: [
      { label: "System architecture", href: "#architecture" },
      { label: "Environment contract", href: "#environment" },
      { label: "Engineering workflow", href: "#engineering-council" },
      { label: "Documents", href: "#library" },
      { label: "GitHub repository", href: "https://github.com/ohi-stack/omos-site", external: true },
    ],
  },
  {
    label: "Pricing",
    links: [
      { label: "Product catalog", href: "#products" },
      { label: "Developer Kit", href: "#products" },
      { label: "Prompt systems", href: "#products" },
      { label: "Tools & standards", href: "#products" },
    ],
  },
];

const productionEvidence = [
  {
    area: "Ask OMOS workspace",
    status: "Functional",
    tone: "functional",
    evidence:
      "Seven-stage flow implemented: Ask OMOS, Layer 1, Alignment, Council Review, Governed Synthesis, Human Gate, and Decision Record.",
    limit: "Live provider execution depends on configured production credentials.",
  },
  {
    area: "Layer 1 + Alignment",
    status: "Repository verified",
    tone: "verified",
    evidence:
      "Deterministic signal classification and dimension-based alignment scoring are implemented and covered by the lifecycle test.",
    limit: "Scores remain decision-support signals, not factual verification.",
  },
  {
    area: "Council orchestration",
    status: "Functional",
    tone: "functional",
    evidence:
      "OpenAI, Anthropic, Gemini, and xAI adapters, independent outputs, no-self cross-review, and explicit simulation/hybrid/live modes are implemented.",
    limit: "Current provider configuration on the production host has not been independently verified.",
  },
  {
    area: "Human Gate + records",
    status: "Repository verified",
    tone: "verified",
    evidence:
      "Approve/reject disposition, run retrieval, hashes, timestamps, provider provenance, and stage history pass the repository lifecycle test.",
    limit: "Human approval records a disposition; it does not make a claim factually true.",
  },
  {
    area: "Persistent storage",
    status: "Implemented / gated",
    tone: "gated",
    evidence:
      "PostgreSQL storage, schema initialization, migration, run history, and a public persistence-status endpoint are implemented.",
    limit: "Production requires DATABASE_URL and a restart-survival verification. Memory fallback is not durable.",
  },
  {
    area: "WordPress + ecosystem bridge",
    status: "Staged",
    tone: "planned",
    evidence:
      "Plugin assets, manifests, shortcodes, target maps, and integration documentation exist in the canonical repository.",
    limit: "The bridge is not operational until installed, configured, and tested on each target property.",
  },
];

const releaseGates = [
  "Deploy repository version 1.1.0 to the canonical OMOS host",
  "Pass the production preflight with non-placeholder secrets",
  "Verify PostgreSQL persistence survives a restart or redeployment",
  "Run canonical live smoke tests for health, manifest, providers, pages, and security",
  "Confirm every live provider is labeled from actual runtime configuration",
  "Install and test the WordPress bridge separately on each approved target",
];

const algorithmSteps = [
  {
    name: "Observe",
    number: "01",
    description:
      "Collect facts, claims, intentions, risks, actors, system conditions, and relevant context.",
    question: "What is actually present?",
  },
  {
    name: "Distill",
    number: "02",
    description:
      "Separate useful signal from noise, manipulation, repetition, and unnecessary conflict.",
    question: "What is signal—and what is distortion?",
  },
  {
    name: "Align",
    number: "03",
    description:
      "Evaluate the available paths for truth, clarity, coherence, dignity, and constructive unity.",
    question: "Which options remain aligned with the stated criteria?",
  },
  {
    name: "Select",
    number: "04",
    description:
      "Choose the highest-coherence path, not merely the fastest, loudest, or most profitable one.",
    question: "What is the clearest defensible decision?",
  },
  {
    name: "Execute",
    number: "05",
    description:
      "Translate the selected path into a scoped, measurable, authorized action.",
    question: "Who acts, under what authority, and with what limit?",
  },
  {
    name: "Verify",
    number: "06",
    description:
      "Compare the result against reality, record what changed, and correct the course when needed.",
    question: "Did the action produce the intended outcome?",
  },
];

const architectureLayers = [
  {
    number: "L1",
    title: "Protocol",
    label: "Recognition & classification",
    copy: "Defines how the OneGodian framework is described, recognized, and represented across software, institutional, and public contexts.",
  },
  {
    number: "L2",
    title: "Experience",
    label: "Belief mapping & personalization",
    copy: "Maps user context and journey stage so content, tools, and guidance can be presented at an appropriate level without coercion.",
  },
  {
    number: "L3",
    title: "Community",
    label: "Connection & governance support",
    copy: "Structures values-based connection, records, community health signals, and human-led decision support.",
  },
  {
    number: "L4",
    title: "Orientation",
    label: "System behavior & authority",
    copy: "Sets behavioral boundaries for models, agents, interfaces, and workflows while preserving final human control.",
  },
];

const productFamilies = [
  { key: "all", label: "All products", count: 18 },
  { key: "identity", label: "Identity", count: 4 },
  { key: "knowledge", label: "Knowledge", count: 5 },
  { key: "intelligence", label: "Intelligence", count: 5 },
  { key: "tools", label: "Tools & standards", count: 4 },
];

const engineeringStages = [
  { stage: "GitHub Issue", artifact: "Problem statement, acceptance criteria, affected repositories, and priority", code: "01" },
  { stage: "Task Classification", artifact: "Bug, feature, security, infrastructure, documentation, research, or release", code: "02" },
  { stage: "Agent Assignment", artifact: "Named agent, bounded scope, permissions, branch, and expected deliverable", code: "03" },
  { stage: "Agent Work", artifact: "Commits, implementation notes, and tests added", code: "04" },
  { stage: "Pull Request", artifact: "Diff, linked issue, risk statement, and test evidence", code: "05" },
  { stage: "Cross-Agent Review", artifact: "Independent review by an agent that did not author the change", code: "06" },
  { stage: "Tests / CI", artifact: "Required suites green; failures block progression", code: "07" },
  { stage: "OMOS Review", artifact: "Architecture, security, compliance, provenance, and maturity checks", code: "08" },
  { stage: "Human Approval", artifact: "Explicit authorization by the designated human authority", code: "09" },
  { stage: "Merge", artifact: "Protected-branch merge with a traceable commit SHA", code: "10" },
  { stage: "Deployment Proof", artifact: "Deployed SHA, health checks, smoke tests, and behavior or persistence proof", code: "11" },
];

const councilRules = [
  { number: "I", title: "Independent review", copy: "No agent reviews its own work as the final reviewer. Cross-agent review must remain independent." },
  { number: "II", title: "CI is necessary, not sufficient", copy: "Tests prove defined behavior; they do not independently prove architectural correctness or deployment safety." },
  { number: "III", title: "Consequential changes do not auto-merge", copy: "Explicit human approval remains the final authorization boundary before protected-branch merge." },
  { number: "IV", title: "Merge is not completion", copy: "Work closes only after production evidence proves the intended revision is running and acceptance criteria pass." },
];

const engineeringRecordFields = [
  "Issue ID", "Assigned agents", "Pull request", "Independent reviewers",
  "Test results", "Approved-by identity", "Merged SHA", "Deployed SHA",
  "Deployment timestamp", "Environment", "Verification result", "Rollback reference", "Final status",
];

const environmentVariables = [
  { name: "NODE_ENV", purpose: "Set to production", exposure: "Required", scope: "config" },
  { name: "PORT", purpose: "Use 3000 unless Hostinger injects its own port", exposure: "Verify", scope: "config" },
  { name: "OMOS_VERSION", purpose: "Set to 1.1.0", exposure: "Required", scope: "config" },
  { name: "OMOS_CANONICAL_HOST", purpose: "https://omos.onegodian.com", exposure: "Required", scope: "public" },
  { name: "OMOS_API_KEYS", purpose: "Add a strong private production key", exposure: "Critical secret", scope: "secret" },
  { name: "DATABASE_URL", purpose: "Add the production PostgreSQL connection string", exposure: "Critical secret", scope: "secret" },
  { name: "OMOS_DB_SSL", purpose: "Normally true for hosted PostgreSQL", exposure: "Required", scope: "config" },
  { name: "OMOS_DB_POOL_MAX", purpose: "Set production pool maximum to 5", exposure: "Required", scope: "config" },
  { name: "OPENAI_API_KEY", purpose: "Keep the existing OpenAI production secret", exposure: "Present secret", scope: "secret" },
  { name: "OPENAI_MODEL", purpose: "Add gpt-5, as currently expected by the repository", exposure: "Required", scope: "config" },
  { name: "ANTHROPIC_API_KEY", purpose: "Add only if Claude Council is going live", exposure: "Conditional", scope: "secret" },
  { name: "ANTHROPIC_MODEL", purpose: "Set with the Claude provider configuration", exposure: "Conditional", scope: "config" },
  { name: "GEMINI_API_KEY", purpose: "Add only if Gemini Council is going live", exposure: "Conditional", scope: "secret" },
  { name: "GEMINI_MODEL", purpose: "Set with the Gemini provider configuration", exposure: "Conditional", scope: "config" },
  { name: "XAI_API_KEY", purpose: "Add only if Grok Council is going live", exposure: "Conditional", scope: "secret" },
  { name: "XAI_MODEL", purpose: "Set with the Grok provider configuration", exposure: "Conditional", scope: "config" },
  { name: "ONEGODIAN_ORG_URL", purpose: "https://onegodian.org", exposure: "Required", scope: "public" },
  { name: "ONEGODIAN_STORE_URL", purpose: "https://onegodian.com", exposure: "Required", scope: "public" },
  { name: "ONEGODIAN_APP_URL", purpose: "https://app.onegodian.com", exposure: "Required", scope: "public" },
  { name: "ACC_API_URL", purpose: "Keep the existing value after confirming it is correct", exposure: "Verify", scope: "config" },
  { name: "ACC_API_KEY", purpose: "Keep the existing ACC authentication secret", exposure: "Present secret", scope: "secret" },
  { name: "QUANTUMOHI_URL", purpose: "Add this exact key with https://quantumohi.com", exposure: "Required", scope: "public" },
];

const serverSecretNames = [
  "OMOS_API_KEYS", "DATABASE_URL", "OPENAI_API_KEY", "ANTHROPIC_API_KEY",
  "GEMINI_API_KEY", "XAI_API_KEY", "ACC_API_KEY",
];

const retainedIntegrationVariables = [
  "OMOS_REST_BASE_URL", "ODIN_REGISTRY_URL", "OMOS_OPERATOR", "LOG_LEVEL",
  "ENABLE_COMPRESSION", "ENABLE_HELMET", "APP_SYNC_ENABLED", "APP_SYNC_ENDPOINT",
  "HEALTHCHECK_ROUTE", "MANIFEST_ROUTE",
];

const productionCriticalPath = ["OMOS_API_KEYS", "DATABASE_URL", "OMOS_DB_SSL", "OMOS_DB_POOL_MAX"];

const products = [
  { family: "identity", code: "ID-01", title: "OneGodian Declaration Card™", edition: "Digital edition", symbol: "ID", message: "Your identity, formally expressed." },
  { family: "identity", code: "ID-02", title: "OneGodian Declaration Card™", edition: "Printed edition", symbol: "ID", message: "A physical expression of OneGodian identity." },
  { family: "identity", code: "ID-03", title: "Obsidian Seal™", edition: "Standard PNG", symbol: "OS", message: "A digital mark of identity and alignment." },
  { family: "identity", code: "ID-04", title: "Obsidian Seal™", edition: "Animated digital asset", symbol: "OS", message: "The identity mark in motion." },
  { family: "knowledge", code: "KN-01", title: "OneGodian Frequency Standard™", edition: "Reference PDF", symbol: "432", message: "A documented standard, not merely an audio track." },
  { family: "knowledge", code: "KN-02", title: "The OneGodian Algorithm™", edition: "White paper • Version 1.0", symbol: "06", message: "The foundational intelligence specification." },
  { family: "knowledge", code: "KN-03", title: "Protocol™ and Algorithm™", edition: "Unified framework", symbol: "P+A", message: "The architecture that connects the system." },
  { family: "knowledge", code: "KN-04", title: "AI Interpretations of OneGodian™", edition: "Multi-model analysis", symbol: "4×", message: "Multiple AI perspectives examined together." },
  { family: "knowledge", code: "KN-05", title: "Gen Alpha & Gen Beta Strategy", edition: "Marketing strategy", symbol: "αβ", message: "The ecosystem designed for an AI-native generation." },
  { family: "intelligence", code: "IN-01", title: "OneGodian Alignment Prompt™", edition: "Reusable prompt • Version 1.0", symbol: "AP", message: "A reusable intelligence-alignment tool." },
  { family: "intelligence", code: "IN-02", title: "OneGodian AI System Prompt™", edition: "System prompt • Version 1.0", symbol: ">_", message: "The instruction layer for intelligent systems." },
  { family: "intelligence", code: "IN-03", title: "Belief Mapper™", edition: "Journey mapping tool", symbol: "4P", message: "Understand where you are in your journey." },
  { family: "intelligence", code: "IN-04", title: "OMOS Decision Review™", edition: "Auditable decision tool", symbol: "DR", message: "Turn complexity into a reviewable decision." },
  { family: "intelligence", code: "IN-05", title: "OMOS AI Council™", edition: "Governed multi-model review", symbol: "4M", message: "Multiple models. One governed review." },
  { family: "tools", code: "TS-01", title: "OneGodian Frequency Standard™", edition: "432 Hz audio reference", symbol: "432", message: "The OneGodian harmonic reference." },
  { family: "tools", code: "TS-02", title: "OneGodian Timekeeping System™", edition: "OTS-V5", symbol: "OT", message: "A structured alternative timekeeping framework." },
  { family: "tools", code: "TS-03", title: "OneGodian Time™ Converter", edition: "Digital conversion interface", symbol: "G↔O", message: "Convert between time systems instantly." },
  { family: "tools", code: "TS-04", title: "OMOS Developer Kit™", edition: "API • schemas • SDK", symbol: "{ }", message: "Build with the OMOS architecture." },
];

const monthNames = [
  "Genesis",
  "Wisdom",
  "Planting",
  "Justice",
  "Freedom",
  "Prosperity",
  "Innovation",
  "Transformation",
  "Remembrance",
  "Covenant",
  "Invention",
  "Independence",
  "Ascension",
];

const dayOrders = [
  { label: "The First Day™", name: "Skénra" },
  { label: "The Second Day™", name: "Teyó·ra" },
  { label: "The Third Day™", name: "Ahsténha" },
  { label: "The Fourth Day™", name: "Yawénni" },
  { label: "The Fifth Day™", name: "Onyá·ta" },
  { label: "The Sixth Day™", name: "Shakó·wa" },
  { label: "The Seventh Day™", name: "Niyóhsera" },
];

function toOTDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) {
    return { valid: false, label: "", order: "", dayName: "" };
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    value < "2025-03-18" ||
    value > "2125-03-17"
  ) {
    return { valid: false, label: "", order: "", dayName: "" };
  }
  const yearStartGregorian = month > 3 || (month === 3 && day >= 18) ? year : year - 1;
  const otYear = yearStartGregorian - 2025;
  const epochForYear = new Date(Date.UTC(yearStartGregorian, 2, 18));
  const dayOffset = Math.round(
    (date.getTime() - epochForYear.getTime()) / 86_400_000,
  );
  const monthIndex = dayOffset < 360 ? Math.floor(dayOffset / 30) : 12;
  const otDay = dayOffset < 360 ? (dayOffset % 30) + 1 : dayOffset - 359;
  const order = dayOrders[date.getUTCDay()];
  return {
    valid: otYear >= 0 && otYear <= 99,
    label: `${monthNames[monthIndex]} ${String(otDay).padStart(2, "0")}, ${String(otYear).padStart(4, "0")} OT`,
    order: order.label,
    dayName: order.name,
  };
}

export default function Home() {
  const [pipelineStage, setPipelineStage] = useState(0);
  const [running, setRunning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const [activeFamily, setActiveFamily] = useState("all");
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);
  const [selectedDate, setSelectedDate] = useState("2026-07-28");
  const [scores, setScores] = useState({
    truth: 86,
    clarity: 74,
    coherence: 81,
    dignity: 92,
    unity: 79,
    distortion: 18,
    fragmentation: 24,
  });

  useEffect(() => {
    if (!running) return;
    if (pipelineStage >= stages.length - 1) {
      const finish = window.setTimeout(() => setRunning(false), 900);
      return () => window.clearTimeout(finish);
    }
    const timer = window.setTimeout(
      () => setPipelineStage((stage) => stage + 1),
      1050,
    );
    return () => window.clearTimeout(timer);
  }, [pipelineStage, running]);

  const progress = useMemo(
    () => `${((pipelineStage + 1) / stages.length) * 100}%`,
    [pipelineStage],
  );
  const otDate = useMemo(() => toOTDate(selectedDate), [selectedDate]);
  const alignmentScore = useMemo(() => {
    const positive =
      scores.truth +
      scores.clarity +
      scores.coherence +
      scores.dignity +
      scores.unity;
    const penalty = scores.distortion + scores.fragmentation;
    return Math.max(0, Math.min(100, Math.round(positive / 5 - penalty / 5)));
  }, [scores]);

  function runPipeline() {
    setPipelineStage(0);
    setRunning(true);
  }

  return (
    <main>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <a className="brand" href="#top" aria-label="OMOS home">
          <img
            className={logoFailed ? "brand-logo is-hidden" : "brand-logo"}
            src="https://onegodian-omos.onegodian.chatgpt.site/omos-logo-gold.png"
            alt="OMOS — OneGodian Metaphysical Operating System"
            width={2048}
            height={682}
            fetchPriority="high"
            onError={() => setLogoFailed(true)}
          />
          {logoFailed && <span className="brand-fallback">OMOS</span>}
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <nav
          id="primary-navigation"
          className={menuOpen ? "primary-nav open" : "primary-nav"}
          aria-label="Primary navigation"
        >
          <div className="nav-groups">
            {navigationGroups.map((group) => (
              <details className="nav-group" key={group.label}>
                <summary>{group.label}</summary>
                <div className="mega-panel">
                  <span className="mega-label">{group.label}</span>
                  <div className="mega-links">
                    {group.links.map((link) => (
                      <a
                        href={link.href}
                        key={`${group.label}-${link.label}`}
                        onClick={() => setMenuOpen(false)}
                        {...(link.external
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                      >
                        {link.label}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
          <div className="nav-actions">
            <a href="#production" onClick={() => setMenuOpen(false)}>
              Runtime
            </a>
            <a href="https://omos.onegodian.com/dashboard/" onClick={() => setMenuOpen(false)}>
              Sign In
            </a>
            <a className="nav-cta" href="#pipeline" onClick={() => setMenuOpen(false)}>
              ASK OMOS
            </a>
          </div>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">
          <span className="live-dot" />
          Repository audit • September 4, 2026 • Human-governed
        </div>
        <h1>
          Built in the repo.
          <br />
          Separated from hype.
          <br />
          <span>Ready for the production gate.</span>
        </h1>
        <p className="hero-copy">
          OMOS 1.1.0 is implemented as a functional governed-intelligence
          runtime in the canonical repository. This page now distinguishes
          repository-tested capabilities from the separate work required to
          verify the canonical production deployment.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#production">
            Review production evidence <span aria-hidden="true">↘</span>
          </a>
          <a
            className="button button-quiet"
            href="https://github.com/ohi-stack/omos-site"
            target="_blank"
            rel="noreferrer"
          >
            Open canonical repository ↗
          </a>
        </div>

        <div className="hero-formula" aria-label="OMOS model synthesis formula">
          <div className="formula-model formula-cyan">
            <b>GPT</b>
            <span>structure</span>
          </div>
          <i>+</i>
          <div className="formula-model formula-violet">
            <b>Claude</b>
            <span>nuance</span>
          </div>
          <i>+</i>
          <div className="formula-model formula-blue">
            <b>Gemini</b>
            <span>breadth</span>
          </div>
          <i>+</i>
          <div className="formula-model formula-gold">
            <b>Grok</b>
            <span>contrast</span>
          </div>
          <i className="formula-arrow">→</i>
          <div className="formula-result">
            <span className="result-orbit" />
            <b>OHI</b>
            <span>governed synthesis</span>
          </div>
        </div>

        <div className="trust-strip">
          <div>
            <strong>Repository 1.1.0</strong>
            <span>Functional candidate build</span>
          </div>
          <div>
            <strong>Lifecycle test passed</strong>
            <span>Simulation path + Human Gate</span>
          </div>
          <div>
            <strong>Live host 1.0.1 observed</strong>
            <span>Deployment upgrade still required</span>
          </div>
        </div>
      </section>

      <section className="section production-section" id="production">
        <div className="section-heading">
          <div>
            <p className="kicker">Production evidence register</p>
            <h2>What is ready—and what is not.</h2>
          </div>
          <p>
            The canonical source is <strong>ohi-stack/omos-site</strong>. Its
            current package version is 1.1.0. The separate AI Studio repository
            currently provides synchronization and provenance records; it is not
            counted as independent runtime proof.
          </p>
        </div>

        <div className="release-split">
          <article className="release-snapshot">
            <div className="snapshot-head">
              <div>
                <span className="panel-label">Current evidence snapshot</span>
                <h3>Repository-ready. Production verification pending.</h3>
              </div>
              <span className="snapshot-version">v1.1.0</span>
            </div>
            <div className="snapshot-grid">
              <div>
                <span>Source state</span>
                <strong>Functional</strong>
                <small>Core lifecycle test passed</small>
              </div>
              <div>
                <span>Canonical host</span>
                <strong>v1.0.1 observed</strong>
                <small>Not yet verified on 1.1.0</small>
              </div>
              <div>
                <span>Durable records</span>
                <strong>Implemented</strong>
                <small>Production database gate open</small>
              </div>
              <div>
                <span>Human authority</span>
                <strong>Enforced</strong>
                <small>Approval does not equal truth</small>
              </div>
            </div>
            <p>
              “Production” applies component by component. A committed feature,
              passing local test, or public route is not a completed production
              deployment until the intended revision is running and its live
              verification gates pass.
            </p>
          </article>

          <aside className="repo-ledger">
            <span className="panel-label">Evidence sources</span>
            <a
              href="https://github.com/ohi-stack/omos-site"
              target="_blank"
              rel="noreferrer"
            >
              <span>Canonical runtime</span>
              <strong>ohi-stack/omos-site</strong>
              <small>Code, routes, APIs, tests, docs, plugin assets</small>
            </a>
            <div>
              <span>Development mirror</span>
              <strong>OMOS AI Studio</strong>
              <small>Sync workflow + provenance register; not runtime proof</small>
            </div>
            <a
              href="https://omos.onegodian.com"
              target="_blank"
              rel="noreferrer"
            >
              <span>Canonical host</span>
              <strong>omos.onegodian.com</strong>
              <small>Must be smoke-verified after the 1.1.0 deployment</small>
            </a>
          </aside>
        </div>

        <div className="evidence-grid">
          {productionEvidence.map((item) => (
            <article className="evidence-card" key={item.area}>
              <div className="evidence-head">
                <span>{item.area}</span>
                <b className={`status-badge ${item.tone}`}>{item.status}</b>
              </div>
              <p>{item.evidence}</p>
              <small>{item.limit}</small>
            </article>
          ))}
        </div>

        <div className="gate-panel">
          <div>
            <p className="panel-label">Production gates still open</p>
            <h3>Promotion requires live proof.</h3>
            <p>
              These are the remaining gates before OMOS 1.1.0 can be described
              as verified on the canonical production host.
            </p>
          </div>
          <ol>
            {releaseGates.map((gate, index) => (
              <li key={gate}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {gate}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section pipeline-section" id="pipeline">
        <div className="section-heading">
          <div>
            <p className="kicker">Interface demonstration</p>
            <h2>See the governed workflow without implying a live run.</h2>
          </div>
          <p>
            This Sites demonstration remains intentionally local and simulated.
            The canonical OMOS repository contains the functional API-backed
            workspace; this visual explains the method without claiming that it
            contacted any external model provider.
          </p>
        </div>

        <div className="pipeline-console">
          <div className="console-topbar">
            <div className="console-lights" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <span>OMOS / OHI OUTPUT PIPELINE</span>
            <span className="console-version">v1.1 repository model</span>
          </div>

          <div className="pipeline-grid">
            <div className="prompt-panel">
              <p className="panel-label">01 / Human question</p>
              <h3>What is the clearest path from idea to verified action?</h3>
              <div className="prompt-meta">
                <span>Same prompt</span>
                <span>Four independent outputs</span>
                <span>Human-defined criteria</span>
              </div>
              <button
                className="button button-primary run-button"
                type="button"
                onClick={runPipeline}
                disabled={running}
              >
                {running ? "Pipeline running…" : "Run synthesis"}
              </button>
            </div>

            <div className="models-panel">
              <p className="panel-label">02 / Independent model lanes</p>
              <div className="model-grid">
                {models.map((model, index) => (
                  <article
                    className={`model-card ${model.color} ${
                      pipelineStage >= 0 ? "active" : ""
                    }`}
                    key={model.name}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="model-card-head">
                      <span className="model-glyph">
                        {model.name.slice(0, 1)}
                      </span>
                      <div>
                        <h4>{model.name}</h4>
                        <p>{model.role}</p>
                      </div>
                      <span className="status-light" />
                    </div>
                    <p className="model-output">
                      {pipelineStage === 0 && running
                        ? "Generating an independent response…"
                        : model.output}
                    </p>
                    <div className="signal-line">
                      <span
                        style={{
                          width:
                            pipelineStage >= 1
                              ? `${76 + index * 6}%`
                              : running
                                ? "38%"
                                : "62%",
                        }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="synthesis-panel">
              <p className="panel-label">03 / Governed synthesis</p>
              <ol className="stage-list">
                {stages.map((stage, index) => (
                  <li
                    className={
                      index < pipelineStage
                        ? "complete"
                        : index === pipelineStage
                          ? "current"
                          : ""
                    }
                    key={stage}
                  >
                    <span>{index < pipelineStage ? "✓" : index + 1}</span>
                    {stage}
                  </li>
                ))}
              </ol>
              <div className="progress-track" aria-label="Pipeline progress">
                <span style={{ width: progress }} />
              </div>
              <div
                className={
                  pipelineStage === stages.length - 1
                    ? "output-card revealed"
                    : "output-card"
                }
              >
                <span className="output-label">OHI_OUTPUT / 001</span>
                <strong>Recommended path</strong>
                <p>
                  Preserve the shared facts, state unresolved contradictions,
                  select the most coherent next action, and require human
                  verification before execution.
                </p>
                <div className="output-tags">
                  <span>clear</span>
                  <span>scoped</span>
                  <span>auditable</span>
                  <span>human-approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section architecture-section" id="architecture">
        <div className="section-heading">
          <div>
            <p className="kicker">OMOS architecture</p>
            <h2>From recognition to governed behavior.</h2>
          </div>
          <p>
            OMOS is a system of connected layers—not a single chatbot or
            interface. The four-layer structure separates identity,
            personalization, community support, and machine behavior so each
            can be reviewed and versioned independently.
          </p>
        </div>

        <div className="architecture-stack">
          {architectureLayers.map((layer, index) => (
            <article className="architecture-row" key={layer.number}>
              <div className="layer-index">{layer.number}</div>
              <div className="layer-title">
                <span>{layer.label}</span>
                <h3>{layer.title} Layer</h3>
              </div>
              <p>{layer.copy}</p>
              <div className="layer-route" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <i />
              </div>
            </article>
          ))}
        </div>

        <div className="authority-band">
          <div className="authority-orbit" aria-hidden="true">
            <span />
            <b>H</b>
          </div>
          <div>
            <p className="kicker">Authority rule</p>
            <h3>Intelligent systems may advise. Human authority decides.</h3>
          </div>
          <p>
            Every OMOS workflow should identify the responsible person, the
            action boundary, the approval threshold, and the record retained
            after execution.
          </p>
        </div>
      </section>

      <section className="section algorithm-section" id="algorithm">
        <div className="section-heading">
          <div>
            <p className="kicker">The OneGodian Algorithm™</p>
            <h2>Coherence before execution.</h2>
          </div>
          <p>
            The Algorithm is a six-stage interpretive and execution framework:
            observe the full context, reduce noise, evaluate alignment, select
            the strongest path, act within authority, and verify against
            reality.
          </p>
        </div>

        <div className="algorithm-lab">
          <div className="algorithm-rail" role="tablist" aria-label="Algorithm stages">
            {algorithmSteps.map((step, index) => (
              <button
                aria-selected={activeAlgorithm === index}
                className={activeAlgorithm === index ? "selected" : ""}
                key={step.name}
                onClick={() => setActiveAlgorithm(index)}
                role="tab"
                type="button"
              >
                <span>{step.number}</span>
                {step.name}
              </button>
            ))}
          </div>

          <div className="algorithm-focus" role="tabpanel">
            <span className="focus-number">
              {algorithmSteps[activeAlgorithm].number}
            </span>
            <p className="panel-label">Current decision stage</p>
            <h3>{algorithmSteps[activeAlgorithm].name}</h3>
            <p>{algorithmSteps[activeAlgorithm].description}</p>
            <blockquote>
              “{algorithmSteps[activeAlgorithm].question}”
            </blockquote>
            <div className="algorithm-controls">
              <button
                type="button"
                disabled={activeAlgorithm === 0}
                onClick={() => setActiveAlgorithm((step) => Math.max(0, step - 1))}
              >
                ← Previous
              </button>
              <button
                type="button"
                disabled={activeAlgorithm === algorithmSteps.length - 1}
                onClick={() =>
                  setActiveAlgorithm((step) =>
                    Math.min(algorithmSteps.length - 1, step + 1),
                  )
                }
              >
                Next stage →
              </button>
            </div>
          </div>

          <div className="score-panel">
            <div className="score-head">
              <div>
                <p className="panel-label">Alignment lab</p>
                <h3>Candidate path score</h3>
              </div>
              <div
                className="score-gauge"
                style={
                  {
                    "--score": `${alignmentScore * 3.6}deg`,
                  } as React.CSSProperties
                }
              >
                <strong>{alignmentScore}</strong>
                <span>/ 100</span>
              </div>
            </div>
            {Object.entries(scores).map(([key, value]) => (
              <label className="score-control" key={key}>
                <span>
                  {key.replace("_", " ")}
                  <b>{value}</b>
                </span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(event) =>
                    setScores((current) => ({
                      ...current,
                      [key]: Number(event.target.value),
                    }))
                  }
                />
              </label>
            ))}
            <p className="score-note">
              Demonstration only. Production scoring requires documented
              weights, test cases, and a defined approval policy.
            </p>
          </div>
        </div>

        <div className="equation-panel">
          <span>Alignment score</span>
          <strong>
            Truth + Clarity + Coherence + Dignity + Constructive Unity
          </strong>
          <i>minus</i>
          <strong>Distortion + Fragmentation + Needless Conflict</strong>
        </div>
      </section>

      <section className="section standards-section" id="standards">
        <div className="section-heading">
          <div>
            <p className="kicker">System standards</p>
            <h2>Defined rules. Visible limits.</h2>
          </div>
          <p>
            OMOS standards are stated with their operational scope. Internal
            systems remain voluntary and supplemental; civil, financial, and
            institutional requirements continue to control where applicable.
          </p>
        </div>

        <div className="standards-grid">
          <article className="time-card">
            <div className="standard-card-head">
              <span>OTS</span>
              <div>
                <p className="panel-label">OTS-V5 converter</p>
                <h3>Dual-date governance</h3>
              </div>
              <b>Validated</b>
            </div>
            <div className="date-converter">
              <label>
                Gregorian date
                <input
                  type="date"
                  min="2025-03-18"
                  max="2125-03-17"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
                <span className="date-presets">
                  <button type="button" onClick={() => setSelectedDate("2025-03-18")}>
                    Epoch
                  </button>
                  <button type="button" onClick={() => setSelectedDate("2026-03-18")}>
                    Year 0001
                  </button>
                  <button type="button" onClick={() => setSelectedDate("2026-07-28")}>
                    Current
                  </button>
                </span>
              </label>
              <div className="date-output">
                {otDate.valid ? (
                  <>
                    <span>{otDate.order}</span>
                    <strong>{otDate.dayName}</strong>
                    <h4>{otDate.label}</h4>
                    <p>Gregorian sync: {selectedDate}</p>
                  </>
                ) : (
                  <p>Select a date inside the validated OTS-V5 window.</p>
                )}
              </div>
            </div>
            <div className="validation-stats">
              <div>
                <strong>36,524</strong>
                <span>validated dates</span>
              </div>
              <div>
                <strong>100</strong>
                <span>full OT years</span>
              </div>
              <div>
                <strong>2025–2125</strong>
                <span>validation window</span>
              </div>
            </div>
            <p className="legal-note">
              OTS-V5 stores UTC/Gregorian time as the canonical system record.
              OneGodian Time is a deterministic supplemental display layer.
            </p>
          </article>

          <div className="standard-side">
            <article className="frequency-card">
              <div className="frequency-wave" aria-hidden="true">
                {Array.from({ length: 32 }).map((_, index) => (
                  <i
                    key={index}
                    style={{ height: `${18 + Math.abs(Math.sin(index * 0.68)) * 44}px` }}
                  />
                ))}
              </div>
              <p className="panel-label">OneGodian Frequency Standard™</p>
              <h3>
                432 <span>Hz</span>
              </h3>
              <p>Unity • Source • Grounding • Alignment</p>
              <small>
                Defined as a creative, design, and branding standard—not
                presented as a universal scientific constant.
              </small>
            </article>

            <article className="version-card">
              <p className="panel-label">Operational discipline</p>
              <h3>Versioned or it does not exist.</h3>
              <ul>
                <li>
                  <span>01</span> Named version and effective date
                </li>
                <li>
                  <span>02</span> Source and authority of record
                </li>
                <li>
                  <span>03</span> Defined inputs, outputs, and limits
                </li>
                <li>
                  <span>04</span> Test evidence and correction history
                </li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section record-section" id="record">
        <div className="section-heading">
          <div>
            <p className="kicker">Founder & record of development</p>
            <h2>Built through documented continuity.</h2>
          </div>
          <p>
            Gregory Lamar Jones is the founder and author of the ONEGODIAN
            framework. The record below separates the earlier identity and
            institutional phases from the later technical systems architecture.
          </p>
        </div>

        <div className="record-layout">
          <div className="founder-card">
            <span className="founder-monogram">GLJ</span>
            <p className="panel-label">Founder of record</p>
            <h3>Gregory Lamar Jones</h3>
            <p>
              Founder and author of the ONEGODIAN framework; founder and
              managing member of ONEGODIAN, LLC; later architect of the
              OneGodian Algorithm™, OHI™, and OMOS.
            </p>
            <div className="founder-tags">
              <span>Authorship</span>
              <span>Systems architecture</span>
              <span>Human authority</span>
            </div>
          </div>

          <ol className="timeline">
            <li>
              <span>2009</span>
              <div>
                <h3>Foundational authorship</h3>
                <p>
                  The ONEGODIAN name, written work, and framework enter the
                  founder’s documented authorship history.
                </p>
              </div>
            </li>
            <li>
              <span>2013</span>
              <div>
                <h3>Copyright registration record</h3>
                <p>
                  U.S. Copyright Registration No. TXu 1-845-540 is recorded for
                  the registered ONEGODIAN text and artwork.
                </p>
              </div>
            </li>
            <li>
              <span>2017–2020</span>
              <div>
                <h3>Institutional and community phase</h3>
                <p>
                  The Indigenous Nation of Onegodia is established as a
                  spiritual, religious, and community body; its constitution is
                  adopted in 2020. Jones’s earlier leadership role was Chief.
                </p>
              </div>
            </li>
            <li>
              <span>2018</span>
              <div>
                <h3>Commercial entity formed</h3>
                <p>
                  ONEGODIAN, LLC is formed in Connecticut on April 11, 2018, as
                  the private commercial, IP, software, publishing, and economic
                  entity.
                </p>
              </div>
            </li>
            <li>
              <span>2025</span>
              <div>
                <h3>Systems formalization</h3>
                <p>
                  OHI, Quantum-OHI, OneGodian Time, registries, verification
                  models, and related operating concepts are organized into a
                  broader systems architecture.
                </p>
              </div>
            </li>
            <li>
              <span>2026</span>
              <div>
                <h3>Algorithm and OMOS publication phase</h3>
                <p>
                  The OneGodian Algorithm white paper, system prompt, OTS-V5,
                  protocol structure, validation workbook, and OMOS public
                  platform are consolidated as versioned works.
                </p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      <section className="section environment-section" id="environment">
        <div className="section-heading environment-heading">
          <div>
            <p className="kicker">OMOS deployment contract</p>
            <h2>Hostinger is partially configured—not yet production-aligned.</h2>
          </div>
          <p>
            OMOS Decision Records require durable PostgreSQL in production. If
            <code> DATABASE_URL </code> is blank or missing, OMOS falls back to
            non-durable memory storage.
          </p>
        </div>

        <div className="environment-status">
          <div><span className="status-dot" /><strong>Production alignment required</strong></div>
          <p>PostgreSQL durability is the release gate • never paste unmasked secrets into chat or source control</p>
        </div>

        <div className="critical-path-panel">
          <div>
            <span>Critical path before restart</span>
            <strong>Complete these four variables in order.</strong>
          </div>
          <ol>
            {productionCriticalPath.map((name, index) => (
              <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><code>{name}</code></li>
            ))}
          </ol>
        </div>

        <div className="environment-layout">
          <div className="environment-register">
            <div className="env-register-head">
              <span>Variable</span><span>Purpose</span><span>Exposure</span>
            </div>
            {environmentVariables.map((variable) => (
              <div className="env-register-row" key={variable.name}>
                <code>{variable.name}</code>
                <p>{variable.purpose}</p>
                <span className={`exposure exposure-${variable.scope}`}>{variable.exposure}</span>
              </div>
            ))}
          </div>

          <aside className="secret-boundary">
            <p className="panel-label">Server-only boundary</p>
            <h3>Keep every credential private and runtime-only.</h3>
            <div className="secret-list">
              {serverSecretNames.map((name) => <code key={name}>{name}</code>)}
            </div>
            <div className="vite-warning">
              <span>Masked values only</span>
              <p>Do not place API keys or the PostgreSQL connection string in chat, GitHub, frontend code, or screenshots without masking them.</p>
            </div>
          </aside>
        </div>

        <div className="environment-notes">
          <article className="naming-warning">
            <span>Exact key required</span>
            <h3><code>QUANTUMOHI_URL</code>, not <code>QUANTUM_OHI_URL</code></h3>
            <p>The underscored spelling does not match the current repository contract. Add the canonical key rather than assuming the existing variable is read.</p>
          </article>
          <article>
            <span>Preserve deployment integrations</span>
            <h3>Do not delete environment-specific variables.</h3>
            <div className="retained-variable-list">
              {retainedIntegrationVariables.map((name) => <code key={name}>{name}</code>)}
            </div>
            <p>A blank <code>MANIFEST_ROUTE</code> is not a production blocker unless another Hostinger component consumes it; the OMOS server already owns its manifest endpoint.</p>
          </article>
        </div>

        <div className="environment-architecture" aria-label="OMOS environment architecture">
          <div className="env-node public-node">
            <span>Hostinger</span><strong>Runtime configuration</strong><code>masked production values</code>
          </div>
          <i aria-hidden="true">→</i>
          <div className="env-node api-node">
            <span>Protected layer</span><strong>OMOS API</strong><code>authenticated server runtime</code>
          </div>
          <i aria-hidden="true">→</i>
          <div className="service-stack">
            <span>OpenAI</span><span>Claude</span><span>Gemini</span><span>Grok / ACC</span><span>PostgreSQL</span>
          </div>
        </div>

        <div className="environment-rule persistence-gate">
          <span>Deployment proof</span>
          <strong><code>/api/v1/persistence</code> must report PostgreSQL and durable storage.</strong>
          <p>After Hostinger saves the variables and OMOS is redeployed, verify <code>backend: "postgresql"</code> and <code>durable: true</code>. Until both pass, production is not restart-safe for Decision Records.</p>
        </div>
      </section>

      <section className="section council-section" id="engineering-council">
        <div className="section-heading council-heading">
          <div>
            <p className="kicker">Canonical engineering governance</p>
            <h2>Every transition must leave evidence.</h2>
          </div>
          <p>
            The OMOS Engineering Council coordinates parallel agent work while
            keeping authorship, independent review, verification, and final
            human authority as separate responsibilities.
          </p>
        </div>

        <div className="canonical-council-lock">
          <div>
            <span>Canonical lifecycle • Version 1.0 • September 5, 2026</span>
            <strong>
              GitHub Issue → Task Classification → Agent Assignment → Agent Work →
              PR → Cross-Agent Review → Tests / CI → OMOS Review → Human Approval →
              Merge → Deployment Proof
            </strong>
          </div>
          <p>
            Each transition is evidence-gated. Work advances only when the
            required artifact exists, the responsible reviewer is independent,
            and the designated human authority has approved consequential changes.
          </p>
        </div>

        <div className="council-flow" aria-label="OMOS Engineering Council lifecycle">
          {engineeringStages.map((item, index) => (
            <div className="flow-stage" key={item.code}>
              <span>{item.code}</span>
              <strong>{item.stage}</strong>
              {index < engineeringStages.length - 1 && <i aria-hidden="true">→</i>}
            </div>
          ))}
          <div className="flow-stage flow-record">
            <span>12</span>
            <strong>Engineering Record</strong>
          </div>
        </div>

        <div className="council-grid">
          <div className="gate-register">
            <div className="register-head">
              <span>Stage</span>
              <span>Required artifact or gate</span>
            </div>
            {engineeringStages.map((item) => (
              <div className="register-row" key={item.code}>
                <div><span>{item.code}</span><strong>{item.stage}</strong></div>
                <p>{item.artifact}</p>
              </div>
            ))}
          </div>

          <aside className="council-rules">
            <p className="panel-label">Four absolute rules</p>
            {councilRules.map((rule) => (
              <article key={rule.number}>
                <span>{rule.number}</span>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.copy}</p>
                </div>
              </article>
            ))}
          </aside>
        </div>

        <div className="engineering-record">
          <div className="record-intro">
            <p className="panel-label">Engineering Record</p>
            <h3>Trace the change from proposal to production proof.</h3>
            <p>
              The record shows who proposed the change, who built it, who
              challenged it, what passed, who authorized it, what deployed,
              and whether production proved it worked.
            </p>
          </div>
          <div className="record-fields">
            {engineeringRecordFields.map((field, index) => (
              <span key={field}><b>{String(index + 1).padStart(2, "0")}</b>{field}</span>
            ))}
          </div>
        </div>

        <div className="authority-lock">
          <span>Final authorization boundary</span>
          <strong>Human approval → protected merge → verified deployment</strong>
          <p>
            OMOS may coordinate the work. It does not bypass the designated human
            authority. This evidence chain is required before autonomous coding-agent
            orchestration is permitted at scale.
          </p>
        </div>
      </section>

      <section className="section product-section" id="products">
        <div className="section-heading product-heading">
          <div>
            <p className="kicker">OMOS product collection</p>
            <h2>One system. Four artifact families.</h2>
          </div>
          <p>
            The collection uses one controlled visual language: obsidian and
            deep navy, metallic gold identity, cyan intelligence effects, and
            precise archival labeling. Each product remains distinct while
            visibly belonging to OMOS.
          </p>
        </div>

        <div className="collection-rule" aria-label="OMOS product visual system">
          <span>Obsidian foundation</span><i>→</i>
          <span>Gold artifact</span><i>→</i>
          <span>Cyan intelligence</span><i>→</i>
          <span>Technical label</span>
        </div>

        <div className="family-filters" role="group" aria-label="Filter product families">
          {productFamilies.map((family) => (
            <button
              className={activeFamily === family.key ? "family-filter active" : "family-filter"}
              key={family.key}
              type="button"
              aria-pressed={activeFamily === family.key}
              onClick={() => setActiveFamily(family.key)}
            >
              {family.label} <span>{family.count}</span>
            </button>
          ))}
        </div>

        <div className="product-grid">
          {products
            .filter((product) => activeFamily === "all" || product.family === activeFamily)
            .map((product) => (
              <article className={`product-card family-${product.family}`} key={product.code}>
                <div className="product-visual" aria-hidden="true">
                  <span className="product-orbit" />
                  <span className="product-glyph">{product.symbol}</span>
                  <small>{product.code}</small>
                </div>
                <div className="product-body">
                  <div className="product-meta">
                    <span>{product.family}</span>
                    <b>{product.code}</b>
                  </div>
                  <h3>{product.title}</h3>
                  <p className="product-edition">{product.edition}</p>
                  <p>{product.message}</p>
                  <button type="button" className="product-action" aria-label={`View ${product.title} details`}>
                    View artifact <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            ))}
        </div>

        <div className="catalog-note">
          <span>Catalog direction</span>
          <p>
            Final commerce thumbnails should use premium 3D product renders,
            restrained environments, one dominant OMOS mark, and short labels
            that remain readable at storefront scale.
          </p>
        </div>
      </section>

      <section className="section library-section" id="library">
        <div className="section-heading">
          <div>
            <p className="kicker">Source document room</p>
            <h2>Read the system at the source.</h2>
          </div>
          <p>
            These documents form the supplied source set for this site. They
            are presented as founder-authored materials and should be evaluated
            according to their stated version, scope, and supporting record.
          </p>
        </div>

        <div className="document-grid">
          {[
            {
              code: "ALG-01",
              title: "OneGodian Algorithm White Paper",
              meta: "Version 1.0 • 23 pages",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/onegodian-algorithm-whitepaper.pdf",
            },
            {
              code: "OTS-05",
              title: "OTS-V5 Corrected Edition",
              meta: "Dual dating & governance • 23 pages",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/ots-v5-corrected-edition.pdf",
            },
            {
              code: "PRT-01",
              title: "Protocol & Algorithm Framework",
              meta: "Unified architecture • 7 pages",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/protocol-and-algorithm-framework.pdf",
            },
            {
              code: "SYS-01",
              title: "OneGodian AI System Prompt",
              meta: "Version 1.0 • 11 pages",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/onegodian-system-prompt.pdf",
            },
            {
              code: "FRQ-01",
              title: "432 Hz Frequency Standard",
              meta: "Design standard • 3 pages",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/432hz-frequency-standard.pdf",
            },
            {
              code: "REC-01",
              title: "Founder & Author Statement",
              meta: "Authorship summary • 1 page",
              href: "https://onegodian-omos.onegodian.chatgpt.site/library/founder-author-statement.pdf",
            },
          ].map((document) => (
            <a
              className="document-card"
              href={document.href}
              key={document.code}
              target="_blank"
              rel="noreferrer"
            >
              <span>{document.code}</span>
              <h3>{document.title}</h3>
              <p>{document.meta}</p>
              <b>Open PDF ↗</b>
            </a>
          ))}
        </div>
      </section>

      <section className="section final-cta">
        <div>
          <p className="kicker">OMOS / repository release 1.1.0</p>
          <h2>Move the verified source to the verified host.</h2>
          <p>
            The next milestone is deployment evidence: run the production
            preflight, restart the canonical runtime on 1.1.0, verify durable
            PostgreSQL records, and pass the live health, manifest, provider,
            page, and security checks.
          </p>
        </div>
        <div className="release-card">
          <span>Component status</span>
          <strong>Functional source / live verification pending</strong>
          <ul>
            <li>✓ Seven-stage runtime</li>
            <li>✓ Provider adapters</li>
            <li>✓ Human Gate + records</li>
            <li>✓ Lifecycle regression test</li>
            <li>○ Production 1.1.0 deploy</li>
            <li>○ Live persistence proof</li>
          </ul>
          <a className="button button-primary" href="#production">
            Review release gates ↑
          </a>
        </div>
      </section>

      <footer>
        <div className="footer-brand">
          <img
            className="footer-logo"
            src="https://onegodian-omos.onegodian.chatgpt.site/omos-logo-gold.png"
            alt="OMOS — OneGodian Metaphysical Operating System"
            width={2048}
            height={682}
          />
        </div>
        <div className="footer-links">
          <a href="#production">Production status</a>
          <a href="#architecture">Architecture</a>
          <a href="#algorithm">Algorithm</a>
          <a href="#standards">Standards</a>
          <a href="#environment">Environment</a>
          <a href="#products">Products</a>
          <a href="#record">Record</a>
          <a href="#engineering-council">Engineering Council</a>
          <a href="#library">Documents</a>
        </div>
        <p className="footer-legal">
          OMOS and the OneGodian Algorithm are founder-authored private
          frameworks. Nothing on this site confers governmental authority,
          immunity, professional advice, or control over nonparticipants.
          Copyright registration protects registrable expression according to
          applicable law; it does not by itself establish exclusive rights in
          an idea, belief, method, or single word. © 2009–2026 Gregory Lamar
          Jones / ONEGODIAN, LLC.
        </p>
      </footer>
    </main>
  );
}
