# OMOS Declaration Generator Specification

Version: v1.0.0
Shortcode: `[omos_declaration_generator]`
Recommended page: `/tools/declaration-generator/`

## Purpose

The Declaration Generator creates a personalized OneGodian-style declaration card for public engagement, identity reflection, and future premium download or certificate pathways.

## Inputs

| Field | Type | Required | Notes |
|---|---|---:|---|
| Name | string | yes | User display name |
| Date | date | yes | Gregorian date should be retained as the canonical input |
| Journey Stage | enum | no | Seeker, Believer, OneGodian, Elder |

## Journey Stages

```text
Seeker
Believer
OneGodian
Elder
```

## Output

The tool should generate:

- personalized declaration preview
- stage-based wording
- optional SVG/PNG download
- optional Stripe CTA
- optional saved submission log

## Production Requirements

- sanitize all user inputs
- require nonce on save actions
- store Gregorian timestamp as canonical
- store OneGodian Time only as derived display data
- avoid claiming generated cards are verified certificates unless QRV verification is active

## Future API Integration

Future endpoint:

```http
POST /api/omos/declaration/generate
```

Expected response:

```json
{
  "status": "ok",
  "tool": "declaration_generator",
  "version": "1.0.0",
  "output_html": "...",
  "timestamp_utc": "...",
  "qrv_id": null
}
```

## Compliance Note

Generated declarations are educational, expressive, and identity-reflection outputs unless separately verified through an authorized OneGodian or QRV process.
