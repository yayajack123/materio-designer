<script setup lang="ts">
import { useTheme } from 'vuetify'
import CreateCustomizerPanel from '@/components/design-system/create/CreateCustomizerPanel.vue'
import CreateExportDialog from '@/components/design-system/create/CreateExportDialog.vue'
import LandingCardsShowcase from '@/components/design-system/landing/LandingCardsShowcase.vue'
import LandingCrudShowcase from '@/components/design-system/landing/LandingCrudShowcase.vue'
import LandingFormStepperShowcase from '@/components/design-system/landing/LandingFormStepperShowcase.vue'
import LandingFoundationsShowcase from '@/components/design-system/landing/LandingFoundationsShowcase.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import { getBrandThemeColors, staticPrimaryColor } from '@/plugins/vuetify/theme'
import type {
  CreatePresetId,
  CreateThemeMode,
  DesignSystemCreateConfig,
} from '@/utils/designSystemCreate'
import {
  BASE_COLOR_PALETTES,
  BRAND_SWATCH_OPTIONS,
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  STUDIO_PRESETS,
  buildCreateQueryRecord,
  buildExportBundle,
  createDefaultStudioConfig,
  detectMatchingPreset,
  getFontOption,
  getNeutralPalette,
  parseCreateQuery,
} from '@/utils/designSystemCreate'
import { downloadZipArchive } from '@/utils/zipArchive'
import { Theme } from '@core/enums'
import { useConfigStore } from '@core/stores/config'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'

definePageMeta({
  layout: 'blank',
  public: true,
})

const route = useRoute()
const router = useRouter()
const runtimeConfig = useRuntimeConfig()
const vuetifyTheme = useTheme()
const configStore = useConfigStore()

const defaultBrandHex = computed(() => {
  const configured = String(runtimeConfig.public.brandPrimary || staticPrimaryColor).trim()
  return getBrandThemeColors(configured).primary.toUpperCase()
})

const initialSearch = computed(() => {
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(route.query)) {
    if (typeof val === 'string') params.set(key, val)
    else if (Array.isArray(val) && typeof val[0] === 'string') params.set(key, val[0])
  }
  return params.toString()
})

const studioConfig = reactive<DesignSystemCreateConfig>(
  parseCreateQuery(initialSearch.value, defaultBrandHex.value),
)

const activeFont = computed(() => getFontOption(studioConfig.font))

useHead(() => ({
  title: 'Create Design System — Materio Designer',
  link: activeFont.value.googleFontHref
    ? [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { key: `create-font-${activeFont.value.id}`, rel: 'stylesheet', href: activeFont.value.googleFontHref },
      ]
    : [],
}))

const activeTab = ref<'cards' | 'crud' | 'stepper' | 'foundations'>('cards')
const mobileDrawerOpen = ref(false)
const exportDialogOpen = ref(false)
let exportTrigger: HTMLElement | null = null

const snackbarOpen = ref(false)
const snackbarText = ref('')
const snackbarColor = ref<'primary' | 'error'>('primary')

// Accessible copy state (modern-web-guidance copy-button)
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const copyAnnouncement = ref('')
const shareAnnouncement = ref('')
let lastAnnouncement = ''
let copyTimer: ReturnType<typeof setTimeout> | undefined

const headerLinks = [
  { label: 'Overview', to: '/landing', current: false },
  { label: 'Foundations', to: '/design-system/typography', current: false },
  { label: 'Components', to: '/components/buttons', current: false },
  { label: 'Templates', to: '/page-template/crud-page', current: false },
  { label: 'Create', to: '/create', current: true },
]

const showcaseTabs = [
  { value: 'cards', label: 'Cards', icon: 'ri-layout-masonry-line' },
  { value: 'crud', label: 'CRUD & Table', icon: 'ri-table-line' },
  { value: 'stepper', label: 'Stepper & Form', icon: 'ri-list-check-2' },
  { value: 'foundations', label: 'Foundations', icon: 'ri-palette-line' },
] as const

const isModified = computed(() => {
  const defaults = createDefaultStudioConfig(defaultBrandHex.value)
  return (
    studioConfig.style !== defaults.style
    || studioConfig.baseColor !== defaults.baseColor
    || studioConfig.brandHex.toLowerCase() !== defaults.brandHex.toLowerCase()
    || studioConfig.font !== defaults.font
    || studioConfig.radius !== defaults.radius
    || studioConfig.buttonShape !== defaults.buttonShape
    || studioConfig.density !== defaults.density
    || studioConfig.iconStyle !== defaults.iconStyle
    || studioConfig.tableMode !== defaults.tableMode
  )
})

