<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-buttons' })
useHead({ title: 'Buttons' })

const feedback = ref('No demo action yet.')
const loading = ref(false)
const variants = ['elevated', 'flat', 'outlined', 'tonal', 'text', 'plain'] as const
const usage = `<VBtn color="primary" @click="saveItem">Save item</VBtn>
<VBtn variant="outlined" @click="cancelEdit">Cancel</VBtn>
<VBtn :loading="saving" :disabled="!canSave" @click="saveItem">
  Save changes
</VBtn>`
const api = [
  { name: 'variant', type: 'string', description: 'elevated, flat, outlined, tonal, text, or plain. Project default styling retains the pill shape.' },
  { name: 'color', type: 'string', description: 'Use semantic primary, secondary, success, warning, or error. Project VBtn default is primary.' },
  { name: 'size / density', type: 'string | number / string', description: 'Set control size and density; preserve an adequate touch target.' },
  { name: 'disabled / loading', type: 'boolean', description: 'Prevent interaction or show a pending operation. Keep the label specific to the action.' },
  { name: '@click', type: 'event', description: 'Connect the action to a real handler. Examples here only update local demo feedback.' },
  { name: 'default / prepend / append', type: 'slots', description: 'Provide the action label and optional supporting icons.' },
]
const accessibility = ['Use a verb that explains the action, such as Save changes.', 'Give icon-only buttons an aria-label; decorative icons should use aria-hidden.', 'Keep visible keyboard focus and test Enter/Space activation.', 'Use disabled or loading states to prevent repeated submissions; announce the operation result.']
</script>

<template>
  <BaseComponentDoc title="Buttons" description="Actions, emphasis, and feedback using the project button styles." component-name="VBtn / IconBtn" source="plugins/vuetify/defaults.ts; components/design-system/DesignSystemShowcase.vue" overview="Use buttons for actions and route links for navigation. The project uses pill-shaped VBtn controls with semantic colors; IconBtn is a text-variant VBtn alias." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview>
      <div class="d-flex flex-wrap gap-3">
        <VBtn @click="feedback = 'Save item demo activated.'">Save item</VBtn>
        <VBtn variant="outlined" @click="feedback = 'Cancel demo activated.'">Cancel</VBtn>
        <IconBtn aria-label="Edit demo item" @click="feedback = 'Edit demo activated.'"><VIcon icon="ri-pencil-line" aria-hidden="true" /></IconBtn>
      </div>
      <p class="text-body-2 mt-4 mb-0" role="status">{{ feedback }}</p>
    </template>
    <template #variants>
      <div class="d-flex flex-wrap gap-3">
        <VBtn v-for="variant in variants" :key="variant" :variant="variant" @click="feedback = `${variant} variant activated.`">{{ variant }}</VBtn>
      </div>
    </template>
    <template #states>
      <VSwitch v-model="loading" label="Show loading state" hide-details class="mb-4" />
      <div class="d-flex flex-wrap gap-3">
        <VBtn :loading="loading" @click="feedback = 'State example activated.'">Save changes</VBtn>
        <VBtn disabled>Unavailable</VBtn>
      </div>
      <p class="text-body-2 text-medium-emphasis mt-4 mb-0">Loading is controlled by the switch for this demo. Production handlers should reset it when the operation finishes.</p>
    </template>
  </BaseComponentDoc>
</template>
