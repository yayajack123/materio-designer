import type { ZipFileEntry } from '@/utils/zipArchive'
import { getBrandThemeColors, staticPrimaryColor } from '@/plugins/vuetify/theme'

export type CreatePresetId = 'materio' | 'zinc' | 'ocean' | 'violet' | 'terracotta' | 'custom'
export type CreateStyleMode = 'bordered' | 'elevated'
export type CreateBaseColorId = 'materio' | 'zinc' | 'slate' | 'stone' | 'neutral'
export type CreateFontId = 'poppins' | 'inter' | 'plus-jakarta-sans' | 'dm-sans' | 'geist'
export type CreateRadiusValue = 0 | 4 | 6 | 8 | 12 | 16
export type CreateButtonShape = 'pill' | 'rounded'
export type CreateDensityMode = 'comfortable' | 'compact'
export type CreateIconStyle = 'line' | 'fill'
export type CreateTableMode = 'mobile-cards' | 'scrollable'
export type CreateThemeMode = 'light' | 'dark' | 'system'

export interface DesignSystemCreateConfig {
  preset: CreatePresetId
  style: CreateStyleMode
  baseColor: CreateBaseColorId
  brandHex: string
  font: CreateFontId
  radius: CreateRadiusValue
  buttonShape: CreateButtonShape
  density: CreateDensityMode
  iconStyle: CreateIconStyle
  tableMode: CreateTableMode
  themeMode: CreateThemeMode
}

export interface NeutralThemePalette {
  id: CreateBaseColorId
  label: string
  swatch: string
  light: Record<string, string>
  dark: Record<string, string>
}

export interface FontOption {
  id: CreateFontId
  label: string
  stack: string
  googleFontHref?: string
}

export interface BrandSwatchOption {
  id: string
  label: string
  hex: string
}

export interface StudioPresetOption {
  id: Exclude<CreatePresetId, 'custom'>
  label: string
  summary: string
  swatch: string
  values: Omit<DesignSystemCreateConfig, 'preset' | 'themeMode'>
}

export const BRAND_SWATCH_OPTIONS: BrandSwatchOption[] = [
  { id: 'materio', label: 'Materio Green', hex: '#10AF13' },
  { id: 'ocean', label: 'Ocean Blue', hex: '#0F6CBD' },
  { id: 'violet', label: 'Iris Violet', hex: '#6E3FF3' },
  { id: 'teal', label: 'Jade Teal', hex: '#0D9488' },
  { id: 'terracotta', label: 'Terracotta', hex: '#C84B31' },
  { id: 'amber', label: 'Amber Gold', hex: '#D97706' },
  { id: 'rose', label: 'Crimson Rose', hex: '#E11D48' },
  { id: 'mono', label: 'Graphite', hex: '#27272A' },
]

