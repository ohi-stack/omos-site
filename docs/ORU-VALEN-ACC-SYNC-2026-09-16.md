# OMOS ↔ Oru’Valen ↔ ACC Sync

**Effective date:** 2026-09-16
**Canonical OMOS:** https://omos.onegodian.com
**Canonical ACC:** https://acc.onegodian.com
**Oru module:** `ohi-stack/acc-oruvalen`

## Canonical responsibility split

- **Oru’Valen™** — personalized O-H-I Twin and continuity/context layer.
- **OMOS™** — governed reasoning, Council synthesis, human-gate and Decision Record runtime.
- **ACC™** — unified execution control plane for OHI systems, agents, tools, workflows, approvals, deployments, verification and audit.

Oru’Valen is not classified as an AI agent. External AI models, agents, tools and executors remain resources governed through ACC/OMOS contracts.

## Canonical flow

```text
Human input
→ Oru context snapshot
→ OMOS governed reasoning
→ Council / synthesis
→ Human gate
→ Decision Record
→ ACC authorized execution
→ Verification / audit
→ Outcome
→ Proposed Oru learning
→ Human-approved memory/current-state update
```

## Sync contract

OMOS must expose Oru architecture and machine-readable profile surfaces and identify ACC as the execution control plane. ACC must expose Oru as a first-class O-H-I Twin module without merging it into the external agent registry. The Oru repository owns twin-specific navigation, context/memory contracts and integration documentation.

## Required Oru surfaces

OMOS public/runtime layer:
- `/oru/`
- `/api/oru.json`
- Oru architecture documentation
- OMOS ↔ Oru ↔ ACC relationship and maturity state

ACC/Oru interface areas:
- Twin Dashboard
- Command
- Context & Memory
- Decisions
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

Human authority remains final. Oru may supply context, continuity and decision support but may not represent itself as Gregory, the founder, legal owner, governing authority or final decision-maker. High-risk execution remains approval-gated.

## Operational-status rule

A planned route, connection or learning capability is not represented as operational until implemented, versioned, documented, repeatable and testable. Runtime status must be derived from verified state rather than hard-coded production claims.

## Integration milestones

1. Verify OMOS `/oru/` and `/api/oru.json` against this contract.
2. Wire Oru context schema into OMOS governed-run requests.
3. Persist provenance and hashes with Decision Records.
4. Implement authenticated ACC handoff after human approval.
5. Return execution verification/outcomes to OMOS.
6. Convert outcomes into proposed Oru learning records.
7. Require approval before durable memory/current-state changes.
8. Surface connection health and failures in ACC.
9. Add end-to-end tests for context → decision → approval → execution → outcome → learning proposal.
10. Record deployment proof for both canonical domains.
