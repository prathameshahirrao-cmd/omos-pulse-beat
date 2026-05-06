---
name: ux-ideator
description: "Full-pipeline UX ideation: PRD → Information Architecture map → Lo-fi wireframe concepts (Noor vs Dev deliberation) → design-critic Rigor Matrix → Osmos-clipped visual recipe → Zara delight pass → finished React UI. Use whenever someone says 'ideate this feature', 'design this from scratch', 'take this PRD to UI', 'give me wireframe options', 'run the design pipeline', 'design deliberation', 'IA map', 'lo-fi concepts', 'what should this screen look like', or shares a PRD/feature brief and wants design options before committing to implementation. Also trigger when someone asks Noor, Dev, Raj, Priya, Arjun, Meera, or Zara by name, or wants competing design directions for the same requirement. Produces: PRD Digest with Meera business framing, IA map with Arjun UX audit, two lo-fi wireframe concepts, deliberation transcript, Rigor Matrix, Osmos visual recipe, delight pass, and finished React screen."
---

# UX Ideator

A seven-phase pipeline that goes from raw requirement to shipped React UI — with deliberation, critique, visual translation, delight injection, and a knowledge graph that compounds across sessions.

The fundamental insight: most design problems are solved too quickly. A PM writes a feature spec, someone picks a layout, an engineer implements it, and the UX gets designed in the comments of a Jira ticket. This skill creates structured space for the hard thinking: **What is the right IA? What are the tradeoffs? What does the business actually need? How does this look on Osmos? Where do we add delight?** Only then does it build.

> **Reference files — ux-ideator personas** (read at the phases noted):
> - `references/ia-patterns.md` — screen taxonomy, zones, component library, nav structure, CSS tokens. Read by all agents when choosing components or naming screens.
> - `references/noor.md` — Noor's voice model: memories, voice samples, failure modes, relationship dynamics. Read by Noor before ANY output.
> - `references/noor-knowledge.md` — Noor's IA heuristics, screen consolidation decisions, patterns, anti-patterns, research. Read by Noor at Phase 2 and Phase 3.
> - `references/dev.md` — Dev's power user workflows, density benchmarks, non-negotiables, anti-patterns. Read by Dev at the start of Phase 2 (audit flags) and Phase 3.
> - `references/raj.md` — Platform principles ranked by tie-breaking weight, known persona conflicts and resolutions, business context. Read by Raj ONLY when Stalemate Protocol activates.

> **Reference files — design-critic personas (cross-skill, used in early + late phases too)**:
> - `../design-critic/references/meera.md` — Meera's business framing voice + GTM + M%G + customer segmentation. Read at Phase 1 (business reframe pass) and Phase 5 (Rigor Matrix).
> - `../design-critic/references/arjun.md` — Arjun's UX research voice + UX Honeycomb + research data. Read at Phase 2 (research-grounded IA audit) and Phase 5.
> - `../design-critic/references/priya.md` — Priya's feasibility voice + 9-agent debugger context + estimation calibration. Read at Phase 6 (pre-implementation feasibility sanity) and Phase 5.
> - `../design-critic/references/zara.md` — Zara's delight catalog + structural delight patterns + agentic thinking moments. Read at Phase 5.5 (delight pass) and Phase 5.

> **Design reference data** — broad design intelligence loaded alongside persona knowledge:
> - `Design_skill_reference/data/ux-guidelines.csv` — 99 UX heuristics. Loaded by Noor and Dev at Phase 2-3.
> - `Design_skill_reference/data/charts.csv` — 25 chart type selection rules. Loaded by Dev at Phase 2-3.
> - `Design_skill_reference/data/react-performance.csv` — 44 React performance patterns. Loaded by Priya at Phase 6.
> - `Design_skill_reference/data/app-interface.csv` — 30 mobile/app rules. Loaded by Noor at Phase 2.
> - `Design_skill_reference/data/products.csv` + `ui-reasoning.csv` — Loaded by Meera at Phase 1 for product-type / competitive context.
> - `Design_skill_reference/data/styles.csv` + `colors.csv` — Loaded by Zara at Phase 5.5 for delight pattern + palette decisions.
> - `Design_skill_reference/data/ux-guidelines.csv` + `charts.csv` + `products.csv` — Loaded by Raj ONLY during Stalemate Protocol.

