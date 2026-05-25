# OMOS WordPress Plugin Deployment Guide

## Purpose

This document defines how the OMOS plugin should be deployed across:

- OneGodian.com
- OneGodian.org
- QuantumOHI.com

The OMOS plugin is a synchronization and rendering layer used to:

- generate OMOS route pages
- render OMOS shortcodes
- expose protocol documents
- embed tool experiences
- sync public manifests
- standardize navigation structures
- expose approved shop pathways

---

# Platform Roles

## OneGodian.com

Role:

- commerce platform
- digital downloads
- memberships
- product kits
- certificates
- course purchases

Plugin responsibilities:

- OMOS document embeds
- OMOS product cards
- protocol download blocks
- algorithm CTA sections
- shop pathway routing
- Belief Mapper Lite embeds

Recommended plugin sections:

```text
/omos
/omos-downloads
/omos-tools
/omos-membership
```

---

## OneGodian.org

Role:

- institutional/public-facing identity site
- educational explanation layer
- public-safe orientation

Plugin responsibilities:

- OMOS explainer embeds
- documentation excerpts
- protocol summaries
- glossary cards
- route synchronization
- tool previews

Recommended plugin sections:

```text
/omos
/what-is-omos
/omos-docs
/omos-tools
```

---

## QuantumOHI.com

Role:

- OHI runtime/governance hub
- synthesis and alignment demonstrations
- enterprise and AI governance positioning

Plugin responsibilities:

- OHI diagrams
- protocol architecture embeds
- runtime status widgets
- model synthesis visualizations
- GCD pipeline explanations
- API documentation references

Recommended plugin sections:

```text
/ohi-runtime
/model-synthesis
/protocol-governance
/alignment-engine
```

---

# Shared Plugin Rules

## Manifest synchronization

The plugin manifest should always mirror:

```text
content/site-map.json
```

No public route should exist in one environment without being documented in the canonical site map.

---

## Public-safe classification

The plugin must avoid:

- governmental claims
- ecclesiastical claims
- investment guarantees
- unimplemented runtime claims

Use institution-safe language at all times.

---

## Runtime discipline

A feature is not operational unless:

- implemented
- documented
- repeatable
- testable
- versioned

---

## Preferred architecture

```text
OMOS.OneGodian.com
    ↓ canonical docs + runtime
Plugin layer
    ↓ synchronized rendering
OneGodian.com
OneGodian.org
QuantumOHI.com
```

The node site remains canonical.
The WordPress plugin acts as a synchronized presentation layer.
