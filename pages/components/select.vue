<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-select' })
useHead({ title: 'Select' })
const selected = ref<string | null>(null)
const multiple = ref<string[]>([])
const options = ['Design', 'Development', 'Research']
const usage = '<VSelect v-model="selected" :items="options" label="Category" />'
const api = [
  { name: 'v-model', type: 'value | array | null', description: 'Selected value; multiple mode uses an array.' },
  { name: 'items / item-title / item-value', type: 'array / string', description: 'Options and fields used for labels and values.' },
  { name: 'multiple / clearable / disabled / rules', type: 'boolean / array', description: 'Control selection, clearing, availability, and validation.' },
]
const accessibility = ['Provide a visible label.', 'Use keyboard arrows and Enter to select an option.', 'Explain validation errors in text.']
</script>
<template>
  <BaseComponentDoc title="Select" description="Choose from a known list of options." component-name="VSelect" source="plugins/vuetify/defaults.ts" overview="Use VSelect for a fixed set of choices. The project defaults to outlined, comfortable fields." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VSelect v-model="selected" :items="options" label="Category" clearable /><p role="status" class="text-body-2 mt-4 mb-0">Selected: {{ selected || 'None' }}</p></template>
    <template #variants><VSelect v-model="multiple" :items="options" label="Multiple categories" multiple chips /><p class="text-body-2 mt-4 mb-0">{{ multiple.length }} selected</p></template>
    <template #states><VRow><VCol cols="12" md="6"><VSelect label="Unavailable" :items="options" disabled /></VCol><VCol cols="12" md="6"><VSelect label="Required category" :items="options" error-messages="Choose a category." /></VCol></VRow></template>
  </BaseComponentDoc>
</template>
