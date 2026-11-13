<script setup lang="ts">
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'

definePageMeta({ sidebarRoute: 'design-system-spacing' })
useHead({ title: 'Spacing' })

const spacingSteps = Array.from({ length: 17 }, (_, step) => ({ step, pixels: step * 4 }))
const patterns = [
  { size: '4px', utility: 'gap-1', usage: 'Small gaps inside compact builder controls.' },
  { size: '8px', utility: 'gap-2', usage: 'Related controls and builder property fields.' },
  { size: '12px', utility: 'gap-3', usage: 'Header icons, labels, and actions in UiSectionHeader.' },
  { size: '16px', utility: 'gap-4 / pa-4', usage: 'Builder sections and compact card content.' },
  { size: '24px', utility: 'gap-6 / pa-6', usage: 'Primary section spacing and standard showcase card content.' },
]
</script>

<template>
  <section>
    <UiSectionHeader title="Spacing" title-class="text-h4" description="A 4px base unit for padding, margins, gaps, and grid gutters." />

    <VRow>
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Spacing scale</h2>
            <p class="text-body-2 text-medium-emphasis mb-6">Vuetify spacing utilities use 4px increments, from 0 to 16. The bars show each value at its actual size.</p>
            <div v-for="space in spacingSteps" :key="space.step" class="d-flex align-center gap-4 py-2">
              <code class="text-body-2 spacing-step">{{ space.step }}</code>
              <span class="text-body-2 spacing-value">{{ space.pixels }}px</span>
              <span v-if="space.step" class="bg-primary spacing-bar" :style="{ inlineSize: `${space.pixels}px` }" aria-hidden="true" />
              <span v-else class="text-caption text-medium-emphasis">No spacing</span>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="6">
        <VCard class="mb-6">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Patterns in this project</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Use smaller gaps within groups and 24px between primary sections.</p>
            <div v-for="(pattern, index) in patterns" :key="pattern.size">
              <VDivider v-if="index" class="my-4" />
              <div class="d-flex flex-wrap align-center gap-3 mb-1">
                <span class="text-body-1 font-weight-medium">{{ pattern.size }}</span>
                <code class="text-body-2 text-primary">{{ pattern.utility }}</code>
              </div>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ pattern.usage }}</p>
            </div>
          </VCardText>
        </VCard>

        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Grid gutters</h2>
            <p class="text-body-2 mb-4">Use VRow and VCol for page columns. Their default gutters provide 24px between columns: each column has 12px padding on either side.</p>
            <p class="text-body-2 text-medium-emphasis mb-0">Start with cols="12", then add md or lg for wider screens. Keep a 24px gap inside content stacks. Do not add another 24px gap on top of the existing row gutters.</p>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Utility examples</h2>
            <p class="text-body-2 text-medium-emphasis mb-6">Use logical start/end utilities for layouts that support both text directions.</p>
            <VRow>
              <VCol cols="12" md="4">
                <h3 class="text-h6 mb-2">Padding · pa-4</h3>
                <div class="bg-background pa-4 rounded border">
                  <div class="bg-surface pa-3 text-body-2 rounded border">16px inside the container</div>
                </div>
                <p class="text-body-2 text-medium-emphasis mt-3 mb-0">pa: all · px/py: axes · pt/pb: top/bottom · ps/pe: start/end</p>
              </VCol>
              <VCol cols="12" md="4">
                <h3 class="text-h6 mb-2">Margin · mb-4</h3>
                <div class="bg-background pa-4 rounded border">
                  <div class="bg-surface pa-3 mb-4 text-body-2 rounded border">16px margin below</div>
                  <div class="bg-surface pa-3 text-body-2 rounded border">Next element</div>
                </div>
                <p class="text-body-2 text-medium-emphasis mt-3 mb-0">ma: all · mx/my: axes · mt/mb: top/bottom · ms/me: start/end</p>
              </VCol>
              <VCol cols="12" md="4">
                <h3 class="text-h6 mb-2">Gap · gap-2</h3>
                <div class="d-flex flex-wrap gap-2 bg-background pa-4 rounded border">
                  <span v-for="label in ['One', 'Two', 'Three']" :key="label" class="bg-surface pa-3 text-body-2 rounded border">{{ label }}</span>
                </div>
                <p class="text-body-2 text-medium-emphasis mt-3 mb-0">8px between flex items. Use gap-x-* and gap-y-* to set one axis.</p>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>
.spacing-step { inline-size: 2rem; flex-shrink: 0; }
.spacing-value { inline-size: 3rem; flex-shrink: 0; }
.spacing-bar { block-size: 12px; border-radius: 2px; flex-shrink: 0; }
</style>
