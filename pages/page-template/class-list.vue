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
const search = ref('')
const grade = ref<string | null>(null)
const course = ref<string | null>(null)
const status = ref<string | null>(null)
const scheduleItem = ref<ClassExample | null>(null)
const scheduleOpen = ref(false)
const tabs = ['Group', 'Adaptive', 'Idle'].map(value => ({ label: value, value }))
const headers = [
  { title: 'Class', key: 'name' },
  { title: 'Teacher', key: 'teacher' },
  { title: 'Schedule', key: 'schedule' },
  { title: 'Students', key: 'students' },
  { title: 'Status', key: 'status' },
  { title: 'Action', key: 'action', sortable: false, align: 'center' as const },
]
const gradeOptions = [...new Set(classes.map(item => item.grade))]
const courseOptions = [...new Set(classes.map(item => item.course))]
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
    <UiSectionHeader title="Class" title-class="text-h4" description="Manage and review class data.">
      <template #actions><VBtn disabled>Add group class</VBtn></template>
    </UiSectionHeader>
    <UiTableView v-model:active-tab="activeTab" title="" :tabs="tabs" :headers="headers" :items="filtered" :items-per-page="10" card-class="border" flat @reset-filters="resetFilters">
      <template #filters>
        <VTextField v-model="search" label="Search class name" clearable class="class-filter" />
        <VSelect v-model="grade" label="Grade" :items="gradeOptions" clearable class="class-filter" />
        <VSelect v-model="course" label="Course" :items="courseOptions" clearable class="class-filter" />
        <VSelect v-model="status" label="Status" :items="['Active', 'Scheduled', 'Completed']" clearable class="class-filter" />
      </template>
      <template #item.name="{ item }"><div class="py-4"><p class="text-body-1 font-weight-medium mb-0">{{ item.name }}</p><p class="text-body-2 text-medium-emphasis mb-0">{{ item.program }}</p></div></template>
      <template #item.teacher="{ item }"><div class="d-flex align-center gap-3 py-4"><VAvatar size="34" color="secondary" variant="tonal" aria-hidden="true">{{ initials(item.teacher) }}</VAvatar><div><p class="text-body-1 font-weight-medium mb-0">{{ item.teacher }}</p><p class="text-body-2 text-medium-emphasis mb-0">{{ item.phone }}</p></div></div></template>
      <template #item.schedule="{ item }"><div class="py-4"><p class="text-body-1 mb-0">{{ item.schedule }}</p><VBtn variant="text" size="small" class="px-0" @click="showSchedule(item)">See schedule</VBtn></div></template>
      <template #item.students="{ item }">{{ item.students }} {{ item.students === 1 ? 'student' : 'students' }}</template>
      <template #item.status="{ item }"><VChip :color="statusColor(item.status)" size="small" variant="tonal">{{ item.status }}</VChip></template>
      <template #item.action="{ item }"><span class="text-body-2 text-medium-emphasis">Details unavailable</span><VBtn icon="ri-more-line" variant="outlined" color="secondary" size="small" disabled :aria-label="`Details unavailable for ${item.name}`" class="ms-2" /></template>
      <template #no-data><div class="pa-6">No classes match these filters. Reset the filters or choose another tab.</div></template>
    </UiTableView>
    <VDialog v-model="scheduleOpen" max-width="480"><VCard title="Class schedule"><VCardText><p class="text-body-1 font-weight-medium mb-2">{{ scheduleItem?.name }}</p><p class="text-body-1 mb-0">{{ scheduleItem?.scheduleDetail }}</p></VCardText><VCardActions><VSpacer /><VBtn @click="scheduleOpen = false">Close</VBtn></VCardActions></VCard></VDialog>
  </section>
</template>

<style scoped>
.class-filter { flex: 1 1 180px; min-width: 160px; }
</style>
