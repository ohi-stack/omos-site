---
name: omos-recursive-self-improvement
description: Bounded, evidence-led improvement of OMOS skills, prompts, evaluation procedures, and workflows using versioned experiments, independent checks, rollback, and human-controlled promotion. Activate for improving OMOS skills or agents, analyzing repeated failures, evaluating a proposed workflow change, or testing whether a revision is better.
version: 0.1.0-draft
owner: ONEGODIAN, LLC
status: specification-only
---

# OMOS RSI Skills — Recursive Self-Improvement (Draft v0.1)

## Scope, terminology and honesty

**RSI** means **Recursive Self-Improvement** in this specification. It is distinct from the financial Relative Strength Index (also RSI). In OMOS, this refers to *bounded improvement of persistent agent scaffolding* (skills, prompt templates, tool-use guidance, orchestration procedures, selected memory/knowledge procedures, and their improvement policy). It is not a claim that OMOS can re-train model weights, improve intelligence without limits, or already operate an autonomous recursive loop.

This file defines a proposed **human-governed skill suite**, not a running service, connected model, verified capability, approval to modify production code, or certified end-to-end self-improvement. The supporting schema and acceptance cases must be integrated before operation.

The improvement process should work with:
- **Objective Thinking**: claims, evidence, counterfactuals, bias, uncertainty and reviewable decisions.
- **OneGodian Algorithm**: Observe → Distill → Align → Select → Execute → Verify.
- **OHI Council**: independent reviewers with dissent; model consensus never equals verification.
- **OMOS runtime**: versioned runs, records, verifiable outcomes, history and rollback references.
- **ACC/OCP/OEG**: policy-enforced execution; agents never grant themselves authority.
- **OCAE/PIAE**, if implemented: prevent intent drift and privilege from ambiguity.

## Ten reusable RSI skills

| ID | Skill | Required output |
|---|---|---|
| RSI-01 | Performance Observation | Baseline metrics, run/trace references, error taxonomy, provenance and data boundaries |
| RSI-02 | Failure Analysis | Reproducible failure, plausible root causes, disconfirming evidence, ranked hypotheses |
| RSI-03 | Improvement Hypotheses | Target artifact, one bounded candidate change, predicted benefit, risk and falsification condition |
| RSI-04 | Skill Optimization | Candidate version of skill/prompt/tool instructions; annotated diff and rationale |
| RSI-05 | Workflow Optimization | Candidate workflow change with preserved human approval and execution boundaries |
| RSI-06 | Evaluation Design | Evaluation protocol, fixed holdout set, independent judge rubric and contamination checks |
| RSI-07 | Controlled Experimentation | Paired baseline/candidate results, costs, environment and reproducibility record |
| RSI-08 | Regression Protection | Functional, safety, privacy, authority and reliability regression report |
| RSI-09 | Improvement Governance | Authorization class, reviewer, decision, rollback and promotion/abstention record |
| RSI-10 | Meta-Improvement Review | Audited evaluation of proposed changes to the RSI procedure itself; additional review gate |

## Operational modes

- `inspect` (default): read-only observation and analysis; no new artifacts or external writes.
- `propose`: prepare suggestions, candidate patches and tests on a non-production branch within expressly permitted repository scope. No merges or live changes.
- `experiment`: run bounded tests in isolated/sandbox or staging environments only where the caller has approved the evaluation scope and permissions.
- `promote`: **not a self-authorizing mode**; request external human approval and existing ACC/CI enforcement. Only the platform's legitimate human and release gates may merge/deploy.

The system must not silently change modes or expand permissions during iteration.

## Hard boundaries

1. **Improvement targets are allowlisted and versioned.** Default editable surfaces: non-secret skill instructions, test fixtures on an isolated branch, prompt templates, and sandbox workflow configurations. Immutable without separate, specific authorization: core system policies, developer/identity authority, audit history, production credentials, external accounts, model weights, payments, user/financial/health data, privileged adapters, verification gates, CI requirements, or deployment protections.
2. **No privilege escalation** by modifying an authorization policy, redefining 'approval', self-editing allowlists, bypassing tests or manipulating reviewers.
3. **Never rewrite success criteria after seeing candidate results.** Holdouts and grading rubrics must be fixed independently before evaluation; store hashes/versions.
4. **No using held-out test answers to train the candidate.** If leakage is suspected, mark result invalid and select fresh independent holdouts.
5. **No self-certification.** The agent proposing a change cannot be the only final reviewer, the only source of evidence, or the authority for release.
6. **No automatic persistent promotion.** An experiment may propose a better version; accepting it requires human approval, applicable CI/safety gates, and an auditable change record.
7. **Meta-RSI requires separate escalation.** An optimization to the optimizer, evaluator, scoring weights, budget or control procedure cannot be promoted using only the procedure it changes.
8. **Fixed stop conditions.** Bound number of iterations, token/compute spend, test runtime, risk class and total cost before starting; stop on threshold, no reliable improvement, budget exhaustion, uncertainty, or safety gate failure.
9. **Reversibility and traceability.** Candidate changes are branched, diffed, versioned, and associated with tested baseline and rollback reference; append audit events rather than editing past records.
10. **Maturity discipline.** A paper spec, local demonstration, or synthetic success cannot be called Production. Observe actual metrics and release proof.
11. **Respect user intent.** Ambiguous instructions narrow actions; use the common-safe action set (read-only diagnosis/proposal) until authorized.
12. **Privacy and secrets.** Minimize production traces, redact identifiers, avoid exporting sensitive samples to model providers absent consent and permitted processing.
13. **No synthetic 'gains'.** Avoid fabricating evaluation scores, timestamps, CI outcomes, execution status or benchmark results.