export const BASE_COLOR_PALETTES: NeutralThemePalette[] = [
  {
    id: 'materio',
    label: 'Materio',
    swatch: '#2E263D',
    light: {
      'background': '#FAFAFA',
      'on-background': '#2E263D',
      'surface': '#FFFFFF',
      'on-surface': '#2E263D',
      'skin-bordered-background': '#FAFAFA',
      'skin-bordered-surface': '#FFFFFF',
      'grey-light': '#FAFAFA',
      'grey-50': '#FAFAFA',
      'grey-100': '#F5F5F5',
      'grey-200': '#EEEEEE',
      'grey-300': '#E0E0E0',
      'grey-400': '#BDBDBD',
      'grey-500': '#9E9E9E',
      'grey-600': '#757575',
      'grey-700': '#616161',
      'grey-800': '#424242',
      'grey-900': '#212121',
    },
    dark: {
      'background': '#09090B',
      'on-background': '#FAFAFA',
      'surface': '#18181B',
      'on-surface': '#FAFAFA',
      'skin-bordered-background': '#18181B',
      'skin-bordered-surface': '#18181B',
      'grey-50': '#18181B',
      'grey-100': '#27272A',
      'grey-200': '#3F3F46',
      'grey-300': '#52525B',
      'grey-400': '#71717A',
      'grey-500': '#A1A1AA',
      'grey-600': '#D4D4D8',
      'grey-700': '#E4E4E7',
      'grey-800': '#F4F4F5',
      'grey-900': '#FAFAFA',
    },
  },
  {
    id: 'zinc',
    label: 'Zinc',
    swatch: '#52525B',
    light: {
      'background': '#FAFAFA',
      'on-background': '#18181B',
      'surface': '#FFFFFF',
      'on-surface': '#18181B',
      'skin-bordered-background': '#FAFAFA',
      'skin-bordered-surface': '#FFFFFF',
      'grey-light': '#FAFAFA',
      'grey-50': '#FAFAFA',
      'grey-100': '#F4F4F5',
      'grey-200': '#E4E4E7',
      'grey-300': '#D4D4D8',
      'grey-400': '#A1A1AA',
      'grey-500': '#71717A',
      'grey-600': '#52525B',
      'grey-700': '#3F3F46',
      'grey-800': '#27272A',
      'grey-900': '#18181B',
    },
    dark: {
      'background': '#09090B',
      'on-background': '#FAFAFA',
      'surface': '#18181B',
      'on-surface': '#FAFAFA',
      'skin-bordered-background': '#18181B',
      'skin-bordered-surface': '#18181B',
      'grey-50': '#18181B',
      'grey-100': '#27272A',
      'grey-200': '#3F3F46',
      'grey-300': '#52525B',
      'grey-400': '#71717A',
      'grey-500': '#A1A1AA',
      'grey-600': '#D4D4D8',
      'grey-700': '#E4E4E7',
      'grey-800': '#F4F4F5',
      'grey-900': '#FAFAFA',
    },
  },
  {
    id: 'slate',
    label: 'Slate',
    swatch: '#475569',
    light: {
      'background': '#F8FAFC',
      'on-background': '#0F172A',
      'surface': '#FFFFFF',
      'on-surface': '#0F172A',
      'skin-bordered-background': '#F8FAFC',
      'skin-bordered-surface': '#FFFFFF',
      'grey-light': '#F8FAFC',
      'grey-50': '#F8FAFC',
      'grey-100': '#F1F5F9',
      'grey-200': '#E2E8F0',
      'grey-300': '#CBD5E1',
      'grey-400': '#94A3B8',
      'grey-500': '#64748B',
      'grey-600': '#475569',
      'grey-700': '#334155',
      'grey-800': '#1E293B',
      'grey-900': '#0F172A',
    },
    dark: {
      'background': '#0B1120',
      'on-background': '#F1F5F9',
      'surface': '#151F32',
      'on-surface': '#F1F5F9',
      'skin-bordered-background': '#151F32',
      'skin-bordered-surface': '#151F32',
      'grey-50': '#1E293B',
      'grey-100': '#263449',
      'grey-200': '#334155',
      'grey-300': '#475569',
      'grey-400': '#64748B',
      'grey-500': '#94A3B8',
      'grey-600': '#CBD5E1',
      'grey-700': '#E2E8F0',
      'grey-800': '#F1F5F9',
      'grey-900': '#F8FAFC',
    },
  },
  {
    id: 'stone',
    label: 'Stone',
    swatch: '#57534E',
    light: {
      'background': '#FAFAF9',
      'on-background': '#1C1917',
      'surface': '#FFFFFF',
      'on-surface': '#1C1917',
      'skin-bordered-background': '#FAFAF9',
      'skin-bordered-surface': '#FFFFFF',
      'grey-light': '#FAFAF9',
      'grey-50': '#FAFAF9',
      'grey-100': '#F5F5F4',
      'grey-200': '#E7E5E4',
      'grey-300': '#D6D3D1',
      'grey-400': '#A8A29E',
      'grey-500': '#78716C',
      'grey-600': '#57534E',
      'grey-700': '#44403C',
      'grey-800': '#292524',
      'grey-900': '#1C1917',
    },
    dark: {
      'background': '#141210',
      'on-background': '#F5F5F4',
      'surface': '#211E1B',
      'on-surface': '#F5F5F4',
      'skin-bordered-background': '#211E1B',
      'skin-bordered-surface': '#211E1B',
      'grey-50': '#292524',
      'grey-100': '#342F2C',
      'grey-200': '#44403C',
      'grey-300': '#57534E',
      'grey-400': '#78716C',
      'grey-500': '#A8A29E',
      'grey-600': '#D6D3D1',
      'grey-700': '#E7E5E4',
      'grey-800': '#F5F5F4',
      'grey-900': '#FAFAF9',
    },
  },
  {
    id: 'neutral',
    label: 'Neutral',
    swatch: '#525252',
    light: {
      'background': '#F9F9F9',
      'on-background': '#171717',
      'surface': '#FFFFFF',
      'on-surface': '#171717',
      'skin-bordered-background': '#F9F9F9',
      'skin-bordered-surface': '#FFFFFF',
      'grey-light': '#F9F9F9',
      'grey-50': '#FAFAFA',
      'grey-100': '#F5F5F5',
      'grey-200': '#E5E5E5',
      'grey-300': '#D4D4D4',
      'grey-400': '#A3A3A3',
      'grey-500': '#737373',
      'grey-600': '#525252',
      'grey-700': '#404040',
      'grey-800': '#262626',
      'grey-900': '#171717',
    },
    dark: {
      'background': '#111111',
      'on-background': '#FAFAFA',
      'surface': '#1C1C1C',
      'on-surface': '#FAFAFA',
      'skin-bordered-background': '#1C1C1C',
      'skin-bordered-surface': '#1C1C1C',
      'grey-50': '#222222',
      'grey-100': '#2A2A2A',
      'grey-200': '#404040',
      'grey-300': '#525252',
      'grey-400': '#737373',
      'grey-500': '#A3A3A3',
      'grey-600': '#D4D4D4',
      'grey-700': '#E5E5E5',
      'grey-800': '#F5F5F5',
      'grey-900': '#FAFAFA',
    },
  },
]

