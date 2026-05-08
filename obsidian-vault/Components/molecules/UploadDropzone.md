---
type: component
layer: molecule
name: UploadDropzone
tags: [molecule, ui-component, form, interactive]
source-file: src/ui/molecules/UploadDropzone.jsx
export-name: UploadDropzone
last-updated: 2026-05-08T06:30:00Z
---

# UploadDropzone

Dashed-border drag-and-drop file upload zone. Composes into [[Components/patterns/UploadPage]] automatically — use UploadDropzone directly only when you need the dropzone alone without the full page template.

## Import

```js
import { UploadDropzone } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| onUpload | function | — | Called with File object |
| accept | string | — | MIME types, e.g. `.csv` |
| label | string | — | Dropzone label text |
| successMessage | string | — | Shown after successful upload |
