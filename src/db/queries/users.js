import sql from '../client.js';

export const getSuperAdminUsers = () =>
  sql`SELECT * FROM platform_users WHERE user_type = 'super_admin' ORDER BY created_at DESC`;

export const getOpsUsers = () =>
  sql`SELECT * FROM platform_users WHERE user_type = 'ops' ORDER BY created_at DESC`;

export const getAdvertiserUsers = (advertiserId) =>
  advertiserId
    ? sql`SELECT * FROM platform_users WHERE user_type = 'advertiser' AND advertiser_id = ${advertiserId}`
    : sql`SELECT * FROM platform_users WHERE user_type = 'advertiser' ORDER BY created_at DESC`;