export const FONT_OPTIONS: FontOption[] = [
  {
    id: 'poppins',
    label: 'Poppins (Default)',
    stack: '"Poppins", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  {
    id: 'inter',
    label: 'Inter',
    stack: '"Inter", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    googleFontHref: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
  },
  {
    id: 'plus-jakarta-sans',
    label: 'Plus Jakarta Sans',
    stack: '"Plus Jakarta Sans", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    googleFontHref: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: 'dm-sans',
    label: 'DM Sans',
    stack: '"DM Sans", sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    googleFontHref: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap',
  },
  {
    id: 'geist',
    label: 'Geist',
    stack: '"Geist", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    googleFontHref: 'https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap',
  },
]

export const RADIUS_OPTIONS: { value: CreateRadiusValue; label: string }[] = [
  { value: 0, label: '0' },
  { value: 4, label: '4' },
  { value: 6, label: '6' },
  { value: 8, label: '8' },
  { value: 12, label: '12' },
  { value: 16, label: '16' },
]

export const STUDIO_PRESETS: StudioPresetOption[] = [
  {
    id: 'materio',
    label: 'Materio Default',
    summary: 'Poppins · Green · Bordered · Pill buttons',
    swatch: '#10AF13',
    values: {
      style: 'bordered',
      baseColor: 'materio',
      brandHex: '#10AF13',
      font: 'poppins',
      radius: 12,
      buttonShape: 'pill',
      density: 'comfortable',
      iconStyle: 'line',
      tableMode: 'mobile-cards',
    },
  },
  {
    id: 'zinc',
    label: 'Clean Zinc',
    summary: 'Geist · Graphite · Crisp 8px corners',
    swatch: '#27272A',
    values: {
      style: 'bordered',
      baseColor: 'zinc',
      brandHex: '#27272A',
      font: 'geist',
      radius: 8,
      buttonShape: 'rounded',
      density: 'compact',
      iconStyle: 'line',
      tableMode: 'scrollable',
    },
  },
  {
    id: 'ocean',
    label: 'Slate Ocean',
    summary: 'Inter · Ocean Blue · Enterprise density',
    swatch: '#0F6CBD',
    values: {
      style: 'bordered',
      baseColor: 'slate',
      brandHex: '#0F6CBD',
      font: 'inter',
      radius: 8,
      buttonShape: 'rounded',
      density: 'compact',
      iconStyle: 'line',
      tableMode: 'scrollable',
    },
  },
  {
    id: 'violet',
    label: 'Violet Studio',
    summary: 'Plus Jakarta · Iris Violet · Soft elevated',
    swatch: '#6E3FF3',
    values: {
      style: 'elevated',
      baseColor: 'materio',
      brandHex: '#6E3FF3',
      font: 'plus-jakarta-sans',
      radius: 16,
      buttonShape: 'pill',
      density: 'comfortable',
      iconStyle: 'fill',
      tableMode: 'mobile-cards',
    },
  },
  {
    id: 'terracotta',
    label: 'Stone Editorial',
    summary: 'DM Sans · Terracotta · Warm stone neutral',
    swatch: '#C84B31',
    values: {
      style: 'bordered',
      baseColor: 'stone',
      brandHex: '#C84B31',
      font: 'dm-sans',
      radius: 6,
      buttonShape: 'pill',
      density: 'comfortable',
      iconStyle: 'line',
      tableMode: 'mobile-cards',
    },
  },
]

