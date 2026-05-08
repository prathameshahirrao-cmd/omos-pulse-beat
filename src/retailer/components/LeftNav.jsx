import React, { useState } from 'react';
import { NavShell, OsmosLogoMark } from '../../ui';

/* ── Nav data ─────────────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    ),
    subnav: [],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: (
      <>
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </>
    ),
    subnav: [
      { id: 'demand-supply',       label: 'Demand & Supply' },
      { id: 'live-insights',       label: 'Live Insights' },
      { id: 'advertiser-insights', label: 'Advertiser Insights', active: true },
      { id: 'scheduled-reports',   label: 'Scheduled Reports' },
      { id: 'bu-analytics',        label: 'BU Analytics' },
    ],
  },
  {
    id: 'health',
    label: 'Health',
    icon: (
      <>
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </>
    ),
    subnav: [
      { id: 'overview', label: 'Overview' },
      { id: 'budget-health', label: 'Budget Health' },
      { id: 'delivery-health', label: 'Delivery Health' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: (
      <>
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </>
    ),
    subnav: [
      { id: 'finance-dashboard',    label: 'Finance Dashboard' },
      { id: 'wallet-topup',         label: 'Wallet Top Up' },
      { id: 'finance-advertisers',  label: 'Advertiser Management' },
    ],
  },
  {
    id: 'control-center',
    label: 'Control Center',
    icon: (
      <>
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41"/>
      </>
    ),
    subnav: [
      // ── Advertiser Management
      { id: 'advertisers',                   label: 'Advertisers',                              group: 'Advertiser Management' },
      { id: 'persona-config',                label: 'Persona Configuration',                    group: 'Advertiser Management' },
      // ── Product Catalog Management (top-level direct link, no group)
      { id: 'product-catalog',               label: 'Product Catalog Management' },
      // ── Audience Manager
      { id: 'manage-segments',               label: 'Manage Segments',                         group: 'Audience Manager' },
      { id: 'manage-attributes',             label: 'Manage Attributes',                        group: 'Audience Manager' },
      { id: 'attribute-targeting',           label: 'Manage Activity Targeting',                group: 'Audience Manager' },
      { id: 'manage-cpm-rules',              label: 'Manage CPM/CPC Rules',                     group: 'Audience Manager' },
      // ── User Access Management
      { id: 'super-admin',                   label: 'Super Admin users',                        group: 'User Access Management' },
      { id: 'ops-users',                     label: 'Ops User',                                 group: 'User Access Management' },
      { id: 'advertiser-users',              label: 'Advertiser Users',                         group: 'User Access Management' },
      { id: 'account-manager-mapping',       label: 'Advertiser Account Manager Mapping',       group: 'User Access Management' },
      // ── Advertiser Settings
      { id: 'segment-manager',               label: 'Segment Manager',                          group: 'Advertiser Settings' },
      // ── Automated Rules
      { id: 'wallet-rules',                  label: 'Wallet Rules',                             group: 'Automated Rules' },
      // ── Develop Settings
      { id: 'setup-details',                 label: 'Setup Details',                            group: 'Develop Settings' },
      { id: 'debug-console',                 label: 'Event Debugging',                          group: 'Develop Settings' },
      // ── Activity Log
      { id: 'event-logs',                    label: 'Event Logs',                               group: 'Activity Log' },
      { id: 'product-ads-request-logs',      label: 'Product Ads Request Logs',                 group: 'Activity Log' },
      { id: 'display-ads-request-logs',      label: 'Display Ads Request Logs',                 group: 'Activity Log' },
    ],
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </>
    ),
    subnav: [
      { id: 'app-store', label: 'App Store' },
      { id: 'integrations', label: 'Integrations' },
    ],
  },
  {
    id: 'product-ads',
    label: 'Product Ads',
    dividerBefore: true,
    icon: (
      <>
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </>
    ),
    subnav: [
      { id: 'product-ads-analytics',    label: 'Ad Server Analytics',    group: 'Analytics' },
      { id: 'product-ads-demand-supply', label: 'Demand & Supply',        group: 'Analytics' },
      { id: 'product-ads-live',         label: 'Live Insights',           group: 'Analytics' },
      { id: 'product-ads-yield',        label: 'CPC Yield Control',       group: 'Campaign Management' },
      { id: 'product-ads-yield-cpm',    label: 'CPM Yield Control',       group: 'Campaign Management' },
      { id: 'product-ads-keyword',      label: 'Keyword Bid Settings',    group: 'Campaign Management' },
      { id: 'product-ads-bulk',         label: 'Campaign Bulk Actions',   group: 'Campaign Management' },
    ],
  },
  {
    id: 'sponsored-ads',
    label: 'Sponsored Ads',
    icon: (
      <>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </>
    ),
    subnav: [
      { id: 'sponsored-ads-analytics',    label: 'Ad Server Analytics', group: 'Analytics' },
      { id: 'sponsored-ads-demand-supply', label: 'Demand & Supply',     group: 'Analytics' },
      { id: 'sponsored-ads-live',         label: 'Live Analytics',       group: 'Analytics' },
      { id: 'sponsored-ads-campaigns',    label: 'Campaign Review',      group: 'Campaign Management' },
      { id: 'sponsored-ads-inventory',    label: 'Inventory Setup',      group: 'Setup' },
      { id: 'sponsored-ads-ad-format',    label: 'Ad Format Setup',      group: 'Setup' },
    ],
  },
  {
    id: 'display-ads',
    label: 'Display Ads',
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="9" y1="21" x2="9" y2="9"/>
      </>
    ),
    subnav: [
      { id: 'display-ads-analytics',    label: 'Ad Server Analytics',       group: 'Analytics' },
      { id: 'display-ads-demand-supply', label: 'Demand & Supply',           group: 'Analytics' },
      { id: 'display-ads-live',         label: 'Live Insights',              group: 'Analytics' },
      { id: 'display-ads-campaigns',    label: 'Campaign Review',            group: 'Campaign Management' },
      { id: 'display-ads-bulk',         label: 'Campaign Bulk Management',   group: 'Campaign Management' },
      { id: 'display-ads-inventory',    label: 'Inventory Management',       group: 'Setup' },
      { id: 'display-ads-ad-format',    label: 'Ad Format Setup',            group: 'Setup' },
    ],
  },
  {
    id: 'byot',
    label: 'BYOT',
    dividerBefore: true,
    icon: (
      <>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </>
    ),
    subnav: [
      { id: 'byot-config', label: 'Configuration' },
    ],
  },
];

const BOTTOM_NAV = [
  {
    id: 'support',
    label: 'Support',
    icon: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>,
  },
  {
    id: 'whats-new',
    label: "What's New",
    icon: <><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></>,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41"/></>,
  },
];

/* ── SVG icon helper ──────────────────────────────────────────── */
function Icon({ children, size = 18, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0 }}>
      {children}
    </svg>
  );
}

