# OMOS Agent Engineering Contract

OMOS is the governing operating architecture for this repository. ACC is the operational control plane used to coordinate engineering work. Coding agents, including Codex and other approved engineering agents, execute repository work under this contract.

## Canonical project operating contract

All repository work must also conform to `docs/OMOS-PROJECT-OPERATING-CONTRACT.md`. That document is the canonical project-level context for architecture boundaries, maturity terminology, Decision Records, persistence, Council behavior, connection/adaptation rules, MCP boundaries, WordPress clients, product strategy, source hierarchy, and development priorities.

If this agent contract and the project operating contract appear to conflict, stop at the narrower safe interpretation and surface the conflict for human resolution rather than silently inventing a new architecture.

## Canonical engineering lifecycle

Issue → Classify → Assign → Implement → Pull Request → Independent Review → Tests/CI → OMOS Review → Human Approval → Merge → Deploy → Deployment Proof → Engineering Record

## Authority boundaries

Agents MAY inspect the repository, implement issue-scoped changes, add or update tests, update documentation, create branches and pull requests, diagnose CI, and prepare deployment evidence.

Agents MUST NOT:
- commit secrets or production credentials;
- bypass branch protection or required checks;
- represent model consensus as factual verification;
- mark a capability Verified or Production without evidence;
- silently broaden an issue beyond its acceptance criteria;
- treat merge as deployment proof;
- perform consequential production actions without the required human authorization.

Human approval remains required for consequential merges, production deployment, destructive data/schema changes, credential changes, payment/auth/security changes, and other material operations.

## Architecture boundaries

- OneGodian Protocol: definitions, identity rules, interoperability, scope.
- OneGodian Algorithm: Observe → Distill → Align → Select → Execute → Verify decision logic.
- OHI: multi-model comparison, critique, synthesis, and meaningful-dissent preservation.
- OMOS: runtime, orchestration, interfaces, persistence, audit and Decision Records.
- OLLM: OneGodian model/intelligence provider layer inside the OMOS gateway; not a replacement runtime.
- ACC: operational command/control plane for agents, tasks, approvals, repositories and deployments.
- MCP: interoperability/tool interface; it is not the authoritative database or source of record.
- QR-V: verification evidence where applicable.

## Current primary milestone

OMOS-REF-0001 is the first governed end-to-end reference run:

Ask OMOS → Layer 1 → Alignment → Council → Governed Synthesis → Human Gate → Decision Record → Dashboard History.

Completion requires durable persistence, reopenable history, recorded approval/rejection, exact deployed revision, health/smoke evidence, and persistence proof across restart/redeploy.

## Evidence and source hierarchy

Evidence outranks narrative. When sources disagree, prefer current explicit human instruction, then current production evidence, current repository implementation, current canonical project documents, current project files, earlier project decisions, and finally older/superseded drafts.

Do not silently merge contradictory source states.

## Engineering rules

1. Inspect before asserting.
2. Prefer the smallest safe change satisfying acceptance criteria.
3. Preserve provider-neutral interfaces; do not hard-code the platform around one model.
4. Keep credentials server-side and use references/IDs rather than returning secrets.
5. Add regression tests for changed behavior.
6. Independent review must not rely solely on the authoring agent.
7. Green CI is necessary but not sufficient for Production status.
8. Every material change should be traceable to issue, branch, PR, tests, review, merge SHA and deployment evidence.
9. If a capability is not operational, documented and repeatable, it does not exist in the current version.
10. Distinguish proposed, documented, implemented, merged, deployed, live-tested, Verified and Production states.

## Repository priorities

1. Complete OMOS-REF-0001 production proof.
2. Harden security, authorization, persistence, and auditability.
3. Complete end-to-end customer functionality.
4. Harden provider-neutral Council/model connectors, including native OLLM support.
5. Integrate ACC orchestration and Engineering Council evidence.
6. Implement OneGodian MCP Standard conformance surfaces where applicable.
7. Improve decision quality, verification, UI/UX, and cross-platform synchronization.
8. Complete customer-facing commerce only after runtime authorization/persistence contracts are enforced.
9. Avoid new conceptual expansion when completing an existing operational layer provides more value.

## Definition of done for agent work

A coding task is done only when the implementation exists on the task branch, relevant tests pass, documentation/config templates are updated when required, security/authorization boundaries are preserved, and the PR contains enough evidence for an independent reviewer and human approver to evaluate it.