const shareUrl = computed(() => {
  const queryRecord = buildCreateQueryRecord(studioConfig, defaultBrandHex.value)
  const queryString = new URLSearchParams(queryRecord).toString()
  const origin = import.meta.client ? window.location.origin : (runtimeConfig.public.appBaseUrl || 'http://localhost:3000')
  return queryString ? `${origin}/create?${queryString}` : `${origin}/create`
})

const exportBundle = computed(() => buildExportBundle({ ...studioConfig }, shareUrl.value))

const stageCssVars = computed(() => ({
  '--create-font': activeFont.value.stack,
  '--create-radius': `${studioConfig.radius}px`,
  '--create-field-radius': `${Math.min(studioConfig.radius, 12)}px`,
  '--create-btn-radius': studioConfig.buttonShape === 'pill' ? '999px' : `${studioConfig.radius}px`,
}))

// Snapshot original Vuetify colors so leaving /create restores starter defaults cleanly
let savedLightColors: Record<string, string> | null = null
let savedDarkColors: Record<string, string> | null = null

const syncVuetifyColors = () => {
  const brand = getBrandThemeColors(studioConfig.brandHex)
  const neutral = getNeutralPalette(studioConfig.baseColor)

  if (vuetifyTheme.themes.value.light?.colors) {
    Object.assign(vuetifyTheme.themes.value.light.colors, neutral.light, brand)
  }
  if (vuetifyTheme.themes.value.dark?.colors) {
    Object.assign(vuetifyTheme.themes.value.dark.colors, neutral.dark, brand)
  }
}

onMounted(() => {
  savedLightColors = structuredClone({ ...vuetifyTheme.themes.value.light.colors })
  savedDarkColors = structuredClone({ ...vuetifyTheme.themes.value.dark.colors })

  if (route.query.mode === 'light' || route.query.mode === 'dark' || route.query.mode === 'system') {
    configStore.theme = studioConfig.themeMode as Theme
  }
  else {
    studioConfig.themeMode = (configStore.theme as CreateThemeMode) || 'light'
  }

  syncVuetifyColors()
})

watch(
  () => [studioConfig.brandHex, studioConfig.baseColor],
  () => syncVuetifyColors(),
)

watch(
  () => configStore.theme,
  nextMode => {
    if (nextMode === 'light' || nextMode === 'dark' || nextMode === 'system') {
      studioConfig.themeMode = nextMode
    }
  },
)

watch(
  () => ({ ...studioConfig }),
  current => {
    if (!import.meta.client) return
    const nextQuery = buildCreateQueryRecord(current, defaultBrandHex.value)
    router.replace({ query: nextQuery })
  },
  { deep: true },
)

onBeforeUnmount(() => {
  clearTimeout(copyTimer)
  if (savedLightColors && vuetifyTheme.themes.value.light?.colors) {
    Object.assign(vuetifyTheme.themes.value.light.colors, savedLightColors)
  }
  if (savedDarkColors && vuetifyTheme.themes.value.dark?.colors) {
    Object.assign(vuetifyTheme.themes.value.dark.colors, savedDarkColors)
  }
})

const applyPreset = (presetId: Exclude<CreatePresetId, 'custom'>) => {
  const target = STUDIO_PRESETS.find(item => item.id === presetId)
  if (!target) return
  Object.assign(studioConfig, target.values, { preset: target.id })
}

const updateField = (patch: Partial<DesignSystemCreateConfig>) => {
  if (patch.themeMode && patch.themeMode !== configStore.theme) {
    configStore.theme = patch.themeMode as Theme
  }
  Object.assign(studioConfig, patch)
  studioConfig.preset = detectMatchingPreset(studioConfig)
}

const pickRandom = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)]