/* ── Sub-nav panel (pinned on click) ─────────────────────────── */
function SubNavPanel({ section, activePage, onClose, onPageChange }) {
  if (!section) return null;

  const activeItem = activePage ?? section?.subnav.find(i => i.active)?.id ?? section?.subnav[0]?.id;

  const groups = [];
  const seenGroups = new Set();
  if (section.subnav.some(i => i.group)) {
    section.subnav.forEach(item => {
      if (item.group && !seenGroups.has(item.group)) {
        seenGroups.add(item.group);
        groups.push({ label: item.group, items: section.subnav.filter(i => i.group === item.group) });
      }
    });
  }
  const ungrouped = section.subnav.filter(i => !i.group);

  return (
    <div style={{
      width: 220,
      background: 'var(--osmos-nav-panel-bg)',
      display: 'flex',
      flexDirection: 'column',
      borderLeft: '1px solid var(--osmos-nav-active-bg)',
      overflow: 'hidden',
    }}>
      {/* Panel header */}
      <div style={{
        padding: '20px 16px 12px',
        borderBottom: '1px solid var(--osmos-nav-active-bg)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 0.1 }}>
            {section.label}
          </span>
          <button onClick={onClose} aria-label="Close panel" style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.4)', padding: 2, borderRadius: 4,
          }}>
            <Icon size={16}>
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </Icon>
          </button>
        </div>
      </div>

      {/* Sub-nav items */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {ungrouped.map(item => (
          <SubNavItem key={item.id} item={item} active={activeItem === item.id}
            onClick={() => onPageChange?.(item.id)} />
        ))}
        {groups.map(group => {
          const headerItem = group.items.find(i => i.isGroupHeader);
          const subItems   = group.items.filter(i => !i.isGroupHeader);
          const isHdrActive = headerItem && activeItem === headerItem.id;
          return (
            <div key={group.label} style={{ marginBottom: 4 }}>
              {headerItem ? (
                <button
                  onClick={() => onPageChange?.(headerItem.id)}
                  style={{
                    width: '100%', textAlign: 'left',
                    padding: '8px 16px 4px',
                    background: isHdrActive ? 'var(--osmos-nav-active-bg)' : 'transparent',
                    border: 'none',
                    borderLeft: isHdrActive ? '3px solid var(--osmos-nav-accent)' : '3px solid transparent',
                    cursor: 'pointer',
                    fontSize: 10, fontWeight: 700,
                    color: isHdrActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                    textTransform: 'uppercase', letterSpacing: 0.8,
                    fontFamily: "'Open Sans', sans-serif",
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (!isHdrActive) e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}
                  onMouseLeave={e => { if (!isHdrActive) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
                >
                  {group.label}
                </button>
              ) : (
                <div style={{
                  padding: '8px 16px 4px',
                  fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.35)',
                  textTransform: 'uppercase', letterSpacing: 0.8,
                }}>
                  {group.label}
                </div>
              )}
              {subItems.map(item => (
                <SubNavItem key={item.id} item={item} active={activeItem === item.id}
                  onClick={() => onPageChange?.(item.id)} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubNavItem({ item, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left',
        padding: '8px 16px',
        background: active
          ? 'var(--osmos-nav-active-bg)'
          : hovered ? 'rgba(255,255,255,0.06)' : 'transparent',
        border: 'none',
        borderLeft: active ? '3px solid var(--osmos-nav-accent)' : '3px solid transparent',
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
        fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? '#fff' : 'rgba(255,255,255,0.6)',
        transition: 'all 0.15s',
      }}>
      {item.label}
    </button>
  );
}

/* ── Helpers ──────────────────────────────────────────────────── */
function findSectionId(pageId) {
  if (!pageId) return 'analytics';
  const direct = NAV_SECTIONS.find(s => s.id === pageId);
  if (direct) return direct.id;
  const parent = NAV_SECTIONS.find(s => s.subnav?.some(i => i.id === pageId));
  return parent?.id ?? 'analytics';
}


/* ── Root LeftNav ─────────────────────────────────────────────── */
export default function LeftNav({ activePage, onPageChange }) {
  const [activeSection, setActiveSection] = useState(() => findSectionId(activePage));
  const [expanded, setExpanded]           = useState(activePage !== 'home');

  const section      = NAV_SECTIONS.find(s => s.id === activeSection);
  const hasSubnav    = section?.subnav?.length > 0;
  const subnavPinned = expanded && hasSubnav;

  function handleSelect(id) {
    const s      = NAV_SECTIONS.find(n => n.id === id);
    const hasSub = s?.subnav?.length > 0;
    if (activeSection === id && hasSub) {
      setExpanded(prev => !prev);
    } else {
      setActiveSection(id);
      setExpanded(hasSub);
      if (!hasSub) onPageChange?.(id);
    }
  }

  // Mark items that have subnav so NavShell renders the chevron
  const navItems = NAV_SECTIONS.map(s => ({
    ...s,
    hasSub: s.subnav?.length > 0,
  }));

  return (
    <NavShell
      items={navItems}
      bottomItems={BOTTOM_NAV}
      activeId={activeSection}
      onSelect={handleSelect}
      logoMark={<OsmosLogoMark size={36} />}
      logoText="OSMOS"
      logoBadge="PRO"
      userInitial="R"
      subnavPanel={subnavPinned
        ? <SubNavPanel
            section={section}
            activePage={activePage}
            onClose={() => setExpanded(false)}
            onPageChange={onPageChange}
          />
        : null
      }
    />
  );
}
