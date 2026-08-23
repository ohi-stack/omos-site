# OMOS Council of Models API — Production Alpha

## Purpose

The Council runtime replaces manual copy/paste comparison with live provider adapters and structured cross-model review.

## Processing contract

1. Receive one normalized human question.
2. Call two or more configured model providers independently.
3. Preserve each Round 1 response separately.
4. Ask each successful provider to review only the other model outputs.
5. Preserve agreement, contradiction, missing-idea, novel-insight, and risk signals.
6. Run a synthesis coordinator over Round 1 + peer reviews.
7. Return a persistent-style run payload with hashes, versions, provider metadata, verification state, and human-review requirement.

## Important verification boundary

Council agreement is **not** factual verification. The runtime returns:

- `verificationStatus: model_review_only`
- `factualVerification: not_performed`
- `humanReviewRequired: true`

until a separate evidence/verification service is implemented and passes its own production tests.

## Provider environment variables

- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `ANTHROPIC_API_KEY`
- `ANTHROPIC_MODEL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `XAI_API_KEY`
- `XAI_MODEL`
- `OMOS_MODEL_TIMEOUT_MS`

A live Council run requires at least two configured providers. This allows partial operation when one provider is unavailable without pretending a four-model run occurred.

## Runtime module

```js
const { runCouncil } = require('./src/runtime/council');

const result = await runCouncil({
  question: 'Your question here',
  providers: ['openai', 'anthropic', 'gemini', 'xai'],
  synthesisProvider: 'openai'
});
```

## Recommended HTTP contract

### `POST /api/v1/council`

Request:

```json
{
  "question": "What should we build next?",
  "providers": ["openai", "anthropic", "gemini", "xai"],
  "synthesisProvider": "openai"
}
```

Response includes:

- `runId`
- `question`
- `inputHash`
- `providers`
- `round1`
- `crossReviews`
- `synthesis`
- `verificationStatus`
- `factualVerification`
- `humanReviewRequired`
- `outputHash`
- `timestampUtc`

## Production requirements still outstanding

- HTTP route wiring and request authentication
- persistence/database for run records
- evidence retrieval and factual verification service
- provider usage/cost telemetry
- retries/circuit breakers
- redaction/privacy controls
- rate-limit policy specific to Council runs
- regression and replay corpus
- UI for live Council status and partial provider failure

This module therefore constitutes **production-alpha orchestration architecture**, not unrestricted production certification.
