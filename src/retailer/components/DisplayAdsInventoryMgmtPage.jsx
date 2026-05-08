import React, { useState, useRef, useEffect } from 'react';
import { EditIcon, InfoIcon, RefreshIcon } from '../../ui/atoms/Icon';
import { Toast, useToast } from '../../ui/atoms/Toast';

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PAGE_DATA = [
  { name: 'Copy of TestQA98',          apiId: 'home_pg',   tag: 'New tag', impressions: 309, usedBy: 2 },
  { name: 'TestQA98',                  apiId: 'Everyone',  tag: 'New tag', impressions: 0,   usedBy: 1 },
  { name: 'Copy of TestQA97',          apiId: 'Purpose',   tag: 'New tag', impressions: 318, usedBy: 0 },
  { name: 'TestQA97',                  apiId: 'Purpose',   tag: 'New tag', impressions: 303, usedBy: 3 },
  { name: 'Copy of TestQA91',          apiId: 'Purpose',   tag: 'New tag', impressions: 281, usedBy: 1 },
  { name: 'TestQA91',                  apiId: 'Purpose',   tag: 'New tag', impressions: 307, usedBy: 2 },
  { name: 'Copy of TestQA80',          apiId: 'Purpose',   tag: 'New tag', impressions: 302, usedBy: 0 },
  { name: 'TestQA80',                  apiId: 'Purpose',   tag: 'New tag', impressions: 302, usedBy: 4 },
  { name: 'Highest Shopper',           apiId: 'Everyone',  tag: 'New tag', impressions: 306, usedBy: 1 },
  { name: 'No Spends in last 30 days', apiId: 'Everyone',  tag: 'New tag', impressions: 305, usedBy: 2 },
  { name: 'Paper Mario',               apiId: 'Everyone',  tag: 'New tag', impressions: 305, usedBy: 0 },
  { name: 'Most Brands',               apiId: 'Everyone',  tag: 'New tag', impressions: 305, usedBy: 1 },
];

const INVENTORY_DATA = [
  { name: 'new Merchant incentive',              impressions: 0 },
  { name: 'Merchant Management',                 impressions: 0 },
  { name: 'Add Signup amount',                   impressions: 0 },
  { name: 'Get 10% incentive on first purchase', impressions: 0 },
  { name: 'Get incentive to all Merchants',      impressions: 0 },
  { name: 'Add fixed incentive on wallet',       impressions: 0 },
  { name: 'Add Wallet Balance',                  impressions: 0 },
  { name: 'onboarding incentives',               impressions: 0 },
  { name: 'Modify Wallet Balance',               impressions: 0 },
  { name: 'Demo Incentive',                      impressions: 0 },
];

const ADVANCE_SETTINGS = [
  { key: 'productCatalog', label: 'Product Catalog Targeting', hasAssignUrl: false },
  { key: 'keyword',        label: 'Keyword Targeting',         hasAssignUrl: false },
  { key: 'custom1',        label: 'Custom Targeting',          hasAssignUrl: false },
  { key: 'custom2',        label: 'Custom Targeting',          hasAssignUrl: true  },
  { key: 'audience',       label: 'Audience Targeting',        hasAssignUrl: true  },
];

const TABS = ['Page Setup', 'Inventory Setup'];
const TAB_IDS = { 'Page Setup': 'tab-page-setup', 'Inventory Setup': 'tab-inventory-setup' };
const PANEL_IDS = { 'Page Setup': 'panel-page-setup', 'Inventory Setup': 'panel-inventory-setup' };

// ── Shared Styles ─────────────────────────────────────────────────────────────

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

// ── Toggle (role=switch, keyboard-accessible) ─────────────────────────────────

function Toggle({ on, onChange, label }) {
  return (
    <div
      role="switch"
      aria-checked={on}
      aria-label={label}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); }
      }}
      style={{
        width: 32, height: 18, borderRadius: 9,
        background: on ? 'var(--osmos-brand-primary)' : 'var(--osmos-border)',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        transition: 'background 0.2s',
      }}
    >
      <div style={{
        width: 14, height: 14, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 2, left: on ? 15 : 2,
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}

// ── Focus Trap Hook ───────────────────────────────────────────────────────────

function useFocusTrap(isOpen, containerRef, onEscape) {
  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const el = containerRef.current;
    const getFocusable = () => Array.from(el.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role="switch"], [tabindex]:not([tabindex="-1"])'
    ));

    // Move focus into modal on open
    const focusable = getFocusable();
    focusable[0]?.focus();

    const handleKey = e => {
      if (e.key === 'Escape') { onEscape(); return; }
      if (e.key !== 'Tab') return;
      const els = getFocusable();
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps
}

