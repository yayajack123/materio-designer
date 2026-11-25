<script setup lang="ts">
import { useTheme } from 'vuetify'
import LandingCardsShowcase from '@/components/design-system/landing/LandingCardsShowcase.vue'
import LandingCrudShowcase from '@/components/design-system/landing/LandingCrudShowcase.vue'
import LandingFormStepperShowcase from '@/components/design-system/landing/LandingFormStepperShowcase.vue'
import LandingFoundationsShowcase from '@/components/design-system/landing/LandingFoundationsShowcase.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import mainNavItems from '@/navigation/vertical'
import { getBrandThemeColors, staticPrimaryColor } from '@/plugins/vuetify/theme'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePageMeta({
  layout: 'blank',
  public: true,
})

useHead({
  title: 'Design System — Materio Designer',
})

interface BrandPreset {
  id: string
  label: string
  hex: string
}

interface CatalogEntry {
  title: string
  group: string
  to: { name: string }
  icon: string
}

const runtimeConfig = useRuntimeConfig()
const vuetifyTheme = useTheme()

const defaultBrandHex = computed(() => {
  const configured = String(runtimeConfig.public.brandPrimary || staticPrimaryColor).trim()
  return getBrandThemeColors(configured).primary
})

const brandPresets = computed<BrandPreset[]>(() => [
  { id: 'materio', label: 'Materio Green', hex: defaultBrandHex.value },
  { id: 'ocean', label: 'Ocean Blue', hex: '#0F6CBD' },
  { id: 'violet', label: 'Iris Violet', hex: '#6E3FF3' },
  { id: 'teal', label: 'Jade Teal', hex: '#0D9488' },
  { id: 'amber', label: 'Terracotta', hex: '#C84B31' },
])

const activeTab = ref<'cards' | 'crud' | 'foundations' | 'stepper'>('cards')
const selectedHex = ref(vuetifyTheme.current.value.colors.primary || defaultBrandHex.value)
const catalogSearch = ref('')
const searchOpen = ref(false)
const headerSearch = ref('')
let searchTrigger: HTMLElement | null = null
const openSearch = () => {
  searchTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  searchOpen.value = true
}
const restoreSearchFocus = () => { if (searchTrigger?.isConnected) searchTrigger.focus() }

const snackbarOpen = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'primary' | 'error'>('primary')

// Copy button accessible state (follows modern-web-guidance copy-button)
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const liveCopyAnnouncement = ref('')
let lastAnnouncedCopy = ''
let copyTimer: ReturnType<typeof setTimeout> | undefined

const headerLinks = [
  { label: 'Overview', to: '/landing', current: true },
  { label: 'Foundations', to: '/design-system/typography', current: false },
  { label: 'Components', to: '/components/buttons', current: false },
  { label: 'Templates', to: '/page-template/crud-page', current: false },
  { label: 'Create', to: '/create', current: false },
]

const setupPrompt = 'Follow NEW_PROJECT_SETUP.md and help me configure this clone for a new application. Read the applicable AGENTS.md instructions and spec/design.md before changing code or UI. Ask for missing product decisions, then make the agreed setup changes and report required environment variables and validation results.'
const setupCopyStatus = ref('')
const setupCopyFailed = ref(false)
const setupSteps = [
  { title: 'Clone the starter', description: 'Clone the Materio Designer repository and open the project in your editor.', icon: 'ri-git-repository-line' },
  { title: 'Gather your project details', description: 'Prepare the app name, audience, pages, brand color, and optional logo or favicon.', icon: 'ri-palette-line' },
  { title: 'Ask your AI agent', description: 'Copy the prompt and share what you know. The agent will ask about missing decisions.', icon: 'ri-chat-3-line' },
  { title: 'Run and review together', description: 'Work with the agent to configure, run, and validate the project.', icon: 'ri-check-double-line' },
]

const showcaseTabs = [
  { value: 'cards', label: 'Cards', icon: 'ri-layout-masonry-line' },
  { value: 'crud', label: 'CRUD & Table', icon: 'ri-table-line' },
  { value: 'foundations', label: 'Foundations', icon: 'ri-palette-line' },
  { value: 'stepper', label: 'Stepper & Form', icon: 'ri-list-check-2' },
] as const

const isCustomPreset = computed(
  () => selectedHex.value.toLowerCase() !== defaultBrandHex.value.toLowerCase(),
)

