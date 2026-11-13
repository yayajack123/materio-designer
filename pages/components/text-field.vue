<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-text-field' })
useHead({ title: 'Text Field' })

const name = ref('')
const email = ref('')
const filledValue = ref('')
const soloValue = ref('')
const rules = [(value: string) => !!value || 'Enter an email address.', (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Enter a valid email address.']
const usage = `<VTextField
  v-model="email"
  label="Email address"
  type="email"
  autocomplete="email"
  :rules="emailRules"
  hide-details="auto"
/>`
const api = [
  { name: 'v-model', type: 'string | number | null', description: 'The field value. A clearable field can emit null; normalize it before calling string methods.' },
  { name: 'label / placeholder / hint', type: 'string', description: 'Use a persistent, meaningful label; hints add guidance and placeholders show an example.' },
  { name: 'variant / density', type: 'string', description: 'Project defaults use outlined and comfortable. Compact density is scoped to specific areas such as builder inspectors.' },
  { name: 'rules', type: 'array of validation functions', description: 'Return true for valid input or a helpful error string. Validate again on the server when saving.' },
  { name: 'error-messages', type: 'string | string[]', description: 'Display validation or API errors next to the relevant field.' },
  { name: 'disabled / readonly', type: 'boolean', description: 'Disabled prevents interaction; readonly preserves a value that the user cannot edit.' },
  { name: 'prepend-inner-icon / append-inner', type: 'prop / slot', description: 'Use bundled icons or an appended control with its own accessible label.' },
]
const accessibility = ['Keep a visible label; a placeholder is not a replacement.', 'Use appropriate type and autocomplete values for email, names, and passwords.', 'Explain how to correct an error in text. Do not communicate errors through color alone.', 'Keep helper and error text visible with hide-details="auto" when using validation.']
</script>

<template>
  <BaseComponentDoc title="Text Field" description="Labeled input, validation, and field states." component-name="VTextField" source="plugins/vuetify/defaults.ts; pages/login.vue; components/marketing/MarketingElementProperties.vue" overview="Use VTextField for short text and single-value input. The project defaults to outlined fields with comfortable density; compact fields are used in specific builder panels. Data and validation remain in the parent page." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview>
      <VRow>
        <VCol cols="12" md="6"><VTextField v-model="name" label="Display name" placeholder="Example: Alex" autocomplete="name" hint="Shown in the demo preview below." persistent-hint /></VCol>
      </VRow>
      <p class="text-body-2 mt-4 mb-0" role="status">Preview: {{ name || 'Enter a display name' }}</p>
    </template>
    <template #variants>
      <VRow>
        <VCol cols="12" md="4"><VTextField label="Outlined" variant="outlined" hide-details /></VCol>
        <VCol cols="12" md="4"><VTextField v-model="filledValue" label="Filled" variant="filled" hide-details /></VCol>
        <VCol cols="12" md="4"><VTextField v-model="soloValue" label="Solo" variant="solo" hide-details /></VCol>
      </VRow>
      <p class="text-body-2 text-medium-emphasis mt-4 mb-0">Outlined is the project default. Filled and solo are existing Vuetify options shown for comparison.</p>
    </template>
    <template #states>
      <VRow>
        <VCol cols="12" md="6"><VTextField v-model="email" label="Email validation demo" type="email" :rules="rules" validate-on="input" hide-details="auto" hint="Type an invalid email to see validation." persistent-hint /></VCol>
        <VCol cols="12" md="6"><VTextField label="Error example" model-value="invalid address" error-messages="Enter an address such as name@example.com." /></VCol>
        <VCol cols="12" md="6"><VTextField label="Disabled" model-value="Unavailable" disabled hide-details /></VCol>
        <VCol cols="12" md="6"><VTextField label="Read only" model-value="Reference value" readonly hide-details /></VCol>
      </VRow>
    </template>
  </BaseComponentDoc>
</template>
