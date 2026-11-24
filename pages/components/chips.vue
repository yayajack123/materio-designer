<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-chips' })
useHead({ title: 'Chips' })
const visible = ref(true)
const usage = '<VChip color="success" variant="tonal">Published</VChip>'
const api = [
  { name: 'color / variant', type: 'string', description: 'Choose a semantic color and visual treatment.' },
  { name: 'size / prepend-icon', type: 'string', description: 'Set the chip size and an optional supporting icon.' },
  { name: 'closable / v-model', type: 'boolean', description: 'Allow a chip to be removed and control its visibility.' },
  { name: 'disabled', type: 'boolean', description: 'Prevent interaction when a chip is unavailable.' },
]
const accessibility = ['Use text as well as color to communicate status.', 'Give removable chips a clear context and accessible removal action.', 'Use interactive chips only when they perform an action.']
</script>

<template>
  <BaseComponentDoc title="Chips" description="Show compact labels, statuses, and removable selections." component-name="VChip" source="components/marketing/MarketingTemplateDetailsDrawer.vue" overview="Use chips for compact labels." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VChip color="success" variant="tonal">Published</VChip></template>
    <template #variants><div class="d-flex flex-wrap gap-3"><VChip color="primary" variant="flat">Primary</VChip><VChip color="info" variant="outlined">In review</VChip><VChip color="warning" variant="tonal">Pending</VChip></div></template>
    <template #states><div class="d-flex flex-wrap align-center gap-3"><VChip v-model="visible" closable close-label="Remove Design filter">Design</VChip><VBtn v-if="!visible" size="small" variant="text" @click="visible = true">Restore filter</VBtn><VChip disabled>Unavailable</VChip></div></template>
  </BaseComponentDoc>
</template>