const applyBrandColor = (hex: string) => {
  const derived = getBrandThemeColors(hex)
  selectedHex.value = derived.primary

  for (const mode of ['light', 'dark'] as const) {
    const targetColors = vuetifyTheme.themes.value[mode]?.colors
    if (targetColors) {
      Object.assign(targetColors, derived)
    }
  }
}

const resetBrandColor = () => {
  applyBrandColor(defaultBrandHex.value)
  notify(`Brand color reset to default (${defaultBrandHex.value}).`)
}

const legacyClipboardWrite = (text: string) => {
  const previousFocus = document.activeElement as HTMLElement | null
  const field = Object.assign(document.createElement('textarea'), { value: text })
  field.setAttribute('readonly', '')
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0'
  document.body.append(field)
  field.select()
  try {
    return document.execCommand('copy')
  }
  finally {
    field.remove()
    previousFocus?.focus({ preventScroll: true })
  }
}

const copySetupPrompt = async () => {
  let copied = false
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(setupPrompt)
    copied = true
  }
  catch {
    try { copied = legacyClipboardWrite(setupPrompt) }
    catch { copied = false }
  }
  setupCopyFailed.value = !copied
  setupCopyStatus.value = copied ? 'Prompt copied.' : 'Copy failed. Select the prompt text and copy it manually.'
  snackbarColor.value = copied ? 'primary' : 'error'
  snackbarText.value = setupCopyStatus.value
  snackbarOpen.value = true
}

const copyEnvConfig = async () => {
  const envSnippet = `NUXT_PUBLIC_BRAND_PRIMARY="${selectedHex.value.toUpperCase()}"`
  clearTimeout(copyTimer)
  copyState.value = 'idle'

  let ok = false
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(envSnippet)
    ok = true
  }
  catch {
    ok = legacyClipboardWrite(envSnippet)
  }

  copyState.value = ok ? 'copied' : 'failed'
  let statusMsg = ok ? `Copied ${envSnippet}` : 'Copy failed — clipboard permission denied'
  if (statusMsg === lastAnnouncedCopy)
    statusMsg += '\u00A0'
  lastAnnouncedCopy = statusMsg
  liveCopyAnnouncement.value = statusMsg

  snackbarColor.value = ok ? 'primary' : 'error'
  snackbarText.value = statusMsg.trim()
  snackbarOpen.value = true

  copyTimer = setTimeout(() => {
    copyState.value = 'idle'
    liveCopyAnnouncement.value = ''
  }, 2200)
}

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
})

const notify = (message: string) => {
  snackbarColor.value = 'primary'
  snackbarText.value = message
  snackbarOpen.value = true
}

const filterCatalog = (search: string) => {
  const query = (search || '').trim().toLowerCase()

  return mainNavItems
    .filter(item => 'children' in item && Array.isArray(item.children))
    .map(group => {
      const children = (group as { title: string; icon?: { icon: string }; children: { title: string; to: { name: string } }[] }).children
      const groupIcon = (group as { icon?: { icon: string } }).icon?.icon || 'ri-circle-line'
      const entries: CatalogEntry[] = children
        .filter(child => !query || `${group.title} ${child.title}`.toLowerCase().includes(query))
        .map(child => ({
          title: child.title,
          group: group.title,
          to: child.to,
          icon: groupIcon,
        }))

      return {
        title: group.title,
        totalCount: children.length,
        entries,
      }
    })
    .filter(group => group.entries.length > 0)
}
const catalogGroups = computed(() => filterCatalog(catalogSearch.value))
const searchGroups = computed(() => filterCatalog(headerSearch.value))
</script>

