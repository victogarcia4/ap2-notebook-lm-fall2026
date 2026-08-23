# HANDOFF — ap2-notebook-lm-fall2026

**Purpose of this file.** Give any model (or human) picking up this repo the fastest possible path to being useful. Read this first, edit it last: whoever finishes a turn on this repo appends to the *Session Log* at the bottom and, if their work changed the shape of the project, updates the relevant section above.

Owner: Dr. Victor Garcia Martinez (vhgarcia100@gmail.com) — sole instructor and coordinator for BIOL 2402 Anatomy & Physiology II, Section 1501, Fall 2026 at Lone Star College.

Remote: https://github.com/victogarcia4/ap2-notebook-lm-fall2026.git (branch `main`).

---

## 1. What this project is

A single-page React/Vite portal for one section of BIOL 2402 (A&P II). Students:

- see the SLO (Student Learning Outcome) map for the semester, grouped by lecture exam;
- submit NotebookLM notebook URLs tied to a specific SLO;
- submit AI-Studio game URLs tied to an SLO (extra credit);
- browse everyone's submissions on a public roster matrix.

Two serverless endpoints (`/api/notebooks`, `/api/games`) commit submissions back to `data/*.json` in **this same repo** via the GitHub Contents API, gated by `ADMIN_PASSWORD`. That means the repo *is* the database — commits from those endpoints will appear on `main` automatically.

Sibling project (same design language, previous semester): https://github.com/victogarcia4/ap1-fall2026-notebook-lm-and-ai-games — treat it as the visual-identity source of truth. The predecessor for this course (last semester, being retired) is https://github.com/victogarcia4/ap2-notebooklm-summer26 — do **not** point new work at it.

## 2. Course scope that must not drift

- **Chapters:** 13–24 only. Chapters 1–12 belong to AP1; do not add them here.
- **Lecture exams:** 5, keyed `exam1`…`exam5` throughout the codebase. Anything that adds a 6th exam or renames these keys is almost certainly wrong.
- **SLO structure:** defined once in [`src/data/outcomes.ts`](src/data/outcomes.ts) as `hapsOutcomes: Record<'exam1'|…|'exam5', LearningOutcome[]>`. Each outcome carries `{ id, chap, topic, desc }`. IDs follow the HAPS convention `AP-19-<letter>-<##>-<##>` — preserve them; students cite them.
- **Roster:** [`src/data/students.ts`](src/data/students.ts), 28 students + 1 instructor row (`id: "INSTRUCTOR"`). The instructor row is load-bearing (App uses it for the instructor persona) — do not delete it. Source of truth for the roster is `../2402 1501 List.csv` in the parent folder.

## 3. Repo layout (only the parts you need)

```
ap2-notebook-lm-fall2026/
├── HANDOFF.md              ← you are here
├── README.md               ← public-facing, keep terse
├── index.html              ← loads Google fonts + Font Awesome (see §5)
├── package.json            ← name: "ap2-notebook-lm-fall2026"
├── vite.config.ts
├── vercel.json, netlify.toml
├── api/
│   ├── notebooks.ts        ← POST/GET/DELETE against data/notebooks.json in THIS repo
│   └── games.ts            ← same shape, data/games.json
├── data/
│   ├── notebooks.json      ← starts []; grows via /api/notebooks commits
│   └── games.json          ← starts []; grows via /api/games commits
├── public/
│   └── VHGM traje azul.png ← instructor avatar; filename has a space
└── src/
    ├── main.tsx
    ├── App.tsx             ← top-level layout + tab routing
    ├── index.css           ← ap1 aesthetic + compatibility bridge (see §5)
    ├── types.ts            ← Student, LearningOutcome, SubmittedNotebook, SubmittedGame
    ├── data/
    │   ├── outcomes.ts     ← §2
    │   └── students.ts     ← §2
    └── components/
        ├── AIGameRepository.tsx
        ├── CaseStudiesSection.tsx
        ├── GeminiNotebookName.tsx
        ├── Hero.tsx
        ├── LearningContractModal.tsx
        ├── NotebookLMGuide.tsx
        ├── RosterMatrix.tsx
        └── SubmittedNotebooks.tsx
```

