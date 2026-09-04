# OMOS Connection & Adaptation Layer™

**Status:** Architecture Specification  
**Purpose:** Provide a stable, provider-neutral way for OMOS to connect to models, data systems, action systems, and computational/physical environments without embedding platform-specific logic in OMOS core.

## 1. Core Architecture

```text
External Platform
      ↓
Connector / Adapter
      ↓
OMOS Connection Gateway
      ↓
OMOS Runtime
      ↓
OneGodian Algorithm™
      ↓
Decision / Authorized Action
      ↓
Adapter
      ↓
External Platform
```

A **Connector** establishes access and session/authorization state. An **Adapter** translates the platform's native objects, capabilities, errors, and actions into OMOS's common interface.

OMOS remains responsible for orchestration, policy, provenance, human authorization, audit records, and verification boundaries.

## 2. Connection Classes

### Model Connections
Examples:
- OpenAI
- Anthropic
- Google Gemini
- xAI
- local OLLM

Purpose: intelligence/model inference for Ask OMOS, Council Review, specialized reasoning, evaluation, and synthesis.

### Data Connections
Examples:
- GitHub
- Google Drive
- Notion
- WordPress
- databases
- document repositories

Purpose: authorized read/search/retrieve operations over organizational knowledge.

### Action Connections
Examples:
- GitHub
- WordPress
- Stripe
- email
- calendars
- deployment systems

Purpose: perform authorized external mutations or operations.

### Environment Connections
Examples:
- Unreal Engine
- Blender
- 3D runtimes
- robots
- IoT
- XR/simulation systems

Purpose: interact with computational or physical environments through policy-controlled adapters.

## 3. Stable Adapter Contract

Every adapter SHOULD implement the applicable subset of:

```text
connect()
authenticate()
capabilities()
health()
read()
search()
invoke()
write()
subscribe()
cancel()
disconnect()
```

The Adapter decides whether the underlying mechanism is:

- REST/API;
- SDK;
- CLI;
- MCP-style tool interface;
- webhook;
- browser/computer-use flow;
- local process;
- agent runtime;
- direct device interface.

OMOS should not require core changes when the transport changes.

## 4. Model Connector Interface

The model gateway should normalize each provider into a common contract.

```text
ModelConnector
├── provider
├── model
├── capabilities
├── availability
├── health
├── authentication_state
├── invoke()
├── stream()
├── review()
├── retry()
├── cancel()
├── token_usage
├── latency_ms
├── estimated_cost
├── provider_request_id
├── error
└── provenance
```

### Council Request

```json
{
  "question": "",
  "canonical_input": "",
  "system_policy": "",
  "requested_models": [],
  "council_mode": "live",
  "max_tokens": 0,
  "timeout_ms": 0,
  "decision_id": ""
}
```

### Normalized Model Envelope

```json
{
  "provider": "anthropic",
  "model": "",
  "status": "complete",
  "response": "",
  "latency_ms": 0,
  "usage": {},
  "provenance": {},
  "error": null
}
```

## 5. Connection Registry

Every configured external connection should have a registry record containing:

```text
Connection ID
Platform
Adapter
Connection Class
Protocol / Transport
Authentication Method
Capabilities
Read Permissions
Write Permissions
Human Approval Requirement
Environment
Health
Version
Last Successful Operation
Rate Limits
Audit Policy
Verification Policy
```

Example ID:

`OMOS-CONN-GITHUB-0001`

Example capability set:

```text
repositories.read
issues.read
issues.write
branches.read
pull_requests.read
pull_requests.write
actions.read
deployments.read
```

High-impact actions such as merge, release, production deployment, payment mutation, account deletion, or infrastructure destruction SHOULD default to **Human Approval Required** unless an explicit policy profile grants narrower authority.

## 6. Connections UI

Canonical route:

`/connections`

Recommended status values:

- Connected
- Degraded
- Disconnected
- Authorization Required
- Disabled

Recommended categories:

- Models
- Development
- Knowledge
- Business
- Communication
- Infrastructure
- 3D & Simulation
- Custom Connections

Recommended detail routes:

```text
/connections/openai
/connections/anthropic
/connections/gemini
/connections/xai
/connections/ollm
/connections/github
/connections/wordpress
/connections/stripe
/connections/unreal
/connections/blender
/connections/custom
```

Each detail page should show:

- safe configuration metadata;
- capabilities;
- permissions;
- authorization status;
- connection health;
- last successful request;
- recent errors;
- test-connection control;
- logs/provenance;
- approval rules.

Secrets MUST NOT be rendered in the browser or committed to source control.

## 7. Authentication and Secret Handling

Secrets belong in server-side environment variables or an approved secrets manager. Repository files may contain variable names and placeholders only.

The system should distinguish:

- configured;
- connected;
- authenticated;
- healthy;
- authorized for requested action.

These are not interchangeable states.

## 8. Authorization Boundary

Connection availability does not imply action authorization.

OMOS SHOULD evaluate:

1. actor identity;
2. connection capability;
3. requested operation;
4. environment;
5. policy/ruleset;
6. required approval;
7. risk classification;
8. audit requirements;
9. verification requirements.

before dispatching a write or consequential operation.

## 9. Engineering Council Integration

The GitHub connector is a primary example of this layer:

```text
GitHub Issue
→ Task Classification
→ Agent Assignment
→ Agent Work
→ Pull Request
→ Cross-Agent Review
→ Tests / CI
→ OMOS Review
→ Human Approval
→ Merge
→ Deployment Proof
```

GitHub performs repository operations; OMOS remains the control and governance layer.

## 10. Computer-Use Adaptation

As computer-use systems mature, adapters may perform actions where APIs are unavailable. Such adapters MUST still report:

- action plan;
- target application/window;
- authorization state;
- human approval requirement;
- execution log;
- screenshots or equivalent proof when appropriate;
- final verification status.

Computer use is an execution mechanism, not an exemption from OMOS governance.

## 11. Definition of Done

A new OMOS connection is complete only when:

- the adapter contract is implemented;
- capabilities are enumerated;
- secrets are server-side;
- health is testable;
- read/write boundaries are explicit;
- approval rules are enforced;
- failures degrade safely;
- operations produce provenance/audit data;
- tests cover unauthorized and degraded cases;
- documentation identifies what is live vs planned.
