import React from 'react';
import { Icon } from '../../ui/atoms/Icon';

const LayoutIcon = () => (
  <Icon size={48} color="var(--osmos-fg-subtle)" strokeWidth={1.25}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M3 9h18" />
    <path d="M9 21V9" />
  </Icon>
);

export default function DisplayAdsAdFormatPage() {
  return (
    <div style={{
      padding: 40, background: 'var(--osmos-bg-subtle)', minHeight: '100vh',
      fontFamily: "'Open Sans', sans-serif",
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <LayoutIcon />
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--osmos-fg)', margin: 0 }}>Ad Format Setup</h1>
        <p style={{ fontSize: 14, color: 'var(--osmos-fg-muted)', margin: 0 }}>Ad format configurations will appear here.</p>
      </div>
    </div>
  );
}
