const SITE = {
  name: 'OMOS™',
  fullName: 'OneGodian Metaphysical Operating System™',
  tagline: 'Node runtime, protocol layer, and developer-facing orchestration architecture for the ONEGODIAN ecosystem.',
  canonicalUrl: process.env.OMOS_PUBLIC_URL || 'https://omos.onegodian.com',
  appUrl: process.env.ONEGODIAN_APP_URL || 'https://app.onegodian.com',
  orgUrl: process.env.ONEGODIAN_PUBLIC_URL || 'https://onegodian.org',
  storeUrl: process.env.ONEGODIAN_COMMERCE_URL || 'https://onegodian.com',
  quantumUrl: process.env.QUANTUM_OHI_URL || 'https://quantumohi.com',
  version: '1.1.0'
};

const NAV = [
  { label: 'Overview', path: '/' },
  { label: 'OMOS', path: '/omos' },
  { label: 'Protocol', path: '/protocol' },
  { label: 'Algorithm', path: '/algorithm' },
  { label: 'OHI', path: '/ohi' },
  { label: 'Tools', path: '/tools' },
  { label: 'Docs', path: '/docs' },
  { label: 'Plugin Bridge', path: '/plugin-bridge' }
];

const footerLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Alignment API', path: '/alignment-api' },
  { label: 'Legal', path: '/legal' },
  { label: 'Contact', path: '/contact' },
  { label: 'Manifest', path: '/manifest' }
];

const ecosystem = [
  {
    name: 'OneGodian.org',
    role: 'Organization / public identity / institutional home',
    purpose: 'Public explanation, history, records, membership orientation, educational materials, and the “What is OneGodian?” public layer.',
    url: 'https://onegodian.org'
  },
  {
    name: 'OneGodian.com',
    role: 'Store / commerce platform',
    purpose: 'Digital downloads, products, merchandise, certificates, member purchases, and commercial campaign collections.',
    url: 'https://onegodian.com'
  },
  {
    name: 'u.OneGodian.com',
    role: 'E-learning / LMS',
    purpose: 'Courses, certifications, learning dashboards, onboarding pathways, and educational sequences.',
    url: 'https://u.onegodian.com'
  },
  {
    name: 'app.OneGodian.com',
    role: 'Unified control plane',
    purpose: 'Dashboards, registries, tools, operational interfaces, account systems, member infrastructure, and system status cards.',
    url: 'https://app.onegodian.com'
  },
  {
    name: 'OMOS.OneGodian.com',
    role: 'Protocol / specification / alignment node',
    purpose: 'OneGodian Algorithm™, Protocol Layer systems, OHI interaction frameworks, system prompts, tool pages, and runtime documentation.',
    url: 'https://omos.onegodian.com'
  },
  {
    name: 'QuantumOHI.com',
    role: 'Enterprise-facing systems and technology positioning',
    purpose: 'AI governance positioning, systems consulting, infrastructure architecture, OHI framework presentation, and technical strategy layers.',
    url: 'https://quantumohi.com'
  }
];

const pipeline = ['Observe', 'Distill', 'Align', 'Select', 'Execute', 'Verify'];

