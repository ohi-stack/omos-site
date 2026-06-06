# Production Operations Dashboard

Status: specification
Date: June 6, 2026
Primary Surface: OMOS.OneGodian.com
Supporting Systems: Capital.OneGodian.com, app.OneGodian.com, u.OneGodian.com, QRV.Network, QuantumOHI.com

## Purpose

The Production Operations Dashboard is the central operating surface for tracking what is deployed, what is production-ready, what is still a prototype, and what requires follow-up across the OneGodian / OMOS infrastructure.

The dashboard must not be treated as the execution layer. It is an operations, visibility, routing, and readiness interface. Execution remains governed through the proper control-plane and execution systems.

## Platform Role

OMOS.OneGodian.com is the operational intelligence and systems architecture surface for:

- OneGodian Algorithm systems
- protocol-layer systems
- AI / model interaction frameworks
- identity-aware infrastructure
- system prompts
- operational logic environments
- production documentation
- status and readiness review

## Dashboard Principle

The dashboard answers four questions:

1. What exists?
2. What works?
3. What is connected?
4. What still needs action?

## Required Status Labels

Every platform, feature, integration, and interface shown in the dashboard must use one of the following labels:

- concept
- draft
- specification
- prototype
- production-ready
- production-live
- blocked
- deprecated

Do not describe any system as live unless it is deployed, documented, repeatable, and verifiable.

## Primary Routes

```text
/operations
/operations/status
/operations/nodes
/operations/plugins
/operations/apis
/operations/capital
/operations/compliance
/operations/logs
/operations/releases
/operations/checklist
```

## Main Dashboard Cards

### 1. Platform Status

Shows current health for:

- OMOS.OneGodian.com
- Capital.OneGodian.com
- app.OneGodian.com
- u.OneGodian.com
- OneGodian.org
- OneGodian.com
- QRV.Network
- QuantumOHI.com

Fields:

```json
{
  "platform": "OMOS.OneGodian.com",
  "role": "Operational intelligence and systems architecture",
  "status": "prototype",
  "lastChecked": "2026-06-06T00:00:00Z",
  "owner": "ONEGODIAN, LLC",
  "notes": "Documentation and operations interface under development"
}
```

### 2. Infrastructure Nodes

Tracks infrastructure nodes and their role boundaries.

Required node records:

- OMOS documentation node
- Capital infrastructure node
- App/member platform node
- University learning node
- QRV verification node
- QuantumOHI enterprise positioning node

Each node must show:

- domain
- purpose
- current repo
- current status
- API connected: yes/no
- plugin connected: yes/no
- verification connected: yes/no
- deployment notes

### 3. API Status

Tracks service availability for:

- `/api/health`
- `/api/manifest`
- `/api/tools`
- `/api/stats`
- `/api/offerings`
- `/api/submissions`
- `/api/verification`

Display:

- online/offline
- last successful response
- error state
- environment
- version

### 4. WordPress Plugin Status

Tracks plugins connected to the ecosystem.

Required plugin cards:

- OneGodian Capital Plugin
- INSTRYX Bridge
- OneGodian Platform Plugin
- OneGodian Members Plugin
- OneGodian Forms Bridge

Fields:

```json
{
  "plugin": "OneGodian Capital Plugin",
  "version": "v0.3.0-app-bridge",
  "status": "prototype",
  "wordpressSync": true,
  "appBridge": true,
  "healthEndpoint": true,
  "notes": "Requires production verification after deployment"
}
```

### 5. Capital Operations

Tracks Capital.OneGodian.com readiness.

Modules:

- Capital Portal
- Investor Center
- Disclosure Center
- Economic Development
- Workforce Development
- Service Network
- Opportunities Fund
- Verification
- Zolfi Interface
- INSTRYX Financial Interface

Required capital compliance notice:

> All capital participation requires disclosure review and acknowledgement.

### 6. Compliance Center

Tracks whether required compliance-facing material is present.

