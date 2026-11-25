<script setup lang="ts">
import type {
  CreateBaseColorId,
  CreateButtonShape,
  CreateDensityMode,
  CreateFontId,
  CreateIconStyle,
  CreatePresetId,
  CreateRadiusValue,
  CreateStyleMode,
  CreateTableMode,
  CreateThemeMode,
  DesignSystemCreateConfig,
} from '@/utils/designSystemCreate'
import {
  BASE_COLOR_PALETTES,
  BRAND_SWATCH_OPTIONS,
  FONT_OPTIONS,
  RADIUS_OPTIONS,
  STUDIO_PRESETS,
  normalizeHex,
} from '@/utils/designSystemCreate'

const props = withDefaults(defineProps<{
  config: DesignSystemCreateConfig
  isModified: boolean
  copyState: 'idle' | 'copied' | 'failed'
  copyAnnouncement: string
  showClose?: boolean
}>(), {
  showClose: false,
})

const emit = defineEmits<{
  (e: 'apply-preset', presetId: Exclude<CreatePresetId, 'custom'>): void
  (e: 'update-field', payload: Partial<DesignSystemCreateConfig>): void
  (e: 'randomize'): void
  (e: 'reset'): void
  (e: 'copy-prompt'): void
  (e: 'download-zip'): void
  (e: 'inspect-export'): void
  (e: 'close'): void
}>()

const colorMenuOpen = ref(false)
const customHexDraft = ref(props.config.brandHex)
const customHexError = ref('')

watch(() => props.config.brandHex, nextHex => {
  customHexDraft.value = nextHex
  customHexError.value = ''
})

