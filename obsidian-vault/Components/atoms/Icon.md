---
type: component
layer: atom
name: Icon
tags: [atom, ui-component, icon, display]
source-file: src/ui/atoms/Icon.jsx
export-name: Icon
last-updated: 2026-05-08T06:30:03Z
---

# Icon

Generic SVG icon wrapper + 20 pre-built named icon exports. Use named exports for all standard icons; use `Icon` with SVG path children only for custom icons not in the set.

## Import

```js
import { Icon, SearchIcon, PlusIcon, EditIcon, TrashIcon } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| size | number | 16 | Width and height in px |
| color | string | currentColor | Stroke color |
| strokeWidth | number | 1.8 | SVG stroke width |
| children | SVG paths | — | Raw `<path>` / `<circle>` elements |

## Named Icon Exports

All accept `size`, `color`, `strokeWidth` props:

`SearchIcon` · `FilterIcon` · `RefreshIcon` · `DownloadIcon` · `PlusIcon` · `TrashIcon` · `EditIcon` · `CloseIcon` · `ChevronDownIcon` · `ChevronLeftIcon` · `ChevronRightIcon` · `UploadIcon` · `FileIcon` · `CheckIcon` · `SortIcon` · `CalendarIcon` · `EyeIcon` · `ColumnsIcon` · `InfoIcon` · `MoreIcon`

## Used By

- [[Pages/TopBar]] — ThemeDropdown, GlobalSearch area
- [[Pages/SetupDetailsPage]] — EyeIcon
<!-- TODO: verify full page usage list via component-reuse-enforcer -->

## Related Components

- [[Skills/lineicon-enforcer]] — enforces that hand-rolled SVGs match these named exports
- [[Skills/component-reuse-enforcer]] — detects local Ico() wrappers that should be replaced with named imports
