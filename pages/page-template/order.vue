<script setup lang="ts">
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'
import OrderDetail from '@/components/order/OrderDetail.vue'
import { getOrderPayment } from '@/utils/orderPayment'

definePageMeta({ sidebarRoute: 'page-template-order' })
useHead({ title: 'Order template' })

const tabs = ['Semua', 'Waiting Confirmation', 'In Process', 'Shipped', 'Finished', 'Cancelled', 'Return']
const activeTab = ref('Semua')
const search = ref('')
const searchBy = ref('Order ID')
const payment = ref<string | null>(null)
const platform = ref<string | null>(null)
const date = ref('')
const page = ref(1)
const pageSize = ref(10)
const route = useRoute()
const router = useRouter()

const seedOrders = [
  { name: 'Cristofer Geidt', avatar: 'cristofer.png', platform: 'iOS', payment: 'Bank Mandiri', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: true, warning: false },
  { name: 'Maren Geidt', avatar: 'maren.png', platform: 'Android', payment: 'Cash on Delivery', image: 'popcorn.png', product: 'Popcorn seasoning', variant: '', extra: false, warning: false },
  { name: 'Kierra Culhane', avatar: 'kierra.png', platform: 'Android', payment: 'Bank Mandiri', image: 'popcorn.png', product: 'Popcorn seasoning', variant: 'Hitam, 200 ml', extra: false, warning: true },
  { name: 'Alya Putri', avatar: 'maren.png', platform: 'iOS', payment: 'Bank Mandiri', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: false, warning: false },
  { name: 'Budi Santoso', avatar: 'cristofer.png', platform: 'Android', payment: 'Cash on Delivery', image: 'popcorn.png', product: 'Popcorn seasoning', variant: '', extra: false, warning: false },
  { name: 'Citra Dewi', avatar: 'kierra.png', platform: 'iOS', payment: 'Bank Mandiri', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: true, warning: true },
  { name: 'Dimas Pratama', avatar: 'cristofer.png', platform: 'Android', payment: 'Bank Mandiri', image: 'popcorn.png', product: 'Popcorn seasoning', variant: 'Hitam, 200 ml', extra: false, warning: false },
  { name: 'Eka Lestari', avatar: 'maren.png', platform: 'iOS', payment: 'Cash on Delivery', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: false, warning: false },
  { name: 'Farhan Akbar', avatar: 'cristofer.png', platform: 'Android', payment: 'Bank Mandiri', image: 'popcorn.png', product: 'Popcorn seasoning', variant: '', extra: false, warning: true },
  { name: 'Gita Permata', avatar: 'kierra.png', platform: 'iOS', payment: 'Bank Mandiri', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: true, warning: false },
  { name: 'Hendra Wijaya', avatar: 'cristofer.png', platform: 'Android', payment: 'Cash on Delivery', image: 'popcorn.png', product: 'Popcorn seasoning', variant: 'Hitam, 200 ml', extra: false, warning: false },
  { name: 'Intan Maharani', avatar: 'maren.png', platform: 'iOS', payment: 'Bank Mandiri', image: 'backpack.png', product: 'IRIS 2.0 Backpack', variant: 'Green Sage', extra: false, warning: false },
]
const statuses = ['Waiting Confirmation', 'Waiting Payment', 'Payment Success', 'In Process', 'Shipped', 'Finished', 'Cancelled', 'Return', 'Waiting Approval Admin', 'Proof Declined'] as const
type OrderStatus = typeof statuses[number]
const orders = useState('materio-order-template-v1', () => seedOrders.map((order, index) => ({
  ...order,
  warning: index === 1 || order.warning,
  id: `120393109${49 + index}`,
  status: statuses[index % statuses.length] as OrderStatus,
  notes: '', address: 'No. 155, Dongmen Street, East District, Hsinchu City 300',
  shipping: 20,
  history: ['Aug 24, 2024, 20:30'] as string[],
})))
function updateOrder(index: number, changes: Partial<typeof orders.value[number]>) {
  orders.value[index] = { ...orders.value[index], ...changes }
}
function statusGroup(status: OrderStatus) {
  if (['Waiting Payment', 'Proof Declined'].includes(status)) return 'Waiting Confirmation'
  if (status === 'Payment Success') return 'In Process'
  if (status === 'Waiting Approval Admin') return 'Return'
  return status
}
function statusColor(status: OrderStatus) {
  if (status === 'Cancelled' || status === 'Proof Declined') return 'error'
  if (status === 'Finished' || status === 'Payment Success') return 'success'
  if (status === 'Return' || status === 'Waiting Approval Admin') return 'warning'
  return 'info'
}
const selectedOrder = computed(() => {
  const value = route.query.detail
  if (typeof value !== 'string' || !/^\d+$/.test(value)) return null
  const index = Number(value)
  return Number.isSafeInteger(index) && index >= 0 && index < orders.value.length ? index : null
})
function openOrder(index: number) {
  router.push({ query: { ...route.query, detail: String(index) } })
}
function closeOrder() {
  const query = { ...route.query }
  delete query.detail
  router.push({ query })
}
const filtered = computed(() => orders.value.filter(order => {
  const query = (search.value || '').trim().toLowerCase()
  const searchValue = searchBy.value === 'Order ID' ? order.id : order.name.toLowerCase()
  return (activeTab.value === 'Semua' || activeTab.value === statusGroup(order.status))
    && (!query || searchValue.includes(query))
    && (!payment.value || order.payment === payment.value)
    && (!platform.value || order.platform === platform.value)
    && (!date.value || date.value === '2024-08-24')
}))
const invalidDetail = computed(() => route.query.detail !== undefined && selectedOrder.value === null)
const filtersEmpty = computed(() => !search.value && searchBy.value === 'Order ID' && !payment.value && !platform.value && !date.value)
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value))
watch([activeTab, search, searchBy, payment, platform, date, pageSize], () => { page.value = 1 })
watch(() => filtered.value.length, count => { page.value = Math.max(1, Math.min(page.value, Math.ceil(count / pageSize.value))) })
function resetFilters() {
  search.value = ''
  searchBy.value = 'Order ID'
  payment.value = null
  platform.value = null
  date.value = ''
}
</script>

