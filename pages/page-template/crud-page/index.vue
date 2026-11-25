<script setup lang="ts">
import type { CrudPageStudent } from '@/composables/useCrudPageDemo'
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'
import UiTableView from '@/components/ui/UiTableView.vue'
import { requiredValidator } from '@core/utils/validators'

definePageMeta({ sidebarRoute: 'page-template-crud-page' })
useHead({ title: 'CRUD Page' })

const { students } = useCrudPageDemo()
const tab = ref('All')
const viewType = ref('list')
const loading = ref(false)
const search = ref('')
const status = ref<string | null>(null)
const dialog = ref(false)
const deleteDialog = ref(false)
const editingId = ref<string | null>(null)
const deleting = ref<CrudPageStudent | null>(null)
const snackbarOpen = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref<'success' | 'error'>('success')
const expandedStatusPanels = ref<string[]>(['Active', 'Inactive'])
const expandedPeriodPanels = ref<string[]>([])
const form = reactive({ name: '', username: '', phone: '', status: 'Active' as CrudPageStudent['status'] })
const formValid = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

const showFeedback = (message: string, color: 'success' | 'error' = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbarOpen.value = true
}

const simulateLoading = () => {
  clearTimeout(loadingTimer)
  loading.value = true
  loadingTimer = setTimeout(() => {
    loading.value = false
  }, 800)
}

onBeforeUnmount(() => {
  clearTimeout(loadingTimer)
})

const headers = [
  { title: 'Student name', key: 'name' },
  { title: 'Phone number', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: 'Register date', key: 'registeredAt' },
  { title: 'Action', key: 'actions', sortable: false, align: 'center' as const, width: '140px' },
]

const tabs = computed(() => [
  {
    label: 'All',
    value: 'All',
    icon: 'ri-group-line',
    count: students.value.length,
  },
  {
    label: 'Active',
    value: 'Active',
    icon: 'ri-user-follow-line',
    count: students.value.filter(item => item.status === 'Active').length,
    badgeColor: tab.value === 'Active' ? 'success' : undefined,
  },
  {
    label: 'Inactive',
    value: 'Inactive',
    icon: 'ri-user-received-2-line',
    count: students.value.filter(item => item.status === 'Inactive').length,
    badgeColor: tab.value === 'Inactive' ? 'error' : undefined,
  },
])

const statistics = computed(() => [
  { label: 'Total students', count: students.value.length, caption: 'All demo students', icon: 'ri-group-line', color: 'primary' },
  { label: 'Trial', count: null, caption: 'Not tracked in this demo', icon: 'ri-contacts-line', color: 'success' },
  { label: 'Registered', count: students.value.length, caption: 'Registered demo students', icon: 'ri-user-follow-line', color: 'success' },
  { label: 'Inactive students', count: students.value.filter(item => item.status === 'Inactive').length, caption: 'Inactive demo students', icon: 'ri-user-received-2-line', color: 'error' },
])

const hasActiveFilters = computed(() => Boolean(search.value?.trim() || status.value))

const filtered = computed(() => {
  const query = (search.value || '').trim().toLowerCase()
  return students.value.filter(item => (tab.value === 'All' || item.status === tab.value)
    && (!status.value || item.status === status.value)
    && (!query || `${item.name} ${item.username}`.toLowerCase().includes(query)))
})

const groupedByStatus = computed(() => (['Active', 'Inactive'] as const)
  .map(groupStatus => ({
    status: groupStatus,
    items: filtered.value.filter(item => item.status === groupStatus),
  }))
  .filter(group => group.items.length > 0))

const groupedByMonth = computed(() => {
  const groups = new Map<string, CrudPageStudent[]>()
  for (const item of filtered.value) {
    const period = item.registeredAt.slice(0, 7)
    const bucket = groups.get(period) ?? []
    bucket.push(item)
    groups.set(period, bucket)
  }
  return Array.from(groups.entries()).map(([period, items]) => ({ period, items }))
})

watch(groupedByMonth, groups => {
  expandedPeriodPanels.value = groups.map(group => group.period)
}, { immediate: true })

