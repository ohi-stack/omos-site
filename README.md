# OMOS Site

Public site and canonical Node runtime repository for **OMOS — OneGodian Metaphysical Operating System**.

Canonical site: `https://omos.onegodian.com`

## Public purpose

OMOS helps users turn complex questions, conflicting AI answers, messy information, and difficult decisions into structured results they can understand, review, and revisit.

The public site leads with outcomes rather than architecture, while preserving direct access to the underlying Protocol, Algorithm, OHI, Council, runtime, standards, developer interfaces, evidence, and source records.

## Canonical architecture

```text
OneGodian Protocol™ = definitions, identity rules, semantics, scope, and interoperability
OneGodian Algorithm™ = Observe → Distill → Align → Select → Execute → Verify
OHI™ = multi-model comparison, critique, GCD synthesis, disagreement preservation, governed output preparation
OMOS™ = runtime, orchestration, interfaces, persistence, Human Gate, and Decision Records
OLLM = OneGodian model / multi-model application track inside the OMOS model architecture
ACC™ = operational console for agents, tasks, workflows, and approved execution
```

## Canonical customer runtime

```text
Ask OMOS
→ Distill / Layer 1
→ Alignment
→ Council Review
→ Governed Synthesis
→ Human Gate / Decision Record
→ Dashboard History
```

The Human Gate remains the human authorization boundary where configured. Model agreement is not factual verification.

## Primary navigation

The canonical seven public areas are:

1. **OMOS**
2. **Workspace**
3. **Council**
4. **OLLM**
5. **Tools**
6. **Developers**
7. **Pricing**

Persistent actions: **Status**, **Sign In**, and **Ask OMOS**.

Each primary area may expose up to six mega-menu columns. Supporting routes live inside these groups rather than becoming additional primary header items.

## Consolidated public routes

### Core
- `/`
- `/omos`
- `/workspace`
- `/ask/`
- `/status`
- `/founder`
- `/ecosystem`

### Runtime method
- `/distill`
- `/alignment`
- `/council`
- `/models`
- `/gcd-synthesis`
- `/council-provenance`
- `/verification`
- `/ohi`
- `/ohi-output-pipeline`
- `/decision-records`
- `/dashboard`

### Foundation and knowledge
- `/protocol`
- `/algorithm`
- `/ollm`
- `/tools`
- `/artifacts`
- `/docs`
- `/standards`
- `/research`
- `/digital-sanctuary`

### Developers and operations
- `/developers`
- `/developers/agents`
- `/connections`
- `/engineering-council`
- `/mcp`
- `/reference-run`

### Commercial/support
- `/pricing`
- `/shop`
- `/latest-news`
- `/legal`
- `/contact`

## Runtime APIs

Public machine-readable surfaces include:

- `/health`
- `/api/health`
- `/manifest`
- `/api/manifest`
- `/api/v1/providers`
- `/api/v1/persistence`

Authenticated runtime surfaces include:

- `POST /process`
- `POST /api/v1/council/run`
- `GET /api/v1/council/runs`
- `GET /api/v1/council/runs/:id`
- `POST /api/v1/council/runs/:id/human-decision`

## Production discipline

> If a feature is not implemented, versioned, documented, repeatable, logged where applicable, and testable, it is not operational in the current version.

Maturity is component-specific:

```text
Conceptual → Prototype → Functional → Verified → Production
```

Also preserve these distinctions:

```text
Implemented on main ≠ deployed
Staged in PR ≠ deployed
Merged ≠ production proof
Configured provider ≠ successful connection test
Model agreement ≠ factual verification
```

## OMOS-REF-0001

`OMOS-REF-0001` is the first governed end-to-end production reference run. It is not PASS until a browser-initiated governed run creates a Decision Record on durable PostgreSQL, receives the Human Gate disposition, reopens from History, survives a real runtime restart/redeploy, and the same Decision ID reopens with ownership and revision/hash lineage intact.

See `/reference-run` and Issue #28 for the controlling evidence gate.

## Source repositories

`ohi-stack/omos-site` is the runtime authority for the live site.

Related sources may inform public documentation when current and non-conflicting, including:

- `ohi-stack/onegodian-protocol`
- `ohi-stack/onegodian-llm`
- `ohi-stack/acc`
- other current OneGodian repositories containing directly relevant OMOS standards or evidence

`ohi-stack/OneGodian-Metaphysical-Operating-System-AI-Studio` is a synchronized development mirror; on mirrored paths the canonical `omos-site` runtime wins.

## Content classification

Mainstream public pages should focus on useful OMOS outcomes: decisions, comparison, evidence, records, history, tools, integrations, and governance.

Specialized material—AGI alignment research, synthetic dignity, theoretical particle work, metaphysical models, sovereign-data concepts, future smart-contract/economic concepts, and related exploratory work—belongs in Research, Artifacts, or Documentation with explicit classification. It must not be presented as established science, regulatory authority, or production capability merely because a source document exists.

## Entity boundary

ONEGODIAN, LLC is the commercial/software/IP/education/publishing/product-development layer associated with OMOS. Indigenous Nation of Onegodia religious-society, community, and internal-governance functions remain separate and must not be used to imply governmental or regulatory authority for the LLC software runtime.

## Development lifecycle

```text
Issue
→ Classify
→ Assign
→ Implement
→ Pull Request
→ Independent Review
→ Tests / CI / Security
→ OMOS Review
→ Human Approval
→ Merge
→ Deploy
→ Deployment Proof
→ Engineering Record
```

An authoring agent cannot be the sole final reviewer. Consequential production changes remain human-authorized.
