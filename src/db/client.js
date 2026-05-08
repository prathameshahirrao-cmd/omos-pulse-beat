import { neon } from '@neondatabase/serverless';

// Uses Neon's HTTP driver — works in the browser (Vite exposes VITE_* vars at build time)
// For production, move queries behind an API route to avoid exposing credentials in the bundle
const sql = neon(import.meta.env.VITE_DATABASE_URL);

export default sql;
