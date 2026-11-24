<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-snackbar' })
useHead({ title: 'Snackbar' })
const open = ref(false)
const message = ref('Changes saved.')
const color = ref('success')
const show = (nextMessage: string, nextColor: string) => { message.value = nextMessage; color.value = nextColor; open.value = true }
const usage = `<VBtn @click="open = true">Show snackbar</VBtn>
<VSnackbar v-model="open" color="success" :timeout="4000">
  Changes saved.
  <template #actions><VBtn variant="text" @click="open = false">Close</VBtn></template>
</VSnackbar>`
const api = [
  { name: 'v-model', type: 'boolean', description: 'Control snackbar visibility.' },
  { name: 'color / timeout', type: 'string / number', description: 'Set a semantic color and display duration in milliseconds.' },
  { name: 'location', type: 'string', description: 'Choose the snackbar position.' },
  { name: 'actions', type: 'slot', description: 'Provide an optional dismissal or related action.' },
]
const accessibility = ['Keep messages concise and announce the result.', 'Provide enough time to read and activate any action.', 'Do not use temporary messages for information that must remain available.']
</script>

<template>
  <BaseComponentDoc title="Snackbar" description="Show temporary feedback with an optional action." component-name="VSnackbar" source="components/design-system/DesignSystemShowcase.vue; pages/account.vue" overview="Use snackbars for transient feedback." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VBtn @click="show('Changes saved.', 'success')">Show snackbar</VBtn><VSnackbar v-model="open" :color="color" :timeout="4000">{{ message }}<template #actions><VBtn variant="text" @click="open = false">Close</VBtn></template></VSnackbar></template>
    <template #variants><div class="d-flex flex-wrap gap-3"><VBtn color="success" @click="show('Changes saved.', 'success')">Success</VBtn><VBtn color="error" @click="show('Changes could not be saved.', 'error')">Error</VBtn></div></template>
    <template #states><p class="text-body-2 mb-0">A snackbar closes after its timeout or when the user selects Close. Persistent errors should remain visible in context.</p></template>
  </BaseComponentDoc>
</template>
