<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-slider' })
useHead({ title: 'Slider' })
const value = ref(40)
const range = ref([20, 80])
const usage = '<VSlider v-model="value" label="Opacity" :min="0" :max="100" :step="10" thumb-label />'
const api = [
  { name: 'v-model', type: 'number', description: 'Current value; VRangeSlider uses a pair of values.' },
  { name: 'min / max / step', type: 'number', description: 'Define the allowed range and increments.' },
  { name: 'label / thumb-label', type: 'string / boolean | string', description: 'Label the control and optionally show the current value.' },
  { name: 'disabled / readonly', type: 'boolean', description: 'Prevent changes to an unavailable or read-only value.' },
]
const accessibility = ['Provide a visible label and meaningful range.', 'Support keyboard adjustments and show the current value.', 'Offer a precise input when small increments matter.']
</script>

<template>
  <BaseComponentDoc title="Slider" description="Adjust a value or range within defined limits." component-name="VSlider / VRangeSlider" source="plugins/vuetify/defaults.ts; components/marketing/MarketingElementProperties.vue" overview="Use sliders for bounded values." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VSlider v-model="value" label="Opacity" :min="0" :max="100" :step="10" thumb-label /><p class="text-body-2 mb-0">Opacity: {{ value }}%</p></template>
    <template #variants><VRangeSlider v-model="range" label="Range" :min="0" :max="100" :step="10" thumb-label /><p class="text-body-2 mb-0">Range: {{ range[0] }}–{{ range[1] }}</p></template>
    <template #states><VSlider label="Unavailable" :model-value="40" disabled /></template>
  </BaseComponentDoc>
</template>
