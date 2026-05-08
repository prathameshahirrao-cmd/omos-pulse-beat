---
type: component
layer: molecule
name: StatCard
tags: [molecule, ui-component, data, display]
source-file: src/ui/molecules/StatCard.jsx
export-name: StatCard
last-updated: 2026-05-08T06:30:01Z
---

# StatCard

KPI metric card. Used in dashboard screens for primary headline metrics. Supports optional comparison row, sub-text, and icon badge.

## Import

```js
import { StatCard } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| label | string | — | Uppercase 11px muted label |
| value | string\|number | — | Primary 22px bold value |
| trend | string | — | Trend text (e.g. "+12.4%") shown below value |
| trendDir | up\|down\|neutral | neutral | Colors trend green/red/gray |
| compValue | string | — | Comparison value string (e.g. "₹22,11,000 last month") |
| compPct | number | — | Comparison % — positive=green, negative=red (`#ef4444` intentional exception) |
| sub | string | — | Small sub-text line below value block |
| icon | ReactNode | — | Icon element for top-right badge |
| iconColor | string | — | Background color for icon badge (e.g. `'#ef444420'`) |
| style | object | — | Outer container style overrides |

## Extension History

- **2026-04-29 (Tier 2):** Added `compValue` + `compPct` — retailer `HomePage.jsx` had a local StatCard with comparison rendering
- **2026-05-02 (Tier 2):** Added `sub`, `icon`, `iconColor` — advertiser `HomePage.jsx` had a local `MetricCard` with icon badge and sub-text

## Layout Rule

StatCard grids must always use `gap: 20`:
```jsx
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
  <StatCard label="..." value="..." />
```
See [[Skills/react-implementer]] §5 for the full layout guide.

## Used By

- [[Pages/HomePage]] — retailer dashboard (4-column grid, compValue/compPct)
- [[Pages/FinanceDashboardPage]] — Finance KPI row (trend/trendDir/sub)
- [[Pages/ProductAdsAnalyticsPage]] — analytics KPI row
- [[Pages/DisplayAdsAnalyticsPage]] — analytics KPI row
- [[Pages/SponsoredAdsAnalyticsPage]] — analytics KPI row
<!-- advertiser/pages/HomePage also uses it with icon/iconColor — no vault note yet -->

## Related Components

- [[Components/molecules/KPIChip]] — compact inline variant (LiveAnalyticsPage — not replaced, different shape)
