<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-radio' })
useHead({ title: 'Radio' })
const choice = ref('weekly')
const inlineChoice = ref('list')
const usage = '<VRadioGroup v-model="frequency" label="Frequency">\n  <VRadio label="Weekly" value="weekly" />\n  <VRadio label="Monthly" value="monthly" />\n</VRadioGroup>'
const api = [{ name: 'v-model', type: 'value', description: 'The currently selected option for VRadioGroup.' }, { name: 'label / value', type: 'string / unknown', description: 'Visible option label and unique value.' }, { name: 'inline / disabled / rules', type: 'boolean / array', description: 'Configure layout, availability and validation.' }]
const accessibility = ['Give each group a meaningful label.', 'Each option needs a unique label and value.', 'Use arrow keys to move among options and communicate errors in text.']
</script>
<template>
  <BaseComponentDoc title="Radio" description="Choose one option from a small group." component-name="VRadioGroup / VRadio" source="pages/schedule.vue; plugins/vuetify/icons.ts" overview="Use radio buttons when options are mutually exclusive and benefit from being visible together." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VRadioGroup v-model="choice" label="Frequency"><VRadio label="Weekly" value="weekly" /><VRadio label="Monthly" value="monthly" /></VRadioGroup><p role="status" class="text-body-2 mb-0">Selected: {{ choice }}</p></template>
    <template #variants><VRadioGroup v-model="inlineChoice" inline label="View"><VRadio label="List" value="list" /><VRadio label="Grid" value="grid" /></VRadioGroup><p class="text-body-2 mb-0">Selected: {{ inlineChoice }}</p></template>
    <template #states><VRadioGroup label="Availability" model-value="available"><VRadio label="Available" value="available" /><VRadio label="Unavailable" value="unavailable" disabled /></VRadioGroup><VRadioGroup label="Required selection" error-messages="Choose an option."><VRadio label="Option" value="option" /></VRadioGroup></template>
  </BaseComponentDoc>
</template>