<template>
  <div class="landing-page bg-background text-high-emphasis">
    <!-- Top Site Header -->
    <header class="landing-header bg-surface border-b">
      <div class="landing-container landing-header__inner d-flex align-center justify-space-between gap-4">
        <div class="d-flex align-center gap-6 min-w-0">
          <NuxtLink
            to="/landing"
            class="landing-brand d-inline-flex align-center text-decoration-none"
          >
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </NuxtLink>

          <nav aria-label="Primary" class="d-none d-md-flex align-center gap-1">
            <NuxtLink
              v-for="link in headerLinks"
              :key="link.to"
              :to="link.to"
              :aria-current="link.current ? 'page' : undefined"
              class="landing-nav-link text-body-2 px-3 py-2 rounded text-decoration-none"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="d-flex align-center gap-2">
          <VBtn variant="tonal" color="secondary" class="landing-search text-body-2 d-none d-lg-inline-flex" prepend-icon="ri-search-line" @click="openSearch">Search documentation</VBtn>
          <IconBtn class="d-lg-none" aria-label="Search documentation" @click="openSearch"><VIcon icon="ri-search-line" aria-hidden="true" /></IconBtn>
          <IconBtn href="https://github.com/yayajack123/materio-designer" target="_blank" rel="noopener noreferrer" aria-label="Materio Designer on GitHub (opens in a new tab)"><VIcon icon="ri-github-fill" aria-hidden="true" /></IconBtn>
          <NavbarThemeSwitcher />

          <VBtn
            size="small"
            color="primary"
            class="d-none d-sm-inline-flex"
            :to="{ name: 'components-buttons' }"
          >
            Browse docs
          </VBtn>

          <!-- Mobile navigation menu -->
          <VMenu location="bottom end">
            <template #activator="{ props: menuProps }">
              <IconBtn
                v-bind="menuProps"
                class="d-md-none"
                aria-label="Open navigation menu"
              >
                <VIcon icon="ri-menu-line" aria-hidden="true" />
              </IconBtn>
            </template>
            <VList density="comfortable" min-width="200">
              <VListItem
                v-for="link in headerLinks"
                :key="link.to"
                :to="link.to"
                :active="link.current"
                :aria-current="link.current ? 'page' : undefined"
              >
                <VListItemTitle>{{ link.label }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </div>
    </header>

    <VDialog v-model="searchOpen" max-width="600" aria-labelledby="landing-search-title" @after-leave="restoreSearchFocus">
      <VCard class="bg-surface">
        <VCardTitle id="landing-search-title" class="pa-6 pb-2">Search documentation</VCardTitle>
        <VCardText class="pt-3">
          <VTextField v-model="headerSearch" label="Search documentation" aria-label="Search documentation" placeholder="Search components, foundations, or templates" prepend-inner-icon="ri-search-line" clearable autofocus hide-details />
          <div class="landing-search-results mt-4">
            <template v-if="searchGroups.length">
              <div v-for="group in searchGroups" :key="group.title" class="mb-4">
                <h2 class="text-body-2 font-weight-medium text-medium-emphasis mb-2">{{ group.title }}</h2>
                <VList density="compact" class="pa-0 bg-transparent">
                  <VListItem v-for="entry in group.entries" :key="entry.to.name" :to="entry.to" :prepend-icon="entry.icon" @click="searchOpen = false">
                    <VListItemTitle>{{ entry.title }}</VListItemTitle>
                  </VListItem>
                </VList>
              </div>
            </template>
            <p v-else class="text-body-2 text-medium-emphasis mb-0">No results. Try another search.</p>
          </div>
        </VCardText>
        <VCardActions class="px-6 pb-4"><VSpacer /><VBtn variant="text" color="secondary" @click="searchOpen = false">Close</VBtn></VCardActions>
      </VCard>
    </VDialog>

    <main>
      <!-- Hero Section -->
      <section class="landing-hero py-10 py-md-14">
        <div class="landing-container">
          <VRow justify="center">
            <VCol cols="12" lg="9" class="text-center">
              <h1 class="landing-hero__title font-weight-medium mb-4">
                Build consistent interfaces with Materio Designer.
              </h1>
              <p class="landing-hero__subtitle text-body-1 text-medium-emphasis mx-auto mb-6">
                Foundational Poppins typography, semantic light and dark tokens, documented components, and ready-to-adapt CRUD templates in one Nuxt 3 starter.
              </p>

              <div class="d-flex flex-wrap align-center justify-center gap-3">
                <VBtn
                  color="primary"
                  prepend-icon="ri-layout-grid-line"
                  :to="{ name: 'components-buttons' }"
                >
                  Browse components
                </VBtn>
                <VBtn
                  variant="outlined"
                  prepend-icon="ri-palette-line"
                  :to="{ name: 'design-system-typography' }"
                >
                  Explore foundations
                </VBtn>
              </div>
            </VCol>
          </VRow>
        </div>
      </section>

      <!-- Visual Signature: Tabbed Interactive Showcase + Live Theme Controls -->
      <section aria-label="Interactive component showcase" class="pb-12">
        <div class="landing-container">
          <div class="showcase-shell bg-surface border rounded overflow-hidden">
            <!-- Showcase Toolbar -->
            <div class="showcase-toolbar d-flex flex-wrap align-center justify-space-between gap-4 px-4 px-md-6 pt-3 border-b">
              <VTabs
                v-model="activeTab"
                show-arrows
                class="landing-showcase-tabs"
                aria-label="Showcase examples"
              >
                <VTab
                  v-for="tab in showcaseTabs"
                  :id="`landing-tab-${tab.value}`"
                  :key="tab.value"
                  :value="tab.value"
                  class="text-body-2 font-weight-medium"
                >
                  <VIcon start :icon="tab.icon" size="18" aria-hidden="true" />
                  {{ tab.label }}
                </VTab>
              </VTabs>

              <!-- Live Brand Color Presets & Env Copy -->
              <div class="d-flex flex-wrap align-center gap-2 pb-3 pb-md-2">
                <span class="text-caption text-medium-emphasis me-1">Brand:</span>
                <div
                  role="group"
                  aria-label="Live brand primary color presets"
                  class="d-flex align-center gap-1"
                >
                  <button
                    v-for="preset in brandPresets"
                    :key="preset.id"
                    type="button"
                    class="brand-swatch-btn"
                    :aria-label="`Apply ${preset.label} (${preset.hex})`"
                    :aria-pressed="selectedHex.toLowerCase() === preset.hex.toLowerCase()"
                    @click="applyBrandColor(preset.hex)"
                  >
                    <span
                      class="brand-swatch-dot"
                      :style="{ backgroundColor: preset.hex }"
                      aria-hidden="true"
                    >
                      <VIcon
                        v-if="selectedHex.toLowerCase() === preset.hex.toLowerCase()"
                        icon="ri-check-line"
                        size="14"
                        color="white"
                      />
                    </span>
                  </button>
                </div>

                <VBtn
                  v-if="isCustomPreset"
                  type="button"
                  size="small"
                  variant="text"
                  color="secondary"
                  prepend-icon="ri-refresh-line"
                  @click="resetBrandColor"
                >
                  Reset
                </VBtn>

                <span class="copy-env-wrap d-inline-flex align-center">
                  <VBtn
                    type="button"
                    size="small"
                    variant="outlined"
                    :color="copyState === 'failed' ? 'error' : 'primary'"
                    :data-copied="copyState === 'copied' ? '' : undefined"
                    :data-failed="copyState === 'failed' ? '' : undefined"
                    @click="copyEnvConfig"
                  >
                    <VIcon
                      start
                      :icon="copyState === 'copied' ? 'ri-check-line' : 'ri-file-copy-line'"
                      size="16"
                      aria-hidden="true"
                    />
                    {{ copyState === 'copied' ? 'Copied .env' : 'Copy .env' }}
                  </VBtn>
                  <span class="sr-only" role="status">{{ liveCopyAnnouncement }}</span>
                </span>
                <VBtn
                  size="small"
                  variant="tonal"
                  color="primary"
                  prepend-icon="ri-equalizer-2-line"
                  :to="{ path: '/create', query: isCustomPreset ? { brand: selectedHex.replace(/^#/, '') } : undefined }"
                >
                  Open Create
                </VBtn>
              </div>
            </div>

            <!-- Showcase Panels (v-show preserves user state across tab changes) -->
            <div class="showcase-stage bg-background">
              <div
                v-show="activeTab === 'cards'"
                role="tabpanel"
                aria-labelledby="landing-tab-cards"
              >
                <div class="pa-4 pa-md-6">
                  <LandingCardsShowcase @notify="notify" />
                </div>
              </div>

              <div
                v-show="activeTab === 'crud'"
                role="tabpanel"
                aria-labelledby="landing-tab-crud"
              >
                <div class="pa-4 pa-md-6">
                  <LandingCrudShowcase @notify="notify" />
                </div>
              </div>

              <div
                v-show="activeTab === 'foundations'"
                role="tabpanel"
                aria-labelledby="landing-tab-foundations"
              >
                <div class="pa-4 pa-md-6">
                  <LandingFoundationsShowcase />
                </div>
              </div>

              <div
                v-show="activeTab === 'stepper'"
                role="tabpanel"
                aria-labelledby="landing-tab-stepper"
              >
                <div class="pa-4 pa-md-6">
                  <LandingFormStepperShowcase @notify="notify" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="quick-setup" aria-labelledby="quick-setup-heading" class="quick-setup py-10 py-md-14 border-t">
        <div class="landing-container">
          <div class="mb-8">
            <h2 id="quick-setup-heading" class="text-h4 font-weight-medium mb-2">Quick setup</h2>
            <p class="text-body-1 text-medium-emphasis mb-0 landing-pretty-copy">Start a new project with your AI agent. Bring your ideas and the agent can help configure the starter.</p>
          </div>
          <VRow align="center">
            <VCol cols="12" md="6">
              <ol class="setup-steps">
                <li v-for="(step, index) in setupSteps" :key="step.title" class="setup-step">
                  <VAvatar color="primary" variant="tonal" rounded size="40" aria-hidden="true"><VIcon :icon="step.icon" size="20" /></VAvatar>
                  <div><h3 class="text-h5 font-weight-medium mb-1">{{ index + 1 }}. {{ step.title }}</h3><p class="text-body-2 text-medium-emphasis mb-0">{{ step.description }}</p></div>
                </li>
              </ol>
            </VCol>
            <VCol cols="12" md="6">
              <VCard variant="outlined" class="bg-surface setup-prompt-card" :elevation="0">
                <VCardText class="pa-6">
                  <div class="d-flex align-start justify-space-between flex-wrap gap-3 mb-4">
                    <div><h3 class="text-h5 font-weight-medium mb-1">Start with your AI agent</h3><p class="text-body-2 text-medium-emphasis mb-0">Paste this prompt after opening the cloned project.</p></div>
                    <VAvatar color="primary" variant="tonal" rounded size="40" aria-hidden="true"><VIcon icon="ri-sparkling-line" size="20" /></VAvatar>
                  </div>
                  <div class="setup-prompt pa-4 rounded border text-body-1">{{ setupPrompt }}</div>
                  <div class="d-flex align-center flex-wrap gap-3 mt-5">
                    <VBtn color="primary" prepend-icon="ri-file-copy-line" @click="copySetupPrompt">Copy prompt</VBtn>
                    <span v-if="setupCopyStatus" role="status" class="text-body-2" :class="setupCopyFailed ? 'text-error' : 'text-success'">{{ setupCopyStatus }}</span>
                  </div>
                  <p class="text-body-2 text-medium-emphasis mt-5 mb-0">The full setup guide is in <code>NEW_PROJECT_SETUP.md</code> in the repository.</p>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>
        </div>
      </section>

      <!-- Directory / Catalog Section -->
      <section aria-labelledby="catalog-directory-heading" class="py-10 border-t bg-surface">
        <div class="landing-container">
          <VRow class="align-center mb-6">
            <VCol cols="12" md="7">
              <h2 id="catalog-directory-heading" class="landing-section-title text-h4 font-weight-medium mb-1">
                Explore the system directory
              </h2>
              <p class="text-body-1 text-medium-emphasis mb-0 landing-pretty-copy">
                Jump directly to interactive documentation, usage snippets, API references, and full-page templates.
              </p>
            </VCol>
            <VCol cols="12" md="5">
              <VTextField
                v-model="catalogSearch"
                label="Filter directory"
                placeholder="Search foundation, component, or template..."
                prepend-inner-icon="ri-search-line"
                clearable
                density="compact"
                hide-details
              />
            </VCol>
          </VRow>

          <template v-if="catalogGroups.length">
            <div
              v-for="group in catalogGroups"
              :key="group.title"
              class="mb-8 last-mb-0"
            >
              <div class="d-flex align-center gap-2 mb-4">
                <h3 class="text-h5 font-weight-medium mb-0">{{ group.title }}</h3>
                <VChip size="x-small" color="secondary" variant="tonal">
                  {{ group.entries.length }} / {{ group.totalCount }}
                </VChip>
              </div>

              <VRow>
                <VCol
                  v-for="entry in group.entries"
                  :key="entry.to.name"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <VCard
                    :to="entry.to"
                    variant="outlined"
                    class="catalog-link-card bg-background"
                    height="100%"
                  >
                    <VCardText class="pa-4 d-flex align-center justify-space-between gap-3">
                      <div class="d-flex align-center gap-3 min-w-0">
                        <VAvatar size="32" color="primary" variant="tonal" rounded aria-hidden="true">
                          <VIcon :icon="entry.icon" size="18" />
                        </VAvatar>
                        <span class="text-body-1 font-weight-medium text-truncate">{{ entry.title }}</span>
                      </div>
                      <VIcon icon="ri-arrow-right-s-line" size="20" class="text-medium-emphasis flex-shrink-0" aria-hidden="true" />
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>
            </div>
          </template>

          <div v-else class="pa-8 text-center rounded border bg-background">
            <p class="text-body-1 font-weight-medium mb-1">
              No catalog entries match "{{ catalogSearch }}".
            </p>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Try a broader keyword such as Buttons, Table, Color, or CRUD.
            </p>
            <VBtn
              type="button"
              variant="outlined"
              color="primary"
              @click="catalogSearch = ''"
            >
              Clear filter
            </VBtn>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="landing-footer py-6 border-t bg-background">
      <div class="landing-container d-flex flex-wrap align-center justify-space-between gap-4">
        <div class="text-body-2 text-medium-emphasis">
          Materio Designer · Nuxt 3 &amp; Vuetify 3 Design System Starter
        </div>
        <div class="d-flex flex-wrap align-center gap-4 text-body-2">
          <NuxtLink to="/workspace" class="text-medium-emphasis text-decoration-none">Workspace</NuxtLink>
          <NuxtLink :to="{ name: 'design-system-typography' }" class="text-medium-emphasis text-decoration-none">Foundations</NuxtLink>
          <NuxtLink :to="{ name: 'components-buttons' }" class="text-medium-emphasis text-decoration-none">Components</NuxtLink>
          <NuxtLink :to="{ name: 'page-template-crud-page' }" class="text-medium-emphasis text-decoration-none">Templates</NuxtLink>
        </div>
      </div>
    </footer>

    <VSnackbar
      v-model="snackbarOpen"
      :color="snackbarColor"
      timeout="2400"
    >
      {{ snackbarText }}
    </VSnackbar>
  </div>
</template>

<style scoped lang="scss">
.landing-page {
  min-block-size: 100dvh;
  display: flex;
  flex-direction: column;

  main {
    flex: 1 0 auto;
  }
}

.landing-container {
  inline-size: 100%;
  max-inline-size: 1360px;
  margin-inline: auto;
  padding-inline: 20px;

  @media (min-width: 960px) {
    padding-inline: 32px;
  }
}

.landing-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 20;
}

