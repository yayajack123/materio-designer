<script setup lang="ts">
import UiTableView from '@/components/ui/UiTableView.vue'
import { getOrderPayment } from '@/utils/orderPayment'
const props = defineProps<{
  order: { name: string; avatar: string; platform: string; payment: string; image: string; product: string; variant: string; extra: boolean; warning: boolean; id: string; status: string; notes: string; address: string; shipping: number; history: string[] }
  index: number
  total: number
}>()
const emit = defineEmits<{ back: []; navigate: [index: number]; update: [changes: any] }>()

watch(() => props.order.id, () => { dialog.value = ''; feedback.value = '' })
const dialog = ref('')
const input = ref('')
const feedback = ref('')
let dialogTrigger: HTMLElement | null = null
const nextStatus: Record<string, string> = { 'Waiting Confirmation': 'Waiting Payment', 'Waiting Payment': 'Payment Success', 'Proof Declined': 'Payment Success', 'Payment Success': 'In Process', 'In Process': 'Shipped', Shipped: 'Finished', 'Waiting Approval Admin': 'Return' }
const nextLabel: Record<string, string> = { 'Waiting Confirmation': 'Confirm order', 'Waiting Payment': 'Verify payment', 'Proof Declined': 'Verify payment', 'Payment Success': 'Process order', 'In Process': 'Ship order', Shipped: 'Complete order', 'Waiting Approval Admin': 'Approve return' }
const statusSteps: Record<string, number> = { 'Waiting Confirmation': 0, 'Waiting Payment': 1, 'Proof Declined': 1, 'Payment Success': 2, 'In Process': 2, Shipped: 3, Finished: 4, Return: 4, 'Waiting Approval Admin': 4, Cancelled: 0 }
const stepIndex = computed(() => statusSteps[props.order.status] ?? 0)
const statusColor = computed(() => ['Cancelled', 'Proof Declined'].includes(props.order.status) ? 'error' : ['Finished', 'Payment Success'].includes(props.order.status) ? 'success' : ['Return', 'Waiting Approval Admin'].includes(props.order.status) ? 'warning' : 'info')
function openDialog(type: string) {
  dialogTrigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
  dialog.value = type
  input.value = type === 'notes' ? props.order.notes : type === 'address' ? props.order.address : type === 'shipping' ? String(props.order.shipping) : ''
}
function restoreDialogFocus() {
  if (dialogTrigger?.isConnected) dialogTrigger.focus()
}
function changeStatus(status: string) {
  const history = Array.from({ length: 5 }, (_, index) => props.order.history[index] || '')
  const step = statusSteps[status] ?? 0
  if (!history[step]) history[step] = new Date().toLocaleString('en-GB')
  emit('update', { status, history })
  feedback.value = `Demo order status updated to ${status}.`
  dialog.value = ''
}
function saveDialog() {
  if (dialog.value === 'address' && !input.value.trim()) return
  if (dialog.value === 'shipping' && (!input.value.trim() || !Number.isFinite(Number(input.value)) || Number(input.value) < 0)) return
  if (dialog.value === 'cancel') return changeStatus('Cancelled')
  if (dialog.value === 'return') return changeStatus('Waiting Approval Admin')
  if (dialog.value === 'decline') return changeStatus('Proof Declined')
  if (dialog.value === 'notes') emit('update', { notes: input.value.trim() })
  if (dialog.value === 'address' && input.value.trim()) emit('update', { address: input.value.trim() })
  if (dialog.value === 'shipping' && input.value.trim() && Number.isFinite(Number(input.value)) && Number(input.value) >= 0) emit('update', { shipping: Number(input.value) })
  feedback.value = 'Changes saved.'
  dialog.value = ''
}

