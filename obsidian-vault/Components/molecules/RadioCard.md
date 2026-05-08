---
type: component
layer: molecule
name: RadioCard
tags: [molecule, ui-component, form, interactive]
source-file: src/ui/molecules/RadioCard.jsx
export-name: RadioCard
last-updated: 2026-05-08T06:30:01Z
---

# RadioCard

Card-style radio button for selecting between 2–4 options with visual cards. Also exports `RadioDot` for compact dot indicators.

## Import

```js
import { RadioCard, RadioDot } from '../../ui';
```

## Props — RadioCard

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| selected | boolean | — | Highlights card with brand-primary border |
| onClick | function | — | |
| label | string | — | Option label |
| description | string | — | Sub-text |
| style | object | — | |

## Props — RadioDot

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| selected | boolean | — | |
| size | number | 16 | px |
