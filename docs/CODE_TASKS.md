# OMOS.OneGodian.com — Code Tasks

Status: active build queue
Repository: ohi-stack/omos-site
Runtime: Node / Express
Platform role: central OMOS runtime for protocol, OHI synthesis, tools, projects, decision records, artifacts, docs, runtime manifest, and WordPress bridge sync.

---

## Phase 1 — Runtime Foundation

### TASK-001 — Expand Runtime Manifest
Priority: Critical

Build a structured manifest registry that includes public routes, dashboard routes, API routes, tool registry, artifact registry, docs registry, plugin sync targets, connected domains, version metadata, maturity flags, and orchestration mode flags.

Acceptance criteria:
- `/manifest` returns full structured platform metadata
- `/api/manifest` returns the same object with generated timestamp
- manifest includes OneGodian.com, OneGodian.org, QuantumOHI.com, and app.OneGodian.com targets
- each runtime capability declares maturity
- Council declares `simulation`, `live_provider`, or `mixed`

### TASK-002 — Add Tools API
Priority: Critical

Create `src/runtime/registries/tools.js`, `GET /api/tools`, and `GET /api/tools/:slug`.

Initial tools include belief mapper, consensus counter, AI consensus, foundation day, timekeeping, generators, converters, Ask OMOS, and Council Review.

### TASK-003 — Add Artifacts API
Priority: Critical

Create `src/runtime/registries/artifacts.js`, `GET /api/artifacts`, and `GET /api/artifacts/:slug` with document, code, system, whitepaper, prompt, decision-record, and verification-result artifact classes.

### TASK-004 — Add System Health API
Priority: High

Create `GET /api/system-health` checking manifest, registries, required pages, APIs, environment variables, plugin sync, decision-record schema, provider-adapter status, and verification services.

---

## Phase 2 — Frontend Pages

### TASK-005 — Global Layout Shell
Priority: High

Shared OMOS shell with responsive navigation and persistent Console action.

Primary runtime navigation should evolve toward:
- OMOS
- Ask OMOS
- Council
- Projects
- Algorithm
- OHI Pipeline
- Tools
- Runs
- Artifacts
- Verification
- Developers
- Docs
- Console

### TASK-006 — Upgrade Public Runtime Pages
Priority: High

Upgrade home, OMOS, Protocol, Algorithm, OHI, Models/Council, Tools, Docs, Dashboard/Console, Legal, and Pipeline pages to describe operational capability and actual maturity rather than future-only concepts.

### TASK-007 — Add Runtime Workspace Pages
Priority: Critical

Add routes/pages for:
- `/ask`
- `/council`
- `/projects`
- `/runs`
- `/verification`
- `/developers`

Acceptance criteria:
- all route without 404
- each exposes maturity/status
- no simulated provider output is presented as live

---

## Phase 3 — Ask OMOS + Layer 1

### TASK-008 — Ask OMOS Intake API
Priority: Critical

Create:
- `POST /api/runs`
- `GET /api/runs/:id`

Input should accept text plus optional domain, source site, user context, requested output type, and evidence references.

Run pipeline begins:
`RECEIVED → VALIDATED → NORMALIZED → CONTEXT_BOUND`.

### TASK-009 — Layer 1 Signal Classifier
Priority: Critical

Implement canonical normalization that separates instructions, facts, claims, evidence, assumptions, contradictions, irrelevant material, rhetorical pressure, and prompt-injection attempts.

Required preservation:
- objective
- names
- dates/timezones
- entity/legal distinctions
- explicit constraints/prohibitions
- evidence
- meaningful dissent
- unresolved contradictions

Governing rule: maximum defensible noise reduction with no material distortion.

### TASK-010 — Deterministic Layer 1 Replay Tests
Priority: Critical

Create corpus-based regression tests including the existing high-entropy validation scenario.

Acceptance criteria:
- same governed input/ruleset yields same canonical classification payload
- no material constraint loss
- prompt injection quarantined
- contradictions preserved

---

## Phase 4 — Council of Models + OHI

### TASK-011 — Council Adapter Interface
Priority: Critical

Create provider adapter interfaces for:
- OpenAI
- Anthropic
- Google Gemini
- xAI

Adapters must support status values:
`unconfigured`, `simulation`, `available`, `degraded`, `disabled`.

No secret keys committed.

### TASK-012 — Round 1 Independent Outputs
Priority: Critical

Generate or accept independent outputs with provenance. Providers must not receive each other's Round 1 responses.

### TASK-013 — Cross-Model Review Matrix
Priority: Critical

Implement non-self-review matrix:
- GPT reviews Claude / Gemini / Grok
- Claude reviews GPT / Gemini / Grok
- Gemini reviews GPT / Claude / Grok
- Grok reviews GPT / Claude / Gemini

Extract:
- agreement zones
- contradictions
- missing ideas
- novel insights
- unsupported claims
- supported dissent
- unresolved questions

### TASK-014 — Upgrade OHI Pipeline Interaction
Priority: High

Convert `/ohi-output-pipeline` into a true interactive simulator/workflow surface connected to runtime state where available.

Must visibly label SIMULATION vs LIVE_PROVIDER vs MIXED.

---