const randomizeTokens = () => {
  const nextBrand = pickRandom(BRAND_SWATCH_OPTIONS).hex
  const nextBase = pickRandom(BASE_COLOR_PALETTES).id
  const nextFont = pickRandom(FONT_OPTIONS).id
  const nextRadius = pickRandom([4, 6, 8, 12, 16] as const)
  const nextButtonShape = pickRandom(['pill', 'rounded'] as const)
  const nextStyle = pickRandom(['bordered', 'elevated'] as const)
  const nextDensity = pickRandom(['comfortable', 'compact'] as const)
  const nextIconStyle = pickRandom(['line', 'fill'] as const)

  Object.assign(studioConfig, {
    style: nextStyle,
    baseColor: nextBase,
    brandHex: nextBrand,
    font: nextFont,
    radius: nextRadius,
    buttonShape: nextButtonShape,
    density: nextDensity,
    iconStyle: nextIconStyle,
  })
  studioConfig.preset = detectMatchingPreset(studioConfig)
  notify('Randomized design system tokens.')
}

const resetTokens = () => {
  const defaults = createDefaultStudioConfig(defaultBrandHex.value)
  Object.assign(studioConfig, {
    ...defaults,
    themeMode: studioConfig.themeMode,
  })
  notify('Reset to Materio Designer defaults.')
}

const notify = (message: string, color: 'primary' | 'error' = 'primary') => {
  snackbarColor.value = color
  snackbarText.value = message
  snackbarOpen.value = true
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

const writeClipboardSafe = async (text: string): Promise<boolean> => {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
    await navigator.clipboard.writeText(text)
    return true
  }
  catch {
    try {
      return legacyClipboardWrite(text)
    }
    catch {
      return false
    }
  }
}

const announceDistinct = (baseMessage: string): string => {
  let msg = baseMessage
  if (msg === lastAnnouncement) msg += '\u00A0'
  lastAnnouncement = msg
  return msg
}

const copyAiPrompt = async () => {
  clearTimeout(copyTimer)
  copyState.value = 'idle'
  copyAnnouncement.value = ''

  const ok = await writeClipboardSafe(exportBundle.value.promptText)
  copyState.value = ok ? 'copied' : 'failed'

  const statusText = ok
    ? 'AI setup prompt copied to clipboard.'
    : 'Copy failed — open Inspect setup files to copy manually.'
  copyAnnouncement.value = announceDistinct(statusText)
  notify(statusText, ok ? 'primary' : 'error')

  copyTimer = setTimeout(() => {
    copyState.value = 'idle'
    copyAnnouncement.value = ''
  }, 2400)
}

const copyShareLink = async () => {
  const ok = await writeClipboardSafe(shareUrl.value)
  const statusText = ok ? 'Shareable studio link copied.' : 'Could not copy link.'
  shareAnnouncement.value = announceDistinct(statusText)
  notify(statusText, ok ? 'primary' : 'error')
  setTimeout(() => {
    shareAnnouncement.value = ''
  }, 2000)
}

const downloadHowToZip = () => {
  const slug = studioConfig.preset === 'custom' ? 'custom' : studioConfig.preset
  downloadZipArchive(`materio-design-system-${slug}.zip`, exportBundle.value.zipFiles)
  notify('Downloaded setup guide and configuration (.zip).')
}

const openExportDialog = () => {
  exportTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  exportDialogOpen.value = true
}

const restoreExportFocus = () => {
  if (exportTrigger?.isConnected) exportTrigger.focus()
}
</script>