<template>
  <OrderDetail v-if="selectedOrder !== null" :order="orders[selectedOrder]" :index="selectedOrder" :total="orders.length" @back="closeOrder" @navigate="openOrder" @update="updateOrder(selectedOrder!, $event)" />
  <div v-else class="order-template text-body-1">
    <UiSectionHeader title="Order list" title-class="text-h4" description="Review customer orders, payments, and fulfillment." class="mb-6"><template #actions><TemplatePrompt template="order" /></template></UiSectionHeader>
    <VAlert v-if="invalidDetail" type="warning" variant="tonal" class="mb-6">Order not found. Select an order below to view its details.<template #append><VBtn variant="text" @click="closeOrder">Dismiss</VBtn></template></VAlert>
    <VCard variant="outlined" :elevation="0" class="bg-surface">
      <div class="px-5 pt-5">
        <VTabs v-model="activeTab" class="v-tabs-bordered" aria-label="Order status">
          <VTab v-for="tab in tabs" :key="tab" :value="tab">{{ tab === 'Semua' ? 'All orders' : tab }}</VTab>
        </VTabs>
      </div>
      <div class="order-filters pa-5">
        <VSelect v-model="searchBy" :items="['Order ID', 'Customer']" aria-label="Search by" density="compact" hide-details class="search-type" />
        <VTextField v-model="search" :placeholder="searchBy === 'Order ID' ? 'Search order ID...' : 'Search customer...'" aria-label="Search orders" prepend-inner-icon="ri-search-line" density="compact" hide-details class="search-input" />
        <VSelect v-model="payment" :items="['Bank Mandiri', 'Cash on Delivery']" placeholder="Payment method" aria-label="Payment method" clearable density="compact" hide-details />
        <VSelect v-model="platform" :items="['iOS', 'Android']" placeholder="Platform" aria-label="Platform" clearable density="compact" hide-details />
        <VTextField v-model="date" type="date" aria-label="Order date" density="compact" hide-details class="date-filter" />
        <VBtn variant="text" :disabled="filtersEmpty" @click="resetFilters">Reset filters</VBtn>
      </div>
      <VDivider />
      <div class="order-list pa-5">
        <VAlert v-if="!visible.length" type="info" variant="tonal">No orders match these filters.</VAlert>
        <VCard v-for="order in visible" :key="order.id" variant="outlined" class="order-card bg-surface pa-6" :elevation="0">
          <div class="order-heading">
            <div class="customer">
              <VAvatar size="36" :image="`/images/orders/${order.avatar}`" />
              <div><div class="font-weight-medium">{{ order.name }}</div><div class="text-body-2 text-primary">+6289620447518</div></div>
            </div>
            <div class="order-meta">
              <VChip size="small" variant="outlined" color="primary" prepend-icon="ri-link">A8091S</VChip>
              <VChip size="small" :color="statusColor(order.status)" variant="tonal">{{ order.status }}</VChip>
              <VChip size="small" variant="tonal">{{ order.platform }}</VChip>
              <span class="text-body-2 text-medium-emphasis">• &nbsp;Aug 24, 2024, 20:30</span>
            </div>
            <div class="order-numbers"><VChip size="small" color="secondary" variant="tonal">Order no. {{ order.id }}</VChip><VChip size="small" color="secondary" variant="tonal">SO No. 204914</VChip></div>
          </div>
          <VDivider class="my-5" />
          <div class="order-content">
            <div class="products">
              <div class="product"><VImg :src="`/images/orders/${order.image}`" width="56" height="56" cover class="product-image" /><div><div class="font-weight-medium">{{ order.product }}</div><div class="text-body-2 text-medium-emphasis">Internal Reference / SKU : 01902323</div><div v-if="order.variant" class="text-body-2 text-medium-emphasis">Variant : {{ order.variant }}</div><div class="text-body-2 text-medium-emphasis">x1 • NTD 150</div></div></div>
              <template v-if="order.extra"><div class="product"><VImg src="/images/orders/addon.png" width="56" height="56" cover class="product-image" /><div><div class="font-weight-medium"><span class="text-primary">(Add-ons)</span> Kiera Mini Backpack Dusty Pink</div><div class="text-body-2 text-medium-emphasis">Internal Reference / SKU : 01902323</div><div class="text-body-2 text-medium-emphasis">Variant : Lavender</div><div class="text-body-2 text-medium-emphasis">x2 • NTD 150</div></div></div></template>
            </div>
            <div class="order-column"><div class="text-body-2 font-weight-medium">Payment method</div><div class="mt-1">{{ order.payment }}</div><div v-if="order.payment === 'Bank Mandiri'" class="text-body-2 text-medium-emphasis mt-1">Manual Transfer</div></div>
            <div class="order-column"><div class="text-body-2 text-medium-emphasis">Total Price</div><div class="text-h5 mt-1">NTD {{ getOrderPayment(order).total }}</div></div>
            <div class="order-column order-actions"><VBtn variant="outlined" prepend-icon="ri-chat-3-line" disabled>Chat customer</VBtn><VBtn variant="outlined" prepend-icon="ri-eye-line" @click="openOrder(orders.indexOf(order))">See details</VBtn></div>
          </div>
          <VAlert v-if="order.warning && order.status === 'Waiting Payment'" type="warning" variant="tonal" class="mt-5">The customer uploaded payment proof. Admin verification is required.</VAlert>
        </VCard>
      </div>
      <p class="text-body-2 text-medium-emphasis px-5 pb-5 mb-0">Demo orders are kept for this app session. Customer chat requires a connected service.</p>
      <VDivider />
      <nav class="order-footer px-4 py-2 text-body-2" aria-label="Order pagination">
        <div class="order-page-size">
          <span>Rows per page:</span>
          <VSelect v-model="pageSize" :items="[5, 10, 20]" aria-label="Rows per page" variant="plain" density="compact" hide-details class="page-size" />
        </div>
        <span class="order-page-range" role="status">{{ filtered.length ? (page - 1) * pageSize + 1 : 0 }}–{{ Math.min(page * pageSize, filtered.length) }} of {{ filtered.length }}</span>
        <div class="order-page-actions">
          <VBtn icon="ri-arrow-left-s-line" color="secondary" variant="text" size="small" aria-label="Previous page" :disabled="page <= 1" @click="page--" />
          <VBtn icon="ri-arrow-right-s-line" color="secondary" variant="text" size="small" aria-label="Next page" :disabled="page * pageSize >= filtered.length" @click="page++" />
        </div>
      </nav>
    </VCard>
  </div>
