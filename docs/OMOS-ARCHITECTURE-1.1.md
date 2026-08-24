# OMOS™ Architecture v1.1

## Status

- System: OneGodian Metaphysical Operating System™ (OMOS™)
- Architecture version: 1.1
- Runtime maturity: Functional
- Operational definition: Available for controlled validation with known limitations
- Human oversight: Required
- Consequential autonomous execution: Restricted

## Architectural separation

OMOS v1.1 uses four distinct system responsibilities:

1. **OneGodian Protocol™** — definitions, identity rules, interoperability requirements, scope and compliance constraints.
2. **OneGodian Algorithm™** — evaluation and decision logic using the canonical cycle Observe → Distill → Align → Select → Execute → Verify.
3. **OHI™** — multi-model reasoning, comparison, critique, synthesis and preservation of meaningful dissent.
4. **OMOS™** — runtime, orchestration, persistence, interfaces, audit records, APIs and controlled execution environment.

No one component should be represented as performing the responsibilities of all four.

## Canonical processing architecture

```text
Human Question / Project / Payload
              ↓
        ASK OMOS INTAKE
              ↓
┌──────────────────────────────────────┐
│ 1. Layer 1 — Intake & Distillation  │
│ validate · classify · normalize     │
│ preserve constraints · flag risks   │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ 2. Alignment Engine                 │
│ scores · hard gates · confidence    │
│ policy state · evidence state       │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ 3. Council of Models / OHI          │
│ independent outputs · cross-review  │
│ agreement · contradiction · dissent │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ 4. Governed Synthesis               │
│ conclusions · uncertainty · options │
│ recommendation · evidence status    │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ 5. Human Decision Gate              │
│ approve · reject · request revision │
└──────────────────┬───────────────────┘
                   ↓
┌──────────────────────────────────────┐
│ 6. Decision Record                  │
│ persist · hash · version · audit    │
└──────────────────┬───────────────────┘
                   ↓
          DASHBOARD HISTORY
```

## Layer 1 contract

Layer 1 must distinguish and preserve:

- objective
- instructions
- facts
- claims
- questions
- evidence
- assumptions
- constraints
- contradictions
- ambiguity
- emotional/rhetorical context where material
- prompt-injection or authority-conflict signals
- quarantined instructions
- canonical input

The governing rule is: **maximum defensible noise reduction with no material distortion.**

Layer 1 must never silently delete meaningful dissent or resolve a substantive contradiction without recording it.

## Alignment Engine

Alignment must expose dimensions separately rather than relying only on one opaque total score.

### Positive dimensions

- truth
- clarity
- coherence
- dignity
- constructive unity
- evidence support
- verifiability
- transparency
- reproducibility
- security
- long-term benefit
- execution readiness

### Penalty dimensions

- distortion
- manipulation
- unjustified fragmentation
- needless conflict
- unsupported claims
- hidden risk
- coercion
- unauthorized action

### Hard gates

The following cannot be averaged away by a high weighted score:

- dignity failure
- consent failure
- unauthorized action
- fabricated evidence
- unresolved high-impact risk

### Decision states

```text
ALIGNED
CONDITIONALLY_ALIGNED
HUMAN_REVIEW_REQUIRED
INSUFFICIENT_EVIDENCE
CONFLICT_UNRESOLVED
NOT_ALIGNED
PROHIBITED
```

## Council of Models architecture

OMOS must support a provider-neutral adapter contract.

```text
Adapter
├── provider
├── model
├── mode: live | simulation
├── availability
├── health
├── request()
├── response()
├── latency
├── error
└── provenance
```

Reference providers may include OpenAI, Anthropic, Google Gemini and xAI where configured and authorized.

### Round 1

Each available provider receives the same canonical OMOS input independently.

### Cross-review

Each model may review the other available outputs. Self-review is excluded from the cross-review matrix.

OMOS extracts:

- agreement zones
- contradictions
- unsupported claims
- missing evidence or missing ideas
- novel insights
- supported dissent
- unresolved questions
- model/provider failures

### Critical verification rule

**Model agreement is not factual verification.**