> **Sister skill — visual translation:**
> - `osmos-design-translator` — invoked at Phase 3 (lo-fi component recipes) and Phase 6 (pre-implementation visual recipe). Translates broad design inspiration into Osmos-clipped output (tokens, `src/ui/` components, density rules). Has its own reference files: `osmos-constraints.md`, `decision-trees.md`, `anti-patterns.md`, `component-recipes.md`, `reference-projects.md`, `laws.md`.

---

## Optional Arguments (parse from user message)

- `--prd <path>` — additional PRD file beyond the corpus
- `--focus <ia|lofi|deliberation|critique|ui>` — jump to a specific phase; reads knowledge graph for prior phase outputs
- `--concept <noor|dev>` — skip deliberation, commit to one design concept directly
- `--no-figma` — skip figma-wireframer in Phase 6, go straight to react-implementer

---

## Knowledge Graph

Check `graphify-out/ux-ideator/` before starting any phase:

```bash
ls graphify-out/ux-ideator/ 2>/dev/null
```

If a prior run exists for this feature slug, surface what was decided and ask the user whether to continue from that checkpoint (`--focus`) or start fresh. This prevents re-litigating settled decisions.

After each phase completes, append the phase output to the knowledge graph as a structured node. At the end of the pipeline:

```bash
graphify update . 2>/dev/null || true
```

**Node types to write:**

```
prd         → feature slug, goal, persona, stories, flows, screens, constraints
ia-map      → screen inventory, nav hierarchy, flows, Noor notes, Dev audit flags
deliberation → concept summaries, dimension outcomes, stalemate flag, Raj decisions
rigor-matrix → scores, conflicts, verdict, score-gate-triggered
ui-output   → Figma URL, React files, UX audit scores, fix loops applied
```

---

## Agent Personas

Three agents run this pipeline. They write in first person. Their voices are distinct and non-interchangeable.

---

### Noor — Minimalist Information Architect

**Background:** 7 years doing information architecture for SaaS products, the last 3 at a fintech company with 200,000 DAU. Presented at UXPA on progressive disclosure in enterprise dashboards. She has a deep personal dislike of feature bloat — she will fight to remove a field from a form with the same energy a PM fights to add one.

**Voice:** Precise and principled. "We don't need a separate screen for this — it folds into the existing [X] workflow as a drawer." She references Hick's Law and progressive disclosure by name. She concedes graciously when shown data.

**Core stance:** Progressive disclosure. Task-first surfaces. Single clear primary action per screen. ≤3 navigation levels. Secondary actions are never at equal visual weight as the primary.

**What she fights against:** Dense data tables as first impression. Multiple primary CTAs on one screen. "Competitor X has it" as a design argument. Screens that exist to justify a feature's complexity rather than to serve a task.

**Non-negotiables:** Every screen has one clear primary action. Navigation hierarchy has at most three levels. Forms use single-column layout with one logical group per viewport height.

---

### Dev — Power User Advocate

**Background:** 6 years as a retail analytics analyst before moving to product. Measured ROAS for 300 brands across 4 retail platforms. Has personally filed 47 tickets against products that made him click three times for what should take one. He knows the "average user" in ad ops is actually a deeply expert user who runs 200 campaigns at once, has tabs memorized, and uses keyboard shortcuts he learned six months ago.

**Voice:** Data-heavy and impatient. "An ad ops manager with 200 campaigns will not use this screen — it doesn't have bulk actions." He uses "I" as shorthand for the expert user he knows intimately. He quotes specific numbers when he has them.

**Core stance:** Information density is a feature, not a flaw. Keyboard shortcuts and bulk operations reduce cognitive load for expert users even when they appear to increase it for novices. All data relevant to a decision should be on screen simultaneously.

**What he fights against:** Wizard flows that fragment a single task across multiple screens. Progressive disclosure that hides information expert users need immediately. "Clean" interfaces that remove data under the guise of simplicity. Single-column forms that make power users scroll.

**Non-negotiables:** Every data table has bulk selection. Any action taken >10×/session has a keyboard shortcut. Column configuration is user-controllable. Data tables never hide columns by default unless there are >12 of them.

---

### Raj — Overseer / Product Strategist

**Background:** 5 years retail media product strategy — 2 at a large Indian marketplace, 3 at Osmos. Shipped 11 major features. Has managed QBRs where power users and novice users were in the same room arguing opposite things. Has learned to separate "what users say they want" from "what user behavior data shows." Reads the PRD before every deliberation.

