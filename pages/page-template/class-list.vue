<script setup lang="ts">
import UiTableView from '@/components/ui/UiTableView.vue'
import UiSectionHeader from '@/components/ui/UiSectionHeader.vue'

definePageMeta({ sidebarRoute: 'page-template-class-list' })
useHead({ title: 'Class List' })

interface ClassExample {
  id: string
  category: 'Group' | 'Adaptive' | 'Idle'
  name: string
  program: string
  teacher: string
  phone: string
  schedule: string
  scheduleDetail: string
  students: number
  grade: string
  course: string
  status: 'Active' | 'Scheduled' | 'Completed'
}

const classes: ClassExample[] = [
  { id: 'group-1', category: 'Group', name: 'Algebra group A', program: 'Coding foundations', teacher: 'Alex Morgan', phone: '0812-0000-0001', schedule: '3 times a week', scheduleDetail: 'Monday, Wednesday, Friday · 14:00–15:30', students: 5, grade: 'Grade 7', course: 'Coding', status: 'Active' },
  { id: 'group-2', category: 'Group', name: 'Design group B', program: 'Digital design', teacher: 'Sam Taylor', phone: '0812-0000-0002', schedule: '2 times a week', scheduleDetail: 'Tuesday, Thursday · 10:00–11:30', students: 8, grade: 'Grade 8', course: 'Design', status: 'Scheduled' },
  { id: 'adaptive-1', category: 'Adaptive', name: 'Coding adaptive A', program: 'Coding foundations', teacher: 'Jordan Lee', phone: '0812-0000-0003', schedule: 'Once a week', scheduleDetail: 'Saturday · 09:00–10:30', students: 1, grade: 'Grade 7', course: 'Coding', status: 'Active' },
  { id: 'adaptive-2', category: 'Adaptive', name: 'Design adaptive B', program: 'Digital design', teacher: 'Sam Taylor', phone: '0812-0000-0002', schedule: 'Once a week', scheduleDetail: 'Wednesday · 16:00–17:30', students: 1, grade: 'Grade 8', course: 'Design', status: 'Completed' },
  { id: 'idle-1', category: 'Idle', name: 'Coding class C', program: 'Coding foundations', teacher: 'Alex Morgan', phone: '0812-0000-0001', schedule: 'Once a week', scheduleDetail: 'Friday · 15:00–16:30', students: 2, grade: 'Grade 8', course: 'Coding', status: 'Scheduled' },
]
const activeTab = ref('Group')
const loading = ref(false)
const search = ref('')
const grade = ref<string | null>(null)
const course = ref<string | null>(null)
const status = ref<string | null>(null)
const scheduleItem = ref<ClassExample | null>(null)
const scheduleOpen = ref(false)
let loadingTimer: ReturnType<typeof setTimeout> | undefined

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

