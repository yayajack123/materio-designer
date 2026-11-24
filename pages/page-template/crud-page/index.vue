<script setup lang="ts">
import type { CrudPageStudent } from '@/composables/useCrudPageDemo'
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'
import UiTableView from '@/components/ui/UiTableView.vue'

definePageMeta({ sidebarRoute: 'page-template-crud-page' })
useHead({ title: 'CRUD Page' })

const { students } = useCrudPageDemo()
const tab = ref('All')
const search = ref('')
const status = ref<string | null>(null)
const dialog = ref(false)
const deleteDialog = ref(false)
const editingId = ref<string | null>(null)
const deleting = ref<CrudPageStudent | null>(null)
const feedback = ref('')
const form = reactive({ name: '', username: '', phone: '', status: 'Active' as CrudPageStudent['status'] })
const required = (value: string) => !!value?.trim() || 'This field is required.'
const formValid = ref(false)
const headers = [
  { title: 'Student name', key: 'name' },
  { title: 'Phone number', key: 'phone' },
  { title: 'Status', key: 'status' },
  { title: 'Register date', key: 'registeredAt' },
  { title: 'Action', key: 'actions', sortable: false, align: 'center' as const },
]
const tabs = computed(() => ['All', 'Active', 'Inactive'].map(value => ({ label: value, value, count: value === 'All' ? students.value.length : students.value.filter(item => item.status === value).length })))
const statistics = computed(() => [
  { label: 'Total students', count: students.value.length, caption: 'All demo students', icon: 'ri-group-line', color: 'primary' },
  { label: 'Trial', count: null, caption: 'Not tracked in this demo', icon: 'ri-contacts-line', color: 'success' },
  { label: 'Registered', count: students.value.length, caption: 'Registered demo students', icon: 'ri-user-follow-line', color: 'success' },
  { label: 'Inactive students', count: students.value.filter(item => item.status === 'Inactive').length, caption: 'Inactive demo students', icon: 'ri-user-received-2-line', color: 'error' },
])
const filtered = computed(() => {
  const query = (search.value || '').trim().toLowerCase()
  return students.value.filter(item => (tab.value === 'All' || item.status === tab.value)
    && (!status.value || item.status === status.value)
    && (!query || `${item.name} ${item.username}`.toLowerCase().includes(query)))
})
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
  feedback.value = existing ? 'Student updated in this demo.' : 'Student added to this demo.'
  dialog.value = false
}
const confirmDelete = (item: CrudPageStudent) => { deleting.value = item; deleteDialog.value = true }
const remove = () => {
  if (!deleting.value) return
  students.value = students.value.filter(item => item.id !== deleting.value?.id)
  feedback.value = 'Student deleted from this demo.'
  deleteDialog.value = false
  deleting.value = null
}
</script>

<template>
  <section>
    <UiSectionHeader title="Student" title-class="text-h4" description="Explore a reusable list and detail page with local demo data.">
      <template #actions><VBtn prepend-icon="ri-add-line" @click="openForm()">Add student</VBtn></template>
    </UiSectionHeader>
    <VRow class="mb-2">
      <VCol v-for="summary in statistics" :key="summary.label" cols="12" sm="6" lg="3">
        <VCard variant="outlined" class="bg-surface" height="100%">
          <VCardText class="pa-5 d-flex align-start justify-space-between gap-3">
            <div class="d-flex flex-column gap-1">
              <p class="text-body-1 mb-0">{{ summary.label }}</p>
              <p class="text-h4 mb-0">{{ summary.count ?? '—' }}</p>
              <p class="text-body-2 text-medium-emphasis mb-0">{{ summary.caption }}</p>
            </div>
            <VAvatar :color="summary.color" variant="tonal" rounded size="42" aria-hidden="true"><VIcon :icon="summary.icon" size="26" /></VAvatar>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <p v-if="feedback" class="text-body-2 mb-4" role="status">{{ feedback }}</p>
    <UiTableView v-model:active-tab="tab" title="" :tabs="tabs" :headers="headers" :items="filtered" :items-per-page="10" @reset-filters="resetFilters">
      <template #filters>
        <VTextField v-model="search" label="Search students" placeholder="Name or username" clearable style="min-width: 200px; max-width: 280px" />
        <VSelect v-model="status" label="Status" :items="['Active', 'Inactive']" clearable style="min-width: 180px; max-width: 240px" />
      </template>
      <template #item.name="{ item }">
        <div class="d-flex align-center gap-3 py-2"><VAvatar size="34" color="secondary" variant="tonal" aria-hidden="true">{{ initials(item.name) }}</VAvatar><div><NuxtLink :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }" class="text-body-1 font-weight-medium">{{ item.name }}</NuxtLink><p class="text-body-2 text-medium-emphasis mb-0">{{ item.username }}</p></div></div>
      </template>
      <template #item.status="{ item }"><VChip size="small" variant="tonal" :color="item.status === 'Active' ? 'success' : 'secondary'">{{ item.status }}</VChip></template>
      <template #item.actions="{ item }"><div class="d-flex justify-center gap-2"><IconBtn :aria-label="`View ${item.name}`" :to="{ name: 'page-template-crud-page-id', params: { id: item.id } }"><VIcon icon="ri-eye-line" /></IconBtn><IconBtn :aria-label="`Edit ${item.name}`" @click="openForm(item)"><VIcon icon="ri-pencil-line" /></IconBtn><IconBtn :aria-label="`Delete ${item.name}`" @click="confirmDelete(item)"><VIcon icon="ri-delete-bin-line" /></IconBtn></div></template>
      <template #no-data><div class="pa-6">No students match the current filters. Reset the filters or add a student.</div></template>
    </UiTableView>
    <VDialog v-model="dialog" max-width="520">
      <VCard :title="editingId ? 'Edit student' : 'Add student'">
        <VForm v-model="formValid" @submit.prevent="save">
          <VCardText class="d-flex flex-column gap-4"><VTextField v-model="form.name" label="Name" :rules="[required]" /><VTextField v-model="form.username" label="Username" :rules="[required]" /><VTextField v-model="form.phone" label="Phone number" :rules="[required]" /><VSelect v-model="form.status" label="Status" :items="['Active', 'Inactive']" /></VCardText>
          <VCardActions><VSpacer /><VBtn variant="text" @click="dialog = false">Cancel</VBtn><VBtn type="submit" :disabled="!formValid">Save</VBtn></VCardActions>
        </VForm>
      </VCard>
    </VDialog>
    <VDialog v-model="deleteDialog" max-width="480"><VCard title="Delete student?"><VCardText>Remove {{ deleting?.name }} from this demo? This cannot be undone.</VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="deleteDialog = false">Cancel</VBtn><VBtn color="error" @click="remove">Delete</VBtn></VCardActions></VCard></VDialog>
  </section>
</template>