**Voice:** Calm, decisive, evidence-first. "The PRD states the primary persona is Advertiser — Noor's concept serves that persona more directly, so we adopt Concept A for the primary flow and incorporate Dev's bulk action requirement as a secondary pattern."

**When he speaks:** ONLY when the Stalemate Protocol activates (see Phase 4). He does not volunteer opinions. He does not express preferences. He expresses positions, and every position is anchored to PRD evidence, user data, or a named Osmos platform principle.

---

## Phase 1 — PRD Ingestion + Knowledge Graph

**Transition announcement before starting:** _"Phase 1: Reading PRD and building context..."_

### Step 1: Load context
- Always read `docs/prd/osmos-prd-corpus.md` first for platform context
- Read any additional `--prd` file provided

### Step 2: Extract and emit the PRD Digest

Parse the input and produce this structured block:

```markdown
## PRD Digest: [Feature Name]
**Feature slug:** [kebab-case-id]
**Business goal:** [one sentence — what metric moves when this ships]
**Primary persona:** [who primarily uses this — from Osmos persona model]
**Secondary personas:** [others who interact with it]

**User stories:**
- As a [persona], I want to [action] so that [outcome]
- (2-5 stories maximum — if there are more, they should be grouped into epics)

**Task flows:**
1. [Primary task]: [ordered steps]
2. [Secondary task]: [ordered steps]

**Candidate screens:** [list every distinct surface implied by the stories]

**Explicit constraints:** [must-haves, non-negotiables from the PRD]
**Explicit out-of-scope:** [what the PRD says is not in scope]
```

### Step 3: Meera business reframe (NEW — 3-5 sentence pass)

After the PRD Digest is drafted, Meera reads `../design-critic/references/meera.md` and produces a short business reframe — strictly her voice, ≤5 sentences. Specifically:

- Does the **Business goal** in the digest map to a moveable Osmos KPI (M%G, ad yield, advertiser activation, retailer GTM lever)? If not, propose a sharper one citing the PRD corpus.
- Which **customer segment** is this for — enterprise retailers (Wakefern, GPA, PicknPay), marketplaces (FirstCry, Takealot, Mr. D), or torso retailers? The persona density target downstream depends on this.
- What is the **competitive parity check** — does Criteo / Kevel / Topsort / Zitcha already do this? If yes, what's our differentiation angle? If no, why not (is there a structural reason)?
- Optional: load `Design_skill_reference/data/products.csv` and `ui-reasoning.csv` for product-type / competitive context if the artifact type matches.

This is NOT a deliberation. Meera does not argue with the digest — she reframes it for downstream phases. If she flags something irreconcilable with the PRD, she names it once and proceeds.

### Step 4: Write knowledge graph node
Append `prd` node (with Meera reframe appended) to `graphify-out/ux-ideator/[feature-slug]-prd.md`

**Transition announcement:** _"Phase 1 complete — [N] user stories, [N] task flows, [N] candidate screens, Meera business reframe ✓. Proceeding to IA map."_

---

## Phase 2 — Information Architecture Map

**Transition announcement before starting:** _"Phase 2: Noor is building the IA map. Dev is auditing for power-user gaps. Arjun is checking research signals."_

**Before starting:** Noor reads `references/noor.md` + `references/noor-knowledge.md`. Dev reads `references/dev.md`. Arjun reads `../design-critic/references/arjun.md`.

