# Meta Muse / Social Reality Lane — OMOS Technical Specification

**Status:** Integration contract / capability-gated
**Provider ID:** `meta/muse`
**Lane:** `social_marketing_reality`
**Default:** disabled until a supported Meta Muse/API surface and credentials are configured.

## Purpose
Add Meta Muse as an optional specialized OMOS lane for social/marketing analysis. Muse is not a general factual-verification authority and is not required for the canonical four-provider Council baseline.

## Governance invariants
1. Human Gate remains mandatory for every external write or consequential action.
2. Social engagement, audience response, ad performance, creator analytics, and predictions are signals; they do not establish truth.
3. Decision Records preserve `provider: "meta/muse"` provenance.
4. Read/audit and write/action capabilities are separately permissioned.
5. OMOS degrades cleanly when Muse is unavailable.
6. No DM send, ad launch/edit, subscription change, account mutation, or publishing action may execute from Council review.
7. Any future write-capable Meta adapter routes through the OMOS Connection & Adaptation Layer and Human Gate.

## Routing
Muse may be requested for social media, creator strategy, audience/engagement analysis, Instagram, Meta advertising, social inbox triage, or campaign analysis. It remains optional for unrelated Council runs.

```text
Ask OMOS -> Layer 1 -> Alignment -> Council baseline
  + optional Meta Muse Social Reality Lane
  -> Governed Synthesis -> Human Gate -> Decision Record -> History
```

## Environment
```env
META_MUSE_ENABLED=false
META_MUSE_API_KEY=
META_MUSE_MODEL=
META_MUSE_API_URL=
OMOS_MUSE_READ_SOCIAL=false
OMOS_MUSE_READ_ADS=false
OMOS_MUSE_DM_TRIAGE=false
OMOS_MUSE_REQUIRE_HUMAN_APPROVAL=true
```

## Acceptance criteria
- Registry can identify `meta/muse` without making it mandatory.
- Missing credentials produce explicit unavailable/disabled state, never simulated live data.
- Council can attach Muse output as a specialized lane while preserving the baseline Council.
- Decision Record stores provider ID, lane, provenance, source scope, uncertainty, and approval requirement.
- No write capability is enabled by this integration.
- Social-signal output cannot set factual verification to verified.
- Consequential actions remain blocked pending Human Gate authorization.
