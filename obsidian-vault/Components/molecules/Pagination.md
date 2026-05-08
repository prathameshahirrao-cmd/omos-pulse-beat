---
type: component
layer: molecule
name: Pagination
tags: [molecule, ui-component, navigation, data]
source-file: src/ui/molecules/Pagination.jsx
export-name: Pagination
last-updated: 2026-05-08T06:30:01Z
---

# Pagination

Table pagination controls. Always rendered below data tables in data-management-list screens.

## Import

```js
import { Pagination } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| total | number | — | Total record count |
| page | number | — | Current page (1-indexed) |
| perPage | number | 20 | Records per page |
| onChange | function | — | Called with new page number |
| entityLabel | string | items | Label for "X items" display |
