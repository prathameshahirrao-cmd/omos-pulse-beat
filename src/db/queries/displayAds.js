import sql from '../client.js';

// Pages
export const getDisplayPages = () =>
  sql`SELECT * FROM display_pages ORDER BY created_at DESC`;

// Inventories
export const getDisplayInventories = () =>
  sql`SELECT * FROM display_inventories ORDER BY created_at DESC`;

// Demand / Supply
export const getDisplayDemandSupply = () =>
  sql`SELECT * FROM display_demand_supply ORDER BY recorded_at DESC`;

// Targeting Keys (BYOT)
export const getTargetingKeys = () =>
  sql`
    SELECT
      tk.*,
      COUNT(tv.id)::int AS num_values
    FROM targeting_keys tk
    LEFT JOIN targeting_values tv ON tv.key_id = tk.id
    GROUP BY tk.id
    ORDER BY tk.created_at DESC
  `;

export const getTargetingValues = (keyId) =>
  sql`SELECT * FROM targeting_values WHERE key_id = ${keyId} ORDER BY created_at ASC`;
