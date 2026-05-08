import sql from '../client.js';

export const getCampaigns = (type) =>
  type
    ? sql`SELECT * FROM campaigns WHERE type = ${type} ORDER BY created_on DESC`
    : sql`SELECT * FROM campaigns ORDER BY created_on DESC`;

export const getDisplayCampaigns = () =>
  sql`SELECT * FROM campaigns WHERE type = 'display' ORDER BY created_on DESC`;

export const getSponsoredCampaigns = () =>
  sql`SELECT * FROM campaigns WHERE type = 'sponsored' ORDER BY created_on DESC`;

export const getProductCampaigns = () =>
  sql`SELECT * FROM campaigns WHERE type = 'product' ORDER BY created_on DESC`;
