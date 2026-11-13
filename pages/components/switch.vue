<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-switch' })
useHead({ title: 'Switch' })
const enabled = ref(false)
const usage = '<VSwitch v-model="enabled" label="Enable notifications" />'
const api = [{ name: 'v-model', type: 'boolean', description: 'Current on or off value.' }, { name: 'label / color', type: 'string', description: 'Describe the setting and use semantic theme colors.' }, { name: 'disabled / loading', type: 'boolean', description: 'Indicate unavailable or pending settings.' }]
const accessibility = ['Label the setting, not the action to toggle it.', 'Do not rely on color alone to communicate state.', 'Explain whether changes save immediately and announce failures.']
</script>
<template>
  <BaseComponentDoc title="Switch" description="Toggle a single setting on or off." component-name="VSwitch" source="plugins/vuetify/defaults.ts; components/marketing/MarketingBuilder.vue" overview="Use a switch for a binary setting. Saving and error handling belong to the parent application." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VSwitch v-model="enabled" label="Enable notifications" hide-details /><p role="status" class="text-body-2 mt-4 mb-0">Notifications: {{ enabled ? 'On' : 'Off' }} (demo only)</p></template>
    <template #variants><VSwitch v-model="enabled" label="Compact setting" density="compact" color="primary" hide-details /></template>
    <template #states><VSwitch label="Unavailable" disabled hide-details /><VSwitch label="Saving" :model-value="true" loading disabled hide-details /></template>
  </BaseComponentDoc>
</template>
