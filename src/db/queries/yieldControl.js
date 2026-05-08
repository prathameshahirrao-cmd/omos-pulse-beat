import sql from '../client.js';

export const getCPCYieldRows = () =>
  sql`SELECT * FROM product_yield_cpc ORDER BY id ASC`;

export const getCPMYieldRows = () =>
  sql`SELECT * FROM product_yield_cpm ORDER BY id ASC`;
