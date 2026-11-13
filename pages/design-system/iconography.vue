<script setup lang="ts">
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'

definePageMeta({ sidebarRoute: 'design-system-iconography' })
useHead({ title: 'Iconography' })

const search = ref<string | null>('')
const showFeedback = ref(false)
const sizes = [16, 20, 24, 32]
const projectIcons = [
  { name: 'ri-circle-line', usage: 'All Foundation submenu items' },
  { name: 'ri-home-smile-line', usage: 'Dashboard navigation' },
  { name: 'ri-palette-line', usage: 'Foundation and color system' },
  { name: 'ri-font-size', usage: 'Typography reference' },
  { name: 'ri-space', usage: 'Spacing reference' },
  { name: 'ri-layout-grid-line', usage: 'Components and builder elements' },
  { name: 'ri-stack-line', usage: 'Builder layers' },
  { name: 'ri-braces-line', usage: 'Builder variables' },
  { name: 'ri-pencil-line', usage: 'Edit action' },
  { name: 'ri-search-line', usage: 'Search fields' },
  { name: 'ri-add-line', usage: 'Add action' },
  { name: 'ri-close-line', usage: 'Close and cancel' },
  { name: 'ri-check-line', usage: 'Complete and confirm' },
  { name: 'ri-alert-line', usage: 'Warning feedback' },
  { name: 'ri-checkbox-circle-line', usage: 'Success feedback' },
  { name: 'ri-error-warning-line', usage: 'Error and information feedback' },
  { name: 'ri-arrow-down-s-line', usage: 'Expand and dropdown' },
]
const filteredIcons = computed(() => {
  const query = (search.value || '').trim().toLowerCase()
  return projectIcons.filter(icon => `${icon.name} ${icon.usage}`.toLowerCase().includes(query))
})
const examples = {
  basic: '<VIcon icon="ri-search-line" size="20" aria-hidden="true" />',
  alias: '<VIcon icon="$success" color="success" aria-hidden="true" />',
  button: '<IconBtn aria-label="Edit item" @click="editItem">\n  <VIcon icon="ri-pencil-line" />\n</IconBtn>',
}
</script>

<template>
  <section>
    <UiSectionHeader title="Iconography" title-class="text-h4" description="Remix icons, semantic aliases, and accessible usage in this project." />
    <VRow>
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Icon library</h2>
            <p class="text-body-2 mb-4">Remix Icon is the primary interface set. VIcon renders bundled Iconify CSS classes with the ri- prefix and inherits the current text color.</p>
            <p class="text-body-2 text-medium-emphasis mb-4">Use line variants for interface actions. Filled variants remain available for states such as ratings. Pair icons with clear text; color alone should not communicate status.</p>
            <pre class="icon-code bg-background pa-4 rounded border text-body-2">{{ examples.basic }}</pre>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Sizes and alignment</h2>
            <p class="text-body-2 text-medium-emphasis mb-6">These explicit sizes appear in project controls and previews. Match the surrounding text and control density; keep touch targets larger than the icon itself.</p>
            <div class="d-flex flex-wrap align-end gap-6">
              <div v-for="size in sizes" :key="size" class="d-flex flex-column align-center gap-3">
                <VIcon icon="ri-layout-grid-line" :size="size" aria-hidden="true" />
                <span class="text-body-2">{{ size }}px</span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Project icon reference</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">A curated reference from navigation, builder panels, and Vuetify aliases. This is not the complete Remix library.</p>
            <VTextField v-model="search" label="Search project icons" prepend-inner-icon="ri-search-line" clearable hide-details class="mb-6" @click:clear="search = ''" />
            <VRow v-if="filteredIcons.length">
              <VCol v-for="icon in filteredIcons" :key="icon.name" cols="12" sm="6" lg="4">
                <div class="d-flex align-center gap-4 pa-4 rounded border h-100">
                  <VIcon :icon="icon.name" size="24" aria-hidden="true" />
                  <div class="icon-reference-copy">
                    <code class="text-body-2">{{ icon.name }}</code>
                    <p class="text-body-2 text-medium-emphasis mb-0 mt-1">{{ icon.usage }}</p>
                  </div>
                </div>
              </VCol>
            </VRow>
            <p v-else class="text-body-2 text-medium-emphasis mb-0" role="status">No project icons match your search. Try a name such as “search” or “grid”.</p>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Semantic aliases</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">Vuetify aliases are defined in plugins/vuetify/icons.ts. Use the $ prefix to reference an alias rather than a CSS icon name.</p>
            <div class="d-flex flex-wrap gap-4 mb-4">
              <span class="d-flex align-center gap-2"><VIcon icon="$success" color="success" aria-hidden="true" /><span class="text-body-2">$success</span></span>
              <span class="d-flex align-center gap-2"><VIcon icon="$warning" color="warning" aria-hidden="true" /><span class="text-body-2">$warning</span></span>
              <span class="d-flex align-center gap-2"><VIcon icon="$error" color="error" aria-hidden="true" /><span class="text-body-2">$error</span></span>
            </div>
            <pre class="icon-code bg-background pa-4 rounded border text-body-2">{{ examples.alias }}</pre>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Accessible icon buttons</h2>
            <p class="text-body-2 text-medium-emphasis mb-4">IconBtn is the project's VBtn alias. Give every icon-only action an accessible name. Decorative icons beside text should be hidden from assistive technology.</p>
            <div class="d-flex align-center gap-3 mb-4">
              <IconBtn aria-label="Try edit icon feedback" @click="showFeedback = true"><VIcon icon="ri-pencil-line" aria-hidden="true" /></IconBtn>
              <span class="text-body-2">Try the labeled icon button</span>
            </div>
            <pre class="icon-code bg-background pa-4 rounded border text-body-2">{{ examples.button }}</pre>
          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12">
        <VCard>
          <VCardText class="pa-6">
            <h2 class="text-h5 mb-2">Adding and maintaining icons</h2>
            <p class="text-body-2 mb-2">Check the bundled icon name before using it. plugins/iconify/build-icons.ts includes the full installed Remix set, two MDI language icons, and five BXL social icons. Checkbox and radio assets are local SVG overrides in plugins/vuetify/icons.ts.</p>
            <p class="text-body-2 text-medium-emphasis mb-0">When changing bundle sources, run pnpm build:icons to regenerate plugins/iconify/icons.css. Do not edit generated CSS manually. This page uses existing bundled assets and adds no icon dependency.</p>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VSnackbar v-model="showFeedback" timeout="3000">Icon button activated. This is a documentation demo.</VSnackbar>
  </section>
</template>

<style scoped>
.icon-code { white-space: pre-wrap; overflow-wrap: anywhere; }
.icon-reference-copy { min-inline-size: 0; overflow-wrap: anywhere; }
</style>
