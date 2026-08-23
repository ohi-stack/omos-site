# OMOS Production Multi-Model Orchestration Contract v1.1

## Purpose

OMOS must eliminate the manual copy/paste relay between ChatGPT, Claude, Gemini, and Grok by orchestrating provider APIs through one governed runtime.

## Canonical Council Flow

Human Question
→ Intake / Normalize
→ Round 1 Independent Outputs (parallel)
→ Cross-Model Review Matrix (each provider reviews every other provider; no self-review)
→ Agreement Zones / Contradictions / Missing Evidence / Novel Insights
→ OneGodian Algorithm evaluation
→ Human Synthesis / Approval
→ Governed OHI Output
→ Run Record

## Provider Adapters

Supported adapters:

- OpenAI
- Anthropic
- Google Gemini
- xAI

Each adapter must expose:

- `isConfigured()`
- `generate({ prompt, context })`

The runtime must never represent a simulated provider as a live provider. Provider status must remain explicit in `/api/v1/providers` and every Council run record.

## API Surface

- `POST /api/v1/council/run` — start a Council run
- `GET /api/v1/council/runs` — list recent Council runs
- `GET /api/v1/council/runs/:id` — retrieve a Council run record
- `GET /api/v1/providers` — inspect configured provider adapters
- `GET /api/health` — runtime health
- `GET /api/manifest` — runtime and capability manifest

## Round 1 Contract

Round 1 calls participating providers independently and in parallel. One provider's answer must not be injected into another provider's Round 1 prompt.

Each normalized result should include:

- provider
- model
- output
- latency when available
- simulated/live flag
- provider metadata

## Cross-Model Review Contract

For N participating providers, the review matrix contains `N × (N - 1)` directed reviews.

For the canonical four-provider Council, this produces 12 reviews:

- OpenAI reviews Anthropic, Gemini, xAI
- Anthropic reviews OpenAI, Gemini, xAI
- Gemini reviews OpenAI, Anthropic, xAI
- xAI reviews OpenAI, Anthropic, Gemini

Review prompts must instruct reviewers to identify:

- agreements
- contradictions
- missing evidence
- novel insights
- risks

Model agreement is not factual verification.

## Governed Synthesis Rules

OMOS must preserve rather than erase meaningful dissent. A governed output should distinguish:

- model agreement
- evidence support
- unresolved contradiction
- missing evidence
- factual verification status
- human approval status

The Council may recommend an output, but consequential execution remains human-controlled unless a separately authorized policy profile permits otherwise.

## Run Record

Each consequential Council run should include:

- request ID
- schema version
- runtime version
- canonical prompt
- input hash
- providers requested
- live providers
- simulated providers
- Round 1 outputs
- Cross-Model Review records
- extracted signals
- human synthesis state
- verification state
- output hash
- UTC timestamps

OTS-V5 compatible systems should treat UTC as canonical storage and derive OT presentation separately.

## Current Persistence Status

The current runtime may use bounded in-memory storage for functional validation. This is not durable production persistence.

Production persistence should move to a database-backed run store with:

- immutable run IDs
- append-only event history
- input/output hashes
- provider request IDs
- replay metadata
- approval records
- failure states
- retention policy

Recommended implementation: PostgreSQL/Supabase or another auditable relational store.

## WordPress Bridge Contract

The OMOS WordPress plugin on OneGodian.org, OneGodian.com, and QuantumOHI.com should behave as a client of the central OMOS runtime rather than duplicating orchestration logic.

The bridge should expose:

- runtime health
- provider status
- Ask OMOS launcher
- Council Review launcher
- run status
- recent run records
- returned governed outputs
- explicit Simulation / Hybrid / Live mode labels

## Maturity Requirement

A public route being accessible does not by itself make a capability Production.

Use the maturity scale:

Conceptual → Prototype → Functional → Verified → Production

Council orchestration becomes Verified only after automated tests demonstrate repeatable provider routing, cross-review counts, failure handling, provenance, and run-record retrieval.
