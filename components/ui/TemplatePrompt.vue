<script setup lang="ts">
import { templatePrompts } from '@/data/templatePrompts'

const props = defineProps<{ template: keyof typeof templatePrompts }>()
const open = ref(false)
const message = ref('')
const failed = ref(false)
let trigger: HTMLElement | null = null
const show = () => {
  trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  message.value = ''
  open.value = true
}
const restoreFocus = () => { if (trigger?.isConnected) trigger.focus() }
const copy = async () => {
  try {
    await navigator.clipboard.writeText(templatePrompts[props.template])
    failed.value = false
    message.value = 'Prompt copied.'
  }
  catch {
    failed.value = true
    message.value = 'Copy failed. Select the prompt and copy it manually.'
  }
}
</script>

<template>
  <div class="template-prompt">
    <VBtn icon variant="outlined" color="primary" aria-label="Template prompt" @click="show"><VIcon icon="ri-file-copy-line" aria-hidden="true" /><VTooltip activator="parent">Template prompt</VTooltip></VBtn>
    <VDialog v-model="open" max-width="720" aria-labelledby="template-prompt-title" @after-leave="restoreFocus">
      <VCard class="bg-surface">
        <VCardTitle id="template-prompt-title" class="pa-6 pb-2">Template prompt</VCardTitle>
        <VCardText><p class="text-body-2 text-medium-emphasis">Copy and adapt this prompt to your project.</p><pre class="prompt-content pa-4 rounded border text-body-2">{{ templatePrompts[template] }}</pre><p v-if="message" role="status" class="text-body-2 mt-3 mb-0" :class="failed ? 'text-error' : 'text-success'">{{ message }}</p></VCardText>
        <VCardActions class="pa-4"><VSpacer /><VBtn variant="text" color="secondary" @click="open = false">Close</VBtn><VBtn prepend-icon="ri-file-copy-line" @click="copy">Copy prompt</VBtn></VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.template-prompt { display: flex; justify-content: flex-end; }
.prompt-content { white-space: pre-wrap; overflow-wrap: anywhere; max-block-size: 50vh; overflow-y: auto; font-family: inherit; background: rgb(var(--v-theme-background)); }
</style>
