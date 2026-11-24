<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-avatar' })
useHead({ title: 'Avatar' })
const usage = '<VAvatar color="primary" aria-label="Alex Morgan">AM</VAvatar>'
const api = [
  { name: 'size', type: 'string | number', description: 'Set the avatar dimensions.' },
  { name: 'color / rounded', type: 'string | boolean', description: 'Set a theme color and shape.' },
  { name: 'image / icon', type: 'string', description: 'Display an image or icon. Initials can be supplied in the default slot.' },
]
const accessibility = ['Provide an accessible name when the avatar identifies a person.', 'Hide decorative avatars from assistive technology when adjacent text already identifies the person.', 'Provide a meaningful fallback when an image is unavailable.']
</script>

<template>
  <BaseComponentDoc title="Avatar" description="Represent a person or account with an image, initials, or icon." component-name="VAvatar" source="components/design-system/DesignSystemShowcase.vue" overview="Use avatars to identify people." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VAvatar color="primary" aria-label="Alex Morgan">AM</VAvatar></template>
    <template #variants><div class="d-flex align-center flex-wrap gap-4"><VAvatar size="32" color="primary" aria-label="Alex Morgan">AM</VAvatar><VAvatar size="48" color="secondary" aria-label="Alex Morgan">AM</VAvatar><VAvatar color="info" icon="ri-user-line" aria-label="User" /></div></template>
    <template #states><VAvatar color="secondary" icon="ri-user-line" aria-label="User image unavailable" /><p class="text-body-2 text-medium-emphasis mt-4 mb-0">Use initials or an icon when no image is available.</p></template>
  </BaseComponentDoc>
</template>
