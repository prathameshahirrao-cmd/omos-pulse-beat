---
type: component
layer: molecule
name: Stepper
tags: [molecule, ui-component, navigation, form]
source-file: src/ui/molecules/Stepper.jsx
export-name: Stepper
last-updated: 2026-05-08T06:30:00Z
---

# Stepper

Step indicator for multi-step wizard flows. Displays numbered steps with active/completed/pending states.

## Import

```js
import { Stepper } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| steps | string[] | — | Step label array |
| current | number | 0 | Active step index (0-based) |
| style | object | — | |
