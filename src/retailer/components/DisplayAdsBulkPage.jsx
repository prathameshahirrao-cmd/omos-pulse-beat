import React, { useState, useRef } from 'react';
import { Icon, DownloadIcon } from '../../ui/atoms/Icon';
import { Toast, useToast } from '../../ui/atoms/Toast';

const TABS = ['Create Campaign', 'Update Campaign', 'Inventory Level Bid Customization'];

const HOW_IT_WORKS = {
  'Update Campaign': [
    'Click on the "Download file for all merchants". This file will contain all campaign settings for all your merchants.',
    'Change the settings for the campaign you want to update.',
    'Save your file and upload it back to the platform.',
  ],
  'Inventory Level Bid Customization': [
    'Click on the "Download file for all merchants". This file will contain inventory bid customizations for all your merchants.',
    'Update the bid values for the inventory items you want to customize.',
    'Save your file and upload it back to the platform.',
  ],
};

const CloudUploadIcon = () => (
  <Icon size={48} color="var(--osmos-fg-subtle)" strokeWidth={1.25}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </Icon>
);

function StepNumber({ number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 32, height: 32, borderRadius: '50%',
      border: '1px solid var(--osmos-border)', fontSize: 20, fontWeight: 400,
      color: 'var(--osmos-fg)', flexShrink: 0,
      fontFamily: "'Open Sans', sans-serif", background: 'transparent',
    }}>
      {number}
    </span>
  );
}

function UploadCard({ onUpload }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={e => { e.preventDefault(); setDragging(false); onUpload(); }}
      style={{
        width: '100%', height: 300,
        border: `1.5px dashed ${dragging ? 'var(--osmos-brand-primary)' : '#d0d0d0'}`,
        borderRadius: 8, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        background: dragging ? 'var(--osmos-brand-primary-muted)' : '#fff',
        transition: 'border-color 0.15s, background 0.15s', boxSizing: 'border-box',
      }}
    >
      <CloudUploadIcon />
      <span style={{ fontSize: 15, color: 'var(--osmos-fg)', fontFamily: "'Open Sans', sans-serif", marginTop: 12 }}>
        Upload .xlsx file with details
      </span>
      <input ref={inputRef} type="file" accept=".xlsx" style={{ display: 'none' }} onChange={() => onUpload()} />
    </div>
  );
}

function HowItWorks({ points }) {
  return (
    <div style={{ background: 'var(--osmos-bg-subtle)', borderRadius: 8, padding: 16, marginTop: 16 }}>
      <p style={{ margin: '0 0 10px 0', fontWeight: 700, fontSize: 13, color: 'var(--osmos-fg)', fontFamily: "'Open Sans', sans-serif" }}>
        How it works?
      </p>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {points.map((point, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--osmos-fg-muted)', fontFamily: "'Open Sans', sans-serif", lineHeight: 1.6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--osmos-fg-muted)', flexShrink: 0, marginTop: 6 }} />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}

function TabContent({ tab, onUpload }) {
  const isCreate = tab === 'Create Campaign';
  const step1Label = isCreate ? 'Download Sample File' : 'Download file for all merchants';
  const howItWorksPoints = HOW_IT_WORKS[tab] || null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <StepNumber number={1} />
        <a href="#" onClick={e => e.preventDefault()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--osmos-brand-primary)', fontFamily: "'Open Sans', sans-serif", textDecoration: 'none' }}>
          <DownloadIcon size={14} />
          {step1Label}
        </a>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
        <StepNumber number={2} />
        <div style={{ flex: 1 }}>
          <UploadCard onUpload={onUpload} />
          {howItWorksPoints && <HowItWorks points={howItWorksPoints} />}
        </div>
      </div>
    </div>
  );
}

export default function DisplayAdsBulkPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { toast, showToast } = useToast();
  return (
    <div style={{ padding: 40, background: 'var(--osmos-bg)', minHeight: '100vh', fontFamily: "'Open Sans', sans-serif", boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--osmos-border)', marginBottom: 40, gap: 0 }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab;
          return (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '10px 20px', border: 'none',
              borderBottom: isActive ? '2px solid var(--osmos-brand-primary)' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', fontFamily: "'Open Sans', sans-serif",
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--osmos-brand-primary)' : 'var(--osmos-fg-muted)',
              marginBottom: -1, transition: 'color 0.15s, border-color 0.15s', whiteSpace: 'nowrap',
            }}>
              {tab}
            </button>
          );
        })}
      </div>
      <TabContent tab={activeTab} onUpload={() => showToast('File uploaded successfully')} />
      <Toast {...toast} />
    </div>
  );
}