.landing-header__inner {
  min-block-size: 64px;
}

.quick-setup { scroll-margin-block-start: 80px; }
.setup-steps { display: flex; flex-direction: column; gap: 24px; padding: 0; margin: 0; list-style: none; }
.setup-step { display: flex; align-items: flex-start; gap: 16px; }
.setup-prompt-card { border-radius: 12px; }
.setup-prompt { background: rgb(var(--v-theme-background)); white-space: pre-wrap; overflow-wrap: anywhere; user-select: text; }

.landing-search { text-transform: none; }
.landing-search-results { max-block-size: min(50vh, 420px); overflow-y: auto; }

.landing-nav-link {
  position: relative;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));

  @media (hover: hover) {
    &:hover {
      color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
      background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
    }
  }

  &[aria-current="page"] {
    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    font-weight: 500;

    &::after {
      content: "";
      position: absolute;
      inset-inline: 12px;
      inset-block-end: 2px;
      border-block-end: 2px solid rgb(var(--v-theme-primary));
    }
  }
}

.landing-hero__title {
  font-size: 1.75rem;
  line-height: 1.2;
  text-wrap: balance;

  @media (min-width: 960px) {
    font-size: 2.875rem;
    line-height: 1.2;
  }
}

.landing-hero__subtitle,
.landing-pretty-copy {
  max-inline-size: 64ch;
  text-wrap: pretty;
}

.landing-section-title {
  text-wrap: balance;
}

.showcase-shell {
  border-radius: 12px !important;
}

.landing-showcase-tabs {
  align-self: end;
  max-inline-size: 100%;
  border-block-end: 0 !important;

  :deep(.v-tab__slider) {
    inset-block-end: 0 !important;
  }
}

.brand-swatch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 32px;
  min-block-size: 32px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  &[aria-pressed="true"] {
    border-color: rgba(var(--v-theme-on-surface), 0.36);
    background-color: rgba(var(--v-theme-on-surface), 0.06);
  }
}

.brand-swatch-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 22px;
  block-size: 22px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
}

.catalog-link-card {
  @media (hover: hover) {
    transition: border-color 0.15s ease-out, background-color 0.15s ease-out;

    &:hover {
      border-color: rgba(var(--v-theme-primary), 0.48) !important;
      background-color: rgba(var(--v-theme-primary), 0.04) !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none !important;
  }
}

.last-mb-0:last-child {
  margin-block-end: 0 !important;
}

.min-w-0 {
  min-inline-size: 0;
}

.sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
