# OMOS Production Implementation Backlog

This backlog converts the approved OMOS production architecture into executable repository work.

## Phase 1 — Runtime and Route Authority

- Make `server.js` and the runtime manifest the single production source of route truth.
- Remove or clearly archive obsolete static homepage implementations.
- Add route groups for Identity, Intelligence, Workspace, Developers, Learning, Verification, Enterprise, Registry, Status, and Settings.
- Add route-status metadata so planned capabilities cannot appear active.
- Ensure `/api/manifest` exposes all route groups, statuses, and ecosystem roles.
- Add sitemap generation from the runtime manifest.
- Add canonical and security headers.

## Phase 2 — Production Homepage

- Replace the generic card homepage with the approved platform flow.
- Add animated hero and reduced-motion support.
- Add runtime status strip sourced from `/api/health`.
- Embed or link the OHI cross-model review visualization.
- Add interactive Algorithm sequence.
- Add Identity Runtime, Workspace, Developer Center, Learning, Verification, Enterprise, and ecosystem sections.
- Add structured footer navigation and legal-safe entity separation.

## Phase 3 — Identity Runtime

- Build `/identity` overview.
- Build Belief Mapper interface and schema.
- Build Declaration Generator with explicit document-status labeling.
- Build certificate and identity-record route shells.
- Add authenticated handoff to app.OneGodian.com.
- Do not claim civil identity replacement or governmental authority.

## Phase 4 — OHI Intelligence Engine

- Preserve the existing OHI pipeline visualization.
- Add controlled prompt intake.
- Add independent model-output adapters.
- Add cross-model review data model.
- Add agreement, contradiction, omission, and novelty records.
- Add human-final-authority checkpoint.
- Add export to page, document, task, API response, and artifact formats.
- Add audit log and source citations.

## Phase 5 — Multi-Agent Workspace

- Add projects, workflows, runs, and agent-role schemas.
- Add research, writing, development, verification, and production roles.
- Add workflow status, ownership, dependencies, and output records.
- Add authenticated execution through app.OneGodian.com or ACC.
- Keep the public site limited to architecture, documentation, and safe status output.

## Phase 6 — Developer Center

- Add OpenAPI specification.
- Add JSON Schemas for manifests, tools, artifacts, workflows, and OHI runs.
- Add API-key management documentation.
- Add interactive API playground with non-destructive examples.
- Add webhooks specification and signature verification before activation.
- Add analytics, rate limits, request IDs, and error contracts.

## Phase 7 — Verification and Registry

- Add verification overview and QRV.Network handoff.
- Add document, certificate, and registry verification route shells.
- Add registry status API.
- Add clear distinctions among local OMOS records, QRV verification, and civil records.

## Phase 8 — Learning and Commerce

- Build OMOS, OHI, Protocol, Algorithm, and Developer learning pathways.
- Link courses and paid materials to the designated commerce or LMS platform.
- Add enterprise licensing and integration inquiry routes.
- Add product and service analytics without moving checkout into OMOS prematurely.

## Phase 9 — WordPress Plugin Bridge

- Update plugin route manifest to match the Node runtime manifest.
- Add or validate shortcodes for manifest, status, tools, docs, OHI pipeline, Algorithm, and Identity overview.
- Add remote-health caching and graceful failure states.
- Add signed synchronization where write operations are introduced.
- Verify compatible behavior on OneGodian.com, OneGodian.org, and QuantumOHI.com.

## Phase 10 — Production Controls

- Add authenticated admin and settings.
- Add environment diagnostics without exposing secrets.
- Add deployment and rollback documentation.
- Add release checklist and version history.
- Add route, API, accessibility, and security tests.
- Add monitoring for health, latency, errors, and plugin synchronization.

## Immediate Definition of Done

The next production milestone is complete when:

1. the runtime manifest includes the approved production architecture;
2. public routes are generated from one source of truth;
3. the homepage reflects the approved platform flow;
4. planned tools are visibly labeled planned;
5. the OHI pipeline remains active and accessible;
6. `/api/health` and `/api/manifest` report the deployed version;
7. route and API smoke tests pass;
8. WordPress plugin targets can consume the manifest safely;
9. legal and commercial separation is present in public output;
10. deployment and rollback instructions are documented.
