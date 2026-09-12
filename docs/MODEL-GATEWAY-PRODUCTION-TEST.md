# OMOS Model Gateway — Production Test Standard

Status: Required production verification gate  
Applies to: OpenAI, Anthropic, Google Gemini, xAI  
Special profile: GPT-6 Astra native connector  

## 1. Purpose

This document defines the evidence required before an OMOS model connector may be represented as production-verified.

Passing mocked/unit contract tests is necessary but not sufficient. A production designation requires one controlled live provider call from the deployed OMOS environment using the configured server-side credential and a persisted Decision Record containing the normalized provider provenance.

## 2. Normalized Connector Contract

Every provider adapter MUST expose:

- `isConfigured()`
- `selectedModel()`
- `capabilities()`
- `generate()`

Every successful live `generate()` result MUST normalize to:

```json
{
  "provider": "openai|anthropic|gemini|xai",
  "connector": "OMOS-CONN-...",
  "api": "provider API family",
  "model": "actual model identifier",
  "output": "provider response text",
  "latencyMs": 0,
  "simulated": false,
  "metadata": {
    "providerRequestId": null,
    "providerStatus": null,
    "usage": null,
    "humanApprovalRequired": true
  }
}
```

Provider-specific metadata MAY be added, but the common fields MUST remain present.

## 3. Shared Production Gates

A connector receives `LIVE_VERIFIED` only after all applicable gates pass:

1. Server-side API key is configured in the deployed environment.
2. The selected model is accessible to that account.
3. OMOS provider status reports the connector as configured.
4. A controlled live Council run invokes the provider without simulation fallback.
5. Returned result contains `simulated: false`.
6. Provider/model/connector/API identity are present.
7. Provider request ID is preserved when the provider supplies one.
8. Provider status/finish reason is preserved where available.
9. Usage/token metadata is preserved where available.
10. Latency is captured.
11. Result is included in the Council run provenance.
12. Decision Record persists the provider provenance.
13. Reopening the Decision Record returns the same provider/model/request provenance.
14. Provider failure degrades the Council rather than silently becoming a successful live result.
15. Model agreement remains separate from factual verification.

If a provider credential is absent or the model is unavailable, status MUST remain `SIMULATION`, `UNAVAILABLE`, or `DEGRADED`; it MUST NOT be reported as live-verified.

## 4. GPT-6 Astra Additional Gates

Connector: `OMOS-CONN-OPENAI-ASTRA-0001`

Astra requires the shared production gates plus:

1. Live account confirms access to the configured `gpt-6-astra` model.
2. Responses API call succeeds from the deployed OMOS environment.
3. Actual model returned by OpenAI is persisted.
4. OpenAI response/request ID is persisted.
5. Usage metadata is persisted.
6. Reasoning effort is persisted.
7. Output item types are persisted.
8. Capability declaration is shown separately from OMOS authorization.
9. Computer use remains disabled unless a dedicated OMOS policy/Human Gate authorizes it.
10. Hosted shell remains disabled unless separately authorized.
11. MCP remains disabled unless separately authorized.
12. Consequential execution remains disabled at the model-adapter layer.

### Astra Hosted Tool Verification

Web search, file search, and code interpreter MAY be verified individually in a non-consequential test profile. Each enabled tool requires:

- explicit OMOS authorization flag;
- test input with no sensitive production data;
- provider provenance showing the tool execution/output type;
- successful Decision Record persistence;
- no automatic promotion to consequential execution authority.

Computer use, hosted shell, MCP, external actions, credentials changes, deployments, payments, destructive mutations, or other consequential tools are outside the basic Astra connector verification gate. They require the OMOS Connection & Adaptation Layer, explicit authorization policy, Human Gate enforcement, and separate safety/production tests.

## 5. Required Test Matrix

| Provider | Contract test | Live call | Provenance persisted | Reopen proof | Production status |
|---|---|---|---|---|---|
| OpenAI / GPT-6 Astra | Required | Required | Required | Required | Pending until evidence |
| Anthropic / Claude | Required | Required | Required | Required | Pending until evidence |
| Google Gemini | Required | Required | Required | Required | Pending until evidence |
| xAI / Grok | Required | Required | Required | Required | Pending until evidence |

## 6. Evidence Record

For each live provider test, capture:

- UTC timestamp;
- deployed OMOS commit SHA;
- environment identifier;
- Decision Record ID;
- provider;
- connector ID;
- requested model;
- actual returned model;
- provider request/response ID if supplied;
- latency;
- usage metadata if supplied;
- simulated flag;
- Council mode (`live` or `hybrid`);
- Decision Record persistence backend;
- reopen verification result;
- reviewer;
- final disposition.

Never store API keys or secret credential material in the evidence record.

## 7. Status Vocabulary

- `CONTRACT_VERIFIED` — normalized adapter unit/CI tests pass.
- `LIVE_VERIFIED` — controlled live provider call and persisted provenance pass.
- `DEGRADED` — provider attempted but unavailable/failed and Council continued safely.
- `SIMULATION` — provider is intentionally simulated because live credentials/access are unavailable.
- `BLOCKED` — connector cannot be tested or used due to policy, credential, account, or implementation failure.

## 8. Production Rule

A connector MUST NOT be labeled production-verified until `LIVE_VERIFIED` evidence exists for the deployed environment.

A merged connector implementation without live evidence remains code-complete / contract-verified, not production-verified.
