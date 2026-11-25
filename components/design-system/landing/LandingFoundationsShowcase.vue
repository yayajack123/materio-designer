<script setup lang="ts">
import { useTheme } from 'vuetify'

const props = withDefaults(defineProps<{
  fontLabel?: string
  iconStyle?: 'line' | 'fill'
}>(), {
  fontLabel: 'Poppins',
  iconStyle: 'line',
})

const vuetifyTheme = useTheme()

const sampleText = ref('Consistent interfaces start from shared tokens.')

const typographySpecimens = [
  { token: 'h2', className: 'text-h2', meta: '38px / 56px · Medium 500' },
  { token: 'h4', className: 'text-h4', meta: '24px / 38px · Medium 500' },
  { token: 'h5', className: 'text-h5', meta: '18px / 28px · Medium 500' },
  { token: 'body-1', className: 'text-body-1', meta: '15px / 22px · Regular 400' },
  { token: 'body-2', className: 'text-body-2', meta: '13px / 20px · Regular 400' },
  { token: 'caption', className: 'text-caption', meta: '13px / 18px · Tracking 0.025rem' },
]

const activeSwatches = computed(() => {
  const colors = vuetifyTheme.current.value.colors

  return [
    { name: 'primary', hex: colors.primary, fg: colors['on-primary'], role: 'Main brand action' },
    { name: 'primary-darken-1', hex: colors['primary-darken-1'], fg: '#FFFFFF', role: 'Hover & pressed' },
    { name: 'secondary', hex: colors.secondary, fg: colors['on-secondary'], role: 'Muted controls' },
    { name: 'success', hex: colors.success, fg: '#FFFFFF', role: 'Positive status' },
    { name: 'info', hex: colors.info, fg: '#FFFFFF', role: 'Informational' },
    { name: 'warning', hex: colors.warning, fg: '#212121', role: 'Caution alert' },
    { name: 'error', hex: colors.error, fg: '#FFFFFF', role: 'Validation & destructive' },
    { name: 'surface', hex: colors.surface, fg: colors['on-surface'], role: 'Card & dialog container' },
  ]
})

const opacitySteps = [
  { label: 'primary-opacity-lighter', alpha: 0.08, percent: '8%' },
  { label: 'primary-opacity-light', alpha: 0.16, percent: '16%' },
  { label: 'primary-opacity-main', alpha: 0.24, percent: '24%' },
  { label: 'primary-opacity-dark', alpha: 0.32, percent: '32%' },
]

const spacingSamples = [
  { step: '1', px: '4px', width: 16 },
  { step: '2', px: '8px', width: 32 },
  { step: '3', px: '12px', width: 48 },
  { step: '4', px: '16px', width: 64 },
  { step: '6', px: '24px', width: 96 },
  { step: '8', px: '32px', width: 128 },
]

const curatedIcons = computed(() => {
  const suffix = props.iconStyle === 'fill' ? 'fill' : 'line'

  return [
    { name: `ri-home-smile-${suffix}`, label: 'Dashboard' },
    { name: `ri-palette-${suffix}`, label: 'Foundation' },
    { name: `ri-layout-grid-${suffix}`, label: 'Components' },
    { name: `ri-search-${suffix}`, label: 'Search' },
    { name: props.iconStyle === 'fill' ? 'ri-checkbox-circle-fill' : 'ri-check-line', label: 'Success' },
    { name: `ri-error-warning-${suffix}`, label: 'Warning' },
  ]
})
</script>

