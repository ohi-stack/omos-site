# OMOS™ Project Operating Contract

**Project:** OMOS™ — OneGodian Metaphysical Operating System™  
**Canonical runtime:** `https://omos.onegodian.com`  
**Status:** Active project operating contract  
**Effective:** September 18, 2026

This document defines the canonical working context for architecture, engineering, verification, documentation, product development, cross-platform synchronization, and commercialization of OMOS.

## 1. Canonical architecture

- **OneGodian Protocol™** — terminology, identity rules, interaction rules, interoperability, scope, and policy constraints.
- **OneGodian Algorithm™** — evaluation and decision logic. Preserve: **Observe → Distill → Align → Select → Execute → Verify**.
- **OHI™** — multi-model comparison, critique, contradiction detection, supported dissent, and governed synthesis.
- **OMOS™** — runtime execution, orchestration, interfaces, persistence, Decision Records, APIs, connectors, tools, history, auditability, and system integration.
- **OLLM™** — OneGodian LLM/model intelligence layer operating as a first-class provider within OMOS, not as a replacement for OMOS.
- **ACC™** — operational command and execution console at `https://acc.onegodian.com`.
- **Shared OneGodian API layer** — `https://api.onegodian.org`.

## 2. Canonical runtime and client boundary

`https://omos.onegodian.com` is the canonical governed OMOS Node/Express runtime.

WordPress properties, applications, ACC, model providers, and other OneGodian systems consume or interact with OMOS through documented APIs, bridges, adapters, or connectors. No second independently authoritative OMOS runtime should be introduced without an explicit architecture change.

## 3. Canonical product flow

Customer-facing sequence:

**INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY**

Internal governed sequence:

Human Input → Ask OMOS → Layer 1 Intake & Distillation → Alignment Engine → Council of Models → Cross-Model Review → Governed OHI Synthesis → Human Decision Gate → Persistent Decision Record → Dashboard History

The Human Gate remains mandatory where consequential authorization is required.

## 4. Primary production milestone

**OMOS-REF-0001 — First Governed End-to-End Reference Run**

A complete production proof requires one real browser transaction through the governed flow, durable persistence, a recorded human disposition, restart/redeployment survival, and reopening of the exact same Decision Record in Dashboard History.

A response appearing in the browser is not sufficient evidence.

## 5. Maturity standard

Use only these evidence-based maturity states:

- **Conceptual** — defined but not implemented.
- **Prototype** — preliminary implementation demonstrates intent.
- **Functional** — available for controlled validation with known limitations.
- **Verified** — tested against documented requirements with reproducible evidence.
- **Production** — operational, documented, repeatable, monitored, and supported in the live environment.

Governing rule:

> If it is not operational, documented, and repeatable, it does not exist in the current production version.

Always distinguish proposed, documented, implemented, merged, deployed, live-tested, verified, and production-certified states.

## 6. Evidence discipline

Never confuse:

- model consensus with factual verification;
- repository code with deployed functionality;
- merged code with production proof;
- a successful HTTP response with full system verification;
- a specification with an implementation;
- an implementation with a repeatable production capability.

Status reporting must identify the evidence supporting the classification.

## 7. Decision Record minimum contract

Where applicable preserve:

- Decision/Run ID;
- raw input and canonical input;
- Layer 1 result;
- Alignment State and hard gates;
- provider/model provenance;
- Council outputs and cross-review findings;
- agreements, contradictions, missing evidence, supported dissent;
- governed synthesis and confidence;
- evidence references and verification state;
- human disposition;
- runtime and Algorithm versions;
- timestamps and hashes;
- revision history and ownership;
- associated entitlement/project where applicable.

Decision Records should be append-oriented and auditable rather than silently rewritten.

## 8. Persistence standard

Production Decision Records must use durable storage.

Current target path:

OMOS Node/Express runtime → `DATABASE_URL` → PostgreSQL → Decision Records → Dashboard History

A memory-only fallback must never be represented as durable production persistence.

Production persistence proof requires PostgreSQL active, a record created, human disposition persisted, runtime restart/redeploy, survival of the exact record, and successful history reopen.

## 9. Council of Models

Primary provider classes include OpenAI, Anthropic, Google Gemini, xAI, OLLM/local OneGodian models, and future providers behind a common connector contract.

Council operation should preserve independent first-round outputs, cross-review, agreement, contradiction, missing information/evidence, novel insight, supported dissent, provenance, and uncertainty.

**Model agreement is comparative evidence, not proof of truth.**

## 10. OMOS Connection & Adaptation Layer™

Connection classes:

- **Model Connections** — OpenAI, Anthropic, Gemini, xAI, OLLM, specialized models.
- **Data Connections** — GitHub, Google Drive, WordPress, Notion, databases, registries, OneGodian systems.
- **Action Connections** — GitHub, WordPress, Stripe, email, calendars, deployment infrastructure, APIs.
- **Environment Connections** — browsers, computer-use environments, terminals, 3D runtimes, robotics, IoT, XR, and future environments.

Definitions:

- **Connector** = access, transport, authentication, health/capability exposure.
- **Adapter** = translation between native platform objects/actions and OMOS contracts.

## 11. MCP boundary

