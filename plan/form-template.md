# Form template implementation plan

- Goal: create a reusable reference page based on Figma node `13735:88418`, for configuring a promotion voucher.
- Add `pages/page-template/form.vue`, navigation, and a `TemplatePrompt` definition. Use `UiSectionHeader`, `VRow`/`VCol`, `VCard`, `VTabs`, `VTextField`, `VTextarea`, `VSelect`, `VSwitch`, `VBtn`, and `VSnackbar`; existing components cover the UI.
- Map Figma Inter and blue to the project's Poppins and semantic `primary`, use `surface` cards, 12px radius, 24px padding and existing theme-aware borders. Two columns on desktop, stacked on mobile. No table is involved.
- Keep language-specific title and description alongside shared voucher settings in local page state. Validate required fields, date ordering, positive quotas and discount bounds. Save and discard update the session demo only; image selection validates JPG/PNG and size and displays a local preview. No backend or actual voucher creation.
- Validate lint and diff, then inspect responsive light/dark views and interactive states in a browser when available. Inputs and example data are adaptable references for agents.
