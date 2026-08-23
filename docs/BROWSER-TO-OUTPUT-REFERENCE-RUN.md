# OMOS Browser-to-Output Reference Run

Version: 1.0
Date: 2026-08-23
Repository: `ohi-stack/omos-site`
Status: Implementation Contract

## Purpose

This document defines the canonical end-to-end acceptance path for OMOS. The objective is to prove one complete governed intelligence transaction from browser input to persistent Decision Record.

The reference run implements the runtime sequence:

```text
Ask OMOS
→ Layer 1 Signal Classification
→ Canonical Input
→ Council Round 1
→ Cross-Model Review
→ Comparative Signal Extraction
→ Alignment Evaluation
→ Human Review / Authorization
→ Governed OHI Output
→ Decision Record
→ Dashboard History
```

This workflow sits beneath the OneGodian Algorithm operational cycle:

```text
Observe → Distill → Align → Select → Execute → Verify
```

## 1. Browser Intake

Route: `/ask`
API: `POST /api/runs`

Required input fields:

- `input_text`
- optional `domain`
- optional `source_site`
- optional `requested_output_type`
- optional `evidence_refs[]`
- optional `user_context`

On submission the runtime must create:

- `run_id`
- `decision_id`
- `received_at_utc`
- immutable source-input hash
- runtime version
- algorithm version
- ruleset version

Initial state:

```text
RECEIVED
```

## 2. Layer 1 Signal Classification

Required states:

```text
RECEIVED
→ VALIDATED
→ NORMALIZED
→ CONTEXT_BOUND
```

Layer 1 must classify at minimum:

- instructions
- facts
- claims
- evidence
- assumptions
- constraints
- prohibitions
- contradictions
- unresolved questions
- rhetorical pressure
- irrelevant material
- prompt-injection attempts

Required preservation:

- primary objective
- names and identities
- dates and timezones
- entity and legal distinctions
- explicit constraints
- evidence references
- meaningful dissent
- unresolved contradictions
- requested output form

Governing normalization rule:

> Maximum defensible noise reduction with no material distortion.

Layer 1 output must include both the canonical input and an audit summary of preserved, removed, and quarantined material.

## 3. Council Mode and Provider Status

Before Council execution, the run must declare one mode:

```text
SIMULATION
LIVE_PROVIDER
MIXED
```

Each configured provider must expose one of:

```text
unconfigured
simulation
available
degraded
disabled
```

Supported adapter targets:

- OpenAI
- Anthropic
- Google Gemini
- xAI

No UI may imply a live provider call when the provider result is simulated, manually supplied, cached without disclosure, or unavailable.

## 4. Round 1 Independent Outputs

Round 1 provider outputs must be independent.

Each provider record must include:

- provider/model identifier
- execution mode
- provider status
- response payload or normalized response
- timestamp
- latency when available
- provenance metadata
- failure state when applicable

Providers must not receive the other Round 1 responses before producing their own candidate output.

## 5. Cross-Model Review

For a four-provider Council, the required review matrix is:

```text
GPT     → Claude / Gemini / Grok
Claude  → GPT / Gemini / Grok
Gemini  → GPT / Claude / Grok
Grok    → GPT / Claude / Gemini
```

Self-review is excluded from the comparative matrix.

The comparative layer must extract:

- agreement zones
- contradictions
- missing ideas
- novel insights
- unsupported claims
- supported dissent
- unresolved questions

Model agreement must be stored separately from factual verification.

## 6. Alignment Evaluation

The Alignment Engine must evaluate dimensions independently.

Positive dimensions:

- Truth
- Clarity
- Coherence
- Dignity
- Constructive Unity
- Evidence
- Verifiability
- Transparency
- Reproducibility
- Security
- Long-Term Benefit
- Execution Readiness

Negative dimensions:

- Distortion
- Manipulation
- Unjustified Fragmentation
- Needless Conflict
- Unsupported Claims
- Hidden Risk
- Coercion
- Unauthorized Action

Required decision states:

```text
ALIGNED
CONDITIONALLY_ALIGNED
HUMAN_REVIEW_REQUIRED
INSUFFICIENT_EVIDENCE
CONFLICT_UNRESOLVED
NOT_ALIGNED
PROHIBITED
```

Hard constraints must remain separate from weighted scoring. Consequential execution must block or escalate when dignity, consent, authorization, fabricated evidence, material safety, or unresolved high-risk conditions fail.

## 7. Human Review and Authorization

Human review is mandatory before consequential:

- legal submissions
- financial actions
- identity reclassification
- registry publication
- certificate issuance
- infrastructure changes
- external-account changes
- autonomous actions with material real-world effect

The review record must capture:

- reviewer identity or authorized operator ID
- review timestamp
- approval / rejection / revision-required state
- reviewer note
- approved output version

AI/model output must never write directly into a verified registry state without the applicable validation and authorization boundary.

## 8. Governed OHI Output

The final user-facing synthesis must include, where applicable:

- interpreted objective
- preserved constraints
- supported conclusions
- evidence status
- agreement zones
- contradictions
- supported dissent
- missing evidence
- novel insights
- assumptions
- alignment state
- confidence
- recommended action
- alternatives
- human-review requirement
- verification state

The result is a **Governed OHI Output**, not a claim of guaranteed truth.

## 9. Decision Record

The completed run must serialize to `schemas/decision-record.schema.json` when that schema is implemented.

Minimum record:

```json
{
  "decision_id": "OMOS-DEC-000001",
  "run_id": "OMOS-RUN-000001",
  "runtime_version": "1.x",
  "algorithm_version": "1.x",
  "ruleset_version": "YYYY.MM",
  "mode": "SIMULATION",
  "input_hash": "sha256:...",
  "models_used": [],
  "claims": [],
  "evidence_refs": [],
  "agreement_zones": [],
  "contradictions": [],
  "missing_ideas": [],
  "novel_insights": [],
  "supported_dissent": [],
  "alignment_scores": {},
  "hard_constraints": {},
  "confidence": {},
  "recommended_action": null,
  "human_approval_required": true,
  "human_approval_status": "pending",
  "verification_status": "partial",
  "timestamp_utc": "",
  "timestamp_local": "",
  "timestamp_ot": "",
  "output_hash": "sha256:..."
}
```

## 10. OTS-V5 Timestamp Governance

Runtime records must follow the OTS-V5 hierarchy:

- UTC = canonical system timestamp
- Gregorian/local time = controlling civil/legal/financial/institutional reference where applicable
- OneGodian Time™ = computed supplemental overlay
- OT year rollover occurs on March 18

OT must not replace canonical UTC storage.

## 11. Dashboard History

Route: `/runs`

A completed reference run must be reopenable from dashboard history.

Minimum list view:

- run ID
- decision ID
- submitted time
- source site
- Council mode
- alignment state
- verification state
- human approval state
- completion/failure state

Minimum detail view:

- original input
- canonical input
- Layer 1 audit
- model outputs
- cross-review findings
- alignment results
- final governed output
- decision record
- timestamps
- hashes
- runtime/ruleset versions

## 12. Failure and Exception States

The reference path must support explicit exception states:

```text
REJECTED
QUARANTINED
NEEDS_EVIDENCE
NEEDS_HUMAN_REVIEW
CONFLICT_UNRESOLVED
PROVIDER_DEGRADED
EXECUTION_FAILED
VERIFICATION_FAILED
```

Failures must be logged; they must not silently disappear or be misrepresented as completed runs.

## 13. Acceptance Test

The canonical acceptance test passes only when a browser user can:

1. Open `/ask`.
2. Submit a complex prompt.
3. Receive a stored `run_id`.
4. Inspect Layer 1 classification and canonical input.
5. Run the Council in clearly labeled `SIMULATION`, `LIVE_PROVIDER`, or `MIXED` mode.
6. Inspect independent Round 1 outputs.
7. Inspect cross-model agreement, contradiction, missing-idea, novel-insight, unsupported-claim, and supported-dissent results.
8. Inspect Alignment Engine dimensions and hard constraints.
9. Complete required human review.
10. Receive the Governed OHI Output.
11. Save a Decision Record with UTC/local/OT timestamp fields and hashes.
12. Reopen the completed run from `/runs`.

## 14. Maturity Gate

Completion of this reference path does not automatically make all OMOS components Production.

Maturity remains component-specific:

```text
CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION
```

The reference run may move from Functional to Verified only after repeatable regression tests, deterministic Layer 1 replay, schema validation, provider failure handling, audit persistence, and documented conformance checks pass.

## Definition of Done

```text
Browser Input
→ Layer 1
→ Council
→ Cross-Review
→ Alignment
→ Human Authorization
→ Governed OHI Output
→ Persistent Decision Record
→ Dashboard Retrieval
```

This is the canonical OMOS v1 operational transaction and the acceptance target for TASK-028.