The OneGodian MCP Standard™ is an interoperability layer, not a source of authority.

Logical relationship:

OMOS → OHI/intelligence coordination → ACC/operational control → authorization/execution layers → OneGodian MCP Standard/Gateway → domain systems and external tools.

MCP must not automatically become the authoritative database, registry, identity system, financial ledger, or source of record for connected systems.

## 12. Engineering Council lifecycle

**GitHub Issue → Task Classification → Agent Assignment → Agent Work → Pull Request → Independent Cross-Agent Review → Tests/CI → OMOS Review → Human Approval → Merge → Deployment → Deployment Proof → Engineering Record**

Rules:

- no agent is the sole final reviewer of its own work;
- green CI is necessary but not sufficient;
- secrets must never be committed;
- branch protections must not be bypassed;
- consequential production changes require human authorization;
- significant changes leave traceable engineering evidence.

## 13. Repository operating rules

When updating OMOS or related repositories:

1. inspect actual current repository state first;
2. review branches, open PRs, issues, CI, and recent commits;
3. reuse existing architecture before creating parallel systems;
4. prefer incremental production work over unnecessary rewrites;
5. add/update tests with implementation changes;
6. update documentation/config templates when required;
7. distinguish committed changes from deployed changes;
8. state the remaining Definition of Done.

Never claim a GitHub modification occurred unless tool evidence confirms it.

## 14. WordPress architecture

WordPress properties are presentation/integration clients of the canonical OMOS runtime, not duplicate OMOS runtimes.

Primary client properties include OneGodian.org, OneGodian.com, QuantumOHI.com, U.OneGodian.org where applicable, and the OMOS public WordPress presentation surface when used.

Bridge responsibilities may include runtime status, manifests, tools, documentation, OHI interfaces, Decision Record/history access, approved OMOS functions, account integration, and synchronization. Protected credentials stay server-side.

## 15. UI/UX standard

OMOS should present as a premium operational intelligence platform:

- obsidian/deep navy foundation;
- metallic gold identity accents;
- cyan/cobalt intelligence accents;
- selective purple accents;
- warm-white text;
- dimensional glass surfaces;
- clear system state and user action;
- accessible responsive behavior.

Avoid generic WordPress styling, crypto-dashboard conventions, decorative science-fiction UI without function, or a static whitepaper-only presentation.

## 16. Navigation standard

Primary navigation:

**OMOS | WORKSPACE | COUNCIL | OLLM | TOOLS | DEVELOPERS | PRICING**

Persistent actions should prioritize runtime/system status, Sign In, and **ASK OMOS**.

## 17. Product strategy

OMOS commercial positioning should remain outcome-first:

> OMOS helps people turn AI answers, conflicting information, documents, and difficult decisions into structured, reviewable courses of action.

Primary commercial categories may include Ask OMOS, OMOS Pro, OMOS Council, Decision Review, Document Review, OMOS Business, implementation/integration services, and developer/API access.

Pricing must map to real implemented deliverables, usage limits, support, licensing, and entitlements. Unsupported allowances or capabilities must not be advertised.

## 18. Commerce-to-runtime contract

**Checkout → verified server-side payment → entitlement → authorized run allowance → governed OMOS run → Decision Record → Dashboard History**

A browser success URL never grants paid functionality by itself.

## 19. OneGodian Timekeeping

Use OTS-V5 as the current OneGodian timekeeping standard.

For legal, banking, financial, tax, court, government, and civil records:

- Gregorian Time is controlling;
- OT is a secondary/derived OneGodian representation;
- UTC is retained as canonical machine time where required.

## 20. Entity and authority discipline

Maintain clear separation between:

- **ONEGODIAN, LLC** — private commercial enterprise, software, IP, technology, education, products, services, and commercial operations.
- **Indigenous Nation of Onegodia (INO)** — separate governance/body-politic and community context where applicable.

Do not attribute state-conferred or governmental authority to ONEGODIAN, LLC.

## 21. Founder and authorship continuity

Preserve Gregory Lamar Jones's documented founder/originator/authorship role where supported by the record. Maintain chronological accuracy in titles and roles and avoid converting founder-defined titles into externally conferred authority.

## 22. Source hierarchy

When sources disagree, prefer:

1. current explicit user instruction;
2. current production evidence;
3. current repository implementation;
4. current canonical project documents;
5. current Project files;
6. earlier project decisions;
7. older drafts or superseded architecture.

Do not silently merge contradictory versions. Surface meaningful conflicts and select or recommend a canonical resolution.

## 23. Development priorities

Unless superseded by an explicit instruction, prioritize:

1. reliability and production proof;
2. security and authorization;
3. persistence and auditability;
4. end-to-end user functionality;
5. model/provider connectivity;
6. decision quality and verification;
7. UI/UX;
8. cross-platform synchronization;
9. commercial entitlements/revenue;
10. documentation;
11. new conceptual expansion.

## 24. Primary operational test

A user should be able to submit a difficult question or problem, have OMOS process it through a governed and inspectable workflow, receive a structured result, authorize or reject that result where required, preserve the resulting Decision Record, and later reopen and audit exactly how that result was produced.

That is the principal test against which OMOS development should be measured.