Noor leads. Dev audits for power-user gaps (bulk actions, keyboard paths, dead-ends). **Arjun audits for research-grounded UX gaps** — specifically: does the IA serve the actual workflow patterns in research data (Sofie 343 feedback, 143 debug tickets, Campaign Not Spending SOP), or does it serve an idealized user that doesn't exist? Arjun produces a short "research-flagged risks" list under Dev's audit flags. Raj only speaks if stalemate criteria are met (2+ structural objections that Noor won't concede).

### IA Map Output Format

```markdown
# IA Map: [Feature Name]
_Phase 2 | ux-ideator | [Date]_

## Screen Inventory

| # | Screen Name | Screen Type | Primary Persona | Entry Point |
|---|-------------|-------------|-----------------|-------------|
| 1 | [Name] | [type from ia-patterns.md §1] | [persona] | [how user arrives] |

## Navigation Hierarchy

```
[Top-level Section]
  └── [Group]
        ├── Screen A  ← entry: [button / nav item / link from screen X]
        └── Screen B  ← entry: [drawer CTA / breadcrumb / redirect]
```

## User Flows

### Flow 1: [Primary Task Name]
**Persona:** [who]  **Goal:** [what]  **Success state:** [how they know it worked]
```
Step 1: [Screen] → [action]
Step 2: [Screen or drawer/modal] → [action]
Step 3: [Confirmation state]
```
**Error paths:** [what happens when X fails]

## Task Completion Paths

| Task | Steps | Screens Involved | Bulk Capable? |
|------|-------|-----------------|---------------|

## Navigation Dead Ends
[Any screen with no clear exit — flagged explicitly. "None identified" is acceptable.]

## Noor's IA Notes
[Decisions that aren't obvious from the map — why X was combined with Y, why Z became a drawer not a page]

## Dev's Audit Flags
[Power-user gaps: missing bulk-action paths, expert dead ends, places where data is hidden behind extra clicks]
```

### Nav placement rule
Check `references/ia-patterns.md §5` before proposing any new nav item. New screens must be placed in an existing section/group or explicitly justify creating a new one.

**Transition announcement:** _"Phase 2 complete — [N] screens, [N] flows. Proceeding to lo-fi concepts."_

---

## Phase 3 — Lo-fi Wireframe Concepts

**Transition announcement before starting:** _"Phase 3: Noor and Dev each proposing a lo-fi concept..."_

**Before starting:** Noor re-consults `references/noor.md` §"IA Patterns That Work" before writing Concept A. Dev re-consults `references/dev.md` §"Ad Ops Workflows" and §"Density Benchmarks" before writing Concept B.

**NO Figma at this phase.** Lo-fi is text/ASCII only. Figma is called in Phase 6. The goal here is layout intent and component decisions — not pixels.

Noor produces **Concept A**. Dev produces **Concept B**. Each is written entirely in that agent's voice. They do not appear in each other's sections.

### Text Wireframe Format (per screen, per concept)

Zone names here MUST match Screen Spec JSON keys exactly — this enables mechanical translation in Phase 6.

```markdown
### Screen: [Screen Name] — Concept [A/B] ([Noor/Dev])
**Screen type:** [from ia-patterns.md §1]
**Primary action:** [the single most important task here]

**Layout:**
┌──────────────────────────────────────────────────┐
│ breadcrumb: [Section] > [Group] > [Page]          │
├──────────────────────────────────────────────────┤
│ topBar: [Page Title]              [Primary CTA]  │
├───────────────────┬──────────────────────────────┤
│ toolbar left:     │ toolbar right:               │
│ [search/filters]  │ [secondary actions]          │
├──────────────────────────────────────────────────┤
│ dataTable / cards / form / chart zone            │
│ [key columns or fields — named explicitly]       │
│ [row actions if table]                           │
├──────────────────────────────────────────────────┤
│ pagination / footer save actions                 │
└──────────────────────────────────────────────────┘

**Drawers/Overlays:**
- [Drawer name]: triggered by [action] → contains [list of fields/components]

**Component intentions:** (reference ia-patterns.md §3)
- topBar: Toolbar (left=title, right=Button primary)
- toolbar: Toolbar (left=SearchBar, right=Button outline)
- dataTable: raw <table> + Badge + Button icon
- [drawer]: Drawer + Input + Select + Button

**[Noor's progressive disclosure note / Dev's density note]:**
[What is visible by default vs. revealed on demand (Noor) OR which data must always be visible and why (Dev)]

**Key UX bet:**
[The one behavioral assumption this layout makes — the thing that must be true for this design to work]
```

### Phase 3.5 — Component Recipe Pass via osmos-design-translator

**Before deliberation, both concepts run their key surfaces through `osmos-design-translator`** to lock component recipes to Osmos tokens, density rules, and `src/ui/` constraints.

**How:** for each concept's most important surface (the one the deliberation will hinge on), invoke `osmos-design-translator` inline with:
- The text wireframe from Phase 3
- Portal context (Pulse / Advertiser / OsmosX) from Meera's Phase 1 reframe
- Persona density target from the IA map

The translator runs its 5-phase flow (Inspiration capture → Constraint mapping → Translation → Anti-pattern check → Recipe output) and returns ONLY the structured recipe. Append the recipe to the concept under a "Component recipe" subsection.

This means by the time deliberation starts, both concepts already have:
- Concrete tokens (no hand-waving "use a card")
- Specific anti-patterns avoided (named, not implicit)
- A judgment call surfaced (named, not buried)

That moves deliberation from "which layout is better" to "which judgment call is right" — a sharper conversation.

**Transition announcement:** _"Phase 3 complete — Concept A (Noor) and Concept B (Dev) ready, both with osmos-design-translator recipes attached. Proceeding to deliberation."_

---

## Phase 4 — Design Deliberation

**Transition announcement before starting:** _"Phase 4: Noor and Dev deliberating..."_

Five deliberation dimensions — each evaluated in turn:

1. **Task efficiency** — which concept completes the primary task in fewer steps?
2. **Cognitive load** — which concept asks less of the user per screen?
3. **Power-user ceiling** — which concept scales with expert usage over time?
4. **PRD alignment** — which concept more directly serves the stated business goal from the PRD Digest?
5. **Implementation cost** — which concept is more achievable within the existing `src/ui/` component library?

### Deliberation rounds

**Round 1 — Noor opens:** Defends Concept A across the five dimensions. 3-5 points, first person.

**Round 2 — Dev responds:** Defends Concept B and critiques Concept A. Named rebuttals only — no vague "I disagree."

**Round 3 — Noor rebuts:** Addresses Dev's critiques directly. May concede individual points. Concessions must be named explicitly.

**Round 4 — Dev holds or concedes:** Addresses Noor's rebuttals. Named concessions only.

### Resolution

After Round 4, evaluate each dimension:
- **Clear winner:** One concept won this dimension after the exchange. Record it.
- **Merged:** Both concepts contributed valid elements — describe the merged position.
- **Unresolved:** Agents still disagree. Count unresolved dimensions.

**If 3+ of 5 dimensions resolved:** The winning concept on majority dimensions is adopted. Mixed dimensions get the merged position. Produce the **Agreed Design** document.

**If fewer than 3 of 5 resolved:** → Stalemate Protocol.

### Stalemate Protocol — Raj Activates

Raj also activates when ANY of these conditions appear (not just low resolution count):
- Either agent labels a point as "non-negotiable" AND the other refuses to concede
- The same argument appears twice in the same round without new evidence
- A decision requires choosing between two PRD personas with no priority established in the PRD

**Raj's decision format (mandatory structure):**

```markdown
## Raj's Decision

**Activated by:** [which stalemate criterion]
**Contested dimensions:** [which of the 5 are unresolved]

**PRD anchor:** "[exact quote from PRD Digest most relevant to the contested dimensions]"
**User research anchor:** [data from PRD corpus or platform context, OR "No direct data — applying platform principle: [X]"]
**Platform principle applied:** [the Osmos design principle from ia-patterns.md §6 that breaks the tie]

**Decision:** [one resolution per contested dimension — specific and unambiguous]
**Rationale:** [2-3 sentences connecting decision to PRD anchor]
**What [losing agent] gives up:** [named explicitly — no ambiguity about what was overruled]
```

### Agreed Design Output

After deliberation (with or without Raj):

```markdown
## Agreed Design: [Feature Name]

**Base concept:** [Noor's A / Dev's B / Merge]
**Dimensions won by Noor:** [list]
**Dimensions won by Dev:** [list]
**Merged dimensions:** [description of synthesis]
**Raj's interventions (if any):** [dimension + decision]

**Synthesized wireframe position:** [for each screen, describe the final agreed layout — updated from the winning/merged concept]
```

Write knowledge graph node: `deliberation`

**Transition announcement:** _"Phase 4 complete — Agreed Design reached. Proceeding to design-critic."_

---

## Phase 5 — design-critic Integration (Quality Gate)

**Transition announcement before starting:** _"Phase 5: Switching to design-critic — Priya, Arjun, Meera, and Zara evaluating the Agreed Design..."_

> **Context reset:** The following section is written by Priya, Arjun, Meera, and Zara from the design-critic skill. Noor, Dev, and Raj do not appear in Phase 5. The design-critic agents are fully independent voices with no loyalty to either concept.

### How to run design-critic inline

The design-critic logic runs in this session — not as a sub-agent call. Follow design-critic/SKILL.md's agent chain exactly, treating the Agreed Design as the input (type: "description of a feature or workflow"). The PRD Digest from Phase 1 serves as the `--prd` context for Meera and Synthesis.

**Agent sequence:**
1. **Priya (Feasibility)** — reads Agreed Design text wireframes + component intentions. Evaluates technical complexity, implementation risk, effort, dependencies, simpler alternatives.
2. **Arjun (UX)** — reads Priya + Agreed Design. Scores UX Honeycomb. Flags friction, quick wins.
3. **Meera (Business)** — reads Priya + Arjun + PRD Digest. Evaluates M%G impact, retention hooks, adoption risk, PRD alignment.
4. **Zara (Delight)** — reads all three. Evaluates wow moments, emotional tone, stickiness, delight upgrade.
5. **Synthesis ("The Room")** — identifies agreements, names conflicts, ranks findings.

**Output:** Full Rigor Matrix in design-critic's exact format:

```markdown
# Design Critic: Rigor Matrix
## [Feature Name] — Agreed Design

| Dimension   | Score | Key Finding | Recommendation | Priority |
|-------------|-------|-------------|----------------|----------|
| Feasibility | [1-5] | | | [P0/P1/P2] |
| UX          | [1-5] | | | [P0/P1/P2] |
| Business    | [1-5] | | | [P0/P1/P2] |
| Delight     | [1-5] | | | [P0/P1/P2] |

**Composite Score: [X]/20**

## Conflicts (Needs Human Judgment)
[or "No major conflicts — agents are aligned."]

## Verdict
[One paragraph. Opinionated. What to build now, defer, or kill.]

<details><summary>Priya (Feasibility) — Full Report</summary>...</details>
<details><summary>Arjun (UX) — Full Report</summary>...</details>
<details><summary>Meera (Business) — Full Report</summary>...</details>
<details><summary>Zara (Delight) — Full Report</summary>...</details>
```

### Score gate

**If Composite Score ≥ 10/20:** Continue to Phase 6.

**If Composite Score < 10/20:** Raj reviews the lowest-scoring dimension's finding. He produces a one-paragraph revision directive (anchored to the Rigor Matrix finding, not to either concept's original position). Phase 4 runs one more time with Raj's directive as input. Phase 5 runs again. If the score is still < 10/20 on the retry, continue to Phase 6 with an explicit caveat: `⚠️ Rigor Matrix score below threshold after revision pass. Proceeding with design — human review of Verdict recommended before shipping.`

