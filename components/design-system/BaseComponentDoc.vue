<script setup lang="ts">
interface ApiItem {
  name: string
  type: string
  description: string
}

const exampleTab = ref('preview')

defineProps<{
  title: string
  description: string
  componentName: string
  source: string
  overview: string
  usage: string
  api: ApiItem[]
  accessibility: string[]
}>()
</script>

<template>
  <article class="doc-page bg-surface border rounded pa-6 pa-md-10">
    <header class="pb-8">
      <h1 class="text-h4 mb-2">{{ title }}</h1>
      <p class="text-body-1 text-medium-emphasis mb-4">{{ description }}</p>
      <div class="d-flex flex-wrap gap-2" aria-label="Components">
        <VChip v-for="name in componentName.split(' / ')" :key="name" size="small" color="secondary" variant="tonal">
          <code>{{ name }}</code>
        </VChip>
      </div>
    </header>
    <section class="doc-section">
      <h2 class="text-h5 mb-2">Preview</h2>
      <p class="text-body-2 text-medium-emphasis mb-6">Try the component or view its usage example.</p>
      <div class="border rounded">
        <VTabs v-model="exampleTab" class="v-tabs-bordered px-4" aria-label="Component example">
          <VTab id="doc-example-preview-tab" value="preview" aria-controls="doc-example-preview-panel">Preview</VTab>
          <VTab id="doc-example-code-tab" value="code" aria-controls="doc-example-code-panel">Code</VTab>
        </VTabs>
        <div id="doc-example-preview-panel" v-show="exampleTab === 'preview'" role="tabpanel" aria-labelledby="doc-example-preview-tab" class="pa-6">
          <slot name="preview" />
        </div>
        <div id="doc-example-code-panel" v-show="exampleTab === 'code'" role="tabpanel" aria-labelledby="doc-example-code-tab" class="pa-6">
          <p class="text-body-2 text-medium-emphasis mb-4">Template example. Declare the referenced state and handlers in the parent page.</p>
          <pre class="doc-code bg-background rounded border pa-4 text-body-2"><code class="text-high-emphasis">{{ usage }}</code></pre>
        </div>
      </div>
    </section>
    <section class="doc-section">
      <h2 class="text-h5 mb-4">Variants</h2>
      <slot name="variants" />
    </section>
    <section class="doc-section">
      <h2 class="text-h5 mb-4">States</h2>
      <slot name="states" />
    </section>
    <section class="doc-section">
      <h2 class="text-h5 mb-2">API</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">Key props, models, events, and slots used in these examples; not the full upstream API.</p>
      <VTable class="doc-api-table border rounded">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in api" :key="item.name">
            <th scope="row"><code class="text-high-emphasis">{{ item.name }}</code></th>
            <td><code class="text-high-emphasis">{{ item.type }}</code></td>
            <td>{{ item.description }}</td>
          </tr>
        </tbody>
      </VTable>
    </section>
    <section class="doc-section">
      <h2 class="text-h5 mb-4">Accessibility</h2>
      <ul class="text-body-2 ps-5">
        <li v-for="guideline in accessibility" :key="guideline" class="mb-2">{{ guideline }}</li>
      </ul>
    </section>
  </article>
</template>

<style scoped>
.doc-page { min-width: 0; }
.doc-section { padding-block: 32px; border-block-start: thin solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.doc-section:last-child { padding-block-end: 0; }
.doc-code { white-space: pre-wrap; overflow-wrap: anywhere; }
.doc-api-table :deep(table) { min-width: 600px; }
.doc-api-table :deep(.v-table__wrapper > table > thead > tr > th),
.doc-api-table :deep(.v-table__wrapper > table > tbody > tr > th),
.doc-api-table :deep(.v-table__wrapper > table > tbody > tr > td) { padding-block: 16px; vertical-align: middle; }
.doc-api-table :deep(tbody th) { text-align: start; font-weight: normal; }
.doc-api-table code { overflow-wrap: anywhere; }
</style>
