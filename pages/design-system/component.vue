<script setup lang="ts">
import DesignSystemShowcase from '@/components/design-system/DesignSystemShowcase.vue'

definePageMeta({ sidebarRoute: 'design-system-component' })
useHead({ title: 'Component' })
</script>

<template>
  <DesignSystemShowcase section="components" />
</template>
