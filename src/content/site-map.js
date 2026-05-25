const SITE_MAP = [
  {
    path: "/",
    title: "OMOS — OneGodian Metaphysical Operating System",
    label: "Home",
    type: "page",
    summary: "The canonical public Node runtime for OMOS.OneGodian.com.",
    status: "implemented"
  },
  {
    path: "/omos",
    title: "What Is OMOS?",
    label: "OMOS",
    type: "page",
    summary: "OMOS organizes OneGodian identity, OHI synthesis, protocol documents, tools, artifacts, and developer-facing assets into a usable public platform.",
    status: "implemented"
  },
  {
    path: "/ohi",
    title: "OHI Synthesis Layer",
    label: "OHI",
    type: "page",
    summary: "The OHI layer explains structured synthesis, model comparison, signal extraction, and governed output normalization.",
    status: "implemented"
  },
  {
    path: "/models",
    title: "Model Synthesis and Council Inputs",
    label: "Models",
    type: "page",
    summary: "Model pages describe how multi-model inputs are compared, distilled, and normalized under OMOS and OHI rules.",
    status: "implemented"
  },
  {
    path: "/protocol",
    title: "The OneGodian Protocol™",
    label: "Protocol",
    type: "page",
    summary: "The protocol layer defines optional identity, semantic, and interaction standards for human, AI, and agent-facing systems.",
    status: "implemented"
  },
  {
    path: "/algorithm",
    title: "The OneGodian Algorithm™",
    label: "Algorithm",
    type: "page",
    summary: "The algorithm layer follows Observe, Distill, Align, Select, Execute, and Verify logic for clarity and constructive alignment.",
    status: "implemented"
  },
  {
    path: "/tools",
    title: "OMOS Tools",
    label: "Tools",
    type: "page",
    summary: "Tool routes provide public-facing utilities, interactive explainers, and future shortcodes or embeds mirrored through the WordPress plugin.",
    status: "implemented"
  },
  {
    path: "/tools/bridge-builder",
    title: "Bridge-Builder Tool",
    label: "Bridge-Builder",
    type: "tool",
    summary: "A public tool route reserved for Bridge-Builder protocol explanation, shortcode integration, and plugin-backed implementation.",
    status: "implemented-shell"
  },
  {
    path: "/artifacts",
    title: "OMOS Artifacts",
    label: "Artifacts",
    type: "page",
    summary: "Artifacts include protocol records, diagrams, visual explainers, animation assets, and implementation references.",
    status: "implemented"
  },
  {
    path: "/docs",
    title: "OMOS Documentation",
    label: "Docs",
    type: "page",
    summary: "Documentation hub for the OMOS runtime, protocol, algorithm, OHI synthesis, and plugin integration contract.",
    status: "implemented"
  },
  {
    path: "/shop",
    title: "OMOS Products and Downloads",
    label: "Shop",
    type: "redirect-or-page",
    summary: "Commercial products, downloads, memberships, and checkout remain on OneGodian.com.",
    status: "implemented"
  },
  {
    path: "/latest-news",
    title: "Latest OMOS Updates",
    label: "Latest News",
    type: "page",
    summary: "News, release notes, council updates, production changes, and implementation milestones.",
    status: "implemented"
  },
  {
    path: "/dashboard",
    title: "OMOS Dashboard",
    label: "Dashboard",
    type: "page",
    summary: "Public runtime status, manifest access, and non-privileged dashboard information.",
    status: "implemented"
  },
  {
    path: "/admin",
    title: "OMOS Admin Boundary",
    label: "Admin",
    type: "boundary",
    summary: "Public admin boundary page. Privileged controls belong in the separate console/ACC surface, not the public OMOS runtime.",
    status: "implemented-boundary"
  },
  {
    path: "/legal",
    title: "OMOS Legal and Classification Notice",
    label: "Legal",
    type: "page",
    summary: "Public-safe legal classification, commercial separation, and institutional clarification notices.",
    status: "implemented"
  },
  {
    path: "/contact",
    title: "Contact OMOS / ONEGODIAN, LLC",
    label: "Contact",
    type: "page",
    summary: "Contact pathway for OMOS inquiries, product support, partnership review, and documentation questions.",
    status: "implemented"
  }
];

module.exports = { SITE_MAP };