export const createDefaultStudioConfig = (defaultBrandHex = staticPrimaryColor): DesignSystemCreateConfig => ({
  preset: 'materio',
  style: 'bordered',
  baseColor: 'materio',
  brandHex: getBrandThemeColors(defaultBrandHex).primary.toUpperCase(),
  font: 'poppins',
  radius: 12,
  buttonShape: 'pill',
  density: 'comfortable',
  iconStyle: 'line',
  tableMode: 'mobile-cards',
  themeMode: 'light',
})

export const normalizeHex = (input: string, fallback = staticPrimaryColor): string =>
  getBrandThemeColors(input || fallback).primary.toUpperCase()

export const getNeutralPalette = (id: CreateBaseColorId): NeutralThemePalette =>
  BASE_COLOR_PALETTES.find(item => item.id === id) ?? BASE_COLOR_PALETTES[0]

export const getFontOption = (id: CreateFontId): FontOption =>
  FONT_OPTIONS.find(item => item.id === id) ?? FONT_OPTIONS[0]

export const detectMatchingPreset = (config: Omit<DesignSystemCreateConfig, 'preset' | 'themeMode'>): CreatePresetId => {
  const matched = STUDIO_PRESETS.find(preset =>
    preset.values.style === config.style
    && preset.values.baseColor === config.baseColor
    && preset.values.brandHex.toLowerCase() === config.brandHex.toLowerCase()
    && preset.values.font === config.font
    && preset.values.radius === config.radius
    && preset.values.buttonShape === config.buttonShape
    && preset.values.density === config.density
    && preset.values.iconStyle === config.iconStyle
    && preset.values.tableMode === config.tableMode,
  )

  return matched ? matched.id : 'custom'
}

export const parseCreateQuery = (
  search: string,
  defaultBrandHex = staticPrimaryColor,
): DesignSystemCreateConfig => {
  const defaults = createDefaultStudioConfig(defaultBrandHex)
  const params = new URLSearchParams(search)

  const presetParam = params.get('preset') as CreatePresetId | null
  const presetMatch = STUDIO_PRESETS.find(item => item.id === presetParam)
  const base: DesignSystemCreateConfig = presetMatch
    ? {
        ...defaults,
        ...presetMatch.values,
        preset: presetMatch.id,
      }
    : { ...defaults }

  const style = params.get('style')
  if (style === 'bordered' || style === 'elevated') base.style = style

  const baseColor = params.get('base') as CreateBaseColorId | null
  if (BASE_COLOR_PALETTES.some(item => item.id === baseColor)) {
    base.baseColor = baseColor!
  }

  const brand = params.get('brand')
  if (brand) {
    base.brandHex = normalizeHex(brand, base.brandHex)
  }

  const font = params.get('font') as CreateFontId | null
  if (FONT_OPTIONS.some(item => item.id === font)) {
    base.font = font!
  }

  const radiusRaw = params.get('radius')
  if (radiusRaw !== null && radiusRaw !== '') {
    const parsed = Number.parseInt(radiusRaw, 10) as CreateRadiusValue
    if (RADIUS_OPTIONS.some(option => option.value === parsed)) {
      base.radius = parsed
    }
  }

  const buttonShape = params.get('btn')
  if (buttonShape === 'pill' || buttonShape === 'rounded') {
    base.buttonShape = buttonShape
  }

  const density = params.get('density')
  if (density === 'comfortable' || density === 'compact') {
    base.density = density
  }

  const iconStyle = params.get('icons')
  if (iconStyle === 'line' || iconStyle === 'fill') {
    base.iconStyle = iconStyle
  }

  const tableMode = params.get('table')
  if (tableMode === 'mobile-cards' || tableMode === 'scrollable') {
    base.tableMode = tableMode
  }

  const mode = params.get('mode')
  if (mode === 'light' || mode === 'dark' || mode === 'system') {
    base.themeMode = mode
  }

  base.preset = detectMatchingPreset(base)

  return base
}

