<script setup lang="ts">
import DesignSystemShowcase from '@/components/design-system/DesignSystemShowcase.vue'

definePageMeta({ sidebarRoute: 'design-system-typography' })
useHead({ title: 'Typography' })
</script>

<template>
  <DesignSystemShowcase section="typography" />
</template>
