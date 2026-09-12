# OneGodian MCP Runtime Conformance

**Standard:** `OG-MCP-STD-1.0`  
**Connection Layer:** `1.0.0`  
**MCP wire baseline:** `2026-07-28`  
**Implementation status:** Functional / conformance-tested in repository scope  
**Production status:** Not certified by this document

## Purpose

This implementation moves the OneGodian MCP Standard™ and the OMOS Connection & Adaptation Layer™ from specification-only material into executable runtime contracts and tests.

The implementation is published by ONEGODIAN, LLC as a technical interoperability layer. MCP provides transport/interoperability; OMOS applies runtime governance; ACC may orchestrate authorized work; domain systems remain authoritative for their own records and actions.

## Runtime components

| Component | Runtime role |
|---|---|
| `src/connections/contract.js` | Canonical connection classes, required methods, validation, public-safe metadata, human-approval gate |
| `src/connections/modelConnector.js` | Normalizes existing OpenAI, Anthropic, Gemini and xAI provider adapters behind one connector interface |
| `src/connections/mcpConnector.js` | Stateless MCP `2026-07-28` HTTP client connector |
| `src/connections/registry.js` | Connection registry and environment-defined external MCP connector loader |
| `src/connections/conformance.js` | `OG-MCP-STD-1.0` PASS / REVIEW / FAIL runner |
| `tests/connection-conformance.test.js` | Mock-server protocol and authorization tests |
| `scripts/connections-status.js` | Machine-readable runtime registry/conformance command |

## Canonical connector interface

Every OneGodian runtime connector in this slice implements:

- `connect()`
- `authenticate()`
- `capabilities()`
- `health()`
- `invoke()`
- `disconnect()`

Optional adaptation methods such as `read`, `search`, `write`, `subscribe`, and `cancel` remain capability-specific rather than being falsely advertised by every connector.

## Connection classes

- `model`
- `data`
- `action`
- `environment`

A connector record preserves platform, adapter, protocol, authentication method, capabilities, permissions, human-approval requirement, environment, version, audit policy, and verification policy.

## MCP 2026-07-28 behavior

The MCP connector targets the modern stateless protocol core:

- no `initialize` / `initialized` handshake;
- no `Mcp-Session-Id` dependency;
- `MCP-Protocol-Version: 2026-07-28` on requests;
- `Mcp-Method` mirrors the JSON-RPC method;
- `Mcp-Name` is emitted where the method mirrors a tool/prompt/resource/task identifier;
- client identity, protocol version, and client capabilities are carried in request `_meta`;
- optional `server/discover` is used for capability probing;
- transport success is not treated as factual or domain verification.

The current connector accepts JSON responses. A server response requiring a long-lived SSE/MRTR stream is explicitly rejected as `mcp_sse_response_requires_stream_handler` rather than silently misprocessed. Full MRTR/SSE handling is a subsequent compatibility extension.

## Authorization boundary

When a connection is configured with `humanApprovalRequired: true`, an MCP `tools/call` is blocked before any network request unless the invocation includes an explicit approval object with:

- `approved: true`
- `approvedBy: <non-empty actor/reference>`

This is a transport-layer enforcement boundary, not a substitute for domain-specific authorization or ACC/OCP policy.

## Secrets boundary

`OMOS_MCP_CONNECTIONS_JSON` may identify an authentication secret only by environment-variable name (`authEnv`). Embedded fields such as `token`, `secret`, `password`, `apiKey`, or `authorization` are rejected by the registry parser.

Connector status and conformance output never return the secret value.

## Conformance scopes

### `contract`

Validates the connector definition/interface, safe authentication boundary, capabilities contract, health contract, modern MCP metadata where applicable, and stateless connection semantics. This scope does not make external provider calls.

### `runtime-probe`

For MCP connectors, performs `server/discover` and `tools/list` against the configured endpoint. It is evidence of reachability and protocol interoperability only.

Neither scope authorizes a `Production` claim by itself.

## Commands

```bash
npm run check
npm run test:connections
npm run connections:status
npm run connections:probe
```

`connections:status` performs contract conformance. `connections:probe` probes only configured MCP connectors and may perform network requests.

## CI acceptance tests

The repository conformance suite verifies that:

1. all four model adapters satisfy the normalized connector contract without paid/live provider calls;
2. a local mock MCP server passes `server/discover` and `tools/list` using protocol `2026-07-28`;
3. a human-gated `tools/call` is blocked before transport when approval is absent;
4. an approved `tools/call` includes the modern protocol/method/name headers and request `_meta`;
5. no legacy `initialize` call or `Mcp-Session-Id` header is emitted;
6. embedded connection secrets are rejected;
7. malformed connection definitions fail deterministically.

## Production certification boundary

Repository conformance is **not** deployment certification. Before any named external connector is represented as Verified or Production, retain evidence for the exact deployed revision showing:

- connection definition and adapter version;
- configured authentication without secret disclosure;
- successful live `server/discover` / applicable list calls;
- authorization behavior for action tools;
- rate-limit/error behavior;
- audit/provenance persistence;
- retry/timeout behavior;
- domain-specific read/write verification;
- restart/redeploy behavior where state is relevant;
- human approval for consequential actions;
- exact deployed commit SHA.

The existing OMOS maturity rule remains controlling: only the component and capability actually tested may inherit the resulting maturity status.
