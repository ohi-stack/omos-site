# OMOS Council Provenance & Governed Synthesis Standard

Date: 2026-09-10
Status: Proposed implementation contract
Repository: `ohi-stack/omos-site`

## Purpose

This standard defines the minimum integrity requirements for attributing, comparing, synthesizing, and recording contributions from OpenAI, Anthropic, Gemini, xAI, OLLM, or future Council providers.

The standard responds to a demonstrated human-mediated relay risk: transcript text can be associated with the wrong provider label. OMOS must therefore treat a manually supplied provider label as an assertion, not as proof of origin.

Core rule:

> **Provenance precedes synthesis. Evidence outranks model agreement.**

## 1. Provider-neutral roles

Council roles belong to OMOS transactions, not permanently to model vendors.

A run may assign roles such as:

- `architect`
- `builder`
- `adversarial_reviewer`
- `verifier`
- `synthesizer`
- `domain_specialist`

The assignment must be stored with the contribution. A provider must not be treated as permanently synonymous with one role.

A provider that authored a change, conclusion, or artifact must not serve as the sole final verifier of that same work.

## 2. Canonical contribution envelope

Every live or simulated Council contribution should normalize to a record with at least:

```json
{
  "contributionId": "omos_contrib_...",
  "requestId": "omos_run_...",
  "phase": "round1",
  "role": "architect",
  "provider": "openai",
  "model": "...",
  "connectorId": "omos-conn-openai-0001",
  "providerRequestId": "...",
  "inputHash": "sha256:...",
  "outputHash": "sha256:...",
  "startedAt": "...",
  "completedAt": "...",
  "latencyMs": 0,
  "simulated": false,
  "provenanceStatus": "verified_runtime_capture",
  "output": "...",
  "metadata": {}
}
```

`providerRequestId` may be null where an upstream API does not expose a stable request identifier. A missing upstream identifier must not be replaced with a fabricated value.

## 3. Provenance states

Allowed baseline states:

- `verified_runtime_capture` — OMOS invoked the provider through the configured adapter and captured the result directly.
- `simulated` — OMOS generated an explicit simulation/fallback contribution.
- `human_relay_unverified` — content was supplied by a human and attributed to a provider without runtime proof.
- `disputed` — a contribution's claimed provider attribution has been challenged or conflicts with available evidence.
- `unresolved` — origin cannot currently be established.

Only `verified_runtime_capture` may be counted as proven live-provider participation.

## 4. Council execution state

OMOS must distinguish:

- `LIVE` — every required provider contribution was captured through a live adapter.
- `HYBRID` — some required contributions are live and some are simulated/fallback.
- `SIMULATION` — no live-provider contribution is claimed.
- `DEGRADED` — a required provider failed, timed out, or could not produce an acceptable contribution.

A 3-of-4 provider run must not be labeled 4-of-4 consensus.

## 5. GCD synthesis semantics

GCD synthesis is a repeated comparison/reduction method inspired by Greatest Common Divisor logic. It is not a truth oracle and must not be represented as mathematical proof of a factual conclusion.

The minimum processing sequence is:

```text
Verified/qualified contributions
→ Normalize
→ Decompose into Meaning Units / claims
→ Extract common-ground candidates
→ Preserve provider-specific remainders
→ Detect contradictions
→ Attach evidence references
→ Verify externally where possible
→ Governed synthesis
→ Human disposition
→ Decision Record
```

OMOS must preserve material remainders that could change the decision. Common ground must not erase dissent.

## 6. Contradiction records

A factual contradiction should become a first-class object, for example:

```json
{
  "contradictionId": "contradiction_001",
  "claim": "...",
  "supportingContributions": ["omos_contrib_a"],
  "challengingContributions": ["omos_contrib_b"],
  "evidenceRequired": ["..."],
  "verificationStatus": "unresolved"
}
```

Stylistic differences should not be promoted into factual contradictions.

## 7. Evidence hierarchy

For OMOS state claims, use this order:

```text
External / runtime evidence
> verified state
> reasoned Council convergence
> model confidence
```

Model agreement is comparative evidence. It is not factual verification.

A deterministic rule or schema can make execution repeatable without making the underlying conclusion true.

## 8. Governed synthesis output

A governed synthesis should contain:

- common ground;
- material remainders;
- contradictions;
- evidence references;
- verification state;
- uncertainty;
- alternatives;
- recommended action;
- human-review requirement.

Recommended conceptual form:

```text
Governed Synthesis = Common Ground + Material Remainders + Evidence + Verification State
```

This formula is descriptive, not arithmetic.

## 9. Human Decision Gate

The human authority may:

- `APPROVE`
- `REJECT`
- `MODIFY`
- `REQUEST_MORE_EVIDENCE`

The current runtime supports `APPROVED` and `REJECTED`; extending the server-side transition contract to the additional dispositions requires explicit implementation and regression tests before those states are represented as operational.

A valid OMOS result may be approved with dissent, deferred, rejected, or classified as insufficient evidence. Consensus is not required for successful completion.

## 10. Decision Record requirements

The final Decision Record should preserve:

- raw input and input hash;
- canonical input;
- role assignments;
- complete contribution envelopes;
- common-ground clusters;
- provider-specific remainders;
- contradictions;
- evidence and verification state;
- governed synthesis;
- human disposition;
- record revision and audit hash chain;
- runtime/build provenance.

Historical records should be superseded by later evidence rather than silently rewritten.

## 11. Production rule

This standard does not make Council provenance operational merely by existing.

Implementation becomes **Functional** only when the runtime emits these fields. It becomes **Verified** only when tests prove attribution, hashing, degradation, disputed/unverified handling, and Decision Record persistence. It becomes **Production** only when the same behavior is deployed, monitored, documented, and repeatable on the canonical host.

## Immediate implementation sequence

1. Complete OMOS-REF-0001 production proof.
2. Add normalized contribution-envelope creation in the Council orchestrator.
3. Preserve provider request IDs where available without fabricating missing IDs.
4. Add per-contribution input/output hashes and timestamps.
5. Add transaction-level role assignment.
6. Add provenance state and explicit live/hybrid/simulation/degraded accounting.
7. Add contradiction objects and material remainder preservation.
8. Add regression tests for misattribution/unverified relay cases.
9. Extend governed synthesis only after provenance-qualified inputs exist.
