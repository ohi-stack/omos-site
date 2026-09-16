# OMOS ↔ Oru’Valen ↔ ACC Sync

**Effective date:** 2026-09-16  
**Canonical OMOS:** https://omos.onegodian.com  
**Canonical ACC:** https://acc.onegodian.com  
**Oru module:** `ohi-stack/acc-oruvalen`

## Canonical responsibility split

- **Oru’Valen™** — personalized O-H-I Twin and continuity/context layer.
- **OMOS™** — governed reasoning, Council synthesis, Human Gate, Decision Record, persistence, provenance, and audit/history runtime.
- **ACC™** — unified execution control plane for approved OHI systems, agents, tools, workflows, connectors, approvals, deployments, verification, and audit.

Oru’Valen is not classified as an AI agent. External AI models, agents, tools, and executors remain resources governed through ACC/OMOS contracts.

## Canonical flow

```text
Human input or authorized evidence
→ Oru context snapshot
→ OMOS governed reasoning
→ Council / synthesis
→ Human Gate
→ Decision Record
→ ACC authorized execution
→ Verification / audit
→ Outcome
→ Proposed Oru learning
→ Human-approved memory/current-state update
```

## Oru’Valen Lived Experience Layer

Oru must learn from more than institutional documents. The Twin architecture therefore includes a governed Lived Experience Layer that can represent real-world context when the human supplies it directly or explicitly authorizes a source to provide it.

Canonical memory classes:

1. **Institutional Memory** — approved authority records, entity records, chronology, standards, policies, and canonical documentation.
2. **Lived Experience** — material events and real-world context supplied through approved sources.
3. **Decision Memory** — problem, alternatives, constraints, choice, stated reasoning, action, outcome, and later reflection.
4. **Behavior & Routine** — authorized evidence of recurring operating patterns, bottlenecks, and repeated execution behavior.
5. **Relationship Context** — factual, access-controlled records of relevant people, roles, interactions, and commitments; no speculative profiling.
6. **Economic Reality** — permissioned evidence of what produces or consumes resources; financial information is restricted.
7. **Preferences & Judgment** — repeated approvals, rejections, corrections, and choices indicating durable preferences.
8. **Lessons & Operating Rules** — proposed lessons derived from events and measured outcomes.
9. **Current-State Model** — the newest verified and approved representation of active priorities, constraints, roles, and operating posture.

## Learning record model

A lived-experience record should preserve the sequence:

```text
What happened
→ Context / perception
→ Decision
→ Stated reason
→ Action
→ Immediate result
→ Later outcome
→ Proposed lesson
→ Approval or correction
```

Minimum record fields:

- `record_id`
- `record_type`
- `timestamp_utc`
- `source`
- `source_reference`
- `context`
- `epistemic_class`
- `confidence`
- `privacy_classification`
- `approval_state`
- `version`
- `supersedes`
- `provenance`

## Epistemic separation

Oru must never silently collapse these categories:

- **FACT** — established by an approved source, direct record, or verified external result.
- **USER_STATEMENT** — what the human explicitly said, wanted, believed, intended, corrected, or instructed at that time.
- **INFERENCE** — Oru/OMOS interpretation of a pattern in the evidence.
- **PREDICTION** — probabilistic expectation about a future preference, choice, or action.

An inference or prediction must not automatically become a fact. A direct human correction has higher authority than a prior model inference about that human. Historical records remain preserved; a newer verified state may supersede an earlier current-state assumption.

## Privacy, consent, and collection boundary

The Lived Experience Layer does **not** imply background surveillance.

- Only user-supplied or explicitly authorized sources may be used.
- Connector read access does not imply write authority.
- Restricted categories require explicit access controls and appropriate retention rules.
- Authentication secrets, passwords, private keys, seed phrases, and raw credential material are prohibited from Oru memory.
- Sensitive financial, health, legal, identity, and private-contact records must remain permissioned and separated from public profile surfaces.
- Relationship context must remain evidence-based and must not infer sensitive traits about third parties.

## Sync contract

OMOS must expose Oru architecture and machine-readable profile surfaces and identify ACC as the execution control plane. ACC must expose Oru as a first-class O-H-I Twin module without merging it into the external agent registry. The Oru repository owns twin-specific navigation, context/memory contracts, learning proposals, and integration documentation.

## Required Oru surfaces

OMOS public/runtime layer:

- `/oru/`
- `/api/oru.json`
- Oru architecture documentation
- OMOS ↔ Oru ↔ ACC relationship and maturity state
- Lived Experience / Decision Memory / Outcome Learning contract

ACC/Oru interface areas:

- Twin Dashboard
- Command
- Context & Memory
- Lived Experience
- Decisions
- Learning Proposals
- Current State
- Tasks
- Workflows
- Engineering Council
- Models
- Connections
- Executions
- Approvals
- Deployments
- Verification
- Audit
- System Health

## Authority and safety boundary

Human authority remains final. Oru may supply context, continuity, pattern analysis, proposed learning, and decision support but may not represent itself as Gregory, the founder, legal owner, governing authority, or final decision-maker.

High-risk execution remains approval-gated. Durable memory/current-state changes must be attributable, versioned, reviewable, and subject to the configured human approval policy.

## Operational-status rule

A planned route, connection, learning capability, memory source, or execution path is not represented as operational until implemented, versioned, documented, repeatable, testable, and—when labeled Production—supported by deployment proof.

Repository implementation is not deployment proof.

## Integration milestones

1. Expose OMOS `/oru/` and `/api/oru.json` from canonical source.
2. Verify the Oru public and machine-readable surfaces in CI.
3. Wire the versioned Oru context schema into OMOS governed-run requests.
4. Persist Oru context provenance and hashes with Decision Records.
5. Implement authenticated ACC handoff after Human Gate approval.
6. Return normalized execution verification/outcomes to OMOS.
7. Convert outcomes into proposed Oru learning records.
8. Require approval before durable memory/current-state changes.
9. Add approved-source retrieval with privacy classification, owner isolation, provenance, and conflict rules.
10. Surface connection health and failures in ACC.
11. Add end-to-end tests for context → decision → approval → execution → outcome → learning proposal → approved update.
12. Record deployment proof for both canonical domains.

## Maturity statement — 2026-09-16 source target

The canonical target now includes the public Oru architecture/profile contract and the Lived Experience specification. These source changes do **not** by themselves establish that automatic memory retrieval, automatic memory injection, ACC execution handoff, outcome ingestion, authenticated current-state editing, or the complete digital-twin learning loop are deployed in Production. Those capabilities remain evidence-gated by their own implementation and verification records.
