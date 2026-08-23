# OMOS Council of Models API

## Purpose

The Council API replaces manual copy/paste orchestration with one governed request that can fan out to OpenAI, Anthropic, Google Gemini, and xAI adapters.

The current runtime supports three explicit modes:

- `simulation` — no external provider call is represented as live.
- `hybrid` — configured providers run live; missing providers return clearly labeled simulation results.
- `live` — the returned record contains only providers actually configured and successfully invoked as live.

Model agreement is never treated as factual verification.

## Endpoint

```text
POST /api/v1/council/run
```

Authentication:

```text
x-omos-key: <runtime-key>
```

Example request:

```json
{
  "prompt": "Review this question from multiple perspectives and identify agreement, disagreement, missing evidence, and next actions.",
  "mode": "auto",
  "providers": ["openai", "anthropic", "gemini", "xai"],
  "context": {
    "domain": "general",
    "human_review": true
  }
}
```

## Provider Status

```text
GET /api/v1/providers
```

The endpoint reports whether each provider is currently configured for live calls or is simulation-only.

## Run Record

A Council run returns:

- request ID
- schema version
- runtime version
- actual execution mode
- canonical prompt
- input hash
- providers requested
- live providers
- simulation providers
- Round 1 outputs
- cross-model signal extraction
- human review requirement
- verification status
- output status
- timestamps
- output hash

## Current Cross-Model Review Status

The first implementation extracts lexical agreement zones and preserves each provider's distinct output as a novel-insight candidate.

Semantic contradiction detection, missing-idea extraction, evidence retrieval, source scoring, anonymized peer review, and final governed synthesis remain the next implementation stage.

They must not be described as production capabilities until implemented and tested.

## Required Production Upgrade

The next Council release should add:

1. Parallel provider execution with timeouts.
2. Provider retry and circuit-breaker behavior.
3. Structured JSON response schemas for each independent model.
4. A second-round peer-review prompt where each model evaluates the other outputs without self-review.
5. Evidence attachment and source provenance.
6. Agreement, supported dissent, contradiction, omission, and uncertainty classification.
7. OneGodian Alignment Score integration.
8. Human synthesis/approval state.
9. Persistent run storage.
10. Retrieval endpoint for completed run records.
11. Cost/token telemetry by provider.
12. Redaction and privacy controls.

## Production Boundary

No provider key should ever be committed to GitHub. Keys belong in the deployment secret store/environment only.

A run may be called `live` only when the corresponding external APIs were actually called. Simulation output must remain visibly labeled as simulation.
