<script setup lang="ts">
import type { CrudPageStudent } from '@/composables/useCrudPageDemo'

definePageMeta({ sidebarRoute: 'page-template-crud-page' })
useHead({ title: 'Student details' })

const route = useRoute()
const { students } = useCrudPageDemo()
const student = computed(() => students.value.find(item => item.id === route.params.id))
const initials = computed(() => student.value?.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() ?? '')
const activeTab = ref('details')
const tabLabels: Record<string, string> = { parent: 'Parent information', session: 'Session', coin: 'Coin', history: 'Learning history' }
const editing = ref(false)
const confirming = ref(false)
const valid = ref(false)
const feedback = ref('')
const form = reactive({ name: '', username: '', phone: '', status: 'Active' as CrudPageStudent['status'] })
const required = (value: string) => !!value?.trim() || 'This field is required.'
const fields = computed(() => [
  { label: 'Username', value: student.value?.username },
  { label: 'Branch', value: null },
  { label: 'Full name', value: student.value?.name },
  { label: 'Nickname', value: null },
  { label: 'Birthday', value: null },
  { label: 'Age', value: null },
  { label: 'Gender', value: null },
  { label: 'Phone number', value: student.value?.phone },
  { label: 'School', value: null },
])
const openEdit = () => {
  if (!student.value) return
  Object.assign(form, { name: student.value.name, username: student.value.username, phone: student.value.phone, status: student.value.status })
  editing.value = true
}
const save = () => {
  if (!student.value || !valid.value || !form.name.trim() || !form.username.trim() || !form.phone.trim()) return
  Object.assign(student.value, { name: form.name.trim(), username: form.username.trim(), phone: form.phone.trim(), status: form.status })
  feedback.value = 'Student information updated in this demo.'
  editing.value = false
}
const toggleStatus = () => {
  if (!student.value) return
  student.value.status = student.value.status === 'Active' ? 'Inactive' : 'Active'
  feedback.value = `Student status changed to ${student.value.status} in this demo.`
  confirming.value = false
}
const copyUsername = async () => {
  if (!student.value) return
  try {
    await navigator.clipboard.writeText(student.value.username)
    feedback.value = 'Username copied.'
  }
  catch { feedback.value = 'Could not copy username. Select the text to copy it.' }
}
</script>

