<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-buttons' })
useHead({ title: 'Buttons' })

const feedback = ref('No demo action yet.')
const loading = ref(false)
const variants = ['elevated', 'flat', 'outlined', 'tonal', 'text', 'plain'] as const
const previewVariant = ref<typeof variants[number]>('elevated')
const previewSize = ref<'small' | 'default' | 'large'>('default')
const previewDisabled = ref(false)
const previewLoading = ref(false)
const previewCode = computed(() => `<VBtn variant="${previewVariant.value}" size="${previewSize.value}"${previewDisabled.value ? ' disabled' : ''}${previewLoading.value ? ' loading' : ''}>\n  Save item\n</VBtn>`)
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
  <BaseComponentDoc title="Buttons" description="Actions, emphasis, and feedback using the project button styles." component-name="VBtn / IconBtn" source="plugins/vuetify/defaults.ts; components/design-system/DesignSystemShowcase.vue" overview="Use buttons for actions and route links for navigation. The project uses pill-shaped VBtn controls with semantic colors; IconBtn is a text-variant VBtn alias." :usage="previewCode" :api="api" :accessibility="accessibility">
    <template #preview>
      <div class="preview-stage bg-background border rounded d-flex align-center justify-center pa-6">
        <VBtn :variant="previewVariant" :size="previewSize" :disabled="previewDisabled" :loading="previewLoading" @click="feedback = 'Save item demo activated.'">Save item</VBtn>
      </div>
      <div class="preview-controls mt-6">
        <VSelect v-model="previewVariant" label="Variant" :items="variants" />
        <VSelect v-model="previewSize" label="Size" :items="['small', 'default', 'large']" />
        <VSwitch v-model="previewDisabled" label="Disabled" hide-details />
        <VSwitch v-model="previewLoading" label="Loading" hide-details />
      </div>
      <p class="text-body-2 mt-4 mb-4" role="status">{{ feedback }}</p>
    </template>
    <template #variants>
      <div class="d-flex flex-wrap gap-3">
        <VBtn v-for="variant in variants" :key="variant" :variant="variant" @click="feedback = `${variant} variant activated.`">{{ variant }}</VBtn>
      </div>
      <div class="d-flex flex-wrap gap-3 mt-6">
        <VBtn prepend-icon="ri-add-line">Add item</VBtn>
        <IconBtn aria-label="Edit demo item" @click="feedback = 'Edit demo activated.'"><VIcon icon="ri-pencil-line" aria-hidden="true" /></IconBtn>
        <VBtn color="error" variant="outlined">Delete item</VBtn>
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

<style scoped>
.preview-stage { min-block-size: 160px; }
.preview-controls { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; align-items: center; }
</style>