const steps = [
  { label: 'Order created', icon: 'ri-draft-line' },
  { label: 'Waiting Payment', icon: 'ri-money-dollar-box-line' },
  { label: 'In Process', icon: 'ri-loader-2-line' },
  { label: 'Shipped', icon: 'ri-truck-line' },
  { label: 'Finished', icon: 'ri-check-line' },
]
const productHeaders = [
  { title: 'Product', key: 'product', sortable: false },
  { title: 'Unit price', key: 'price', sortable: false },
  { title: 'Quantity', key: 'quantity', sortable: false },
  { title: 'Subtotal', key: 'subtotal', sortable: false },
]
const products = computed(() => [
  { product: props.order.product, image: props.order.image, variant: props.order.variant, price: 150, quantity: 1, addon: false },
  ...(props.order.extra ? [{ product: 'Kiera Mini Backpack Dusty Pink', image: 'addon.png', variant: 'Lavender', price: 150, quantity: 2, addon: true }] : []),
])
const payment = computed(() => getOrderPayment(props.order))
const paymentRows = computed(() => [
  { label: 'Product subtotal', value: payment.value.productSubtotal },
  { label: 'Shipping subtotal', value: props.order.shipping },
  { label: 'Total discount', value: -payment.value.discount },
  { label: 'Shipping discount', value: -payment.value.shippingDiscount },
  { label: 'Point deduction', value: -payment.value.pointDeduction },
  { label: 'Service fee', value: payment.value.serviceFee },
])
</script>