</template>

<style scoped>
.order-filters { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.order-filters > :deep(.v-input) { flex: 1 1 0; min-inline-size: 160px; }
.order-filters .search-type { flex: 0 0 120px; }
.date-filter :deep(input[type="date"]) { position: relative; inline-size: 100%; padding-inline-end: 40px; }
.date-filter :deep(input::-webkit-calendar-picker-indicator) { position: absolute; inset-inline-end: 16px; margin: 0; }
.order-list { display: grid; gap: 24px; }
.order-card { border-radius: 12px; }
.order-heading, .customer, .order-meta, .order-numbers { display: flex; align-items: center; gap: 8px; }
.order-heading { gap: 16px; flex-wrap: wrap; }
.order-meta { flex: 1; flex-wrap: wrap; }
.order-numbers { flex-wrap: wrap; }
.order-content { display: grid; grid-template-columns: minmax(240px, 2fr) repeat(2, minmax(110px, 1fr)) minmax(170px, 1fr); gap: 24px; }
.products { display: grid; gap: 12px; align-content: start; }
.product { display: flex; gap: 12px; min-inline-size: 0; overflow-wrap: anywhere; }
.product > div { min-inline-size: 0; }
.product-image { flex: 0 0 56px; border-radius: 8px; }
.order-column { border-inline-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); padding-inline-start: 24px; }
.order-actions { display: flex; flex-direction: column; gap: 16px; }
.order-footer, .order-page-size, .order-page-actions { display: flex; align-items: center; }
.order-footer { justify-content: flex-end; gap: 24px; color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)); }
.order-page-size { gap: 8px; white-space: nowrap; }
.page-size { flex: 0 0 56px; }
.page-size :deep(.v-field__input) { min-height: 40px; padding-block: 0; align-items: center; }
.order-page-range { white-space: nowrap; }
.order-page-actions { gap: 8px; }
@media (max-width: 1279px) { .order-filters { flex-wrap: wrap; } .order-content { grid-template-columns: repeat(2, minmax(0, 1fr)); } .order-column { padding-inline-start: 16px; } }
@media (max-width: 600px) { .order-content { grid-template-columns: 1fr; gap: 16px; } .order-column { border: 0; padding: 0; } .order-actions { align-items: flex-start; } .order-footer { flex-wrap: wrap; gap: 12px; } .order-filters > :deep(.v-input), .order-filters .search-type { flex: 1 1 100%; min-inline-size: 0; } }
</style>


