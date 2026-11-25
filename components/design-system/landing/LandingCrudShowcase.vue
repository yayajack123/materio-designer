<script setup lang="ts">
import type { CrudPageStudent } from '@/composables/useCrudPageDemo'
import UiTableView from '@/components/ui/UiTableView.vue'

const props = withDefaults(defineProps<{
  mobileCards?: boolean
}>(), {
  mobileCards: true,
})

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const { students } = useCrudPageDemo()
const activeTab = ref('All')
const search = ref('')
const statusFilter = ref<CrudPageStudent['status'] | null>(null)

const headers = [
  { title: 'Student name', key: 'name' },
  { title: 'Phone number', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: 'Register date', key: 'registeredAt' },
  { title: 'Action', key: 'actions', sortable: false, align: 'center' as const },
]

const tabs = computed(() =>
  ['All', 'Active', 'Inactive'].map(value => ({
    label: value,
    value,
    count: value === 'All'
      ? students.value.length
      : students.value.filter(student => student.status === value).length,
  })),
)

const summaryMetrics = computed(() => [
  { label: 'Total records', value: students.value.length, caption: 'Shared session demo', icon: 'ri-group-line', color: 'primary' },
  { label: 'Active', value: students.value.filter(item => item.status === 'Active').length, caption: 'Currently enrolled', icon: 'ri-checkbox-circle-line', color: 'success' },
  { label: 'Inactive', value: students.value.filter(item => item.status === 'Inactive').length, caption: 'Paused records', icon: 'ri-pause-circle-line', color: 'secondary' },
])

const hasActiveFilters = computed(() => Boolean(search.value.trim() || statusFilter.value || activeTab.value !== 'All'))

const filteredStudents = computed(() => {
  const query = search.value.trim().toLowerCase()

  return students.value.filter(student => {
    const matchesTab = activeTab.value === 'All' || student.status === activeTab.value
    const matchesStatus = !statusFilter.value || student.status === statusFilter.value
    const matchesQuery = !query || `${student.name} ${student.username} ${student.phone}`.toLowerCase().includes(query)

    return matchesTab && matchesStatus && matchesQuery
  })
})

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

const resetFilters = () => {
  search.value = ''
  statusFilter.value = null
  activeTab.value = 'All'
}

const toggleStatus = (student: CrudPageStudent) => {
  student.status = student.status === 'Active' ? 'Inactive' : 'Active'
  emit('notify', `${student.name} marked as ${student.status}.`)
}
</script>

