# Design system landing page plan

## Designer quick setup

- **Goal:** Help a designer start a new project with an AI agent using `NEW_PROJECT_SETUP.md` as the source of truth. Add a navbar anchor and a section between the showcase and directory.
- **Composition:** Reuse `VRow`, `VCol`, `VCard`, `VBtn`, `VIcon` and the existing `VSnackbar`; no new component, dependency or table is needed. Show four steps beside a visible, selectable prompt.
- **Data and interaction:** The prompt follows the setup guide. Copy uses the Clipboard API with the existing fallback, success/error feedback and manual selection on failure. Navbar links work in desktop and mobile navigation; account for the sticky header.
- **Tokens and layout:** Poppins, `text-h4`/`text-h5`/body utilities, semantic `surface`/`background`/`primary`, standard borders, 24px gutters and padding. Stack columns on mobile; no animation or new tokens.
- **Validation:** Check anchor navigation, clipboard success/failure and keyboard access, desktop/mobile and light/dark, lint, build, links and diff. Do not execute setup commands or alter configuration.

## Showcase revision

- **Goal:** Match the supplied shadcn reference's independently stacked, varied-height cards while keeping the landing showcase interactive and aligned with Materio.
- **Scope:** Revise the Cards panel and its showcase framing in `LandingCardsShowcase.vue` and `pages/landing.vue`; document the pattern in `spec/design.md`. Other tabs and their selected table presentations remain unchanged.
- **Reuse:** Existing `VRow`/`VCol`, `VCard`, `VAvatar`, `VIcon`, `VChip`, form controls and buttons. Dashboard-style revenue, order status and payment summaries are compact compositions of these existing primitives; no new reusable component is required.
- **State:** Existing profile, team, slider and notification state remains local and persists when changing tabs. Dashboard figures are labeled sample data and require no loading or backend.
- **Tokens:** Poppins typography, semantic `surface`, `background`, `primary`, `success`, `info`, `warning`, `error`, existing border opacity, 24px grid gutters and card padding. Cards are white in light mode, theme surface in dark mode, and buttons remain shadowless. No new motion or color tokens.
- **Responsive and validation:** Three independent columns on desktop, two on tablet and one on mobile; maintain logical reading order. Verify light/dark, 390/768/1440px, existing interactions, tab state, lint and build. No new table is introduced.

- **Scope:** Add a standalone design-system landing page at `/landing` (`layout: 'blank'`, English UI copy) inspired by `ui.shadcn.com`: minimal sticky header, direct hero with primary/outlined CTAs, a single tabbed interactive showcase frame with live brand-primary presets and theme mode controls, and a searchable/grouped catalog index of existing Foundation, Component, and Page & Template routes. Keep `/` (`pages/index.vue`) unchanged.
- **Files:** `pages/landing.vue`, four section compositions under `components/design-system/landing/` (`LandingCardsShowcase.vue`, `LandingCrudShowcase.vue`, `LandingFoundationsShowcase.vue`, `LandingFormStepperShowcase.vue`), `spec/design.md`, `docs/components.md`, and this plan.
- **Component gap note:** `DesignSystemShowcase` and `BaseComponentDoc` render full-page vertical documentation layouts and cannot serve as compact interactive tab panels inside a showcase frame. Adding four composition sections keeps `pages/landing.vue` modular while assembling existing project/Vuetify primitives without introducing wrapper components or new dependencies.
- **Reuse:** `VRow`/`VCol`, `VCard`, `VBtn` (pill default), `IconBtn`, `VTabs`/`VTab`, `VTextField`, `VSelect`, `VSwitch`, `VCheckbox`, `VSlider`, `VChip`, `VAvatar`, `VDivider`, `VSnackbar`, `VTooltip`, `UiTableView`, `AppStepper` (`layout="centered"`), `NavbarThemeSwitcher`, `getBrandThemeColors()`, `useCrudPageDemo()`, and `mainNavItems`.
- **Data, state, and interactions:** All demo state is client/session-local. Switching showcase tabs preserves user input across tabs. Live brand swatches call `getBrandThemeColors(hex)` on the active Vuetify light/dark themes without overwriting cookies, paired with an explicit Reset to `#10AF13` and Copy `.env` (`NUXT_PUBLIC_BRAND_PRIMARY`) feedback via `VSnackbar`. Per user selection, the CRUD showcase tab uses `UiTableView` with `mobile-cards` and an explicit `#mobile-cards` slot below `760px`.
- **Tokens:** Poppins typography (`text-h1`/`text-h3` hero, `text-h4`/`text-h5` section titles, `text-body-1`/`text-body-2` copy), semantic `background`, `surface`, `on-surface`, `primary`, `on-primary`, `secondary`, and status tokens, 4px spacing scale, 24px `VRow`/`VCol` gutters, and token borders. No new tokens or decorative motion.
- **Validation:** Run `pnpm lint:check` and `pnpm build`; verify `/landing` in Light and Dark modes across `390x844`, `759px`/`761px`/`768x1024`, and `1440x900`, plus `200%` zoom, keyboard tab/toolbar focus, live preset reset/copy, and `mobileCards` presentation.