<template>
  <div class="create-page bg-background text-high-emphasis">
    <!-- Top Studio Header -->
    <header class="create-header bg-surface border-b">
      <div class="create-header__inner d-flex align-center justify-space-between gap-3 px-4 px-md-6">
        <div class="d-flex align-center gap-6 min-w-0">
          <NuxtLink
            to="/landing"
            class="d-inline-flex align-center text-decoration-none"
          >
            <VNodeRenderer :nodes="themeConfig.app.logo" />
          </NuxtLink>

          <nav aria-label="Primary" class="d-none d-md-flex align-center gap-1">
            <NuxtLink
              v-for="link in headerLinks"
              :key="link.to"
              :to="link.to"
              :aria-current="link.current ? 'page' : undefined"
              class="create-nav-link text-body-2 px-3 py-2 rounded text-decoration-none"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="d-flex align-center gap-2">
          <span class="d-inline-flex align-center">
            <VBtn
              type="button"
              size="small"
              variant="tonal"
              color="secondary"
              prepend-icon="ri-link"
              class="d-none d-sm-inline-flex"
              @click="copyShareLink"
            >
              Share preset
            </VBtn>
            <IconBtn
              type="button"
              class="d-sm-none"
              aria-label="Copy shareable preset URL"
              @click="copyShareLink"
            >
              <VIcon icon="ri-link" aria-hidden="true" />
            </IconBtn>
            <span class="sr-only" role="status">{{ shareAnnouncement }}</span>
          </span>

          <VBtn
            type="button"
            size="small"
            variant="tonal"
            color="primary"
            prepend-icon="ri-equalizer-2-line"
            class="d-lg-none"
            @click="mobileDrawerOpen = true"
          >
            Customize
          </VBtn>

          <NavbarThemeSwitcher />

          <VBtn
            type="button"
            size="small"
            color="primary"
            prepend-icon="ri-sparkling-line"
            class="d-none d-sm-inline-flex"
            @click="openExportDialog"
          >
            Export setup
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
              <VDivider class="my-1" />
              <VListItem prepend-icon="ri-sparkling-line" @click="openExportDialog">
                <VListItemTitle>Export setup</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </div>
      </div>
    </header>

    <!-- Main Split Studio -->
    <div class="create-workspace">
      <!-- Desktop Sticky Left Customizer -->
      <aside
        aria-label="Design system controls"
        class="create-sidebar-pane d-none d-lg-block border-e bg-surface"
      >
        <CreateCustomizerPanel
          :config="studioConfig"
          :is-modified="isModified"
          :copy-state="copyState"
          :copy-announcement="copyAnnouncement"
          @apply-preset="applyPreset"
          @update-field="updateField"
          @randomize="randomizeTokens"
          @reset="resetTokens"
          @copy-prompt="copyAiPrompt"
          @download-zip="downloadHowToZip"
          @inspect-export="openExportDialog"
        />
      </aside>

      <main class="create-stage-pane min-w-0 d-flex flex-column">
        <!-- Stage Sub-toolbar -->
        <div class="create-stage-toolbar bg-surface border-b px-4 px-md-6 d-flex flex-wrap align-center justify-space-between gap-3">
          <div class="d-flex align-self-stretch align-end min-w-0 max-w-full">
            <h1 class="sr-only">Create and preview design system</h1>
            <VTabs
              v-model="activeTab"
              height="48"
              show-arrows
              class="create-showcase-tabs"
              aria-label="Preview showcase sections"
            >
              <VTab
                v-for="tab in showcaseTabs"
                :id="`create-tab-${tab.value}`"
                :key="tab.value"
                :value="tab.value"
                class="text-body-2 font-weight-medium"
              >
                <VIcon start :icon="tab.icon" size="18" aria-hidden="true" />
                {{ tab.label }}
              </VTab>
            </VTabs>
          </div>

          <div class="d-none d-xl-flex align-center gap-3 py-2">
            <VChip size="small" variant="tonal" color="secondary" class="font-weight-medium">
              {{ activeFont.label.replace(' (Default)', '') }} · {{ studioConfig.radius }}px · {{ studioConfig.style }}
            </VChip>
          </div>
        </div>

        <!-- Live Preview Canvas -->
        <div class="create-stage-canvas flex-grow-1 pa-4 pa-md-6">
          <div class="create-preview-frame mx-auto">
            <div
              class="create-preview-stage"
              :style="stageCssVars"
              :data-style="studioConfig.style"
              :data-density="studioConfig.density"
            >
              <div
                v-show="activeTab === 'cards'"
                role="tabpanel"
                aria-labelledby="create-tab-cards"
              >
                <LandingCardsShowcase @notify="msg => notify(msg)" />
              </div>

              <div
                v-show="activeTab === 'crud'"
                role="tabpanel"
                aria-labelledby="create-tab-crud"
              >
                <LandingCrudShowcase
                  :mobile-cards="studioConfig.tableMode === 'mobile-cards'"
                  @notify="msg => notify(msg)"
                />
              </div>

              <div
                v-show="activeTab === 'stepper'"
                role="tabpanel"
                aria-labelledby="create-tab-stepper"
              >
                <LandingFormStepperShowcase @notify="msg => notify(msg)" />
              </div>

              <div
                v-show="activeTab === 'foundations'"
                role="tabpanel"
                aria-labelledby="create-tab-foundations"
              >
                <LandingFoundationsShowcase
                  :font-label="activeFont.label.replace(' (Default)', '')"
                  :icon-style="studioConfig.iconStyle"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile / Tablet Customizer Drawer -->
    <VNavigationDrawer
      v-model="mobileDrawerOpen"
      location="start"
      temporary
      width="340"
      class="d-lg-none"
    >
      <CreateCustomizerPanel
        :config="studioConfig"
        :is-modified="isModified"
        :copy-state="copyState"
        :copy-announcement="copyAnnouncement"
        show-close
        @apply-preset="applyPreset"
        @update-field="updateField"
        @randomize="randomizeTokens"
        @reset="resetTokens"
        @copy-prompt="copyAiPrompt"
        @download-zip="downloadHowToZip"
        @inspect-export="openExportDialog"
        @close="mobileDrawerOpen = false"
      />
    </VNavigationDrawer>

    <!-- Setup Inspection & Export Dialog -->
    <CreateExportDialog
      v-model="exportDialogOpen"
      :bundle="exportBundle"
      :copy-state="copyState"
      @copy-prompt="copyAiPrompt"
      @download-zip="downloadHowToZip"
      @after-leave="restoreExportFocus"
    />

    <VSnackbar
      v-model="snackbarOpen"
      :color="snackbarColor"
      timeout="2600"
    >
      {{ snackbarText }}
    </VSnackbar>
  </div>
