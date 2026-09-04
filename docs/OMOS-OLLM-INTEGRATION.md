# OLLM Integration with OMOS

**Status:** Architecture Specification

## Responsibility Separation

- **OLLM** = model/intelligence layer
- **OMOS** = operating/runtime/orchestration layer
- **OneGodian Algorithm™** = evaluation and decision logic
- **OneGodian Protocol™** = rules, identity, and interoperability
- **OHI™** = multi-model comparison and synthesis

## Architecture

```text
OneGodian Ecosystem
      ↓
OMOS Runtime
      ↓
OLLM Model Gate
      ↓
Local OLLM / External APIs / Specialized Models
      ↓
Council / OHI
      ↓
OneGodian Algorithm
      ↓
Governed Output
      ↓
Decision Record
```

OLLM should become a first-class provider inside the OMOS Model Gateway rather than creating a separate competing orchestration system.

## Stage 1 — Local Inference Runtime

Required capabilities:
- model loading;
- tokenizer;
- inference;
- streaming;
- configurable temperature/context;
- CPU/GPU detection;
- model/version identification;
- health reporting.

## Stage 2 — OLLM API

Recommended compatibility endpoints:

```text
POST /v1/chat/completions
POST /v1/completions
GET  /v1/models
GET  /health
```

## Stage 3 — OMOS Adapter

The OLLM adapter should normalize local output into the same provider envelope used by OpenAI, Anthropic, Gemini, and xAI.

Minimum fields:

```text
provider
model
model_version
run_id
input_hash
output
latency_ms
token_usage
timestamp_utc
provenance
error
```

## Stage 4 — OHI Council Integration

OLLM may participate alongside external providers:

```text
OMOS Layer 1
   ↓
OLLM ─┐
GPT ──┤
Claude┤
Gemini┤
Grok ─┘
   ↓
Cross-Model Review
   ↓
Agreement / Contradictions / Missing Ideas / Novel Insights / Supported Dissent
   ↓
Governed Synthesis
   ↓
Human Gate
   ↓
Decision Record
```

## Product Positioning

OLLM should not initially be positioned as a raw-intelligence competitor to frontier foundation models. Its differentiated value is the OneGodian decision architecture around model use: Protocol, Layer 1, Alignment Engine, Council, evidence handling, human authority, and Decision Records.

## Security

- Local model files and provider credentials remain server-side.
- OLLM output is never treated as verified state merely because it is local.
- Model provenance and version must be preserved.
- Consequential execution remains subject to OMOS authorization policy.
