import sql from '../client.js';

export const getWallets = () =>
  sql`
    SELECT w.*, a.name AS advertiser_name, a.id AS advertiser_id
    FROM wallets w
    JOIN advertisers a ON a.id = w.advertiser_id
    ORDER BY w.balance DESC
  `;

export const getWalletTransactions = () =>
  sql`
    SELECT t.*, a.name AS advertiser_name
    FROM wallet_transactions t
    JOIN advertisers a ON a.id = t.advertiser_id
    ORDER BY t.created_at DESC
  `;

export const getWalletRules = () =>
  sql`SELECT * FROM wallet_rules ORDER BY created_on DESC`;

export const getFinanceAdvertisers = () =>
  sql`
    SELECT a.*, w.balance AS top_up_balance, w.status AS wallet_status, w.top_up_count
    FROM advertisers a
    LEFT JOIN wallets w ON w.advertiser_id = a.id
    ORDER BY a.created_at DESC
  `;
