<script setup lang="ts">
import DesignSystemShowcase from '@/components/design-system/DesignSystemShowcase.vue'

definePageMeta({ sidebarRoute: 'design-system-color-system' })
useHead({ title: 'Color System' })
</script>

<template>
  <DesignSystemShowcase section="colors" />
</template>
