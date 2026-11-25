<script setup lang="ts">
import { studentRecords } from '@/data/students'
import { avatarText } from '@core/utils/formatters'

definePageMeta({ sidebarRoute: 'page-template-detail-page' })
useHead({ title: 'Detail page template' })

const route = useRoute()
const router = useRouter()
const student = computed(() => studentRecords.find(item => item.id === (route.query.id ?? '1')))
type DetailTab = 'details' | 'session' | 'books'
const activeTab = computed<DetailTab>({
  get: () => route.query.tab === 'session' || route.query.tab === 'books' ? route.query.tab : 'details',
  set: tab => { void router.replace({ query: { ...route.query, tab } }) },
})
const tabs = [
  { value: 'details', title: 'Student details' },
  { value: 'session', title: 'Session' },
  { value: 'books', title: 'Books' },
]
const isReferenceStudent = computed(() => student.value?.id === '1')
const today = useState('detail-template-today', () => new Date().toISOString().slice(0, 10))
const age = computed(() => {
  const [year, month, day] = today.value.split('-').map(Number)
  return year - 2022 - (month === 1 && day < 28 ? 1 : 0)
})
const fields = computed(() => [
  { label: 'Username', value: student.value?.studentId, copy: true },
  { label: 'Branch', value: isReferenceStudent.value ? 'Philipine ASIA' : undefined },
  { label: 'Full name', value: student.value?.name },
  { label: 'Nickname', value: student.value?.name.split(' ')[0] },
  { label: 'Birthday', value: isReferenceStudent.value ? 'January 28, 2022' : undefined },
  { label: 'Age', value: isReferenceStudent.value ? `${age.value}` : undefined },
  { label: 'Gender', value: isReferenceStudent.value ? 'Male' : undefined },
  { label: 'Phone number', value: isReferenceStudent.value ? '08918298392' : undefined },
  { label: 'School', value: undefined },
])
const settings = computed(() => [
  { label: 'Country', value: isReferenceStudent.value ? 'Indonesia' : undefined },
  { label: 'Start date', value: isReferenceStudent.value ? 'Oct 11, 2023' : undefined },
  { label: 'Course', value: student.value?.course },
])
const copying = ref(false)
const snackbar = ref(false)
const feedback = ref('')
const feedbackColor = ref<'success' | 'error'>('success')
const copyUsername = async () => {
  if (!student.value || copying.value) return
  copying.value = true
  try {
    await navigator.clipboard.writeText(student.value.studentId)
    feedback.value = 'Username copied.'
    feedbackColor.value = 'success'
  }
  catch {
    feedback.value = 'Could not copy username. Select the username and copy it manually.'
    feedbackColor.value = 'error'
  }
  finally {
    copying.value = false
    snackbar.value = true
  }
}
</script>

