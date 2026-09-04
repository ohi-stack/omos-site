# OMOS Conversation Integration Ledger — 2026-09-04

**Purpose:** Record the OMOS material consolidated from the September 2026 project conversation into this repository.

## Added in this integration

- `docs/OMOS-COMPLIANCE-TEST-SUITE-1.0.md`
  - conformance levels;
  - PASS/FAIL/WARN/N/A states;
  - Layer 1, Alignment, Council, Decision Record, persistence, API, prompt-enforcement, and robotics test boundaries;
  - OMOS-REF-0001 proof gates.

- `docs/OMOS-CONNECTION-ADAPTATION-LAYER.md`
  - model, data, action, and environment connection classes;
  - stable adapter contract;
  - Connection Registry;
  - secrets, authorization, and computer-use boundaries.

- `docs/OMOS-ENGINEERING-COUNCIL.md`
  - Issue → classification → agent assignment → PR → cross-agent review → CI → OMOS review → human approval → merge → deployment proof.

- `docs/OMOS-OLLM-INTEGRATION.md`
  - OLLM as a first-class model/intelligence provider inside the OMOS Model Gateway;
  - local inference, API, adapter, and Council integration stages.

- `docs/OMOS-BELIEF-MAPPER-PRODUCT-SPEC.md`
  - seven belief dimensions;
  - Seeker → Believer → OneGodian → Elder journey stages;
  - explanatory, voluntary, non-authoritative result rules.

- `docs/OMOS-MEGA-MENU-V2.md`
  - customer-first seven-link mega-menu architecture: OMOS, Workspace, Council, OLLM, Tools, Developers, Pricing.

- `docs/OMOS-PRODUCT-STRATEGY.md`
  - outcome-first commercialization;
  - Ask OMOS, Decision Review, AI Council, Document Review, Pro, Business, and Implementation;
  - checkout → entitlement → governed run → Decision Record → History flow.

- `docs/OMOS-INSTITUTIONAL-CLASSIFICATION-BOUNDARIES.md`
  - ONEGODIAN, LLC / INO separation;
  - identity, timekeeping, alignment, commerce, and public-claims boundaries.

- `README.md`
  - updated to the current OMOS operating model;
  - added reference-run, connectors, OLLM, Engineering Council, CTS, Belief Mapper, commerce, and safety boundaries.

## Existing repository material treated as already integrated

The conversation repeatedly referenced capabilities and specifications already present in the repository, including:

- OMOS Live Capability Standard;
- Browser-to-Output Reference Run;
- Decision Record / Alignment / Verification schemas;
- commerce entitlement specification;
- OTS-V5 time governance;
- Council/model-adapter work;
- PostgreSQL persistence path;
- server-side Human Gate;
- global OMOS UI shell;
- WordPress/plugin sync architecture;
- sitemap and content index;
- runtime health/manifest infrastructure.

These were not duplicated merely to create new filenames.

## Canonical architecture retained

This integration preserves the current separation:

```text
Protocol = definitions / identity rules / interoperability
Algorithm = evaluation / decision logic
OHI = multi-model comparison / critique / synthesis
OMOS = runtime / orchestration / persistence / interfaces / audit
OLLM = first-class model provider inside the OMOS Model Gateway
```

It also preserves the six-stage Algorithm process:

`Observe → Distill → Align → Select → Execute → Verify`

and the product-facing OMOS rail:

`INPUT → LAYER 1 → ALIGN → COUNCIL → SYNTHESIZE → RECORD → HISTORY`

## Key rules locked by this integration

1. **Model agreement is not factual verification.**
2. **Functional is not Production.**
3. **Consequential execution remains subject to configured human/policy approval.**
4. **UTC/Gregorian remain canonical for system/legal recordkeeping; OT is derived/supplemental.**
5. **Provider secrets remain server-side.**
6. **A browser payment-success redirect is not payment authority; verified server-side payment events grant entitlements.**
7. **Internal identity or alignment metrics do not replace government identity or establish objective spiritual/moral status.**
8. **ONEGODIAN, LLC commercial/software activity remains distinct from INO governance/religious-society functions.**
9. **Computer use is an execution mechanism, not a bypass around OMOS governance.**
10. **OMOS-REF-0001 requires restart-safe persistence and reopenable history before PASS.**

## Deliberately excluded from this OMOS repository integration

The conversation also contained material that does not belong in `ohi-stack/omos-site`, including:

- unrelated personal financial planning;
- unrelated real-estate operating strategy;
- unrelated music/ALLATYME production content;
- unrelated game projects;
- general WooCommerce CSV instructions not specific to OMOS;
- obsolete earlier proposals superseded by newer OMOS architecture;
- claims that were explicitly identified as unverified or aspirational.

Such material should remain in its appropriate repository, business record, or project context rather than being copied into OMOS.

## Next implementation issues

The documentation integration should feed engineering work in this order:

1. automate OMOS-CTS core tests;
2. finish durable OMOS-REF-0001 production proof;
3. implement `/connections` and the Connection Registry;
4. finish model connector health/configuration UI;
5. complete Dashboard History search/reopen/export;
6. implement commerce checkout/webhook/entitlement enforcement;
7. integrate OLLM as a first-class provider;
8. implement Belief Mapper product UI with the public-safe rules in its specification;
9. update the global shell to Mega Menu v2 only when target routes and statuses are ready.
