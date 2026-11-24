<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-tooltip' })
useHead({ title: 'Tooltip' })
const usage = `<IconBtn aria-label="Edit item">
  <VIcon icon="ri-pencil-line" aria-hidden="true" />
  <VTooltip activator="parent" location="top">Edit item</VTooltip>
</IconBtn>`
const api = [
  { name: 'activator', type: 'string | element', description: 'Connect the tooltip to its trigger; use parent for a nested tooltip.' },
  { name: 'location', type: 'string', description: 'Choose the preferred placement relative to the trigger.' },
  { name: 'open-delay / close-delay', type: 'number | string', description: 'Control hover opening and closing delay when needed.' },
  { name: 'disabled', type: 'boolean', description: 'Prevent the tooltip from opening.' },
]
const accessibility = ['Give icon-only controls an accessible name independent of the tooltip.', 'Keep tooltip text brief and available on keyboard focus.', 'Do not put essential instructions or interactive controls inside a tooltip.']
</script>

<template>
  <BaseComponentDoc title="Tooltip" description="Show a short hint for a control on hover or focus." component-name="VTooltip / IconBtn" source="plugins/vuetify/defaults.ts; components/design-system/DesignSystemShowcase.vue" overview="Use tooltips for supplementary hints." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><IconBtn aria-label="Edit item"><VIcon icon="ri-pencil-line" aria-hidden="true" /><VTooltip activator="parent" location="top">Edit item</VTooltip></IconBtn></template>
    <template #variants><div class="d-flex flex-wrap gap-3"><VBtn variant="outlined">Top<VTooltip activator="parent" location="top">Top placement</VTooltip></VBtn><VBtn variant="outlined">Bottom<VTooltip activator="parent" location="bottom">Bottom placement</VTooltip></VBtn></div></template>
    <template #states><VBtn variant="outlined">Tooltip disabled<VTooltip activator="parent" disabled>Unavailable</VTooltip></VBtn><p class="text-body-2 text-medium-emphasis mt-4 mb-0">A disabled tooltip does not open.</p></template>
  </BaseComponentDoc>
</template>
