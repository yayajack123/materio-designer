# Design system landing page plan

## Skills directory

- **Goal and scope:** Show the repository-owned `table-page-builder` and `audit-page-design-system` skills after Quick setup on `/landing`; no external skills, installation flow, search, new route, or table.
- **Files and reuse:** Update `pages/landing.vue`, this plan, and `spec/design.md`. Reuse `VCard`, `VRow`/`VCol`, and `VChip`. No component gap or dependency.
- **Data and interactions:** Import each selected `SKILL.md` as raw text at build time and derive name/description, then render a shared card template from a skills array. Show component chips, categories (`UI/UX design` plus `Page builder` or `Design system audit`), and author `Juliarta Arya`. Component chips represent applicable building blocks documented by the skill. No installation or execution.
- **Tokens and layout:** Existing Poppins heading/body utilities, semantic surface/background/primary/secondary, 24px padding/gutters. Two outlined cards per row from `md` (`cols="12" md="6"`), stacking on mobile; vertically stack title, description clamped to three lines, components, categories, and author. Chips wrap on mobile. No new tokens or motion.
- **Risks and validation:** List only the selected repository skills. Check lint/build, mobile/desktop light/dark, three-line limit, wrapping, and scoped diff. Loading/empty/action states are inapplicable to these static entries.

## Designer quick setup

- **Goal:** Help a designer start a new project with an AI agent using `NEW_PROJECT_SETUP.md` as the source of truth. Add a navbar anchor and a section between the showcase and directory.
- **Composition:** Reuse `VRow`, `VCol`, `VCard`, `VBtn`, `VIcon` and the existing `VSnackbar`; no new component, dependency or table is needed. Show four steps beside a visible, selectable prompt.
- **Data and interaction:** The prompt follows the setup guide. Copy uses the Clipboard API with the existing fallback, success/error feedback and manual selection on failure. Navbar links work in desktop and mobile navigation; account for the sticky header.
- **Tokens and layout:** Poppins, `text-h4`/`text-h5`/body utilities, semantic `surface`/`background`/`primary`, standard borders, 24px gutters and padding. Stack columns on mobile; no animation or new tokens.
- **Validation:** Check anchor navigation, clipboard success/failure and keyboard access, desktop/mobile and light/dark, lint, build, links and diff. Do not execute setup commands or alter configuration.

## Showcase revision

### Responsive gallery refinement

- **Goal:** Follow the user's shadcn screenshot: keep varied-height columns side by side on narrow screens rather than stacking all examples into one long column.
- **Files and reuse:** `pages/landing.vue`, `LandingCardsShowcase.vue`, this plan and `spec/design.md`. Reuse existing cards and controls; add an optional `gallery` prop so the Create studio keeps its existing layout. No new component or dependency.
- **Layout and tokens:** Three equal columns, minimum 320px each, 24px gaps and existing card padding; preserve Poppins and semantic themes. Native horizontal scrolling stays inside the Cards panel, with a keyboard-focusable region and visible scroll hint. No scaling or decorative fade over interactive content. At widths below 1200px, tabs and brand controls use separate toolbar rows; mobile outer gutters are 16px.
- **State and scope:** Existing local demo state, tab persistence, brand switching and notifications remain intact. CRUD's previously selected mobile-card presentation remains unchanged; this refinement introduces no table or new data flow.
- **Risk and validation:** Check card readability and page overflow at 390/768/1440px in light/dark, keyboard scrolling and tabs, lint and production build. Preserve unrelated working-tree changes.
- **Visual review evidence:** `/landing` inspected in-browser at 390×844 light/dark, 768×1024 light, and 1440×900 dark. Document scroll width matched viewport width; gallery columns measured 320px on mobile/tablet and approximately 399px on desktop. Screenshots inspected in-session. Cards/Foundations tab switching passed. Full light/dark viewport matrix, 200% zoom, clipboard paths, and keyboard horizontal-scroll movement were not fully verified; no new motion was added.

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
