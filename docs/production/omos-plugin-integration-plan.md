# OMOS Plugin Production Integration Plan

Prepared for: ONEGODIAN, LLC  
System: OMOS — OneGodian Metaphysical Operating System  
Status: Production planning record

## Purpose

This document defines the controlled production path for adding OMOS plugin functionality across the OneGodian ecosystem without collapsing the distinction between public explanation, commerce, and runtime execution.

The objective is to make OMOS usable as a real product layer while preserving institutional, legal, and operational clarity.

## Domain Role Separation

### OneGodian.org

Use OneGodian.org as the public interpretation and educational layer.

Recommended OMOS functions:

- OMOS overview page
- Digital Sanctuary page
- OneGodian Algorithm explanation
- Belief Mapper Lite public funnel
- White paper and protocol documentation
- Public ethics and consent notices
- Links to OMOS.OneGodian.com for runtime access

Do not use OneGodian.org as the heavy execution/control-plane domain.

### OneGodian.com

Use OneGodian.com as the commercial and user-facing product layer.

Recommended OMOS functions:

- Paid memberships
- Digital products
- User dashboards
- Identity tools
- Belief Mapper results
- Personalized content pathways
- WooCommerce product bridges
- Stripe-backed premium access

### OMOS.OneGodian.com

Use OMOS.OneGodian.com as the dedicated protocol/runtime domain.

Recommended OMOS functions:

- Runtime API
- `/process` endpoint
- Dashboard interface
- API key enforcement
- Integration documentation
- Developer and system tests

## Minimum Viable Plugin Scope

The first production-ready plugin should include only the following modules:

1. Admin settings screen
2. API key field for OMOS runtime access
3. Runtime endpoint URL setting
4. Belief Mapper Lite shortcode
5. OMOS dashboard embed shortcode
6. WooCommerce membership/product bridge
7. Consent notice component
8. Basic health check panel

Avoid adding advanced identity, credential, agent, or financial functions until the core plugin is stable, documented, and repeatable.

## Required Public Language

Use disciplined language:

- founder-defined identity framework
- public explanation layer
- voluntary participation
- identity reflection
- human-centered technology
- educational and commercial tools
- internal governance context only

Avoid public language that implies:

- independent nation-state authority
- governmental authority over non-members
- exemption from U.S. law
- compulsory belief or conversion
- financial guarantees

## Implementation Checklist

### Phase 1 — Stabilize Runtime

- Confirm `/health` response remains public and stable
- Confirm `/process` requires `x-omos-key`
- Add versioned manifest endpoint
- Add integration documentation
- Add smoke tests for runtime and plugin-facing endpoints

### Phase 2 — WordPress Plugin Adapter

- Add WordPress admin settings page
- Add shortcode: `[omos_belief_mapper]`
- Add shortcode: `[omos_dashboard_embed]`
- Add API client wrapper with timeout handling
- Add consent text before any user submission
- Add non-financial, non-governmental disclaimer language

### Phase 3 — OneGodian.org Deployment

- Publish OMOS public landing page
- Publish Digital Sanctuary page
- Embed Belief Mapper Lite
- Link to OMOS documentation and protocol pages

### Phase 4 — OneGodian.com Deployment

- Add OMOS product category
- Add membership products
- Add dashboard access path
- Add WooCommerce entitlement checks
- Add customer onboarding email copy

## Production Rule

If a feature is not operational, documented, tested, and repeatable, it is not part of the current production version.

## Current Recommended Version Label

OMOS Plugin MVP: `v0.1.0-production-planning`