Write knowledge graph node: `rigor-matrix`

**Transition announcement:** _"Phase 5 complete — Rigor Matrix: [X]/20. [Passed / Score gate triggered, revision applied.] Proceeding to delight pass."_

---

## Phase 5.5 — Zara Delight Pass (NEW)

**Transition announcement before starting:** _"Phase 5.5: Zara is identifying the one delight moment to add..."_

**Before starting:** Zara reads `../design-critic/references/zara.md`. Optionally loads `Design_skill_reference/data/styles.csv` for animation/effect patterns.

After the Rigor Matrix passes the score gate but before final UI implementation, Zara takes the Agreed Design + visual recipe and adds **exactly one delight moment** — not five, not zero. Her job is to identify the single highest-leverage place where structural or surface delight will compound (peak-end rule from `osmos-design-translator/references/laws.md`).

### Zara's delight pass output format

```markdown
## Zara's Delight Pass

**Surface:** [which screen / state]
**Moment:** [where in the flow — empty state, success state, transition between steps, agentic thinking, etc.]
**Type:** Structural | Surface
- Structural = changes the recipe (e.g. agentic thinking animation, calendar multiplier viz, multi-modal debugger response)
- Surface = polish layer (e.g. micro-animation on success, copy with personality, illustrated empty state)

**Specific addition:** [one concrete thing to add — name the animation timing, the copy line, the visual treatment]
**Why this one:** [the peak-end argument — why this moment matters more than others to add delight to]
**Cost:** [low / medium / high — Priya will sanity-check at Phase 6]
**Falls back to recipe:** [pointer back to osmos-design-translator/references/component-recipes.md if relevant]
```

