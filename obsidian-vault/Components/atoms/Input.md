---
type: component
layer: atom
name: Input
tags: [atom, ui-component, form, interactive]
source-file: src/ui/atoms/Input.jsx
export-name: Input
last-updated: 2026-05-08T06:30:02Z
---

# Input

Text input field with label and optional required indicator. Same file also exports `Select` (dropdown).

## Import

```js
import { Input, Select } from '../../ui';
```

## Props — Input

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| label | string | — | Renders above input |
| value | string | — | |
| onChange | function | — | |
| placeholder | string | — | |
| type | text\|email\|number\|password | text | |
| required | boolean | false | Appends red * to label |
| disabled | boolean | false | opacity 0.5 |
| style | object | — | Wrapper div styles |
| inputStyle | object | — | Input element styles |

## Props — Select

Same as Input plus:

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| options | [{value, label}] | — | Dropdown options |

## Used By

- Drawer forms across all data-management-list pages
<!-- TODO: verify via import scan -->
