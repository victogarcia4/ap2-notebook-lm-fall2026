# BIOL 2402 — NotebookLM & AI Game SLO Portal (Fall 2026)

Student Learning Outcome (SLO) distribution, NotebookLM assignment tracker, and Google AI Studio extra-credit game repository for **Anatomy & Physiology II (BIOL 2402), Section 1501, Fall 2026** — Dr. Victor Garcia Martinez.

Fresh session start: roster loaded from `2402 1501 List.csv`; `data/notebooks.json` and `data/games.json` begin empty and are appended to as students submit via the portal (persisted to this GitHub repo via the `/api/notebooks` and `/api/games` Vercel endpoints). SLO structure covers chapters 13–24 across the five lecture exams — see `src/data/outcomes.ts`.

Visual identity follows the paper / acid-green newspaper aesthetic established in [ap1-fall2026-notebook-lm-and-ai-games](https://github.com/victogarcia4/ap1-fall2026-notebook-lm-and-ai-games).

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:3000. Set `GEMINI_API_KEY` in `.env.local` for the Gemini-powered features.

## Submission API

The `/api/notebooks` and `/api/games` serverless endpoints commit new entries back to `data/*.json` in this repo. They require the following env vars on Vercel:

- `GITHUB_TOKEN` — a PAT with `contents:write` on this repo
- `ADMIN_PASSWORD` — password guarding write operations

## Deploy

Configured for Vercel (`vercel.json`) and Netlify (`netlify.toml`).