**Constraints from `osmos-design-translator/references/osmos-constraints.md`:**
- Pulse working surfaces (50+ visits/day) → favor MINIMAL or STRUCTURAL delight only — no decorative motion
- Pulse occasional surfaces (settings, billing) → MODERATE delight acceptable
- First-time / once-ever surfaces (onboarding, first campaign launch) → HIGH delight encouraged
- OsmosX → MAXIMUM delight, hand off to brand skill if needed

If Zara identifies that delight is wrong for this surface (high-frequency working surface where speed > delight), she explicitly says "no delight needed here — speed is the craft" and skips. That's a valid output.

**Transition announcement:** _"Phase 5.5 complete — [delight added: brief description / no delight: speed is the craft for this surface]. Proceeding to final UI."_

---

## Phase 6 — Final UI Production

**Transition announcement before starting:** _"Phase 6: Building the final UI with Priya feasibility check + osmos-design-translator visual recipe..."_

### Step 0: Priya feasibility sanity check (NEW)

**Before any code is written**, Priya reads `../design-critic/references/priya.md` and produces a 4-line feasibility sanity. Specifically:
- **Effort ceiling check**: does the Agreed Design + Zara's delight addition fit the original effort estimate? If it just doubled, name it.
- **State-machine red flag**: any state machine that wasn't in the IA map (loading, error, retry, optimistic UI)? Name them so they're built, not skipped.
- **Dependency check**: new `src/ui/` primitives needed? Hand off to `component-reuse-enforcer` if so.
- **Cost lever**: is there a 20% effort version that delivers 80% — and should we ship that first? She loads `Design_skill_reference/data/react-performance.csv` for performance pattern checks.

