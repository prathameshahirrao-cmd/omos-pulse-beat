---
type: component
layer: atom
name: Badge
tags: [atom, ui-component, display, status]
source-file: src/ui/atoms/Badge.jsx
export-name: Badge
last-updated: 2026-05-08T06:30:03Z
---

# Badge

Status-indicator pill. Also exports `TypeBadge` for arbitrary category chips with custom color maps.

## Import

```js
import { Badge, TypeBadge } from '../../ui';
```

## Props — Badge

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| status | Active\|Inactive\|Paused\|Live\|Draft\|Error | — | Maps to color + dot |
| showDot | boolean | true | Shows colored dot prefix |
| style | object | — | |
| children | ReactNode | — | Override label text (defaults to status value) |

## Props — TypeBadge

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| type | string | — | Category value |
| colorMap | object | — | `{ [type]: { bg, color } }` — define in the screen file |
| style | object | — | |

## Notes

`TypeBadge` accepts an external `colorMap` so persona colors (`Platinum`, `Gold`, `Silver`, `Beta`) stay in screen files and don't pollute the library. Do not put domain-specific hex colors into `src/ui/atoms/Badge.jsx`.

## Related Components

- [[Skills/component-reuse-enforcer]] — detects local StatusBadge/PersonaBadge duplicates
