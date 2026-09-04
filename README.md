# OMOS Site

Public site, runtime, orchestration, and documentation repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site target: `https://omos.onegodian.com`

## Purpose

OMOS is the operational intelligence and systems-architecture layer that organizes governed input, Layer 1 distillation, the OneGodian Algorithm™, OHI multi-model synthesis, model/data/action connections, human authorization, Decision Records, history, public documentation, and connected OneGodian platform bridges.

The current product objective is straightforward:

> **Turn a difficult question into an auditable decision.**

The repository therefore serves both the public OMOS site and the runtime contracts required to move from explanation to repeatable execution.

## Version discipline

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

Component maturity uses:

`CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION`

**Functional** means available for controlled validation with known limitations. Functional status does not authorize blanket Production claims or autonomous consequential execution.

## Responsibility separation

The canonical architecture separates the major systems:

- **OneGodian Protocol™** — definitions, identity rules, scope, interoperability, and behavioral constraints.
- **OneGodian Algorithm™** — evaluation, scoring, selection, decision logic, and the six-stage operating model.
- **OHI™** — multi-model comparison, critique, cross-review, synthesis, and preservation of meaningful dissent.
- **OMOS™** — runtime, orchestration, persistence, interfaces, connectors, audit records, and operational controls.
- **OLLM** — first-class local/model intelligence provider that may participate through the OMOS Model Gateway.
- **WordPress bridge** — distributed client/synchronization layer for OneGodian.org, OneGodian.com, and QuantumOHI.com.

## Canonical operating cycle

The OneGodian Algorithm provides the underlying process:

```text
Observe
→ Distill
→ Align
→ Select
→ Execute
→ Verify
```

The current OMOS product-facing runtime rail is:

```text
INPUT
→ LAYER 1
→ ALIGN
→ COUNCIL
→ SYNTHESIZE
→ RECORD
→ HISTORY
```

Human approval/rejection remains a governed control inside the Record transition where required.

## Current runtime responsibilities

OMOS.OneGodian.com acts as:

- the canonical OMOS runtime node;
- the public protocol/documentation layer;
- the flagship **Ask OMOS** workspace;
- the Council of Models orchestration surface;
- the Alignment Engine host;
- the persistent Decision Record and history layer;
- the manifest provider for plugins and dashboards;
- the synchronization target for WordPress OMOS integrations;
- the model/data/action/environment connection gateway;
- the bridge layer into other authorized OneGodian systems.

## Core end-to-end milestone

### OMOS-REF-0001 — First Governed End-to-End Reference Run

OMOS becomes operationally meaningful when one difficult question can travel through the complete governed cycle and its resulting Decision Record can later be reopened and audited:

```text
Human Question
→ Ask OMOS
→ Layer 1 Distillation
→ Alignment
→ Council Review
→ Governed OHI Synthesis
→ Human Decision Gate
→ Persistent Decision Record
→ Dashboard History
```

The reference run is not PASS until durable persistence, restart survival, and history retrieval are proven for the deployed environment.

## Source documents integrated

This repository maps or references the following source materials:

- OHI Runtime technical specification
- OTS-V5 corrected timekeeping standard
- OneGodian Algorithm whitepaper
- OneGodian AI System Prompt
- OneGodian Protocol / Algorithm unified framework
- OneGodian Frequency Standard
- OHI Output Pipeline animation
- Agent Authority Model
- Founder and origin statement
- Belief Mapper specification
- GCD model-synthesis architecture
- Digital Sanctuary framework
- institutional/domain-separation guidance
- OMOS WordPress/WXR assets
- OMOS Core Tools / Page Generator plugin assets
- Bridge-Builder Protocol specification
- OneGodian ecosystem manifest

## Primary information architecture

The customer-first navigation standard is documented in `docs/OMOS-MEGA-MENU-V2.md`.

Primary sections:

1. **OMOS**
2. **WORKSPACE**
3. **COUNCIL**
4. **OLLM**
5. **TOOLS**
6. **DEVELOPERS**
7. **PRICING**

Persistent header actions:

- Runtime status
- Sign In
- **ASK OMOS**

Representative routes include:

```text
/
/ask
/dashboard
/decision-review
/document-review
/council-of-models
/models
/connections
/belief-mapper
/tools
/artifacts
/docs
/protocol
/algorithm
/ohi
/ohi-output-pipeline
/digital-sanctuary
/pricing
/shop
/legal
/contact
```

A route must not be presented as a live product merely because it appears in the sitemap or menu specification.

## Model Gateway

The initial model connections are:

- OpenAI
- Anthropic
- Google Gemini
- xAI
- OLLM / local models

Every provider should sit behind one stable OMOS Model Connector Interface. Provider secrets stay server-side and must never be committed or rendered in the browser.

The Council distinguishes:

