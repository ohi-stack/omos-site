# ACC + Codex Engineering Factory

**Status:** Architecture baseline / implementation contract  
**Applies to:** OMOS and OneGodian software portfolio  
**Human authority:** Gregory Lamar Jones / One Gregory OneGodian™

## Objective

Use ACC as the operational engineering control plane through which Codex and other approved engineering agents systematically finish OMOS and then the wider OneGodian software portfolio. OMOS remains the governing operating architecture; ACC does not replace OMOS.

## Logical hierarchy

```text
Human Authority
      ↓
OMOS — governing operating architecture
      ↓
OHI — comparison / synthesis / review
      ↓
ACC — operational control plane
      ├─ Codex / approved coding agents
      ├─ Engineering Council
      ├─ GitHub
      ├─ Computer-use execution where authorized
      ├─ Skills
      └─ MCP Gateway
             ↓
      OneGodian MCP Standard
             ↓
      Domain systems and repositories
```

## Engineering Council lifecycle

```text
GitHub Issue
  ↓
Task Classification
  ↓
Agent Assignment
  ↓
Agent Work
  ↓
Pull Request
  ↓
Independent Cross-Agent Review
  ↓
Tests / CI / Security
  ↓
OMOS Architecture + Policy Review
  ↓
Human Approval
  ↓
Merge
  ↓
Deployment
  ↓
Deployment Proof
  ↓
Engineering Record
```

Each transition MUST leave inspectable evidence.

## ACC portfolio backlog model

ACC SHOULD track work using a normalized task envelope containing:

- task_id
- repository
- issue
- classification
- priority
- acceptance_criteria
- assigned_agent
- branch
- pull_request
- risk_class
- required_checks
- reviewer
- omos_review_state
- human_approval_state
- merge_sha
- deployed_sha
- deployment_environment
- deployment_evidence
- final_maturity

## Risk classes

- **R0 — Documentation/Public:** no material execution.
- **R1 — Read/Low Risk:** retrieval, inspection, analysis.
- **R2 — Controlled Write:** ordinary code/config/docs changes through Git.
- **R3 — Material Execution:** consequential application behavior, production configuration or deployments.
- **R4 — Financial/Security Critical:** funds, credentials, authentication, authorization, destructive data operations.

R3/R4 actions require explicit authorization gates appropriate to the operation.

## Model/provider neutrality

ACC and OMOS MUST use capability contracts rather than coupling the engineering system to a single model name. Provider metadata should include provider, model, capabilities, availability, provenance, latency, usage and error state. New models should be addable through adapters without rewriting Council or Decision Record logic.

## OMOS-REF-0001 first

Before portfolio-wide expansion, OMOS MUST prove one repeatable end-to-end governed run:

Ask OMOS → Layer 1 → Alignment → Council → Governed Synthesis → Human Gate → Decision Record → Dashboard History.

Required production proof:

1. Exact deployed revision recorded.
2. Durable database backend verified.
3. Real Ask OMOS run creates a unique Decision ID.
4. Processing stages complete with provenance.
5. Human disposition is persisted server-side.
6. Complete Decision Record is reopenable.
7. Runtime is restarted/redeployed.
8. The same Decision Record survives restart.
9. Dashboard History finds and reopens the same record.

No blanket Production claim is permitted until applicable gates have evidence.

## Portfolio execution order

### Phase 1 — Governing infrastructure
1. OMOS
2. ACC
3. OneGodian MCP Standard
4. QR-V
5. ODIN
6. OBP-1
7. OLLM native provider integration

### Phase 2 — Infrastructure and revenue systems
1. OHICloud
2. Algonquian Real Estate
3. KeyAura
4. OMOS commerce/entitlements
5. ODC / OBW-1 / Capital only under restricted financial controls

### Phase 3 — Operational applications
ALLATYME, U OneGodian, HomeEra, One Companion & Homemakers and other domain systems as their executable workflows become prioritized.

## Evidence standard

Agent activity is not proof. PR merge is not deployment. Deployment is not production proof. Model agreement is not factual verification.

A completed Engineering Record SHOULD preserve:

- issue/task ID
- repository
- authoring agent
- branch
- commits
- PR
- independent reviewer
- CI/security results
- OMOS review result
- human approval
- merged SHA
- deployed SHA
- environment
- health/smoke evidence
- rollback reference
- final maturity state

## Versioning rule

If a capability is not fully operational, documented and repeatable, it does not exist in the current version.