<template>
  <VRow>
    <!-- Typography specimen -->
    <VCol cols="12" lg="6">
      <VCard variant="outlined" class="bg-surface" height="100%">
        <VCardText class="pa-6 d-flex flex-column gap-5">
          <div class="d-flex flex-wrap align-center justify-space-between gap-2">
            <div>
              <h3 class="text-h5 mb-1">{{ props.fontLabel }} type scale</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">
                Edit the specimen copy to preview hierarchy across breakpoints.
              </p>
            </div>
            <VBtn
              size="small"
              variant="outlined"
              :to="{ name: 'design-system-typography' }"
            >
              Typography docs
            </VBtn>
          </div>

          <VTextField
            v-model="sampleText"
            label="Specimen text"
            density="compact"
            hide-details
            clearable
          />

          <div class="d-flex flex-column gap-4">
            <div
              v-for="item in typographySpecimens"
              :key="item.token"
              class="pb-3 border-b"
            >
              <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-1">
                <code class="text-caption text-high-emphasis">.{{ item.className }}</code>
                <span class="text-caption text-medium-emphasis">{{ item.meta }}</span>
              </div>
              <p :class="[item.className, 'mb-0 specimen-line']">
                {{ sampleText || 'Consistent interfaces start from shared tokens.' }}
              </p>
            </div>
          </div>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Colors, Spacing, Icons -->
    <VCol cols="12" lg="6">
      <div class="d-flex flex-column gap-6">
        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-4">
              <div>
                <h3 class="text-h5 mb-1">Active theme tokens</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Reflects current Light/Dark mode and selected brand preset in real time.
                </p>
              </div>
              <VBtn
                size="small"
                variant="outlined"
                :to="{ name: 'design-system-color-system' }"
              >
                Color system
              </VBtn>
            </div>

            <VRow>
              <VCol
                v-for="swatch in activeSwatches"
                :key="swatch.name"
                cols="12"
                sm="6"
              >
                <div class="d-flex align-center gap-3 pa-3 rounded border">
                  <span
                    class="swatch-tile rounded border flex-shrink-0"
                    :style="{ backgroundColor: swatch.hex, color: swatch.fg }"
                    aria-hidden="true"
                  >
                    Aa
                  </span>
                  <div class="min-w-0">
                    <div class="text-body-2 font-weight-medium text-truncate">{{ swatch.name }}</div>
                    <div class="text-caption text-medium-emphasis text-uppercase">{{ swatch.hex }} · {{ swatch.role }}</div>
                  </div>
                </div>
              </VCol>
            </VRow>

            <div class="mt-5">
              <div class="text-body-2 font-weight-medium mb-2">Primary alpha overlays</div>
              <div class="d-flex flex-wrap gap-2">
                <div
                  v-for="step in opacitySteps"
                  :key="step.label"
                  class="px-3 py-2 rounded border text-caption"
                  :style="{ backgroundColor: `rgba(var(--v-theme-primary), ${step.alpha})` }"
                >
                  <strong class="text-high-emphasis">{{ step.percent }}</strong> · {{ step.label }}
                </div>
              </div>
            </div>
          </VCardText>
        </VCard>

        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <div class="d-flex flex-wrap align-center justify-space-between gap-2 mb-4">
              <h3 class="text-h6 mb-0">4px spacing &amp; bundled Remix icons</h3>
              <div class="d-flex flex-wrap gap-2">
                <VBtn size="small" variant="text" color="primary" :to="{ name: 'design-system-spacing' }">Spacing</VBtn>
                <VBtn size="small" variant="text" color="primary" :to="{ name: 'design-system-iconography' }">Iconography</VBtn>
              </div>
            </div>

            <div class="d-flex flex-column gap-2 mb-5">
              <div
                v-for="bar in spacingSamples"
                :key="bar.step"
                class="d-flex align-center gap-3"
              >
                <code class="text-caption text-high-emphasis spacing-code">pa-{{ bar.step }}</code>
                <div
                  class="spacing-bar rounded"
                  :style="{ inlineSize: `${bar.width}px` }"
                  aria-hidden="true"
                />
                <span class="text-caption text-medium-emphasis">{{ bar.px }}</span>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <VChip
                v-for="icon in curatedIcons"
                :key="icon.name"
                variant="outlined"
                size="small"
              >
                <VIcon start :icon="icon.name" size="16" color="primary" aria-hidden="true" />
                {{ icon.label }}
              </VChip>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.specimen-line {
  overflow-wrap: anywhere;
}

.swatch-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  inline-size: 40px;
  block-size: 40px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.spacing-code {
  inline-size: 44px;
  flex-shrink: 0;
}

.spacing-bar {
  block-size: 10px;
  background-color: rgb(var(--v-theme-primary));
}

.min-w-0 {
  min-inline-size: 0;
}
</style>
