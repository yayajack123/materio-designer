<script setup lang="ts">
import { useTheme } from 'vuetify'

const props = withDefaults(defineProps<{ code: string; language?: 'vue' | 'ts' | 'js' | 'html' | 'css' | 'json' | 'bash' }>(), { language: 'vue' })
const theme = useTheme()
const highlightedCode = ref('')
const copyStatus = ref('')
const copyFailed = ref(false)
let highlightVersion = 0

watch([() => props.code, () => props.language, () => theme.current.value.dark], async ([code, language, dark]) => {
  const version = ++highlightVersion
  highlightedCode.value = ''
  copyStatus.value = ''
  try {
    const { codeToHtml } = await import('shiki')
    const html = await codeToHtml(code, { lang: language, theme: dark ? 'github-dark' : 'github-light' })
    if (version === highlightVersion) highlightedCode.value = html
  }
  catch {
    if (version === highlightVersion) highlightedCode.value = ''
  }
}, { immediate: true })

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copyFailed.value = false
    copyStatus.value = 'Code copied.'
  }
  catch {
    copyFailed.value = true
    copyStatus.value = 'Copy failed. Select the code to copy it manually.'
  }
}
</script>

<template>
  <div>
    <div class="code-frame bg-background border rounded">
      <div class="d-flex align-center justify-space-between gap-3 px-4 py-2 border-b">
        <span class="text-caption text-medium-emphasis">{{ language.toUpperCase() }}</span>
        <VBtn variant="text" color="primary" size="small" :prepend-icon="copyStatus && !copyFailed ? 'ri-check-line' : 'ri-file-copy-line'" @click="copyCode">{{ copyStatus && !copyFailed ? 'Copied' : 'Copy code' }}</VBtn>
      </div>
      <!-- Shiki escapes source text before generating highlighted markup. -->
      <div v-if="highlightedCode" class="code-highlight" v-html="highlightedCode" />
      <pre v-else class="code-fallback"><code>{{ code }}</code></pre>
    </div>
    <p v-if="copyStatus" role="status" class="text-body-2 mt-2 mb-0" :class="copyFailed ? 'text-error' : 'text-success'">{{ copyStatus }}</p>
  </div>
</template>

<style scoped>
.code-frame { overflow: hidden; }
.code-highlight, .code-fallback { max-block-size: 500px; overflow: auto; }
.code-highlight :deep(pre), .code-fallback { margin: 0; padding: 20px; background: transparent !important; font: 13px/1.6 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: pre; }
.code-highlight :deep(code) { font: inherit; }
</style>