const applyCustomHex = () => {
  const cleaned = customHexDraft.value.trim().replace(/^#/, '')
  if (!/^([\da-f]{3}|[\da-f]{6})$/i.test(cleaned)) {
    customHexError.value = 'Enter a 3 or 6 digit hex color'
    return
  }
  customHexError.value = ''
  const normalized = normalizeHex(`#${cleaned}`, props.config.brandHex)
  emit('update-field', { brandHex: normalized })
  colorMenuOpen.value = false
}

const onPickerUpdate = (value: string) => {
  if (/^#[\da-f]{6}$/i.test(value)) {
    customHexDraft.value = value.toUpperCase()
    customHexError.value = ''
    emit('update-field', { brandHex: value.toUpperCase() })
  }
}

const setStyle = (style: CreateStyleMode) => emit('update-field', { style })
const setBaseColor = (baseColor: CreateBaseColorId) => emit('update-field', { baseColor })
const setBrandHex = (brandHex: string) => emit('update-field', { brandHex: brandHex.toUpperCase() })
const setFont = (font: CreateFontId) => emit('update-field', { font })
const setRadius = (radius: CreateRadiusValue) => emit('update-field', { radius })
const setButtonShape = (buttonShape: CreateButtonShape) => emit('update-field', { buttonShape })
const setDensity = (density: CreateDensityMode) => emit('update-field', { density })
const setIconStyle = (iconStyle: CreateIconStyle) => emit('update-field', { iconStyle })
const setTableMode = (tableMode: CreateTableMode) => emit('update-field', { tableMode })
const setThemeMode = (themeMode: CreateThemeMode) => emit('update-field', { themeMode })
</script>

<template>
  <div class="create-panel d-flex flex-column h-100 bg-surface">
    <!-- Sticky Header -->
    <div class="create-panel__header d-flex align-center justify-space-between gap-2 px-4 py-3 border-b">
      <div class="d-flex align-center gap-2 min-w-0">
        <VIcon icon="ri-equalizer-2-line" size="18" color="primary" aria-hidden="true" />
        <h2 class="text-subtitle-1 font-weight-medium text-high-emphasis mb-0 text-truncate">
          Design system
        </h2>
        <VChip v-if="props.config.preset === 'custom'" size="x-small" color="primary" variant="tonal">
          Custom
        </VChip>
      </div>

      <div class="d-flex align-center gap-1 flex-shrink-0">
        <IconBtn
          type="button"
          size="small"
          aria-label="Randomize design tokens"
          @click="emit('randomize')"
        >
          <VIcon icon="ri-shuffle-line" size="18" aria-hidden="true" />
          <VTooltip activator="parent" location="top">Randomize</VTooltip>
        </IconBtn>
        <IconBtn
          type="button"
          size="small"
          :disabled="!props.isModified"
          aria-label="Reset design tokens to default"
          @click="emit('reset')"
        >
          <VIcon icon="ri-refresh-line" size="18" aria-hidden="true" />
          <VTooltip activator="parent" location="top">Reset defaults</VTooltip>
        </IconBtn>
        <IconBtn
          v-if="props.showClose"
          type="button"
          size="small"
          aria-label="Close customizer panel"
          @click="emit('close')"
        >
          <VIcon icon="ri-close-line" size="20" aria-hidden="true" />
        </IconBtn>
      </div>
    </div>

    <!-- Scrollable Controls -->
    <div class="create-panel__body flex-grow-1 px-4 py-4 d-flex flex-column gap-5">
      <!-- Preset -->
      <section aria-labelledby="ctrl-preset-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-preset-label" class="text-caption font-weight-medium text-high-emphasis">Preset</span>
          <span class="text-caption text-medium-emphasis">Quick start</span>
        </div>
        <div class="preset-grid" role="group" aria-labelledby="ctrl-preset-label">
          <button
            v-for="preset in STUDIO_PRESETS"
            :key="preset.id"
            type="button"
            class="ctrl-choice ctrl-choice--preset text-start"
            :aria-pressed="props.config.preset === preset.id"
            @click="emit('apply-preset', preset.id)"
          >
            <span class="swatch-dot flex-shrink-0" :style="{ backgroundColor: preset.swatch }" aria-hidden="true" />
            <span class="min-w-0">
              <span class="d-block text-body-2 font-weight-medium text-high-emphasis text-truncate">{{ preset.label }}</span>
              <span class="d-block text-caption text-medium-emphasis text-truncate">{{ preset.summary }}</span>
            </span>
          </button>
        </div>
      </section>

      <VDivider />

      <!-- Style & Mode -->
      <section aria-labelledby="ctrl-style-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-style-label" class="text-caption font-weight-medium text-high-emphasis">Card style</span>
          <span class="text-caption text-medium-emphasis">{{ props.config.style === 'bordered' ? '1px border' : 'Elevated shadow' }}</span>
        </div>
        <div class="segment-grid segment-grid--2" role="group" aria-labelledby="ctrl-style-label">
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.style === 'bordered'"
            @click="setStyle('bordered')"
          >
            <VIcon icon="ri-checkbox-blank-line" size="16" aria-hidden="true" />
            <span>Bordered</span>
          </button>
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.style === 'elevated'"
            @click="setStyle('elevated')"
          >
            <VIcon icon="ri-stack-line" size="16" aria-hidden="true" />
            <span>Elevated</span>
          </button>
        </div>
      </section>

      <!-- Base Neutral -->
      <section aria-labelledby="ctrl-base-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-base-label" class="text-caption font-weight-medium text-high-emphasis">Base neutral</span>
          <span class="text-caption text-medium-emphasis">Surfaces &amp; greys</span>
        </div>
        <div class="base-grid" role="group" aria-labelledby="ctrl-base-label">
          <button
            v-for="palette in BASE_COLOR_PALETTES"
            :key="palette.id"
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.baseColor === palette.id"
            @click="setBaseColor(palette.id)"
          >
            <span class="swatch-dot swatch-dot--sm" :style="{ backgroundColor: palette.swatch }" aria-hidden="true" />
            <span>{{ palette.label }}</span>
          </button>
        </div>
      </section>

      <!-- Brand / Theme Primary -->
      <section aria-labelledby="ctrl-brand-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-brand-label" class="text-caption font-weight-medium text-high-emphasis">Brand color</span>
          <code class="text-caption text-medium-emphasis">{{ props.config.brandHex }}</code>
        </div>
        <div class="brand-grid mb-2" role="group" aria-labelledby="ctrl-brand-label">
          <button
            v-for="swatch in BRAND_SWATCH_OPTIONS"
            :key="swatch.id"
            type="button"
            class="ctrl-swatch-btn"
            :aria-label="`${swatch.label} (${swatch.hex})`"
            :aria-pressed="props.config.brandHex.toLowerCase() === swatch.hex.toLowerCase()"
            @click="setBrandHex(swatch.hex)"
          >
            <span class="swatch-dot swatch-dot--lg" :style="{ backgroundColor: swatch.hex }" aria-hidden="true">
              <VIcon
                v-if="props.config.brandHex.toLowerCase() === swatch.hex.toLowerCase()"
                icon="ri-check-line"
                size="14"
                color="white"
              />
            </span>
          </button>
        </div>

        <VMenu v-model="colorMenuOpen" :close-on-content-click="false" location="bottom start">
          <template #activator="{ props: menuProps }">
            <button
              v-bind="menuProps"
              type="button"
              class="ctrl-choice w-100 justify-space-between"
            >
              <span class="d-flex align-center gap-2">
                <span class="swatch-dot swatch-dot--sm" :style="{ backgroundColor: props.config.brandHex }" aria-hidden="true" />
                <span>Custom hex color</span>
              </span>
              <span class="d-flex align-center gap-1 text-medium-emphasis">
                <code>{{ props.config.brandHex }}</code>
                <VIcon icon="ri-arrow-down-s-line" size="16" aria-hidden="true" />
              </span>
            </button>
          </template>

          <VCard class="pa-4 bg-surface border" width="292">
            <VColorPicker
              :model-value="props.config.brandHex"
              mode="hex"
              :modes="['hex']"
              hide-inputs
              width="260"
              elevation="0"
              class="mb-3"
              @update:model-value="onPickerUpdate"
            />
            <div class="d-flex align-start gap-2">
              <VTextField
                v-model="customHexDraft"
                label="Hex value"
                placeholder="#10AF13"
                density="compact"
                :error-messages="customHexError"
                hide-details="auto"
                @keydown.enter.prevent="applyCustomHex"
              />
              <VBtn type="button" size="small" color="primary" class="mt-1" @click="applyCustomHex">
                Apply
              </VBtn>
            </div>
          </VCard>
        </VMenu>
      </section>

      <VDivider />

      <!-- Font Family -->
      <section>
        <VSelect
          :model-value="props.config.font"
          :items="FONT_OPTIONS"
          item-title="label"
          item-value="id"
          label="Font family"
          density="compact"
          hide-details
          @update:model-value="val => setFont(val)"
        />
      </section>

      <!-- Radius & Button Shape -->
      <section aria-labelledby="ctrl-radius-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-radius-label" class="text-caption font-weight-medium text-high-emphasis">Radius (px)</span>
          <span class="text-caption text-medium-emphasis">{{ props.config.radius }}px</span>
        </div>
        <div class="segment-grid segment-grid--6 mb-3" role="group" aria-labelledby="ctrl-radius-label">
          <button
            v-for="item in RADIUS_OPTIONS"
            :key="item.value"
            type="button"
            class="ctrl-choice justify-center px-1"
            :aria-label="`${item.label} pixels radius`"
            :aria-pressed="props.config.radius === item.value"
            @click="setRadius(item.value)"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-btn-shape-label" class="text-caption font-weight-medium text-high-emphasis">Button shape</span>
        </div>
        <div class="segment-grid segment-grid--2" role="group" aria-labelledby="ctrl-btn-shape-label">
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.buttonShape === 'pill'"
            @click="setButtonShape('pill')"
          >
            <span>Pill (999px)</span>
          </button>
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.buttonShape === 'rounded'"
            @click="setButtonShape('rounded')"
          >
            <span>Match radius</span>
          </button>
        </div>
      </section>

      <!-- Density & Icons -->
      <section aria-labelledby="ctrl-density-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-density-label" class="text-caption font-weight-medium text-high-emphasis">Control density</span>
        </div>
        <div class="segment-grid segment-grid--2 mb-3" role="group" aria-labelledby="ctrl-density-label">
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.density === 'comfortable'"
            @click="setDensity('comfortable')"
          >
            <span>Comfortable</span>
          </button>
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.density === 'compact'"
            @click="setDensity('compact')"
          >
            <span>Compact</span>
          </button>
        </div>

        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-icon-label" class="text-caption font-weight-medium text-high-emphasis">Remix icon style</span>
        </div>
        <div class="segment-grid segment-grid--2" role="group" aria-labelledby="ctrl-icon-label">
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.iconStyle === 'line'"
            @click="setIconStyle('line')"
          >
            <VIcon icon="ri-star-line" size="16" aria-hidden="true" />
            <span>Line</span>
          </button>
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.iconStyle === 'fill'"
            @click="setIconStyle('fill')"
          >
            <VIcon icon="ri-star-fill" size="16" aria-hidden="true" />
            <span>Fill</span>
          </button>
        </div>
      </section>

      <!-- Table Mobile Presentation & Theme Mode -->
      <section aria-labelledby="ctrl-table-label">
        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-table-label" class="text-caption font-weight-medium text-high-emphasis">Mobile table mode</span>
        </div>
        <div class="segment-grid segment-grid--2 mb-3" role="group" aria-labelledby="ctrl-table-label">
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.tableMode === 'mobile-cards'"
            @click="setTableMode('mobile-cards')"
          >
            <VIcon icon="ri-id-card-line" size="16" aria-hidden="true" />
            <span>Mobile cards</span>
          </button>
          <button
            type="button"
            class="ctrl-choice"
            :aria-pressed="props.config.tableMode === 'scrollable'"
            @click="setTableMode('scrollable')"
          >
            <VIcon icon="ri-table-line" size="16" aria-hidden="true" />
            <span>Scroll table</span>
          </button>
        </div>

        <div class="d-flex align-center justify-space-between mb-2">
          <span id="ctrl-mode-label" class="text-caption font-weight-medium text-high-emphasis">Theme mode</span>
        </div>
        <div class="segment-grid segment-grid--3" role="group" aria-labelledby="ctrl-mode-label">
          <button
            type="button"
            class="ctrl-choice justify-center"
            :aria-pressed="props.config.themeMode === 'light'"
            @click="setThemeMode('light')"
          >
            <VIcon icon="ri-sun-line" size="16" aria-hidden="true" />
            <span>Light</span>
          </button>
          <button
            type="button"
            class="ctrl-choice justify-center"
            :aria-pressed="props.config.themeMode === 'dark'"
            @click="setThemeMode('dark')"
          >
            <VIcon icon="ri-moon-clear-line" size="16" aria-hidden="true" />
            <span>Dark</span>
          </button>
          <button
            type="button"
            class="ctrl-choice justify-center"
            :aria-pressed="props.config.themeMode === 'system'"
            @click="setThemeMode('system')"
          >
            <VIcon icon="ri-computer-line" size="16" aria-hidden="true" />
            <span>Auto</span>
          </button>
        </div>
      </section>
    </div>

    <!-- Sticky Export Actions Footer -->
    <div class="create-panel__footer px-4 py-3 border-t bg-surface d-flex flex-column gap-2">
      <div class="copy-action-context">
        <VBtn
          type="button"
          block
          :color="props.copyState === 'failed' ? 'error' : 'primary'"
          :data-copied="props.copyState === 'copied' ? '' : undefined"
          :data-failed="props.copyState === 'failed' ? '' : undefined"
          @click="emit('copy-prompt')"
        >
          <VIcon
            start
            :icon="props.copyState === 'copied' ? 'ri-check-line' : 'ri-sparkling-line'"
            size="18"
            aria-hidden="true"
          />
          {{ props.copyState === 'copied' ? 'Copied AI prompt' : 'Copy AI setup prompt' }}
        </VBtn>
        <span class="sr-only" role="status">{{ props.copyAnnouncement }}</span>
      </div>

      <VBtn
        type="button"
        block
        variant="outlined"
        prepend-icon="ri-folder-zip-line"
        @click="emit('download-zip')"
      >
        Download how-to (.zip)
      </VBtn>

      <VBtn
        type="button"
        block
        size="small"
        variant="text"
        color="primary"
        prepend-icon="ri-code-s-slash-line"
        @click="emit('inspect-export')"
      >
        Inspect setup files
      </VBtn>
    </div>
  </div>
</template>

<style scoped lang="scss">
.create-panel__body {
  overflow-y: auto;
}

.preset-grid {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.segment-grid {
  display: grid;
  gap: 6px;
}

.segment-grid--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.segment-grid--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.segment-grid--6 {
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.base-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
}

.brand-grid {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  gap: 4px;
}

.ctrl-choice {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-block-size: 36px;
  min-inline-size: 24px;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgb(var(--v-theme-surface));
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
  font: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.25rem;
  cursor: pointer;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1), border-color 150ms ease, background-color 150ms ease;

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.97);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover:not([aria-pressed="true"]) {
      background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
      border-color: rgba(var(--v-theme-on-surface), 0.24);
    }
  }

  &[aria-pressed="true"] {
    border-color: rgb(var(--v-theme-primary));
    background-color: rgba(var(--v-theme-primary), 0.1);
    color: rgb(var(--v-theme-primary));
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
}

.ctrl-choice--preset {
  padding-block: 8px;
}

.ctrl-swatch-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-inline-size: 32px;
  min-block-size: 32px;
  padding: 2px;
  border-radius: 999px;
  border: 2px solid transparent;
  background: transparent;
  cursor: pointer;
  transition: transform 150ms cubic-bezier(0.23, 1, 0.32, 1);

  &:focus-visible {
    outline: 2px solid rgb(var(--v-theme-primary));
    outline-offset: 2px;
  }

  &:active {
    transform: scale(0.95);
  }

  &[aria-pressed="true"] {
    border-color: rgba(var(--v-theme-on-surface), 0.45);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;

    &:active {
      transform: none;
    }
  }
}

.swatch-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 16px;
  block-size: 16px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.16);
}

.swatch-dot--sm {
  inline-size: 14px;
  block-size: 14px;
}

.swatch-dot--lg {
  inline-size: 22px;
  block-size: 22px;
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
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
</style>
