# OMOS Pulse Dashboard

Retail media analytics dashboard for the OnlineSales/Localium platform. Built with React, Vite, and the Osmos design system (`@rishikeshjoshi-morpheus/ui`).

---

## Getting started

```bash
pnpm install
pnpm dev              # all three apps (chooser, retailer, advertiser)
pnpm dev:retailer     # retailer console only
pnpm dev:advertiser   # advertiser Beat console only
pnpm build
```

---

## Database (Neon)

The app uses a shared [Neon](https://neon.tech) PostgreSQL database for all mock data — campaigns, advertisers, display pages, inventories, wallets, yield control rows, and more. Each developer works on their own **instant database branch** so nobody's migrations affect anyone else.

### First-time setup (new contributors)

**1. Copy the env template**
```bash
cp .env.example .env
```

**2. Fill in two values in `.env`**

| Variable | Where to get it |
|----------|----------------|
| `VITE_DATABASE_URL` | Ask a teammate — it's the main branch connection string (in the team password manager) |
| `NEON_API_KEY` | Your personal key — generate at [console.neon.tech/app/settings/api-keys](https://console.neon.tech/app/settings/api-keys) |

**3. Create your personal database branch**
```bash
pnpm db:branch
```
This calls the Neon API, creates an isolated copy of the database under `dev/your-git-name`, and updates `VITE_DATABASE_URL` in your `.env` to point to it. The original main URL is preserved as `NEON_MAIN_DATABASE_URL`.

**4. Seed your branch**
```bash
pnpm db:migrate
```
Drops and recreates all 17 tables in *your branch only*, then seeds them with realistic mock data. Nobody else's data is touched.

---

### DB scripts

| Command | What it does |
|---------|-------------|
| `pnpm db:branch` | Creates a personal Neon branch (`dev/<your-git-name>`) and updates `.env` |
| `pnpm db:branch dev/custom-name` | Same, with an explicit branch name |
| `pnpm db:migrate` | Resets + reseeds all tables on your current branch |

---

### Schema — 17 tables

| Table | Contents |
|-------|----------|
| `advertisers` | 9 merchants with persona, payment type, onboarding metadata |
| `platform_users` | 15 users across super_admin / ops / admin / advertiser roles |
| `campaigns` | 20 campaigns (display + sponsored) with full metrics |
| `products` | 8 products with category, brand, price, stock |
| `display_pages` | Page Setup data — name, API ID, tag, impressions, inventory usage |
| `display_inventories` | Inventory slots linked to pages, with position + status |
| `targeting_keys` | BYOT targeting keys |
| `targeting_values` | Values per targeting key (joined via `key_id`) |
| `wallets` | Per-advertiser wallet balances and top-up counts |
| `wallet_transactions` | Transaction log — Top-Up, Deduction, Refund |
| `wallet_rules` | Automated wallet rules (triggers, segments, rule types) |
| `audience_attributes` | Audience targeting attributes for Audience Manager |
| `activity_logs` | Platform audit log — user, action, description, timestamp |
| `display_demand_supply` | Display ad placement metrics (fill rate, CPM, impressions) |
| `sponsored_demand_supply` | Sponsored ad unit metrics (fill rate, CPC, clicks) |
| `product_yield_cpc` | CPC yield control by category (floor, ceiling, multiplier, perf metrics) |
| `product_yield_cpm` | CPM yield control by category |

---

### Using DB data in a component

The query layer lives in `src/db/queries/`. Drop the hardcoded mock array and replace with a single hook call:

```jsx
// Before — hardcoded mock data
const PAGE_DATA = [
  { name: 'TestQA98', apiId: 'home_pg', ... },
  ...
];

// After — live Neon query
import { useQuery } from '../../hooks/useQuery';
import { getDisplayPages } from '../../db/queries/displayAds';

const { data: pages, loading } = useQuery(getDisplayPages);
```

Available query functions:

| Import from | Functions |
|-------------|-----------|
| `src/db/queries/advertisers` | `getAdvertisers`, `getAdvertiserById`, `getOnboardingCatalog` |
| `src/db/queries/users` | `getSuperAdminUsers`, `getOpsUsers`, `getAdvertiserUsers` |
| `src/db/queries/campaigns` | `getCampaigns`, `getDisplayCampaigns`, `getSponsoredCampaigns` |
| `src/db/queries/displayAds` | `getDisplayPages`, `getDisplayInventories`, `getDisplayDemandSupply`, `getTargetingKeys`, `getTargetingValues` |
| `src/db/queries/finance` | `getWallets`, `getWalletTransactions`, `getWalletRules`, `getFinanceAdvertisers` |
| `src/db/queries/controlCenter` | `getAudienceAttributes`, `getActivityLogs`, `getProducts`, `getSponsoredDemandSupply` |
| `src/db/queries/yieldControl` | `getCPCYieldRows`, `getCPMYieldRows` |

---

### Branching model

```
neondb (main branch)      ← clean seed, only CI/migration-owner touches this
  ├── dev/rishikesh       ← your personal branch, fully isolated
  ├── dev/alice           ← Alice's branch
  └── dev/bob             ← Bob's branch
```

Branches are **zero-copy and instantaneous** — Neon only stores the delta. Running `pnpm db:migrate` on your branch costs nothing and affects nobody else. To switch back to the main branch at any time, swap `VITE_DATABASE_URL` and `NEON_MAIN_DATABASE_URL` in your `.env`.

---

## Installing skills in another repo

If you are **not** forking this repo but want the same Claude Code skills in your own project, install the published npm package:

### Prerequisites

1. **Claude Code** — `npm install -g @anthropic-ai/claude-code`
2. **GitHub PAT** with `read:packages` scope — [generate one here](https://github.com/settings/tokens)
3. Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
   ```bash
   export NPM_TOKEN=ghp_your_token_here
   ```

### Add registry config

Add to your project's `.npmrc`:
```
@rishikeshjoshi-morpheus:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### Install

```bash
pnpm add -D @rishikeshjoshi-morpheus/claude-skills
```

All 13 skills are copied into `.claude/skills/` automatically by the postinstall script. Claude Code picks them up immediately — no restart needed.

### Daily vault rebuild (optional)

To grow an Obsidian knowledge vault daily at 12:00pm, run once after install:

```bash
pnpm setup:vault-cron
```

To update skills when a new version is published:

```bash
pnpm update @rishikeshjoshi-morpheus/claude-skills
```

---

## Claude Code setup (for forks)

This repo ships with a full Claude Code skill suite in `.claude/skills/`. Some skills work immediately after cloning; others require external tools or plugins that are **not committed to git**.

### Skills that work immediately

No setup needed — pure file reads and code generation:

| Skill | What it does |
|-------|-------------|
| `react-implementer` | Generates production React from a Screen Spec or wireframe |
| `token-enforcer` | Audits JSX/CSS for hardcoded design values; auto-replaces with `var(--osmos-*)` tokens |
| `lineicon-enforcer` | Replaces hand-rolled SVG icons with design-system named icon exports |
| `component-reuse-enforcer` | Audits for locally-defined components that duplicate `src/ui/`; extends the library with Figma-style variations before replacing |
| `shadcn-to-osmos` | Migrates shadcn/ui + Tailwind pages to Osmos components |
| `ux-auditor` | UX honeycomb audit on any screen or code |
| `design-critic` | Multi-agent design critique (Priya · Arjun · Meera · Zara → Rigor Matrix) |
| `obsidian-knowledge-graph` | Builds an Obsidian vault from component + page metadata |

### Skills that need the Figma MCP

These skills call the Figma API via an MCP server. Without it they either fail or fall back to screenshot-only mode:

| Skill | Degraded without MCP |
|-------|---------------------|
| `figma-batch-builder` | Fully blocked — requires Figma node access |
| `figma-wireframer` | Fully blocked |
| `screen-interpreter` | Works for screenshots/text; Figma URLs blocked |
| `design-orchestrator` | Screenshot path works; Figma path blocked |
| `ux-ideator` | IA + lo-fi works; Figma wireframe step blocked |

**How to connect the Figma MCP:**

1. Install the Figma MCP server (follow [Figma's MCP docs](https://www.figma.com/developers/mcp))
2. Once connected, add the `use_figma` permission to your local `.claude/settings.local.json`:

```json
{
  "permissions": {
    "allow": [
      "mcp__<your-figma-mcp-id>__use_figma"
    ]
  }
}
```

> `settings.local.json` is gitignored — each developer configures their own MCP IDs.

### Skills that need `graphify`

The `obsidian-knowledge-graph` skill reads `graphify-out/graph.json` for import-edge data during full vault rebuilds. The `.venv/` directory is gitignored.

```bash
python3 -m venv .venv
.venv/bin/pip install graphifyy
.venv/bin/graphify update .   # generates graphify-out/
```

The skill still works without graphify — it falls back to reading source files directly. You just won't get cross-file import edges in the vault.

### Skills that need Claude Code plugins (user-level install)

These are **not in the repo** — they live in `~/.claude/` and must be installed per developer via the Claude Code plugin marketplace:

| Plugin / Skill | Install command |
|----------------|----------------|
| `anthropic-skills:skill-creator` | `claude plugin install skill-creator` |
| `anthropic-skills:osmos-pmm` | `claude plugin install osmos-pmm` |
| `anthropic-skills:osmos-brand` | `claude plugin install osmos-brand` |
| `anthropic-skills:osmos-figma-tokens` | `claude plugin install osmos-figma-tokens` |
| `anthropic-skills:pdf`, `pptx`, `docx`, `xlsx` | `claude plugin install <name>` |
| `anthropic-skills:consolidate-memory` | `claude plugin install consolidate-memory` |
| `osmos-product-marketing:osmos-pmm` | Install from Osmos org marketplace |
| `cowork-plugin-management:*` | Install from Cowork marketplace |

> These plugins provide document handling, brand guidelines, and product marketing skills. The core design-to-code pipeline works without them.

### Full setup checklist for a new fork

```
[ ] pnpm install
[ ] python3 -m venv .venv && .venv/bin/pip install graphifyy
[ ] .venv/bin/graphify update .
[ ] pnpm setup:vault-cron              ← registers daily 12pm vault rebuild
[ ] Connect Figma MCP server + add permission to settings.local.json
[ ] claude plugin install <any anthropic-skills you need>
[ ] Say "sync obsidian vault" to Claude to build the knowledge vault
```

---

## Reviewing contributions with skills

When a fork adds a new screen, feature, or component, run this sequence in Claude Code before merging. Each skill can be invoked by typing it in chat:

### Before building (design phase)

| What to do | Skill / prompt |
|---|---|
| Turn a PRD or feature brief into IA + wireframe options | `ux-ideator --prd docs/prd/<feature>.md` |
| Critique a design, mockup, or proposed workflow | `design-critic` then describe the feature or paste a Figma URL |

`ux-ideator` produces a full pipeline: PRD Digest → Information Architecture map → two competing lo-fi wireframe concepts (deliberated by agents Noor and Dev) → Rigor Matrix quality gate → finished React UI. You can stop at any phase with `--focus ia`, `--focus lofi`, or `--focus critique`.

`design-critic` runs four agents in sequence — Priya (feasibility), Arjun (UX), Meera (business), Zara (delight) — and produces a scored Rigor Matrix with a clear Verdict. Use it whenever you want a structured second opinion before committing to an implementation.

---

### After building (code quality)

Run these three against every PR that adds or modifies UI components. They are fast (grep + read + edit) and can run on a single file or the entire `src/` tree.

```
component-reuse-enforcer --file src/retailer/components/MyNewPage.jsx
token-enforcer --file src/retailer/components/MyNewPage.jsx
lineicon-enforcer
```

Or scan the whole changed directory:

```
component-reuse-enforcer --dir src/retailer/components --no-fix
token-enforcer --dir src/retailer/components
```

| Skill | What it catches | Auto-fixes? |
|---|---|---|
| `component-reuse-enforcer` | Locally-defined components that duplicate `src/ui/` exports; components that need a new `src/ui/` variant | Tier 1 yes; Tier 2 asks first; Tier 3 user-gated |
| `token-enforcer` | Hardcoded hex colors, px values, font sizes that should be `var(--osmos-*)` | Tier 1 yes; Tier 4 asks |
| `lineicon-enforcer` | Hand-rolled `<svg>` icons that match an existing named export in `src/ui/atoms/Icon.jsx` | Yes, auto-replaces with named imports |

---

### Final UX check

Before the PR is merged, run a UX audit against the finished screen:

```
ux-auditor
```

Then paste the file path or take a screenshot. The audit scores against Peter Morville's UX Honeycomb (Useful · Usable · Findable · Credible · Desirable · Accessible · Valuable) and produces a prioritised fix list.

---

### Typical review sequence (copy-paste into Claude Code)

```
1. "Run component-reuse-enforcer --no-fix --dir src/retailer/components"
   → review the report; approve or reject Tier 2 extensions

2. "Run token-enforcer --dir src/retailer/components"
   → auto-applies Tier 1/2; flags Tier 4 for your decision

3. "Run lineicon-enforcer"
   → replaces any hand-rolled SVG icons

4. "Run ux-auditor on [path to new screen file]"
   → score and fix list; re-run if score < 14/21

5. pnpm build
   → confirm clean build before merging
```

---

## Knowledge systems

The repo maintains three layered knowledge sources that Claude reads before working:

| Source | Location | What it tracks |
|--------|----------|---------------|
| Skill knowledge graph | `.claude/skills/figma-batch-builder/knowledge-graph.md` | All wired pages, nav IDs, Figma frame history, component patterns |
| AST code graph | `graphify-out/` | File-level import edges and community clusters |
| Obsidian vault | `obsidian-vault/` | Interlinked notes for components, pages, Figma frames, nav structure, token audit |

The Obsidian vault updates automatically every time Claude writes a `src/` file (via a `PostToolUse` hook in `.claude/settings.json`). A full rebuild of all `src/` files also runs daily at **12:00pm** via a crontab entry registered by `pnpm setup:vault-cron`. Logs go to `.claude/vault-rebuild.log`. For an on-demand rebuild, say **"sync obsidian vault"** in any Claude Code session.

---

## Project structure

```
src/
├── retailer/          Legacy retailer console (50+ pages)
├── advertiser/        Advertiser "Beat" console (shadcn + Tailwind → Osmos migration in progress)
├── chooser/           Landing page / app selector
├── ui/                Shared component library (atoms, molecules, patterns)
├── db/
│   ├── client.js      Neon HTTP client (reads VITE_DATABASE_URL)
│   └── queries/       Per-entity query functions (advertisers, campaigns, displayAds, …)
└── hooks/
    └── useQuery.js    Generic React hook: useQuery(queryFn, ...args)

.claude/
├── skills/            14 Claude Code skills (design-to-code pipeline + review suite)
└── settings.json      Hooks: PreToolUse graphify hint + PostToolUse vault sync

graphify-out/          AST knowledge graph (generated, committed)
obsidian-vault/        Obsidian-compatible knowledge vault (generated, committed)
scripts/
├── db-branch.js       Creates a personal Neon DB branch + updates .env (pnpm db:branch)
├── db-migrate.js      Drops + recreates + seeds all 17 tables (pnpm db:migrate)
├── vault-sync.py      Incremental vault updater (called by PostToolUse hook)
├── rebuild-vault.sh   Full daily vault rebuild (run by cron at 12:00pm)
├── setup-cron.js      Registers the daily cron entry (pnpm setup:vault-cron)
└── sync-skills.js     Syncs .claude/skills/ → claude-skills/ before publish

claude-skills/         Publishable npm package (@rishikeshjoshi-morpheus/claude-skills)
├── package.json
├── install.js         Postinstall — copies skills to consumer's .claude/skills/
└── skills/            Snapshot of all 13 skills (generated by pnpm sync:skills)
```
