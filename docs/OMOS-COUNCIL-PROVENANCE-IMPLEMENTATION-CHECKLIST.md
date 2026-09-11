# OMOS Council Provenance Implementation Checklist

Date: 2026-09-10  
Depends on: `docs/OMOS-COUNCIL-PROVENANCE-STANDARD.md`

## Runtime

- [ ] Generate a `contributionId` for every Council contribution.
- [ ] Record transaction-assigned `role` separately from `provider`.
- [ ] Record `connectorId`.
- [ ] Preserve upstream `providerRequestId` when available.
- [ ] Add deterministic `inputHash` and `outputHash` per contribution.
- [ ] Record start/completion timestamps and measured latency.
- [ ] Add explicit `provenanceStatus`.
- [ ] Distinguish live, hybrid, simulation, and degraded Council states.
- [ ] Never count `human_relay_unverified`, `disputed`, or `unresolved` content as proven live-provider participation.

## Synthesis

- [ ] Decompose contributions into comparable Meaning Units/claims.
- [ ] Extract common-ground candidates without deleting remainders.
- [ ] Preserve material provider-specific remainders.
- [ ] Create first-class contradiction objects.
- [ ] Keep factual verification separate from Council convergence.
- [ ] Prevent synthesis when provenance requirements for the selected run mode are not met.

## Decision Record

- [ ] Persist role assignments.
- [ ] Persist complete normalized contribution envelopes.
- [ ] Persist common ground, remainders, contradictions, and evidence references.
- [ ] Persist provenance state and provider participation counts.
- [ ] Preserve historical attribution corrections as revisions rather than rewriting prior records.

## Tests

- [ ] Four distinct live contributions → `LIVE 4/4`.
- [ ] Three live + one simulation → `HYBRID/DEGRADED`, never 4/4 live.
- [ ] Human-relayed text carrying a provider label → `human_relay_unverified`.
- [ ] Disputed attribution → remains `disputed` until external/runtime evidence resolves it.
- [ ] Duplicate text from two providers does not prove common origin or truth.
- [ ] Contribution hashes remain stable for unchanged canonical payloads.
- [ ] Record survives persistence/restart with provenance fields intact.
- [ ] Authoring provider cannot be the sole final verifier when role separation is required.

## Maturity gate

This checklist is complete only when the runtime behavior exists, automated tests pass, and the resulting fields persist into Decision Records. Documentation alone does not advance the component beyond specification status.
