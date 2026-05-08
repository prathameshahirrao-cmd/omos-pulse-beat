---
type: component
layer: molecule
name: Toolbar
tags: [molecule, ui-component, layout, navigation]
source-file: src/ui/molecules/Toolbar.jsx
export-name: Toolbar
last-updated: 2026-05-08T06:30:02Z
---

# Toolbar

Left+right action bar used in every screen above the data table. Left slot holds filters/labels; right slot holds [[Components/molecules/SearchBar]] and action buttons.

## Import

```js
import { Toolbar } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| left | ReactNode | — | Left slot content |
| right | ReactNode | — | Right slot content |
| noBorder | boolean | false | Removes bottom border |
| style | object | — | |

## Pattern

```jsx
<Toolbar
  left={<span>Segments (11)</span>}
  right={<>
    <SearchBar value={q} onChange={setQ} placeholder="Search..." />
    <Button variant="primary" onClick={openDrawer}>Add Segment</Button>
  </>}
/>
```
