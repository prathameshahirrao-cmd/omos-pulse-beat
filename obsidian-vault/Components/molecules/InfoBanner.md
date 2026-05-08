---
type: component
layer: molecule
name: InfoBanner
tags: [molecule, ui-component, notification, display]
source-file: src/ui/molecules/InfoBanner.jsx
export-name: InfoBanner
last-updated: 2026-05-08T06:30:02Z
---

# InfoBanner

Alert or notification banner rendered above page content. Used in [[Components/patterns/UploadPage]] internally.

## Import

```js
import { InfoBanner } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| type | info\|warning\|error\|success | info | |
| message | string | — | Banner text |
| fileName | string | — | Upload page variant: file name display |
| fileDesc | string | — | Upload page variant: file description |
| downloadText | string | — | Upload page variant: download link label |
| onDownload | function | — | Upload page variant: download handler |
