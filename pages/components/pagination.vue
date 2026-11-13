<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
import TablePagination from '@/@core/components/TablePagination.vue'
definePageMeta({ sidebarRoute: 'components-pagination' })
useHead({ title: 'Pagination' })
const page = ref(1)
const usage = '<VPagination v-model="page" :length="5" />'
const api = [{ name: 'v-model / length', type: 'number', description: 'Current page and total page count.' }, { name: 'total-visible', type: 'number', description: 'Limit the number of visible page buttons.' }, { name: 'disabled', type: 'boolean', description: 'Prevent navigation while data is unavailable.' }, { name: 'TablePagination', type: 'component', description: 'Project helper for table pagination; parent supplies paging metadata and handles updates.' }]
const accessibility = ['Provide an accessible pagination label.', 'Expose current page and disabled navigation controls.', 'Update results and announce loading or errors when fetching a page.']
</script>
<template>
  <BaseComponentDoc title="Pagination" description="Navigate through pages of results." component-name="VPagination / TablePagination" source="@core/components/TablePagination.vue; plugins/vuetify/defaults.ts" overview="Use VPagination for page navigation. TablePagination adds a result summary for table views; the parent controls data fetching." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VPagination v-model="page" :length="5" :total-visible="$vuetify.display.xs ? 1 : 5" aria-label="Demo pages" /><p role="status" class="text-body-2 text-center mt-4 mb-0">Page {{ page }} of 5</p></template>
    <template #variants><p class="text-body-2 mb-4">TablePagination pairs page controls with a result summary.</p><TablePagination v-model:page="page" :items-per-page="5" :total-items="25" /></template>
    <template #states><VPagination :model-value="1" :length="3" :total-visible="$vuetify.display.xs ? 1 : 3" disabled aria-label="Unavailable pages" /></template>
  </BaseComponentDoc>
</template>
