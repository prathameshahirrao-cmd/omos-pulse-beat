---
type: component
layer: molecule
name: Drawer
tags: [molecule, ui-component, layout, interactive]
source-file: src/ui/molecules/Drawer.jsx
export-name: Drawer
last-updated: 2026-05-08T06:30:01Z
---

# Drawer

Right-side slide panel for create/edit forms. Default width 480px for create drawers, 560px for detail drawers.

## Import

```js
import { Drawer } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| open | boolean | — | Controls visibility |
| onClose | function | — | Called on backdrop click or × button |
| title | string | — | Header title |
| subtitle | string | — | Optional muted text below title (added 2026-04-29) |
| footer | ReactNode | — | Footer content (Cancel + Save buttons) |
| width | number | 480 | Panel width in px |
| children | ReactNode | — | Body content (forms) |

## Notes

`subtitle` prop was added 2026-04-29 as a Tier 2 variation from `component-reuse-enforcer`. Several onboarding pages had local `function Drawer({ subtitle })` definitions.

## Related

- [[Skills/component-reuse-enforcer]] — extended this component with the subtitle prop
