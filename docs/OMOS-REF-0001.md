# OMOS-REF-0001 — First Governed End-to-End Reference Run

## Objective

Demonstrate one complete, reproducible OMOS transaction from raw human input through persisted Decision Record and Dashboard History.

```text
Human Question
→ Ask OMOS
→ Layer 1 Distillation
→ Alignment Engine
→ Council Review
→ Governed OHI Synthesis
→ Human Decision Gate
→ Persistent Decision Record
→ Dashboard History
```

## Acceptance question

Can a user submit one difficult question, inspect each structured stage, distinguish live from simulated model participation, approve or reject the governed output, leave the session, return later, and reopen the complete Decision Record with its lineage intact?

If not, OMOS-REF-0001 has not passed.

## Reference input

Use a difficult decision question rather than a trivial factual lookup. Recommended reference scenario:

> A small organization has limited capital and three possible investments: expand its current revenue-producing operation, build a new software platform with substantial long-term potential, or acquire a physical asset that may appreciate but produces limited immediate cash flow. Which should it prioritize, and under what conditions should that recommendation change?

There is no predetermined correct substantive answer. The test evaluates process behavior.

## Required stage outputs

### 1. Ask OMOS

Must create:

- run/decision ID
- raw input
- input hash
- created-at UTC timestamp
- current OMOS/runtime/schema versions
- initial status

### 2. Layer 1

Must persist:

- objective
- meaning units
- claims
- questions
- constraints
- evidence supplied
- assumptions
- ambiguities
- contradictions
- quarantined instructions
- canonical input

The stage must avoid inventing missing financial data.

### 3. Alignment Engine

Must persist individual scores for:

- truth
- clarity
- coherence
- dignity
- constructive unity
- evidence support
- verifiability
- execution readiness
- confidence

Must also persist:

- hard-gate results
- overall score if used
- explicit state

Valid reference states include:

```text
ALIGNED
CONDITIONALLY_ALIGNED
HUMAN_REVIEW_REQUIRED
INSUFFICIENT_EVIDENCE
CONFLICT_UNRESOLVED
NOT_ALIGNED
PROHIBITED
```

### 4. Council Review

When live adapters are configured, persist:

- mode: live | simulation | mixed
- adapters requested
- adapters available
- adapters completed
- adapters failed
- independent Round 1 outputs
- cross-reviews
- agreement zones
- contradictions
- missing information
- novel insights
- supported dissent
- provider/model provenance
- latency/error state

A provider failure must mark Council status as degraded rather than destroying the full OMOS run.

### 5. Governed OHI Synthesis

Must persist:

- conclusions
- evidence status
- uncertainties
- supported dissent
- alternatives
- recommendation
- conditional triggers that would change the recommendation
- confidence
- verification state
- output hash

Council agreement must not automatically set verification to Verified.

### 6. Human Decision Gate

The user must be able to:

- approve
- reject
- request revision

Persist:

- disposition
- reviewer identifier where available
- timestamp
- optional comment

For OMOS-REF-0001, approval commits the Decision Record only. It does not trigger consequential external execution.

### 7. Decision Record

The record must be durable and reconstruct the full run.

Minimum required fields:

```text
decision_id
status
created_at_utc
created_at_local
created_at_ot
versions
raw_input
input_hash
layer_1
alignment
council
governed_output
human_gate
audit
record_hash
```

### 8. Dashboard History

The user must be able to:

- list prior runs
- filter by status/date/mode
- open a run
- inspect each stage payload
- see adapter failures
- see human disposition
- inspect hashes and versions
- distinguish simulation from live execution

## Failure behavior

The run must not silently disappear when a downstream stage fails.

Persist failure events such as:

```text
VALIDATION_FAILED
COUNCIL_DEGRADED
COUNCIL_FAILED
ALIGNMENT_REVIEW_REQUIRED
SYNTHESIS_FAILED
PERSISTENCE_FAILED
VERIFICATION_PARTIAL
```

Where safe, the user should still be able to reopen the incomplete run and inspect what succeeded.

## Determinism and replay

For the deterministic portions of OMOS, identical governed inputs, versions, rulesets, evidence sets and configuration should reproduce the same classification, scores and state transitions.

Probabilistic provider outputs are not required to be text-identical on replay. Their provenance and runtime configuration must be recorded so the differences can be audited.

## Pass criteria

OMOS-REF-0001 passes only when all of the following are true:

1. One browser session can initiate the run.
2. Raw input and all stage payloads are persisted.
3. Layer 1 preserves constraints and unresolved ambiguity.
4. Alignment exposes dimension-level results and hard gates.
5. Council mode and provider participation are reported truthfully.
6. Provider failure degrades rather than destroys the run.
7. Council convergence is not misrepresented as factual verification.
8. Governed synthesis preserves uncertainty and meaningful dissent.
9. Human disposition is stored.
10. The Decision Record survives the expected persistence boundary.
11. Dashboard History can reopen the record.
12. The complete lineage can be reconstructed from original input to human disposition.
13. Automated tests cover the reference flow and failure modes.

## Maturity effect

Passing OMOS-REF-0001 does not automatically make the entire platform Production.

It establishes that the reference-run vertical slice is eligible for **Verified** status only after documented reproducibility and test requirements are satisfied. Other OMOS modules retain their own component-level maturity classifications.
