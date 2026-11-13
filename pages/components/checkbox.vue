<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-checkbox' })
useHead({ title: 'Checkbox' })
const selected = ref<string[]>([])
const accepted = ref(false)
const usage = '<VCheckbox v-model="accepted" label="Accept terms" />'
const api = [{ name: 'v-model / value', type: 'boolean | array / unknown', description: 'Bind a single selection or an array of selected values.' }, { name: 'label / disabled / indeterminate', type: 'string / boolean', description: 'Describe the choice and show its availability or partial state.' }, { name: 'rules / error-messages', type: 'array / string', description: 'Validate choices and explain errors.' }]
const accessibility = ['Use a descriptive label for each checkbox.', 'Group related choices with a fieldset and legend.', 'Expose validation messages in text.']
</script>
<template>
  <BaseComponentDoc title="Checkbox" description="Select one or more independent options." component-name="VCheckbox" source="plugins/vuetify/icons.ts; components/design-system/DesignSystemShowcase.vue" overview="Use checkboxes for independent choices or a single boolean value." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VCheckbox v-model="accepted" label="Receive updates" hide-details /><p role="status" class="text-body-2 mt-4 mb-0">Updates: {{ accepted ? 'Selected' : 'Not selected' }}</p></template>
    <template #variants><fieldset class="border rounded pa-4"><legend class="text-body-1">Topics</legend><VCheckbox v-for="item in ['Design', 'Research', 'Development']" :key="item" v-model="selected" :label="item" :value="item" hide-details /></fieldset><p class="text-body-2 mt-4 mb-0">Selected: {{ selected.join(', ') || 'None' }}</p></template>
    <template #states><VCheckbox label="Partially selected" indeterminate hide-details /><VCheckbox label="Unavailable" disabled hide-details /><VCheckbox label="Required agreement" error-messages="Select this option to continue." /></template>
  </BaseComponentDoc>
</template>
