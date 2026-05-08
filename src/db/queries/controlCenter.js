import sql from '../client.js';

export const getAudienceAttributes = () =>
  sql`SELECT * FROM audience_attributes ORDER BY created_on DESC`;

export const getActivityLogs = () =>
  sql`SELECT * FROM activity_logs ORDER BY created_at DESC`;

export const getProducts = () =>
  sql`SELECT * FROM products ORDER BY created_at DESC`;

export const getSponsoredDemandSupply = () =>
  sql`SELECT * FROM sponsored_demand_supply ORDER BY recorded_at DESC`;
