# PRD: Advertiser Management — Pulse Control Panel
_Consolidated from Notion · 2026-05-05_
_Source: https://www.notion.so/2ed23a12e715803ab4fbc120582a3dcf_

---

## 1. Executive Summary

### 1.1 Problem Statement
Within **Pulse → Control Panel**, advertiser-level settings and metadata are currently fragmented across multiple sections and file-based workflows:
- No single source of truth for advertiser configuration
- High operational friction for routine updates (persona, attribution, account manager)
- Over-reliance on file-based workflows for simple edits
- Limited transparency into historical changes
- Poor governance and auditability

### 1.2 Proposed Solution
Introduce a centralized **Advertiser Management** section within Pulse Control Panel providing:
- A **single unified view** of all advertiser-level settings (the "advertiser kundli")
- **UI-based editing** for common configurations
- **Bulk file upload support** for scale operations
- A robust **Change History / Audit Log**
- Integrated **Wallet Top-Up management** (relocated from Finance)

---

## 2. Goals & Objectives

1. Provide a centralized advertiser configuration hub
2. Reduce operational dependency on file workflows for simple edits
3. Improve governance, visibility, and auditability
4. Enable faster and safer advertiser updates
5. Standardize advertiser-level bulk workflows

**Success Metrics:**
- Reduction in file-based updates for single advertiser edits
- Reduction in support tickets related to advertiser configuration
- Reduction in time taken to update advertiser settings
- Increased audit visibility for advertiser changes

---

## 3. User Personas

**Primary:**
- **Retailer Ops / Ad Ops Teams** — Manage advertiser configurations at scale
- **Retailer Admins** — Govern access and configuration standards

**Secondary:**
- **Support / Customer Success Teams** — Audit changes and troubleshoot issues

---

## 4. Entry Point & Navigation

**New Section:**
> Pulse → Control Panel → Advertiser Management

- Access governed by existing role-based permissions
- Only authorized users can view/edit advertiser settings

---

## 5. Advertiser List View

### 5.1 Table Columns
| Column | Notes |
|---|---|
| Advertiser ID | |
| Merchant ID | |
| Advertiser Name | |
| Persona | |
| SPA Attribution Type | |
| SPA Attribution Window | |
| SDA Attribution Type | |
| SDA Attribution Window | |
| Account Manager Name | |
| Status | Exhausted / Churned / Active / Not Activated |
| Onboarded On | New onboardings only — no data for historical |
| Onboarded By | New onboardings only — no data for historical |
| Advertiser Segments | |
| Advertiser Users | |

### 5.2 Status Logic (SQL)
```sql
CASE
  WHEN clients.total_topup_amount_usd > 0
    AND COALESCE(clients.remaining_budget_amount_usd, 0) <= 0.01
    AND clients.status != 'INACTIVE'
  THEN 'Exhausted'
  WHEN clients.status = 'INACTIVE'
  THEN 'Churned'
  WHEN clients.status = 'ACTIVE'
    AND clients.total_topup_amount_usd > 0.2
  THEN 'Active'
  WHEN clients.status = 'ACTIVE'
  THEN 'Not Activated'
END AS merchant_status
```

### 5.3 Search & Filters
**Search:** Advertiser Name, Advertiser ID

**Filters:**
- Persona
- SPA Attribution Type
- SDA Attribution Type
- Account Manager Name or Email
- Advertiser ID
- Merchant ID
- Advertiser Name
- Onboarded By

---

## 6. Functional Modules

### 6.1 Persona Management (UI-Based)

**Current state:** Persona allocation supported only via file download/upload

**Requirements:**
- Default persona always assigned
- Display currently assigned persona
- Allow persona change via dropdown
- Only one persona allowed per advertiser
- Save with confirmation dialog
- Warning: "Changes may impact downstream campaign behavior"

---

### 6.2 Attribution Configuration (UI-Based)

**Supported attributes — for both SPA & SDA:**

| Attribute | Options |
|---|---|
| Attribution Type | Click-through / View-through / Hybrid (if supported) |
| Click-through Window | 1–30 days |
| View-through Window | 1–7 days |
| Hybrid Window | Click 1–30 days + View 1–7 days |