## Governed RSI cycle

### 1. Observe (RSI-01)
Collect baseline tasks, failure traces, metric definitions and independent ground-truth references. Record version, test environment, model/provider configurations, reproducible seed where relevant, and source-access caveats.

### 2. Diagnose (RSI-02 + Objective Thinking)
Identify failure patterns and alternative causes; distinguish actual regression from stochastic variance, nondeterminism, unreliable judges or test contamination. Prefer measurable root-cause hypotheses rather than generic exhortations.

### 3. Propose (RSI-03/04/05)
Define one small improvement with exact touched files, permissions, predicted metric change and risk classification. Preserve fallback/champion version unchanged.

### 4. Freeze evaluator (RSI-06)
Before testing, register independently held-out cases, grading rubrics, primary metrics and hard safety gates. Freeze their version/hash. The candidate may not edit the evaluator or inspect hidden holdout answers.

### 5. Experiment (RSI-07)
Run paired comparisons against the previous accepted version under comparable conditions. Prefer repeated runs for stochastic systems, report variation and confidence limits instead of cherry-picked best result. Track task completion, factual accuracy, authority violations, reliability, cost, latency, and regressions.

### 6. Review (RSI-08/09)
Independent verifier inspects diff, results, source faithfulness, benchmark integrity, permissions, safety and rollback. Any hard-gate failure means `reject` regardless of aggregate metric gain.

### 7. Decision and retention
Record `propose`, `reject`, `revert`, `needs-human-review`, or `approved-for-promotion` status. The last status is a recommendation awaiting externally enforced human release controls—not permission for an agent to merge or deploy.

### 8. Monitor and possibly recur (RSI-10)
After separately authorized promotion, monitor real outcomes for degradation and preserve the ability to roll back. A new RSI iteration requires refreshed budget, unchanged authority, and reviewed scope. Changes to the RSI procedure itself require independent reviewers and a separate fixed meta-evaluation set.

## Improvement targets and metrics

Acceptable candidate artifacts include skill markdown, provider-neutral prompts, routing heuristics under version control, documentation, sandbox tests, and non-privileged evaluation harnesses.

Primary quality metrics must be defined per task (e.g., exactness of classification, supported-claim accuracy, successful task completion). Secondary metrics may include latency and cost. Safety and authority violations are **non-compensatory hard failures**.

An 'improvement' requires at minimum: measurable benefit on independent held-out tasks, no material regression, unchanged hard-gate behavior, and traceable authorization. Where sample sizes are inadequate, report `inconclusive` and retain baseline.

## Proposed record contract

The proposed record format is `schemas/omos-rsi-improvement-record.schema.json`. It requires baseline/candidate refs, frozen evaluator, experiment evidence, gate results, disposition, authorization and rollback. It is not currently part of the live OMOS API.

## Integration touchpoints (planned, not claimed implemented)

`/ask`: optional user request to critique and suggest improvements.

`/dashboard`: later view for RSI runs, baselines, candidates, proof and review history.

`Council of Models`: evaluator/cross-review as a *signal*, not a substitute for source verification.

`Decision Record`: append evidence and signed review metadata; never overwrite earlier approved state.

`ACC`: human-controlled PR, CI, merge/deployment, environment and rollback path.

**No automatic write to `main`, production database, live WordPress sites, authentication systems, payment systems or model weights is authorized by this skill.**

## Acceptance

Before declaring Functional: register skill loading, implement a real bounded experiment runner, validate record schema and tests, prove permissions and replay behavior in a controlled environment. Before Verified: execute all `skills/omos-recursive-self-improvement/tests/acceptance-cases.md` with captured artifacts, independent review, and regression/security assessment. Production requires separate exact-commit deployment evidence and human approval.
