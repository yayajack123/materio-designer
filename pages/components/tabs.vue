<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-tabs' })
useHead({ title: 'Tabs' })

const activeTab = ref('details')
const verticalTab = ref('details')
const stateTab = ref('available')
const tabs = [
  { value: 'details', label: 'Details', text: 'Details panel: use tabs for related content within one context.' },
  { value: 'activity', label: 'Activity', text: 'Activity panel: changing tabs updates the visible panel without leaving the page.' },
  { value: 'settings', label: 'Settings', text: 'Settings panel: keep each tab label short and descriptive.' },
]
const usage = `<VTabs v-model="activeTab" aria-label="Item sections">
  <VTab value="details">Details</VTab>
  <VTab value="activity">Activity</VTab>
</VTabs>
<VWindow v-model="activeTab">
  <VWindowItem value="details">Item details</VWindowItem>
  <VWindowItem value="activity">Item activity</VWindowItem>
</VWindow>`
const api = [
  { name: 'v-model', type: 'string | number', description: 'Selected tab value. Share it with the matching VWindow or VTabsWindow panel container.' },
  { name: 'VTab value', type: 'string | number', description: 'Unique value matching the corresponding content panel.' },
  { name: 'direction', type: 'horizontal | vertical', description: 'Horizontal is the default. Builder navigation uses a vertical treatment on desktop.' },
  { name: 'disabled', type: 'boolean on VTab', description: 'Prevents selecting an unavailable tab. Explain why content is unavailable when needed.' },
  { name: 'show-arrows', type: 'boolean', description: 'Project VTabs defaults enable slide-group arrows when tabs overflow.' },
  { name: 'default', type: 'slot', description: 'Contains VTab items. Keep panels separate and synchronize their model.' },
]
const accessibility = ['Give the tab list an accessible label describing its content group.', 'Keep tab labels short and meaningful; do not use icons as the only label.', 'Test keyboard focus and arrow-key navigation, with the selected panel matching the focused action.', 'For navigation to separate pages, use route links rather than local tabs.']
</script>

<template>
  <BaseComponentDoc title="Tabs" description="Switch related panels while keeping the same page context." component-name="VTabs / VTab / VWindow" source="components/ui/UiTableView.vue; components/marketing/MarketingBuilder.vue; plugins/vuetify/defaults.ts" overview="The project uses bordered tabs for query views and responsive panel navigation in the builder. Keep selected state in the parent and connect each value to its content panel." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview>
      <VTabs v-model="activeTab" class="v-tabs-bordered" aria-label="Preview sections">
        <VTab v-for="tab in tabs" :id="`preview-tab-${tab.value}`" :key="tab.value" :value="tab.value" :aria-controls="`preview-panel-${tab.value}`">{{ tab.label }}</VTab>
      </VTabs>
      <VWindow v-model="activeTab" class="mt-4">
        <VWindowItem v-for="tab in tabs" :id="`preview-panel-${tab.value}`" :key="tab.value" :value="tab.value" role="tabpanel" :aria-labelledby="`preview-tab-${tab.value}`"><p class="text-body-1 mb-0">{{ tab.text }}</p></VWindowItem>
      </VWindow>
    </template>
    <template #variants>
      <p class="text-body-2 text-medium-emphasis mb-4">Vertical tabs are available for side panels. The same selected value controls the panel text.</p>
      <VRow>
        <VCol cols="12" sm="4"><VTabs v-model="verticalTab" direction="vertical" aria-label="Vertical sections"><VTab v-for="tab in tabs" :key="tab.value" :value="tab.value">{{ tab.label }}</VTab></VTabs></VCol>
        <VCol cols="12" sm="8"><p class="text-body-1 mb-0">{{ tabs.find(tab => tab.value === verticalTab)?.text }}</p></VCol>
      </VRow>
    </template>
    <template #states>
      <VTabs v-model="stateTab" aria-label="Availability example"><VTab value="available">Available</VTab><VTab value="unavailable" disabled>Unavailable</VTab></VTabs>
      <p class="text-body-2 text-medium-emphasis mt-4 mb-0">The disabled tab cannot be selected. Available remains the active panel.</p>
    </template>
  </BaseComponentDoc>
</template>
