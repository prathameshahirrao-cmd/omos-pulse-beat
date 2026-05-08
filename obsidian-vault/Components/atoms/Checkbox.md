---
type: component
layer: atom
name: Checkbox
tags: [atom, ui-component, form, interactive]
source-file: src/ui/atoms/Checkbox.jsx
export-name: Checkbox
last-updated: 2026-05-08T06:30:02Z
---

# Checkbox

16×16 brand-primary custom checkbox. Used in table row selection and permission matrices.

## Import

```js
import { Checkbox } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| checked | boolean | — | |
| onChange | function | — | |
| label | string | — | Optional inline label |
| disabled | boolean | false | |
| style | object | — | |

## Notes

Never hand-roll a checkbox div. Several retailer pages define a local `function Checkbox(` — run [[Skills/component-reuse-enforcer]] to replace them.

## Used By

- [[Pages/PersonaConfigPage]] — permission matrix cells
<!-- TODO: verify other pages -->