// ── Page Setup Tab ────────────────────────────────────────────────────────────

function PageSetupTab({ showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [form, setForm] = useState({ name: '', tags: '', apiId: '' });
  const [toggles, setToggles] = useState({ productCatalog: false, keyword: false, custom1: false, custom2: false, audience: false });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
    triggerRef.current?.focus();
  };

  useFocusTrap(modalOpen, modalRef, closeModal);

  const handleCreate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.apiId.trim()) errs.apiId = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setModalOpen(false);
    setForm({ name: '', tags: '', apiId: '' });
    showToast('Page created successfully');
    triggerRef.current?.focus();
  };

  return (
    <>
      {/* Toolbar */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--osmos-border)' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 13, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>
          <RefreshIcon size={13} color="var(--osmos-brand-primary)" /> Change Log
        </button>
        <button ref={triggerRef} onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
          + Create New Page
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="page-modal-title"
            style={{ background: '#fff', borderRadius: 12, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: "'Open Sans', sans-serif" }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--osmos-border)' }}>
              <span id="page-modal-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--osmos-fg)' }}>Create New Page</span>
              <button aria-label="Close" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-fg-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            {/* form wrapper enables Enter-to-submit from any input */}
            <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)', marginBottom: 12 }}>Page Details</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div>
                      <label htmlFor="page-name" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Name *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="page-name"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value.slice(0, 30) }))}
                          aria-required="true"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? 'page-name-error' : undefined}
                          style={{ width: '100%', padding: '8px 50px 8px 10px', border: `1px solid ${errors.name ? '#EF4444' : 'var(--osmos-border)'}`, borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }}
                        />
                        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--osmos-fg-subtle)' }}>{form.name.length}/30</span>
                      </div>
                      {errors.name && <span id="page-name-error" role="alert" style={{ fontSize: 11, color: '#EF4444', marginTop: 3, display: 'block' }}>This field is required</span>}
                    </div>
                    <div>
                      <label htmlFor="page-tags" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Tags</label>
                      <input
                        id="page-tags"
                        value={form.tags}
                        onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                        style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }}
                      />
                    </div>
                    <div>
                      <label htmlFor="page-api-id" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>API Identifier *</label>
                      <input
                        id="page-api-id"
                        value={form.apiId}
                        onChange={e => setForm(f => ({ ...f, apiId: e.target.value }))}
                        aria-required="true"
                        aria-invalid={!!errors.apiId}
                        aria-describedby={errors.apiId ? 'page-api-error' : undefined}
                        style={{ width: '100%', padding: '8px 10px', border: `1px solid ${errors.apiId ? '#EF4444' : 'var(--osmos-border)'}`, borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }}
                      />
                      {errors.apiId && <span id="page-api-error" role="alert" style={{ fontSize: 11, color: '#EF4444', marginTop: 3, display: 'block' }}>This field is required</span>}
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)', marginBottom: 12 }}>Advance Settings</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {ADVANCE_SETTINGS.map(s => (
                      <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--osmos-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--osmos-fg)' }}>
                          {s.label} <InfoIcon size={13} color="var(--osmos-fg-subtle)" />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          {s.hasAssignUrl && toggles[s.key] && (
                            <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 12, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>Assign URL</button>
                          )}
                          <Toggle
                            on={toggles[s.key]}
                            onChange={() => setToggles(t => ({ ...t, [s.key]: !t[s.key] }))}
                            label={s.label}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--osmos-border)', textAlign: 'center' }}>
                <button type="submit" style={{ background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Inventory Setup Tab ───────────────────────────────────────────────────────

function InventorySetupTab({ showToast }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [form, setForm] = useState({ inventoryName: '', inventoryPositions: '', apiIdentifier: '' });
  const [formError, setFormError] = useState(false);
  const modalRef = useRef(null);
  const triggerRef = useRef(null);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setFormError(false);
    triggerRef.current?.focus();
  };

  useFocusTrap(modalOpen, modalRef, closeModal);

  const handleCreate = () => {
    if (!form.inventoryName.trim() || !form.inventoryPositions || !form.apiIdentifier) {
      setFormError(true); return;
    }
    setFormError(false);
    setModalOpen(false);
    setForm({ inventoryName: '', inventoryPositions: '', apiIdentifier: '' });
    showToast('Inventory has been created Successfully');
    triggerRef.current?.focus();
  };

  return (
    <>
      {/* Toolbar */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--osmos-border)' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 13, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>
          <RefreshIcon size={13} color="var(--osmos-brand-primary)" /> Change Log
        </button>
        <button ref={triggerRef} onClick={openModal} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
          + Create Inventory
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
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="inv-modal-title"
            style={{ background: '#fff', borderRadius: 12, width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: "'Open Sans', sans-serif" }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--osmos-border)' }}>
              <span id="inv-modal-title" style={{ fontSize: 16, fontWeight: 700, color: 'var(--osmos-fg)' }}>Create New Inventory</span>
              <button aria-label="Close" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-fg-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label htmlFor="inv-name" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Inventory Name *</label>
                  <input
                    id="inv-name"
                    value={form.inventoryName}
                    onChange={e => setForm(f => ({ ...f, inventoryName: e.target.value }))}
                    aria-required="true"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }}
                  />
                </div>
                <div>
                  <label htmlFor="inv-position" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Select Inventory Positions *</label>
                  <select
                    id="inv-position"
                    value={form.inventoryPositions}
                    onChange={e => setForm(f => ({ ...f, inventoryPositions: e.target.value }))}
                    aria-required="true"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: form.inventoryPositions ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)', background: '#fff' }}
                  >
                    <option value="">Please Select Inventory Positions</option>
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="inv-api-id" style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Select API Identifier *</label>
                  <select
                    id="inv-api-id"
                    value={form.apiIdentifier}
                    onChange={e => setForm(f => ({ ...f, apiIdentifier: e.target.value }))}
                    aria-required="true"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: form.apiIdentifier ? 'var(--osmos-fg)' : 'var(--osmos-fg-subtle)', background: '#fff' }}
                  >
                    <option value="">Please Select API Identifier</option>
                    <option value="home_pg">home_pg</option>
                    <option value="category_pg">category_pg</option>
                    <option value="search_pg">search_pg</option>
                  </select>
                </div>
                {formError && (
                  <div role="alert" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6, padding: '10px 14px', fontSize: 12, color: '#EF4444' }}>
                    Some of the fields are incomplete or invalid
                  </div>
                )}
              </div>
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--osmos-border)', textAlign: 'center' }}>
                <button type="submit" style={{ background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DisplayAdsInventoryMgmtPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { toast, showToast } = useToast();

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: 'var(--osmos-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Tab bar */}
      <div role="tablist" aria-label="Inventory Management sections" style={{ display: 'flex', borderBottom: '1px solid var(--osmos-border)', paddingLeft: 20, background: 'var(--osmos-bg)', flexShrink: 0 }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              id={TAB_IDS[tab]}
              role="tab"
              aria-selected={isActive}
              aria-controls={PANEL_IDS[tab]}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', border: 'none',
                borderBottom: isActive ? '2px solid var(--osmos-brand-primary)' : '2px solid transparent',
                background: 'transparent', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
                fontSize: 13, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--osmos-brand-primary)' : 'var(--osmos-fg-muted)',
                marginBottom: -1, transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {TABS.map(tab => (
        <div
          key={tab}
          id={PANEL_IDS[tab]}
          role="tabpanel"
          aria-labelledby={TAB_IDS[tab]}
          hidden={activeTab !== tab}
          style={{ flex: 1 }}
        >
          {tab === 'Page Setup'      && <PageSetupTab showToast={showToast} />}
          {tab === 'Inventory Setup' && <InventorySetupTab showToast={showToast} />}
        </div>
      ))}

      <Toast {...toast} />
    </div>
  );
}