const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
const resetFilters = () => { search.value = ''; status.value = null }
const openForm = (item?: CrudPageStudent) => {
  editingId.value = item?.id ?? null
  Object.assign(form, item ? { name: item.name, username: item.username, phone: item.phone, status: item.status } : { name: '', username: '', phone: '', status: 'Active' })
  dialog.value = true
}
const save = () => {
  if (!formValid.value || !form.name.trim() || !form.username.trim() || !form.phone.trim()) return
  const values = { name: form.name.trim(), username: form.username.trim(), phone: form.phone.trim(), status: form.status }
  const existing = students.value.find(item => item.id === editingId.value)
  if (existing) Object.assign(existing, values)
  else students.value.push({ id: globalThis.crypto.randomUUID(), ...values, registeredAt: new Date().toISOString().slice(0, 10) })
  showFeedback(existing ? 'Student updated in this demo.' : 'Student added to this demo.')
  dialog.value = false
}
const confirmDelete = (item: CrudPageStudent) => { deleting.value = item; deleteDialog.value = true }
const remove = () => {
  if (!deleting.value) return
  students.value = students.value.filter(item => item.id !== deleting.value?.id)
  showFeedback('Student deleted from this demo.')
  deleteDialog.value = false
  deleting.value = null
}
</script>

<template>
  <section>
    <UiSectionHeader class="template-header" title="Student" title-class="text-h4" description="Explore a reusable list and detail page with local demo data.">
      <template #actions>
        <TemplatePrompt template="crud" />
        <VBtn icon variant="outlined" color="primary" aria-label="Simulate loading" :disabled="loading" @click="simulateLoading"><VIcon icon="ri-refresh-line" aria-hidden="true" /><VTooltip activator="parent">Simulate loading</VTooltip></VBtn>
        <VBtn prepend-icon="ri-add-line" @click="openForm()">
          Add student
        </VBtn>
      </template>
    </UiSectionHeader>

    <VRow class="mb-2">
      <VCol v-for="summary in statistics" :key="summary.label" cols="12" sm="6" lg="3">
        <VCard variant="outlined" class="bg-surface" height="100%">
          <VCardText class="pa-5 d-flex align-start justify-space-between gap-3">
            <div class="d-flex flex-column gap-1">
              <p class="text-body-1 text-high-emphasis mb-0">{{ summary.label }}</p>
              <p class="text-h4 text-high-emphasis mb-0">{{ summary.count ?? '—' }}</p>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ summary.caption }}</p>
            </div>
            <VAvatar :color="summary.color" variant="tonal" rounded size="42" aria-hidden="true">
              <VIcon :icon="summary.icon" size="26" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <UiTableView
      v-model:active-tab="tab"
      v-model:view-type="viewType"
      title=""
      :tabs="tabs"
      :headers="headers"
      :items="filtered"
      :loading="loading"
      :reset-disabled="!hasActiveFilters"
      :items-per-page="10"
      show-view-toggle
      @reset-filters="resetFilters"
    >
      <template #filters>
        <VTextField
          v-model="search"
          label="Search students"
          placeholder="Name or username"
          prepend-inner-icon="ri-search-line"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter ui-table-filter--search"
        />
        <VSelect
          v-model="status"
          label="Status"
          :items="['Active', 'Inactive']"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter"
        />
      </template>

      <template #item.name="{ item }">
        <div class="d-flex align-center gap-3 py-2">
          <VAvatar size="34" color="grey-50" class="avatar-subtle-border" aria-hidden="true">
            <span class="text-caption font-weight-medium text-high-emphasis">{{ initials(item.name) }}</span>
          </VAvatar>
          <div class="d-flex flex-column">
            <NuxtLink :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }" class="text-body-1 font-weight-medium text-primary text-decoration-underline">
              {{ item.name }}
            </NuxtLink>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ item.username }}</p>
          </div>
        </div>
      </template>

      <template #item.phone="{ item }">
        <span class="text-body-1 text-high-emphasis">{{ item.phone }}</span>
      </template>

      <template #item.status="{ item }">
        <VChip size="small" variant="tonal" class="font-weight-medium" :color="item.status === 'Active' ? 'success' : 'secondary'">
          {{ item.status }}
        </VChip>
      </template>

      <template #item.registeredAt="{ item }">
        <span class="text-body-1 text-medium-emphasis">{{ item.registeredAt }}</span>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center gap-2">
          <VBtn
            icon
            variant="outlined"
            size="small"
            color="secondary"
            class="action-btn"
            :aria-label="`View ${item.name}`"
            :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }"
          >
            <VIcon icon="ri-eye-line" size="18" aria-hidden="true" />
            <VTooltip activator="parent" location="top">View</VTooltip>
          </VBtn>
          <VBtn
            icon
            variant="outlined"
            size="small"
            color="primary"
            class="action-btn"
            :aria-label="`Edit ${item.name}`"
            @click="openForm(item)"
          >
            <VIcon icon="ri-pencil-line" size="18" aria-hidden="true" />
            <VTooltip activator="parent" location="top">Edit</VTooltip>
          </VBtn>
          <VBtn
            icon
            variant="outlined"
            size="small"
            color="error"
            class="action-btn"
            :aria-label="`Delete ${item.name}`"
            @click="confirmDelete(item)"
          >
            <VIcon icon="ri-delete-bin-line" size="18" aria-hidden="true" />
            <VTooltip activator="parent" location="top">Delete</VTooltip>
          </VBtn>
        </div>
      </template>

      <template #no-data>
        <div class="py-6 text-center text-medium-emphasis">
          No students match the current filters. Reset the filters or add a student.
        </div>
      </template>

      <template #view-team>
        <div class="pa-5">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <span class="text-body-1 font-weight-medium text-high-emphasis">Grouped by status</span>
            <span class="text-body-2 text-medium-emphasis">{{ filtered.length }} {{ filtered.length === 1 ? 'student' : 'students' }} displayed</span>
          </div>
          <div v-if="groupedByStatus.length === 0" class="py-8 text-center text-medium-emphasis border rounded">
            No students match the current filters. Reset the filters or add a student.
          </div>
          <VExpansionPanels v-else v-model="expandedStatusPanels" multiple variant="accordion">
            <VExpansionPanel v-for="group in groupedByStatus" :key="group.status" :value="group.status">
              <VExpansionPanelTitle>
                <div class="d-flex align-center flex-wrap gap-3">
                  <span class="text-body-1 font-weight-medium text-high-emphasis">{{ group.status }}</span>
                  <VChip size="small" variant="tonal" class="font-weight-medium" :color="group.status === 'Active' ? 'success' : 'secondary'">
                    {{ group.items.length }} {{ group.items.length === 1 ? 'student' : 'students' }}
                  </VChip>
                </div>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <div class="d-flex flex-column gap-3 pt-2">
                  <VCard v-for="item in group.items" :key="item.id" variant="outlined" class="bg-surface">
                    <VCardText class="pa-4 d-flex align-center justify-space-between flex-wrap gap-4">
                      <div class="d-flex align-center gap-3">
                        <VAvatar size="34" color="grey-50" class="avatar-subtle-border" aria-hidden="true">
                          <span class="text-caption font-weight-medium text-high-emphasis">{{ initials(item.name) }}</span>
                        </VAvatar>
                        <div>
                          <NuxtLink :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }" class="text-body-1 font-weight-medium text-primary text-decoration-underline">
                            {{ item.name }}
                          </NuxtLink>
                          <p class="text-body-2 text-medium-emphasis mb-0">{{ item.username }} · {{ item.phone }}</p>
                        </div>
                      </div>
                      <div class="d-flex align-center flex-wrap gap-2">
                        <VBtn size="small" variant="outlined" :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }">
                          View
                        </VBtn>
                        <VBtn size="small" variant="outlined" color="primary" @click="openForm(item)">
                          Edit
                        </VBtn>
                        <VBtn size="small" variant="outlined" color="error" @click="confirmDelete(item)">
                          Delete
                        </VBtn>
                      </div>
                    </VCardText>
                  </VCard>
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </div>
      </template>

      <template #view-room>
        <div class="pa-5">
          <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
            <span class="text-body-1 font-weight-medium text-high-emphasis">Grouped by registration month</span>
            <span class="text-body-2 text-medium-emphasis">{{ groupedByMonth.length }} {{ groupedByMonth.length === 1 ? 'period' : 'periods' }} displayed</span>
          </div>
          <div v-if="groupedByMonth.length === 0" class="py-8 text-center text-medium-emphasis border rounded">
            No students match the current filters. Reset the filters or add a student.
          </div>
          <VExpansionPanels v-else v-model="expandedPeriodPanels" multiple variant="accordion">
            <VExpansionPanel v-for="group in groupedByMonth" :key="group.period" :value="group.period">
              <VExpansionPanelTitle>
                <div class="d-flex align-center flex-wrap gap-3">
                  <VAvatar size="32" color="primary" variant="tonal" aria-hidden="true">
                    <VIcon icon="ri-calendar-line" size="18" />
                  </VAvatar>
                  <span class="text-body-1 font-weight-medium text-high-emphasis">{{ group.period }}</span>
                  <VChip size="small" variant="tonal" color="info" class="font-weight-medium">
                    {{ group.items.length }} {{ group.items.length === 1 ? 'student' : 'students' }}
                  </VChip>
                </div>
              </VExpansionPanelTitle>
              <VExpansionPanelText>
                <div class="d-flex flex-column gap-3 pt-2">
                  <VCard v-for="item in group.items" :key="item.id" variant="outlined" class="bg-surface">
                    <VCardText class="pa-4 d-flex align-center justify-space-between flex-wrap gap-4">
                      <div class="d-flex align-center gap-3">
                        <VAvatar size="34" color="grey-50" class="avatar-subtle-border" aria-hidden="true">
                          <span class="text-caption font-weight-medium text-high-emphasis">{{ initials(item.name) }}</span>
                        </VAvatar>
                        <div>
                          <NuxtLink :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }" class="text-body-1 font-weight-medium text-primary text-decoration-underline">
                            {{ item.name }}
                          </NuxtLink>
                          <p class="text-body-2 text-medium-emphasis mb-0">{{ item.registeredAt }} · {{ item.phone }}</p>
                        </div>
                      </div>
                      <VChip size="small" variant="tonal" class="font-weight-medium" :color="item.status === 'Active' ? 'success' : 'secondary'">
                        {{ item.status }}
                      </VChip>
                    </VCardText>
                  </VCard>
                </div>
              </VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
        </div>
      </template>
    </UiTableView>

    <VDialog v-model="dialog" max-width="520">
      <VCard :title="editingId ? 'Edit student' : 'Add student'">
        <DialogCloseBtn aria-label="Close dialog" @click="dialog = false" />
        <VDivider />
        <VForm v-model="formValid" @submit.prevent="save">
          <VCardText class="pt-5 d-flex flex-column gap-4">
            <VTextField v-model="form.name" label="Name" :rules="[requiredValidator]" />
            <VTextField v-model="form.username" label="Username" :rules="[requiredValidator]" />
            <VTextField v-model="form.phone" label="Phone number" :rules="[requiredValidator]" />
            <VSelect v-model="form.status" label="Status" :items="['Active', 'Inactive']" />
          </VCardText>
          <VDivider />
          <VCardActions class="pa-4">
            <VSpacer />
            <VBtn variant="outlined" @click="dialog = false">Cancel</VBtn>
            <VBtn type="submit" :disabled="!formValid">Save</VBtn>
          </VCardActions>
        </VForm>
      </VCard>
    </VDialog>

    <VDialog v-model="deleteDialog" max-width="480">
      <VCard title="Delete student?">
        <DialogCloseBtn aria-label="Close dialog" @click="deleteDialog = false" />
        <VDivider />
        <VCardText class="pt-5">
          Remove {{ deleting?.name }} from this demo? This cannot be undone.
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn variant="outlined" @click="deleteDialog = false">Cancel</VBtn>
          <VBtn color="error" @click="remove">Delete</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar v-model="snackbarOpen" :color="snackbarColor" :timeout="4000">
      {{ snackbarMessage }}
      <template #actions>
        <VBtn variant="text" :color="snackbarColor === 'error' ? 'on-error' : 'on-success'" @click="snackbarOpen = false">
          Close
        </VBtn>
      </template>
    </VSnackbar>
  </section>
</template>

<style scoped>
.avatar-subtle-border {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