Checklist:

- Disclosure Center published
- Risk Factors page published
- Participant Agreement published
- Verification page published
- Compliance Center page published
- Terms / disclaimers linked
- No investment promise language
- No guaranteed return language
- No unsupported valuation claims
- Acknowledgement workflow defined

### 7. Release Tracker

Tracks production changes.

Fields:

- release name
- repo
- commit
- date
- environment
- status
- rollback available
- notes

### 8. Production Checklist

Base checklist:

- Routes compile
- Build passes
- Environment variables documented
- Health endpoint returns success
- Manifest endpoint returns valid JSON
- Tools endpoint returns valid JSON
- Stats endpoint returns valid JSON
- WordPress plugin bridge tested
- Stripe / WooCommerce boundaries documented
- Compliance pages linked
- Navigation updated
- No placeholders remain
- Production status labels assigned

## Recommended Data Model

```ts
export type ProductionStatus =
  | "concept"
  | "draft"
  | "specification"
  | "prototype"
  | "production-ready"
  | "production-live"
  | "blocked"
  | "deprecated";

export interface OperationsNode {
  id: string;
  name: string;
  domain: string;
  role: string;
  repo?: string;
  status: ProductionStatus;
  apiConnected: boolean;
  pluginConnected: boolean;
  verificationConnected: boolean;
  lastChecked?: string;
  notes?: string;
}
```

## Initial Operations Nodes

```json
[
  {
    "id": "omos-site",
    "name": "OMOS Site",
    "domain": "omos.onegodian.com",
    "role": "Operational intelligence and systems architecture",
    "repo": "ohi-stack/omos-site",
    "status": "prototype",
    "apiConnected": false,
    "pluginConnected": false,
    "verificationConnected": false
  },
  {
    "id": "capital-web",
    "name": "Capital Portal Web",
    "domain": "capital.onegodian.com",
    "role": "Capital and economic infrastructure",
    "repo": "ohi-stack/onegodian-capital-web",
    "status": "prototype",
    "apiConnected": false,
    "pluginConnected": true,
    "verificationConnected": false
  },
  {
    "id": "capital-plugin",
    "name": "OneGodian Capital Plugin",
    "domain": "onegodian.org/wp-admin",
    "role": "WordPress bridge for capital offerings and submissions",
    "repo": "ohi-stack/onegodian-capital-plugin",
    "status": "prototype",
    "apiConnected": true,
    "pluginConnected": true,
    "verificationConnected": false
  },
  {
    "id": "qrv",
    "name": "QRV Verification Layer",
    "domain": "qrv.network",
    "role": "Verification and credential infrastructure",
    "repo": "ohi-stack/qrv-api",
    "status": "prototype",
    "apiConnected": true,
    "pluginConnected": false,
    "verificationConnected": true
  }
]
```

## UI Requirements

The first version should include:

- dark navy / black background
- gold and cyan status accents
- card-based status layout
- clear status pills
- no exaggerated claims
- no unsupported production labels
- responsive mobile layout
- admin-readable copy

## First Implementation Target

Build `/operations` first.

Minimum cards:

1. Platform Status
2. Capital Portal
3. OMOS Docs
4. App Bridge
5. Plugin Sync
6. Verification Layer
7. Compliance Workflow
8. Production Checklist

## Repository Boundary

This file belongs in `omos-site` because OMOS is the visibility and documentation layer.

Execution logic belongs in:

- `execution-interface`
- `identity-service`
- `acc-*`
- `qrv-*`
- `onegodian-capital-plugin`
- `onegodian-capital-web`

## Next Engineering Tasks

1. Add `/operations` page to `omos-site`.
2. Create static operations data file.
3. Add status card component.
4. Add compliance checklist component.
5. Add plugin status component.
6. Add Capital Portal section.
7. Add QRV / verification section.
8. Add production checklist section.
9. Ensure all labels use approved status values.
10. Build and deploy after frontend implementation.