const pages = {
  '/': {
    title: 'OMOS™',
    eyebrow: 'ONEGODIAN SYSTEMS NODE',
    summary: SITE.tagline,
    cta: { label: 'Open Dashboard', href: '/dashboard' },
    secondaryCta: { label: 'Read the Protocol', href: '/protocol' },
    heroStats: [
      { value: '6', label: 'Runtime Phases', detail: 'Observe → Verify' },
      { value: '3', label: 'Plugin Targets', detail: 'Org · Store · QuantumOHI' },
      { value: '1.1', label: 'Node Content Version', detail: 'Rich public pages' }
    ],
    sections: [
      {
        title: 'What this node is',
        body: 'OMOS.OneGodian.com is the dedicated protocol/specification/alignment platform. It documents the operating-system dimension of OneGodian work: identity-aware infrastructure, OHI synthesis, model comparison, developer pathways, and WordPress plugin bridges.'
      },
      {
        title: 'What this node is not',
        body: 'It is not the store, LMS, governance body, or capital platform. It is the technical and conceptual node that explains how OMOS runtime pages, tools, prompts, plugins, and APIs fit together.'
      }
    ],
    featureCards: [
      { title: 'Protocol', body: 'Implementation, alignment standards, and interoperability documentation.', href: '/protocol', link: 'Open Protocol' },
      { title: 'Algorithm', body: 'Runtime architecture, synthesis flow, decision logic, and model coordination.', href: '/algorithm', link: 'Open Algorithm' },
      { title: 'Tools', body: 'Bridge-Builder, OHI Output Pipeline, Belief Mapper concepts, and declaration tools.', href: '/tools', link: 'Open Tools' },
      { title: 'Plugin Bridge', body: 'How OMOS plugin modules connect OneGodian.com, OneGodian.org, and QuantumOHI.com.', href: '/plugin-bridge', link: 'Open Bridge' }
    ]
  },
  '/omos': {
    title: 'What OMOS Is',
    eyebrow: 'OPERATING SYSTEM LAYER',
    summary: 'OMOS is the OneGodian Metaphysical Operating System: the structured operating layer that organizes identity, protocol, alignment, OHI synthesis, tools, documentation, and implementation standards.',
    cta: { label: 'View Architecture', href: '/docs' },
    secondaryCta: { label: 'Open Dashboard', href: '/dashboard' },
    sections: [
      { title: 'Public definition', body: 'OMOS presents the operating-system dimension of OneGodian work without replacing the organization site, commerce platform, LMS, app control plane, or enterprise technology site.' },
      { title: 'Operational function', body: 'OMOS turns the OneGodian body of work into organized pages, tool routes, API status, developer specs, plugin bridges, and compliance-safe explanations.' }
    ],
    featureCards: [
      { title: 'Identity Layer', body: 'Defines the terms, classification, and institutional context used by public and technical pages.', href: '/legal', link: 'Open Legal' },
      { title: 'Protocol Layer', body: 'Defines how systems recognize and exchange OneGodian-aligned context.', href: '/protocol', link: 'Open Protocol' },
      { title: 'Execution Layer', body: 'Applies Observe, Distill, Align, Select, Execute, and Verify across runtime logic.', href: '/algorithm', link: 'Open Algorithm' },
      { title: 'Bridge Layer', body: 'Connects the Node site to WordPress plugin targets and the app control plane.', href: '/plugin-bridge', link: 'Open Bridge' }
    ]
  },
  '/protocol': {
    title: 'The OneGodian Protocol™',
    eyebrow: 'OPTIONAL ALIGNMENT SPECIFICATION',
    summary: 'A non-denominational, non-prescriptive identity, semantic, and alignment framework for human expression, AI interaction, agent interoperability, and interface systems.',
    cta: { label: 'Open Alignment API', href: '/alignment-api' },
    secondaryCta: { label: 'Open Docs', href: '/docs' },
    sections: [
      { title: 'Protocol scope', body: 'Human layer, semantic layer, agent layer, and interface layer. Each layer is documented for public understanding, developer integration, and institutional review.' },
      { title: 'Operational principles', body: 'Non-denominational neutrality, unity-oriented framing, respectful interaction, clarity, compliance priority, and prohibition of universal or authoritative claims.' }
    ],
    bullets: ['Identity expression', 'AI alignment', 'Agent interoperability', 'Runtime safety standards', 'API integration pathways']
  },
  '/algorithm': {
    title: 'The OneGodian Algorithm™',
    eyebrow: 'OBSERVE → DISTILL → ALIGN → SELECT → EXECUTE → VERIFY',
    summary: 'The runtime interpretation layer, synthesis logic, and developer implementation model for OMOS-based systems.',
    cta: { label: 'View OHI Synthesis', href: '/ohi' },
    secondaryCta: { label: 'Open API', href: '/alignment-api' },
    sections: [
      { title: 'Functional model', body: 'The Algorithm starts with available inputs, reduces noise, evaluates alignment, selects the highest-coherence path, executes the path, and verifies the result against reality.' },
      { title: 'Technical implementation', body: 'For AI, agents, and software systems, the Algorithm can operate as an alignment layer, ranking function, policy filter, or workflow routing rule.' }
    ],
    process: pipeline
  },
  '/ohi': {
    title: 'OHI Output Pipeline',
    eyebrow: 'COUNCIL OF MODELS → GOVERNED OUTPUT',
    summary: 'OHI uses a council-of-models method to compare multiple reasoning outputs, identify shared foundations, remove remainders, and produce a disciplined synthesis.',
    cta: { label: 'Open Tools', href: '/tools' },
    secondaryCta: { label: 'Open Algorithm', href: '/algorithm' },
    sections: [
      { title: 'Council of Models', body: 'Multiple models can contribute distinct perspectives: structure, pattern recognition, consciousness framing, and raw challenge. OHI synthesis extracts useful signal without letting any single model govern the final record.' },
      { title: 'GCD-style synthesis', body: 'The pipeline identifies remainders such as bias, historical baggage, unsupported claims, and inconsistency, then reduces the material toward the most coherent shared foundation.' }
    ],
    featureCards: [
      { title: 'Input', body: 'One source prompt or question is passed through multiple reasoning perspectives.', href: '/tools', link: 'Tool Registry' },
      { title: 'Comparison', body: 'Outputs are compared for agreement, contradiction, structure, risk, and reusable signal.', href: '/algorithm', link: 'Algorithm' },
      { title: 'Distillation', body: 'Remainders are removed while retaining useful structure and truth-bearing content.', href: '/docs', link: 'Docs' },
      { title: 'Output', body: 'The final answer is normalized into a governed OHI-style output.', href: '/dashboard', link: 'Dashboard' }
    ]
  },
  '/alignment-api': {
    title: 'Alignment API v1',
    eyebrow: 'DEVELOPER INTEGRATION',
    summary: 'A server-side integration layer for manifests, tool metadata, runtime checks, WordPress bridge status, and protected alignment processing.',
    cta: { label: 'View Manifest', href: '/manifest' },
    secondaryCta: { label: 'View Tools API', href: '/api/tools' },
    sections: [
      { title: 'Current public endpoints', body: '/health, /manifest, /api/health, /api/manifest, /api/tools, and /api/stats are public status and metadata routes.' },
      { title: 'Protected processing route', body: '/process requires x-omos-key or x-omos-app-key. Secrets must remain server-side and must not be exposed in frontend JavaScript.' }
    ]
  },
  '/tools': {
    title: 'OMOS Tools',
    eyebrow: 'TOOL REGISTRY',
    summary: 'A controlled registry for OMOS tools, shortcodes, WordPress plugin pages, and future app/dashboard utilities.',
    cta: { label: 'Open Plugin Bridge', href: '/plugin-bridge' },
    secondaryCta: { label: 'View API Tools', href: '/api/tools' },
    sections: [
      { title: 'Operational rule', body: 'A tool should not be treated as operational until it has a public page, dashboard or app surface, admin/control mapping, endpoint documentation, production status, and verification notes.' }
    ]
  },
  '/docs': {
    title: 'OMOS Documentation Library',
    eyebrow: 'DOCUMENTATION INDEX',
    summary: 'Source documents, protocol references, algorithm notes, system prompts, classification standards, timekeeping standards, and deployment records.',
    cta: { label: 'Open Dashboard', href: '/dashboard' },
    secondaryCta: { label: 'Open Legal', href: '/legal' },
    sections: [
      { title: 'Documentation rule', body: 'All public claims must match implemented/runtime status. Draft concepts must be labeled as draft, planned, or documentation-only until implemented and testable.' }
    ]
  },
  '/plugin-bridge': {
    title: 'OMOS Plugin Bridge',
    eyebrow: 'WORDPRESS + NODE + APP',
    summary: 'The OMOS plugin is used on OneGodian.com, OneGodian.org, and QuantumOHI.com while this Node site remains the protocol/specification authority.',
    cta: { label: 'View Dashboard', href: '/dashboard' },
    secondaryCta: { label: 'View Manifest', href: '/manifest' },
    sections: [
      { title: 'Deployment targets', body: 'Install and configure the OMOS plugin on the WordPress properties that need OMOS tools, app bridge status, shortcodes, product pages, and LLM gateway settings.' },
      { title: 'Security rule', body: 'Provider keys, bridge keys, and app keys must remain server-side or inside protected WordPress admin settings. Do not expose secret keys in frontend JavaScript.' }
    ]
  },
  '/legal': {
    title: 'Legal and Compliance Positioning',
    eyebrow: 'PUBLIC-SAFE CLASSIFICATION',
    summary: 'OMOS uses legally disciplined classification language. ONEGODIAN, LLC is the commercial/IP/software entity. INO governance language belongs only where legally appropriate.',
    cta: { label: 'Open Docs', href: '/docs' },
    secondaryCta: { label: 'Contact', href: '/contact' },
    sections: [
      { title: 'Classification notice', body: 'OMOS is a protocol/specification/alignment documentation platform and software-support layer. It is not a legal filing system, financial instrument, religious authority, or substitute for civil law.' },
      { title: 'Two-track rule', body: 'ONEGODIAN, LLC is used for private enterprise, software development, digital infrastructure, and intellectual property. INO is separate and should be handled in its proper governance/religious society context.' }
    ]
  },
  '/contact': {
    title: 'Contact and Support',
    eyebrow: 'SUPPORT PATHWAYS',
    summary: 'Use this page for OMOS setup requests, plugin bridge support, documentation questions, and integration inquiries.',
    cta: { label: 'Open Dashboard', href: '/dashboard' },
    secondaryCta: { label: 'Open OneGodian.org', href: SITE.orgUrl },
    sections: [
      { title: 'Setup requests', body: 'Priority support areas include Node deployment, WordPress plugin setup, WXR import review, app bridge configuration, dashboard mirroring, and production verification.' }
    ]
  },
  '/admin': {
    title: 'Admin Control Panel Placeholder',
    eyebrow: 'ADMIN STATUS',
    summary: 'Protected administration should be handled through app.OneGodian.com controls and WordPress admin screens until authentication is implemented on this Node runtime.',
    cta: { label: 'Open Dashboard', href: '/dashboard' },
    secondaryCta: { label: 'Return Home', href: '/' },
    sections: [
      { title: 'Required before activation', body: 'Authentication, role-based permissions, audit logging, CSRF/nonce protection where applicable, input validation, and production monitoring.' }
    ]
  }
};

