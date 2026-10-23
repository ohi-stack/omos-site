# OneGodian Intelligence Portability Standard (OIPS)

Status: Architecture specification
Scope: OMOS, O-H-I runtimes, ACC, api.OneGodian.org, MCP, provider adapters
Updated: 2026-10-03

## Purpose

OIPS keeps OneGodian intelligence portable across model and assistant providers. A provider-specific assistant, plugin, Gem, connector, or model is a runtime adapter, not the authoritative home of OneGodian intelligence.

Canonical flow:

```text
OneGodian Source
  -> Instructions / Rules
  -> Knowledge / RAG
  -> Skills
  -> Tools / Actions
  -> Tests / Verification
  -> API / MCP
  -> Provider Runtime
```

## 1. Instructions / Rules

Defines identity, purpose, behavioral requirements, policy constraints, formatting contracts, authority boundaries, permissions, and human-approval requirements.

Instructions must be source-controlled and versioned independently of provider-specific prompts.

## 2. Knowledge / RAG

Knowledge is canonical OneGodian information. RAG retrieves only the relevant authoritative material for the current request instead of embedding the entire knowledge base into model instructions.

Canonical knowledge classes include:

- O-H-I and OMOS specifications
- OneGodian Platform architecture
- architecture and plugin standards
- ODIN, QR-V, and OBP-1 records
- OneGodian Time / OTS
- approved product, technical, historical, policy, and documentation records

### Knowledge Registry

Each indexed record should support:

- document_id
- title
- legal/operational owner
- canonical source
- version
- status
- created_at / updated_at
- ODIN identifier where assigned
- verification status
- provenance and confidence metadata
- access scope

### Retrieval contract

The retrieval layer should support semantic, keyword, and hybrid search; metadata, permission, version, and authority filtering; ranking; deduplication; context assembly; and provenance attachment.

Canonical retrieval authority belongs behind api.OneGodian.org. Provider-native file stores may cache or reference material but are not the source of truth.

## 3. Skills

A Skill is a reusable task capability that composes instructions, retrieval requirements, tools, approval rules, and expected outputs.

Skills must be portable definitions. Provider-native skill formats are compiled or adapted representations of the canonical OneGodian skill.

## 4. Tools / Actions

Tools are executable capabilities. Models may request tools but do not own the authoritative action layer.

Tool categories include read, create, update, workflow, communication, development, commerce, platform integration, registry/verification, and provider/model operations.

Canonical execution path:

```text
Request
 -> OMOS governed intake
 -> Instructions / policy
 -> Knowledge / RAG
 -> Skill selection
 -> Tool Registry
 -> Permission + scope check
 -> OneGodian API / MCP
 -> Connector / Adapter
 -> Authoritative target system
 -> Result
 -> Verification + audit
 -> Human Gate / ACC where required
```

### Tool Registry minimum contract

Each tool definition should declare:

- tool_id
- name
- provider
- category
- read/write/action classification
- required scopes
- input/output schema
- approval requirement
- audit requirement
- environment
- enabled/status state
- connector/adapter
- authoritative target

Consequential external actions remain subject to the authorized ACC/execution path and Human Gate requirements.

## 5. Tests / Verification

Every portable capability must have canonical tests independent of the provider runtime. Tests should verify instruction adherence, retrieval provenance, permission enforcement, tool behavior, human-gate enforcement, expected outputs, failure behavior, and audit evidence.

A provider migration is not complete until these tests pass against the target runtime.

## API and MCP boundary

api.OneGodian.org is the shared platform/data authority for cross-property services. The OneGodian MCP Gateway exposes controlled interoperability and tool access. MCP is not itself the system of record.

Provider adapters may include OpenAI, Google Gemini, Anthropic Claude, xAI, local OneGodian models, and future runtimes.

## Portability rule

When a vendor changes or retires an assistant format, OneGodian replaces or updates the adapter. Canonical instructions, knowledge, skills, tools, permissions, tests, and provenance remain under OneGodian control.

## OMOS integration

OMOS is responsible for governed runtime orchestration: intake, alignment, retrieval, provider coordination, synthesis, Human Gate routing, Decision Records, and auditability.

ACC remains the authorized operational command/execution control plane.

This specification does not by itself claim that every described RAG, registry, adapter, or tool capability is deployed in production. Production status requires operational, documented, repeatable evidence under the repository's existing maturity discipline.
