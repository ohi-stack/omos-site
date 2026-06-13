# OMOS Core Tools Plugin Targets

Status: v1.0 target deployment map  
Plugin: `omos-core-tools`  
Primary Node Source: `https://omos.onegodian.com`  
Target WordPress Properties: `OneGodian.com`, `OneGodian.org`, `QuantumOHI.com`

## Purpose

The OMOS Core Tools plugin will be used on selected WordPress properties to display OMOS content, protocol links, runtime status, artifact cards, and tool cards sourced from the OMOS node.

The plugin must not convert those properties into OMOS itself. Each site keeps its own role.

## Target Site Roles

| Site | Role | Plugin Use |
| --- | --- | --- |
| `OneGodian.com` | Store / commerce platform | Display OMOS product cards, protocol kit links, artifact/download cards, and commerce bridge pathways. Checkout remains on OneGodian.com. |
| `OneGodian.org` | Organization / public identity / institutional home | Display public OMOS explanation cards, Algorithm/Protocol education links, source documents, and public-safe status blocks. |
| `QuantumOHI.com` | Quantum-OHI / systems and technology positioning | Display OMOS/OHI protocol modules, alignment docs, developer-facing links, and Quantum-OHI integration pathways. |

## Required Node Endpoints

The plugin should read from these OMOS node endpoints when available:

```text
https://omos.onegodian.com/api/health
https://omos.onegodian.com/api/manifest
https://omos.onegodian.com/api/ecosystem
https://omos.onegodian.com/api/tools
https://omos.onegodian.com/api/artifacts
https://omos.onegodian.com/api/docs
https://omos.onegodian.com/api/bridge/status
```

If an endpoint is unavailable, the plugin must show a public-safe fallback message and mark the module as planned or unavailable, not operational.

## Required Plugin Screens

- OMOS Dashboard
- Node Settings
- Content Sync
- Tool Cards
- Artifact Cards
- Docs Cards
- Bridge Status
- Compliance Notice
- Import / Export
- System Health

## Required Shortcodes

```text
[omos_manifest]
[omos_runtime_status]
[omos_ecosystem_cards]
[omos_tool_grid]
[omos_artifact_grid]
[omos_docs_grid]
[omos_open_console_button]
[omos_bridge_builder]
```

`[omos_bridge_builder]` must remain a placeholder until the Bridge-Builder runtime is implemented, connected, and tested.

## Site-Specific Placement

### OneGodian.com

Recommended locations:

- `/product-category/omos/`
- OMOS product pages
- digital downloads pages
- developer kit product pages
- footer / resource menu

Primary CTA:

```text
View OMOS Products
```

### OneGodian.org

Recommended locations:

- `/omos/`
- `/what-is-onegodian/`
- `/onegodian-algorithm/`
- `/digital-sanctuary/`
- educational resource pages

Primary CTA:

```text
Learn the OMOS Framework
```

### QuantumOHI.com

Recommended locations:

- `/omos/`
- `/ohi/`
- `/alignment/`
- `/developer/`
- services / technical strategy pages

Primary CTA:

```text
Open OMOS Protocol Docs
```

## Compliance Requirements

1. OMOS is a protocol, specification, documentation, and runtime-support framework.
2. ONEGODIAN, LLC is the commercial/IP/software/education entity.
3. INO governance/religious society language must remain separated and used only where legally appropriate.
4. Gregorian/civil records remain controlling for legal, financial, tax, banking, and institutional matters.
5. No plugin output should imply independent nation-state authority, immunity from law, authority over non-members, or financial guarantees.

## Deployment Checklist

1. Install plugin on staging copy of each WordPress site.
2. Configure OMOS Node URL: `https://omos.onegodian.com`.
3. Test `/api/health` and `/api/manifest` from the plugin.
4. Add target-specific shortcodes to approved pages.
5. Confirm fallback messages display if node is unavailable.
6. Confirm compliance notice displays where required.
7. Verify no checkout or financial action happens on OMOS node.
8. Promote staging to production only after screenshots and endpoint tests are recorded.
