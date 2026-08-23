# OMOS™ Runtime Specification v1.1

## Status

Maturity: **Functional** — available for controlled validation with known limitations.

Human oversight is required for consequential use. A live website does not, by itself, establish Verified or Production maturity.

## Architectural separation

- **OneGodian Protocol™** — definitions, identity rules, scope, and interoperability.
- **OneGodian Algorithm™** — evaluation and decision logic.
- **OHI™** — multi-model comparison, critique, and synthesis methodology.
- **OMOS™** — runtime, orchestration, records, interfaces, and controlled execution environment.

The OneGodian Algorithm retains its four canonical application layers: Protocol, Experience, Community, and Orientation. OMOS implements the execution cycle beneath those layers.

## Runtime cycle

```text
Observe → Distill → Align → Select → Execute → Verify
```

### Observe
Validate and classify input, record provenance, preserve material constraints, and flag prompt-injection or authority conflicts.

### Distill
Separate claims, evidence, assumptions, instructions, contradictions, missing information, and non-material noise. Preserve meaningful dissent.

### Align
Evaluate candidate outputs using separate dimensions rather than a single opaque score.

Positive dimensions:

- Truth
- Clarity
- Coherence
- Dignity
- Constructive Unity
- Evidence
- Verifiability
- Transparency
- Reproducibility
- Security
- Long-Term Benefit
- Execution Readiness

Penalty dimensions:

- Distortion
- Manipulation
- Fragmentation
- Needless Conflict
- Unsupported Claims
- Hidden Risk
- Coercion
- Unauthorized Action

### Select
Reject prohibited actions first. Among permitted options, prefer the highest-supported and least harmful effective resolution. Escalate when evidence, authority, or consent is insufficient.

### Execute
Execution is restricted by authorization, risk, and human-approval controls. Informational outputs may be delivered without consequential execution.

### Verify
Verification is a status, not a blanket `true` flag. Model agreement is not factual verification. Verification failure blocks consequential execution, registry publication, certificate issuance, financial action, legal submission, and infrastructure mutation.

## Decision states

```text
ALIGNED
CONDITIONALLY_ALIGNED
HUMAN_REVIEW_REQUIRED
INSUFFICIENT_EVIDENCE
CONFLICT_UNRESOLVED
NOT_ALIGNED
PROHIBITED
```

## Hard gates

These conditions cannot be averaged away by a high weighted score:

- dignity failure
- consent failure
- unauthorized action
- fabricated evidence
- unresolved high risk

## Council of Models contract

OMOS may compare independent outputs from configured models such as OpenAI, Anthropic, Google, xAI, or other adapters. The runtime must keep these concepts separate:

- model agreement
- evidence support
- canonical/source alignment
- factual verification
- unresolved claims

A multi-model workflow should surface:

- agreement zones
- contradictions
- missing ideas
- unsupported claims
- supported dissent
- novel insights

The public interface must clearly distinguish **simulation mode** from **live orchestration mode**.

## Decision record

Every consequential run should be able to emit a machine-readable record containing at minimum:

```json
{
  "schemaVersion": "1.1.0",
  "decisionId": "OMOS-DEC-000001",
  "runtimeVersion": "1.1.0",
  "algorithmVersion": "1.1",
  "rulesetVersion": "2026.08",
  "inputHash": "sha256:...",
  "modelsUsed": [],
  "evidenceRefs": [],
  "contradictions": [],
  "supportedDissent": [],
  "alignmentScores": {},
  "confidence": {},
  "humanApprovalRequired": true,
  "verificationStatus": "informational_or_human_review",
  "outputHash": "sha256:...",
  "timestampUtc": "..."
}
```

UTC is the canonical machine timestamp. OneGodian Time may be derived and displayed as a supplemental internal representation according to OTS-V5.

## Maturity model

```text
CONCEPTUAL → PROTOTYPE → FUNCTIONAL → VERIFIED → PRODUCTION
```

A component may only advance when it is implemented, versioned, documented, repeatable, testable, and logged where applicable.

## v1.1 acceptance criteria

1. `/process` produces the v1.1 structured decision record.
2. `verified` is no longer an unconditional boolean.
3. Consequential requests require human approval unless explicitly approved by an authorized execution policy.
4. Hard-gate failures return `PROHIBITED` or equivalent blocked status.
5. Alignment dimensions are individually visible in output payloads.
6. Prompt-injection and authority-conflict signals are recorded.
7. Multi-model agreement remains separate from evidence and factual verification.
8. Smoke tests cover aligned, review-required, prohibited, and insufficient-evidence cases.
9. Runtime documentation and manifest expose the current maturity accurately.
10. No QR-V, OBP-1, ledger, or registry integration is described as operational unless separately implemented and tested.