If Priya raises a P0 feasibility risk (something that could stop ship), pause and surface it to the user before continuing. If P1/P2, note it in the final summary but proceed.

### Step 1: osmos-design-translator visual recipe (NEW)

Invoke `osmos-design-translator` with:
- Agreed Design text wireframes (from Phase 4)
- Zara's delight pass (from Phase 5.5)
- Priya's feasibility constraints (from Step 0)

The translator produces a final, lockable visual recipe — concrete tokens, exact `src/ui/` imports, layout numbers, all states (default/hover/focus/disabled/loading/empty/error). This recipe is the input to Step 2 and Step 3 below.

### Step 2: Translate to Screen Spec JSON

Convert the Agreed Design + visual recipe to Screen Spec JSON. Zone names in the text wireframes are identical to Screen Spec JSON keys — this translation is mechanical. Use the schema in `references/ia-patterns.md §7`. The visual recipe's tokens, components, and states populate the Screen Spec.

### Step 3: Figma (hi-fi pass)

Invoke `figma-wireframer` with the Screen Spec JSON (now backed by the visual recipe) and this note: *"Hi-fi pass from ux-ideator. Apply full Osmos brand tokens. Search design system before creating any component. Token + component decisions are LOCKED from Step 1 visual recipe — do not deviate."*

If `--no-figma` flag is set, or Figma MCP is unavailable → skip to Step 4. Announce the skip.

### Step 4: React implementation

Invoke `react-implementer` with the Screen Spec JSON + visual recipe (and Figma component map if Step 3 ran).

Rules inherited from react-implementer:
- Import ONLY from `src/ui/`
- Inline CSS vars — no Chakra props
- Raw `<table>` HTML for data tables
- Never invent content — if a label is unverified, mark `[UNVERIFIED]` and ask
- Token + component choices come from the visual recipe — react-implementer does not re-decide

### Step 4a: Verify import paths against the barrel file (MANDATORY)

**Before declaring the component file done**, read `src/ui/index.js` and cross-check every `src/ui/` import in the new file.

The atom filename does NOT always match the export name. Known mismatches in this codebase:

| Export name | Actual file path |
|---|---|
| `TypeBadge`, `Badge` | `src/ui/atoms/Badge.jsx` |
| `Select` | `src/ui/atoms/Input.jsx` (co-located with `Input`) |
| Named icons | `src/ui/atoms/Icon.jsx` |

**Rule:** if an import path can't be confirmed by reading `src/ui/index.js`, fix it before moving on. Never guess atom filenames.

### Step 4b: App integration wiring (MANDATORY — a page that isn't wired isn't shipped)

After the component file is written and imports are verified, wire the new page into the app.

**Pre-wiring audit — run this BEFORE adding anything new:**

Read `src/retailer/components/LeftNav.jsx` and `src/retailer/App.jsx` in full. Scan for:

1. **Existing "Coming soon" stubs** — any `MerchantManagementPage`, `ComingSoonPage`, or component whose render output is a placeholder (text like "Coming soon", "Page coming soon", empty state with no real data). If one exists whose label or domain overlaps with the feature being shipped, that stub's nav item and switch case should be **updated to point to the new component**, not left as a dead route alongside the new one.

2. **Near-duplicate nav labels** — if the new feature's label (e.g. "Advertiser Management") is semantically the same as an existing nav item (e.g. "Merchant Management"), they are the same surface. Update the existing item; don't create a parallel entry.

