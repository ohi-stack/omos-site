# OMOS AI Developer Agents — Engineering Council Standard

**Date:** September 10, 2026  
**Registry:** `config/developer-agents.json`  
**Status:** Defined; execution bindings remain component-specific and must be verified before being called operational.

## Purpose

OMOS should treat AI developer systems as governed engineering participants, not unrestricted autonomous operators. Developer agents may implement, review, test, document, and prepare deployment evidence inside explicit repository and permission boundaries.

Canonical engineering lifecycle:

`Issue → Classify → Assign → Implement → Pull Request → Independent Review → Tests/CI/Security → OMOS Review → Human Approval → Merge → Deploy → Deployment Proof → Engineering Record`

## Separation of Duties

The agent that writes a production change must not be the sole agent that certifies that change. Code generation, independent review, test verification, security review, release approval, deployment, and production proof are separate gates.

No developer agent receives unrestricted production-secret access by default. No development agent may bypass the Human Gate for production merge or deployment.

## Canonical Roles

- **OMOS Engineering Coordinator** — engineering intake, classification, assignment, dependency tracking, evidence, and Engineering Records.
- **Codex Developer Agent** — implementation, APIs, refactoring, schemas, tests, and branch/PR work.
- **GitHub Engineering Agent** — issues, branches, PR workflow, CI triage, repository review, and remediation proposals.
- **Antigravity Developer Agent** — frontend, application, integration, runtime, and test work through scoped branches/PRs.
- **Architecture Agent** — interfaces, ADRs, dependency direction, and structural boundaries.
- **QA and Test Agent** — unit, integration, regression, replay, and failure-reproduction evidence.
- **Independent Review Agent** — code, architecture, risk, and scope review independent from implementation.
- **Security Agent** — secrets, authentication, dependencies, permissions, and attack-surface review; may block release.
- **Deployment Agent** — staging deploys, smoke tests, deployed-SHA verification, rollback checks, and production evidence after authorization.
- **Documentation Agent** — README, API references, architecture docs, changelog, runbooks, status, and known limitations.

## OMOS / ACC / GitHub Boundary

- **ACC** is the execution control plane for assigning and observing approved agent work.
- **GitHub** is the code, branch, pull-request, CI, and engineering-evidence system of record.
- **OMOS** is the governed runtime/review layer applying policy, alignment, provenance, and production-proof discipline.
- **Human authority** remains the final approval gate for consequential production actions.

## Developer Agent Record Requirements

Every governed engineering run should be able to record task ID, issue/PR reference, repository, base SHA, working branch, assigned agents, implementation agent, independent reviewer, test evidence, security evidence, changed files, resulting commit SHA, human approval state, merge SHA, deployed SHA, runtime verification state, rollback state, and final Engineering Record provenance.

## Current Implementation Boundary

This document and `config/developer-agents.json` define the canonical registry contract. They do **not** prove that every listed agent has a live OMOS/ACC execution adapter today. Each binding must be implemented, authenticated, health-checked, documented, repeatable, and tested before its registry status can be promoted to operational.

## Next Engineering Slice

1. Expose the registry through a read-only OMOS developer API.
2. Add `/developers/agents` as the human-readable control-center view.
3. Add ACC task-envelope ingestion and agent-assignment events.
4. Add GitHub issue/PR/CI webhook ingestion.
5. Add per-agent repository allowlists and action policies.
6. Add engineering-run provenance and deployment-evidence records.
7. Connect Codex, GitHub engineering automation, and Antigravity through separately testable adapters.

---

**Originator / Author:** Gregory Lamar Jones / One Gregory OneGodian™  
**Commercial software and platform entity:** ONEGODIAN, LLC
