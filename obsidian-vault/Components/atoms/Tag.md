---
type: component
layer: atom
name: Tag
tags: [atom, ui-component, display]
source-file: src/ui/atoms/Tag.jsx
export-name: Tag
last-updated: 2026-05-08T06:30:03Z
---

# Tag

Colored category label pill. Use for non-status category chips where the color is semantic (green = success, amber = warning, etc.).

## Import

```js
import { Tag } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| colorScheme | green\|amber\|blue\|gray\|red | — | |
| style | object | — | |
| children | ReactNode | — | Label text |

## Notes

Use `TypeBadge` (from [[Components/atoms/Badge]]) instead of `Tag` when the color needs to be driven by arbitrary domain data with a custom color map.
