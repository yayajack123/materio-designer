<script setup lang="ts">
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'

interface ApiItem {
  name: string
  type: string
  description: string
}

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
  <section>
    <UiSectionHeader :title="title" title-class="text-h4" :description="description" />
    <VRow>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Overview</h2>
            <p class="text-body-1 mb-4">{{ overview }}</p>
            <p class="text-body-2 mb-1">Component: <code class="text-high-emphasis">{{ componentName }}</code></p>
            <p class="text-body-2 text-medium-emphasis mb-0 doc-source">Project reference: <code class="text-high-emphasis">{{ source }}</code></p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Preview</h2>
            <p class="text-body-2 text-medium-emphasis mb-6">Try the component with local demo data.</p>
            <slot name="preview" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-4">Variants</h2>
            <slot name="variants" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-4">States</h2>
            <slot name="states" />
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Usage</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Template example. Declare the referenced state and handlers in the parent page.</p>
            <pre class="doc-code bg-background rounded border pa-4 text-body-2"><code class="text-high-emphasis">{{ usage }}</code></pre>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">API</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Key props, models, events, and slots used in these examples; not the full upstream API.</p>
            <dl>
              <div v-for="(item, index) in api" :key="item.name" class="doc-api-item">
                <VDivider v-if="index" class="my-4" />
                <dt class="d-flex flex-wrap align-center gap-3 mb-1"><code class="text-body-1 text-high-emphasis">{{ item.name }}</code><span class="text-body-2 text-medium-emphasis">{{ item.type }}</span></dt>
                <dd class="text-body-2 mb-0 ms-0">{{ item.description }}</dd>
              </div>
            </dl>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-4">Accessibility</h2>
            <ul class="text-body-2 ps-5">
              <li v-for="guideline in accessibility" :key="guideline" class="mb-2">{{ guideline }}</li>
            </ul>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>
.doc-code { white-space: pre-wrap; overflow-wrap: anywhere; }
.doc-source, .doc-api-item { overflow-wrap: anywhere; }
</style>
