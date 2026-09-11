# OMOS Belief Mapper™ Product Specification

Date: 2026-09-10  
Version: 1.0.0  
Status: Functional candidate / controlled validation  
Repository authority: `ohi-stack/omos-site`

## Purpose

The Belief Mapper is a voluntary educational and self-reflection tool that maps a user's stated answers across seven dimensions and returns a transparent journey-stage reflection. It must not convert users, infer a protected status, determine legal rights, or declare a person's religious identity for them.

## User flow

WELCOME → SEVEN BELIEF QUESTIONS → BELIEF PROFILE → ALIGNMENT ANALYSIS → JOURNEY STAGE → EXPLANATION → PERSONALIZED PATH

## Seven dimensions

1. Ontology
2. Unity
3. Relationship
4. Tradition
5. Identity
6. Community
7. Purpose

## Journey stages

- **Seeker** — exploring the concept of One God without a formal OneGodian identity.
- **Believer** — affirms One God as a primary truth and is considering OneGodian identity.
- **OneGodian** — explicitly self-identifies as OneGodian and participates in the ecosystem.
- **Elder** — explicitly identifies as a OneGodian Elder and contributes knowledge, guidance, teaching, mentoring, leadership, or service.
- **OneGodian Ally** — separate relationship/status for a supporter, friend, learner, or respectful observer. It is not a required stage in the progression.

## Classification rules

- Results are deterministic based only on the submitted self-reported answers.
- A formal OneGodian result requires explicit self-identification as OneGodian.
- Elder requires explicit Elder/OneGodian identity plus a contribution/leadership signal.
- Theological similarity alone must never auto-classify another person's identity as OneGodian.
- The UI must explain why a result was produced.
- Hidden canonical weights or unexplained scores must not be invented.

## Privacy boundary

Belief responses may be sensitive personal information. The default public experience is ephemeral and browser-local. If persistence is added later, it must be opt-in, authenticated, owner-isolated, documented, and deletable under the applicable retention policy.

Belief Mapper data must not be used as a hidden eligibility signal for employment, housing, credit, healthcare, legal status, government classification, or other consequential decisions.

## Authority disclosure

Every result must disclose that it is a voluntary OneGodian framework reflection result and is not a governmental, legal, clinical, scientific, or objective measure of personal worth, spirituality, religious status, or entitlement.

## Current implementation surfaces

- Public route: `/belief-mapper`
- Browser logic: `public/belief-mapper/app.js`
- Runtime classifier: `src/runtime/beliefMapper.js`
- Regression tests: `tests/beliefMapper.test.js`
- Future authenticated API: `/api/v1/belief-mapper/evaluate`

The existence of the runtime module does not mean the future API is operational until it is wired, authenticated, rate-limited, tested, included in the manifest, and deployed.

## Definition of done for Production

1. Browser/server classifier parity is verified.
2. Automated classification tests pass.
3. Privacy and retention behavior is documented and tested.
4. Public route loads from the canonical deployed SHA.
5. Any server API is authenticated/rate-limited as designed and returns `Cache-Control: no-store`.
6. The browser experience does not send belief answers to unrelated model/data connectors.
7. Deployment evidence and regression tests exist.
8. Maturity labeling is updated only after those conditions are proven.