const tabs = computed(() => [
  { label: 'Group', value: 'Group', icon: 'ri-team-line', count: classes.filter(item => item.category === 'Group').length },
  { label: 'Adaptive', value: 'Adaptive', icon: 'ri-user-star-line', count: classes.filter(item => item.category === 'Adaptive').length },
  { label: 'Idle', value: 'Idle', icon: 'ri-time-line', count: classes.filter(item => item.category === 'Idle').length, badgeColor: activeTab.value === 'Idle' ? 'warning' : undefined },
])
const headers = [
  { title: 'Class', key: 'name' },
  { title: 'Teacher', key: 'teacher' },
  { title: 'Schedule', key: 'schedule' },
  { title: 'Students', key: 'students' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action', sortable: false, align: 'center' as const, width: '160px' },
]
const gradeOptions = [...new Set(classes.map(item => item.grade))]
const courseOptions = [...new Set(classes.map(item => item.course))]
const hasActiveFilters = computed(() => Boolean(search.value?.trim() || grade.value || course.value || status.value))
const filtered = computed(() => {
  const query = (search.value || '').trim().toLowerCase()
  return classes.filter(item => item.category === activeTab.value
    && (!query || item.name.toLowerCase().includes(query))
    && (!grade.value || item.grade === grade.value)
    && (!course.value || item.course === course.value)
    && (!status.value || item.status === status.value))
})
const initials = (name: string) => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
const resetFilters = () => { search.value = ''; grade.value = null; course.value = null; status.value = null }
const showSchedule = (item: ClassExample) => { scheduleItem.value = item; scheduleOpen.value = true }
const statusColor = (value: ClassExample['status']) => value === 'Active' ? 'success' : value === 'Scheduled' ? 'info' : 'secondary'
</script>

<template>
  <section>
    <UiSectionHeader class="template-header" title="Class" title-class="text-h4" description="Manage and review class data.">
      <template #actions>
        <TemplatePrompt template="classes" />
        <VBtn icon variant="outlined" color="primary" aria-label="Simulate loading" :disabled="loading" @click="simulateLoading"><VIcon icon="ri-refresh-line" aria-hidden="true" /><VTooltip activator="parent">Simulate loading</VTooltip></VBtn>
        <VBtn disabled>
          Add group class
        </VBtn>
      </template>
    </UiSectionHeader>
    <UiTableView
      v-model:active-tab="activeTab"
      title=""
      :tabs="tabs"
      :headers="headers"
      :items="filtered"
      :loading="loading"
      :reset-disabled="!hasActiveFilters"
      :items-per-page="10"
      @reset-filters="resetFilters"
    >
      <template #filters>
        <VTextField
          v-model="search"
          label="Search class name"
          prepend-inner-icon="ri-search-line"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter ui-table-filter--search"
        />
        <VSelect
          v-model="grade"
          label="Grade"
          :items="gradeOptions"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter"
        />
        <VSelect
          v-model="course"
          label="Course"
          :items="courseOptions"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter"
        />
        <VSelect
          v-model="status"
          label="Status"
          :items="['Active', 'Scheduled', 'Completed']"
          density="compact"
          hide-details
          clearable
          class="ui-table-filter"
        />
      </template>
      <template #item.name="{ item }">
        <div class="py-3">
          <p class="text-body-1 font-weight-medium text-high-emphasis mb-0">{{ item.name }}</p>
          <p class="text-body-2 text-medium-emphasis mb-0">{{ item.program }}</p>
        </div>
      </template>
      <template #item.teacher="{ item }">
        <div class="d-flex align-center gap-3 py-3">
          <VAvatar size="34" color="grey-50" class="avatar-subtle-border" aria-hidden="true">
            <span class="text-caption font-weight-medium text-high-emphasis">{{ initials(item.teacher) }}</span>
          </VAvatar>
          <div>
            <p class="text-body-1 font-weight-medium text-high-emphasis mb-0">{{ item.teacher }}</p>
            <p class="text-body-2 text-medium-emphasis mb-0">{{ item.phone }}</p>
          </div>
        </div>
      </template>
      <template #item.schedule="{ item }">
        <div class="d-flex flex-column align-start py-3">
          <p class="text-body-1 text-medium-emphasis mb-1">{{ item.schedule }}</p>
          <VBtn variant="text" color="primary" size="small" density="compact" class="px-0 font-weight-medium" @click="showSchedule(item)">
            See schedule
          </VBtn>
        </div>
      </template>
      <template #item.students="{ item }">
        <span class="text-body-1 text-high-emphasis">{{ item.students }} {{ item.students === 1 ? 'student' : 'students' }}</span>
      </template>
      <template #item.status="{ item }">
        <VChip :color="statusColor(item.status)" size="small" variant="tonal" class="font-weight-medium">
          {{ item.status }}
        </VChip>
      </template>
      <template #item.action="{ item }">
        <div class="d-flex align-center justify-center gap-2">
          <span class="text-body-2 text-medium-emphasis">Details unavailable</span>
          <VBtn
            icon
            variant="outlined"
            color="secondary"
            size="small"
            class="action-btn"
            disabled
            :aria-label="`Details unavailable for ${item.name}`"
          >
            <VIcon icon="ri-more-line" size="18" aria-hidden="true" />
          </VBtn>
        </div>
      </template>
      <template #no-data>
        <div class="py-6 text-center text-medium-emphasis">
          No classes match these filters. Reset the filters or choose another tab.
        </div>
      </template>
    </UiTableView>
    <VDialog v-model="scheduleOpen" max-width="480">
      <VCard title="Class schedule">
        <DialogCloseBtn aria-label="Close dialog" @click="scheduleOpen = false" />
        <VDivider />
        <VCardText class="pt-5 d-flex flex-column gap-3">
          <div>
            <p class="text-caption text-medium-emphasis mb-1">Class</p>
            <p class="text-body-1 font-weight-medium text-high-emphasis mb-0">{{ scheduleItem?.name }} · {{ scheduleItem?.program }}</p>
          </div>
          <div>
            <p class="text-caption text-medium-emphasis mb-1">Schedule</p>
            <p class="text-body-1 font-weight-medium text-primary mb-0">{{ scheduleItem?.scheduleDetail }}</p>
          </div>
        </VCardText>
        <VDivider />
        <VCardActions class="pa-4">
          <VSpacer />
          <VBtn @click="scheduleOpen = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
.avatar-subtle-border {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}
</style>
