<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
import UiAutoComplete from '@/components/ui/UiAutoComplete.vue'
definePageMeta({ sidebarRoute: 'components-autocomplete' })
useHead({ title: 'Autocomplete' })
const selected = ref<string | null>(null)
const remote = ref<string | null>(null)
const options = ['Design', 'Development', 'Research']
const callback = async ({ search, page }: { search: string | null; page: number }) => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const filtered = options.filter(item => item.toLowerCase().includes((search || '').toLowerCase()))
  return { data: filtered, meta: { current_page: page, last_page: 1 } }
}
const usage = '<VAutocomplete v-model="value" :items="options" label="Category" />\n<UiAutoComplete v-model="value" :callback="fetchOptions" label="Category" />'
const api = [
  { name: 'v-model / items', type: 'value / array', description: 'Selected value and locally supplied options for VAutocomplete.' },
  { name: 'callback', type: '({ search, page }) => Promise', description: 'UiAutoComplete expects { data, meta: { current_page, last_page } }; search can be null when cleared.' },
  { name: 'loading / disabled / no-data', type: 'boolean / slot', description: 'Indicate pending work, unavailable input, or empty results.' },
]
const accessibility = ['Provide a label and announce empty results.', 'Test keyboard selection and clearing.', 'Show a useful error when a data source fails.']
</script>
<template>
  <BaseComponentDoc title="Autocomplete" description="Search and select from local or asynchronous options." component-name="VAutocomplete / UiAutoComplete" source="components/ui/UiAutoComplete.vue" overview="VAutocomplete filters supplied items. UiAutoComplete calls a parent callback with search and page; this demo uses local data and a short simulated delay." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VAutocomplete v-model="selected" :items="options" label="Search category" clearable /><p role="status" class="text-body-2 mt-4 mb-0">Selected: {{ selected || 'None' }}</p></template>
    <template #variants><UiAutoComplete v-model="remote" :callback="callback" label="Search async demo" clearable /><p class="text-body-2 mt-4 mb-0">Selected: {{ remote || 'None' }}. Search for an unknown term to see the empty state.</p></template>
    <template #states><VRow><VCol cols="12" md="6"><VAutocomplete label="Loading" loading :items="[]" /></VCol><VCol cols="12" md="6"><VAutocomplete label="Disabled" disabled :items="options" /></VCol></VRow><p class="text-body-2 text-medium-emphasis mt-4 mb-0">UiAutoComplete currently logs callback errors; the parent must provide error feedback.</p></template>
  </BaseComponentDoc>
</template>
