/**
 * db-branch.js — create a personal Neon DB branch and wire it into .env
 *
 * Usage:
 *   pnpm db:branch               # auto-detects name from git user → dev/your-name
 *   pnpm db:branch dev/alice     # explicit branch name
 *
 * Requires in .env:
 *   NEON_API_KEY=...   → https://console.neon.tech/app/settings/api-keys
 *
 * What it does:
 *   1. Creates a new Neon branch (instant, zero-copy) from the main branch
 *   2. Provisions a read-write endpoint on that branch
 *   3. Fetches a ready-to-use pooled connection string
 *   4. Saves original VITE_DATABASE_URL as NEON_MAIN_DATABASE_URL
 *   5. Updates VITE_DATABASE_URL to point to your personal branch
 *
 * After running:
 *   pnpm db:migrate    → seeds your personal branch without touching anyone else's data
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENV_PATH  = resolve(__dirname, '../.env');

// ── .env helpers ─────────────────────────────────────────────────────────────

function parseEnv(content) {
  const result = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    result[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
  }
  return result;
}

function serializeEnv(vars) {
  return Object.entries(vars).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
}

// ── Neon Management API ───────────────────────────────────────────────────────

async function neonApi(apiKey, path, method = 'GET', body = null) {
  const res = await fetch(`https://console.neon.tech/api/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neon API ${method} ${path} → HTTP ${res.status}\n${text}`);
  }
  return res.json();
}

// ── Branch name ───────────────────────────────────────────────────────────────

function detectBranchName() {
  const arg = process.argv[2];
  if (arg) return arg;
  try {
    const name = execSync('git config user.name', { stdio: ['pipe', 'pipe', 'pipe'] })
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-/]/g, '');
    return `dev/${name}`;
  } catch {
    return `dev/local-${Date.now()}`;
  }
}

// ── Find project ID ───────────────────────────────────────────────────────────

async function resolveProjectId(apiKey, envVars) {
  // If already cached in .env, use it
  if (envVars.NEON_PROJECT_ID) {
    console.log(`    Using project ID from .env: ${envVars.NEON_PROJECT_ID}`);
    return envVars.NEON_PROJECT_ID;
  }

  console.log('🔍  Looking up Neon project…');
  const { projects } = await neonApi(apiKey, '/projects');

  if (!projects || projects.length === 0) {
    throw new Error('No Neon projects found for this API key.');
  }

  if (projects.length === 1) {
    console.log(`    Found: "${projects[0].name}" (${projects[0].id})`);
    return projects[0].id;
  }

  // Multiple projects — try to match via the endpoint ID in the current connection string
  const currentUrl = envVars.VITE_DATABASE_URL || envVars.NEON_MAIN_DATABASE_URL || '';
  if (currentUrl) {
    try {
      const host = new URL(currentUrl).hostname;                    // ep-xxx-pooler.region.neon.tech
      const endpointId = host.split('-pooler')[0];                 // ep-xxx
      for (const project of projects) {
        const { endpoints } = await neonApi(apiKey, `/projects/${project.id}/endpoints`);
        if (endpoints.some(ep => ep.id === endpointId)) {
          console.log(`    Matched project "${project.name}" (${project.id}) via endpoint ${endpointId}`);
          return project.id;
        }
      }
    } catch { /* ignore URL parse errors */ }
  }

  // Fallback — use first project but warn
  console.warn(`    ⚠️  Multiple projects found; using first: "${projects[0].name}" (${projects[0].id})`);
  console.warn(`    Add NEON_PROJECT_ID=<id> to .env to be explicit.`);
  console.warn(`    Available: ${projects.map(p => `${p.id} (${p.name})`).join(' | ')}`);
  return projects[0].id;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const envContent = readFileSync(ENV_PATH, 'utf-8');
  const envVars    = parseEnv(envContent);

  // ── Guard: API key ────────────────────────────────────────────────────────
  const apiKey = envVars.NEON_API_KEY;
  if (!apiKey) {
    console.error('\n❌  NEON_API_KEY not found in .env\n');
    console.error('   1. Go to https://console.neon.tech/app/settings/api-keys');
    console.error('   2. Create a new API key');
    console.error('   3. Add to .env:  NEON_API_KEY=your_key_here\n');
    process.exit(1);
  }

  const branchName = detectBranchName();
  console.log(`\n🌿  Target branch: ${branchName}`);

  // ── Resolve project ───────────────────────────────────────────────────────
  const projectId = await resolveProjectId(apiKey, envVars);

  // ── Check branch doesn't already exist ───────────────────────────────────
  const { branches } = await neonApi(apiKey, `/projects/${projectId}/branches`);
  const existing = branches.find(b => b.name === branchName);
  if (existing) {
    console.log(`\n⚠️   Branch "${branchName}" already exists (${existing.id}).`);
    console.log('    Fetching its connection string…');

    const endpointsRes = await neonApi(apiKey, `/projects/${projectId}/endpoints`);
    const ep = endpointsRes.endpoints.find(e => e.branch_id === existing.id && e.type === 'read_write');
    if (!ep) {
      console.error('❌  No read-write endpoint found on existing branch. Create one in the Neon console.');
      process.exit(1);
    }

    const { uri } = await neonApi(
      apiKey,
      `/projects/${projectId}/connection_uri?branch_id=${existing.id}&database_name=neondb&role_name=neondb_owner&pooled=true`
    );
    applyToEnv(envVars, branchName, existing.id, uri, projectId);
    return;
  }

  // ── Create branch + endpoint ──────────────────────────────────────────────
  console.log('⚙️   Creating branch and endpoint (this takes ~5s)…');
  const { branch, endpoints } = await neonApi(
    apiKey,
    `/projects/${projectId}/branches`,
    'POST',
    {
      branch:    { name: branchName },
      endpoints: [{ type: 'read_write' }],
    }
  );
  console.log(`✅  Branch created: ${branch.name} (${branch.id})`);
  console.log(`    Endpoint:        ${endpoints[0].id} — ${endpoints[0].host}`);

  // ── Get pooled connection string ──────────────────────────────────────────
  console.log('🔗  Fetching connection string…');
  const { uri } = await neonApi(
    apiKey,
    `/projects/${projectId}/connection_uri?branch_id=${branch.id}&database_name=neondb&role_name=neondb_owner&pooled=true`
  );

  applyToEnv(envVars, branchName, branch.id, uri, projectId);
}

function applyToEnv(envVars, branchName, branchId, uri, projectId) {
  const updated = { ...envVars };

  // Preserve the main connection string so you can switch back
  if (!updated.NEON_MAIN_DATABASE_URL && updated.VITE_DATABASE_URL) {
    updated.NEON_MAIN_DATABASE_URL = updated.VITE_DATABASE_URL;
  }

  updated.VITE_DATABASE_URL = uri;
  updated.NEON_PROJECT_ID   = projectId;
  updated.NEON_BRANCH_NAME  = branchName;
  updated.NEON_BRANCH_ID    = branchId;

  writeFileSync(ENV_PATH, serializeEnv(updated));

  console.log(`
✅  .env updated

   VITE_DATABASE_URL   → your personal branch (${branchName})
   NEON_MAIN_DATABASE_URL → original main DB (preserved)

   Next step:
     pnpm db:migrate     seed your branch with fresh data

   To switch back to main:
     swap VITE_DATABASE_URL ↔ NEON_MAIN_DATABASE_URL in .env
`);
}

main().catch(err => {
  console.error('\n❌ ', err.message);
  process.exit(1);
});