<template>
  <div class="detail-stack text-body-1">
    <header class="detail-header">
      <VBtn icon="ri-arrow-left-line" variant="outlined" size="small" aria-label="Back to order list" @click="$emit('back')" />
      <h1 class="text-h4">Order details</h1>
      <div class="header-meta text-body-2">
        <span>Order no. {{ order.id }}</span>
        <VChip size="small" :color="statusColor" variant="tonal">{{ order.status }}</VChip>
        <span class="header-count">{{ index + 1 }} of {{ total }}</span>
        <VBtn icon="ri-arrow-left-s-line" variant="outlined" size="small" aria-label="Previous order" :disabled="index === 0" @click="$emit('navigate', index - 1)" />
        <VBtn icon="ri-arrow-right-s-line" variant="outlined" size="small" aria-label="Next order" :disabled="index === total - 1" @click="$emit('navigate', index + 1)" />
      </div>
    </header>

    <VCard :elevation="0" variant="outlined" class="bg-surface pa-6">
      <div class="steps-scroll">
        <ol class="order-steps" aria-label="Order progress">
          <li v-for="(step, i) in steps" :key="step.label" :class="{ active: i <= stepIndex }" :aria-current="i === stepIndex ? 'step' : undefined">
            <span class="step-icon"><VIcon :icon="step.icon" size="28" /></span>
            <span class="font-weight-medium">{{ step.label }}</span>
            <span class="text-body-2 text-medium-emphasis">{{ i <= stepIndex ? (order.history[i] || 'Date not recorded') : '–' }}</span>
          </li>
        </ol>
      </div>
    </VCard>

    <VAlert v-if="order.status === 'Proof Declined'" type="error" variant="tonal">Payment proof was declined. Waiting for a new proof of payment.</VAlert>
    <VAlert v-else-if="order.warning && order.status === 'Waiting Payment'" type="warning" variant="tonal">The customer uploaded payment proof. Admin verification is required.</VAlert>
    <VAlert v-if="order.status === 'Waiting Approval Admin'" type="warning" variant="tonal">Return request is waiting for admin approval.</VAlert>
    <VRow>
      <VCol cols="12" lg="8">
        <div class="detail-stack">
          <VCard :elevation="0" variant="outlined" class="section-card bg-surface pa-6">
            <div class="section-heading"><h2 class="text-h5 font-weight-medium"><span class="section-icon"><VIcon icon="ri-sticky-note-2-line" size="20" /></span>Admin notes</h2><VBtn variant="text" color="primary" size="small" prepend-icon="ri-pencil-line" @click="openDialog('notes')">Edit notes</VBtn></div>
            <p class="text-body-1 mt-4 mb-0">{{ order.notes || 'No admin notes yet.' }}</p>
          </VCard>

          <VCard :elevation="0" variant="outlined" class="section-card bg-surface pa-6">
            <div class="section-heading"><h2 class="text-h5 font-weight-medium"><span class="section-icon"><VIcon icon="ri-contacts-line" size="20" /></span>Shipping address</h2><VBtn variant="text" color="primary" size="small" prepend-icon="ri-pencil-line" @click="openDialog('address')">Edit address</VBtn></div>
            <div class="mt-5"><div class="font-weight-medium">{{ order.name }}</div><div class="text-body-2 text-medium-emphasis mt-1">+6289620447518</div><div class="text-body-2 text-medium-emphasis">{{ order.address }}</div></div>
          </VCard>

          <VCard :elevation="0" variant="outlined" class="section-card bg-surface">
            <div class="section-heading pa-6"><h2 class="text-h5 font-weight-medium"><span class="section-icon"><VIcon icon="ri-shopping-bag-3-line" size="20" /></span>Shopping list</h2></div>
            <UiTableView title="" :headers="productHeaders" :items="products" hide-filters hide-pagination mobile-cards flat card-class="product-table-shell">
              <template #item.product="{ item }">
                <div class="product py-3"><VImg :src="`/images/orders/${item.image}`" width="56" height="56" cover class="product-image" :alt="item.product" /><div><div class="text-body-1 font-weight-medium"><span v-if="item.addon" class="text-primary">(Add-ons) </span>{{ item.product }}</div><div class="text-body-2 text-medium-emphasis">SKU: 01902323</div><div v-if="item.variant" class="text-body-2 text-medium-emphasis">Variant: {{ item.variant }}</div></div></div>
              </template>
              <template #item.price="{ item }">NTD {{ item.price }}</template>
              <template #item.subtotal="{ item }">NTD {{ item.price * item.quantity }}</template>
              <template #mobile-cards>
                <div class="d-flex flex-column gap-4 px-6 pb-4">
                  <article v-for="item in products" :key="item.product" class="mobile-product pa-4">
                    <div class="product mb-4"><VImg :src="`/images/orders/${item.image}`" width="56" height="56" cover class="product-image" :alt="item.product" /><div><h3 class="text-body-1 font-weight-medium"><span v-if="item.addon" class="text-primary">(Add-ons) </span>{{ item.product }}</h3><p v-if="item.variant" class="text-body-2 text-medium-emphasis mb-0">{{ item.variant }}</p><p class="text-body-2 text-medium-emphasis mb-0">SKU: 01902323</p></div></div>
                    <dl class="mobile-prices text-body-2"><div><dt class="text-medium-emphasis">Unit price</dt><dd class="ms-0">NTD {{ item.price }}</dd></div><div><dt class="text-medium-emphasis">Quantity</dt><dd class="ms-0">{{ item.quantity }}</dd></div><div><dt class="text-medium-emphasis">Subtotal</dt><dd class="ms-0 font-weight-medium">NTD {{ item.price * item.quantity }}</dd></div></dl>
                  </article>
                </div>
              </template>
            </UiTableView>
            <div class="pa-6 pt-3"><div class="order-note text-body-2"><VIcon icon="ri-sticky-note-2-line" size="16" class="me-2" />Notes: <span class="text-medium-emphasis">–</span></div></div>
          </VCard>

          <VCard :elevation="0" variant="outlined" class="section-card bg-surface pa-6">
            <div class="section-heading mb-5"><h2 class="text-h5 font-weight-medium"><span class="section-icon"><VIcon icon="ri-bill-line" size="20" /></span>Payment information</h2></div>
            <div class="payment-row"><span>Payment method</span><span>{{ order.payment }}<template v-if="order.payment === 'Bank Mandiri'"> Manual Transfer</template></span></div>
            <div class="payment-row mt-2"><span>Discount applied</span><span>NEWUSER404</span></div>
            <VDivider class="my-5" />
            <div v-for="row in paymentRows" :key="row.label" class="payment-row payment-breakdown"><span>{{ row.label }}</span><span>{{ row.value < 0 ? '-' : '' }}NTD {{ Math.abs(row.value) }}</span></div>
            <VDivider class="my-5" />
            <div class="payment-row total-row"><span>Total payment</span><span class="text-h5 text-primary">NTD {{ payment.total }}</span></div>
          </VCard>
        </div>
      </VCol>
      <VCol cols="12" lg="4">
        <VCard :elevation="0" variant="outlined" class="section-card bg-surface pa-6">
          <div class="customer-card">
            <div class="customer-row pa-4"><VAvatar size="40" :image="`/images/orders/${order.avatar}`" /><div class="customer-name"><div class="font-weight-medium">{{ order.name }}</div><div class="text-body-2 text-medium-emphasis">General User <VChip size="x-small" variant="tonal">{{ order.platform }}</VChip></div></div></div>
            <VDivider />
            <div class="referral-row pa-4"><span class="text-body-2 text-medium-emphasis"><VIcon icon="ri-link" color="primary" size="18" class="me-2" />Used referral code</span><VChip size="small" color="primary" variant="outlined">A8091S</VChip></div>
          </div>
          <div class="section-heading mt-6 mb-4"><h2 class="text-h5 font-weight-medium"><span class="section-icon"><VIcon icon="ri-settings-3-line" size="20" /></span>Action</h2></div>
          <div class="action-stack">
            <VBtn v-if="nextStatus[order.status]" color="primary" block @click="changeStatus(nextStatus[order.status])">{{ nextLabel[order.status] }}</VBtn>
            <VBtn v-if="order.status === 'Waiting Payment'" variant="outlined" color="error" block @click="openDialog('decline')">Decline payment</VBtn>
            <VBtn variant="outlined" color="primary" prepend-icon="ri-pencil-line" block @click="openDialog('shipping')">Edit shipping price</VBtn>
            <VBtn variant="outlined" color="primary" prepend-icon="ri-chat-3-line" block disabled>Chat customer</VBtn>
            <VBtn variant="outlined" color="primary" prepend-icon="ri-file-list-line" block disabled>See invoices</VBtn>
            <VDivider class="my-2" />
            <VBtn v-if="order.status === 'Finished'" variant="outlined" color="warning" block @click="openDialog('return')">Request return</VBtn>
            <VBtn v-if="!['Cancelled', 'Finished', 'Return', 'Waiting Approval Admin'].includes(order.status)" variant="outlined" color="error" prepend-icon="ri-close-line" block @click="openDialog('cancel')">Cancel order</VBtn>
          </div>
          <p class="text-body-2 text-medium-emphasis mt-4">Changes apply to this app session only. Customer chat and invoices require connected services.</p>
        </VCard>
      </VCol>
    </VRow>
    <VDialog :model-value="!!dialog" max-width="480" aria-labelledby="order-dialog-title" @after-leave="restoreDialogFocus" @update:model-value="!$event && (dialog = '')">
      <VCard :elevation="0" class="pa-6">
        <h2 id="order-dialog-title" class="text-h5 mb-4">{{ { notes: 'Edit notes', address: 'Edit address', shipping: 'Edit shipping price', cancel: 'Cancel order?', return: 'Request return?', decline: 'Decline payment?' }[dialog] }}</h2>
        <p v-if="['cancel', 'return', 'decline'].includes(dialog)" class="text-body-1 mb-4">Update demo order {{ order.id }}? This change applies only to this app session.</p>
        <VTextarea v-if="dialog === 'notes' || dialog === 'address'" v-model="input" :label="dialog === 'notes' ? 'Notes' : 'Address'" />
        <VTextField v-if="dialog === 'shipping'" v-model="input" type="number" min="0" label="Shipping price (NTD)" />
        <div class="d-flex justify-end gap-3 mt-4"><VBtn variant="text" @click="dialog = ''">Back</VBtn><VBtn color="primary" :disabled="dialog === 'address' && !input.trim() || dialog === 'shipping' && (!input.trim() || !Number.isFinite(Number(input)) || Number(input) < 0)" @click="saveDialog">Confirm</VBtn></div>
      </VCard>
    </VDialog>
    <VSnackbar :model-value="!!feedback" @update:model-value="feedback = ''">{{ feedback }}</VSnackbar>
  </div>
