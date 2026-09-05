# OMOS Engineering Council Lifecycle

Source Status: Canonical Governance Standard
Related Systems: Agent Command Console (ACC), OMOS Runtime
Version Reference: v1.0

## Purpose

This document establishes the canonical lifecycle for autonomous coding agents operating under the OMOS Engineering Council. The core principle is that **each transition must create traceable evidence**, moving beyond mere workflow progression to establish absolute provenance, verification, and human authority.

Multiple agents may work in parallel, but coordination, provenance, verification, and final human authority remain strictly segregated responsibilities.

## The Canonical Workflow

```text
ISSUE
  ↓
CLASSIFY
  ↓
ASSIGN
  ├─ Codex
  ├─ GitHub Agent
  ├─ Antigravity
  └─ specialized agent
  ↓
FEATURE BRANCH
  ↓
IMPLEMENT
  ↓
PULL REQUEST
  ↓
INDEPENDENT AGENT REVIEW
  ↓
CI / SECURITY / REGRESSION
  ↓
OMOS GOVERNANCE REVIEW
  ↓
HUMAN APPROVAL
  ↓
MERGE
  ↓
DEPLOY
  ↓
PRODUCTION VERIFICATION
  ↓
DECISION / ENGINEERING RECORD
```

## Stage Requirements & Evidence Gates

| Stage | Required Artifact / Gate |
| :--- | :--- |
| **GitHub Issue** | Problem statement, acceptance criteria, affected repos, priority |
| **Task Classification** | Categorization (Bug / feature / security / infrastructure / docs / research / release) |
| **Agent Assignment** | Named agent, scope, permissions, branch, expected deliverable |
| **Agent Work** | Commits + implementation notes + tests added |
| **PR** | Diff, linked issue, risk statement, test evidence |
| **Cross-Agent Review** | Independent review by an agent that did **not** author the change |
| **Tests / CI** | Required suites green; failures block progression |
| **OMOS Review** | Architecture, security, compliance, provenance, maturity/status checks |
| **Your Approval** | Explicit human authorization to merge |
| **Merge** | Protected branch merge with traceable commit SHA |
| **Deployment Proof** | Exact deployed SHA + health checks + smoke tests + persistence/behavior proof |

## Four Absolute Rules

1. **No agent reviews its own work as the final reviewer.**
   Cross-agent review must be entirely independent. The agent that authored the change cannot authorize its correctness.

2. **Green CI is necessary but not sufficient.**
   Tests prove defined behavior; they do not by themselves prove architectural correctness, alignment, or safe production deployment.

3. **OMOS does not auto-merge consequential changes.**
   Human approval remains the final authorization boundary. The system will halt at the Human Gate prior to merging any consequential code into the protected production path.

4. **Merge is not completion.**
   A task closes *only* after deployment proof shows the intended revision is actually running and the acceptance criteria work in the target environment.

## The Engineering Record

The final output of this lifecycle is the **Engineering Record**—the engineering equivalent of the OMOS Decision Record. 

It provides an immutable log answering: *who proposed the change, who built it, who challenged it, what passed, who authorized it, what actually deployed, and whether production proved it worked.*

The Engineering Record must retain:
* Issue ID
* Assigned Agents
* PR Number
* Reviewing Agents
* Test Results (CI status)
* Approved-By Identity (Human Authorizer)
* Merged SHA
* Deployed SHA
* Deployment Timestamp
* Target Environment
* Verification Result (Deployment Proof)
* Rollback Reference
* Final Status