- requested providers;
- available providers;
- failed/degraded providers;
- simulation vs live mode;
- independent outputs;
- cross-reviews;
- agreement zones;
- contradictions;
- missing information;
- novel insights;
- supported dissent;
- evidence/verification state.

**Model agreement is not factual verification.**

## Connection & Adaptation Layer

OMOS supports four connection classes:

- **Model Connections** — OpenAI, Anthropic, Gemini, xAI, OLLM
- **Data Connections** — GitHub, Drive, WordPress, databases, knowledge systems
- **Action Connections** — GitHub, WordPress, Stripe, email, calendars, deployment systems
- **Environment Connections** — Unreal Engine, Blender, 3D, robots, IoT, XR/simulation

See `docs/OMOS-CONNECTION-ADAPTATION-LAYER.md`.

## Engineering Council

Canonical governed software workflow:

```text
GitHub Issue
→ Task Classification
→ Agent Assignment
→ Agent Work
→ PR
→ Cross-Agent Review
→ Tests / CI
→ OMOS Review
→ Human Approval
→ Merge
→ Deployment Proof
```

See `docs/OMOS-ENGINEERING-COUNCIL.md`.

## Compliance Test Suite

`docs/OMOS-COMPLIANCE-TEST-SUITE-1.0.md` defines the draft OMOS-CTS-1.0 conformance framework covering:

- schema validation;
- pipeline sequencing;
- Layer 1;
- alignment logic;
- prompt enforcement;
- API behavior;
- Council review;
- human gate integrity;
- Decision Record persistence;
- replay/idempotency;
- verification integrity;
- robotics safety where applicable.

Test states are `PASS`, `FAIL`, `WARN`, and `NOT_APPLICABLE`.

## Belief Mapper

The Belief Mapper is an OMOS identity product built around seven mapping dimensions and the voluntary journey stages:

`Seeker → Believer → OneGodian → Elder`

The result must explain the basis for the mapping and must not be presented as an objective scientific measurement of spirituality, morality, divine favor, legal identity, or human worth.

See `docs/OMOS-BELIEF-MAPPER-PRODUCT-SPEC.md`.

## OLLM

OLLM is a first-class intelligence provider inside the OMOS Model Gateway, not a separate orchestration architecture.

See `docs/OMOS-OLLM-INTEGRATION.md`.

## Commerce

The commercial principle is outcome-first:

> Consumers should pay OMOS to get a better outcome, not merely to read about the architecture.

Canonical customer path:

```text
Visitor
→ Ask OMOS Free
→ Paid Review / Council / Plan
→ Verified Checkout
→ OMOS Entitlement
→ Governed Run
→ Decision Record
→ Dashboard History
```

The server-side verified payment event is the payment authority; a browser success redirect alone must never unlock paid capability.

See:

- `docs/COMMERCE-ENTITLEMENT-SPEC.md`
- `docs/OMOS-PRODUCT-STRATEGY.md`

## Time governance

For system-of-record timestamps:

- UTC = canonical system timestamp;
- Gregorian date/time = controlling civil/legal reference;
- Onegodian Time™ = derived supplemental representation under OTS-V5.

OT is never the sole primary storage timestamp for civil, legal, banking, tax, or government records.

## WordPress plugin bridge

The OMOS plugin used on OneGodian.org, OneGodian.com, and QuantumOHI.com should function as a client of the central OMOS runtime, not as three separate OMOS implementations.

Expected responsibilities include:

- consume manifest/status endpoints;
- sync route inventories;
- expose approved OMOS shortcodes/components;
- render documentation/tool cards;
- launch OMOS workspace actions;
- preserve canonical OMOS routes;
- surface commerce pathways without duplicating runtime logic.

## Production safety boundary

OMOS must remain public-safe and commercially disciplined:

- ONEGODIAN, LLC is the commercial/IP/software layer;
- INO governance/religious-society language must not be casually merged into LLC product claims;
- internal identifiers do not replace government-issued identity;
- alignment scores are internal evaluation metrics, not objective moral/spiritual measurements;
- Council agreement is not truth verification;
- provider credentials remain server-side;
- consequential write actions require the configured authorization policy;
- claims of compatibility, Verified, or Production status must be scoped to the tested component/version/environment.

## Immediate implementation order

1. Prove durable production persistence.
2. Complete OMOS-REF-0001 end to end.
3. Finish model connection health/control UI.
4. Make Dashboard History searchable and reopenable.
5. Automate OMOS-CTS regression/conformance tests.
6. Implement commerce checkout, webhook verification, entitlements, and run authorization.
7. Complete the first paid customer journey.
8. Expand data/action/environment connectors.
9. Integrate OLLM as a first-class provider.
10. Expand Projects and multi-agent orchestration after the reference run is repeatable.