**Guardrails (must be enforced at UI level):**
- Retailer-level attribution windows act as upper bound for advertiser-level settings
- If retailer click-through window = 20 days → advertiser can only configure 1–20 days
- Default view-through window = 1 day
- If retailer attribution type is click-through only AND advertiser selects view-through → view-through window cannot exceed 1 day
- Attribution type change MUST require window selection

**Requirements:**
- Display current attribution type and window
- Only supported combinations allowed (guardrails enforced in UI)
- Warning: "Impacts active campaigns and reporting"
- Save with confirmation dialog

---

### 6.3 Account Manager Management (UI-Based)

**Attributes:**
- Account Manager Name
- Account Manager Email

**Requirements:**
- Display current values
- Inline or modal-based edit
- Email validation: email must exist in system
- If name not provided, infer from system using email
- Save with confirmation

---

### 6.4 Wallet Management (Relocated from Finance)

**New location:**
> Pulse → Finance → Advertiser Management

**Capabilities:**
1. **Bulk Wallet Top-Up (File-Based)** — support existing file-based bulk wallet uploads
2. **UI-Based Wallet Top-Up:**
   - User selects advertiser + wallet
   - Enters required form inputs (same fields as bulk format)
   - All inputs supported in bulk upload must also be supported in UI

---

### 6.5 Bulk Edit (File-Based Configuration Management)

**Download template includes:**
- Persona
- SPA Attribution Type & Window
- SDA Attribution Type & Window
- Account Manager Name
- Account Manager Email

**Upload workflow:**
1. Validate file format
2. Validate supported combinations
3. Display upload errors before processing
4. Log successful updates in change history

**File Header Standardization (rename across all bulk uploads):**

| Old Header | New Header |
|---|---|
| Seller ID | Advertiser Merchant ID |
| Seller Name | Advertiser Name |
| OS Client ID | Advertiser ID |

---

## 7. Change History / Audit Log

**Scope:** All updates — UI-based or file-based — must log audit details.
_(File-based handled by generic OSMOS action tab; UI-based captured here)_

**Data captured:**
| Field | Notes |
|---|---|
| Date Timestamp | |
| Changed Field | "Persona Allocation" / "Attribution Settings" / "Account Manager" |
| Change Type | Persona Updated / SPA or SDA Attribution Type Updated / SPA or SDA Attribution Window Updated / Account Manager Added or Updated |
| Old Value → New Value | |
| Changed By (User) | |

**Tab structure:** Each entity's change history (campaign-level, advertiser-level) moves to Advertiser Management tabs.

**Filters:**
- Field Name
- User
- Date Range

---

## 8. Validation & Guardrails (Global)

- Confirmation required before saving any edit
- Downstream impact warnings displayed
- Only supported configurations allowed
- Email must exist in system for account manager
- Only one persona per advertiser
- Attribution type change requires window selection

---

## 9. Open Questions / Descoped

- **Onboarding details:** No data available for existing onboardings. Only new onboardings would have info. Descoped unless high priority.
- **Activation stage/category status:** Data is category-level based on merchant organic spend in last 30 days. Tooltip-based definitions. Likely descoped from this PRD.
- **Bulk upload advertiser users** (Notion: `2e323a12`) — archived epic for agency user management. Related but out of scope for this PRD.
- **Ad Groups provisioning** (Notion: `2d223a12`) — tagged "Next Phase". Out of scope for v1.

---

## 10. Adjacent Features (For Awareness)

**Bulk Upload Advertiser Users** (archived/next phase):
- Agency scenario: retailer doesn't want to give Pulse access to agency users
- When agency changes or adds users, manual re-mapping across all advertiser accounts is cumbersome
- Solution: upload user→advertiser mapping in bulk
- Status: Archived, Takealot as dependent client

**Ad Groups Provisioning for Advertisers** (solutioning/next phase):
- Ability for Pulse Advertiser Manager to provision Ad Groups for select advertisers
- Status: Solutioning, FE tagged "Next Phase"
