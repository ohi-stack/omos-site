# OMOS WordPress / Runtime Synchronization

## Purpose

OMOS operates across two coordinated surfaces and several supporting OneGodian WordPress nodes. This document defines which system owns what, how repository state maps to deployed state, and what evidence is required before the ecosystem may be described as synchronized.

## Canonical surface split

### Public WordPress surface

`https://omos.onegodian.org`

Owns:
- public explanation of OMOS;
- documentation and educational content;
- navigation and conversion paths;
- public product/service context;
- public runtime status display;
- WordPress-native content and media;
- links into the governed runtime.

It does not own:
- provider execution;
- Council orchestration;
- Human Gate decisions;
- authoritative Decision Record persistence;
- privileged connector execution;
- production deployment authority.

### Governed OMOS runtime

`https://omos.onegodian.com`

Owns:
- Ask OMOS;
- Layer 1 distillation;
- Alignment Engine;
- Council invocation and provenance;
- Governed Synthesis;
- Human Gate;
- Decision Records;
- Dashboard History;
- PostgreSQL persistence;
- Model Gateway and MCP/Connection runtime;
- production build provenance.

## Shared WordPress plugin

Repository: `ohi-stack/onegodian-platform-plugin`

Target plugin version for this synchronization contract: `0.3.0`.

The shared plugin provides the OMOS bridge to WordPress nodes. It exposes only public-safe state and never converts WordPress into an OMOS/ACC execution authority.

Expected endpoints on every synced installation:

- `/wp-json/onegodian/v1/omos`
- `/wp-json/onegodian/v1/omos/health`
- `/wp-json/onegodian/v1/platform-sync`

## Required WordPress nodes

The initial synchronized set is:

1. `omos.onegodian.org` — OMOS public surface.
2. `onegodian.org` — OneGodian public/organization surface.
3. `onegodian.com` — commerce surface.
4. `u.onegodian.org` — University surface.
5. `quantumohi.com` — QuantumOHI public surface.

Additional sites may join the same contract after they expose the shared platform-sync manifest.

## Repository responsibilities

- `ohi-stack/omos-site` — governed OMOS runtime and canonical surface registry.
- `ohi-stack/onegodian-platform-plugin` — shared WordPress integration layer.
- `ohi-stack/onegodian-protocol` — interoperability and authority rules.
- `ohi-stack/acc` — authorized external execution control plane.
- `ohi-stack/onegodian-llm` — model/intelligence provider and synthesis track.

The repos should not duplicate authority. Shared contracts may be mirrored, but runtime truth remains component-specific.

## Synchronization rule

Repository parity is necessary but not sufficient.

A WordPress node is **Aligned** only when the live `platform-sync` endpoint reports the expected plugin version, site role, and canonical OMOS URLs.

The OMOS runtime is **Aligned** only when the live host reports the approved runtime version and exact deployed build provenance and passes the production evidence gates.

The ecosystem is **Synchronized** only when both are true.

## Current production boundary

At the time this contract was introduced, repository status evidence showed the canonical OMOS runtime reachable but behind the repository target. Therefore the architecture can be synchronized in source while deployment remains pending.

Do not close production-sync work solely because repository CI is green.

## Rollout sequence

1. Merge the OMOS platform-surface contract.
2. Merge the OneGodian Platform Plugin OMOS bridge.
3. Build/version the plugin package as `0.3.0`.
4. Deploy the shared plugin update to each required WordPress node.
5. Verify each live `platform-sync` endpoint.
6. Update the governed `.com` runtime to an approved current-main revision.
7. Verify runtime version, build SHA, persistence, providers, protected routes, and required public surfaces.
8. Execute OMOS-REF-0001 and restart/reopen proof.
9. Record the synchronized deployment evidence.

## Production rule

If a component is not fully operational, documented, repeatable, and verified on its live target, it does not exist at that maturity level in the current version.
