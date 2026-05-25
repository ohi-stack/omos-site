const contentRegistry = {
  site: {
    canonicalHost: "omos.onegodian.com",
    canonicalUrl: "https://omos.onegodian.com",
    title: "OMOS — OneGodian Metaphysical Operating System",
    description:
      "Dedicated Node platform for OMOS protocol, OneGodian Algorithm, OHI synthesis, tools, artifacts, and implementation documentation.",
    operator: "ONEGODIAN, LLC",
    role: "Protocol, specification, documentation, and runtime authority node"
  },
  platformRule: {
    node: "OMOS.OneGodian.com is the canonical Node authority site for OMOS content, specs, APIs, docs, manifests, tools, and runtime pages.",
    plugin:
      "The OMOS WordPress plugin is the distribution layer for OneGodian.com, OneGodian.org, and QuantumOHI.com. It should embed, mirror, or summarize OMOS content without becoming the canonical authority source.",
    separation:
      "Node is source-of-truth and execution. WordPress plugin is presentation, shortcode delivery, WooCommerce routing, and cross-site integration."
  },
  routes: [
    {
      path: "/",
      title: "OMOS Home",
      type: "landing",
      purpose: "Primary public explanation and CTA gateway."
    },
    {
      path: "/omos",
      title: "What Is OMOS?",
      type: "pillar",
      purpose: "Defines OMOS as the OneGodian Metaphysical Operating System."
    },
    {
      path: "/protocol",
      title: "The OneGodian Protocol",
      type: "specification",
      purpose: "Public-safe protocol overview for identity, alignment, AI systems, agents, and robotics."
    },
    {
      path: "/algorithm",
      title: "The OneGodian Algorithm",
      type: "specification",
      purpose: "Explains observe, distill, align, select, execute, verify logic."
    },
    {
      path: "/human-ai-robot-era",
      title: "The Human-AI-Robot Era",
      type: "future-outlook",
      purpose: "Positions OMOS and the OneGodian Protocol for 2027–2028 and beyond."
    },
    {
      path: "/ohi",
      title: "OHI Synthesis",
      type: "technical",
      purpose: "Explains OneGodian Hyper-Conscious Intelligence and GCD-style model synthesis."
    },
    {
      path: "/tools",
      title: "OMOS Tools",
      type: "tools-index",
      purpose: "Gateway to Belief Mapper, Bridge Builder, declaration tools, and future protocol utilities."
    },
    {
      path: "/tools/belief-mapper",
      title: "Belief Mapper",
      type: "tool-page",
      purpose: "Maps existing beliefs to OneGodian journey stages without coercion."
    },
    {
      path: "/tools/bridge-builder",
      title: "Bridge Builder",
      type: "tool-page",
      purpose: "Converts conflict-heavy language into unity-centered language."
    },
    {
      path: "/docs",
      title: "Documentation",
      type: "docs-index",
      purpose: "Canonical documentation gateway."
    },
    {
      path: "/artifacts",
      title: "Artifacts",
      type: "archive",
      purpose: "Public-facing artifact index for prompts, schemas, PDF specs, and implementation assets."
    },
    {
      path: "/plugin",
      title: "OMOS WordPress Plugin",
      type: "integration",
      purpose: "Explains plugin use across OneGodian.com, OneGodian.org, and QuantumOHI.com."
    },
    {
      path: "/legal",
      title: "Legal and Classification Notes",
      type: "compliance",
      purpose: "Public-safe classification, limitations, and entity separation."
    },
    {
      path: "/dashboard",
      title: "OMOS Console",
      type: "runtime-ui",
      purpose: "Operational console and status page."
    }
  ],
  pluginTargets: [
    {
      domain: "OneGodian.com",
      role: "Commerce, products, downloads, certificates, membership purchases",
      pluginUse: "Product cards, download CTAs, protocol kit shortcodes, WooCommerce routing."
    },
    {
      domain: "OneGodian.org",
      role: "Public identity, institutional home, education, membership orientation",
      pluginUse: "Explainers, member pathways, Belief Mapper entry points, public protocol summaries."
    },
    {
      domain: "QuantumOHI.com",
      role: "OHI and Quantum-OHI technology, services, consulting, and governance tools",
      pluginUse: "Technical integration pages, OHI service cards, alignment prompt embeds, API documentation links."
    }
  ],
  contentPillars: [
    "OMOS definition and architecture",
    "The OneGodian Protocol",
    "The OneGodian Algorithm",
    "OHI model synthesis and GCD logic",
    "Human-AI-Robot Era outlook",
    "Belief Mapper and journey stages",
    "WordPress plugin distribution",
    "Legal and institutional classification",
    "Commercial product pathways"
  ],
  compliance: {
    commercialEntity: "ONEGODIAN, LLC is the commercial/IP/software entity.",
    governanceEntity:
      "Indigenous Nation of Onegodia may be referenced only where governance, spiritual society, or body politic context is legally appropriate.",
    noClaims: [
      "Do not present ONEGODIAN, LLC as a government.",
      "Do not present OMOS as a legal substitute for civil authority.",
      "Do not present plugin content as canon when it conflicts with the Node authority site.",
      "Do not use OT-only dates for legal, financial, or institutional records."
    ]
  }
};

module.exports = { contentRegistry };