</template>

<style scoped lang="scss">
.create-page {
  min-block-size: 100dvh;
  display: flex;
  flex-direction: column;
}

.create-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
}

.create-header__inner {
  min-block-size: 64px;
}

.create-nav-link {
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

.create-workspace {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1280px) {
    grid-template-columns: 356px minmax(0, 1fr);
  }
}

.create-stage-toolbar {
  position: sticky;
  inset-block-start: 64px;
  z-index: 20;
}

.create-sidebar-pane {
  position: sticky;
  inset-block-start: 64px;
  block-size: calc(100dvh - 64px);
  overflow: hidden;
}

.create-showcase-tabs {
  max-inline-size: 100%;
  border-block-end: 0 !important;

  :deep(.v-tab__slider) {
    inset-block-end: 0 !important;
  }
}

.create-preview-frame {
  inline-size: 100%;
  max-inline-size: 1360px;
}

// Scoped live design-system overrides inside the preview stage only
.create-preview-stage {
  font-family: var(--create-font);

  :deep(.v-card),
  :deep(.v-alert),
  :deep(.v-expansion-panel) {
    border-radius: var(--create-radius) !important;
    font-family: var(--create-font) !important;
  }

  :deep(.v-field) {
    border-radius: var(--create-field-radius) !important;
    font-family: var(--create-font) !important;
  }

  :deep(.v-btn:not(.v-btn--icon):not(.custom-toggle-group .v-btn)) {
    border-radius: var(--create-btn-radius) !important;
    font-family: var(--create-font) !important;
  }

  :deep(.text-h1),
  :deep(.text-h2),
  :deep(.text-h3),
  :deep(.text-h4),
  :deep(.text-h5),
  :deep(.text-h6),
  :deep(.text-subtitle-1),
  :deep(.text-subtitle-2),
  :deep(.text-body-1),
  :deep(.text-body-2),
  :deep(.text-caption),
  :deep(.v-tab),
  :deep(.v-chip) {
    font-family: var(--create-font) !important;
  }

  &[data-style="elevated"] :deep(.v-card:not(.brand-tint-card)) {
    border-color: transparent !important;
    box-shadow: 0 4px 16px rgba(var(--v-shadow-key-umbra-color), var(--v-shadow-sm-opacity)) !important;
  }

  &[data-style="bordered"] :deep(.v-card) {
    box-shadow: none !important;
  }

  &[data-density="compact"] {
    :deep(.v-card-text.pa-6) {
      padding: 16px !important;
    }

    :deep(.v-field__input) {
      min-block-size: 38px !important;
      padding-block: 6px !important;
    }

    :deep(.v-btn--size-default:not(.v-btn--icon)) {
      height: 34px !important;
    }
  }
}

.min-w-0 {
  min-inline-size: 0;
}

.max-w-full {
  max-inline-size: 100%;
}

.sr-only {
  position: absolute;
  inline-size: 1px;
  block-size: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
