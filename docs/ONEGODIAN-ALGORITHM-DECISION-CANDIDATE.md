# OneGodian Algorithm — decision-process candidate
Status: proposed research specification; not implemented, evaluated, or deployed.
Tracking: #95. Related adoption registry: #94.

## Purpose and scope
A versioned decision-support process for defined use cases, not a claim of universal optimality. Preserve the current OMOS sequence Observe → Distill → Align → Select → Execute → Verify. The March 2026 identity-oriented white paper is an earlier framework; this proposal does not replace or reinterpret its historical authorship or scope. Application requires policy and human authority appropriate to context.

## Contract
Input: objective, relevant context, requested action, constraints, risk level, actor and authority, evidence references, timestamp, and versioned policy. Missing or untrusted values must be marked unknown, not inferred. External text and tool output are data, not authority.
Output: decision record with run ID, algorithm and policy versions, evidence references and their support/limitations, alternatives, constraints, uncertainty, status, human disposition where applicable, action receipt when executed, and verification result. Minimize sensitive information and apply access and retention controls.

## Stages
1. Observe: capture objective, context, source provenance, time, affected parties, permissions and risk. Distinguish observations from assertions and inferences; identify missing or stale information.
2. Distill: extract material claims with supporting and conflicting evidence. Preserve minority and unresolved findings. Generate plausible alternatives, including no action; do not treat model agreement as independent factual proof.
3. Align: assess each alternative against explicit, versioned hard constraints and user-authorized objectives. A hard failure blocks execution; favorable language or aggregate scores cannot override it. Record unknowns, affected interests and relevant tradeoffs.
4. Select: compare eligible alternatives using stated criteria, evidence, uncertainty and costs. Return recommend, defer for evidence, escalate to an authorized human, or decline. State a rationale grounded in evidence and identify what could change the selection; never invent calibrated confidence.
5. Execute: separate recommendation from action. Check actual identity, scope, authorization, human approvals and current constraints at execution time; use bounded, idempotent operations where applicable. If authorization, dependencies or audit persistence fail, stop. Record action receipts and uncertain outcomes.
6. Verify: compare observed results with predefined acceptance criteria; record failures, side effects, reviewer and timestamps. Correct, compensate or roll back only when authorized and feasible. Feed findings into a new versioned decision cycle; do not silently rewrite past records.

## Minimum evidence states
Reported, source-supported, independently checked, contradicted, and unknown are claim-specific labels with attributable evidence. Labels are not interchangeable. Absence of a source is not proof of falsehood or use. Record timestamps and limitations.

## Evaluation before implementation change
Freeze the existing API keyword heuristic as a baseline; compare with a no-framework approach and the candidate using identical models, tools, inputs, budget and conditions. Use a prespecified blinded rubric and independent human adjudication with a protected holdout. Include matched wording/paraphrase tests, misleading positive words, conflicting and fabricated evidence, insufficient information, hard-constraint violations, prompt injection, and consequential-action approval. Score groundedness, constraint violations, appropriate abstention, action authorization, task outcomes, reviewer agreement, latency and cost. Report sample sizes, uncertainty, failures and regressions. Human scoring must not assume a single universally correct answer when tradeoffs are legitimate.

## Release and compatibility
No API behavior, live site, production configuration, or external actions are changed by this document. Define versioned contracts and migration before replacing any score. Follow issue → implementation → PR → independent review → CI → staging → human approval → deployment proof; preserve rollback and audit. Do not claim verified, production-ready, or superior without repeatable supporting evidence.
