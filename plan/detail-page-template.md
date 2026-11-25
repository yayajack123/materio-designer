# Detail page template

## Goal and scope

Create `/page-template/detail-page?id=1&tab=details`, based on the supplied [student detail reference](https://microdemy-ds.vercel.app/student-detail?id=1&tab=details). Add Detail Page to the shared Page & Template navigation. Preserve the existing CRUD detail and domain routes.

## Implementation

- Reuse `studentRecords`, `VAvatar`, `IconBtn`, `VTabs`/`VTab` with linked `VWindow` panels, `VCard`, `VRow`/`VCol`, `VChip`, `VAlert`, and `VSnackbar`.
- No new reusable component is required: this is a composition of existing primitives.
- A compact identity header leads into Basic info and Settings cards. Use semantic description lists rather than a data table; table responsive modes do not apply.
- Read the record ID and active tab from query parameters; default to student 1 and Details. Missing records show recovery navigation. Session and Books panels explicitly state that their datasets are outside this template.
- Copy username through the clipboard API, handling success, failure, and repeated activation. Data remains read-only and local; no backend or artificial loading is introduced.

## Token mapping

Use Poppins, `text-h5` section headings, `text-body-1` values, `text-body-2` metadata, semantic `surface`/`on-surface`/`primary`/`success`/`secondary`, `grey-50` avatars, standard border tokens, 24px grid gutters and card padding, and the existing 12px detail-card radius. Cards and buttons have no shadow. Stack at the existing md breakpoint and wrap long values on small screens. Do not copy hardcoded colors or the reference's inconsistent birthday/age pair; derive age from birthday.

## Risks and decisions

Only the supplied Details view is implemented as populated content. Additional tab datasets are explicitly unavailable. No new dependency, remote fetch, or animation. Existing unrelated working-tree edits must remain intact.

## Validation

Run lint, production build, diff/link checks, and browser review at 390×844, 768×1024, and 1440×900 in light and dark themes. Check query navigation, copy feedback, missing ID, narrow-width wrapping, and keyboard tab focus. Record unavailable checks in the handoff.

## Validation results

- Full repository ESLint and production build passed using the local Node entry points (same commands behind the package scripts). Build emitted Vuetify SSR style extraction warnings.
- Browser preview: Details at 390×844, 768×1024, and 1440×900 in light and dark; cards stack at narrow sizes and have computed `box-shadow: none`. Page scroll width matches the viewport after responsive shell transitions settle.
- Verified clipboard success, Session and Books empty panels with query updates, keyboard arrow focus between tabs, direct missing-ID recovery, and record 2's unavailable fields.
- Source/diff checks passed. Clipboard rejection, 200% browser zoom, exhaustive keyboard flow, and long-name stress data were not exercised. No new motion is introduced; content panel transitions are disabled.
