# Agent Authority Model Summary

Source Status: Working governance draft
Related System: ACC — Agent Command Console
Version Reference: v0.1

## Purpose

The Agent Authority Model defines how authority, execution permissions, approval thresholds, escalation, and logging operate inside governed agent systems.

The model exists to ensure that agents do not self-authorize privileged actions and that all sensitive execution passes through governed approval pathways.

## Core Governance Spine

```text
ACC → OCP → OEG → Adapter / Runner
```

## Key Principles

- No self-authorizing agents
- Least privilege
- Explicit action scopes
- Approval before override
- Deterministic decision logging
- Canonical UTC timestamp preservation

## Agent Categories

- Executive Agent
- Operational Agent
- Domain Agent
- System Agent
- Adapter Agent
- Observer Agent

## Role Hierarchy

1. super_admin
2. acc_admin
3. acc_operator
4. domain_lead
5. agent_executor
6. observer

## Protected Actions

The following actions require approval or are restricted:

- workflow.override
- policy.update
- identity.role.assign
- registry.update.canonical
- financial.execute
- agent.disable.critical

## Kill Switch Support

The control plane should support:

- Global kill switch
- Domain kill switch
- Individual agent disable

## Logging Requirements

Every authorization attempt should create a decision record containing:

- decisionId
- executionId
- policyHash
- riskLevel
- approvalStatus
- timestampUtc

## Production Position

This model should be described as a governance specification and execution policy framework, not as a claim of autonomous unrestricted authority.
