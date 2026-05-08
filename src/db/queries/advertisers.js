import sql from '../client.js';

export const getAdvertisers = () =>
  sql`SELECT * FROM advertisers ORDER BY created_at DESC`;

export const getAdvertiserById = (id) =>
  sql`SELECT * FROM advertisers WHERE id = ${id}`;

export const getOnboardingCatalog = () =>
  sql`SELECT * FROM advertisers ORDER BY onboarded_on DESC`;
