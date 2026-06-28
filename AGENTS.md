# AGENTS.md

## Purpose

This file documents non-obvious pitfalls, gotchas, and project-specific conventions
that are NOT discoverable from the code or existing docs.

## Rules

- Before starting a task, read this file fully.
- If you encounter unexpected behavior or project conventions that contradict common defaults, add a brief note to the relevant section below with a one-line explanation and the file/module affected.
- Keep entries minimal: one line per gotcha. Do not duplicate README or docstrings.

## Build & Test

- `npm run db:start` – start the database (once per machine restart)
- `npm run dev`
- `npm run build` — typecheck + production build
- `npm run check` — Lint + typecheck

<!-- BEGIN:nextjs-agent-rules -->

# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.

<!-- END:nextjs-agent-rules -->

## Conventions

- **ALWAYS order functions top-down ("newspaper" / stepdown): exported/public function first, then functions it calls, leaf helpers last. Apply this to every file.**

## Known Gotchas

- `node_modules/next/dist/docs/` is absent after `npm install`; use official Next docs when local docs are unavailable.
- `npm install` requires `--legacy-peer-deps` because `react-simple-maps@3` peers React <=18 while the app uses React 19.
- `src/app/tasks/page.tsx` is DB-backed and must remain dynamic; static prerender causes the tRPC prefetch error to be redacted during `next build`.
- `supabase/config.toml` references `supabase/seed.sql`, but no seed file is committed; `npm run db:start` warns and continues.
- Running `npm run build` while `npm run dev -- --turbo` is active can leave stale `.next` dev manifests; restart the dev server before smoke testing.
