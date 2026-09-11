# OMOS Live-Site Consolidation — 2026-09-10

Status: Implementation candidate
Canonical host: `https://omos.onegodian.com`
Canonical runtime repository: `ohi-stack/omos-site`

## Purpose

Consolidate the current OMOS conversation, canonical runtime architecture, and current non-conflicting material from related OneGodian repositories into a coherent public information architecture without representing staged, draft, theoretical, or provider-dependent capabilities as Production.

## Source precedence

1. Current verified runtime behavior controls capability claims.
2. Current `ohi-stack/omos-site/main` controls live-site architecture.
3. Current approved specification controls intended behavior where runtime has not yet implemented it.
4. Related repositories may provide component definitions and product architecture when they do not conflict with the canonical runtime.
5. Historical, experimental, mirror, and superseded material remains reference material rather than silently overriding current state.

## Related repositories reviewed

### `ohi-stack/omos-site`
Authoritative runtime, public routes, Decision Records, Council orchestration, persistence, production evidence, UI shell, artifacts, documentation, and site architecture.

### `ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio`
Development mirror. Its sync contract identifies `omos-site` as canonical for mirrored paths, so no mirror-only content is allowed to override the live runtime without an upstream review.

### `ohi-stack/onegodian-protocol`
Used for current public explanation of the OneGodian Protocol, its working-draft maturity, six protocol layers, voluntary/non-coercive interaction principles, and Belief Mapper background. The runtime candidate for Belief Mapper remains in its dedicated OMOS PR until merge and verification.

### `ohi-stack/onegodian-llm`
Used for OLLM production-track positioning, multi-model journey, requirement to preserve individual provider outputs, and claims discipline. OLLM is not labeled Production merely because the specification exists.

### `ohi-stack/acc`
Used to clarify the OMOS/ACC boundary: OMOS provides governed reasoning/runtime and Decision Records; ACC provides the operator console for OHI systems, agents, tasks, workflows, queues, and approved execution.

## Public content added or expanded

### Core identity and architecture
- `/omos`
- `/founder`
- `/ecosystem`
- `/status`

### Customer runtime
- `/workspace`
- `/distill`
- `/alignment`
- `/decision-records`

### Council / OHI
- `/council`
- `/gcd-synthesis`
- `/council-provenance`
- `/verification`
- `/ohi`

### Development and integration
- `/developers`
- `/developers/agents`
- `/connections`
- `/engineering-council`
- `/mcp`
- `/reference-run`

### Knowledge organization
- `/docs`
- `/artifacts`
- `/tools`
- `/standards`
- `/research`
- `/protocol`
- `/algorithm`

## Active implementation branches deliberately not duplicated

- Belief Mapper runtime candidate remains owned by its dedicated PR.
- Model Connectors control center remains owned by its dedicated PR.
- OpenAI/Astra connector remains owned by its dedicated PR/current mainline as applicable.
- Commerce/shop source remains owned by its current commercial-product PR.
- Council contribution-level provenance runtime hardening remains a separate implementation step from the public provenance standard.

## Public claims preserved

- Model agreement is not factual verification.
- Evidence outranks consensus.
- Provider configuration is not a successful connection test.
- Roles belong to transactions rather than permanently to providers.
- Human-relayed provider identity is not mechanical provenance.
- A merged PR is not a deployment.
- A live URL is not production certification.
- Consequential actions remain human-authorized and may require domain-specific professional review.
- Research/theoretical material remains distinct from established external science and production software capability.

## Commercial positioning

The public site describes a capability-gated product ladder centered on useful decision outcomes: free entry, one-off decision/compare products, recurring individual workspaces, Council access, team/business governance, API access after entitlement controls, and implementation services.

Numeric launch pricing is not locked by this consolidation because current repository proposals remain provisional and are not fully harmonized. OneGodian.com remains the commerce/checkout authority.

## Production boundary

This consolidation changes source and routing only. It does not certify the canonical host as running the resulting commit. After merge, deployment must identify the exact source SHA and pass normal runtime/page tests and the applicable production-evidence gates.

OMOS-REF-0001 remains separately incomplete until a governed Decision Record survives a real restart/redeploy and reopens with its Human Gate disposition, ownership isolation, and revision/hash lineage intact.
