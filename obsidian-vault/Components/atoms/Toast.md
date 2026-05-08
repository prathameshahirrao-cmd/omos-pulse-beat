---
type: component
layer: atom
name: Toast
tags: [atom, ui-component, notification, interactive]
source-file: src/ui/atoms/Toast.jsx
export-name: Toast
last-updated: 2026-05-08T06:30:02Z
---

# Toast

Fixed top-right notification banner. Always use the `useToast` hook — never manage toast state manually.

## Import

```js
import { Toast, useToast } from '../../ui';
```

## Usage

```jsx
const { toast, showToast } = useToast();

// Trigger:
showToast('User deleted', 'success');     // type: success | error | info
showToast('Something failed', 'error', 5000); // custom duration ms

// Render at component root:
<Toast visible={toast.visible} message={toast.message} type={toast.type} />
```

## Used By

- [[Pages/SetupDetailsPage]]
- All data-management-list pages (delete/save confirmations)
<!-- TODO: verify via import scan -->
