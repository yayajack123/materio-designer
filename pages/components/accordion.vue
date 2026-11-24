<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

definePageMeta({ sidebarRoute: 'components-accordion' })
useHead({ title: 'Accordion' })

const activePanel = ref<string | undefined>()
const multiplePanels = ref<string[]>([])
const usage = `<VExpansionPanels v-model="activePanel" variant="accordion">
  <VExpansionPanel value="details">
    <VExpansionPanelTitle>Details</VExpansionPanelTitle>
    <VExpansionPanelText>Review the details of this item.</VExpansionPanelText>
  </VExpansionPanel>
  <VExpansionPanel value="requirements">
    <VExpansionPanelTitle>Requirements</VExpansionPanelTitle>
    <VExpansionPanelText>Check the requirements before continuing.</VExpansionPanelText>
  </VExpansionPanel>
</VExpansionPanels>`
const api = [
  { name: 'v-model', type: 'unknown | unknown[]', description: 'Control the selected panel value; with multiple, use an array of values.' },
  { name: 'variant', type: 'string', description: 'Choose the panel presentation, such as accordion, default, inset, or popout.' },
  { name: 'multiple / mandatory', type: 'boolean | string', description: 'Allow multiple open panels or require a selection.' },
  { name: 'value / disabled', type: 'unknown / boolean', description: 'Set a panel identity or prevent it from opening.' },
  { name: 'VExpansionPanelTitle / VExpansionPanelText', type: 'components', description: 'Provide the expandable heading and its content.' },
]
const accessibility = ['Use clear headings that describe each panel’s content.', 'Ensure panel titles remain keyboard operable and expose their expanded state.', 'Explain why a disabled panel is unavailable when the reason is not obvious.']
</script>

<template>
  <BaseComponentDoc title="Accordion" description="Organize related content into expandable panels." component-name="VExpansionPanels / VExpansionPanel" source="components/marketing/MarketingTemplateDetailsDrawer.vue; pages/student-session-history.vue" overview="Use expansion panels to disclose related details." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview>
      <VExpansionPanels v-model="activePanel" variant="accordion">
        <VExpansionPanel value="details">
          <VExpansionPanelTitle>Details</VExpansionPanelTitle>
          <VExpansionPanelText>Review the details of this item.</VExpansionPanelText>
        </VExpansionPanel>
        <VExpansionPanel value="requirements">
          <VExpansionPanelTitle>Requirements</VExpansionPanelTitle>
          <VExpansionPanelText>Check the requirements before continuing.</VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>
    </template>
    <template #variants>
      <p class="text-body-2 text-medium-emphasis mb-4">Allow multiple panels to stay open when users need to compare content.</p>
      <VExpansionPanels v-model="multiplePanels" multiple variant="accordion">
        <VExpansionPanel value="first"><VExpansionPanelTitle>First section</VExpansionPanelTitle><VExpansionPanelText>Content for the first section.</VExpansionPanelText></VExpansionPanel>
        <VExpansionPanel value="second"><VExpansionPanelTitle>Second section</VExpansionPanelTitle><VExpansionPanelText>Content for the second section.</VExpansionPanelText></VExpansionPanel>
      </VExpansionPanels>
    </template>
    <template #states>
      <VExpansionPanels variant="accordion">
        <VExpansionPanel disabled><VExpansionPanelTitle>Unavailable section</VExpansionPanelTitle><VExpansionPanelText>This content cannot be opened.</VExpansionPanelText></VExpansionPanel>
      </VExpansionPanels>
      <p class="text-body-2 text-medium-emphasis mt-4 mb-0">This section is unavailable until its required information is provided.</p>
    </template>
  </BaseComponentDoc>
</template>
