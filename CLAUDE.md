# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Sopa de Palabras" — a single-page, timed word-hunt game built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript** (strict). All UI copy is in Spanish. The entire game (categories, words, timer, images, videos, result messages) is driven by one config file, `src/data/game-data.json`; most content changes require editing only that JSON, not components.

**Styling.** Styling is a hybrid: global component styles live in `src/app/globals.css` (plain CSS, imported once in `layout.tsx`), while the word cards and any newer UI use **Tailwind v4** utility classes. Tailwind is wired via `@import "tailwindcss";` at the top of `globals.css` and the `@tailwindcss/postcss` plugin in `postcss.config.mjs` (no `tailwind.config` — v4 auto-detects content). Because the Tailwind import is first, later rules in `globals.css` intentionally override Preflight.

## Commands

```bash
npm run dev        # dev server (Next.js)
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
npm test           # vitest run (all tests)
```

Run a single test file or name:

```bash
npx vitest run src/utils/formatTime.test.ts
npx vitest run -t "formats"
```

Tests live next to their source as `*.test.ts` and currently cover only the pure utils in `src/utils/`. `next.config.mjs` enables `typedRoutes`, so route strings are type-checked.

## Architecture

The app renders a single client component tree from `src/app/page.tsx` → `Game`. There is no routing or server data; everything is client-side and reads `game-data.json` at build time.

**State machine.** `src/hooks/useGameState.ts` owns the whole game as a `screen` of `'start' | 'playing' | 'finished'`. `Game.tsx` (`src/components/game/Game.tsx`) is the orchestrator: it reads config, resolves the selected category and its target words, and conditionally renders `StartScreen`, `GameScreen`, or `ResultModal` based on `screen`. `roundKey` is incremented on begin/reset and passed down as `gameKey` to force fresh randomization each round.

**Timer.** `src/hooks/useCountdown.ts` drives the clock with `performance.now()` + `requestAnimationFrame` (not `setInterval`), exposing `deadlineRef` so `GameScreen` can reject clicks that land after expiry. `onExpire` fires a `'timeout'` result.

**Gameplay.** `GameScreen` (`src/components/game/GameScreen.tsx`) holds the round: it starts/stops the countdown, tracks found words, and calls `onFinish` exactly once via a `completedRef` guard. Winning requires selecting every word whose `categoryId` matches the chosen category (`hasFoundAllTargetWords`); clicking a word from another category triggers a transient "wrong" flash, not a loss.

**Word layout & motion.** `WordGrid` (`src/components/game/WordGrid.tsx`) runs a hand-written 2D physics simulation in a single `requestAnimationFrame` loop (no animation library). Each word is a `Particle` (axis-aligned rectangle with position + velocity); the loop integrates motion, bounces cards off the board edges, and resolves **card-to-card collisions** so tiles never overlap — each frame it separates overlapping pairs along the axis of least penetration and swaps their velocity on that axis (equal-mass elastic bounce). Positions are written straight to each node's `transform: translate3d(...)` via refs (no React re-render per frame, no CSS position transitions). The board is measured with `ResizeObserver`; card sizes come from the real DOM (`offsetWidth`/`offsetHeight`) so collision matches what's rendered. Initial placement (`findFreePosition`) rejects overlaps with a grid fallback, and cards fade in via a `ready` flag once placed. `prefers-reduced-motion` freezes the simulation. `gameKey` forces a fresh layout each round. Speed is tuned by `MIN_SPEED`/`MAX_SPEED`. Note: the grid shows **complete words**, not individual letters.

**Media.** `src/components/layout/MediaAsset.tsx` is the single abstraction for all visual assets: it picks `<video>` vs. `next/image` by file extension, renders `unoptimized` images, and falls back to an alt-text placeholder box on load error. This is why unresolved placeholder paths in the JSON degrade gracefully rather than crash.

## Editing content

Everything below is a section of `src/data/game-data.json` (see `GameData` in `src/types/game.ts` for the shape):

- `categories` / `words` — game content; each word's `categoryId` links it to a category.
- `layout.header`, `layout.backgroundVideo`, `intro`, `startButton`, `result` — imagery and copy per screen.
- `timer.durationMilliseconds` — round length.

Asset paths point into `public/assets/`, which currently holds placeholders; replace files while keeping the JSON paths intact. `src/types/game.ts` is the source of truth for all config and state types — update it alongside any JSON schema change.
