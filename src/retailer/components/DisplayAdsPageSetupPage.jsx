import React, { useState } from 'react';
import { EditIcon, InfoIcon, RefreshIcon } from '../../ui/atoms/Icon';
import { Toast, useToast } from '../../ui/atoms/Toast';

const PAGE_DATA = [
  { name: 'Copy of TestQA98', apiId: 'home_pg',   tag: 'New tag', impressions: 309, usedBy: 2 },
  { name: 'TestQA98',         apiId: 'Everyone',  tag: 'New tag', impressions: 0,   usedBy: 1 },
  { name: 'Copy of TestQA97', apiId: 'Purpose',   tag: 'New tag', impressions: 318, usedBy: 0 },
  { name: 'TestQA97',         apiId: 'Purpose',   tag: 'New tag', impressions: 303, usedBy: 3 },
  { name: 'Copy of TestQA91', apiId: 'Purpose',   tag: 'New tag', impressions: 281, usedBy: 1 },
  { name: 'TestQA91',         apiId: 'Purpose',   tag: 'New tag', impressions: 307, usedBy: 2 },
  { name: 'Copy of TestQA80', apiId: 'Purpose',   tag: 'New tag', impressions: 302, usedBy: 0 },
  { name: 'TestQA80',         apiId: 'Purpose',   tag: 'New tag', impressions: 302, usedBy: 4 },
  { name: 'Highest Shopper',  apiId: 'Everyone',  tag: 'New tag', impressions: 306, usedBy: 1 },
  { name: 'No Spends in last 30 days', apiId: 'Everyone', tag: 'New tag', impressions: 305, usedBy: 2 },
  { name: 'Paper Mario',      apiId: 'Everyone',  tag: 'New tag', impressions: 305, usedBy: 0 },
  { name: 'Most Brands',      apiId: 'Everyone',  tag: 'New tag', impressions: 305, usedBy: 1 },
];

const ADVANCE_SETTINGS = [
  { key: 'productCatalog',  label: 'Product Catalog Targeting', hasAssignUrl: false },
  { key: 'keyword',         label: 'Keyword Targeting',         hasAssignUrl: false },
  { key: 'custom1',         label: 'Custom Targeting',          hasAssignUrl: false },
  { key: 'custom2',         label: 'Custom Targeting',          hasAssignUrl: true  },
  { key: 'audience',        label: 'Audience Targeting',        hasAssignUrl: true  },
];

function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 32, height: 18, borderRadius: 9,
      background: on ? 'var(--osmos-brand-primary)' : 'var(--osmos-border)',
      position: 'relative', cursor: 'pointer', flexShrink: 0,
      transition: 'background 0.2s',
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2,
        left: on ? 15 : 2,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}

export default function DisplayAdsPageSetupPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [form, setForm] = useState({ name: '', tags: '', apiId: '' });
  const [toggles, setToggles] = useState({ productCatalog: false, keyword: false, custom1: false, custom2: false, audience: false });
  const [errors, setErrors] = useState({});
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
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.apiId.trim()) errs.apiId = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setModalOpen(false);
    setForm({ name: '', tags: '', apiId: '' });
    showToast('Page created successfully');
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
          + Create New Page
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Open Sans', sans-serif" }}>
          <thead>
            <tr>
              <th style={thStyle}>Page Name</th>
              <th style={thStyle}>API Identifier</th>
              <th style={thStyle}>Tags</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Estimated Daily Impressions</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Used by Inventories</th>
              <th style={{ ...thStyle, width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {PAGE_DATA.map((row, i) => (
              <tr key={i} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === i ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>
                <td style={{ ...tdStyle, color: 'var(--osmos-fg)', fontWeight: 500 }}>{row.name}</td>
                <td style={tdStyle}>{row.apiId}</td>
                <td style={tdStyle}>
                  <span style={{ background: 'var(--osmos-brand-primary-muted)', color: 'var(--osmos-brand-primary)', borderRadius: 4, padding: '2px 8px', fontSize: 11, fontWeight: 500 }}>
                    {row.tag}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{row.impressions}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{row.usedBy}</td>
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
          <div style={{ background: '#fff', borderRadius: 12, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: "'Open Sans', sans-serif" }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--osmos-border)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--osmos-fg)' }}>Create New Page</span>
              <button onClick={() => { setModalOpen(false); setErrors({}); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-fg-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Page Details */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)', marginBottom: 12 }}>Page Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Name */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Name *</label>
                    <div style={{ position: 'relative' }}>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value.slice(0, 30) }))}
                        style={{ width: '100%', padding: '8px 50px 8px 10px', border: `1px solid ${errors.name ? '#EF4444' : 'var(--osmos-border)'}`, borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--osmos-fg-subtle)' }}>{form.name.length}/30</span>
                    </div>
                    {errors.name && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3, display: 'block' }}>& Show error validation here</span>}
                  </div>
                  {/* Tags */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Tags</label>
                    <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
                  </div>
                  {/* API Identifier */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>API Identifier *</label>
                    <input value={form.apiId} onChange={e => setForm(f => ({ ...f, apiId: e.target.value }))}
                      style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.apiId ? '#EF4444' : 'var(--osmos-border)'}`, borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
                    {errors.apiId && <span style={{ fontSize: 11, color: '#EF4444', marginTop: 3, display: 'block' }}>& Show error validation here</span>}
                  </div>
                </div>
              </div>

              {/* Advance Settings */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)', marginBottom: 12 }}>Advance Settings</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {ADVANCE_SETTINGS.map(s => (
                    <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--osmos-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--osmos-fg)' }}>
                        {s.label}
                        <InfoIcon size={13} color="var(--osmos-fg-subtle)" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {s.hasAssignUrl && toggles[s.key] && (
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>
                            Assign URL
                          </button>
                        )}
                        <Toggle on={toggles[s.key]} onChange={() => setToggles(t => ({ ...t, [s.key]: !t[s.key] }))} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
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
