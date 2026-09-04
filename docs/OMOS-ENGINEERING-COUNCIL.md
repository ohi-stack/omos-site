# OMOS Engineering Council

**Status:** Operating Workflow Specification  
**Purpose:** Govern software-development work performed by human engineers and coding agents across OMOS and the broader OneGodian technical ecosystem.

## Canonical Workflow

```text
GitHub Issue
→ Task Classification
→ Agent Assignment
→ Agent Work
→ Pull Request
→ Cross-Agent Review
→ Tests / CI
→ OMOS Review
→ Human Approval
→ Merge
→ Deployment Proof
```

The goal is not merely to use several coding agents. The goal is to create a governed software-delivery pipeline where each actor has a defined role, evidence is preserved, and no production deployment occurs solely because an agent completed a task.

## Roles

### Human Authority
The designated human approver retains final authority for merge/deployment decisions that the active policy marks as approval-required.

### OMOS
OMOS classifies work, applies policy, records provenance, tracks run state, verifies required gates, and creates the final engineering Decision Record.

### GitHub Agent Capabilities
Best suited for issue/PR workflows, repository maintenance, review, CI inspection, branch operations, and GitHub-native task execution.

### Codex / Coding Agent
Best suited for implementation, refactoring, tests, schemas, APIs, code review, and repository-level engineering.

### Antigravity / Alternate Engineering Agent
May provide parallel implementation, independent validation, UI/UX buildout, testing, or alternative technical review.

### Verification Agent
Checks requirements, tests, regression behavior, security boundaries, documentation, and deployment proof.

## Task Classification

Every engineering issue SHOULD identify:

- repository;
- component;
- task type;
- risk level;
- affected environment;
- required tests;
- required documentation;
- approval requirement;
- deployment impact;
- rollback requirement.

Recommended task classes:

- documentation;
- UI/UX;
- runtime;
- API;
- schema/data;
- security;
- connector;
- commerce;
- infrastructure;
- tests/verification;
- deployment;
- incident/remediation.

## Agent Assignment Rules

- Prefer one primary implementer and one independent reviewer for material changes.
- An agent SHOULD NOT self-approve a privileged production action.
- Parallel implementations may be used for high-uncertainty design problems.
- Cross-agent review should compare requirement coverage, regressions, security, and operational fit—not merely code style.

## Pull Request Contract

Every material PR SHOULD contain:

- problem statement;
- scope;
- changed components;
- tests run;
- risks;
- migration/deployment notes;
- rollback notes;
- unresolved issues;
- screenshots or evidence where UI/runtime behavior changes;
- maturity/status impact.

## CI Gate

Required CI should include applicable subsets of:

- lint;
- unit tests;
- integration tests;
- schema validation;
- API contract tests;
- regression/replay tests;
- security checks;
- OMOS-CTS conformance tests;
- build/package verification.

A green CI result is necessary evidence but is not itself human approval.

## OMOS Review

Before final approval, OMOS should produce a review summary containing:

```text
Issue
Task classification
Assigned agents
PR
Changed files
Test status
Known risks
Security boundary
Data migration impact
Deployment impact
Required human decision
Recommended disposition
```

Possible dispositions:

- APPROVE FOR MERGE
- REQUEST CHANGES
- HOLD FOR EVIDENCE
- REJECT
- APPROVE FOR STAGING ONLY
- APPROVE FOR PRODUCTION

## Deployment Proof

A merge is not equivalent to a successful deployment.

Production proof should preserve:

- deployed commit SHA;
- environment;
- deployment timestamp (UTC primary);
- migration status;
- health checks;
- smoke-test results;
- critical route/API verification;
- rollback target;
- post-deployment errors;
- final verification state.

For OMOS-REF-0001 and similar critical releases, restart/persistence proof should be included where applicable.

## Engineering Decision Record

A completed engineering workflow SHOULD create a durable record containing:

- issue ID;
- task classification;
- agent assignments;
- branch;
- PR number;
- commit SHAs;
- review results;
- CI results;
- human approval;
- merge SHA;
- deployment evidence;
- final status;
- record hash.

## Safety Boundary

The Engineering Council does not authorize an agent to bypass:

- repository permissions;
- secret-handling requirements;
- branch protection;
- required human approval;
- environment separation;
- legal/compliance review;
- destructive-action controls.

## Immediate OMOS Use

The Engineering Council should be used for:

1. OMOS v1.1 runtime hardening;
2. OMOS-REF-0001 production proof;
3. model/data/action connector implementation;
4. Dashboard History;
5. commerce entitlement execution;
6. OMOS Compliance Test Suite automation;
7. OLLM integration;
8. WordPress bridge upgrades.
