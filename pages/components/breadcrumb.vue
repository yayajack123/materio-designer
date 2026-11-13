<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-breadcrumb' })
useHead({ title: 'Breadcrumb' })

const items = [
  { title: 'Dashboard', to: '/' },
  { title: 'Component', to: '/components' },
  { title: 'Breadcrumb', disabled: true, active: true },
]
const usage = `<nav aria-label="Breadcrumb">
<VBreadcrumbs class="flex-wrap gap-y-2" :items="[
  { title: 'Dashboard', to: '/' },
  { title: 'Component', to: '/components' },
  { title: 'Breadcrumb', disabled: true, active: true },
]">
  <template #divider>
    <VIcon icon="ri-arrow-right-s-line" size="16" aria-hidden="true" />
  </template>
</VBreadcrumbs>
</nav>`
const api = [
  { name: 'items', type: 'array', description: 'Strings or breadcrumb item objects. Use objects with title, to/href, and disabled for navigation.' },
  { name: 'item.to / item.href', type: 'route location / string', description: 'Provide a real route or URL for ancestor items. The current page is not a navigation action.' },
  { name: 'item.disabled', type: 'boolean', description: 'Use on the current page or an unavailable ancestor. Prefer real navigable ancestors.' },
  { name: 'item.active', type: 'boolean', description: 'Set true on the current page to expose aria-current="page", even when it has no destination link.' },
  { name: 'divider', type: 'string · default /', description: 'Text separator between items. Use the divider slot for a bundled icon.' },
  { name: 'density', type: 'default | comfortable | compact', description: 'Controls breadcrumb spacing. Use the default unless the surrounding layout needs a denser treatment.' },
  { name: 'item / title / divider / prepend', type: 'slots', description: 'Customize item presentation, labels, separators, or a leading icon without replacing semantic navigation.' },
]
const accessibility = ['Wrap the breadcrumb list in a nav element with an accessible label.', 'Keep ancestor links keyboard-accessible and use actual routes.', 'Set active: true on the current item so Vuetify exposes aria-current="page". disabled alone does not set aria-current.', 'Hide decorative separator icons from assistive technology and allow labels to wrap on narrow screens.']
</script>

<template>
  <BaseComponentDoc title="Breadcrumb" description="Show the current page within a navigation hierarchy." component-name="VBreadcrumbs" source="Installed Vuetify 3; no existing domain-page breadcrumb implementation" overview="VBreadcrumbs is available in the existing Vuetify dependency. This is the first dedicated breadcrumb example in this project; no new custom breadcrumb component is introduced. Use breadcrumbs for a real hierarchy rather than as decoration." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><nav aria-label="Breadcrumb preview"><VBreadcrumbs :items="items" class="pa-0 flex-wrap gap-y-2" /></nav></template>
    <template #variants>
      <p class="text-body-2 text-medium-emphasis mb-4">The default separator is a slash. The icon variant uses the bundled right chevron.</p>
      <nav aria-label="Breadcrumb with icon separators"><VBreadcrumbs :items="items" class="pa-0 flex-wrap gap-y-2"><template #divider><VIcon icon="ri-arrow-right-s-line" size="16" aria-hidden="true" /></template></VBreadcrumbs></nav>
    </template>
    <template #states>
      <p class="text-body-2 text-medium-emphasis mb-4">Ancestors are links; the current page is disabled. The same pattern works with a single current-page item.</p>
      <nav aria-label="Single current-page breadcrumb"><VBreadcrumbs :items="[{ title: 'Breadcrumb', disabled: true, active: true }]" class="pa-0 flex-wrap gap-y-2" /></nav>
    </template>
  </BaseComponentDoc>
</template>

<style scoped>
:deep(.v-breadcrumbs-item[aria-current="page"]) {
  opacity: 1;
  color: rgb(var(--v-theme-on-surface));
}
</style>
