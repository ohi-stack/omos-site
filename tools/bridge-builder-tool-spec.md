# Bridge-Builder Tool Specification

Document Class: OMOS Interactive Tool Requirement  
Status: v0.1  
Target Page: `/tools/bridge-builder`  
Related Spec: `docs/bridge-builder-protocol.md`

## 1. Tool Purpose

The Bridge-Builder Tool converts the Bridge-Builder Protocol™ into a public-facing OMOS interactive module. It allows a user to enter two or more conflicting perspectives and receive a structured synthesis that identifies shared truth, nonessential remainders, and a highest-coherence path forward.

## 2. Primary User Flow

1. User enters a conflict, question, or disagreement.
2. User adds two or more perspectives.
3. Tool identifies shared foundations.
4. Tool lists remainders that may be causing friction.
5. Tool generates a neutral synthesis.
6. Tool outputs a practical next-step statement.
7. Optional: user downloads or copies a Bridge Statement.

## 3. Input Fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `topic` | string | yes | The dispute, question, or issue. |
| `perspective_a` | text | yes | First position or model output. |
| `perspective_b` | text | yes | Second position or model output. |
| `perspective_c` | text | no | Optional third position. |
| `context_type` | enum | no | `ai_synthesis`, `religious`, `political`, `family`, `business`, `institutional`, `general`. |
| `output_style` | enum | no | `plain`, `formal`, `public_safe`, `developer`. |

## 4. Output Sections

The tool should return:

1. **Shared Foundation** — what all sides appear to hold in common.
2. **Verified Facts** — facts that are either stated or need verification.
3. **Remainders** — assumptions, emotional language, bias, or nonessential friction.
4. **Highest-Coherence Synthesis** — a neutral bridge statement.
5. **Next Action** — one concrete next step.
6. **Safety Note** — when legal, medical, financial, or emergency matters require professional help.

## 5. Scoring Model

Each candidate synthesis may be scored from 0–5 on:

- truthfulness;
- clarity;
- coherence;
- dignity preservation;
- constructive unity;
- reduction of needless conflict.

Penalty factors:

- unsupported claims;
- escalation language;
- identity attack;
- false equivalence;
- overgeneralization;
- legal or institutional overclaim.

## 6. Example Response Shape

```json
{
  "topic": "conflicting model answers",
  "shared_foundation": [],
  "verified_facts": [],
  "remainders": [],
  "highest_coherence_synthesis": "",
  "next_action": "",
  "score": {
    "truth": 0,
    "clarity": 0,
    "coherence": 0,
    "dignity": 0,
    "constructive_unity": 0
  },
  "warnings": []
}
```

## 7. Suggested Shortcode

```text
[omos_bridge_builder]
```

## 8. Suggested WordPress Page Copy

### Bridge-Builder Tool™

Enter two or more conflicting perspectives. OMOS will identify the shared foundation, remove unnecessary friction, and generate a clear bridge statement that preserves truth, dignity, and constructive unity.

This tool is for educational and alignment-support purposes. It does not provide legal, medical, financial, or professional advice.

## 9. Production Requirements

Before marking this tool operational, it must include:

- shortcode registered in OMOS Core Tools plugin;
- nonce validation for public submissions;
- server-side sanitization;
- rate limiting or abuse control;
- deterministic response schema;
- versioned prompt/template;
- admin setting for enabled/disabled state;
- logging policy that avoids storing sensitive personal content unless explicitly enabled;
- public disclaimer.

## 10. Current Status

This is a specification only. The tool is not operational until implemented and tested in the OMOS Core Tools plugin or an approved API backend.