<template>
  <section>
    <template v-if="student">
      <header class="d-flex align-center gap-4 mb-6">
        <VBtn icon="ri-arrow-left-line" variant="outlined" color="secondary" size="small" aria-label="Back to student list" :to="{ name: 'page-template-crud-page' }" />
        <VAvatar size="34" color="secondary" variant="tonal" aria-hidden="true">{{ initials }}</VAvatar>
        <div><h1 class="text-h5 mb-0">{{ student.name }}</h1><p class="text-body-2 text-medium-emphasis mb-0">{{ student.username }}</p></div>
      </header>
      <p v-if="feedback" role="status" class="text-body-2 mb-4">{{ feedback }}</p>
      <VTabs v-model="activeTab" class="v-tabs-bordered mb-6" aria-label="Student information">
        <VTab value="details">Student details</VTab>
        <VTab value="parent">Parent information</VTab>
        <VTab value="session">Session</VTab>
        <VTab value="coin">Coin</VTab>
        <VTab value="history">Learning history</VTab>
      </VTabs>
      <div v-if="activeTab === 'details'">
        <VRow>
          <VCol cols="12" md="8">
            <VCard variant="outlined" class="bg-surface rounded-lg pa-6">
              <div class="d-flex align-center flex-wrap gap-3 mb-4">
                <VAvatar color="primary" variant="tonal" rounded size="32" aria-hidden="true"><VIcon icon="ri-contacts-line" size="20" /></VAvatar>
                <h2 class="text-h5 flex-grow-1">Basic info</h2>
                <VBtn variant="text" prepend-icon="ri-pencil-line" @click="openEdit">Edit student info</VBtn>
              </div>
              <dl class="detail-fields ms-md-11">
                <div v-for="field in fields" :key="field.label" class="detail-row py-4 border-b">
                  <dt class="text-body-1 font-weight-medium">{{ field.label }}</dt>
                  <dd class="text-body-1 ms-0 detail-value">{{ field.value || 'Not available' }}</dd>
                  <IconBtn v-if="field.label === 'Username'" color="primary" aria-label="Copy username" @click="copyUsername"><VIcon icon="ri-checkbox-multiple-blank-line" size="20" /><VTooltip activator="parent" location="top">Copy username</VTooltip></IconBtn>
                </div>
              </dl>
            </VCard>
          </VCol>
          <VCol cols="12" md="4">
            <VCard variant="outlined" class="bg-surface rounded-lg pa-6">
              <dl class="d-flex flex-column gap-5">
                <div><dt class="text-body-2 text-medium-emphasis mb-1">Student status</dt><dd class="ms-0"><VChip size="small" variant="tonal" :color="student.status === 'Active' ? 'success' : 'secondary'">{{ student.status }}</VChip></dd></div>
                <div><dt class="text-body-2 text-medium-emphasis mb-1">Country</dt><dd class="text-body-1 ms-0">Not available</dd></div>
                <div><dt class="text-body-2 text-medium-emphasis mb-1">Register date</dt><dd class="text-body-1 ms-0">{{ student.registeredAt }}</dd></div>
                <div><dt class="text-body-2 text-medium-emphasis mb-1">Course</dt><dd class="text-body-1 ms-0">Not available</dd></div>
              </dl>
              <VDivider class="my-6" />
              <VBtn block variant="outlined" prepend-icon="ri-refresh-line" @click="confirming = true">{{ student.status === 'Active' ? 'Deactivate student' : 'Activate student' }}</VBtn>
              <p class="text-body-2 text-medium-emphasis mt-4 mb-0">Password management is not available in this demo.</p>
            </VCard>
          </VCol>
        </VRow>
      </div>
      <VCard v-else variant="outlined" class="bg-surface pa-6 rounded-lg"><h2 class="text-h5 mb-2">{{ tabLabels[activeTab] }}</h2><p class="text-body-1 text-medium-emphasis mb-0">This information is not available in the local demo.</p></VCard>
      <VDialog v-model="editing" max-width="520"><VCard title="Edit student"><VForm v-model="valid" @submit.prevent="save"><VCardText class="d-flex flex-column gap-4"><VTextField v-model="form.name" label="Name" :rules="[required]" /><VTextField v-model="form.username" label="Username" :rules="[required]" /><VTextField v-model="form.phone" label="Phone number" :rules="[required]" /><VSelect v-model="form.status" label="Status" :items="['Active', 'Inactive']" /></VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="editing = false">Cancel</VBtn><VBtn type="submit" :disabled="!valid">Save</VBtn></VCardActions></VForm></VCard></VDialog>
      <VDialog v-model="confirming" max-width="480"><VCard :title="student.status === 'Active' ? 'Deactivate student?' : 'Activate student?'"><VCardText>Change the status of {{ student.name }} in this demo?</VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="confirming = false">Cancel</VBtn><VBtn @click="toggleStatus">Confirm</VBtn></VCardActions></VCard></VDialog>
    </template>
    <template v-else><VAlert type="warning" variant="tonal" title="Student not found">This demo record may have been deleted or reset.</VAlert><VBtn class="mt-4" variant="outlined" :to="{ name: 'page-template-crud-page' }">Back to list</VBtn></template>
  </section>
</template>

<style scoped>
.detail-row { display: grid; grid-template-columns: minmax(120px, 240px) minmax(0, 1fr) auto; gap: 16px; align-items: center; }
.detail-value { overflow-wrap: anywhere; }
@media (max-width: 599px) { .detail-row { grid-template-columns: minmax(0, 1fr) auto; gap: 4px 16px; } .detail-row dt { grid-column: 1 / -1; } }
</style>
