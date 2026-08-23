# OHI Adapter Architecture

## Purpose

The OHI Cross-Model Review Cycle must support simulation mode now and live model orchestration later without changing the public workflow. The public interface should always make the current mode visible.

```text
Simulation Mode -> deterministic local demonstration outputs
Live Model Mode -> server-side provider calls using secured credentials
Human-Reviewed -> final output inspected or approved by authorized reviewer
```

## Provider Adapter Contract

Every provider adapter should implement the same server-side interface:

```ts
export interface OhiModelAdapter {
  id: string;
  label: string;
  provider: "openai" | "anthropic" | "google" | "xai" | "custom";
  mode: "simulation" | "live";
  generate(input: OhiCanonicalInput): Promise<OhiModelOutput>;
  review(input: OhiCrossReviewInput): Promise<OhiModelReview>;
}
```

## Canonical Input

```ts
export interface OhiCanonicalInput {
  runId: string;
  originalQuestion: string;
  canonicalQuestion: string;
  domain: string;
  constraints: string[];
  riskFlags: string[];
  rulesetVersion: string;
  runtimeVersion: string;
}
```

## Model Output

```ts
export interface OhiModelOutput {
  adapterId: string;
  modelName: string;
  mode: "simulation" | "live";
  summary: string;
  claims: string[];
  assumptions: string[];
  evidenceRequests: string[];
  risks: string[];
  confidence: number;
  generatedAtUtc: string;
}
```

## Cross Review Input

```ts
export interface OhiCrossReviewInput {
  reviewerAdapterId: string;
  canonicalInput: OhiCanonicalInput;
  peerOutputs: OhiModelOutput[];
}
```

## Cross Review Output

```ts
export interface OhiModelReview {
  reviewerAdapterId: string;
  reviewedAdapters: string[];
  agreementZones: string[];
  contradictions: string[];
  missingIdeas: string[];
  novelInsights: string[];
  unsupportedClaims: string[];
  humanReviewRequired: boolean;
}
```

## Supported Provider Targets

Initial adapter targets:

- OpenAI / GPT
- Anthropic / Claude
- Google / Gemini
- xAI / Grok

## Security Rules

Provider keys must never be present in browser code, public JavaScript, HTML, or WordPress shortcodes. All live calls must flow through a server-side endpoint.

```text
Browser
  -> OMOS server route
  -> server-side adapter
  -> provider API
  -> normalized output
  -> OHI cross-review
```

## Mode Declaration

Every run record must declare simulation or live mode.

```json
{
  "mode": "simulation",
  "external_api_calls": false,
  "provider_keys_exposed": false
}
```

```json
{
  "mode": "live_model",
  "external_api_calls": true,
  "provider_keys_exposed": false,
  "server_side_adapters": true
}
```

## Human Authority Rule

The OHI adapter system prepares candidate outputs and comparative signals. It must not mark consequential outputs as execution-approved without human review and authorization.

## Verification Boundary

Model agreement is not factual proof. The adapter architecture must separate model agreement, evidence support, canonical alignment, factual verification, human approval, and execution status.

## Implementation Path

1. Keep `/ohi-output-pipeline` in Simulation Mode.
2. Add server-side adapter modules.
3. Add `/api/ohi/run` for simulated runs.
4. Add `/api/ohi/adapters` for adapter inventory.
5. Add `/api/ohi/review` for cross-review records.
6. Add persistence for run records.
7. Add provider keys through deployment secrets only.
8. Add live model mode behind admin flag.
9. Add human approval state.
10. Add deterministic replay tests.