## Phase 5 — Alignment + Selection

### TASK-015 — Alignment State Schema
Priority: Critical

Create `schemas/alignment-state.schema.json` with separate dimensions for Truth, Clarity, Coherence, Dignity, Constructive Unity, Evidence, Verifiability, Transparency, Reproducibility, Security, Long-Term Benefit, and Execution Readiness.

Required states:
`ALIGNED`, `CONDITIONALLY_ALIGNED`, `HUMAN_REVIEW_REQUIRED`, `INSUFFICIENT_EVIDENCE`, `CONFLICT_UNRESOLVED`, `NOT_ALIGNED`, `PROHIBITED`.

### TASK-016 — Hard Constraint Engine
Priority: Critical

Hard gates for dignity, consent, authorization, fabricated evidence, material safety, and unresolved high risk. Hard failures cannot be averaged away by weighted scores.

### TASK-017 — Select Decision Tree
Priority: High

Formalize action selection: reject prohibited actions, preserve factual integrity, protect dignity/rights/privacy/consent, respect authorization, preserve human agency, prefer least harmful effective action, prefer reversible action under uncertainty, escalate insufficient evidence, record alternatives.

---

## Phase 6 — Decision Records + Verification

### TASK-018 — Decision Record Schema
Priority: Critical

Create `schemas/decision-record.schema.json` and runtime serializer.

Minimum fields:
- decision_id
- runtime_version
- algorithm_version
- ruleset_version
- mode
- input_hash
- models_used
- claims
- evidence_refs
- agreement_zones
- contradictions
- missing_ideas
- novel_insights
- supported_dissent
- alignment_scores
- confidence
- recommended_action
- human_approval_required
- verification_status
- timestamp_utc
- timestamp_local
- timestamp_ot
- output_hash

### TASK-019 — Verification Result Schema
Priority: Critical

Create `schemas/verification-result.schema.json`. Keep model agreement, evidence support, canonical alignment, factual verification, human approval, and registry status separate.

### TASK-020 — Human Approval Boundary
Priority: Critical

Require human approval for consequential legal submissions, financial actions, identity reclassification, registry publication, certificate issuance, infrastructure changes, external-account changes, and autonomous actions with material real-world effect.

---

## Phase 7 — Projects / Multi-Agent Orchestration

### TASK-021 — Project Object
Priority: High

Create Project model with objective, tasks, assigned agents/models, dependencies, artifacts, decisions, approvals, activity history, verification status, and Definition of Done.

### TASK-022 — Parallel Workstreams
Priority: High

Support Research, Architecture, Development, Content, Financial Analysis, Compliance, Testing, Verification, and Production workstreams.

Coordinator merges results only after required checks.

### TASK-022b — Engineering Record Schema
Priority: Critical

Create `schemas/engineering-record.schema.json`.
Track: issue_id, assigned_agents, pr_number, reviewing_agents, test_results, approved_by, merged_sha, deployed_sha, deployment_timestamp_utc, target_environment, verification_result, rollback_reference, final_status.
Ensure it satisfies the canonical OMOS Engineering Council Lifecycle requirements.

---

## Phase 8 — WordPress Bridge

### TASK-023 — Plugin Manifest Contract v2
Priority: Critical

Update plugin contract so OneGodian.org, OneGodian.com, and QuantumOHI.com consume central runtime state.

Required bridge functions:
- runtime health
- manifest sync
- capability/tool registry
- site context
- Ask OMOS launcher
- Council Review launcher
- embedded components/shortcodes/blocks
- run-state display
- artifact return
- audit correlation ID
- authentication handoff when implemented
- error/fallback behavior

### TASK-024 — WordPress Runtime Shortcodes
Priority: High

Add/standardize:
- `[omos_ask]`
- `[omos_council]`
- `[omos_run_status]`
- `[omos_system_status]`
- `[omos_tools]`
- `[omos_belief_mapper]`
- `[omos_open_console_button]`

Existing shortcodes remain backward-compatible where possible.

---

## Phase 9 — Time, Compliance, and Production Hardening

### TASK-025 — OTS-V5 Timestamp Utility
Priority: High

Create/verify `src/runtime/ots-v5.js`.

Rules:
- UTC is canonical system timestamp
- Gregorian controls civil/legal/financial/institutional use
- OT is computed supplemental overlay
- year rollover March 18
- leap condition uses Gregorian year in which the OT year ends

### TASK-026 — Compliance API
Priority: High

Create/expand `GET /api/compliance` covering entity separation, no legal/jurisdiction overclaim, no financial guarantees, human authority boundary, model-agreement vs verification distinction, and maturity labels.

### TASK-027 — CI Runtime Tests
Priority: Critical

CI must run syntax checks, route smoke tests, Layer 1 deterministic replay, schema validation, manifest validation, and simulated Council workflow tests.

### TASK-028 — Browser-to-Output Reference Run
Priority: Critical

Definition of Done:

```text
input
→ normalization
→ Council
→ cross-review
→ alignment
→ human synthesis
→ governed OHI output
→ saved decision record
```

This becomes the canonical OMOS reference path only after it is repeatable, logged, and testable.

---

## Build Rule

If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

Maturity is component-specific:

`CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION`.
