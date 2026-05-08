// Run with: node scripts/db-migrate.js
// Requires: VITE_DATABASE_URL in .env (read via dotenv)

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Use WebSocket-based Pool so multi-statement DDL works (standard PG wire protocol)
neonConfig.webSocketConstructor = ws;

// Read .env manually (no dotenv dep needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
const dbUrl = envContent
  .split('\n')
  .find(l => l.startsWith('VITE_DATABASE_URL='))
  ?.replace('VITE_DATABASE_URL=', '')
  .trim();

if (!dbUrl) {
  console.error('❌  VITE_DATABASE_URL not found in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: dbUrl });

// ─── Schema ───────────────────────────────────────────────────────────────────

const SCHEMA = `
-- Drop in reverse dependency order so re-runs are clean
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS targeting_values CASCADE;
DROP TABLE IF EXISTS targeting_keys CASCADE;
DROP TABLE IF EXISTS display_inventories CASCADE;
DROP TABLE IF EXISTS display_pages CASCADE;
DROP TABLE IF EXISTS sponsored_demand_supply CASCADE;
DROP TABLE IF EXISTS display_demand_supply CASCADE;
DROP TABLE IF EXISTS product_yield_cpm CASCADE;
DROP TABLE IF EXISTS product_yield_cpc CASCADE;
DROP TABLE IF EXISTS wallet_rules CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS audience_attributes CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS platform_users CASCADE;
DROP TABLE IF EXISTS advertisers CASCADE;

-- Advertisers / Merchants ─────────────────────────────────────────────────────
CREATE TABLE advertisers (
  id            TEXT PRIMARY KEY,            -- OS_M001
  merchant_id   TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  email         TEXT,
  persona       TEXT CHECK (persona IN ('Platinum','Gold','Silver','Beta')),
  payment_type  TEXT CHECK (payment_type IN ('Prepaid','Postpaid','Credit')),
  status        TEXT CHECK (status IN ('Active','Inactive','Paused')) DEFAULT 'Active',
  multi_wallet  BOOLEAN DEFAULT FALSE,
  auto_swipe    BOOLEAN DEFAULT FALSE,
  wallet_count  INTEGER DEFAULT 1,
  synced_feed   INTEGER,
  synced_rule   INTEGER,
  onboarded_on  TIMESTAMPTZ,
  onboarded_by  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Platform Users ──────────────────────────────────────────────────────────────
CREATE TABLE platform_users (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  user_type     TEXT CHECK (user_type IN ('super_admin','admin','ops','advertiser')),
  access_role   TEXT,                         -- Super Administrator, Viewer, Editor, etc.
  advertiser_id TEXT REFERENCES advertisers(id),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns ───────────────────────────────────────────────────────────────────
CREATE TABLE campaigns (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  advertiser_id TEXT REFERENCES advertisers(id),
  merchant_name TEXT,
  type          TEXT CHECK (type IN ('display','sponsored','product')),
  status        TEXT CHECK (status IN ('Active','Inactive','Paused','Draft')) DEFAULT 'Active',
  budget        NUMERIC(12,2),
  impressions   BIGINT DEFAULT 0,
  clicks        INTEGER DEFAULT 0,
  ctr           NUMERIC(6,4) DEFAULT 0,
  cpc           NUMERIC(8,2) DEFAULT 0,
  cpm           NUMERIC(8,2) DEFAULT 0,
  spend         NUMERIC(12,2) DEFAULT 0,
  revenue       NUMERIC(12,2) DEFAULT 0,
  labels        TEXT[] DEFAULT '{}',
  created_on    TIMESTAMPTZ DEFAULT NOW()
);

-- Products ────────────────────────────────────────────────────────────────────
CREATE TABLE products (
  id            SERIAL PRIMARY KEY,
  product_id    TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  category      TEXT,
  brand         TEXT,
  mrp           NUMERIC(10,2),
  selling_price NUMERIC(10,2),
  stock         INTEGER DEFAULT 0,
  status        TEXT CHECK (status IN ('Active','Inactive')) DEFAULT 'Active',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Display Ad Pages (Page Setup) ───────────────────────────────────────────────
CREATE TABLE display_pages (
  id                    SERIAL PRIMARY KEY,
  name                  TEXT NOT NULL,
  api_id                TEXT UNIQUE NOT NULL,
  tag                   TEXT,
  daily_impressions     INTEGER DEFAULT 0,
  used_by_inventories   INTEGER DEFAULT 0,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Display Ad Inventories ──────────────────────────────────────────────────────
CREATE TABLE display_inventories (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,
  daily_impressions INTEGER DEFAULT 0,
  page_id           INTEGER REFERENCES display_pages(id),
  position          TEXT CHECK (position IN ('top','middle','bottom')),
  api_identifier    TEXT,
  status            TEXT CHECK (status IN ('Active','Inactive','Unassigned')) DEFAULT 'Unassigned',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Targeting Keys (BYOT) ───────────────────────────────────────────────────────
CREATE TABLE targeting_keys (
  id         SERIAL PRIMARY KEY,
  key_name   TEXT NOT NULL,
  api_id     TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE targeting_values (
  id         SERIAL PRIMARY KEY,
  key_id     INTEGER REFERENCES targeting_keys(id) ON DELETE CASCADE,
  value      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Finance ─────────────────────────────────────────────────────────────────────
CREATE TABLE wallets (
  id             SERIAL PRIMARY KEY,
  advertiser_id  TEXT UNIQUE REFERENCES advertisers(id),
  balance        NUMERIC(12,2) DEFAULT 0,
  spent          NUMERIC(12,2) DEFAULT 0,
  top_up_count   INTEGER DEFAULT 0,
  last_top_up    TIMESTAMPTZ,
  status         TEXT CHECK (status IN ('Active','Inactive','Low')) DEFAULT 'Active',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_transactions (
  id             TEXT PRIMARY KEY,            -- TXN-0421-001
  advertiser_id  TEXT REFERENCES advertisers(id),
  type           TEXT CHECK (type IN ('Top-Up','Deduction','Refund')),
  amount         NUMERIC(12,2) NOT NULL,
  method         TEXT,
  status         TEXT CHECK (status IN ('Success','Pending','Failed')) DEFAULT 'Success',
  created_by     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallet_rules (
  id             SERIAL PRIMARY KEY,
  segment_name   TEXT NOT NULL,
  label          TEXT,
  rule           TEXT NOT NULL,
  description    TEXT,
  rule_type      TEXT,
  is_enabled     BOOLEAN DEFAULT TRUE,
  last_executed  TIMESTAMPTZ,
  created_by     TEXT,
  created_on     TIMESTAMPTZ DEFAULT NOW(),
  last_edited_by TEXT
);

-- Audience Attributes ─────────────────────────────────────────────────────────
CREATE TABLE audience_attributes (
  id               SERIAL PRIMARY KEY,
  status           TEXT CHECK (status IN ('Active','Inactive')) DEFAULT 'Active',
  name             TEXT NOT NULL,
  attr_id          TEXT UNIQUE NOT NULL,
  data_type        TEXT,
  advertiser_count INTEGER DEFAULT 0,
  campaign_count   INTEGER DEFAULT 0,
  user_count       TEXT,
  user_pct         TEXT,
  dropdown_enabled BOOLEAN DEFAULT FALSE,
  visibility       INTEGER DEFAULT 0,
  created_by       TEXT,
  created_on       TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs ───────────────────────────────────────────────────────────────
CREATE TABLE activity_logs (
  id                  SERIAL PRIMARY KEY,
  user_name           TEXT NOT NULL,
  action              TEXT NOT NULL,
  description         TEXT,
  merchants_affected  TEXT,
  file_status         TEXT,
  file_name           TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Demand / Supply Metrics ─────────────────────────────────────────────────────
CREATE TABLE display_demand_supply (
  id                  SERIAL PRIMARY KEY,
  placement           TEXT NOT NULL,
  requests            TEXT,
  fill_rate           TEXT,
  revenue             TEXT,
  cpm                 TEXT,
  impressions         TEXT,
  budget_utilization  INTEGER,
  recorded_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE sponsored_demand_supply (
  id                  SERIAL PRIMARY KEY,
  ad_unit             TEXT NOT NULL,
  requests            TEXT,
  fill_rate           TEXT,
  revenue             TEXT,
  cpc                 TEXT,
  clicks              TEXT,
  budget_utilization  INTEGER,
  recorded_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Yield Control ───────────────────────────────────────────────────────────────
CREATE TABLE product_yield_cpc (
  id             SERIAL PRIMARY KEY,
  category       TEXT NOT NULL,
  floor_cpc      NUMERIC(8,2),
  ceiling_cpc    NUMERIC(8,2),
  bid_multiplier NUMERIC(5,2),
  impressions    TEXT,
  clicks         TEXT,
  ctr            NUMERIC(6,4) DEFAULT 0,
  cpc            NUMERIC(8,2) DEFAULT 0,
  spend          TEXT,
  revenue        TEXT
);

CREATE TABLE product_yield_cpm (
  id             SERIAL PRIMARY KEY,
  category       TEXT NOT NULL,
  floor_cpm      NUMERIC(8,2),
  ceiling_cpm    NUMERIC(8,2),
  bid_multiplier NUMERIC(5,2),
  impressions    TEXT,
  cpm            NUMERIC(8,2) DEFAULT 0,
  spend          TEXT,
  revenue        TEXT
);
`;

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED = `
-- Advertisers
INSERT INTO advertisers (id, merchant_id, name, email, persona, payment_type, status, multi_wallet, auto_swipe, wallet_count, synced_feed, synced_rule, onboarded_on, onboarded_by) VALUES
  ('OS_M001', 'M001', 'HP',               'contact@hp.com',          'Platinum', 'Prepaid',  'Active',   TRUE,  TRUE,  2, 14, 2,  '2025-11-10 08:00:00+00', 'alice.johnson@onlinesales.ai'),
  ('OS_M002', 'M002', 'Sports World',     'sports@world.com',        'Platinum', 'Prepaid',  'Active',   TRUE,  TRUE,  3, 11, NULL,'2025-11-13 12:05:00+00', 'jane.smith@onlinesales.ai'),
  ('OS_M003', 'M003', 'Beauty & Beyond',  'hello@beautybeyond.com',  'Gold',     'Postpaid', 'Active',   FALSE, FALSE, 1, 8,  1,  '2025-12-01 09:30:00+00', 'alice.johnson@onlinesales.ai'),
  ('OS_M004', 'M004', 'TechZone',         'info@techzone.com',       'Silver',   'Prepaid',  'Active',   FALSE, FALSE, 1, 5,  NULL,'2026-01-15 11:00:00+00', 'rahul.sharma@company.com'),
  ('OS_M005', 'M005', 'FoodCo',           'ops@foodco.com',          'Gold',     'Credit',   'Active',   TRUE,  FALSE, 2, 9,  3,  '2025-10-20 07:00:00+00', 'jane.smith@onlinesales.ai'),
  ('OS_M006', 'M006', 'HomeStyle',        'contact@homestyle.com',   'Beta',     'Prepaid',  'Inactive', FALSE, FALSE, 1, 3,  NULL,'2026-02-05 14:00:00+00', 'alice.johnson@onlinesales.ai'),
  ('OS_M007', 'M007', 'GreenLeaf',        'hello@greenleaf.com',     'Silver',   'Prepaid',  'Active',   FALSE, FALSE, 1, 6,  1,  '2026-01-28 10:00:00+00', 'rahul.sharma@company.com'),
  ('OS_M008', 'M008', 'MegaMart',         'ops@megamart.com',        'Platinum', 'Postpaid', 'Active',   TRUE,  TRUE,  4, 18, 5,  '2025-09-15 09:00:00+00', 'alice.johnson@onlinesales.ai'),
  ('OS_M009', 'M009', 'QuickBuy',         'hi@quickbuy.com',         'Gold',     'Prepaid',  'Paused',   FALSE, FALSE, 1, 7,  2,  '2025-12-20 13:00:00+00', 'jane.smith@onlinesales.ai');

-- Platform Users
INSERT INTO platform_users (name, email, phone, user_type, access_role, advertiser_id) VALUES
  ('Alice Johnson',     'alice.johnson@onlinesales.ai',    NULL,             'super_admin', 'Super Administrator', NULL),
  ('Bob Smith',         'bob.smith@onlinesales.ai',        NULL,             'super_admin', 'Super Administrator', NULL),
  ('Carol White',       'carol.white@onlinesales.ai',      NULL,             'super_admin', 'Administrator',       NULL),
  ('David Brown',       'david.brown@onlinesales.ai',      NULL,             'super_admin', 'Viewer',              NULL),
  ('Emma Wilson',       'emma.wilson@onlinesales.ai',      NULL,             'super_admin', 'Viewer',              NULL),
  ('Rahul Sharma',      'rahul.sharma@company.com',        '+91 98100 12345','ops',         'Write',               NULL),
  ('Priya Mehta',       'priya.mehta@company.com',         '+91 98200 23456','ops',         'Read',                NULL),
  ('Arjun Kapoor',      'arjun.kapoor@company.com',        '+91 98300 34567','ops',         'Write',               NULL),
  ('Sneha Patel',       'sneha.patel@company.com',         '+91 98400 45678','ops',         'Read',                NULL),
  ('Vikram Singh',      'vikram.singh@company.com',        '+91 98500 56789','ops',         'Write',               NULL),
  ('Aayushi Patel',     'aayushi.patel@onlinesales.ai',    NULL,             'advertiser',  'Viewer',              'OS_M002'),
  ('Riya Shah',         'riya.shah@onlinesales.ai',        NULL,             'advertiser',  'Editor',              'OS_M002'),
  ('Manish Gupta',      'manish.gupta@onlinesales.ai',     NULL,             'advertiser',  'Administrator',       'OS_M003'),
  ('Neha Joshi',        'neha.joshi@onlinesales.ai',       NULL,             'advertiser',  'API Access',          'OS_M004'),
  ('Jane Smith',        'jane.smith@example.com',          NULL,             'admin',       'Administrator',       NULL);

-- Campaigns (Display)
INSERT INTO campaigns (name, advertiser_id, merchant_name, type, status, budget, impressions, clicks, ctr, cpc, cpm, spend, revenue, labels, created_on) VALUES
  ('Copy of TestQA588',           'OS_M001', 'HP (HP)',         'display', 'Active',   50000, 120000, 3200, 0.0267, 1.25, 4.50, 4000,  18000, '{}',          '2025-06-16 07:55:00+00'),
  ('TestQA588',                   'OS_M001', 'HP (HP)',         'display', 'Active',   30000, 85000,  1800, 0.0212, 1.40, 4.20, 2520,  12000, '{}',          '2025-06-10 09:00:00+00'),
  ('Summer Sale Banner',          'OS_M002', 'Sports World',   'display', 'Active',   75000, 240000, 8400, 0.0350, 0.95, 3.80, 7980,  42000, '{"sale"}',    '2025-06-01 06:00:00+00'),
  ('Brand Awareness Q2',          'OS_M003', 'Beauty & Beyond','display', 'Paused',   40000, 95000,  2100, 0.0221, 1.30, 4.10, 2730,  15000, '{"brand"}',   '2025-05-15 08:30:00+00'),
  ('Homepage Hero',               'OS_M004', 'TechZone',       'display', 'Active',   60000, 180000, 5400, 0.0300, 1.10, 4.00, 5940,  28000, '{}',          '2025-06-05 10:00:00+00'),
  ('Category Page Mid Banner',    'OS_M005', 'FoodCo',         'display', 'Inactive', 25000, 45000,  900,  0.0200, 1.80, 5.50, 1620,   8000, '{}',          '2025-04-20 11:00:00+00'),
  ('Retargeting Campaign',        'OS_M008', 'MegaMart',       'display', 'Active',   90000, 320000, 12800,0.0400, 0.85, 3.50, 10880, 58000, '{"retarget"}','2025-06-12 07:00:00+00'),
  ('New Arrivals Showcase',       'OS_M002', 'Sports World',   'display', 'Active',   45000, 140000, 4200, 0.0300, 1.05, 3.90, 4410,  22000, '{"new"}',     '2025-06-14 09:30:00+00'),
  ('Flash Sale 24H',              'OS_M008', 'MegaMart',       'display', 'Draft',    20000, 0,      0,    0,      0,    0,    0,     0,     '{"flash"}',   '2025-06-15 14:00:00+00'),
  ('Loyalty Program Banner',      'OS_M009', 'QuickBuy',       'display', 'Paused',   35000, 75000,  1500, 0.0200, 1.60, 4.80, 2400,  11000, '{"loyalty"}', '2025-05-28 08:00:00+00');

-- Campaigns (Sponsored)
INSERT INTO campaigns (name, advertiser_id, merchant_name, type, status, budget, impressions, clicks, ctr, cpc, cpm, spend, revenue, labels, created_on) VALUES
  ('Search Top Placement',        'OS_M001', 'HP (HP)',         'sponsored', 'Active',   80000, 520000, 18200, 0.0350, 0.38, 1.20, 6916,  95000, '{}',          '2025-06-01 08:00:00+00'),
  ('Category Sponsored Row',      'OS_M002', 'Sports World',   'sponsored', 'Active',   60000, 380000, 11400, 0.0300, 0.42, 1.35, 4788,  68000, '{"sport"}',   '2025-06-05 09:00:00+00'),
  ('Search Sidebar Ads',          'OS_M003', 'Beauty & Beyond','sponsored', 'Active',   45000, 290000, 7250,  0.0250, 0.55, 1.80, 3988,  42000, '{}',          '2025-05-20 10:00:00+00'),
  ('PDP Sponsored Section',       'OS_M004', 'TechZone',       'sponsored', 'Paused',   30000, 150000, 3750,  0.0250, 0.68, 2.10, 2550,  22000, '{"pdp"}',     '2025-05-25 11:00:00+00'),
  ('Brand Keyword Campaign',      'OS_M005', 'FoodCo',         'sponsored', 'Active',   55000, 410000, 14350, 0.0350, 0.32, 1.05, 4592,  78000, '{"keyword"}', '2025-06-08 08:30:00+00'),
  ('Competitor Conquesting',      'OS_M008', 'MegaMart',       'sponsored', 'Active',   70000, 480000, 16800, 0.0350, 0.40, 1.30, 6720,  88000, '{"conquest"}','2025-06-10 07:00:00+00'),
  ('Homepage Sponsored Top',      'OS_M009', 'QuickBuy',       'sponsored', 'Inactive', 25000, 80000,  1600,  0.0200, 0.72, 2.30, 1152,  12000, '{}',          '2025-05-01 12:00:00+00'),
  ('Deal of Day Placement',       'OS_M007', 'GreenLeaf',      'sponsored', 'Active',   40000, 260000, 7800,  0.0300, 0.46, 1.45, 3588,  48000, '{"deal"}',    '2025-06-12 09:00:00+00'),
  ('Mid-Category Banner',         'OS_M006', 'HomeStyle',      'sponsored', 'Paused',   20000, 55000,  990,   0.0180, 0.85, 2.70, 842,    7500, '{}',          '2025-04-15 10:00:00+00'),
  ('Trending Now Section',        'OS_M002', 'Sports World',   'sponsored', 'Active',   65000, 440000, 15400, 0.0350, 0.38, 1.22, 5852,  82000, '{"trending"}','2025-06-14 08:00:00+00');

-- Products
INSERT INTO products (product_id, name, category, brand, mrp, selling_price, stock, status) VALUES
  ('PRD001', 'Colgate Strong Teeth Toothpaste 200g',  'Oral Care',       'Colgate',    120.00,  99.00,  1240, 'Active'),
  ('PRD002', 'Nike Air Max 270 Running Shoes',        'Footwear',        'Nike',       9999.00, 7999.00, 85, 'Active'),
  ('PRD003', 'Apple AirPods Pro (2nd Gen)',            'Electronics',     'Apple',     24999.00,21999.00, 42, 'Active'),
  ('PRD004', 'Prestige Induction Cooktop 2000W',      'Kitchen',         'Prestige',   3499.00, 2799.00,180, 'Active'),
  ('PRD005', 'Nivea Body Lotion 400ml',               'Personal Care',   'Nivea',       320.00,  265.00, 620, 'Active'),
  ('PRD006', 'Samsung 65" 4K Smart TV',              'Electronics',     'Samsung',   89999.00,74999.00,  18, 'Active'),
  ('PRD007', 'Tata Sampann Toor Dal 1kg',             'Grocery',         'Tata',        135.00,  119.00,2800, 'Active'),
  ('PRD008', 'Levi''s 511 Slim Fit Jeans',            'Apparel',         'Levi''s',    3499.00, 2799.00, 340, 'Inactive');

-- Display Pages
INSERT INTO display_pages (name, api_id, tag, daily_impressions, used_by_inventories) VALUES
  ('Copy of TestQA98',          'home_pg',      'New tag', 309, 2),
  ('TestQA98',                  'everyone_1',   'New tag',   0, 1),
  ('Copy of TestQA97',          'purpose_1',    'New tag', 318, 0),
  ('TestQA97',                  'purpose_2',    'New tag', 303, 3),
  ('Copy of TestQA91',          'purpose_3',    'New tag', 281, 1),
  ('TestQA91',                  'purpose_4',    'New tag', 307, 2),
  ('Copy of TestQA80',          'purpose_5',    'New tag', 302, 0),
  ('TestQA80',                  'purpose_6',    'New tag', 302, 4),
  ('Highest Shopper',           'everyone_2',   'New tag', 306, 1),
  ('No Spends in last 30 days', 'everyone_3',   'New tag', 305, 2),
  ('Paper Mario',               'everyone_4',   'New tag', 305, 0),
  ('Most Brands',               'everyone_5',   'New tag', 305, 1);

-- Display Inventories
INSERT INTO display_inventories (name, daily_impressions, page_id, position, api_identifier, status) VALUES
  ('new Merchant incentive',              0, 1, 'top',    'home_pg',      'Active'),
  ('Merchant Management',                 0, 2, 'middle', 'everyone_1',   'Active'),
  ('Add Signup amount',                   0, 3, 'bottom', 'purpose_1',    'Unassigned'),
  ('Get 10% incentive on first purchase', 0, 4, 'top',    'purpose_2',    'Active'),
  ('Get incentive to all Merchants',      0, 5, 'middle', 'purpose_3',    'Unassigned'),
  ('Add fixed incentive on wallet',       0, 6, 'bottom', 'purpose_4',    'Active'),
  ('Add Wallet Balance',                  0, 7, 'top',    'purpose_5',    'Unassigned'),
  ('onboarding incentives',               0, 8, 'middle', 'purpose_6',    'Active'),
  ('Modify Wallet Balance',               0, 9, 'bottom', 'everyone_2',   'Unassigned'),
  ('Demo Incentive',                      0,10, 'top',    'everyone_3',   'Active');

-- Targeting Keys
INSERT INTO targeting_keys (key_name, api_id) VALUES
  ('Location',        'Locations'),
  ('Services',        'Services'),
  ('Category5162736', 'Development'),
  ('Test Category',   'Consulting'),
  ('Houston',         'Support');

INSERT INTO targeting_values (key_id, value) VALUES
  (1, 'New York'), (1, 'San Francisco'),
  (2, 'Premium'),  (2, 'Standard'),
  (3, 'Frontend'), (3, 'Backend'),  (3, 'DevOps'),
  (4, 'Strategy'), (4, 'Execution'), (4, 'Advisory'), (4, 'Audit'),
  (5, 'Downtown'), (5, 'Midtown'), (5, 'Uptown'), (5, 'Suburbs'), (5, 'Metro');

-- Wallets
INSERT INTO wallets (advertiser_id, balance, spent, top_up_count, last_top_up, status) VALUES
  ('OS_M001', 620000, 180000, 4, '2026-04-18 10:00:00+00', 'Active'),
  ('OS_M002', 420000, 180000, 3, '2026-04-20 10:00:00+00', 'Active'),
  ('OS_M003', 195000, 105000, 2, '2026-04-10 09:00:00+00', 'Active'),
  ('OS_M004', 310000, 90000,  2, '2026-04-05 11:00:00+00', 'Active'),
  ('OS_M005', 580000, 220000, 5, '2026-04-22 08:00:00+00', 'Active'),
  ('OS_M006',   4500,  95500, 1, '2026-01-15 10:00:00+00', 'Low'),
  ('OS_M007', 250000,  50000, 2, '2026-03-30 09:00:00+00', 'Active'),
  ('OS_M008', 840000, 360000, 6, '2026-04-21 07:30:00+00', 'Active'),
  ('OS_M009',  28000,  72000, 1, '2026-02-28 12:00:00+00', 'Active');

-- Wallet Transactions
INSERT INTO wallet_transactions (id, advertiser_id, type, amount, method, status, created_by, created_at) VALUES
  ('TXN-0421-001','OS_M002','Top-Up',    200000,'Bank Transfer','Success','Alice Johnson', '2026-04-21 10:30:00+00'),
  ('TXN-0420-002','OS_M008','Top-Up',    300000,'NEFT',         'Success','Bob Smith',     '2026-04-20 09:15:00+00'),
  ('TXN-0419-003','OS_M001','Deduction', 45000, 'Auto',         'Success','System',        '2026-04-19 08:00:00+00'),
  ('TXN-0418-004','OS_M005','Top-Up',    150000,'IMPS',         'Pending','Carol White',   '2026-04-18 11:45:00+00'),
  ('TXN-0415-005','OS_M003','Refund',     12000,'Bank Transfer','Success','Alice Johnson', '2026-04-15 14:00:00+00');

-- Wallet Rules
INSERT INTO wallet_rules (segment_name, label, rule, description, rule_type, is_enabled, last_executed, created_by, created_on, last_edited_by) VALUES
  ('High Value Advertisers', 'HVA Rule',     'Balance < ₹5,000',  'Auto top-up when balance falls below ₹5,000',   'Auto Top-Up',   TRUE,  '2026-04-21 09:00:00+00', 'Alice Johnson', '2025-01-15 00:00:00+00', 'Alice Johnson'),
  ('New Advertisers',        'Onboard Rule', 'First 30 days',      'Credit ₹10,000 for new advertisers on signup',  'Credit',        TRUE,  '2026-04-20 10:00:00+00', 'Bob Smith',     '2025-02-01 00:00:00+00', 'Bob Smith'),
  ('Inactive Accounts',      'Reactivation', 'No spend > 30 days', 'Notify and offer incentive to reactivate',       'Notification',  FALSE, '2026-03-15 08:00:00+00', 'Carol White',   '2025-03-10 00:00:00+00', 'Carol White'),
  ('Platinum Tier',          'Platinum Auto','Balance < ₹20,000',  'Premium auto top-up for Platinum advertisers',   'Auto Top-Up',   TRUE,  '2026-04-21 07:00:00+00', 'Alice Johnson', '2025-01-20 00:00:00+00', 'Alice Johnson');

-- Audience Attributes
INSERT INTO audience_attributes (status, name, attr_id, data_type, advertiser_count, campaign_count, user_count, user_pct, dropdown_enabled, visibility, created_by, created_on) VALUES
  ('Active',   'Age Group',       'Age_Group',     'String',  10, 45, '2K',  '2K',  TRUE,  15, 'Shailendra Singh', '2025-06-16 07:55:00+00'),
  ('Active',   'Gender',          'Gender',        'String',   8, 32, '1.8K','1.8K',TRUE,  12, 'Shailendra Singh', '2025-06-10 09:00:00+00'),
  ('Inactive', 'Income Bracket',  'Income_Bracket','Numeric',  5, 18, '900', '900', FALSE,  8, 'Alice Johnson',    '2025-05-20 10:00:00+00'),
  ('Active',   'Purchase History','Purchase_Hist', 'Boolean',  12, 58, '3.2K','3.2K',FALSE, 20, 'Bob Smith',        '2025-04-15 11:00:00+00');

-- Activity Logs
INSERT INTO activity_logs (user_name, action, description, merchants_affected, file_status, file_name, created_at) VALUES
  ('Alice Johnson', 'Create Advertiser',       'Created new advertiser account for Sports World',        'OS_M002', '—',       '—',                  '2026-04-21 10:30:00+00'),
  ('Bob Smith',     'Update Campaign',         'Paused Brand Awareness Q2 campaign for Beauty & Beyond', 'OS_M003', '—',       '—',                  '2026-04-21 09:15:00+00'),
  ('Alice Johnson', 'Wallet Top-Up',           'Processed ₹2,00,000 top-up for Sports World',           'OS_M002', '—',       '—',                  '2026-04-20 14:00:00+00'),
  ('Carol White',   'Bulk Campaign Upload',    'Uploaded 12 new display campaigns via CSV',             'OS_M001', 'Success', 'campaigns_apr20.csv','2026-04-20 11:00:00+00'),
  ('Rahul Sharma',  'User Role Update',        'Changed Aayushi Patel role from Editor to Viewer',      '—',       '—',       '—',                  '2026-04-19 16:30:00+00'),
  ('Alice Johnson', 'Persona Config Change',   'Updated Silver persona — disabled Keyword Targeting',   '—',       '—',       '—',                  '2026-04-18 09:00:00+00'),
  ('Bob Smith',     'Attribute Created',       'Added new audience attribute: Purchase History',        '—',       '—',       '—',                  '2026-04-15 13:00:00+00'),
  ('Carol White',   'Inventory Setup',         'Created 3 new Display Ad inventory slots for HP',       'OS_M001', '—',       '—',                  '2026-04-14 10:45:00+00');

-- Display Demand / Supply
INSERT INTO display_demand_supply (placement, requests, fill_rate, revenue, cpm, impressions, budget_utilization) VALUES
  ('Homepage Banner',     '1.2M', '65%', '$42K',  '$3.50', '12.0M', 78),
  ('Category Top Banner', '890K', '72%', '$31K',  '$3.80', '8.9M',  85),
  ('Search Results Top',  '2.1M', '58%', '$58K',  '$2.90', '18.4M', 62),
  ('PDP Side Panel',      '650K', '81%', '$24K',  '$4.20', '5.8M',  91),
  ('Cart Page Banner',    '320K', '45%', '$9K',   '$3.10', '2.8M',  48),
  ('Checkout Banner',     '180K', '38%', '$5.5K', '$3.60', '1.6M',  39),
  ('Mobile Interstitial', '1.5M', '55%', '$48K',  '$3.20', '13.5M', 71),
  ('Footer Banner',       '420K', '29%', '$6.8K', '$2.80', '3.8M',  31);

-- Sponsored Demand / Supply
INSERT INTO sponsored_demand_supply (ad_unit, requests, fill_rate, revenue, cpc, clicks, budget_utilization) VALUES
  ('Search Top',          '3.2M', '78%', '$85K',  '$0.38', '223.6K', 84),
  ('Category Top',        '2.4M', '71%', '$62K',  '$0.42', '147.6K', 76),
  ('PDP Sponsored Row',   '1.8M', '83%', '$74K',  '$0.35', '211.4K', 92),
  ('Search Sidebar',      '1.1M', '65%', '$38K',  '$0.55',  '69.1K', 68),
  ('Deal of the Day',     '580K', '88%', '$28K',  '$0.48',  '58.3K', 95),
  ('Trending Now',        '920K', '74%', '$44K',  '$0.40', '110.0K', 79),
  ('Homepage Sponsored',  '1.4M', '69%', '$52K',  '$0.45',  '115.6K',73),
  ('Category Bottom',     '760K', '52%', '$22K',  '$0.60',  '36.7K', 55);

-- Product Yield CPC
INSERT INTO product_yield_cpc (category, floor_cpc, ceiling_cpc, bid_multiplier, impressions, clicks, ctr, cpc, spend, revenue) VALUES
  ('Body Care',       0.40, 1.20, NULL, '8.2 M',  '24.6K', 0.0030, 0.85, '20.9K',  '82K'),
  ('Oral Care',       0.35, 1.00, NULL, '6.5 M',  '19.5K', 0.0030, 0.72, '14.0K',  '58K'),
  ('Hair Care',       0.45, 1.30, NULL, '5.8 M',  '17.4K', 0.0030, 0.92, '16.0K',  '64K'),
  ('Skincare',        0.50, 1.50, NULL, '9.1 M',  '36.4K', 0.0040, 1.05, '38.2K', '152K'),
  ('Footwear',        0.60, 1.80, NULL, '4.2 M',  '12.6K', 0.0030, 1.25, '15.8K',  '72K'),
  ('Apparel',         0.55, 1.60, NULL, '7.3 M',  '29.2K', 0.0040, 1.10, '32.1K', '128K'),
  ('Electronics',     0.80, 2.50, NULL, '3.5 M',  '10.5K', 0.0030, 1.85, '19.4K', '105K'),
  ('Kitchen',         0.45, 1.35, NULL, '2.8 M',   '8.4K', 0.0030, 0.95,  '8.0K',  '38K'),
  ('Grocery',         0.25, 0.75, NULL, '15.8 M', '47.4K', 0.0030, 0.52, '24.6K',  '98K'),
  ('Sports',          0.55, 1.65, NULL, '3.9 M',  '11.7K', 0.0030, 1.15, '13.5K',  '62K'),
  ('Home & Living',   0.40, 1.20, NULL, '4.6 M',  '13.8K', 0.0030, 0.88, '12.1K',  '52K'),
  ('Baby & Kids',     0.50, 1.50, NULL, '2.1 M',   '6.3K', 0.0030, 1.05,  '6.6K',  '32K');

-- Product Yield CPM
INSERT INTO product_yield_cpm (category, floor_cpm, ceiling_cpm, bid_multiplier, impressions, cpm, spend, revenue) VALUES
  ('Body Care',       6.00, 10.00, NULL, '8.2 M',  0.45, '3.7K',  '82K'),
  ('Oral Care',       5.00,  8.00, NULL, '6.5 M',  0.38, '2.5K',  '58K'),
  ('Hair Care',       7.00, 11.00, NULL, '5.8 M',  0.52, '3.0K',  '64K'),
  ('Skincare',        8.00, 12.00, NULL, '9.1 M',  0.58, '5.3K', '152K'),
  ('Footwear',       10.00, 16.00, NULL, '4.2 M',  0.72, '3.0K',  '72K'),
  ('Apparel',         9.00, 14.00, NULL, '7.3 M',  0.65, '4.7K', '128K'),
  ('Electronics',    12.00, 20.00, NULL, '3.5 M',  0.98, '3.4K', '105K'),
  ('Kitchen',         7.00, 11.00, NULL, '2.8 M',  0.55, '1.5K',  '38K'),
  ('Grocery',         4.00,  7.00, NULL,'15.8 M',  0.32, '5.1K',  '98K'),
  ('Sports',          9.00, 14.00, NULL, '3.9 M',  0.68, '2.7K',  '62K'),
  ('Home & Living',   6.00, 10.00, NULL, '4.6 M',  0.48, '2.2K',  '52K'),
  ('Baby & Kids',     8.00, 12.00, NULL, '2.1 M',  0.58, '1.2K',  '32K');
`;

// ─── Run ──────────────────────────────────────────────────────────────────────

async function migrate() {
  console.log('🔌  Connecting to Neon…');
  const client = await pool.connect();
  try {
    console.log('📐  Running schema DDL…');
    await client.query(SCHEMA);
    console.log('✅  Schema created.');

    console.log('🌱  Seeding data…');
    await client.query(SEED);
    console.log('✅  Seed complete.');

    // Quick verification
    const { rows } = await client.query('SELECT COUNT(*)::int AS count FROM advertisers');
    console.log(`\n🎉  Done! ${rows[0].count} advertisers in database.`);
    console.log('    Tables: advertisers, platform_users, campaigns, products,');
    console.log('    display_pages, display_inventories, targeting_keys, targeting_values,');
    console.log('    wallets, wallet_transactions, wallet_rules, audience_attributes,');
    console.log('    activity_logs, display_demand_supply, sponsored_demand_supply,');
    console.log('    product_yield_cpc, product_yield_cpm');
  } catch (err) {
    console.error('❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
