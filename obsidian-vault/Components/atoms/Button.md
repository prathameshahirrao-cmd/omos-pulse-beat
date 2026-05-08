---
type: component
layer: atom
name: Button
tags: [atom, ui-component, interactive]
source-file: src/ui/atoms/Button.jsx
export-name: Button
last-updated: 2026-05-08T06:30:02Z
---

# Button

Versatile button atom supporting five visual variants. Always import from `src/ui/` — never use raw `<button>` or local `BtnPrimary` style objects.

## Import

```js
import { Button } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| variant | primary\|outline\|ghost\|icon\|link | — | Controls visual style |
| size | sm\|md | md | sm = 12px font, reduced padding |
| onClick | function | — | |
| disabled | boolean | false | opacity 0.45, no pointer events |
| style | object | — | Inline style override |
| type | button\|submit | button | |
| title | string | — | Tooltip |
| children | ReactNode | — | Button label |

## Variants

- `primary` — brand-primary background, white text
- `outline` — transparent bg, muted border
- `ghost` — no bg/border, muted text
- `icon` — square, icon-sized, with border
- `link` — no bg, brand-primary text, underlined

## Used By

<!-- Confirmed by import scanning: -->
- [[Pages/SetupDetailsPage]]
<!-- Most pages use Button but define it locally — run component-reuse-enforcer to fix -->

## Related Components

- [[Skills/component-reuse-enforcer]] — detects BtnPrimary/btnBase local duplicates
