# Order template from Inwan Taiwan

## Goal and scope

Port the layout of Inwan Taiwan's `pages/order.vue` and `components/order/OrderDetail.vue` into Page & Template > Order at `/page-template/order`. Preserve the card-based list, status tabs, search/payment/platform/date filters, pagination, connected progress tracker, two-column detail, payment summary and local edit/status actions. Keep the source repository unchanged.

## Files and reuse

- `pages/page-template/order.vue`: list, filters, query-based detail navigation and session-owned demo state.
- `components/order/OrderDetail.vue`: port the domain detail composition, including dialogs and progress. **Component gap:** existing primitives do not supply a complete order-detail flow; port this domain component rather than duplicate it in the page or create a wrapper around Vuetify.
- `utils/orderPayment.ts` and `public/images/orders/*`: copy sample payment calculation and six required local images.
- Shared navigation, `spec/design.md`, component catalog and architecture guide: add routes and document the pattern.
- Reuse `UiSectionHeader`, `UiTableView`, `VCard`, `VRow`/`VCol`, `VTabs`, `VSelect`, `VTextField`, `VBtn`, `VChip`, `VAvatar`, `VAlert`, `VDialog`, and `VSnackbar`.

## Data and interactions

Use isolated Nuxt `useState` demo records, preserving changes during navigation within this app session. Do not import Inwan browser storage or backend authentication. Search/status/payment/platform/date filters apply before pagination. Query `detail` selects an order; invalid values display recovery feedback. Local notes, address, shipping and status updates refresh the list and detail totals. Validate shipping as a finite nonnegative number. Chat/invoices stay disabled with a visible explanation. Avoid claiming external payment or shipping actions occurred.

## Token mapping and responsive presentation

Replace Inwan Inter/blue styling with inherited Materio Poppins and deployment-aware semantic `primary`. Keep `surface`, `on-surface`, `success`, `info`, `warning`, `error`, border opacity, body/heading utilities, 4px spacing scale, 24px main gutters/padding, and the existing 12px card radius. Use zero elevation on cards and existing shadowless buttons. Do not add tokens or dependencies. Progress is a semantic ordered list with current-step indication, not an editable wizard.

The required responsive question was asked: preserve the scrollable product table, or regroup product/price content as mobile cards? **User selected mobile cards.** Use `UiTableView` with `mobileCards` plus an explicit `mobile-cards` slot; desktop keeps the source product columns. The main order list already uses cards and reflows without a table. Stack detail columns below lg; use a vertical progress list on mobile rather than a clipped horizontal tracker.

## Risks and validation

Keep unrelated worktree changes intact. Scope is a local template, not a commerce backend. Check assets/imports/docs links, lint and production build; browser-review list/detail, filter reset/empty results, pagination, query recovery, note/address/shipping edits, status changes, payment totals and keyboard/dialog behavior. Review 390×844, 768×1024 and 1440×900, light/dark, and 759/761px product-card switch. Record unavailable checks. No new animation is needed.

## Validation evidence

- Full repository ESLint passed. New source/import/asset/plan paths and diff whitespace checked. Production builds pass with the existing Vuetify SSR style extraction warnings.
- Browser screenshots reviewed for `/page-template/order` and `?detail=0` at 390×844, 768×1024 and 1440×900 across light and dark themes. Cards compute to `box-shadow: none`; font computes to Poppins. Narrow page width equals viewport width. Product cards display at 759px and desktop table at 761px.
- Verified pagination (`11–12 of 12`), search empty state/reset, Shipped status filter, platform iOS (6 results), iOS + Bank Mandiri (5 results), date mismatch, direct invalid detail recovery, and previous-order navigation.
- Verified notes/address updates; empty address and negative shipping disable confirmation. Shipping 20 to 50 changes the single-product payment total from NTD 132 to NTD 162. Status updates remove a completed order from Shipped results. Updated progress timestamps are assigned to the correct step.
- Dialog Escape dismissal checked; explicit focus restoration added for manually controlled dialogs and verified on the final production build (focus returns to Edit notes).
- Chat, invoices and real fulfillment/payment services are unavailable by design. Loading/network-error states are N/A for synchronous local demo data. Browser zoom 200%, screen-reader announcements, long-data stress testing, and every possible status transition were not exhaustively checked. No custom motion was added.
