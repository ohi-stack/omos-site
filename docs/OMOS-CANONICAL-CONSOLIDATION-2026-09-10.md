# OMOS Canonical Consolidation — 2026-09-10

## Authority

Canonical production repository: `ohi-stack/omos-site`  
Canonical branch: `main`  
Canonical public host: `https://omos.onegodian.com`

`ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio` remains a development mirror. AI Studio-specific work must be upstreamed to `omos-site` before it is treated as canonical OMOS production code.

## Architectural boundaries

- OneGodian Protocol™ — definitions, identity rules, interoperability, scope.
- OneGodian Algorithm™ — Observe → Distill → Align → Select → Execute → Verify.
- OHI™ — multi-model comparison, critique, synthesis, meaningful-dissent preservation.
- OMOS™ — runtime, orchestration, user interfaces, persistence, Human Gate, Decision Records, public technical documentation.
- ACC — separate agent/workflow engineering control plane integrated with OMOS where appropriate.
- OLLM — dedicated multi-model intelligence product/runtime track; OMOS integrates and documents it rather than absorbing its entire application repository.

## Repositories and branches reviewed

### `ohi-stack/omos-site`
Primary runtime and site repository. Current main contains public pages, runtime APIs, model adapters, Decision Record persistence, Ask OMOS, dashboard, schemas, tools, documentation, WordPress bridge assets, and production evidence contracts.

### `ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio`
Development mirror. Its synchronization policy explicitly names `ohi-stack/omos-site main` as the runtime authority. No mirror path is allowed to override newer canonical runtime code merely because it exists in AI Studio.

### `ohi-stack/onegodian-llm`
OLLM remains the dedicated product repository. Relevant architecture is surfaced on OMOS through OLLM documentation/pages, while authentication, metering, paid-plan implementation, and product-specific runtime work remain owned by the OLLM repository until explicitly upstreamed or integrated.

### `ohi-stack/onegodian-protocol`
Protocol/Algorithm/Belief Mapper specification source. Runtime-facing documentation and implementation copies may appear in OMOS, but the specification repository remains an independent source layer.

### OMOS pull-request stack
The September 10 convergence PR was merged first. Current, non-conflicting pieces from older branches were then manually upstreamed where direct merge would have reintroduced stale server, navigation, catalog, or design state.

## Consolidated into `omos-site/main`

### Flagship execution
- Ask OMOS operational workspace.
- Seven-stage run rail: Input → Layer 1 → Alignment → Council → Synthesis → Human Gate → Decision Record.
- Council execution/history/Human Gate API integration.
- Decision Record persistence architecture.
- OMOS-REF-0001 reference-run documentation and public page.

### Council and model layer
- OpenAI adapter.
- Anthropic adapter.
- Gemini adapter.
- xAI adapter.
- Model connector control-center content.
- Dedicated OpenAI, Anthropic, Gemini, and xAI public model pages.
- Premium Gemini OMOS homepage asset.
- Council provenance standard and implementation checklist.
- Council public page and OHI output-pipeline experience.

### Identity and reflection tools
- Functional-candidate Belief Mapper runtime classifier.
- Seven-question browser experience.
- Seeker, Believer, OneGodian, Elder, and OneGodian Ally outcomes.
- Explicit self-identification requirement for OneGodian/Elder classifications.
- Belief Mapper regression tests.
- Belief Mapper product specification and privacy/authority boundaries.
- Declaration Generator public tool page.

### Algorithm, Protocol, OHI, and developer tooling
- Protocol overview/specification surfaces.
- Algorithm overview/specification surfaces.
- Algorithm Visualizer.
- Protocol Explorer.
- Bridge Builder.
- OHI and Council documentation.
- API manifest documentation.
- Developer hub.
- Engineering Council page/contract.
- ACC + Codex Engineering Factory contract.
- MCP public documentation page.
- Verification page.
- Connections/integration page.

### Time and records
- OTS-V5 public library artifact.
- OneGodian Time Converter tool.
- OTS-V5 operational rule: UTC is canonical system storage; Gregorian/civil date controls legal, banking, tax, contract, and financial records; OT is derived/supplemental.

### Public source library
- OneGodian Algorithm whitepaper.
- OneGodian AI System Prompt.
- Protocol and Algorithm framework PDF.
- OTS-V5 Corrected Edition.
- OneGodian Frequency Standard PDF.
- Founder/author statement.

### Institutional/legal education
- Public-safe Seeger education page explaining what `United States v. Seeger` helps illustrate and what it does not establish.
- Institutional classification/entity-separation page.
- Explicit rule against treating software declarations or model outputs as automatic legal recognition.

### Site/platform layer
- Customer-first homepage assets.
- Shared OMOS design system and global shell.
- Workspace, Council, OLLM, Tools, Developers, Pricing, Dashboard, Artifacts, Docs, Shop, Legal, Contact, Digital Sanctuary, latest-news/build-status, and reference-run surfaces.
- Expanded sitemap and clean static aliases for newly consolidated public pages.
- WordPress bridge documentation and plugin assets for OneGodian.org, OneGodian.com, and QuantumOHI.com as clients of the central OMOS runtime.

## Intentionally not merged as canonical runtime behavior

The following categories were reviewed but not blindly imported:

- stale copies of `server.js` that would overwrite newer persistence, ownership, provider, Human Gate, or UI work;
- older navigation/header/footer implementations superseded by the current shared shell;
- obsolete or conflicting pricing/catalog branches;
- speculative securities, token, investment-return, or financial-governance functionality;
- unsupported provider endorsement/validation claims;
- wording that treats Council agreement as factual verification;
- wording that treats GCD synthesis as mathematical proof of truth;
- claims that an OMOS declaration automatically establishes First Amendment, RFRA, banking, tax, or other legal status;
- claims that copyright registration alone makes the word OneGodian legally exclusive;
- claims that 432 Hz is a universal scientific constant;
- any code or page that would blur ONEGODIAN, LLC commercial activity with INO religious-society/internal-governance context.

## Canonical maturity rule

A page or specification can be published before its corresponding runtime is complete, but it must be labeled accordingly. A capability becomes Functional only when it operates in controlled validation. Verified requires reproducible evidence against documented requirements. Production requires deployed, monitored, repeatable real-world operation under the defined controls.

No PR merge, documentation page, model agreement, or successful local test is by itself deployment proof.

## Remaining production gates

1. Verify that the canonical production host is running the latest `main` SHA.
2. Verify `/api/v1/persistence` reports PostgreSQL and `durable: true` on production.
3. Execute OMOS-REF-0001 against the live host.
4. Persist a Human Gate disposition server-side.
5. Restart/redeploy the runtime and prove the same Decision Record reopens.
6. Verify Dashboard History can locate and reopen that record.
7. Run live page/runtime/security smoke checks on the deployed SHA.
8. Add true server-pushed stage telemetry if live stage-by-stage animation is required rather than recorded-stage playback.
9. Wire the Belief Mapper server API only after privacy, auth/rate-limit, no-store, and browser/server parity requirements are implemented and tested.
10. Implement commerce entitlement enforcement before paid OMOS run products are represented as fully automated.

## Production source rule going forward

New OMOS public-site/runtime work should land in `ohi-stack/omos-site` or be upstreamed there before release. Mirror repositories, experiments, external AI Studio work, model-generated proposals, and stale PRs are inputs—not production authority.
