---
type: component
layer: pattern
name: UploadPage
tags: [pattern, ui-component, upload, form]
source-file: src/ui/patterns/UploadPage.jsx
export-name: UploadPage
last-updated: 2026-05-08T06:30:03Z
---

# UploadPage

Full upload flow pattern: composes [[Components/molecules/InfoBanner]] + [[Components/molecules/UploadDropzone]] + "How it works?" card automatically. Use this for all `upload-page` screen types — never hand-roll the three sub-components separately.

## Import

```js
import { UploadPage } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| fileName | string | — | Template file name shown in InfoBanner |
| fileDesc | string | — | Template file description |
| downloadText | string | — | Download link label |
| howItWorksBullets | string[] | — | Bullet list in "How it works?" card |

## Used By

- [[Pages/AccountManagerMappingPage]]
- [[Pages/AttributionOverridesPage]]