</template>

<style scoped>
.detail-stack { display: flex; flex-direction: column; gap: 24px; }
.detail-header, .header-meta, .customer-row, .referral-row, .product, .payment-row, .section-heading, .section-heading h2 { display: flex; align-items: center; gap: 12px; }
.detail-header { flex-wrap: wrap; }
.header-meta { margin-inline-start: auto; flex-wrap: wrap; color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)); }
.header-count { border-inline-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); padding-inline-start: 12px; }
.steps-scroll, .table-scroll { overflow-x: auto; }
.order-steps { display: flex; justify-content: space-between; min-inline-size: 600px; padding: 0; list-style: none; }
.order-steps li { position: relative; display: flex; flex: 1 0 120px; flex-direction: column; align-items: center; gap: 8px; text-align: center; color: rgba(var(--v-theme-on-surface), var(--v-disabled-opacity)); }
.order-steps li:not(:last-child)::after { position: absolute; inset-block-start: 27px; inset-inline-start: calc(50% + 28px); width: calc(100% - 56px); border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); content: ''; }
.order-steps li.active { color: rgb(var(--v-theme-primary)); }
.order-steps li.active::after { border-color: rgb(var(--v-theme-primary)); }
.step-icon { display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; border: 1px solid currentColor; border-radius: 50%; }
.section-card { border-radius: 12px; }
.section-heading { justify-content: space-between; }
.section-heading h2 { min-inline-size: 0; }
.section-icon { display: inline-flex; align-items: center; justify-content: center; flex: 0 0 32px; width: 32px; height: 32px; border-radius: 4px; color: rgb(var(--v-theme-primary)); background: rgba(var(--v-theme-primary), 0.08); }
.product { min-inline-size: 0; overflow-wrap: anywhere; }
.product > div { min-inline-size: 0; }
.product-image { flex: 0 0 56px; border-radius: 8px; }
.order-note { padding: 8px 12px; border-radius: 4px; background: rgba(var(--v-theme-on-surface), 0.04); }
.payment-row { justify-content: space-between; align-items: flex-start; }
.payment-row span:first-child { color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)); }
.payment-row span:last-child { text-align: end; }
.payment-breakdown + .payment-breakdown { margin-block-start: 8px; }
.customer-card { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 12px; }
.customer-name { min-width: 0; }
.referral-row { justify-content: space-between; flex-wrap: wrap; }
.action-stack { display: flex; flex-direction: column; gap: 12px; }
@media (max-width: 600px) { .header-meta { margin-inline-start: 0; width: 100%; } .section-heading { flex-wrap: wrap; } }
.mobile-product { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 8px; }
.mobile-prices { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; }
:deep(.product-table-shell) { border: 0; border-radius: 0; box-shadow: none; }
@media (max-width: 600px) {
  .order-steps { flex-direction: column; min-inline-size: 0; gap: 16px; }
  .order-steps li { flex: none; display: grid; grid-template-columns: 40px 1fr; text-align: start; column-gap: 12px; color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)); }
  .step-icon { grid-row: span 2; width: 40px; height: 40px; }
  .order-steps li:not(:last-child)::after { inset-inline-start: 20px; inset-block-start: 44px; width: 0; height: 12px; border-inline-start: 1px solid currentColor; border-block-start: 0; }
  .payment-row { flex-wrap: wrap; gap: 8px; }
}
</style>

