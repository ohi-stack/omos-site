# OMOS Agent Engineering Contract

OMOS is the governing operating architecture for this repository. ACC is the operational control plane used to coordinate engineering work. Coding agents (including Codex and other approved engineering agents) execute repository work under this contract.

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
- ACC: operational command/control plane for agents, tasks, approvals, repositories and deployments.
- MCP: interoperability/tool interface; it is not the authoritative database or source of record.
- QR-V: verification evidence where applicable.

## Current primary milestone

OMOS-REF-0001 is the first governed end-to-end reference run:

Ask OMOS → Layer 1 → Alignment → Council → Governed Synthesis → Human Gate → Decision Record → Dashboard History.

Completion requires durable persistence, reopenable history, recorded approval/rejection, exact deployed revision, health/smoke evidence, and persistence proof across restart/redeploy.

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

## Repository priorities

1. Complete OMOS-REF-0001 production proof.
2. Harden provider-neutral Council/model connectors, including native OLLM support.
3. Integrate ACC orchestration and Engineering Council evidence.
4. Implement OneGodian MCP Standard conformance surfaces where applicable.
5. Complete customer-facing governed workflows and commerce only after runtime authorization/persistence contracts are enforced.

## Definition of done for agent work

A coding task is done only when the implementation exists on the task branch, relevant tests pass, documentation/config templates are updated when required, security/authorization boundaries are preserved, and the PR contains enough evidence for an independent reviewer and human approver to evaluate it.