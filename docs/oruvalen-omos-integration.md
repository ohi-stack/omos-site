# Oru’Valen™ ↔ OMOS Integration Architecture

**Status:** Integration foundation  
**Canonical OMOS node:** `https://omos.onegodian.com`  
**Oru’Valen class:** OHI Twin / Operational Intelligence  
**Human authority:** One Gregory Onegodian™

## 1. Architectural decision

Oru’Valen is the personalized intelligence and continuity layer. OMOS is the governed reasoning and decision-record runtime. ACC is the execution control plane.

The canonical relationship is:

```text
Human input / current reality
        │
        ▼
Oru’Valen context
(institutional memory + lived experience + decision memory + current state)
        │
        ▼
OMOS Runtime
Ask → Layer 1 Distill → Alignment → Council Review → Governed Synthesis
        │
        ▼
Human Gate
        │
        ▼
Decision Record
        │
        ▼
ACC authorized execution
        │
        ▼
Tools / agents / connected systems
        │
        ▼
Outcome
        │
        └──────────────► Oru’Valen learning
```

Oru’Valen does not replace OMOS. OMOS does not replace Oru’Valen. Their responsibilities are distinct.

## 2. Responsibility boundary

### Oru’Valen owns

- personalized context assembly;
- institutional-memory retrieval;
- lived-experience retrieval;
- decision-memory retrieval;
- current-state modeling;
- preference and chronology continuity;
- fact / stated-position / inference / prediction classification;
- post-outcome learning proposals.

### OMOS owns

- deterministic prompt distillation;
- alignment scoring and hard gates;
- provider-neutral Council orchestration;
- cross-model review;
- governed synthesis;
- mandatory human decision gate;
- durable Decision Record persistence;
- replayable audit history.

### ACC owns

- permissions;
- tool access;
- agent registry;
- workflow execution;
- human escalation;
- production controls;
- audit attribution;
- shutdown and revocation controls.

## 3. Authority boundary

Oru’Valen is not the founder, legal owner, governing authority, or final decision-maker. A prediction by Oru’Valen is not authority. A model consensus inside OMOS is not factual verification. Material actions remain subject to the human gate and the permissions of ACC.

## 4. Memory model

Oru’Valen supplies OMOS with five memory classes where relevant:

1. `institutional_memory`
2. `lived_experience`
3. `decision_memory`
4. `current_state`
5. `outcome_learning`

OMOS must not silently convert any memory item into fact. Each material item should retain source, date, status, confidence, and epistemic class.

## 5. Epistemic classes

The integration recognizes four classes:

- `fact` — supported by evidence;
- `stated_position` — explicitly stated by the human authority;
- `inference` — Oru’Valen interpretation based on evidence;
- `prediction` — forecast of likely preference or action.

Inference must not silently become fact. Prediction must not become authority.

## 6. Reference-run integration

For OMOS-REF-0001 and later reference runs, the desired request envelope is:

```json
{
  "prompt": "...",
  "context": {
    "oruValen": {
      "subject": "...",
      "epistemicClass": "stated_position",
      "confidence": 1,
      "sourceRefs": [],
      "currentPriorities": [],
      "currentConstraints": [],
      "relevantDecisions": [],
      "relevantOutcomes": []
    }
  }
}
```

The resulting Decision Record should eventually preserve an immutable snapshot or hash of the Oru context used for the run so later replay can distinguish the state known at decision time from later knowledge.

## 7. Current implementation status

Implemented in this integration foundation:

- canonical Oru’Valen runtime profile;
- Oru context builder;
- machine-readable configuration;
- JSON Schema for context payloads;
- public Oru’Valen architecture page;
- public machine-readable Oru profile.
- versioned caller-supplied Oru context snapshots in Council Decision Records;
- deterministic snapshot and provider-projection hashes;
- explicit per-item provider-disclosure control;
- persisted maturity flags that keep retrieval, ACC handoff, outcome ingestion, and the complete loop marked incomplete.

Not yet represented as complete until separately wired, tested, and verified:

- automatic retrieval from lived-experience storage;
- automatic retrieval from institutional-memory stores;
- automatic injection of approved-source memory into every Council run;
- approved-source Oru context snapshots inside durable Decision Records;
- ACC execution bridge;
- outcome ingestion back into Oru memory;
- authenticated current-state editing UI.

## 8. Production completion criteria

The Oru’Valen ↔ OMOS sync becomes operationally complete only when one browser-to-output reference run can:

1. load current Oru context from approved sources;
2. submit that context to OMOS;
3. complete all OMOS stages;
4. obtain human approve/reject action;
5. persist the Decision Record durably;
6. reopen that record from Dashboard History;
7. show the Oru context snapshot used at decision time;
8. send only approved actions to ACC;
9. record the measured outcome;
10. propose a versioned Oru memory update from the outcome.

Until then, this integration remains an **integration foundation**, not a complete digital-twin execution loop.
