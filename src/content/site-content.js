const SITE = {
  name: 'OMOS — OneGodian Metaphysical Operating System',
  shortName: 'OMOS',
  canonicalUrl: process.env.OMOS_PUBLIC_URL || 'https://omos.onegodian.com',
  appUrl: process.env.ONEGODIAN_APP_URL || 'https://app.onegodian.com',
  orgUrl: process.env.ONEGODIAN_PUBLIC_URL || 'https://onegodian.org',
  storeUrl: process.env.ONEGODIAN_COMMERCE_URL || 'https://onegodian.com',
  quantumUrl: process.env.QUANTUM_OHI_URL || 'https://quantumohi.com',
  version: '1.0.0',
  classification:
    'Protocol, specification, documentation, and alignment system for the OneGodian digital ecosystem.'
};

const NAV = [
  { label: 'OMOS', path: '/omos' },
  { label: 'Protocol', path: '/protocol' },
  { label: 'Algorithm', path: '/algorithm' },
  { label: 'Alignment API', path: '/alignment-api' },
  { label: 'Tools', path: '/tools' },
  { label: 'Docs', path: '/docs' },
  { label: 'Plugin Bridge', path: '/plugin-bridge' }
];

const pages = {
  '/': {
    title: 'OMOS.OneGodian.com Node Protocol Platform',
    eyebrow: 'OMOS NODE · PROTOCOL / SPECIFICATION / ALIGNMENT',
    summary:
      'The dedicated OMOS node organizes the OneGodian Metaphysical Operating System into public pages, developer documentation, protocol references, plugin bridge guidance, and production-ready alignment materials.',
    cta: { label: 'Open Console', href: '/dashboard' },
    secondaryCta: { label: 'View Documentation', href: '/docs' },
    sections: [
      {
        heading: 'Role in the ecosystem',
        body:
          'OMOS.OneGodian.com is the protocol and specification platform. OneGodian.org remains the organization/public identity home; OneGodian.com remains the store; app.OneGodian.com remains the Node control plane tying everything together.'
      },
      {
        heading: 'Production priority',
        body:
          'Do not expand the subdomain map. The current priority is to make OMOS operational, clearly linked, mirrored inside the OneGodian App, connected to plugin bridges, documented, and production-stable.'
      }
    ]
  },
  '/omos': {
    title: 'What OMOS Is',
    eyebrow: 'FOUNDATION',
    summary:
      'OMOS is the OneGodian Metaphysical Operating System: a structured protocol layer for identity, alignment, OHI synthesis, model comparison, agent interaction, and disciplined output governance.',
    sections: [
      {
        heading: 'Public definition',
        body:
          'OMOS presents the operating-system dimension of OneGodian work without replacing the organization, store, university, galaxy, capital platform, or app control plane.'
      },
      {
        heading: 'What OMOS contains',
        body:
          'Protocol documents, alignment specifications, system prompts, algorithm references, OHI model synthesis documentation, tools, artifacts, legal-safe classification language, and app/plugin bridge instructions.'
      }
    ]
  },
  '/protocol': {
    title: 'The OneGodian Protocol™',
    eyebrow: 'SPECIFICATION',
    summary:
      'The protocol defines optional identity, semantic, and alignment standards for human identity expression, AI and agent interaction, digital communication, and interface systems.',
    sections: [
      {
        heading: 'Core principle',
        body:
          'Unity operates as a foundational reference point. The protocol is conceptual, optional, non-prescriptive, and compatible with multiple traditions and systems.'
      },
      {
        heading: 'Architecture',
        body:
          'Human layer, semantic layer, agent layer, and interface layer. Each layer is documented for public explanation, developer integration, and institutional review.'
      }
    ]
  },
  '/algorithm': {
    title: 'The OneGodian Algorithm™',
    eyebrow: 'ALIGNMENT LOGIC',
    summary:
      'The Algorithm is a unity-based interpretive and execution framework for identifying the most coherent, truthful, dignified, and constructive path across human, digital, and AI-mediated systems.',
    sections: [
      {
        heading: 'Functional sequence',
        body:
          'Observe, distill, align, select, execute, and verify. The system reduces noise, identifies signal, ranks options by coherence, and returns to documented standards.'
      },
      {
        heading: 'Four-layer implementation',
        body:
          'Protocol Layer, Experience Layer, Community Layer, and Orientation Layer. The Node site documents each layer and exposes structured metadata for the app control plane.'
      }
    ]
  },
  '/alignment-api': {
    title: 'Alignment API v1',
    eyebrow: 'DEVELOPER SPEC',
    summary:
      'A server-side API specification for applying OMOS / OneGodian alignment profiles, validating structured outputs, exposing manifests, and connecting tools to the OneGodian App.',
    sections: [
      {
        heading: 'Current endpoints',
        body:
          'The Node runtime exposes /health, /manifest, /api/health, /api/manifest, /api/tools, /api/stats, and /process. The /process route requires x-omos-key.'
      },
      {
        heading: 'Planned expansion',
        body:
          'Future endpoints should support alignment validation, model synthesis, tool execution, prompt retrieval, WordPress bridge status, and app.OneGodian.com status mirroring.'
      }
    ]
  },
  '/tools': {
    title: 'OMOS Tools',
    eyebrow: 'TOOLS',
    summary:
      'A controlled catalog for OMOS tools, including Bridge-Builder, OHI output pipeline, Belief Mapper concepts, declaration generators, model synthesis references, and future API utilities.',
    sections: [
      {
        heading: 'Tool standard',
        body:
          'No tool should be treated as operational until it has a public page, dashboard or app surface, admin/control mapping, endpoint documentation, tests or verification notes, and production status.'
      }
    ]
  },
  '/docs': {
    title: 'OMOS Documentation Library',
    eyebrow: 'DOCUMENTS',
    summary:
      'Documentation index for the protocol, algorithm, AI system prompt, OTS-V5 timekeeping standard, frequency standard, model synthesis, financial classification, and deployment notes.',
    sections: [
      {
        heading: 'Documentation rule',
        body:
          'All public claims must match implemented/runtime status. Draft concepts must be labeled as draft, planned, or documentation-only until they are implemented and testable.'
      }
    ]
  },
  '/plugin-bridge': {
    title: 'OMOS Plugin Bridge',
    eyebrow: 'WORDPRESS + APP BRIDGE',
    summary:
      'The OMOS WordPress plugin is intended for OneGodian.com, OneGodian.org, and QuantumOHI.com. This page documents bridge routes, environment variables, admin screens, and production checks.',
    sections: [
      {
        heading: 'Deployment targets',
        body:
          'Install and configure the OMOS plugin on the WordPress properties that need OMOS tools, app bridge status, shortcodes, product pages, and LLM gateway settings.'
      },
      {
        heading: 'Security rule',
        body:
          'Provider keys and bridge keys must remain server-side or inside protected WordPress admin settings. Do not expose secret keys in frontend JavaScript.'
      }
    ]
  },
  '/legal': {
    title: 'Legal and Compliance Positioning',
    eyebrow: 'PUBLIC-SAFE LANGUAGE',
    summary:
      'OMOS documentation uses legally disciplined classification language. ONEGODIAN, LLC is the commercial/IP/software entity; INO governance language belongs only where legally appropriate.',
    sections: [
      {
        heading: 'Classification notice',
        body:
          'OMOS is a protocol/specification/alignment documentation platform and software-support layer. It is not a legal filing system, financial instrument, or substitute for civil law.'
      }
    ]
  },
  '/contact': {
    title: 'Contact and Support',
    eyebrow: 'SUPPORT',
    summary:
      'Use this page for OMOS setup requests, plugin bridge support, documentation questions, and integration inquiries.',
    sections: [
      {
        heading: 'Setup requests',
        body:
          'Priority support areas include Node deployment, WordPress plugin setup, WXR import review, app bridge configuration, dashboard mirroring, and production verification.'
      }
    ]
  },
  '/admin': {
    title: 'Admin Control Panel Placeholder',
    eyebrow: 'ADMIN',
    summary:
      'Administrative workflows should be handled through protected app.OneGodian.com controls and WordPress admin screens. This Node page is a public-safe placeholder until authentication is implemented.',
    sections: [
      {
        heading: 'Required before activation',
        body:
          'Authentication, role-based permissions, audit logging, CSRF/nonce protection where applicable, input validation, and production monitoring.'
      }
    ]
  }
};

