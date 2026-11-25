<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { useTheme } from 'vuetify'
import BaseComponentDoc from '@/components/design-system/BaseComponentDoc.vue'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))

definePageMeta({ sidebarRoute: 'components-chart' })
useHead({ title: 'Chart' })

type ChartPreset = 'revenue-bar' | 'weekly-area' | 'category-donut' | 'platform-bar'
type ColorToken = 'primary' | 'success' | 'info' | 'warning'
type DemoState = 'ready' | 'loading' | 'empty' | 'error'

const theme = useTheme()
const reducedMotion = usePreferredReducedMotion()

const presetOptions: { title: string; value: ChartPreset }[] = [
  { title: 'Bar — Weekly revenue', value: 'revenue-bar' },
  { title: 'Area — Daily order trend', value: 'weekly-area' },
  { title: 'Donut — Product category share', value: 'category-donut' },
  { title: 'Grouped bar — Orders by platform', value: 'platform-bar' },
]

const colorOptions: ColorToken[] = ['primary', 'success', 'info', 'warning']
const previewPreset = ref<ChartPreset>('revenue-bar')
const previewColor = ref<ColorToken>('primary')
const showDataTable = ref(false)
const demoState = ref<DemoState>('ready')

const isSingleSeriesPreset = computed(
  () => previewPreset.value === 'revenue-bar' || previewPreset.value === 'weekly-area',
)

const resolveColor = (token: string) => theme.current.value.colors[token] || theme.current.value.colors.primary

