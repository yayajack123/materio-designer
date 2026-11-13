<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
import AppStepper from '@/@core/components/AppStepper.vue'

definePageMeta({ sidebarRoute: 'components-stepper' })
useHead({ title: 'Stepper' })

const currentStep = ref(0)
const items = [{ title: 'Details', subtitle: 'Enter information' }, { title: 'Review', subtitle: 'Check the draft' }, { title: 'Ready', subtitle: 'Finish the demo' }]
const usage = `<AppStepper
  v-model:current-step="currentStep"
  :items="steps"
  layout="centered"
/>
<VBtn :disabled="currentStep === 0" @click="currentStep--">Back</VBtn>
<VBtn :disabled="currentStep === steps.length - 1" @click="currentStep++">
  Next
</VBtn>`
const api = [
  { name: 'items', type: 'Item[] · required', description: 'Non-empty list of title, optional subtitle, icon, and size. The implementation reads items[0]; do not pass an empty array.' },
  { name: 'v-model:current-step', type: 'number · default 0', description: 'Zero-based active step. update:currentStep emits the selected index.' },
  { name: 'direction', type: 'horizontal | vertical · default horizontal', description: 'Changes the step sequence orientation. Horizontal steps can scroll through VSlideGroup.' },
  { name: 'layout / align', type: 'default | centered / start | center | end | default', description: 'Centered layout provides progress indicators without clickable step navigation. Align controls the layout alignment.' },
  { name: 'is-active-step-valid', type: 'boolean | undefined', description: 'When defined, direct clicks on default-layout steps are disabled. Parent controls validation and progression; false can show invalid styling.' },
  { name: 'icon-size', type: 'string | number · default 52', description: 'Size for optional item icons; individual item.size can override it.' },
]
const accessibility = ['Use explicit Back/Next buttons for keyboard-accessible progression.', 'Centered layout exposes aria-current="step" for the current item.', 'The existing default layout uses clickable divs without equivalent keyboard handlers. Do not rely on step clicks as the only navigation.', 'Announce the current step and validation errors. Keep a non-empty item list and clamp the selected index.']
</script>

<template>
  <BaseComponentDoc title="Stepper" description="Progress through a short sequence using the existing AppStepper." component-name="AppStepper" source="@core/components/AppStepper.vue; pages/marketing/templates/new.vue; components/dialogs/CreateAppDialog.vue" overview="AppStepper is the project's reusable step indicator. The parent owns step content, validation, and progression. These examples use centered layout with explicit controls so every action is keyboard-accessible." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview>
      <AppStepper v-model:current-step="currentStep" :items="items" layout="centered" />
      <p class="text-body-1 mt-6 mb-4" role="status">Step {{ currentStep + 1 }} of {{ items.length }}: {{ items[currentStep].title }}</p>
      <div class="d-flex flex-wrap gap-3"><VBtn variant="outlined" :disabled="currentStep === 0" @click="currentStep--">Back</VBtn><VBtn :disabled="currentStep === items.length - 1" @click="currentStep++">Next</VBtn><VBtn variant="text" :disabled="currentStep === 0" @click="currentStep = 0">Reset</VBtn></div>
    </template>
    <template #variants>
      <p class="text-body-2 text-medium-emphasis mb-4">Vertical orientation uses the same component. This example is a progress display controlled by the Preview buttons.</p>
      <AppStepper :current-step="currentStep" :items="items" layout="centered" direction="vertical" />
    </template>
    <template #states>
      <p class="text-body-2 text-medium-emphasis mb-4">Completed steps use a check, the current step uses the active indicator, and upcoming steps remain inactive. The final step is selected below.</p>
      <AppStepper :current-step="2" :items="items" layout="centered" />
    </template>
  </BaseComponentDoc>
</template>
