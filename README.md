# Materio Designer

Nuxt 3 + Vue 3 + Vuetify starter for an admin-only local demo. Navigation contains Dashboard, Foundation (Typography, Color System, Spacing, Iconography), and Component documentation (Buttons, Text Field, Tabs, Stepper, Breadcrumb, Select, Autocomplete, Checkbox, Radio, Switch, Card, Dialog, Table, Pagination). Each Component page uses Overview, Preview, Variants, States, Usage, API, and Accessibility sections. Existing module source and direct routes remain available as references. Each deployment uses one brand and one backend configuration.

## Component documentation

For agent work, start with [the repository map](docs/architecture.md), [component selection guide](docs/components.md#panduan-pemilihan-komponen), and [design review checklist](docs/design-review.md). [AGENTS.md](AGENTS.md) defines the workflow; [spec/design.md](spec/design.md) remains the source of truth for design tokens and component mapping.

See [the component catalog](docs/components.md) for local component responsibilities, props/defaults, events, models, slots, source links, static consumers, and implementation limitations. [The starter plan](plan/starter-template.md) records navigation scope and the selected scrollable-table presentation on mobile.

## Setup

GitHub CI, dependency updates, and branch protection setup are documented in [GitHub starter maintenance](docs/github-setup.md). Use Node from `.nvmrc` and pnpm from `package.json`.

For a step-by-step guide to adapting this starter after cloning, see [NEW_PROJECT_SETUP.md](NEW_PROJECT_SETUP.md).

Copy `.env.example` to `.env`, then set the app name, brand color, logo, favicon, API URL, and authentication settings for this deployment.

The local setup uses `NUXT_PUBLIC_APP_NAME="Materio Designer"`, the base green (`#10AF13`), the Materio navigation logo, and `AUTH_ENABLED=false`. Backend URLs remain empty for the local demo. Admin is the intended audience; with API authentication disabled, backend role enforcement is not configured. `.env` is ignored by Git; `.env.example` contains no secrets. Development Basic Auth defaults to `admin` / `change-me`; change these values before sharing a development environment.

Navigation uses the official [Materio mark](https://github.com/themeselection/materio-vuetify-vuejs-admin-template-free/blob/main/typescript-version/src/assets/images/logo.svg), stored in `assets/images/materio-logo.svg`, with semantic primary color and a theme-aware wordmark in `themeConfig.ts`. The original `assets/images/logo.svg` remains available for existing journal report artwork.

Install dependencies and start development server:

```sh
pnpm install
pnpm dev
```

Nuxt public runtime values can be changed per deployment without editing application components. Keep secrets and private API credentials out of `NUXT_PUBLIC_*` variables.

## Authentication and API

Set `AUTH_ENABLED=true` when the connected API supports authentication. Configure `API_BASE_URL` and `SANCTUM_BASE_URL` for the target backend. Demo credentials should be provided by each application environment; do not commit real credentials.

## Production build

```sh
pnpm build
```
