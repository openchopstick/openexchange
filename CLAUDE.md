# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **high-fidelity prototype** (Vite + React 18 + TypeScript) for **BeanExchange**, a regulated SFC-licensed Virtual Asset Trading Platform (VATP) in Hong Kong. It is UI-only — no backend, no real money, no tests. Domain logic is mocked inside components.

The product is an "Open Exchange Platform" that distributes crypto trading to clients of regulated institutions via two business models:
- **Omnibus Model (BeanBank)** — institution owns end-users, KYC, and sub-ledger; VATP only sees one institutional account.
- **Referral Model (SC Securities)** — VATP owns the end-user account directly; the institution only refers.

Three user-facing roles select on the login screen: `beanbank`, `sc-securities`, `admin` (BeanExchange Ops).

## Commands

```bash
npm i           # install
npm run dev     # Vite dev server
npm run build   # production build (vite build)
```

No test, lint, or typecheck scripts are wired up.

## Architecture

- **Entry**: `src/main.tsx` → `LanguageProvider` (i18n en / zh-CN, in `src/app/shared/LanguageContext.tsx`) → `src/app/App.tsx`.
- **Routing**: `App.tsx` is a **state-machine switcher**, not a router. `userRole` + `currentScreen` `useState` decide which top-level component to render. `react-router` is in `package.json` but **unused** — do not introduce it without reason; follow the existing pattern when adding screens.
- **Top-level screens** live directly in `src/app/components/` (`LoginScreen`, `BeanBankDashboard`, `SCSecuritiesDashboard`, `ComplianceDashboard`, `WalletCustodyScreen`, `MobileH5View`). Each is large (300–700 lines) and self-contained with its own mock data.
- **`src/app/components/ui/`** is a stock **shadcn/ui** drop (Radix primitives + `class-variance-authority` + `tailwind-merge` via `cn()` in `ui/utils.ts`). Prefer composing these over hand-rolling.
- **`src/app/components/shared/`** holds cross-screen building blocks (`TopNav`, `SidebarNav`, `MetricCard`, `StatusBadge`).
- **`src/app/components/figma/`** holds Figma Make compatibility shims (e.g. `ImageWithFallback`) — leave them alone.
- Both **shadcn/ui** AND **MUI** (`@mui/material`) are dependencies. Match the surrounding file's choice; do not mix in a single component.

## Vite specifics (`vite.config.ts`)

- `@` is aliased to `src`.
- A custom `figmaAssetResolver` plugin rewrites `figma:asset/<filename>` imports to `src/assets/<filename>`. Keep this import scheme when adding Figma-exported assets.
- `assetsInclude` allows raw imports of `.svg` and `.csv` only. **Never add `.css`, `.ts`, or `.tsx` to that list** (note in the config).
- The React and Tailwind Vite plugins are both required by Figma Make even if Tailwind isn't visibly used — do not remove either.

## Styling

- **Tailwind v4** via `@tailwindcss/vite`. Entry: `src/styles/index.css` → imports `tailwind.css` and `theme.css`. `theme.css` defines the design tokens.
- **Light theme only.** Apple HIG-inspired palette in `guidelines/uiux-design-system.md`. Don't add dark-mode variants.

## Domain rules — read before touching financial/custody/KYC code

`guidelines/` contains the project's product and compliance specs. The non-negotiables (from `guidelines/rules.md`) that often surface in UI work:

- Cold storage **≥ 98%**, hot **≤ 2%** — never display 90/10 anywhere.
- Always show an **active-model badge**: blue = Omnibus, green = Referral.
- Retail vs Professional Investor (PI) classification gates token/product access.
- Travel Rule data shows on every VA transfer; in Omnibus it's passed through from BeanBank.
- VATP must **not** display end-user PII for omnibus clients — only the institution sees the sub-ledger.
- No floating-point math for money. Withdrawals follow Maker–Checker–Approver.

Before implementing a feature, consult the relevant file in `guidelines/` (`omnibus-model.md`, `referral-model.md`, `compliance-hk-sfc.md`, `uiux-design-system.md`).