const tools = [
  { slug: 'bridge-builder', title: 'Bridge-Builder Tool', status: 'planned', path: '/tools/bridge-builder', shortcode: '[omos_bridge_builder]', description: 'Guides users from concepts to practical alignment and integration pathways.' },
  { slug: 'ohi-output-pipeline', title: 'OHI Output Pipeline', status: 'documentation-ready', path: '/tools/ohi-output-pipeline', description: 'Explains multi-model input, comparison, distillation, and governed OHI-style output synthesis.' },
  { slug: 'belief-mapper-lite', title: 'Belief Mapper Lite', status: 'planned', path: '/tools/belief-mapper-lite', description: 'Lightweight identity recognition and journey-stage routing concept.' },
  { slug: 'declaration-generator', title: 'OHI Declaration Generator', status: 'planned', path: '/tools/declaration-generator', description: 'Structured declaration drafting tool for voluntary identity and belief documentation.' }
];

const documents = [
  { slug: 'ots-v5', title: 'OneGodian Timekeeping System™ — OTS-V5', type: 'standard', status: 'source-uploaded' },
  { slug: 'algorithm-whitepaper', title: 'The OneGodian Algorithm™ White Paper', type: 'whitepaper', status: 'source-uploaded' },
  { slug: 'ai-system-prompt', title: 'The OneGodian AI System Prompt', type: 'prompt', status: 'source-uploaded' },
  { slug: 'protocol-algorithm-unified', title: 'The OneGodian Protocol™ and Algorithm™ Unified Framework', type: 'specification', status: 'source-uploaded' },
  { slug: 'gcd-model-synthesis', title: 'The Architecture of Algorithmic GCD Model Synthesis', type: 'technical-note', status: 'source-uploaded' },
  { slug: 'financial-classification', title: 'The OMOS Framework for Financial and Institutional Classification', type: 'compliance', status: 'source-uploaded' }
];

const pluginTargets = [
  { site: 'OneGodian.org', role: 'Organization / public identity / institutional home', pluginUse: 'Public tools, pages, membership handoff, OMOS explanations, and institutional documentation links.', restBaseUrl: 'https://onegodian.org/wp-json/omos/v1' },
  { site: 'OneGodian.com', role: 'Store / commerce platform', pluginUse: 'OMOS products, WooCommerce pathways, shortcodes, downloads, checkout handoff, and product education.', restBaseUrl: 'https://onegodian.com/wp-json/omos/v1' },
  { site: 'QuantumOHI.com', role: 'Quantum-OHI / advanced intelligence platform', pluginUse: 'OHI-aligned tools, prompt/system materials, LLM gateway settings, and technical demonstrations.', restBaseUrl: 'https://quantumohi.com/wp-json/omos/v1' }
];

module.exports = { SITE, NAV, footerLinks, ecosystem, pipeline, pages, tools, documents, pluginTargets };
