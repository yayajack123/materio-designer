<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-dialog' })
useHead({ title: 'Dialog' })
const open = ref(false)
const confirmed = ref('No action yet.')
const usage = '<VDialog v-model="open" max-width="480">\n  <VCard title="Confirm action">\n    <VCardText>Review the details.</VCardText>\n    <VCardActions><VBtn @click="open = false">Close</VBtn></VCardActions>\n  </VCard>\n</VDialog>'
const api = [{ name: 'v-model / max-width', type: 'boolean / string | number', description: 'Control visibility and constrain the dialog width.' }, { name: 'persistent', type: 'boolean', description: 'Prevent dismissal by outside click or Escape only when necessary.' }, { name: 'activator / default', type: 'slots', description: 'Connect a trigger and supply dialog content.' }]
const accessibility = ['Use a clear title and focusable close action.', 'Return focus to the trigger after closing.', 'Support Escape unless an explicit decision is required.']
</script>
<template>
  <BaseComponentDoc title="Dialog" description="Request attention for a focused task or confirmation." component-name="VDialog" source="components/dialogs/ConfirmDialog.vue" overview="Use VDialog for short, focused interactions. The parent owns visibility and the result." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VBtn @click="open = true">Open confirmation</VBtn><p role="status" class="text-body-2 mt-4 mb-0">{{ confirmed }}</p><VDialog v-model="open" max-width="480" aria-labelledby="dialog-demo-title"><VCard><VCardTitle id="dialog-demo-title">Confirm action</VCardTitle><VCardText>This example updates local demo feedback only.</VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="open = false; confirmed = 'Cancelled.'">Cancel</VBtn><VBtn @click="open = false; confirmed = 'Confirmed.'">Confirm</VBtn></VCardActions></VCard></VDialog></template>
    <template #variants><p class="text-body-2 mb-0">Use confirmation dialogs for decisions and form dialogs for focused editing. Both reuse VDialog and VCard.</p></template>
    <template #states><VBtn disabled>Unavailable action</VBtn><p class="text-body-2 text-medium-emphasis mt-4 mb-0">Disable the trigger when the action is unavailable and explain why in context.</p></template>
  </BaseComponentDoc>
</template>
