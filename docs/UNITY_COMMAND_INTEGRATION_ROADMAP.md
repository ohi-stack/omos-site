# Unity Command Console Integration Roadmap

Version: v1.0.0
Target: OMOS Core Tools Plugin
Primary shortcode: `[omos_unity_command_console]`
Primary public route: `/dashboard/`

## Integration Sequence

```text
Static visual dashboard
→ connect plugin submissions
→ connect logged-in user/member data
→ connect API bridge with Member and University plugin support
→ connect QRV/registry verification
```

## Phase 1 — Static Visual Dashboard

Goal: Add the Unity Command interface as a safe, non-authoritative visual dashboard.

### Requirements

- Register shortcode: `[omos_unity_command_console]`
- Render dashboard cards, charts, log panel, registry preview, and terminal overlay
- Move CSS into plugin assets instead of relying on Tailwind CDN
- Label sample metrics as preview/demo values until connected to real data
- Add WordPress admin page: `OMOS Tools → Unity Command`

### Public Page

```text
/dashboard/
```

### Status Rule

No operational authority is implied in Phase 1. It is a display interface only.

---

## Phase 2 — Connect Plugin Submissions

Goal: Replace sample dashboard numbers with real OMOS Core Tools plugin data.

### Data Sources

- Declaration Generator submissions
- Belief Mapper submissions
- Obsidian Seal Generator submissions
- AI Demo interactions if logging is enabled
- Time Converter usage if logging is enabled

### Dashboard Metrics

```text
Total Submissions
Declarations Generated
Belief Mapper Results
Seal Requests
Recent Tool Activity
Exportable Records
```

### Required Admin Capabilities

- View submissions
- Search submissions
- Export submissions to CSV
- Filter by tool type
- Filter by date range

---

## Phase 3 — Connect Logged-In User / Member Data

Goal: Connect the dashboard to authenticated WordPress users and member profiles.

### Integration Targets

- WordPress users
- BuddyPress, if active
- WooCommerce customer accounts
- OneGodian Members plugin
- OMOS membership status

### Dashboard Metrics

```text
Logged-in user profile
Membership tier
Declaration count
Belief Mapper stage
Certificate count
Recent activity
Member dashboard link
```

### User Permissions

- Public users see demo/preview interface
- Logged-in members see their personal dashboard
- Admins see aggregate platform dashboard

---

## Phase 4 — Connect API Bridge With Member and University Plugin Support

Goal: Connect OMOS dashboard data to other OneGodian plugins and future Node/API services.

### Required Plugin Bridges

```text
OMOS Core Tools Plugin
OneGodian Members Plugin
OneGodian University Plugin
OneGodian App Bridge
```

### Bridge Requirements

- Shared API key or app key model
- REST header support using `X-OMOS-App-Key`
- Health endpoint
- Manifest endpoint
- Tool list endpoint
- Submission stats endpoint
- Member stats endpoint
- University course/enrollment stats endpoint

### Proposed WordPress REST Endpoints

```http
GET /wp-json/omos/v1/health
GET /wp-json/omos/v1/manifest
GET /wp-json/omos/v1/tools
GET /wp-json/omos/v1/submissions/stats
GET /wp-json/omos/v1/members/stats
GET /wp-json/omos/v1/university/stats
GET /wp-json/omos/v1/user/dashboard
```

### Member Plugin Data

```text
member_id
membership_tier
status
declaration_count
certificate_count
qrv_status
last_activity
```

### University Plugin Data

```text
student_id
course_count
enrolled_courses
completed_courses
certificates_earned
progress_percentage
last_learning_activity
```

### Security Requirements

- Nonce validation for WordPress users
- App key validation for server-to-server calls
- Role/capability checks for admin stats
- Never expose private user data on public routes
- Log bridge requests where applicable

---

## Phase 5 — Connect QRV / Registry Verification

Goal: Connect declarations, certificates, member IDs, university completions, and registry records to verification lookup.

### QRV Use Cases

```text
Verify Declaration
Verify Obsidian Seal
Verify Member ID
Verify Course Certificate
Verify Registry Record
Verify Tool Output
```

### Required Fields

```json
{
  "qrv_id": "QRV-EXAMPLE-ID",
  "record_type": "declaration|seal|member|certificate|course|registry",
  "record_hash": "sha256...",
  "issued_to": "display name or member id",
  "issued_at_utc": "2026-05-09T15:00:00Z",
  "status": "active|revoked|expired|pending",
  "verification_url": "https://omos.onegodian.com/verify/..."
}
```

### Public Verification Route

```text
/verify/{qrv_id}/
```

### Admin Verification Route

```text
OMOS Tools → QRV Registry
```

## Production Warning

QRV and registry verification should not be described as operational until the verification endpoint, data model, record hashing, admin management, public lookup route, and revocation process are fully implemented and tested.

## Final Target State

The Unity Command Console becomes the visual command dashboard for:

- OMOS tools
- user submissions
- member identity data
- university progress
- API health
- verification status
- registry records
- future ACC/OCP/OEG execution visibility
