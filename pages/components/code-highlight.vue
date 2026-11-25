<script setup lang="ts">
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'
import CodeHighlight from '@/components/ui/CodeHighlight.vue'

definePageMeta({ sidebarRoute: 'components-code-highlight' })
useHead({ title: 'Code Highlight' })

const sample = `<VBtn color="primary" @click="save">
  Save changes
</VBtn>`
const usage = `<script setup lang="ts">
import CodeHighlight from '@/components/ui/CodeHighlight.vue'

const example = '<VBtn color="primary">Save</VBtn>'
<\/script>

<template>
  <CodeHighlight :code="example" language="vue" />
</template>`
const api = [
  { name: 'code', type: 'string', description: 'Required source text to display and copy.' },
  { name: 'language', type: "'vue' | 'ts' | 'js' | 'html' | 'css' | 'json' | 'bash'", description: 'Syntax language; defaults to vue.' },
  { name: 'Theme', type: 'automatic', description: 'Follows the active light or dark theme.' },
  { name: 'Copy feedback', type: 'built-in', description: 'Shows success or manual-copy guidance when clipboard access fails.' },
]
const accessibility = [
  'Keep the copy button available to keyboard and touch users.',
  'Code can be selected manually and scrolled within its frame.',
  'Copy feedback is announced as a status message.',
]
</script>

<template>
  <BaseComponentDoc title="Code Highlight" description="Display and copy syntax-highlighted code examples." component-name="CodeHighlight" source="components/ui/CodeHighlight.vue" overview="A theme-aware, read-only code block with copy feedback." :usage="usage" :api="api" :accessibility="accessibility">
    <template #preview><CodeHighlight :code="sample" language="vue" /></template>
    <template #variants>
      <div class="d-flex flex-column gap-6">
        <div><h3 class="text-h6 mb-3">TypeScript</h3><CodeHighlight :code="`const message: string = 'Hello, Materio!'`" language="ts" /></div>
        <div><h3 class="text-h6 mb-3">Shell</h3><CodeHighlight code="pnpm install" language="bash" /></div>
      </div>
    </template>
    <template #states>
      <p class="text-body-2 text-medium-emphasis mb-4">Copy a snippet to see feedback. If highlighting is unavailable, the component displays selectable plain text.</p>
      <CodeHighlight code="{ &quot;status&quot;: &quot;ready&quot; }" language="json" />
    </template>
  </BaseComponentDoc>
</template>
