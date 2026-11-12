<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# hireloop-client

Single Next.js 16 App Router app, not a monorepo. Shape: marketing landing page (`Navbar` + `Hero`) plus better-auth email/password and Google sign-in. No CI (`.github/` absent) and **no test runner** — `npm run lint` + `npm run typecheck` is the whole verification story.

`README.md` is the untouched shadcn template; this file is the real source of truth.

## Commands

- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`), run with no args
- `npm run typecheck` — `tsc --noEmit`
- `npm run format` — Prettier `--write` on `**/*.{ts,tsx}` **only**
- `npm run dev` / `npm run build` / `npm run start`

Verify with `npm run lint` then `npm run typecheck` (both exit 0 today), and run `npm run format` after writing Tailwind classes — `prettier-plugin-tailwindcss` reorders them, so don't hand-order.

**The shell is Windows PowerShell 5.1, where `&&` is a parse error.** Use `;` or issue separate commands.

Because `format` covers only `.ts`/`.tsx`, `eslint.config.mjs` and `postcss.config.mjs` still carry semicolons on purpose — don't reformat them to match the `.ts` files.

## Next.js 16 specifics

`next@16.4.4`, `react@19.3.1` — newer than most training data. Read `node_modules/next/dist/docs/` (start at `01-app/`) before assuming an API or convention from an older version.

- `next/image`: the `priority` prop is **deprecated in v16** in favour of `preload`. The docs say not to combine `preload` with `loading` or `fetchPriority` — prefer `loading="eager"` / `fetchPriority="high"` unless you specifically want a `<link rel=preload>` emitted in `<head>`.
- `next.config.ts` is an empty `{}` — there is no `images.remotePatterns`, so remote image hosts need config added first.

The managed block above is rewritten by `next dev`; keep its markers and commit it. Add repo notes outside the markers — only the marked region is managed.

## Where things are

- `app/layout.tsx` — root layout: loads all six fonts, renders `<NavbarPage />`, wraps pages in `ThemeProvider`
- `app/page.tsx` — `<Hero />` followed by `<Footer />`
- `app/(auth)/sign-in`, `app/(auth)/sign-up` — client pages over `components/auth-form.tsx`
- `app/api/auth/[...all]/route.ts` — `toNextJsHandler(auth)`
- `hooks/` and `public/` are empty (`.gitkeep` only)

Routes that exist: `/`, `/sign-in`, `/sign-up`, `/api/auth/*`. Everything else is linked but **404s** — Navbar `/jobs`, `/companies`, `/pricing`; Footer `/worker-ai`, `/salary-data`, `/help`, `/career-library`, `/contact`, `/brand-guideline`, `/newsroom`, `/terms`; Hero chips `/jobs?q=...`. The Hero search `onSubmit` is deliberately just `preventDefault()` for the same reason — wire it to `router.push` only once `/jobs` exists.

`components/Footer.tsx` has no `"use client"` — it renders as a server component. Its Facebook/Pinterest/LinkedIn buttons are inline SVG paths because lucide-react ships **no brand icons**; don't try `import { Facebook } from "lucide-react"`. Their `href="#"` values are placeholders for real profile URLs.

## Auth (better-auth + MongoDB)

- Server config `lib/auth.ts`, client `lib/auth-client.ts`, handler `app/api/auth/[...all]/route.ts`
- Mongo URI comes from `process.env.MONGODB_URI` (set in `.env`); the **database name `hireloop` is hardcoded** in `lib/auth.ts`
- `.env` (gitignored) provides `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`
- The Google social provider reads `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, which are **not in `.env`** — Google sign-in fails until they're added. Email/password is enabled and doesn't need them.
- `user.additionalFields.role` is `seeker | recruiter | admin`, default `seeker`
- There are **no `NEXT_PUBLIC_*` vars anywhere**, so `process.env.X` inside client components is `undefined` at runtime. `lib/auth-client.ts` sets `baseURL: process.env.BETTER_AUTH_URL`, which only works because better-auth then falls back to same-origin. Note it also exports a second, bare `createAuthClient()` next to `authClient`; the pages use `authClient`.

## Conventions that differ from defaults

- Path alias `@/*` → repo root (tsconfig `paths`); shadcn aliases live in `components.json`
- Tailwind CSS v4: no `tailwind.config.*`, CSS-first via `app/globals.css` + `@tailwindcss/postcss`
- `app/globals.css` does `@import "shadcn/tailwind.css"`, which resolves through the **`shadcn` package's exports map** — `shadcn` is a runtime `dependencies` entry for that reason. Moving it to devDependencies breaks the stylesheet.
- shadcn style is `base-nova`, built on `@base-ui/react` — **not Radix**. Add components with `npx shadcn@latest add <name>`; they land in `components/ui/`
- `cn` is the `cn` npm package re-exported by `lib/utils.ts`, not the usual inline clsx/tailwind-merge helper — also a runtime `dependencies` entry; don't "clean it up"
- Fonts load through `next/font/google` in `app/layout.tsx`: Geist (`--font-sans`), Geist Mono, Manrope (`--font-manrope`), Space Mono (`--font-space-mono`), Plus Jakarta Sans (`--font-jakarta`), Inter Tight (`--font-inter-tight`). The last five are registered in the `@theme inline` block of `app/globals.css` and used as `font-manrope` / `font-space-mono` / `font-jakarta` / `font-inter-tight`.
- Dark mode is class-based (`@custom-variant dark` + next-themes `attribute="class"`, `defaultTheme="system"`). Pressing **`d`** toggles it — that's `ThemeHotkey` in `components/theme-provider.tsx`, not a stray listener to delete.
- `<NavbarPage />` is rendered in `app/layout.tsx` *outside* `ThemeProvider`, so `useTheme()` called inside Navbar gets no context.
- A stray untracked file named `nul` sits in the repo root (Windows reserved name — ordinary `del`/`Remove-Item` can't touch it). Don't `git add -A` blindly.
- `CLAUDE.md` is just a pointer: `@AGENTS.md`
