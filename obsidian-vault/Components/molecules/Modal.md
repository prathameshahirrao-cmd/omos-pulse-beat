---
type: component
layer: molecule
name: Modal
tags: [molecule, ui-component, layout, interactive]
source-file: src/ui/molecules/Modal.jsx
export-name: Modal
last-updated: 2026-05-08T06:30:01Z
---

# Modal

Centered overlay dialog. Use for confirmations and quick views; use [[Components/molecules/Drawer]] for create/edit forms.

## Import

```js
import { Modal } from '../../ui';
```

## Props

| Prop | Type | Default | Notes |
|------|------|---------|-------|
| open | boolean | — | |
| onClose | function | — | |
| title | string | — | |
| children | ReactNode | — | Body content |
| footer | ReactNode | — | Footer actions |

## Notes

Several retailer pages defined local `ModalPanel/ModalHeader/ModalBody/ModalFooter` sub-components. Run [[Skills/component-reuse-enforcer]] to collapse these into `<Modal>`.
