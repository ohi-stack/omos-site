# OMOS Astra Live Deliberation

**Feature ID:** OMOS-ASTRA-LAB-0001  
**Status:** Functional prototype / OpenAI-native lane  
**Route:** `/astra-lab/`  
**Primary model:** `gpt-6-astra` through the existing `src/adapters/openai.js` connector  
**Record system:** Existing OMOS Council / Decision Record pipeline

## Purpose

OMOS Astra Live Deliberation is a specialized OpenAI-native workspace for difficult decisions that need more than a single answer. It is deliberately separate from the multi-provider Council of Models.

The product asks one OpenAI frontier model to stress-test a question through a fixed decision contract:

1. Decision frame
2. Assumptions
3. Evidence and evidence gaps
4. Counterfactuals
5. Falsifiers — what would change the conclusion
6. Failure modes
7. Reversible next actions
8. Approval-gated or irreversible actions
9. Confidence map
10. Decision boundary

The result is stored through the normal OMOS Decision Record path and remains subject to the Human Gate. Model output is decision support, not factual verification.

## Why this is an OpenAI-native OMOS feature

The production target is designed around GPT-6 Astra capabilities exposed through the OpenAI Responses API, including:

- long-horizon reasoning;
- Structured Outputs;
- tool calling;
- computer use where separately authorized;
- asynchronous tool calling;
- mid-turn steering;
- in-conversation reasoning configuration changes;
- persisted reasoning / context management;
- streaming.

OMOS MUST capability-gate these features. The site MUST NOT imply that native mid-turn steering, async tools, computer use, or other privileged tools are live unless the exact server implementation and authorization gates are enabled and tested.

## Phase 1 — implemented by this branch

Phase 1 reuses the production OMOS runtime instead of creating a competing stack.

Flow:

```text
User question
  ↓
Astra Lab decision contract
  ↓
POST /api/v1/council/run
  providers = ["openai"]
  ↓
Existing OpenAI / GPT-6 Astra connector
  ↓
Layer 1 + Alignment
  ↓
OpenAI-only deliberation output
  ↓
OMOS Governed Output
  ↓
Human Gate
  ↓
Decision Record + History
```

The browser accepts an OMOS API key from the user for this internal/early-access prototype. The key is kept only in page memory and is never written to local storage, URL parameters, or the DOM after entry.

### Phase 1 steering

The first version supports **revision steering**, not true mid-turn steering. A user can add a correction, new constraint, or changed objective. OMOS then creates a new governed run that includes the prior result as context and links the new revision to the prior request ID in the feature context.

This preserves provenance and avoids falsely claiming that the original OpenAI response was altered in-flight.

## Phase 2 — native Astra session

Phase 2 should add a dedicated server-side WebSocket/session controller that uses the OpenAI Responses API for true mid-turn steering while a response is active.

Target behavior:

```text
Start deliberation
  ↓
Astra reasons / calls allowed tools
  ↓
User changes a constraint while work is still running
  ↓
OMOS sends steering update
  ↓
Astra preserves completed work and continues
  ↓
OMOS records steering event + resulting output
```

Phase 2 requirements:

- server-side WebSocket only; never expose `OPENAI_API_KEY` to the browser;
- `configuration_update` support for controlled reasoning-effort changes;
- async function/custom tools only when explicitly allow-listed;
- per-tool authorization policy;
- Human Gate for consequential actions;
- steering event log in the Decision Record;
- OpenAI provider request IDs and model provenance;
- cancellation and timeout handling;
- rate limiting;
- prompt-injection and instruction-boundary tests;
- restart/reconnect behavior documented;
- no hidden chain-of-thought storage or display.

## Decision Record additions

Astra Lab runs should add these context fields without creating a second record schema:

```json
{
  "feature": "OMOS-ASTRA-LAB-0001",
  "lane": "openai_only",
  "revision": 1,
  "parentRequestId": null,
  "steeringMode": "revision",
  "nativeMidTurnSteering": false
}
```

Later native sessions may add:

```json
{
  "steeringMode": "mid_turn",
  "steeringEvents": [],
  "reasoningConfigurationEvents": [],
  "asyncToolEvents": []
}
```

## Product boundary

Astra Lab is **not** O-H-I Council consensus. It is a single-provider deep-deliberation lane.

- Astra Lab = one OpenAI model, deeply stress-tested and steerable.
- Council = multiple independent providers + cross-model review.
- OMOS = governs both lanes, preserves provenance, applies policy, records the run, and retains human authority.

## Definition of done for Phase 1

- `/astra-lab/` loads with OMOS branding.
- Provider status is read from `/api/v1/providers`.
- A valid OMOS key can start an OpenAI-only Council run.
- The request explicitly sends `providers: ["openai"]`.
- The response displays the actual model, request ID, alignment state, persistence state, and model output.
- Follow-up steering creates a traceable revision rather than silently replacing a previous run.
- No API secret is persisted in browser storage.
- The UI clearly labels factual verification and Human Gate status.

## Definition of done for native Phase 2

Phase 2 is not complete until a user can change a material instruction while an active Astra response is still running and the server can demonstrate, with provider provenance and an OMOS Decision Record, that the continued response incorporated that steering event without restarting the entire session.
