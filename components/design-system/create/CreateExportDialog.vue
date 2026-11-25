<script setup lang="ts">
import type { ExportBundleResult } from '@/utils/designSystemCreate'
import CodeHighlight from '@/components/ui/CodeHighlight.vue'

const props = defineProps<{
  modelValue: boolean
  bundle: ExportBundleResult
  copyState: 'idle' | 'copied' | 'failed'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'copy-prompt'): void
  (e: 'download-zip'): void
  (e: 'after-leave'): void
}>()

const activeFileTab = ref<'prompt' | 'howto' | 'env' | 'overrides' | 'json'>('prompt')

const fileTabs = [
  { value: 'prompt', label: 'AI_SETUP_PROMPT.md', icon: 'ri-sparkling-line' },
  { value: 'howto', label: 'HOW_TO_SETUP.md', icon: 'ri-book-open-line' },
  { value: 'env', label: '.env.example', icon: 'ri-terminal-box-line' },
  { value: 'overrides', label: 'vuetify-overrides.md', icon: 'ri-code-s-slash-line' },
  { value: 'json', label: 'design-tokens.json', icon: 'ri-braces-line' },
] as const

const close = () => emit('update:modelValue', false)
</script>

<template>
  <VDialog
    :model-value="props.modelValue"
    max-width="860"
    aria-labelledby="create-export-dialog-title"
    @update:model-value="val => emit('update:modelValue', val)"
    @after-leave="emit('after-leave')"
  >
    <VCard class="bg-surface">
      <DialogCloseBtn aria-label="Close export dialog" @click="close" />

      <div class="px-6 pt-5 pb-4">
        <h2 id="create-export-dialog-title" class="text-h5 font-weight-medium text-high-emphasis mb-1">
          Export design system setup
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-0 pe-8">
          Paste the AI setup prompt directly into your coding agent, or download the complete how-to ZIP archive containing all 5 setup files.
        </p>
      </div>

      <VTabs
        v-model="activeFileTab"
        show-arrows
        class="v-tabs-bordered px-4"
        aria-label="Generated setup files"
      >
        <VTab
          v-for="tab in fileTabs"
          :key="tab.value"
          :value="tab.value"
          class="text-body-2 font-weight-medium"
        >
          <VIcon start :icon="tab.icon" size="16" aria-hidden="true" />
          {{ tab.label }}
        </VTab>
      </VTabs>

      <VCardText class="pa-6">
        <div v-show="activeFileTab === 'prompt'">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Ready-to-paste instructions for Antigravity, Cursor, Claude Code, or Codex aligned with <code>NEW_PROJECT_SETUP.md</code> and <code>spec/design.md</code>.
          </p>
          <pre class="markdown-preview bg-background rounded border pa-4 text-body-2 text-high-emphasis mb-0">{{ props.bundle.promptText }}</pre>
        </div>

        <div v-show="activeFileTab === 'howto'">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Step-by-step setup guide included as <code>HOW_TO_SETUP.md</code> inside the downloaded ZIP bundle.
          </p>
          <pre class="markdown-preview bg-background rounded border pa-4 text-body-2 text-high-emphasis mb-0">{{ props.bundle.howToMarkdown }}</pre>
        </div>

        <div v-show="activeFileTab === 'env'">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Pre-filled public deployment environment template (<code>.env.example</code>).
          </p>
          <CodeHighlight :code="props.bundle.envContent" language="bash" />
        </div>

        <div v-show="activeFileTab === 'overrides'">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Manual Vuetify &amp; SCSS override reference (<code>vuetify-overrides.md</code>).
          </p>
          <pre class="markdown-preview bg-background rounded border pa-4 text-body-2 text-high-emphasis mb-0">{{ props.bundle.overridesMarkdown }}</pre>
        </div>

        <div v-show="activeFileTab === 'json'">
          <p class="text-body-2 text-medium-emphasis mb-3">
            Machine-readable token manifest and shareable studio URL (<code>design-tokens.json</code>).
          </p>
          <CodeHighlight :code="props.bundle.tokensJson" language="json" />
        </div>
      </VCardText>

      <VDivider />

      <VCardActions class="pa-4 flex-wrap gap-2">
        <VBtn variant="text" color="secondary" @click="close">
          Close
        </VBtn>
        <VSpacer />
        <VBtn
          type="button"
          variant="outlined"
          prepend-icon="ri-folder-zip-line"
          @click="emit('download-zip')"
        >
          Download how-to (.zip)
        </VBtn>
        <VBtn
          type="button"
          :color="props.copyState === 'failed' ? 'error' : 'primary'"
          :prepend-icon="props.copyState === 'copied' ? 'ri-check-line' : 'ri-sparkling-line'"
          @click="emit('copy-prompt')"
        >
          {{ props.copyState === 'copied' ? 'Copied AI prompt' : 'Copy AI setup prompt' }}
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.markdown-preview {
  max-block-size: min(52vh, 420px);
  overflow-y: auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  line-height: 1.6;
  user-select: text;
}
</style>