<template>
  <section class="detail-template">
    <template v-if="student">
      <header class="d-flex align-center gap-4 mb-6">
        <IconBtn :to="{ name: 'page-template-crud-page' }" variant="outlined" color="primary" aria-label="Back to CRUD page">
          <VIcon icon="ri-arrow-left-line" aria-hidden="true" />
        </IconBtn>
        <VAvatar size="34" color="grey-50" class="detail-avatar" aria-hidden="true">
          <span class="text-body-2 text-high-emphasis">{{ avatarText(student.name).slice(0, 2) }}</span>
        </VAvatar>
        <div class="detail-identity flex-grow-1">
          <h1 class="text-h5 font-weight-medium mb-0">{{ student.name }}</h1>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ isReferenceStudent ? '🇮🇩 Indonesia' : 'Country not available' }}</p>
        </div>
        <TemplatePrompt template="detail" />
      </header>

      <VTabs v-model="activeTab" class="v-tabs-bordered mb-6" aria-label="Student information">
        <VTab v-for="tab in tabs" :id="`detail-tab-${tab.value}`" :key="tab.value" :value="tab.value" :aria-controls="`detail-panel-${tab.value}`">{{ tab.title }}</VTab>
      </VTabs>

      <VWindow v-model="activeTab" :touch="false">
        <VWindowItem id="detail-panel-details" value="details" role="tabpanel" aria-labelledby="detail-tab-details" :transition="false" :reverse-transition="false">
          <VRow>
            <VCol cols="12" md="8">
              <VCard variant="outlined" :elevation="0" class="detail-card bg-surface pa-6">
                <div class="d-flex align-center gap-3 mb-4">
                  <VAvatar color="primary" variant="tonal" rounded size="32" aria-hidden="true"><VIcon icon="ri-contacts-line" size="20" /></VAvatar>
                  <h2 class="text-h5 font-weight-medium">Basic info</h2>
                </div>
                <dl>
                  <div v-for="field in fields" :key="field.label" class="detail-field py-4">
                    <dt class="text-body-1 font-weight-medium">{{ field.label }}</dt>
                    <dd class="text-body-1 ms-0 detail-value" :class="{ 'text-medium-emphasis': !field.value }">{{ field.value || 'Not available' }}</dd>
                    <IconBtn v-if="field.copy" color="secondary" aria-label="Copy username" :loading="copying" @click="copyUsername">
                      <VIcon icon="ri-checkbox-multiple-blank-line" size="20" aria-hidden="true" />
                      <VTooltip activator="parent">Copy username</VTooltip>
                    </IconBtn>
                  </div>
                </dl>
              </VCard>
            </VCol>
            <VCol cols="12" md="4">
              <VCard variant="outlined" :elevation="0" class="detail-card bg-surface pa-6">
                <h2 class="text-h5 font-weight-medium mb-6">Settings</h2>
                <dl class="d-flex flex-column gap-6">
                  <div>
                    <dt class="text-body-2 text-medium-emphasis mb-2">Student status</dt>
                    <dd class="ms-0"><VChip v-if="isReferenceStudent" color="success" variant="tonal" size="small">Active</VChip><span v-else class="text-body-1 text-medium-emphasis">Not available</span></dd>
                  </div>
                  <div v-for="field in settings" :key="field.label">
                    <dt class="text-body-2 text-medium-emphasis mb-2">{{ field.label }}</dt>
                    <dd class="text-body-1 ms-0 detail-value" :class="{ 'text-medium-emphasis': !field.value }">{{ field.value || 'Not available' }}</dd>
                  </div>
                </dl>
              </VCard>
            </VCol>
          </VRow>
        </VWindowItem>
        <VWindowItem v-for="tab in tabs.filter(item => item.value !== 'details')" :id="`detail-panel-${tab.value}`" :key="tab.value" :value="tab.value" role="tabpanel" :aria-labelledby="`detail-tab-${tab.value}`" :transition="false" :reverse-transition="false">
          <VCard variant="outlined" :elevation="0" class="detail-card bg-surface pa-6">
            <h2 class="text-h5 mb-2">{{ tab.title }}</h2>
            <p class="text-body-1 text-medium-emphasis mb-4">{{ tab.title }} data is not included in this detail page template.</p>
            <VBtn variant="outlined" @click="activeTab = 'details'">Back to student details</VBtn>
          </VCard>
        </VWindowItem>
      </VWindow>
    </template>
    <template v-else>
      <TemplatePrompt template="detail" />
      <h1 class="text-h4 mb-4">Student not found</h1>
      <VAlert type="warning" variant="tonal">No demo student matches this ID. Open the example student to preview the template.</VAlert>
      <VBtn class="mt-4" :to="{ name: 'page-template-detail-page', query: { id: '1', tab: 'details' } }">Open example student</VBtn>
    </template>
    <VSnackbar v-model="snackbar" :color="feedbackColor" :timeout="4000">
      {{ feedback }}
      <template #actions><VBtn variant="text" :color="feedbackColor === 'error' ? 'on-error' : 'on-success'" @click="snackbar = false">Close</VBtn></template>
    </VSnackbar>
  </section>
</template>

<style scoped>
.detail-card { border-radius: 12px; }
.detail-avatar { border: 1px solid rgba(var(--v-theme-on-surface), 0.08); }
.detail-identity { min-inline-size: 0; overflow-wrap: anywhere; }
.detail-field { display: grid; grid-template-columns: minmax(120px, 1fr) minmax(0, 1fr) 40px; align-items: center; gap: 16px; }
.detail-field:not(:last-child) { border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.detail-value { overflow-wrap: anywhere; }
@media (max-width: 599px) {
  .detail-field { grid-template-columns: minmax(0, 1fr) 40px; gap: 4px 16px; }
  .detail-field dt { grid-column: 1 / -1; }
}
</style>
