# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Arcade Vault: an online platform to play games and compete for the highest score. Currently a fresh `create-next-app` scaffold (only `app/layout.tsx` and `app/page.tsx`); no game, scoring, data or auth layer exists yet.

The README says the project follows **Spec Driven Design** via an `/sdd` skill. That skill is not installed in this environment; ask the user how specs should be written/located before building features.

## Commands

- `npm run dev`: dev server at http://localhost:3000 (Turbopack). Also (re)writes the Next.js block in `AGENTS.md`.
- `npm run build` / `npm run start`: production build and serve.
- `npm run lint`: ESLint 9 flat config (`eslint-config-next` core-web-vitals + typescript).
- No test runner is configured yet.

## Stack and non-obvious config

- **Next.js 16.4 (App Router) + React 19.3, TypeScript strict.** APIs differ from older Next.js: check `node_modules/next/dist/docs/` before writing code (see `AGENTS.md`).
- **`cacheComponents: true`** in `next.config.ts`: Cache Components / PPR model. Dynamic data must be wrapped in `<Suspense>` or cached with `"use cache"`; see `01-app/02-guides/migrating-to-cache-components.md` and `01-app/01-getting-started/08-caching.md` in the docs folder.
- **`partialPrefetching: true`**: see `01-app/02-guides/adopting-partial-prefetching.md`.
- **`experimental.agentFeedback: true`**: makes `next dev` inject the feedback block into `AGENTS.md`; commit `AGENTS.md` changes rather than reverting them.
- **Tailwind CSS v4** is loaded through the `@tailwindcss/turbopack` loader configured in `next.config.ts` (`turbopack.rules["*.css"]`), not PostCSS. Theme tokens live in `app/globals.css` (`@theme inline`, CSS variables with `prefers-color-scheme` dark mode).
- Layouts/pages use the generated global route types (e.g. `LayoutProps<"/">`), produced under `.next/types`.
- Path alias `@/*` → repo root.
