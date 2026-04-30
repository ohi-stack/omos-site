# OMOS Repository Content Index

Date: April 30, 2026
Repository: `ohi-stack/omos-site`
Status: Initial repository documentation layer

## Purpose

This file establishes the first OMOS repository content index for the uploaded OneGodian / OHI / OMOS source materials. It is intended to organize the documents that should be incorporated into the OMOS site, technical documentation, governance pages, and future implementation repos.

OMOS should be treated as an interface and documentation layer, not as a claim that every referenced system is fully operational. Where a system is conceptual, draft, or partially implemented, the repository must preserve that distinction.

## Core Rule

If it is not fully operational, documented, and repeatable, it should not be represented as current production infrastructure.

Use one of these status labels:

- `concept`
- `draft`
- `specification`
- `prototype`
- `production-ready`
- `production-live`

## Documents to Incorporate

### 1. OHI Runtime Specification

Source document: `Architecting the OHI Runtime: From Philosophy to Technical Specification`

Recommended repo placement:

```text
docs/ohi-runtime/
  overview.md
  runtime-v0.1-spec.md
  deterministic-boundaries.md
  executable-requirements.md
```

Key concepts to preserve:

- OHI moves from philosophy to runtime only when terminology is stabilized and technical boundaries become testable.
- Runtime v0.1 requires defined input/output structure, JSON payloads, deterministic structured responses, fixed temperature, fixed max tokens, and no hidden memory.
- Advisory intelligence must remain distinct from deterministic backend execution.
- Executable status requires OpenAPI specs, JSON schema validation, immutable audit logging, RBAC, and versioned policy injection.

### 2. OneGodian Timekeeping System — OTS-V5

Source documents:

- `Onegodian Timekeeping System™ — OTS-V5 (Corrected Edition)`
- `Onegodian Time Framework 3.26.26`

Recommended repo placement:

```text
docs/timekeeping/
  ots-v5.md
  conversion-rules.md
  database-timestamp-standard.md
  legal-display-rules.md
```

Key concepts to preserve:

- Gregorian Time controls legally for courts, contracts, banking, tax, and government correspondence.
- OT is supplemental and derived, never the primary legal timestamp.
- UTC / Gregorian timestamp is canonical system truth.
- Epoch: March 18, 2025 = Genesis 01, 0000 OT.
- Year rollover occurs every March 18.
- Leap year is determined by the Gregorian year in which the OT year ends.

### 3. OneGodian Algorithm White Paper

Source document: `onegodian algorithm whitepaper`

Recommended repo placement:

```text
docs/algorithm/
  whitepaper-summary.md
  protocol-layer.md
  experience-layer.md
  community-layer.md
  orientation-layer.md
  implementation-roadmap.md
```

Key concepts to preserve:

- The OneGodian Algorithm is a four-layer framework:
  - Protocol Layer
  - Experience Layer
  - Community Layer
  - Orientation Layer
- It addresses how AI systems, agents, platforms, and robotic interfaces recognize, classify, and interact with OneGodian identity.
- It should be documented as a framework/specification unless and until a working API, tests, and deployment exist.

### 4. OneGodian AI System Prompt

Source document: `onegodian ai system prompt`

Recommended repo placement:

```text
docs/prompts/
  onegodian-system-prompt-v1.md
  implementation-guide.md
  prompt-governance.md
```

Key concepts to preserve:

- Identity recognition rules.
- Classification rules.
- Behavioral standards.
- Journey stage awareness.
- Version control.

Important compliance note:

Prompt text should be tracked carefully and separated from platform-specific runtime instructions. Do not mix public-facing explanatory language with system-level instructions without version control.

### 5. OneGodian Protocol and Algorithm Unified Framework

Source document: `The OneGodian Protocol™ and Algorithm™ A Unified Framework for Identity, Alignment, and Intelligent Systems`

Recommended repo placement:

```text
docs/protocol/
  unified-framework.md
  protocol-definition.md
  operational-principles.md
  use-cases.md
  legal-positioning.md
```

Key concepts to preserve:

- Protocol as optional identity, semantic, and alignment framework.
- Algorithm as functional model: observe, distill, align, select, execute, verify.
- Clear distinction from religion, doctrine, and governance systems in public/institutional contexts.

### 6. Agent Authority Model

Source document: `Agent Authority Model Document`

Recommended repo placement:

```text
docs/agents/
  agent-authority-model.md
  role-action-matrix.md
  approval-thresholds.md
  kill-switch.md
  decision-record-spec.md
```

Key concepts to preserve:

- ACC is a control-plane system, not a simple automation surface.
- Authority path: ACC → OCP → OEG → Adapter / Runner.
- No agent may self-authorize privileged actions.
- Least privilege, explicit action scope, approval before override, deterministic logging.
- Gregorian UTC remains canonical for system-of-record timestamps.

### 7. OHI Output Pipeline Animation

Source file: `ohi_output_pipeline_animation.html`

Recommended repo placement:

```text
public/animations/ohi-output-pipeline.html
```

Recommended page:

```text
/visuals/ohi-output-pipeline
```

Key concepts to preserve:

- Multi-model input comparison.
- Signal extraction.
- Contradiction filtering.
- OHI-style normalized output.

### 8. OneGodian Frequency Standard

Source document: `OneGodian Frequency Standard — 432 Hz`

Recommended repo placement:

```text
docs/experience/frequency-standard.md
```

Key concepts to preserve:

- 432 Hz as branding/design/audio reference inside the OneGodian ecosystem.
- Do not present 432 Hz as a universal scientific constant.
- Apply to audio products, media, digital products, and thematic experiences.

### 9. Gen Alpha and Gen Beta Marketing Strategy

Source document: `ONEGODIAN™ Gen Alpha & Gen Beta Marketing Strategy`

Recommended repo placement:

```text
docs/marketing/gen-alpha-beta-strategy.md
```

Key concepts to preserve:

- Younger generations form identity through interfaces, not legacy institutions.
- Belief Mapper Lite as an interactive entry point.
- Gamified journey stages: Explorer, Aligned, Activated, Guide.
- Risk controls: avoid conversion framing, avoid misclassification, preserve voluntary engagement.

### 10. Founder / Authorship Statement

Source document: `Gregory Lamar Jones is the founder and author of the ONEGODIAN framework`

Recommended repo placement:

```text
docs/founder/founder-statement.md
```

Key concepts to preserve:

- Gregory Lamar Jones is the founder and author of the ONEGODIAN framework.
- Foundational authorship dates to 2009.
- ONEGODIAN, LLC was established in Connecticut on April 11, 2018.
- Current work focuses on membership infrastructure, educational products, AI governance tools, and documented digital systems.

## Suggested OMOS Site Pages

```text
/
/about
/docs
/docs/ohi-runtime
/docs/algorithm
/docs/protocol
/docs/agents
/docs/timekeeping
/docs/prompts
/visuals/ohi-output-pipeline
/marketing/gen-alpha-beta
/founder
/downloads
```

## Immediate Engineering Tasks

1. Create the documentation folders listed above.
2. Add markdown summaries for each uploaded document.
3. Import the OHI output pipeline HTML into `public/animations/`.
4. Add a docs navigation map.
5. Add status labels to each doc.
6. Keep conceptual, prototype, and production-live systems clearly separated.

## Repository Boundary

`omos-site` should be the public/documentation interface.

Execution code belongs in dedicated infrastructure repos such as:

- `onegodian-llm`
- `execution-interface`
- `identity-service`
- `acc-*`
- `ohi-control-plane`

OMOS should explain, organize, and route. It should not silently become the execution layer.
