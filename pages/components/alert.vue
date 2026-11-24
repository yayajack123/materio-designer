<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-alert' })
useHead({ title: 'Alert' })
const visible = ref(true)
const usage = '<VAlert type="info" variant="tonal" title="Review required">Check the details before continuing.</VAlert>'
const api = [
  { name: 'type / color / variant', type: 'string', description: 'Choose the message severity and visual treatment.' },
  { name: 'title / text', type: 'string', description: 'Provide a concise title and message, or use the default slot.' },
  { name: 'closable / v-model', type: 'boolean', description: 'Allow dismissal and control visibility.' },
]
const accessibility = ['Use a clear message and identify the next action.', 'Do not rely on color alone to communicate severity.', 'Reserve assertive announcements for urgent messages; do not interrupt users for routine information.']
</script>

<template>
  <BaseComponentDoc title="Alert" description="Display contextual information, warnings, and errors." component-name="VAlert" source="components/marketing/MarketingBuilder.vue" overview="Use alerts for contextual messages." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VAlert type="info" variant="tonal" title="Review required">Check the details before continuing.</VAlert></template>
    <template #variants><div class="d-flex flex-column gap-4"><VAlert type="success" variant="tonal">Changes saved.</VAlert><VAlert type="warning" variant="tonal">Review the missing information.</VAlert><VAlert type="error" variant="tonal">Changes could not be saved.</VAlert></div></template>
    <template #states><VAlert v-model="visible" type="info" variant="tonal" closable>Dismiss this message when finished.</VAlert><VBtn v-if="!visible" variant="text" @click="visible = true">Show alert again</VBtn></template>
  </BaseComponentDoc>
</template>
