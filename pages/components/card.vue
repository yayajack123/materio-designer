<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
definePageMeta({ sidebarRoute: 'components-card' })
useHead({ title: 'Card' })
const message = ref('No action yet.')
const usage = '<VCard>\n  <VCardTitle>Project details</VCardTitle>\n  <VCardText>Content goes here.</VCardText>\n  <VCardActions><VBtn @click="openDetails">View details</VBtn></VCardActions>\n</VCard>'
const api = [{ name: 'variant / elevation', type: 'string / number', description: 'Choose surface treatment and elevation according to hierarchy.' }, { name: 'VCardTitle / VCardText / VCardActions', type: 'components', description: 'Structure the title, body and optional actions.' }, { name: 'loading / disabled', type: 'boolean', description: 'Indicate pending or unavailable card interaction.' }]
const accessibility = ['Use a heading appropriate to the page hierarchy.', 'Place actions in real buttons or links with clear labels.', 'Keep text readable in both themes.']
</script>
<template>
  <BaseComponentDoc title="Card" description="Group related content and actions." component-name="VCard" source="spec/design.md; @core/components/cards" overview="VCard uses the surface theme color and groups related information. Use the existing card subcomponents for content and actions." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><VCard variant="outlined"><VCardTitle>Project details</VCardTitle><VCardText>Review the current project information.</VCardText><VCardActions><VBtn @click="message = 'Details action activated.'">View details</VBtn></VCardActions></VCard><p role="status" class="text-body-2 mt-4 mb-0">{{ message }}</p></template>
    <template #variants><VRow><VCol cols="12" md="6"><VCard variant="outlined"><VCardText>Outlined card</VCardText></VCard></VCol><VCol cols="12" md="6"><VCard variant="tonal" color="primary"><VCardText>Tonal card</VCardText></VCard></VCol></VRow></template>
    <template #states><VCard loading variant="outlined"><VCardText>Loading content</VCardText></VCard></template>
  </BaseComponentDoc>
</template>
