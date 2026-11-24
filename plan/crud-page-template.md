# CRUD page template plan

- **Scope:** Add Page & Template > CRUD Page with a student list and a separate detail route. Figma nodes `6809:83724` and `361:64855` supply the list and detail layouts.
- **Files:** Shared navigation, list and detail routes, a session-scoped demo data composable, and this plan. Update `spec/design.md` for the documented page pattern.
- **Reuse:** `UiTableView`, `UiSectionHeader`, Vuetify table, form, dialog, chips, avatar, and buttons. No new dependency or shared component API is needed.
- **Data and interactions:** Demo data is local to the app session. Create and edit use a validated dialog; delete requires confirmation; the detail route reads the same reactive state. List tabs and filters operate on the complete local dataset before pagination. Search matches name and username; status is Active or Inactive. Filters persist across tab changes and reset explicitly.
- **Layout:** Figma shows a title, summary row, tabs, filters, and a student table. Use initials with name and username, phone, status, registration date, and actions. The summary counts are derived from demo records. On mobile preserve column comparison with horizontal table scrolling, as selected by the user; mobile cards would instead regroup information and actions.
- **Tokens:** Poppins, `text-h4` and existing body utilities, semantic primary/surface/background/status colors, 4px spacing scale, existing theme border and radius. Do not add tokens.
- **Risks and decisions:** Demo changes are not persisted to a backend. Detail fields and tabs without demo data show an unavailable state. Only Active and Inactive statuses and search/status filters were requested; do not invent country or program filters.
- **Validation:** Check routes, create/edit/delete and missing detail state; lint changed files, compile Vue files, check diff, and review desktop/mobile and themes when browser access is available.
