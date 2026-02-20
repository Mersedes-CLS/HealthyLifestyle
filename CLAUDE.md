# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck with `tsc -b` then build with Vite
- `npm run preview` — preview production build
- No test runner configured yet

## Architecture

Vite + React 18 + TypeScript (strict mode) SPA. Dark-themed health/lifestyle tracker with modular feature design. tsconfig enables `noUnusedLocals`, `noUnusedParameters`, and `noUncheckedIndexedAccess` — all code must pass `tsc` with zero errors.

**Path alias:** `@/*` maps to `src/*` (configured in both tsconfig.json and vite.config.ts).

### Key directories

- `src/app/` — App root, router (React Router v6, `createBrowserRouter`), global layout (ambient glow + grain overlay)
- `src/styles/` — Global CSS: variables (design tokens), reset, typography classes, animations (fadeUp/fadeIn/stagger), ambient effects
- `src/shared/ui/` — Reusable components (Card, Button, BackButton, PageTransition), each in own folder with co-located CSS
- `src/shared/types/` — Shared TypeScript types
- `src/features/` — Feature modules, each self-contained with page component, CSS, and `components/` subfolder

### Feature module pattern

Each feature lives in `src/features/<name>/` with:
- `<Name>Page.tsx` + `<Name>Page.css` — page-level component
- `components/` — feature-specific components with co-located CSS
- `hooks/` — feature-specific hooks
- `types/`, `config/` — as needed

Routes are registered in `src/app/router.tsx`. Adding a module = create feature folder + add route + add card to Dashboard's modules array in `src/features/dashboard/Dashboard.tsx`.

### i18n

Bilingual (English / Russian). `src/shared/i18n/` contains `LanguageContext.tsx` (React context + `useLanguage` hook) and `translations.ts` (flat key-value maps). All user-facing strings go through the `t()` function from `useLanguage()`. Language preference stored in `hl_language`. When adding UI text, add keys to both `en` and `ru` in `translations.ts`.

### Design system

Dark theme (#0A0A0A background) with orange (#E8742A) accents. All design tokens are CSS custom properties in `src/styles/variables.css`. Two fonts: Outfit (UI) and JetBrains Mono (labels, numbers, technical text), loaded via Google Fonts in `index.html`.

Cards use 20px border-radius, hover lifts with orange glow. Animations use `cubic-bezier(0.23, 1, 0.32, 1)` easing. Stagger classes (`.stagger-1` through `.stagger-7`) for sequential fade-in.

## Coding conventions

- Functional components + hooks only
- PascalCase components, camelCase functions/variables
- One component per file, CSS co-located next to component
- Plain CSS (not CSS Modules, not styled-components) with BEM-like naming
- Comments in English
- Conventional commits: `feat:`, `fix:`, `style:`, `refactor:`
- Data stored in localStorage with `hl_` prefix (e.g., `hl_breathing_sessions`)

## Full spec

See `HEALTHY_LIFESTYLE_SPEC.md` for complete design system details, module plans, breathing animation specs, and development roadmap.
