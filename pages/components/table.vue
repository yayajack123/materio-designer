<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
import UiTableView from '@/components/ui/UiTableView.vue'
definePageMeta({ sidebarRoute: 'components-table' })
useHead({ title: 'Table' })
const search = ref('')
const headers = [{ title: 'Name', key: 'name' }, { title: 'Category', key: 'category' }, { title: 'Status', key: 'status' }]
const items = [{ name: 'Design guide', category: 'Design', status: 'Ready' }, { name: 'Research notes', category: 'Research', status: 'Draft' }, { name: 'Build checklist', category: 'Development', status: 'Ready' }]
const filtered = computed(() => items.filter(item => Object.values(item).some(value => value.toLowerCase().includes(search.value.toLowerCase()))))
const usage = '<VDataTable :headers="headers" :items="items" />\n<UiTableView title="Items" :headers="headers" :items="items" hide-filters />'
const api = [{ name: 'headers / items', type: 'array', description: 'Column definitions and rows supplied by the parent.' }, { name: 'loading / items-per-page', type: 'boolean / number', description: 'Expose loading and configure page size.' }, { name: 'VDataTableServer', type: 'component', description: 'Use for externally paginated data; parent handles requests, total count and errors.' }, { name: 'UiTableView / mobileCards', type: 'component / boolean', description: 'Reusable table shell. Default presentation scrolls horizontally; mobileCards requires an explicit mobile-cards slot.' }, { name: 'item.* / no-data', type: 'slots', description: 'Customize cells and empty state.' }]
const accessibility = ['Use meaningful column headings.', 'Keep row actions labeled and keyboard accessible.', 'Allow horizontal scrolling on narrow screens and provide loading, empty and error feedback.']
</script>
<template>
  <BaseComponentDoc title="Table" description="Display structured data with a scrollable mobile presentation." component-name="VDataTable / VDataTableServer / UiTableView" source="components/ui/UiTableView.vue; pages/user.vue" overview="Use VDataTable for local rows and VDataTableServer when the parent loads pages. UiTableView combines a header, filters, loading, and table slots. The preview uses local data." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VTextField v-model="search" label="Search rows" prepend-inner-icon="ri-search-line" class="mb-4" /><VDataTable :headers="headers" :items="filtered" :items-per-page="5"><template #no-data>No matching rows.</template></VDataTable></template>
    <template #variants><UiTableView title="Table shell example" :headers="headers" :items="items" :items-per-page="5" hide-filters /></template>
    <template #states><VDataTable :headers="headers" :items="[]"><template #no-data>No items available.</template></VDataTable><p class="text-body-2 text-medium-emphasis mt-4 mb-0">For server tables, display request errors outside the table and let the user retry.</p></template>
  </BaseComponentDoc>
</template>