export const buildCreateQueryRecord = (
  config: DesignSystemCreateConfig,
  defaultBrandHex = staticPrimaryColor,
): Record<string, string> => {
  const defaults = createDefaultStudioConfig(defaultBrandHex)
  const query: Record<string, string> = {}

  if (config.preset !== 'custom' && config.preset !== defaults.preset) {
    query.preset = config.preset
  }
  if (config.style !== defaults.style) query.style = config.style
  if (config.baseColor !== defaults.baseColor) query.base = config.baseColor
  if (config.brandHex.toLowerCase() !== defaults.brandHex.toLowerCase()) {
    query.brand = config.brandHex.replace(/^#/, '')
  }
  if (config.font !== defaults.font) query.font = config.font
  if (config.radius !== defaults.radius) query.radius = String(config.radius)
  if (config.buttonShape !== defaults.buttonShape) query.btn = config.buttonShape
  if (config.density !== defaults.density) query.density = config.density
  if (config.iconStyle !== defaults.iconStyle) query.icons = config.iconStyle
  if (config.tableMode !== defaults.tableMode) query.table = config.tableMode
  if (config.themeMode !== defaults.themeMode) query.mode = config.themeMode

  return query
}

export interface ExportBundleResult {
  promptText: string
  howToMarkdown: string
  envContent: string
  overridesMarkdown: string
  tokensJson: string
  zipFiles: ZipFileEntry[]
}

export const buildExportBundle = (
  config: DesignSystemCreateConfig,
  shareUrl: string,
): ExportBundleResult => {
  const brand = getBrandThemeColors(config.brandHex)
  const neutral = getNeutralPalette(config.baseColor)
  const font = getFontOption(config.font)
  const isDefaultNeutral = config.baseColor === 'materio'
  const isDefaultFont = config.font === 'poppins'
  const isDefaultRadius = config.radius === 12
  const isDefaultButton = config.buttonShape === 'pill'
  const isDefaultDensity = config.density === 'comfortable'
  const isDefaultSkin = config.style === 'bordered'

  const envContent = `# Materio Designer — Generated Deployment Environment
NUXT_PUBLIC_APP_NAME="My Application"
NUXT_PUBLIC_APP_LOGO=""
NUXT_PUBLIC_APP_FAVICON="/favicon.ico"
NUXT_PUBLIC_BRAND_PRIMARY="${brand.primary.toUpperCase()}"

# Backend & Auth (keep private secrets out of NUXT_PUBLIC_*)
API_BASE_URL=""
SANCTUM_BASE_URL=""
AUTH_ENABLED=false
APP_ENV="development"
`

  const promptText = `Follow NEW_PROJECT_SETUP.md and help me configure this Materio Designer clone for a new application. Read AGENTS.md and spec/design.md before changing code or UI.

Apply my selected Design System configuration from /create:
- Brand primary color: ${brand.primary.toUpperCase()} (light: ${brand['primary-light'].toUpperCase()}, dark: ${brand['primary-darken-1'].toUpperCase()}, on-primary: #FFFFFF) -> set NUXT_PUBLIC_BRAND_PRIMARY="${brand.primary.toUpperCase()}" in .env and .env.example
- Card & shell style: ${config.style === 'bordered' ? 'Skins.Bordered (1px border, flat surface)' : 'Skins.Default (elevated surface shadow)'} in themeConfig.ts
- Default theme mode: '${config.themeMode}' in themeConfig.ts
- Base neutral palette: ${neutral.label}${isDefaultNeutral ? ' (keep existing Materio light and Zinc dark neutrals in plugins/vuetify/theme.ts)' : ` (update background/surface/on-surface and grey-50..grey-900 in plugins/vuetify/theme.ts: light background ${neutral.light.background}, light surface ${neutral.light.surface}, on-surface ${neutral.light['on-surface']}; dark background ${neutral.dark.background}, dark surface ${neutral.dark.surface}, on-surface ${neutral.dark['on-surface']})`}
- Font family: ${font.label}${isDefaultFont ? ' (keep existing Poppins setup)' : ` (load ${font.label} stylesheet in nuxt.config.ts head.link and set $font-family-custom to ${font.stack} in @core/scss/template/libs/vuetify/_variables.scss, then update spec/design.md)`}
- Corner radius: ${config.radius}px cards/surfaces, button shape: ${config.buttonShape === 'pill' ? 'pill (rounded: "pill" in plugins/vuetify/defaults.ts)' : `matched corner radius (${config.radius}px — set VBtn rounded to "${config.radius}px" or remove pill override in plugins/vuetify/defaults.ts)`}; outlined buttons (variant="outlined") default to primary / primary-main for border and text
- Form & control density: '${config.density}' in plugins/vuetify/defaults.ts
- Icon convention: Bundled Remix Icons preferring ${config.iconStyle === 'line' ? 'line variants (ri-*-line)' : 'fill variants (ri-*-fill) for active/primary emphases and line variants where fill does not exist'}
- Default responsive table mode: ${config.tableMode === 'mobile-cards' ? 'Mobile cards (UiTableView with :mobile-cards="true" and explicit #mobile-cards slot)' : 'Scrollable table (UiTableView default horizontal scroll on narrow viewports)'}

Before editing pages or navigation:
1. Ask me concise questions for missing product details (application name, target users/roles, modules/pages to keep or add, and backend API URL).
2. For requested UI, inspect existing templates and patterns and offer a suitable structure when relevant. Adapt content, fields, data models, actions, routes, and integrations to my requirements; treat example domains and data as references, not fixed requirements. Do not assume demo integrations exist.
3. Preserve unrelated files, update spec/design.md and README.md for any changed tokens/defaults, and run \`pnpm lint:check\` and \`pnpm build\` to verify.`

  const overridesMarkdown = `# Vuetify & Theme Overrides Reference

Use these exact snippets if you apply the generated design system manually instead of using an AI coding agent.

## 1. \`themeConfig.ts\`

\`\`\`ts
app: {
  theme: '${config.themeMode}',
  skin: ${isDefaultSkin ? 'Skins.Bordered' : 'Skins.Default'},
}
\`\`\`

## 2. \`plugins/vuetify/defaults.ts\`

\`\`\`ts
VBtn: {
  color: 'primary',
  rounded: ${isDefaultButton ? "'pill'" : config.radius === 0 ? '0' : `'lg'`},
  density: '${config.density}',
},
VCard: {
  variant: '${config.style === 'bordered' ? 'outlined' : 'elevated'}',
},
VTextField: {
  variant: 'outlined',
  density: '${config.density}',
  color: 'primary',
  hideDetails: 'auto',
},
VSelect: {
  variant: 'outlined',
  density: '${config.density}',
  color: 'primary',
  hideDetails: 'auto',
},
\`\`\`

## 3. \`@core/scss/template/libs/vuetify/_variables.scss\`

\`\`\`scss
$font-family-custom: ${font.stack};
$border-radius-root: ${Math.max(0, Math.min(config.radius, 12))}px;
\`\`\`
${font.googleFontHref
  ? `\nLoad the font stylesheet in \`nuxt.config.ts\` under \`app.head.link\`:\n\n\`\`\`ts\n{ rel: 'stylesheet', href: '${font.googleFontHref}' }\n\`\`\`\n`
  : ''}
## 4. \`plugins/vuetify/theme.ts\` (${neutral.label} Neutral Palette)

\`\`\`ts
// Light neutral overrides
const lightNeutral = ${JSON.stringify(neutral.light, null, 2)}

// Dark neutral overrides
const darkNeutral = ${JSON.stringify(neutral.dark, null, 2)}
\`\`\`

## 5. Responsive Table Pattern (\`UiTableView\`)

Selected default: **${config.tableMode === 'mobile-cards' ? 'Mobile cards (`:mobile-cards="true"` + `#mobile-cards` slot)' : 'Scrollable table (default horizontal scroll)'}**.
${isDefaultRadius && isDefaultFont && isDefaultNeutral && isDefaultButton && isDefaultDensity && isDefaultSkin
  ? '\n> Note: Your selections match the starter defaults except for `.env` brand color, so setting `NUXT_PUBLIC_BRAND_PRIMARY` in `.env` is all you need!'
  : ''}`

  const howToMarkdown = `# How to Set Up Your Custom Materio Design System

This package was generated from the **Materio Designer \`/create\` Studio**.
Reopen or tweak this preset anytime at:
${shareUrl}

---

## Prerequisites

- **Node.js:** Use the version specified in \`.nvmrc\`
- **Package manager:** \`pnpm\` (configured in \`package.json\`)

---

## Option A — Fast Setup with an AI Coding Agent (Recommended)

1. Clone the **Materio Designer** starter repository and open it in your editor (Antigravity, Cursor, Claude Code, or Codex).
2. Open \`AI_SETUP_PROMPT.md\` from this ZIP archive and copy the entire prompt.
3. Paste the prompt into your AI agent along with your app name, target roles, and desired pages.
4. The agent will read \`NEW_PROJECT_SETUP.md\`, \`AGENTS.md\`, and \`spec/design.md\`, apply your exact tokens, update documentation, and run validation checks automatically.

---

## Option B — Manual Setup Step-by-Step

### Step 1. Configure environment variables
Copy the included \`.env.example\` into the root of your cloned project as \`.env\`:

\`\`\`sh
cp .env.example .env
\`\`\`

Your selected brand primary (\`${brand.primary.toUpperCase()}\`) is already pre-filled in \`NUXT_PUBLIC_BRAND_PRIMARY\`. Light, dark, and alpha tint tokens derive automatically at runtime.

### Step 2. Apply optional token overrides
Open \`vuetify-overrides.md\` in this archive and apply the snippets for:
- **Card & shell style:** \`${config.style}\`
- **Base neutral palette:** \`${neutral.label}\`
- **Font family:** \`${font.label}\`
- **Corner radius & button shape:** \`${config.radius}px\` / \`${config.buttonShape}\`
- **Control density:** \`${config.density}\`
- **Default table mode:** \`${config.tableMode}\`

If you change tokens beyond \`.env\`, update \`spec/design.md\` in your repository so future contributors and AI agents follow the same source of truth.

### Step 3. Install dependencies & start dev server

\`\`\`sh
pnpm install
pnpm dev
\`\`\`

### Step 4. Validate before committing

\`\`\`sh
pnpm lint:check
pnpm build
\`\`\`

---

## Included Files in This Archive

| File | Purpose |
| :--- | :--- |
| \`HOW_TO_SETUP.md\` | This step-by-step setup guide |
| \`AI_SETUP_PROMPT.md\` | Ready-to-paste prompt for AI coding agents |
| \`.env.example\` | Pre-configured public runtime variables (no secrets) |
| \`vuetify-overrides.md\` | Code snippets for \`themeConfig.ts\`, \`defaults.ts\`, \`theme.ts\`, and SCSS |
| \`design-tokens.json\` | Machine-readable snapshot of your selected design tokens |
`

  const tokensJson = JSON.stringify({
    generator: 'Materio Designer /create',
    shareUrl,
    config,
    resolvedBrand: brand,
    resolvedNeutral: {
      id: neutral.id,
      label: neutral.label,
      light: neutral.light,
      dark: neutral.dark,
    },
    resolvedFont: {
      id: font.id,
      label: font.label,
      stack: font.stack,
      googleFontHref: font.googleFontHref ?? null,
    },
  }, null, 2)

  const zipFiles: ZipFileEntry[] = [
    { name: 'HOW_TO_SETUP.md', content: howToMarkdown },
    { name: 'AI_SETUP_PROMPT.md', content: `${promptText}\n` },
    { name: '.env.example', content: envContent },
    { name: 'vuetify-overrides.md', content: overridesMarkdown },
    { name: 'design-tokens.json', content: `${tokensJson}\n` },
  ]

  return {
    promptText,
    howToMarkdown,
    envContent,
    overridesMarkdown,
    tokensJson,
    zipFiles,
  }
}