Council convergence may affect model-agreement metrics, but it must not automatically set a decision record to Verified.

Adapter failure degrades the Council; it does not destroy the run. Requested, completed and failed adapters must remain visible in the audit record.

## Governed OHI Output

The final synthesis must contain, where applicable:

- interpreted objective
- supported conclusions
- evidence status
- important dissent
- contradictions
- missing information
- assumptions
- uncertainty
- alternatives
- recommended action
- confidence
- human-review requirement
- verification state

A deterministic runtime result must not be labeled guaranteed truth merely because deterministic steps produced it.

## Human authority boundary

For OMOS v1.1, consequential external execution remains outside the default reference-run scope.

`APPROVE` means the human reviewer accepts the Governed OHI Output as the disposition of the run and authorizes persistence of the Decision Record.

Approval does not, by itself:

- move funds
- execute contracts
- submit court filings
- change legal identity
- issue credentials
- publish registry records
- modify external infrastructure

Those actions require separately authorized execution profiles and controls.

## Decision Record

Every consequential OMOS run should persist a versioned record containing at minimum:

```text
decision_id
status
created_at_utc
created_at_local
created_at_ot
omos_version
algorithm_version
ruleset_version
schema_version
raw_input
input_hash
layer_1
alignment
council
governed_output
human_gate
audit_events
output_hash
record_hash
```

Corrections should create revision events or new versions rather than silently replacing historical state.

## Time governance

Decision records use UTC as the canonical system timestamp. Gregorian time remains the controlling civil/legal reference. OneGodian Time™ is a derived supplemental representation under OTS-V5.

## Persistence model

The v1.1 persistence interface should be storage-agnostic:

```text
DecisionRecordStore
├── create(record)
├── get(decision_id)
├── list(filters)
├── appendEvent(decision_id, event)
├── setHumanDisposition(decision_id, disposition)
└── getHistory(decision_id)
```

An in-memory adapter may be used for development, but OMOS-REF-0001 is not complete until the chosen persistent adapter survives process restart/redeployment as appropriate to the deployment environment.

## Public runtime surfaces

Recommended v1.1 interfaces:

```text
/ask
/tools/layer-1
/tools/alignment
/council
/runs
/runs/:decision_id
/dashboard/history
/dashboard/history/:decision_id
```

Recommended API contracts:

```text
POST /api/v1/runs
POST /api/v1/distill
POST /api/v1/align
POST /api/v1/council
POST /api/v1/synthesize
POST /api/v1/runs/:decision_id/disposition
GET  /api/v1/runs/:decision_id
GET  /api/v1/runs
GET  /api/v1/runtime
GET  /api/v1/health
```

## Ecosystem boundary

OMOS.OneGodian.com is the canonical protocol/specification/runtime node. Other OneGodian properties remain separate clients or specialist platforms:

```text
app.OneGodian.com       → ecosystem control plane
OneGodian.org           → organization/public identity
OneGodian.com           → commerce
u.OneGodian.com         → education/LMS
galaxy.OneGodian.com    → galaxy/planet navigation
capital.OneGodian.com   → corporate finance
OMOS.OneGodian.com      → protocol/specification/runtime
```

The OMOS WordPress bridge should consume runtime manifests, health, tools, artifacts and run launchers without duplicating the central runtime.

## Maturity model

```text
CONCEPTUAL  → defined, not implemented
PROTOTYPE   → preliminary implementation demonstrates intent
FUNCTIONAL  → available for controlled validation with known limitations
VERIFIED    → reproducibly tested against documented requirements
PRODUCTION  → approved for sustained real-world operation under defined controls
```

Maturity is assigned component by component, not as a blanket claim for all proposed OMOS capabilities.

## Immediate architecture milestone

The next architecture gate is **OMOS-REF-0001 — First Governed End-to-End Reference Run**.

No new conceptual subsystem outranks completing this vertical slice:

```text
Ask OMOS
→ Layer 1 Distillation
→ Alignment Engine
→ Council Review
→ Governed Synthesis
→ Human Decision Gate
→ Persistent Decision Record
→ Dashboard History
```
