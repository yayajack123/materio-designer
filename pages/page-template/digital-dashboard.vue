<script setup lang="ts">
import UiTableView from '@/components/ui/UiTableView.vue'
import { usePreferredReducedMotion } from '@vueuse/core'
import { useTheme } from 'vuetify'
const VueApexCharts = defineAsyncComponent(() => import('vue3-apexcharts'))
import avatar1 from '@/assets/images/dashboard/1814b.png'
import avatar2 from '@/assets/images/dashboard/1a549.png'
import avatar3 from '@/assets/images/dashboard/daff3.png'
import avatar4 from '@/assets/images/dashboard/a1fed.png'
import avatar5 from '@/assets/images/dashboard/cf54d.png'
import bca from '@/assets/images/digital-dashboard/3fdb9.svg?url'
import okMart from '@/assets/images/digital-dashboard/56f2a.png'
import sevenEleven from '@/assets/images/digital-dashboard/0d922.png'
import hiLife from '@/assets/images/digital-dashboard/cf67e.png'
import familyMart from '@/assets/images/digital-dashboard/dbe48.png'

definePageMeta({ sidebarRoute: 'page-template-digital-dashboard' })
useHead({ title: 'Digital product dashboard' })

const theme = useTheme()
const reducedMotion = usePreferredReducedMotion()
const period = ref('Monthly')
const chartOptions = (labels: string[], max: number, type: 'revenue' | 'week' | 'platform') => ({
  chart: { toolbar: { show: false }, fontFamily: 'Poppins, sans-serif', foreColor: theme.current.value.colors['on-surface'], animations: { enabled: reducedMotion.value !== 'reduce', easing: 'easeout', speed: 250, animateGradually: { enabled: false }, dynamicAnimation: { enabled: false } } },
  colors: type === 'week' ? [theme.current.value.colors['success-darken-1']] : [theme.current.value.colors.primary, theme.current.value.colors['success-darken-1']],
  plotOptions: { bar: { columnWidth: type === 'platform' ? '35%' : '12%', borderRadius: 7, borderRadiusApplication: 'end' } },
  stroke: { curve: 'smooth', width: type === 'week' ? 2 : 0 },
  fill: { opacity: type === 'week' ? 0.1 : 1 },
  markers: { size: type === 'week' ? 3 : 0 },
  dataLabels: { enabled: false }, legend: { show: false },
  grid: { borderColor: `rgba(${theme.current.value.dark ? '231, 227, 252' : '46, 38, 61'}, 0.12)`, strokeDashArray: 5 },
  xaxis: { categories: labels, axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { min: 0, max, tickAmount: type === 'week' ? 5 : 6, labels: { formatter: (value: number) => type === 'revenue' ? `${Math.round(value / 1000)}k` : `${Math.round(value)}` } },
  tooltip: { theme: theme.current.value.dark ? 'dark' : 'light' },
})
const donutOptions = computed(() => ({
  chart: { fontFamily: 'Poppins, sans-serif', animations: { enabled: reducedMotion.value !== 'reduce', speed: 250, animateGradually: { enabled: false }, dynamicAnimation: { enabled: false } } },
  labels: ['Pulsa Tri', 'PLN Token', 'Tri Pasca Bayar', 'PDAM', 'BPJS Kesehatan'],
  colors: ['primary', 'success', 'info', 'warning', 'secondary'].map(color => theme.current.value.colors[color]),
  dataLabels: { enabled: false }, stroke: { width: 0 },
  legend: { position: 'bottom', labels: { colors: theme.current.value.colors['on-surface'] } },
}))
const statuses = [{ label: 'Waiting Payment', value: 20, icon: 'ri-bank-card-2-line', color: 'warning' }, { label: 'In Process', value: 13, icon: 'ri-loader-2-line', color: 'info' }, { label: 'Completed', value: 42, icon: 'ri-check-line', color: 'success' }, { label: 'Cancelled', value: 27, icon: 'ri-close-line', color: 'error' }]
const methods = [{ name: 'BCA', description: 'Manual Transfer', count: 400, image: bca }, { name: 'OK Mart', description: 'Convenience Store', count: 320, image: okMart }, { name: '7-11', description: 'Convenience Store', count: 200, image: sevenEleven }, { name: 'HiLife', description: 'Convenience Store', count: 20, image: hiLife }, { name: 'Family Mart', description: 'Convenience Store', count: 10, image: familyMart }]
const orders = [{ id: '#4910', name: 'Jordan Stevenson', role: 'Customer', product: 'Pulsa Tri / 5rb', avatar: avatar1 }, { id: '#4909', name: 'Richard Payne', role: 'Reseller', product: 'PLN Token', avatar: avatar2 }, { id: '#4908', name: 'Jennifer Summers', role: 'Distributor', product: 'BPJS Kesehatan', avatar: avatar3 }, { id: '#4907', name: 'Mr. Justin Richardson', role: 'Customer', product: 'Pulsa Tri / 5rb', avatar: avatar4 }, { id: '#4906', name: 'Nicholas Tanner', role: 'Customer', product: 'Pulsa Tri / 5rb', avatar: avatar5 }].map(order => ({ ...order, total: 'NTD 250' }))
const headers = [{ title: '# ID', key: 'id' }, { title: 'Customer', key: 'name' }, { title: 'Products', key: 'product' }, { title: 'Total', key: 'total' }]
</script>

<template>
  <main class="digital-dashboard">
    <VAlert type="info" variant="tonal">Dashboard uses sample data.</VAlert>
    <div class="dashboard-heading"><div><h1 class="text-h4">Digital Product Dashboard</h1><p class="text-body-1 text-medium-emphasis">Track your order summary of digital product</p></div><div class="d-flex align-center flex-wrap gap-3"><TemplatePrompt template="dashboard" /><VSelect v-model="period" :items="['Monthly']" aria-label="Reporting period" density="compact" hide-details class="period-select" /></div></div>
    <VRow><VCol cols="12" md="8"><VCard class="bg-surface" :elevation="0" height="100%"><VCardTitle>Total revenue</VCardTitle><VCardText><ClientOnly><VueApexCharts type="bar" height="254" :options="chartOptions(['Week 1', 'Week 2', 'Week 3', 'Week 4'], 60000, 'revenue')" :series="[{ name: 'Revenue', data: [40000, 50000, 55000, 33000] }]" /></ClientOnly></VCardText></VCard></VCol><VCol cols="12" md="4"><div class="summary-stack"><VCard class="bg-surface" :elevation="0"><VCardText><h2 class="text-h5">Total Revenue</h2><p class="text-body-1 text-medium-emphasis mt-1">May 2025</p><div class="text-h4 mt-3">Rp 13,862,026</div><p class="text-body-1 text-medium-emphasis">NTD 25,980</p></VCardText></VCard><VCard class="bg-surface" :elevation="0"><VCardText><h2 class="text-h5">Total Orders</h2><p class="text-body-1 text-medium-emphasis mt-1">Calculated in May 2025</p><div class="text-h4 mt-5">200</div></VCardText></VCard></div></VCol></VRow>
    <VRow><VCol v-for="stat in statuses" :key="stat.label" cols="6" md="3"><VCard :elevation="0" class="status-card bg-surface" :class="`status-card--${stat.color}`"><VCardText><div class="d-flex align-center gap-4"><VAvatar :color="stat.color" variant="tonal" rounded="sm" size="40"><VIcon :icon="stat.icon" /></VAvatar><span class="text-h4">{{ stat.value }}</span></div><p class="text-body-1 mt-2">{{ stat.label }}</p></VCardText></VCard></VCol></VRow>
    <VRow><VCol cols="12" md="6"><VCard class="bg-surface" :elevation="0" height="100%"><VCardText><h2 class="text-h5">Statistic this week</h2><p class="text-body-2 text-medium-emphasis">Total number of order : 40 Order</p><ClientOnly><VueApexCharts type="area" height="280" :options="chartOptions(['1 Jan', '2 Jan', '3 Jan', '4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan'], 50, 'week')" :series="[{ name: 'Order', data: [23, 27, 24, 28, 29, 40, 33, 32, 24, 29] }]" /></ClientOnly><VChip size="small" variant="outlined"><span class="legend-dot bg-success me-2" />Order</VChip></VCardText></VCard></VCol><VCol cols="12" md="6"><VCard class="bg-surface" :elevation="0" height="100%"><VCardText><h2 class="text-h5">Top 5 Digital Product Transaction</h2><ClientOnly><VueApexCharts type="donut" height="310" :options="donutOptions" :series="[28, 23, 20, 16, 13]" /></ClientOnly></VCardText></VCard></VCol></VRow>
    <VRow><VCol cols="12" md="6"><VCard class="bg-surface" :elevation="0" height="100%"><VCardText><h2 class="text-h5 mb-5">Total Order by payment method</h2><div class="payment-list"><div v-for="method in methods" :key="method.name" class="payment-row"><div class="payment-logo"><img :src="method.image" :alt="method.name"></div><div class="flex-grow-1"><div>{{ method.name }}</div><div class="text-body-2 text-medium-emphasis">{{ method.description }}</div></div><span>{{ method.count }}</span></div></div></VCardText></VCard></VCol><VCol cols="12" md="6"><VCard class="bg-surface" :elevation="0" height="100%"><VCardText><div class="chart-heading"><h2 class="text-h5">Statistic order by platform</h2><span class="text-body-2"><span class="legend-dot bg-primary" /> iOS <span class="legend-dot bg-success ms-2" /> Android</span></div><ClientOnly><VueApexCharts type="bar" height="280" :options="chartOptions(['Sep', 'Oct', 'Nov', 'Dec'], 120, 'platform')" :series="[{ name: 'iOS', data: [74, 59, 46, 46] }, { name: 'Android', data: [58, 43, 96, 75] }]" /></ClientOnly></VCardText></VCard></VCol></VRow>
    <UiTableView title="" :headers="headers" :items="orders" :items-per-page="5" hide-filters hide-pagination><template #table-content><div class="table-heading"><h2 class="text-h5">Latest Order</h2></div><VDataTable :headers="headers" :items="orders" :items-per-page="5" hide-default-footer class="text-no-wrap"><template #item.id="{ item }"><span class="text-primary">{{ item.id }}</span></template><template #item.name="{ item }"><div class="d-flex align-center gap-3 py-2"><VAvatar :image="item.avatar" size="34" /><div>{{ item.name }}<div class="text-body-2 text-medium-emphasis">{{ item.role }}</div></div></div></template></VDataTable></template></UiTableView>
  </main>
</template>

<style scoped lang="scss">
.digital-dashboard { display: flex; flex-direction: column; gap: 24px; }
.digital-dashboard > :deep(.v-row + .v-row) { margin-block-start: -12px; }
.digital-dashboard p { margin: 0; }
.dashboard-heading, .chart-heading, .table-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.period-select { max-inline-size: 200px; min-inline-size: 160px; }
.summary-stack { display: flex; flex-direction: column; gap: 24px; height: 100%; }
.summary-stack > * { flex: 1; }
.status-card { border-block-end: 2px solid rgb(var(--v-theme-primary)); }
.status-card--warning { border-color: rgb(var(--v-theme-warning)); }
.status-card--info { border-color: rgb(var(--v-theme-info)); }
.status-card--success { border-color: rgb(var(--v-theme-success)); }
.status-card--error { border-color: rgb(var(--v-theme-error)); }
.legend-dot { display: inline-block; inline-size: 8px; block-size: 8px; border-radius: 50%; }
.payment-list { display: flex; flex-direction: column; gap: 16px; }
.payment-row { display: flex; align-items: center; gap: 16px; min-block-size: 48px; }
.payment-logo { display: grid; place-items: center; flex: 0 0 48px; block-size: 40px; padding: 4px; border: 1px solid rgba(var(--v-theme-on-surface), .12); border-radius: 4px; background: rgb(var(--v-theme-surface)); }
.payment-logo img { max-inline-size: 100%; max-block-size: 100%; object-fit: contain; }
.table-heading { padding: 20px; }
@media (max-width: 600px) { .period-select { max-inline-size: none; } }
</style>