## 4. Local dev + deploy

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run lint         # tsc --noEmit
```

Env vars (see [`.env.example`](.env.example)):

- `GEMINI_API_KEY` — required for the Gemini-backed name-suggestion in `GeminiNotebookName.tsx`. AI Studio injects it at runtime.
- `GITHUB_TOKEN` — fine-grained PAT with **Contents: read/write** on `victogarcia4/ap2-notebook-lm-fall2026`. Without it, the API routes 500 on write and return `[]` on read.
- `ADMIN_PASSWORD` — gates POST/DELETE on both API routes. Reads are public.

Deployed via Vercel (`vercel.json`); Netlify config is included but Vercel is primary because the serverless endpoints are `@vercel/node` typed.

## 5. Visual identity — important nuance

The CSS in [`src/index.css`](src/index.css) is **two systems glued together**:

1. **Primary system (ap1 paper / acid-green newspaper aesthetic).** New classes: `.btn-primary`, `.btn-secondary`, `.btn-dark`, `.paper-card`, `.paper-card-2`, `.notebook-ruled-card`, `.notebook-dark-card` (+ `.slo-watermark`, `.game-watermark`), `.pill` (+ `.class`, `.lecture-exam`, `.lab-exam`, `.notebook`, `.zoom`, `.acid`), `.card-badge`, `.due-badge`, `.link-btn` (+ `.slo-btn`, `.tutor-btn`), `.status-dot`, `.top-strip` + `.marquee`, `.site-header`, `.brand-mark`. Fonts: Bricolage Grotesque (display), Hanken Grotesk (body), Spline Sans Mono (mono/code), Caveat (`.font-hand`). Palette variables live on `:root` (`--ink`, `--night`, `--paper*`, `--acid`, `--green`, `--blue`, `--orange`, `--red`).
2. **Compatibility bridge (bottom of the file).** The AP2 components were originally styled with the "Playful Geometric" system (`.candy-button*`, `.pop-shadow*`, `.dot-grid`, `.speech-bubble`, `.leaf-shape`, `.animate-float-*`, `.hover-wiggle`, `.bounce-transition`). Those class names are re-mapped onto the ap1 palette so the app renders coherently *today*, but the goal is to migrate component `className`s over to the primary system and delete the bridge.

**Migration convention.** When editing a component:

- swap `candy-button*` → `btn-primary` / `btn-secondary` / `btn-dark`;
- swap `pop-shadow*` → `paper-card` shadow or drop entirely in favor of `.paper-card`;
- swap `dot-grid` backgrounds → keep, they already look right;
- prefer the ap1 pills/badges over ad-hoc rounded-full spans.

Do not delete the compatibility bridge until every component has been migrated. When it goes, note it in the Session Log.

## 6. Serverless API contract

Both `api/notebooks.ts` and `api/games.ts` follow the same shape — action-based POST, **no** REST verbs beyond `GET`:

- `GET  /api/notebooks` → returns the current array straight from GitHub (`data/notebooks.json` on `main`). No auth. On cold path or 404 returns `[]`.
- `POST /api/notebooks` with header `x-admin-password: <ADMIN_PASSWORD>` and body:
  - `{ "action": "verify" }` → `{ authenticated: true }` if the password matches. Used by the admin login modal.
  - `{ "action": "save", "notebooks": SubmittedNotebook[], "commitMessage"?: string }` → sorts by `examId` then author, commits the whole array back to `data/notebooks.json`, returns `{ success, message, count }`.
- `OPTIONS` → CORS preflight.
- Any other verb → `405`.

Same shape for `/api/games`. Every write is a **full-array replace**, not a diff — the client is responsible for sending the complete list. Commits use the message the client passes, falling back to `"📓 Update notebook repository — <local date>"`. Both files hard-code `REPO_OWNER = 'victogarcia4'` and `REPO_NAME = 'ap2-notebook-lm-fall2026'` — if the repo is ever renamed, edit both.

Because writes commit to `main` of this same repo, and Vercel auto-redeploys on push, **every submission triggers a fresh Vercel deploy**. That is intentional; keep it in mind before rate-limiting or debouncing.

`Student.exam1…exam5` on the roster type are optional `LearningOutcome` slots — App.tsx uses them to render the roster matrix. They are *not* persisted; they're derived per session from a distribution policy (see `AcademicSession` and `DistributionPolicy` in `src/types.ts`).

## 6a. Deploy on Vercel

Configuration lives in [`vercel.json`](vercel.json): framework `vite`, build `npm run build`, output `dist`, serverless functions from `api/*.ts` with `maxDuration: 15s`, and an SPA fallback rewrite (Vercel checks the filesystem and function routes before rewrites, so `/assets/*` and `/api/*` are not swallowed).

First-time setup:

1. Import the repo at https://vercel.com/new. Framework should auto-detect as **Vite**; leave the build/output overrides that `vercel.json` provides.
2. In **Project → Settings → Environment Variables**, set for *Production* (and *Preview* if you want branch previews to persist submissions — usually you don't):
   - `GITHUB_TOKEN` — fine-grained PAT, scope: **Contents: Read and write** on `victogarcia4/ap2-notebook-lm-fall2026`. Nothing else needed.
   - `ADMIN_PASSWORD` — freeform string; students never see it, only the instructor uses it via the submission modal.
   - `GEMINI_API_KEY` — optional today (only used if `GeminiNotebookName.tsx` grows into a real Gemini call; currently it's a static component and safe to omit).
3. Deploy. Confirm at `/api/notebooks` and `/api/games` — both should return `[]` on a fresh repo.
4. If you get `500 Server misconfiguration: GITHUB_TOKEN is not set.` on the endpoints, the env var didn't land in the environment you deployed to — redeploy after adding it (Vercel does *not* hot-reload env vars into an existing deployment).

Notes:

- No custom Node version pin — Vercel picks the current default (Node 20+ at time of writing), which matches the `@vercel/node@^5` in `devDependencies`.
- No `.vercelignore` is needed; `.gitignore` already excludes `node_modules`, `dist`, `.env*`.
- The Netlify config (`netlify.toml`) is left in the tree from the previous project but is not used — Vercel is primary because the API depends on `@vercel/node` types. Safe to delete if you don't plan to run a Netlify preview.

## 7. Conventions worth respecting

- **Dates in submissions:** ISO `YYYY-MM-DD` in `createdAt`. The API sorts on it.
- **Author name format:** `"First Last"` (not `"Last, First"`) — student names on the roster are stored `"Last, First"` but submissions display and store the display form. Reuse whatever the component already does; don't reshape names.
- **Do not add analytics, tracking, or third-party scripts.** This is a course site with a small identified audience; keep it clean.
- **Do not add tests scaffolding** unless the user asks. `npm run lint` (which is `tsc --noEmit`) is the only gate.
- **Comments in code:** keep them minimal per project style. Explain non-obvious *why*, never the *what*.
- **README stays terse.** Depth goes in this file, not the README.

## 8. Common pitfalls

- The parent folder (`23-ap2-notebooklm-fa26`) also contains `ap2-notebooklm-summer26/` — the *previous* semester's project. Do not confuse the two. Anything you commit should land inside `ap2-notebook-lm-fall2026/`.
- Windows filesystem is case-insensitive; the sibling summer26 clone shows a `VHGM_traje_azul.png` vs `VHGM traje azul.png` collision warning. Keep the filename with spaces (`VHGM traje azul.png`) in `public/`; that's what components reference.
- Pushing requires the user's GitHub credentials. Never force-push `main`. Never `--no-verify`.
- The instructor row `id: "INSTRUCTOR"` is required; App.tsx branches on it. Do not delete or renumber.

## 9. What's known-open

- **CSS migration** — components still lean on the compatibility-bridge class names. A pass to migrate to the ap1 primary classes has not been done.
- **First push not performed** — the initial commit exists locally; push status depends on whether the user has run `git push -u origin main` yet. Check `git log origin/main..HEAD` before assuming.
- **Vercel env vars** — `GITHUB_TOKEN` and `ADMIN_PASSWORD` need to be configured on the new project before submissions will persist.

---

## Session Log

Append newest at the top. One entry per meaningful session. Keep to the shape below.

### 2026-08-22 — Remove Reset Assignments; fix admin login (Claude Opus 4.7)
- Removed the **Reset Assignments** button from `RosterMatrix.tsx` entirely. Removed associated `onRandomize` prop, `policy` state, and `handleRandomize` local handler. Removed `handleRandomize` and dead `handleResetDefault` from `App.tsx`. `DistributionPolicy` import still present in `App.tsx` (still used by `initDefaultRoster`/`runAllocation`/`handleImportRoster`).
- Fixed `verifyAdmin` in both `SubmittedNotebooks.tsx` and `AIGameRepository.tsx`: when the POST returns **404** (Vite dev server, no serverless functions), the function now returns `true` so the admin UI unlocks locally. On Vercel the API runs normally and returns 200/401. The actual save/delete calls enforce auth via 401 regardless of env.
- TypeScript clean (`npm run lint` zero errors). Committed and pushed as `f6a8ac2`.
- **Next unfinished work:** CSS component migration off compatibility bridge; verify Vercel env vars (`GITHUB_TOKEN`, `ADMIN_PASSWORD`) are set for Production environment and redeploy.

### 2026-08-22 — Vercel deploy-ready (Claude Opus 4.7)
- Rewrote [`vercel.json`](vercel.json): explicit `framework: vite`, `buildCommand`, `outputDirectory: dist`, `installCommand`, `functions."api/*.ts".maxDuration: 15`, and a single SPA-fallback rewrite. Removed the redundant identity rewrite for `/api/*` (Vercel already routes function paths before rewrites).
- Verified the client only talks to `/api/notebooks` and `/api/games` (found in `SubmittedNotebooks.tsx` and `AIGameRepository.tsx`) — no `process.env`/`import.meta.env` leakage into the bundle, so no `VITE_*` env plumbing is needed.
- Confirmed `GeminiNotebookName.tsx` is a static text component today — `GEMINI_API_KEY` is *not* required for the current app; noted as optional in §6a.
- Fixed §6 in this HANDOFF: the API is **action-based POST** (`verify` / `save`) with `x-admin-password` header and a full-array replace on write, not the REST verbs I originally documented.
- Added §6a with Vercel first-time setup: import, env vars (`GITHUB_TOKEN`, `ADMIN_PASSWORD`, optional `GEMINI_API_KEY`), and the "every submission = new deploy" gotcha.
- **Next unfinished work:** import the repo on Vercel and set the three env vars; first deploy; component CSS migration off the compatibility bridge.

### 2026-08-22 — Initial scaffold + HANDOFF authored (Claude Opus 4.7)
- Cloned `ap2-notebooklm-summer26` as the starting shape, dropped its git history.
- Replaced roster with 28 students from `../2402 1501 List.csv`; kept instructor row.
- Emptied `data/notebooks.json` and `data/games.json` to `[]`.
- Rewrote `src/index.css` to the ap1 paper / acid-green newspaper aesthetic; added compatibility bridge for the older `candy-button` / `pop-shadow` / `dot-grid` class names so components render while migration is pending.
- Updated `index.html` (title, fonts: Bricolage Grotesque / Hanken Grotesk / Caveat / Spline Sans Mono, + Font Awesome).
- Updated `api/notebooks.ts` and `api/games.ts` `REPO_NAME` → `ap2-notebook-lm-fall2026`.
- Updated `package.json` name, rewrote `README.md`, added `.gitignore`, updated `.env.example`.
- Initialized fresh git repo on `main`, added remote `origin` = `https://github.com/victogarcia4/ap2-notebook-lm-fall2026.git`. Initial commit made locally. Push pending on user credentials.
- **Next unfinished work:** first `git push -u origin main`; Vercel env-var setup; component CSS migration off the compatibility bridge.
