# OneGodian Time Converter Specification

Version: OTS-V5 aligned
Shortcode: `[omos_time_converter]`
Recommended page: `/tools/onegodian-time-converter/`

## Purpose

The OneGodian Time Converter converts Gregorian dates into OneGodian Time display dates while preserving Gregorian/UTC time as the legal and system-of-record authority.

## Canonical Rules

- Genesis 01, 0000 OT = March 18, 2025 Gregorian
- Genesis 01, 0001 OT = March 18, 2026 Gregorian
- OT year increments only on March 18 Gregorian
- Gregorian Time controls legally
- UTC is the system truth layer
- OneGodian Time is derived display and internal sequencing metadata

## Calendar Structure

- Months 1–12: 30 days each
- Month 13, Ascension: 5 or 6 days
- Year length: 365 or 366 days

## Leap Rule

Leap status is determined by the Gregorian year in which the OneGodian year ends.

If the Gregorian end year is a leap year, Ascension has 6 days. Otherwise, Ascension has 5 days.

## Required Output Fields

```json
{
  "timestamp_utc": "2026-03-26T14:32:00Z",
  "timestamp_local": "2026-03-26 10:32:00",
  "timezone": "EDT",
  "ot_year": 1,
  "ot_month": "Genesis",
  "ot_day": 9,
  "ot_display": "Genesis 09, 0001 OT"
}
```

## Display Format

Public display:

```text
Genesis 07, 0000 OT (March 24, 2025)
```

Formal display:

```text
Recorded on Genesis 07, 0000 OT (March 24, 2025), at 8:45 PM EST, Waterbury, Connecticut.
```

## Compliance Rules

- Never use OT-only dates for court, contracts, banking, taxes, invoices, or government correspondence.
- Always retain Gregorian date.
- Always specify timezone when time is included.
- OT must be computed, not manually stored as primary truth.
