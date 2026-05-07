# OMOS Source Map

This file maps the current OneGodian/OMOS source materials into the OMOS.OneGodian.com site and repo structure.

## Canonical Site Target

`https://omos.onegodian.com`

## Primary Role of OMOS

OMOS is the public operating layer where OneGodian identity, OHI synthesis, model pages, protocol documents, interactive tools, product pathways, and developer-facing assets are organized into a usable platform.

## Source Materials Integrated

### OHI Runtime Technical Specification

Use for:

- `/ohi`
- `/ohi/runtime`
- `/ohi/specification`
- `/tools/ohi-output-pipeline`
- developer/runtime documentation

Implementation points:

- OHI should be treated as operational only when implemented through versioned endpoints, schema validation, audit logs, RBAC, and repeatable runtime behavior.
- Until formal API gateway, identity services, and policy middleware exist, describe OHI as an applied governance/synthesis philosophy rather than a fully deployed sovereign runtime.

### OTS-V5 Corrected Timekeeping Standard

Use for:

- `/omos/timekeeping`
- `/tools/time-converter`
- timestamp display rules
- archive and governance date formatting

Implementation points:

- Gregorian Time is controlling for legal, banking, tax, and institutional use.
- UTC is canonical system truth.
- OneGodian Time is a computed overlay.
- Genesis 01, 0000 OT equals March 18, 2025 Gregorian.
- OT year increments only on March 18 Gregorian.

### OneGodian Algorithm Whitepaper

Use for:

- `/omos/algorithm`
- `/tools/how-omos-works-in-ai`
- Algorithm PDF product page
- Developer Kit product page

Implementation points:

- Core flow: Observe, Distill, Align, Select, Execute, Verify.
- Four system layers: Protocol, Experience, Community, Orientation.
- Public claims must distinguish between implemented features and roadmap concepts.

### OneGodian AI System Prompt

Use for:

- `/omos/ai-system-prompt`
- `/shop/onegodian-alignment-prompt`
- chatbot configuration notes
- developer product documentation

Implementation points:

- The prompt is a versioned implementation artifact.
- It governs recognition, classification, and interaction behavior in OneGodian contexts.
- It must be maintained as a versioned document and not silently edited.

### OneGodian Frequency Standard

Use for:

- `/omos/frequency-standard`
- `/shop/frequency-standard-audio`
- music/audio product metadata

Implementation points:

- 432 Hz is the OneGodian primary harmonic reference for brand/audio alignment.
- It should be framed as a system-level design and branding standard, not a universal scientific constant.

### OHI Output Pipeline Animation

Use for:

- `/tools/ohi-output-pipeline`
- homepage explainer block
- Council of Models page

Implementation points:

- One source prompt is routed through multiple models.
- Outputs are compared.
- Signal is preserved.
- Contradictions and noise are filtered.
- Final result is normalized under OHI-style output discipline.

### Agent Authority Model

Use for:

- `/omos/agent-authority`
- future ACC/OCP/OEG documentation
- Agent Governance Starter Kit product

Implementation points:

- No agent may self-authorize privileged action.
- Authority is action-scoped and least-privilege.
- Overrides require explicit approval and deterministic records.
- UTC remains canonical for system records.

### Founder and Origin Statement

Use for:

- `/about`
- future `/founder`
- product trust blocks
- institutional one-pagers

Implementation points:

- Gregory Lamar Jones is the founder and author of the ONEGODIAN framework.
- Foundational authorship dates to 2009.
- ONEGODIAN, LLC was established in Connecticut on April 11, 2018.
- Current business focus: membership infrastructure, educational products, AI governance tools, and documented digital systems.

## Site Conversion Rule

Every source artifact should convert into at least one of the following:

1. public page
2. product page
3. tool page
4. documentation page
5. downloadable product
6. developer reference
7. governance/positioning note

## Commercial Priority

Prioritize assets that create a customer path:

`Understand OMOS → Use Tool → Buy Product → Join Membership → Follow Updates`