<template>
  <div class="d-flex flex-column gap-6">
    <div class="d-flex flex-wrap align-center justify-space-between gap-3">
      <div>
        <h3 class="text-h5 mb-1">CRUD &amp; responsive table pattern</h3>
        <p class="text-body-2 text-medium-emphasis mb-0">
          Powered by <code>UiTableView</code> with shared session state and {{ props.mobileCards ? 'mobile card reflow below 760px' : 'horizontal scroll on narrow viewports' }}.
        </p>
      </div>
      <VBtn
        color="primary"
        variant="outlined"
        :to="{ name: 'page-template-crud-page' }"
        append-icon="ri-arrow-right-up-line"
      >
        Open full CRUD template
      </VBtn>
    </div>

    <VRow>
      <VCol
        v-for="metric in summaryMetrics"
        :key="metric.label"
        cols="12"
        sm="4"
      >
        <VCard variant="outlined" class="bg-surface" height="100%">
          <VCardText class="pa-5 d-flex align-start justify-space-between gap-3">
            <div class="d-flex flex-column gap-1">
              <span class="text-body-2 text-medium-emphasis">{{ metric.label }}</span>
              <span class="text-h4 font-weight-medium">{{ metric.value }}</span>
              <span class="text-caption text-medium-emphasis">{{ metric.caption }}</span>
            </div>
            <VAvatar :color="metric.color" variant="tonal" rounded size="40" aria-hidden="true">
              <VIcon :icon="metric.icon" size="22" />
            </VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <UiTableView
      v-model:active-tab="activeTab"
      title=""
      :tabs="tabs"
      :headers="headers"
      :items="filteredStudents"
      :items-per-page="5"
      :mobile-cards="props.mobileCards"
      tabs-inside-card
      card-class="border bg-surface"
      flat
      @reset-filters="resetFilters"
    >
      <template #filters>
        <VTextField
          v-model="search"
          label="Search students"
          placeholder="Name, username, or phone"
          prepend-inner-icon="ri-search-line"
          clearable
          density="compact"
          hide-details
          class="ui-table-filter ui-table-filter--search"
        />
        <VSelect
          v-model="statusFilter"
          label="Status"
          :items="['Active', 'Inactive']"
          clearable
          density="compact"
          hide-details
          class="ui-table-filter"
        />
      </template>

      <template #item.name="{ item }">
        <div class="d-flex align-center gap-3 py-2">
          <VAvatar size="34" color="primary" variant="tonal" aria-hidden="true">
            <span class="text-body-2 font-weight-medium">{{ initials(item.name) }}</span>
          </VAvatar>
          <div>
            <NuxtLink
              :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }"
              class="text-body-1 font-weight-medium"
            >
              {{ item.name }}
            </NuxtLink>
            <p class="text-body-2 text-medium-emphasis mb-0">@{{ item.username }}</p>
          </div>
        </div>
      </template>

      <template #item.status="{ item }">
        <VChip
          size="small"
          variant="tonal"
          :color="item.status === 'Active' ? 'success' : 'secondary'"
        >
          {{ item.status }}
        </VChip>
      </template>

      <template #item.actions="{ item }">
        <div class="d-flex justify-center gap-2">
          <VBtn
            type="button"
            size="small"
            variant="tonal"
            :color="item.status === 'Active' ? 'secondary' : 'primary'"
            @click="toggleStatus(item)"
          >
            {{ item.status === 'Active' ? 'Set inactive' : 'Activate' }}
          </VBtn>
          <IconBtn
            :aria-label="`View ${item.name} details`"
            :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }"
          >
            <VIcon icon="ri-eye-line" aria-hidden="true" />
            <VTooltip activator="parent" location="top">View details</VTooltip>
          </IconBtn>
        </div>
      </template>

      <template #no-data>
        <div class="pa-6 text-center">
          <p class="text-body-1 font-weight-medium mb-1">
            {{ hasActiveFilters ? 'No students match the current filters.' : 'No demo students available.' }}
          </p>
          <p class="text-body-2 text-medium-emphasis mb-4">
            {{ hasActiveFilters ? 'Clear your search query or status filter to restore the list.' : 'Open the full CRUD template to add new demo records.' }}
          </p>
          <VBtn
            v-if="hasActiveFilters"
            type="button"
            variant="outlined"
            color="primary"
            @click="resetFilters"
          >
            Reset filters
          </VBtn>
        </div>
      </template>

      <template #mobile-cards="{ items }">
        <div v-if="items.length" class="pa-4 d-flex flex-column gap-3">
          <VCard
            v-for="item in (items as CrudPageStudent[])"
            :key="item.id"
            variant="outlined"
            class="pa-4 bg-surface"
          >
            <div class="d-flex align-start justify-space-between gap-3 mb-3">
              <div class="d-flex align-center gap-3 min-w-0">
                <VAvatar size="36" color="primary" variant="tonal" aria-hidden="true">
                  <span class="text-body-2 font-weight-medium">{{ initials(item.name) }}</span>
                </VAvatar>
                <div class="min-w-0">
                  <h4 class="text-subtitle-1 font-weight-medium mb-0 text-truncate">{{ item.name }}</h4>
                  <p class="text-body-2 text-medium-emphasis mb-0 text-truncate">@{{ item.username }}</p>
                </div>
              </div>
              <VChip
                size="small"
                variant="tonal"
                :color="item.status === 'Active' ? 'success' : 'secondary'"
              >
                {{ item.status }}
              </VChip>
            </div>

            <div class="d-flex flex-wrap gap-4 text-body-2 text-medium-emphasis mb-4">
              <span><strong class="text-high-emphasis">Phone:</strong> {{ item.phone }}</span>
              <span><strong class="text-high-emphasis">Registered:</strong> {{ item.registeredAt }}</span>
            </div>

            <div class="d-flex flex-wrap align-center justify-end gap-2">
              <VBtn
                type="button"
                size="small"
                variant="tonal"
                :color="item.status === 'Active' ? 'secondary' : 'primary'"
                @click="toggleStatus(item)"
              >
                {{ item.status === 'Active' ? 'Set inactive' : 'Activate' }}
              </VBtn>
              <VBtn
                size="small"
                variant="outlined"
                color="primary"
                :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }"
              >
                View details
              </VBtn>
            </div>
          </VCard>
        </div>

        <div v-else class="pa-6 text-center">
          <p class="text-body-1 font-weight-medium mb-1">
            {{ hasActiveFilters ? 'No students match the current filters.' : 'No demo students available.' }}
          </p>
          <VBtn
            v-if="hasActiveFilters"
            type="button"
            variant="outlined"
            color="primary"
            class="mt-2"
            @click="resetFilters"
          >
            Reset filters
          </VBtn>
        </div>
      </template>
    </UiTableView>
  </div>
</template>

<style scoped>
.min-w-0 {
  min-inline-size: 0;
}
</style>
