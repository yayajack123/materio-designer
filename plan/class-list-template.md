# Class list template plan

- **Goal:** Add Page & Template > Class List following Figma `383:33307` without changing the existing class page.
- **Files:** A new list route, navigation entry, and design documentation. Reuse `UiTableView`, Vuetify tabs, fields, chips, avatars, buttons, and dialogs.
- **Data and interactions:** Separate Group, Adaptive, and Idle demo datasets share columns. Search matches class name; grade, course, and status filters run before pagination and persist across tabs. Reset clears filters. Use initials for teachers, with name and phone; show class name above program. Show schedules in a dialog. The detail action stays disabled until a detail route exists. Creation is unavailable in this list-only example.
- **Status:** Active, Scheduled, Completed, as selected. Demo fixtures contain the fields required by every filter. Ten rows per page by default.
- **Responsive:** The user selected a horizontally scrollable table, preserving comparison across columns; mobile cards would instead reorganize rows and actions. No new reusable component is necessary.
- **Tokens:** Poppins type utilities, semantic theme colors, existing surface, border, radius and 4px spacing scale. No new tokens or dependency.
- **Validation:** Lint and compile changed files, check diff, and inspect desktop/mobile, themes and keyboard behavior when browser preview is available.
