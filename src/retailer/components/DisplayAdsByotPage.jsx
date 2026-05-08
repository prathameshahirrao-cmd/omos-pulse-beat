import React, { useState } from 'react';
import { TrashIcon, RefreshIcon, InfoIcon } from '../../ui/atoms/Icon';
import { Toast, useToast } from '../../ui/atoms/Toast';

const KEY_DATA = [
  { keyName: 'Location',        apiId: 'Locations',   numValues: 1 },
  { keyName: 'Services',        apiId: 'Services',    numValues: 2 },
  { keyName: 'Category5162736', apiId: 'Development', numValues: 3 },
  { keyName: 'Test Category',   apiId: 'Consulting',  numValues: 4 },
  { keyName: 'Houston',         apiId: 'Support',     numValues: 5 },
];

export default function DisplayAdsByotPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [keyName, setKeyName] = useState('');
  const [apiId, setApiId] = useState('');
  const [valueInput, setValueInput] = useState('');
  const [valuesList, setValuesList] = useState([]);
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

  const handleAddValue = () => {
    if (!valueInput.trim()) return;
    setValuesList(v => [...v, valueInput.trim()]);
    setValueInput('');
  };

  const handleSave = () => {
    setDrawerOpen(false);
    setKeyName('');
    setApiId('');
    setValueInput('');
    setValuesList([]);
    showToast('Key saved successfully');
  };

  return (
    <div style={{ fontFamily: "'Open Sans', sans-serif", background: 'var(--osmos-bg)', minHeight: '100vh' }}>
      {/* Toolbar */}
      <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--osmos-border)' }}>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-brand-primary)', fontSize: 13, fontFamily: "'Open Sans', sans-serif", fontWeight: 500 }}>
          <RefreshIcon size={13} color="var(--osmos-brand-primary)" /> Change Log
        </button>
        <button onClick={() => setDrawerOpen(true)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'var(--osmos-brand-primary)', color: '#fff',
          border: 'none', borderRadius: 6, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
        }}>
          + Create Key
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={thStyle}>Key Name</th>
              <th style={thStyle}>API Identifier</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>No. of Values</th>
              <th style={{ ...thStyle, width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {KEY_DATA.map((row, i) => (
              <tr key={i} onMouseEnter={() => setHoveredRow(i)} onMouseLeave={() => setHoveredRow(null)}
                style={{ background: hoveredRow === i ? 'var(--osmos-bg-subtle)' : 'var(--osmos-bg)' }}>
                <td style={{ ...tdStyle, color: 'var(--osmos-brand-primary)', fontWeight: 500, cursor: 'pointer' }}>{row.keyName}</td>
                <td style={tdStyle}>{row.apiId}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>{row.numValues}</td>
                <td style={{ ...tdStyle, textAlign: 'center', opacity: hoveredRow === i ? 1 : 0 }}>
                  <TrashIcon size={14} color="var(--osmos-fg-muted)" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Key Modal */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#fff', borderRadius: 12, width: 520, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: "'Open Sans', sans-serif" }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--osmos-border)' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--osmos-fg)' }}>Create Key</span>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--osmos-fg-muted)', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Section 1 – Key Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--osmos-brand-primary)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)' }}>Key Details</span>
                  <InfoIcon size={13} color="var(--osmos-fg-subtle)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Key Name */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Key Name *</label>
                    <div style={{ position: 'relative' }}>
                      <input value={keyName} onChange={e => setKeyName(e.target.value.slice(0, 8))} placeholder="Enter Key Name"
                        style={{ width: '100%', padding: '8px 50px 8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
                      <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: 'var(--osmos-fg-subtle)' }}>{keyName.length}/8</span>
                    </div>
                  </div>
                  {/* API Identifier */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>API Identifier *</label>
                    <input value={apiId} onChange={e => setApiId(e.target.value)} placeholder="Enter API Identifier"
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', color: 'var(--osmos-fg)' }} />
                    <span style={{ fontSize: 11, color: 'var(--osmos-fg-subtle)', marginTop: 4, display: 'block' }}>
                      Please note that some special signs are not allowed in API Identifier.{' '}
                      <span style={{ color: 'var(--osmos-brand-primary)', cursor: 'pointer' }}>Learn more</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2 – Values */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--osmos-brand-primary)', color: '#fff', fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--osmos-fg)' }}>Values</span>
                  <InfoIcon size={13} color="var(--osmos-fg-subtle)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--osmos-fg)', display: 'block', marginBottom: 4 }}>Enter Value *</label>
                    <textarea value={valueInput} onChange={e => setValueInput(e.target.value)} placeholder="Enter here"
                      rows={3}
                      style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--osmos-border)', borderRadius: 6, fontSize: 13, fontFamily: "'Open Sans', sans-serif", outline: 'none', boxSizing: 'border-box', resize: 'vertical', color: 'var(--osmos-fg)' }} />
                    <span style={{ fontSize: 11, color: 'var(--osmos-fg-subtle)', display: 'block', marginTop: 4 }}>
                      Please note that the value you input must not consist of the following characters: @ # ! * &amp; ( )
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button onClick={handleAddValue} style={{ background: 'none', border: '1px solid var(--osmos-border)', borderRadius: 6, padding: '6px 16px', fontSize: 13, fontFamily: "'Open Sans', sans-serif", cursor: 'pointer', color: 'var(--osmos-fg)', fontWeight: 500 }}>
                      Add Value
                    </button>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--osmos-fg)', marginBottom: 2 }}>Value Added ({valuesList.length})</div>
                    <div style={{ fontSize: 11, color: 'var(--osmos-fg-subtle)', marginBottom: 8 }}>You can add a max of 100 values for this key.</div>
                    {valuesList.length > 0 ? (
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                        <thead>
                          <tr>
                            <th style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--osmos-fg-muted)', borderBottom: '1px solid var(--osmos-border)', fontWeight: 600 }}>Sr. No</th>
                            <th style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--osmos-fg-muted)', borderBottom: '1px solid var(--osmos-border)', fontWeight: 600 }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {valuesList.map((v, i) => (
                            <tr key={i}>
                              <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--osmos-border)', color: 'var(--osmos-fg-muted)' }}>{i + 1}</td>
                              <td style={{ padding: '6px 10px', borderBottom: '1px solid var(--osmos-border)', color: 'var(--osmos-fg)' }}>{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div style={{ background: 'var(--osmos-bg-subtle)', borderRadius: 6, padding: '16px 10px', textAlign: 'center', color: 'var(--osmos-fg-subtle)', fontSize: 12 }}>
                        No values added yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid var(--osmos-border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} style={{ background: 'var(--osmos-brand-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '9px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Open Sans', sans-serif" }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast {...toast} />
    </div>
  );
}