const tools = [
  {
    slug: 'bridge-builder',
    title: 'Bridge-Builder Tool',
    status: 'planned',
    path: '/tools/bridge-builder',
    shortcode: '[omos_bridge_builder]',
    description: 'Guides users from concepts to practical alignment and integration pathways.'
  },
  {
    slug: 'ohi-output-pipeline',
    title: 'OHI Output Pipeline',
    status: 'documentation-ready',
    path: '/tools/ohi-output-pipeline',
    description: 'Explains multi-model input, comparison, distillation, and governed OHI-style output synthesis.'
  },
  {
    slug: 'belief-mapper-lite',
    title: 'Belief Mapper Lite',
    status: 'planned',
    path: '/tools/belief-mapper-lite',
    description: 'A lightweight mapper concept for identity recognition and journey-stage routing.'
  }
];

const documents = [
  { slug: 'ots-v5', title: 'OneGodian Timekeeping System™ — OTS-V5', type: 'standard', status: 'source-uploaded' },
  { slug: 'algorithm-whitepaper', title: 'The OneGodian Algorithm™ White Paper', type: 'whitepaper', status: 'source-uploaded' },
  { slug: 'ai-system-prompt', title: 'The OneGodian AI System Prompt', type: 'prompt', status: 'source-uploaded' },
  { slug: 'frequency-standard', title: 'OneGodian Frequency Standard™', type: 'standard', status: 'source-uploaded' },
  { slug: 'protocol-algorithm-unified', title: 'The OneGodian Protocol™ and Algorithm™ Unified Framework', type: 'specification', status: 'source-uploaded' },
  { slug: 'gcd-model-synthesis', title: 'The Architecture of Algorithmic GCD Model Synthesis', type: 'technical-note', status: 'source-uploaded' },
  { slug: 'financial-classification', title: 'The OMOS Framework for Financial and Institutional Classification', type: 'compliance', status: 'source-uploaded' }
];

const pluginTargets = [
  {
    site: 'OneGodian.org',
    role: 'Organization / public identity / institutional home',
    pluginUse: 'Public tools, pages, membership handoff, OMOS explanations, and institutional documentation links.',
    restBaseUrl: 'https://onegodian.org/wp-json/omos/v1'
  },
  {
    site: 'OneGodian.com',
    role: 'Store / commerce platform',
    pluginUse: 'OMOS products, WooCommerce pathways, shortcodes, downloads, checkout handoff, and product education.',
    restBaseUrl: 'https://onegodian.com/wp-json/omos/v1'
  },
  {
    site: 'QuantumOHI.com',
    role: 'Quantum-OHI / advanced intelligence platform',
    pluginUse: 'OHI-aligned tools, prompt/system materials, LLM gateway settings, and technical demonstrations.',
    restBaseUrl: 'https://quantumohi.com/wp-json/omos/v1'
  }
];

module.exports = { SITE, NAV, pages, tools, documents, pluginTargets };
