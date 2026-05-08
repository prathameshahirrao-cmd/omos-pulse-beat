import React, { useState } from 'react';
import { EditIcon, RefreshIcon } from '../../ui/atoms/Icon';
import { Toast, useToast } from '../../ui/atoms/Toast';

const INVENTORY_DATA = [
  { name: 'new Merchant incentive',            impressions: 0 },
  { name: 'Merchant Management',               impressions: 0 },
  { name: 'Add Signup amount',                 impressions: 0 },
  { name: 'Get 10% incentive on first purchase', impressions: 0 },
  { name: 'Get incentive to all Merchants',    impressions: 0 },
  { name: 'Add fixed incentive on wallet',     impressions: 0 },
  { name: 'Add Wallet Balance',                impressions: 0 },
  { name: 'onboarding incentives',             impressions: 0 },
  { name: 'Modify Wallet Balance',             impressions: 0 },
  { name: 'Demo Incentive',                    impressions: 0 },
];

export default function DisplayAdsInventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [form, setForm] = useState({ inventoryName: '', inventoryPositions: '', apiIdentifier: '' });
  const [formError, setFormError] = useState(false);
  const { toast, showToast } = useToast();

  const thStyle = {
    padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700,
    color: 'var(--osmos-fg-muted)', borderBottom: '1px solid var(--osmos-border)',
    background: 'var(--osmos-bg-subtle)', whiteSpace: 'nowrap',
    fontFamily: "'Open Sans', sans-serif",
  };
  const tdStyle = {
    padding: '10px 14px', fontSize: 13, color: 'var(--osmos-fg-muted)',
    borderBottom: '1px solid var(--osmos-border)', fontFamily: "'Open Sans', sans-serif",
    verticalAlign: 'middle',
  };

  const handleCreate = () => {
    if (!form.inventoryName.trim() || !form.inventoryPositions || !form.apiIdentifier) {
      setFormError(true);
      return;
    }
    setFormError(false);
    setModalOpen(false);
    setForm({ inventoryName: '', inventoryPositions: '', apiIdentifier: '' });
    showToast('Inventory has been created Successfully');
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: 'var(--osmos-bg)', minHeight: '100vh' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--osmos-border)' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 13, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>
          <RefreshIcon size={13} color="var(--osmos-brand-primary)" /> Change Log
        </button>
        <button onClick={() => setModalOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--osmos-brand-primary)', color: '#fff',
          border: 'none', borderRadius: 6, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
        }}>
          + Create Campaign
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Inventory Name</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Est. Daily Impressions (Last 30 days)</th>
              <th style={{ ...thStyle, width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {INVENTORY_DATA.map((row, i) => (
              <tr key={i} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === i ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>
                <td style={{ ...tdStyle, color: 'var(--osmos-fg)', fontWeight: 500 }}>{row.name}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{row.impressions}</td>
                <td style={{ ...tdStyle, textAlign: 'center', opacity: hoveredRow === i ? 1 : 0 }}>
                  <EditIcon size={14} color="var(--osmos-fg-muted)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: "'Open Sans', sans-serif" }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--osmos-border)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--osmos-fg)' }}>Create New Page</span>
              <button onClick={() => { setModalOpen(false); setFormError(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-fg-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Inventory Name */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Inventory Name *</label>
                <input value={form.inventoryName} onChange={e => setForm(f => ({ ...f, inventoryName: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
              </div>
              {/* Inventory Positions */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Select Inventory Positions *</label>
                <select value={form.inventoryPositions} onChange={e => setForm(f => ({ ...f, inventoryPositions: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: form.inventoryPositions ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)', background: '#fff' }}>
                  <option value="">Please Select Inventory Positions</option>
                  <option value="top">Top</option>
                  <option value="middle">Middle</option>
                  <option value="bottom">Bottom</option>
                </select>
              </div>
              {/* API Identifier */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Select API Identifier *</label>
                <select value={form.apiIdentifier} onChange={e => setForm(f => ({ ...f, apiIdentifier: e.target.value }))}
                  style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: form.apiIdentifier ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)', background: '#fff' }}>
                  <option value="">Please Select API Identifier</option>
                  <option value="home_pg">home_pg</option>
                  <option value="category_pg">category_pg</option>
                  <option value="search_pg">search_pg</option>
                </select>
              </div>
              {formError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#EF4444' }}>
                  Some of the fields are incomplete or invalid
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--osmos-border)', textAlign: 'center' }}>
              <button onClick={handleCreate} style={{ background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
  );
}
