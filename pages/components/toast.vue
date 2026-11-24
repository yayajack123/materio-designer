<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-toast' })
useHead({ title: 'Toast' })
const open = ref(false)
const message = ref('Changes saved.')
const color = ref('success')
const show = (nextMessage: string, nextColor: string) => { message.value = nextMessage; color.value = nextColor; open.value = true }
const usage = `<VBtn @click="open = true">Show toast</VBtn>
<VSnackbar v-model="open" color="success" :timeout="3000">
  Changes saved.
</VSnackbar>`
const api = [
  { name: 'v-model', type: 'boolean', description: 'Control visibility of the underlying VSnackbar.' },
  { name: 'color', type: 'string', description: 'Use a semantic color appropriate to the result.' },
  { name: 'timeout', type: 'number', description: 'Set the display duration in milliseconds.' },
  { name: 'default', type: 'slot', description: 'Supply a short result message.' },
]
const accessibility = ['Keep feedback concise and understandable without color.', 'Allow enough time to read the message.', 'Keep important errors available in context rather than only in a toast.']
</script>

<template>
  <BaseComponentDoc title="Toast" description="Give brief feedback after an action using the project snackbar pattern." component-name="VSnackbar" source="pages/dashboard-teacher.vue; components/design-system/DesignSystemShowcase.vue" overview="Toast feedback uses VSnackbar in this project." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VBtn @click="show('Changes saved.', 'success')">Show toast</VBtn><VSnackbar v-model="open" :color="color" :timeout="3000">{{ message }}</VSnackbar></template>
    <template #variants><div class="d-flex flex-wrap gap-3"><VBtn color="success" @click="show('Changes saved.', 'success')">Success</VBtn><VBtn color="error" @click="show('Changes could not be saved.', 'error')">Error</VBtn><VBtn color="info" @click="show('Your update is ready.', 'info')">Info</VBtn></div></template>
    <template #states><p class="text-body-2 mb-0">The toast closes automatically. Use the Snackbar pattern when a visible action or dismissal control is needed.</p></template>
  </BaseComponentDoc>
</template>