const buildAxisOptions = (
  categories: string[],
  max: number,
  kind: 'revenue' | 'week' | 'platform',
  seriesColors: string[],
) => ({
  chart: {
    toolbar: { show: false },
    parentHeightOffset: 0,
    fontFamily: 'Poppins, sans-serif',
    foreColor: theme.current.value.colors['on-surface'],
    animations: {
      enabled: reducedMotion.value !== 'reduce',
      easing: 'easeout',
      speed: 250,
      animateGradually: { enabled: false },
      dynamicAnimation: { enabled: false },
    },
  },
  colors: seriesColors,
  plotOptions: {
    bar: {
      columnWidth: kind === 'platform' ? '35%' : '22%',
      borderRadius: 7,
      borderRadiusApplication: 'end',
    },
  },
  stroke: {
    curve: 'smooth',
    width: kind === 'week' ? 2 : 0,
  },
  fill: {
    opacity: kind === 'week' ? 0.12 : 1,
  },
  markers: {
    size: kind === 'week' ? 3 : 0,
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: {
    borderColor: `rgba(${theme.current.value.dark ? '231, 227, 252' : '46, 38, 61'}, 0.12)`,
    strokeDashArray: 5,
  },
  xaxis: {
    categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max,
    tickAmount: kind === 'week' ? 5 : 6,
    labels: {
      formatter: (value: number) => (kind === 'revenue' ? `${Math.round(value / 1000)}k` : `${Math.round(value)}`),
    },
  },
  tooltip: {
    theme: theme.current.value.dark ? 'dark' : 'light',
  },
})

const revenueCategories = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
const revenueSeries = [{ name: 'Revenue (NTD)', data: [40000, 50000, 55000, 33000] }]

const weeklyCategories = ['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan']
const weeklySeries = [{ name: 'Orders', data: [23, 27, 24, 28, 29, 40, 33, 32, 24, 29] }]

const donutLabels = ['Pulsa Tri', 'PLN Token', 'Tri Pasca Bayar', 'PDAM', 'BPJS Kesehatan']
const donutSeries = [28, 23, 20, 16, 13]

const platformCategories = ['Sep', 'Oct', 'Nov', 'Dec']
const platformSeries = [
  { name: 'iOS', data: [74, 59, 46, 46] },
  { name: 'Android', data: [58, 43, 96, 75] },
]

const donutOptions = computed(() => ({
  chart: {
    fontFamily: 'Poppins, sans-serif',
    animations: {
      enabled: reducedMotion.value !== 'reduce',
      speed: 250,
      animateGradually: { enabled: false },
      dynamicAnimation: { enabled: false },
    },
  },
  labels: donutLabels,
  colors: ['primary', 'success', 'info', 'warning', 'secondary'].map(resolveColor),
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  legend: {
    position: 'bottom' as const,
    labels: { colors: theme.current.value.colors['on-surface'] },
  },
  tooltip: {
    theme: theme.current.value.dark ? 'dark' : 'light',
  },
}))

const revenueOptions = computed(() =>
  buildAxisOptions(revenueCategories, 60000, 'revenue', [resolveColor('primary')]),
)

const weeklyOptions = computed(() =>
  buildAxisOptions(weeklyCategories, 50, 'week', [resolveColor('success-darken-1')]),
)

const platformOptions = computed(() =>
  buildAxisOptions(platformCategories, 120, 'platform', [
    resolveColor('primary'),
    resolveColor('success-darken-1'),
  ]),
)

const previewConfig = computed(() => {
  const activeHex = resolveColor(previewColor.value)

  if (previewPreset.value === 'weekly-area') {
    return {
      apexType: 'area' as const,
      height: 280,
      title: 'Statistic this week',
      subtitle: 'Daily digital product orders · Sample data',
      summary: 'Daily orders peaked on 6 Jan at 40 orders across the 10-day sample window.',
      options: buildAxisOptions(weeklyCategories, 50, 'week', [activeHex]),
      series: weeklySeries,
      tableCaption: 'Daily digital product orders (1 Jan to 10 Jan)',
      tableColumns: ['Date', 'Orders'],
      tableRows: weeklyCategories.map((date, idx) => ({ label: date, values: [`${weeklySeries[0].data[idx]}`] })),
    }
  }

  if (previewPreset.value === 'category-donut') {
    return {
      apexType: 'donut' as const,
      height: 300,
      title: 'Top 5 digital product transactions',
      subtitle: 'Share of completed transactions · Sample data',
      summary: 'Pulsa Tri leads with 28% of transactions, followed by PLN Token at 23% and Tri Pasca Bayar at 20%.',
      options: donutOptions.value,
      series: donutSeries,
      tableCaption: 'Transaction share by digital product category',
      tableColumns: ['Category', 'Share'],
      tableRows: donutLabels.map((label, idx) => ({ label, values: [`${donutSeries[idx]}%`] })),
    }
  }

  if (previewPreset.value === 'platform-bar') {
    return {
      apexType: 'bar' as const,
      height: 280,
      title: 'Statistic order by platform',
      subtitle: 'Monthly orders across iOS and Android · Sample data',
      summary: 'iOS led in September and October, while Android surged in November (96 orders) and December (75 orders).',
      options: platformOptions.value,
      series: platformSeries,
      tableCaption: 'Monthly digital product orders by mobile platform',
      tableColumns: ['Month', 'iOS', 'Android'],
      tableRows: platformCategories.map((month, idx) => ({
        label: month,
        values: [`${platformSeries[0].data[idx]}`, `${platformSeries[1].data[idx]}`],
      })),
    }
  }

  return {
    apexType: 'bar' as const,
    height: 260,
    title: 'Total revenue',
    subtitle: 'Weekly digital product revenue · May 2025 sample data',
    summary: 'Weekly revenue climbed from 40k NTD in Week 1 to a 55k NTD peak in Week 3 before closing Week 4 at 33k NTD.',
    options: buildAxisOptions(revenueCategories, 60000, 'revenue', [activeHex]),
    series: revenueSeries,
    tableCaption: 'Weekly digital product revenue in NTD',
    tableColumns: ['Period', 'Revenue (NTD)'],
    tableRows: revenueCategories.map((week, idx) => ({
      label: week,
      values: [revenueSeries[0].data[idx].toLocaleString('en-US')],
    })),
  }
})

const usage = computed(() => {
  if (previewPreset.value === 'category-donut') {
    return `<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { useTheme } from 'vuetify'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))
const theme = useTheme()
const reducedMotion = usePreferredReducedMotion()

const series = [28, 23, 20, 16, 13]
const options = computed(() => ({
  chart: {
    fontFamily: 'Poppins, sans-serif',
    animations: { enabled: reducedMotion.value !== 'reduce', speed: 250 },
  },
  labels: ['Pulsa Tri', 'PLN Token', 'Tri Pasca Bayar', 'PDAM', 'BPJS Kesehatan'],
  colors: ['primary', 'success', 'info', 'warning', 'secondary'].map(
    token => theme.current.value.colors[token],
  ),
  dataLabels: { enabled: false },
  stroke: { width: 0 },
  legend: { position: 'bottom', labels: { colors: theme.current.value.colors['on-surface'] } },
}))
<\/script>

<template>
  <figure class="ma-0">
    <ClientOnly>
      <VueApexCharts type="donut" height="300" :options="options" :series="series" />
      <template #fallback>
        <VSkeletonLoader type="image" height="300" />
      </template>
    </ClientOnly>
    <figcaption class="text-body-2 text-medium-emphasis mt-2">
      Pulsa Tri accounts for 28% of sample digital product transactions.
    </figcaption>
  </figure>
</template>`
  }

  const apexType = previewPreset.value === 'weekly-area' ? 'area' : 'bar'
  const colorKey = previewPreset.value === 'platform-bar' ? 'primary' : previewColor.value

  return `<script setup lang="ts">
import { usePreferredReducedMotion } from '@vueuse/core'
import { useTheme } from 'vuetify'

const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))
const theme = useTheme()
const reducedMotion = usePreferredReducedMotion()

const series = [{ name: 'Revenue', data: [40000, 50000, 55000, 33000] }]
const options = computed(() => ({
  chart: {
    toolbar: { show: false },
    fontFamily: 'Poppins, sans-serif',
    foreColor: theme.current.value.colors['on-surface'],
    animations: { enabled: reducedMotion.value !== 'reduce', easing: 'easeout', speed: 250 },
  },
  colors: [theme.current.value.colors.${colorKey}],
  plotOptions: { bar: { columnWidth: '22%', borderRadius: 7, borderRadiusApplication: 'end' } },
  dataLabels: { enabled: false },
  xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], axisBorder: { show: false }, axisTicks: { show: false } },
  tooltip: { theme: theme.current.value.dark ? 'dark' : 'light' },
}))
<\/script>

<template>
  <figure class="ma-0">
    <ClientOnly>
      <VueApexCharts type="${apexType}" height="260" :options="options" :series="series" />
      <template #fallback>
        <VSkeletonLoader type="image" height="260" />
      </template>
    </ClientOnly>
    <figcaption class="text-body-2 text-medium-emphasis mt-2">
      Weekly sample revenue peaked at 55,000 NTD in Week 3.
    </figcaption>
  </figure>
</template>`
})

const api = [
  { name: 'type', type: "'bar' | 'area' | 'line' | 'donut'", description: 'Selects the ApexCharts visualization type rendered inside ClientOnly.' },
  { name: 'series', type: 'ApexAxisChartSeries | number[]', description: 'Named data arrays for axis charts (bar, area) or numeric shares for donut charts.' },
  { name: 'options', type: 'ApexOptions', description: 'Reactive Vuetify theme configuration: Poppins font, semantic colors, dashed grid, axis formatters, and tooltip theme.' },
  { name: 'height', type: 'number | string', description: 'Explicit chart height in pixels, matched by the ClientOnly fallback container to prevent layout shift.' },
  { name: 'options.chart.animations', type: 'object', description: 'Disables chart motion when usePreferredReducedMotion() equals reduce; otherwise uses 250ms easeout.' },
]

const accessibility = [
  'Wrap charts in <figure> with a concise <figcaption> (or aria-describedby) summarizing the main trend so insights do not depend on SVG visuals alone.',
  'Offer a semantic <table> alternative with <caption> and <th scope="col"> / <th scope="row"> for screen-reader and keyboard users.',
  'Pair series colors with visible legends, axis labels, and tooltips so multi-series charts never rely on color alone.',
  'Disable chart animations when prefers-reduced-motion: reduce is active while preserving the final rendered data state.',
  'Render vue3-apexcharts inside <ClientOnly> with a fixed-height #fallback placeholder to avoid SSR window errors and layout shift.',
]
</script>

<template>
  <BaseComponentDoc
    title="Chart"
    description="Visualize revenue, order trends, category breakdowns, and platform comparisons with theme-aware ApexCharts."
    component-name="VueApexCharts / ClientOnly"
    source="pages/page-template/digital-dashboard.vue; components/VueApexCharts.client.vue"
    overview="Charts reuse the Digital Product Dashboard ApexCharts patterns: Poppins labels, active light/dark Vuetify semantic tokens, ClientOnly hydration fallbacks, and reduced-motion support."
    :usage="usage"
    :api="api"
    :accessibility="accessibility"
  >
    <template #preview>
      <div class="preview-controls mb-6">
        <VSelect
          v-model="previewPreset"
          label="Chart pattern"
          :items="presetOptions"
          item-title="title"
          item-value="value"
          hide-details
        />
        <VSelect
          v-model="previewColor"
          label="Series color token"
          :items="colorOptions"
          :disabled="!isSingleSeriesPreset"
          hide-details
        />
        <VSwitch
          v-model="showDataTable"
          label="Show data table alternative"
          color="primary"
          hide-details
        />
      </div>

      <VCard variant="outlined" :elevation="0" class="bg-surface">
        <VCardText class="pa-6">
          <div class="d-flex align-start justify-space-between flex-wrap gap-3 mb-4">
            <div>
              <h3 class="text-h6 mb-1">{{ previewConfig.title }}</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ previewConfig.subtitle }}</p>
            </div>
            <div v-if="previewPreset === 'platform-bar'" class="d-flex align-center gap-3 text-body-2">
              <span class="d-inline-flex align-center gap-2"><span class="legend-dot bg-primary" aria-hidden="true" />iOS</span>
              <span class="d-inline-flex align-center gap-2"><span class="legend-dot bg-success" aria-hidden="true" />Android</span>
            </div>
            <VChip v-else size="small" color="primary" variant="tonal">Sample data</VChip>
          </div>

          <figure class="ma-0">
            <ClientOnly>
              <VueApexCharts
                :key="`${previewPreset}-${previewColor}`"
                :type="previewConfig.apexType"
                :height="previewConfig.height"
                :options="previewConfig.options"
                :series="previewConfig.series"
              />
              <template #fallback>
                <div class="chart-fallback d-flex align-center justify-center" :style="{ blockSize: `${previewConfig.height}px` }">
                  <VSkeletonLoader type="image" class="w-100 h-100" />
                </div>
              </template>
            </ClientOnly>
            <figcaption class="text-body-2 text-medium-emphasis mt-3">
              {{ previewConfig.summary }}
            </figcaption>
          </figure>

          <VTable v-if="showDataTable" density="compact" class="border rounded mt-4">
            <caption class="sr-only">{{ previewConfig.tableCaption }}</caption>
            <thead>
              <tr>
                <th v-for="col in previewConfig.tableColumns" :key="col" scope="col">{{ col }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in previewConfig.tableRows" :key="row.label">
                <th scope="row" class="font-weight-medium">{{ row.label }}</th>
                <td v-for="(val, idx) in row.values" :key="idx">{{ val }}</td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
      </VCard>
    </template>

    <template #variants>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Four chart compositions used on the Digital Product Dashboard, wired to active Vuetify semantic colors.
      </p>
      <VRow>
        <VCol cols="12" md="6">
          <VCard variant="outlined" :elevation="0" class="bg-surface" height="100%">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-3">
                <div>
                  <h3 class="text-h6 mb-1">Total revenue</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Single-series vertical bar · May 2025</p>
                </div>
                <span class="text-h6 font-weight-medium">NTD 25,980</span>
              </div>
              <figure class="ma-0">
                <ClientOnly>
                  <VueApexCharts type="bar" height="240" :options="revenueOptions" :series="revenueSeries" />
                  <template #fallback>
                    <div class="chart-fallback" style="block-size: 240px;"><VSkeletonLoader type="image" class="w-100 h-100" /></div>
                  </template>
                </ClientOnly>
                <figcaption class="text-caption text-medium-emphasis mt-2">
                  Rounded top columns (`borderRadius: 7`) with thousand-unit Y-axis labels.
                </figcaption>
              </figure>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard variant="outlined" :elevation="0" class="bg-surface" height="100%">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-3">
                <div>
                  <h3 class="text-h6 mb-1">Statistic this week</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Smooth area trend · 40 peak orders</p>
                </div>
                <VChip size="small" variant="outlined">
                  <span class="legend-dot bg-success me-2" aria-hidden="true" />Order
                </VChip>
              </div>
              <figure class="ma-0">
                <ClientOnly>
                  <VueApexCharts type="area" height="240" :options="weeklyOptions" :series="weeklySeries" />
                  <template #fallback>
                    <div class="chart-fallback" style="block-size: 240px;"><VSkeletonLoader type="image" class="w-100 h-100" /></div>
                  </template>
                </ClientOnly>
                <figcaption class="text-caption text-medium-emphasis mt-2">
                  Smooth 2px stroke with subtle tonal fill (`opacity: 0.12`) for continuous series.
                </figcaption>
              </figure>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard variant="outlined" :elevation="0" class="bg-surface" height="100%">
            <VCardText class="pa-6">
              <h3 class="text-h6 mb-1">Top 5 digital product transactions</h3>
              <p class="text-body-2 text-medium-emphasis mb-3">Donut share · Semantic palette</p>
              <figure class="ma-0">
                <ClientOnly>
                  <VueApexCharts type="donut" height="280" :options="donutOptions" :series="donutSeries" />
                  <template #fallback>
                    <div class="chart-fallback" style="block-size: 280px;"><VSkeletonLoader type="image" class="w-100 h-100" /></div>
                  </template>
                </ClientOnly>
                <figcaption class="text-caption text-medium-emphasis mt-2">
                  Uses `primary`, `success`, `info`, `warning`, and `secondary` tokens with a bottom legend.
                </figcaption>
              </figure>
            </VCardText>
          </VCard>
        </VCol>

        <VCol cols="12" md="6">
          <VCard variant="outlined" :elevation="0" class="bg-surface" height="100%">
            <VCardText class="pa-6">
              <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-3">
                <div>
                  <h3 class="text-h6 mb-1">Statistic order by platform</h3>
                  <p class="text-body-2 text-medium-emphasis mb-0">Grouped comparison bar · Sep–Dec</p>
                </div>
                <div class="d-flex align-center gap-3 text-body-2">
                  <span class="d-inline-flex align-center gap-2"><span class="legend-dot bg-primary" aria-hidden="true" />iOS</span>
                  <span class="d-inline-flex align-center gap-2"><span class="legend-dot bg-success" aria-hidden="true" />Android</span>
                </div>
              </div>
              <figure class="ma-0">
                <ClientOnly>
                  <VueApexCharts type="bar" height="240" :options="platformOptions" :series="platformSeries" />
                  <template #fallback>
                    <div class="chart-fallback" style="block-size: 240px;"><VSkeletonLoader type="image" class="w-100 h-100" /></div>
                  </template>
                </ClientOnly>
                <figcaption class="text-caption text-medium-emphasis mt-2">
                  Pairs side-by-side columns (`columnWidth: 35%`) with an explicit header legend.
                </figcaption>
              </figure>
            </VCardText>
          </VCard>
        </VCol>
      </VRow>
    </template>

    <template #states>
      <div class="d-flex flex-wrap align-center gap-3 mb-6" role="group" aria-label="Chart state demo">
        <VBtn
          v-for="stateOption in (['ready', 'loading', 'empty', 'error'] as const)"
          :key="stateOption"
          size="small"
          :variant="demoState === stateOption ? 'flat' : 'outlined'"
          :color="demoState === stateOption ? 'primary' : 'secondary'"
          @click="demoState = stateOption"
        >
          {{ stateOption.charAt(0).toUpperCase() + stateOption.slice(1) }}
        </VBtn>
      </div>

      <VCard variant="outlined" :elevation="0" class="bg-surface">
        <VCardText class="pa-6">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <div>
              <h3 class="text-h6 mb-1">Monthly order volume</h3>
              <p class="text-body-2 text-medium-emphasis mb-0">Keep container height stable across loading, empty, and error states.</p>
            </div>
            <VChip size="small" :color="demoState === 'error' ? 'error' : demoState === 'ready' ? 'success' : 'secondary'" variant="tonal">
              {{ demoState }}
            </VChip>
          </div>

          <div v-if="demoState === 'loading'" class="state-stage d-flex flex-column justify-center gap-4">
            <VSkeletonLoader type="image" height="200" />
            <p class="text-body-2 text-medium-emphasis text-center mb-0">Loading chart series...</p>
          </div>

          <div v-else-if="demoState === 'empty'" class="state-stage d-flex flex-column align-center justify-center text-center pa-6 border rounded bg-background">
            <VAvatar color="secondary" variant="tonal" size="40" class="mb-3" aria-hidden="true">
              <VIcon icon="ri-bar-chart-box-line" size="20" />
            </VAvatar>
            <p class="text-body-1 font-weight-medium mb-1">No orders recorded for this period</p>
            <p class="text-body-2 text-medium-emphasis mb-4">Select a wider date range or load the sample dataset.</p>
            <VBtn size="small" variant="outlined" color="primary" @click="demoState = 'ready'">
              Load sample data
            </VBtn>
          </div>

          <div v-else-if="demoState === 'error'" class="state-stage d-flex flex-column justify-center gap-4">
            <VAlert type="error" variant="tonal">
              Could not load transaction metrics. Check your connection and try again.
            </VAlert>
            <div>
              <VBtn size="small" color="primary" prepend-icon="ri-refresh-line" @click="demoState = 'ready'">
                Retry
              </VBtn>
            </div>
          </div>

          <ClientOnly v-else>
            <VueApexCharts type="bar" height="240" :options="revenueOptions" :series="revenueSeries" />
            <template #fallback>
              <div class="chart-fallback" style="block-size: 240px;"><VSkeletonLoader type="image" class="w-100 h-100" /></div>
            </template>
          </ClientOnly>
        </VCardText>
      </VCard>
    </template>
  </BaseComponentDoc>
</template>

<style scoped>
.preview-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: center;
}

.legend-dot {
  display: inline-block;
  inline-size: 8px;
  block-size: 8px;
  border-radius: 50%;
}

.chart-fallback {
  overflow: hidden;
  border-radius: 8px;
}

.state-stage {
  min-block-size: 240px;
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