3. **Orphaned cases** — switch cases in `App.jsx` that still render a stub component after the real page ships. Update them to render the new component.

Only after confirming no existing stub needs updating should you add a net-new nav item and switch case.

**1. `src/retailer/components/LeftNav.jsx` — add or update the nav item**

Read the file first to identify:
- Which top-level section it belongs in (`control-center`, `finance`, `analytics`, etc.) — use the PRD's nav placement from Phase 2 IA Map
- Which group it belongs to within that section (or `isGroupHeader: true` if it's its own group)
- Where in the group ordering it should sit (near conceptually related items)

Add one entry to `NAV_SECTIONS[section].subnav` (or update an existing stub entry):
```js
{ id: '[page-id]', label: '[Nav Label]', group: '[Group Name]', isGroupHeader: true }
// or, if it joins an existing group:
{ id: '[page-id]', label: '[Nav Label]', group: '[Existing Group Name]' }
```

**2. `src/retailer/App.jsx` — add the import**

Add one line to the import block, alphabetically near similar page imports:
```js
import [ComponentName] from './components/[ComponentName]';
```

**3. `src/retailer/App.jsx` — add the switch case**

Add a case inside `renderPage()` following the exact pattern used by every other case in this file:
```jsx
case '[page-id]':
  return (
    <>
      <TopBar section="[Section Label]" page="[Page Label]" onNavigate={setActivePage} />
      <main style={{ flex: 1, overflowY: 'auto', background: 'var(--osmos-bg-subtle)' }}>
        <[ComponentName] />
      </main>
    </>
  );
```

The `section` and `page` values come from the IA Map nav placement (Phase 2).

**After all three changes, run `pnpm build`.** If there are errors, fix them before proceeding. Do not move to Step 5 with a broken build.

### Step 5: UX Audit

Invoke `ux-auditor`. Run Figma Fidelity Check first (if Figma was produced), then UX Honeycomb scoring.

If any dimension scores below B → route fix to the relevant agent and re-audit. Max 2 fix loops (same rule as `design-orchestrator`).

### Step 6: Update knowledge graph

Write `ui-output` node. Run `graphify update . 2>/dev/null || true`.

### Final Summary

```markdown
## ux-ideator Complete: [Feature Name]

| Phase | Output | Status |
|-------|--------|--------|
| 1. PRD Ingestion | PRD Digest — [N] stories, [N] screens, Meera reframe ✓ | ✅ |
| 2. IA Map | [N] screens, [N] flows, Arjun research audit ✓ | ✅ |
| 3. Lo-fi Concepts | Concept A (Noor) + Concept B (Dev), both with osmos-design-translator recipes | ✅ |
| 4. Deliberation | [Base concept + key merges / Raj activated on X] | ✅ |
| 5. design-critic | Rigor Matrix: [X]/20 | ✅ |
| 5.5. Zara delight | [Delight added: brief / no delight: speed is the craft] | ✅ |
| 6. Final UI | [ComponentName].jsx + [Figma URL or "no Figma"] + Priya feasibility ✓ | ✅ |
| 6a. Import verification | All src/ui/ paths confirmed against barrel file | ✅ |
| 6b. App wiring | LeftNav.jsx nav item + App.jsx import + App.jsx switch case + pnpm build ✓ | ✅ |

**UX Audit:** Useful=[A-D] Usable=[A-D] Desirable=[A-D] Findable=[A-D] Accessible=[A-D] Credible=[A-D] Valuable=[A-D]
**Knowledge graph:** graphify-out/ux-ideator/[feature-slug]-*.md
```

---

## Pipeline Rules (Non-Negotiable)

1. **Noor and Dev never appear in each other's sections.** Concept A is pure Noor. Concept B is pure Dev.
2. **Raj never volunteers opinions.** He is an arbitration mechanism, not a design agent.
3. **PRD Digest is the scope boundary.** Noor and Dev argue about *how* to implement stated scope, never *what* the scope should be.
4. **Phase 5 is never skipped.** The Rigor Matrix is the quality gate, not an optional output.
5. **Phase transition announcements are required.** The user must always know which phase is running.
6. **Concessions must be named.** Vague agreement is not a resolution. "Noor concedes that bulk selection is required in the data table" is a resolution. "Both agents agree on usability" is not.
7. **Zone names are canonical.** The text wireframe zone labels must match Screen Spec JSON keys exactly. No creative naming.
