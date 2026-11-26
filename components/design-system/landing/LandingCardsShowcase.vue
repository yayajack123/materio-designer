<script setup lang="ts">
import { emailValidator, requiredValidator } from '@core/utils/validators'
import mainNavItems from '@/navigation/vertical'

interface TeamMember {
  id: string
  initials: string
  name: string
  email: string
  role: 'Owner' | 'Editor' | 'Viewer'
}

withDefaults(defineProps<{ gallery?: boolean }>(), { gallery: false })

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const accountFormValid = ref(false)
const accountForm = reactive({
  fullName: 'Avery Chen',
  email: 'avery@materio.local',
  role: 'Design Systems',
})

const roleOptions = ['Design Systems', 'Frontend Engineering', 'Product Design', 'QA & Accessibility']
const accessOptions: TeamMember['role'][] = ['Owner', 'Editor', 'Viewer']

const teamMembers = ref<TeamMember[]>([
  { id: 'tm-1', initials: 'AC', name: 'Avery Chen', email: 'avery@materio.local', role: 'Owner' },
  { id: 'tm-2', initials: 'RN', name: 'Raka Nugraha', email: 'raka@materio.local', role: 'Editor' },
  { id: 'tm-3', initials: 'MS', name: 'Maya Sari', email: 'maya@materio.local', role: 'Viewer' },
])

const inviteEmail = ref('')
const inviteError = ref('')

const gapStep = ref(4)
const gapPixels = computed(() => gapStep.value * 4)

const notifications = reactive({
  tokenUpdates: true,
  componentReleases: true,
  accessibilityChecks: true,
  quietHours: false,
})

const componentGroup = mainNavItems.find(item => item.title === 'Component')
const componentCount = componentGroup && 'children' in componentGroup ? componentGroup.children.length : 0
const catalogMetrics = [
  { label: 'Foundations', value: '4', detail: 'Typography, color, spacing, icons', icon: 'ri-palette-line', color: 'primary' },
  { label: 'Components', value: String(componentCount), detail: 'Documented Vuetify & custom UI', icon: 'ri-layout-grid-line', color: 'success' },
  { label: 'Templates', value: '2', detail: 'CRUD flow & filterable class list', icon: 'ri-window-line', color: 'info' },
]

const submitAccountDemo = () => {
  if (!accountFormValid.value) return
  emit('notify', `Workspace profile saved for ${accountForm.fullName}.`)
}

const updateMemberRole = (member: TeamMember, nextRole: TeamMember['role']) => {
  member.role = nextRole
  emit('notify', `${member.name} updated to ${nextRole}.`)
}

const addInvite = () => {
  const value = inviteEmail.value.trim()
  const validEmail = emailValidator(value)
  if (!value || validEmail !== true) {
    inviteError.value = typeof validEmail === 'string' ? validEmail : 'Enter a valid email address'
    return
  }

  inviteError.value = ''
  const namePart = value.split('@')[0].replace(/[._-]+/g, ' ')
  const formattedName = namePart
    .split(' ')
    .filter(Boolean)
    .map(part => part[0].toUpperCase() + part.slice(1))
    .join(' ') || 'New Member'
  const initials = formattedName
    .split(' ')
    .slice(0, 2)
    .map(part => part[0])
    .join('')
    .toUpperCase()

  teamMembers.value.push({
    id: `tm-${Date.now()}`,
    initials,
    name: formattedName,
    email: value,
    role: 'Viewer',
  })
  inviteEmail.value = ''
  emit('notify', `Invitation queued for ${value} in this demo.`)
}

const saveNotifications = () => {
  emit('notify', 'Notification preferences updated for this session.')
}
</script>

<template>
  <VRow :class="{ 'showcase-gallery': gallery }">
    <!-- Column 1: Workspace profile form + System coverage -->
    <VCol cols="12" md="6" lg="4">
      <div class="showcase-column d-flex flex-column gap-6">
        <VCard variant="outlined" class="bg-surface showcase-card">
          <VCardText class="pa-6">
            <div class="d-flex align-center justify-space-between gap-3 mb-5">
              <div><h3 class="text-h6 mb-1">Total revenue</h3><p class="text-body-2 text-medium-emphasis mb-0">Digital products · Sample data</p></div>
              <VAvatar color="primary" variant="tonal" rounded size="40" aria-hidden="true"><VIcon icon="ri-bar-chart-box-line" size="20" /></VAvatar>
            </div>
            <div class="text-h4 font-weight-medium">NTD 25,980</div>
            <p class="text-body-2 text-medium-emphasis mt-1 mb-5">Revenue for May 2025</p>
            <div class="revenue-chart" role="img" aria-label="Sample weekly revenue: 40,000, 50,000, 55,000 and 33,000 NTD">
              <div v-for="week in [{ label: 'Week 1', height: 73 }, { label: 'Week 2', height: 91 }, { label: 'Week 3', height: 100 }, { label: 'Week 4', height: 60 }]" :key="week.label" class="revenue-chart__item">
                <div class="revenue-chart__track"><span :style="{ height: `${week.height}%` }" /></div>
                <span class="text-caption text-medium-emphasis">{{ week.label }}</span>
              </div>
            </div>
          </VCardText>
        </VCard>
        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <h3 class="text-h6 mb-1">Create workspace profile</h3>
            <p class="text-body-2 text-medium-emphasis mb-5">
              Test outlined inputs, validation rules, and primary button contrast.
            </p>

            <VForm v-model="accountFormValid" @submit.prevent="submitAccountDemo">
              <div class="d-flex flex-column gap-4">
                <VTextField
                  v-model="accountForm.fullName"
                  label="Full name"
                  placeholder="Enter your name"
                  :rules="[requiredValidator]"
                />
                <VTextField
                  v-model="accountForm.email"
                  label="Work email"
                  type="email"
                  placeholder="name@company.com"
                  :rules="[requiredValidator, emailValidator]"
                />
                <VSelect
                  v-model="accountForm.role"
                  label="Discipline"
                  :items="roleOptions"
                />
                <div class="d-flex flex-wrap justify-end gap-3 pt-1">
                  <VBtn
                    type="button"
                    variant="outlined"
                    @click="accountForm.fullName = ''; accountForm.email = ''"
                  >
                    Clear
                  </VBtn>
                  <VBtn
                    type="submit"
                    color="primary"
                    :disabled="!accountFormValid"
                  >
                    Save profile
                  </VBtn>
                </div>
              </div>
            </VForm>
          </VCardText>
        </VCard>

        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <div class="d-flex align-center justify-space-between gap-2 mb-4">
              <div>
                <h3 class="text-h6 mb-1">Catalog coverage</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Live inventory wired to starter routes.
                </p>
              </div>
              <VChip size="small" color="primary" variant="tonal">v1.1</VChip>
            </div>

            <div class="d-flex flex-column gap-3">
              <div
                v-for="metric in catalogMetrics"
                :key="metric.label"
                class="d-flex align-center justify-space-between gap-3 pa-3 rounded border"
              >
                <div class="d-flex align-center gap-3 min-w-0">
                  <VAvatar :color="metric.color" variant="tonal" rounded size="38" aria-hidden="true">
                    <VIcon :icon="metric.icon" size="20" />
                  </VAvatar>
                  <div class="min-w-0">
                    <div class="text-body-1 font-weight-medium">{{ metric.label }}</div>
                    <div class="text-body-2 text-medium-emphasis">{{ metric.detail }}</div>
                  </div>
                </div>
                <span class="text-h5 font-weight-medium">{{ metric.value }}</span>
              </div>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>

    <!-- Column 2: Team access + Interactive spacing slider -->
    <VCol cols="12" md="6" lg="4">
      <div class="showcase-column d-flex flex-column gap-6">
        <VCard variant="outlined" class="bg-surface showcase-card">
          <VCardText class="pa-6">
            <div class="d-flex align-center justify-space-between gap-3 mb-4">
              <div><h3 class="text-h6 mb-1">Order overview</h3><p class="text-body-2 text-medium-emphasis mb-0">Digital products · Sample data</p></div>
              <VChip color="primary" variant="tonal" size="small">200 orders</VChip>
            </div>
            <div class="order-stats">
              <div v-for="stat in [{ label: 'Waiting payment', value: 20, icon: 'ri-bank-card-2-line', color: 'warning' }, { label: 'In process', value: 13, icon: 'ri-loader-2-line', color: 'info' }, { label: 'Completed', value: 42, icon: 'ri-check-line', color: 'success' }, { label: 'Cancelled', value: 27, icon: 'ri-close-line', color: 'error' }]" :key="stat.label" class="order-stat pa-3">
                <VAvatar :color="stat.color" variant="tonal" rounded size="32" aria-hidden="true"><VIcon :icon="stat.icon" size="18" /></VAvatar>
                <span class="text-h5 font-weight-medium">{{ stat.value }}</span>
                <span class="text-body-2 text-medium-emphasis">{{ stat.label }}</span>
              </div>
            </div>
            <VBtn :to="{ name: 'page-template-digital-dashboard' }" variant="outlined" block class="mt-5">View dashboard</VBtn>
          </VCardText>
        </VCard>
        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <h3 class="text-h6 mb-1">Team access</h3>
            <p class="text-body-2 text-medium-emphasis mb-5">
              Manage collaborator roles or add a demo member.
            </p>

            <div class="d-flex gap-2 align-start mb-5">
              <VTextField
                v-model="inviteEmail"
                label="Collaborator email"
                placeholder="teammate@materio.local"
                density="compact"
                :error-messages="inviteError"
                class="flex-grow-1"
                @keydown.enter.prevent="addInvite"
              />
              <VBtn
                type="button"
                color="primary"
                variant="tonal"
                @click="addInvite"
              >
                Invite
              </VBtn>
            </div>

            <div class="d-flex flex-column gap-4">
              <div
                v-for="member in teamMembers"
                :key="member.id"
                class="d-flex align-center justify-space-between flex-wrap gap-3"
              >
                <div class="d-flex align-center gap-3 min-w-0">
                  <VAvatar color="primary" variant="tonal" size="36" aria-hidden="true">
                    <span class="text-body-2 font-weight-medium">{{ member.initials }}</span>
                  </VAvatar>
                  <div class="min-w-0">
                    <div class="text-body-1 font-weight-medium text-truncate">{{ member.name }}</div>
                    <div class="text-body-2 text-medium-emphasis text-truncate">{{ member.email }}</div>
                  </div>
                </div>

                <VSelect
                  :model-value="member.role"
                  :items="accessOptions"
                  :aria-label="`Access role for ${member.name}`"
                  density="compact"
                  hide-details
                  class="member-role-select"
                  @update:model-value="val => updateMemberRole(member, val)"
                />
              </div>
            </div>
          </VCardText>
        </VCard>

        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <div class="d-flex align-center justify-space-between gap-2 mb-2">
              <h3 class="text-h6 mb-0">4px spacing rhythm</h3>
              <VChip size="small" color="secondary" variant="tonal">
                <code>gap-{{ gapStep }}</code> ({{ gapPixels }}px)
              </VChip>
            </div>
            <p class="text-body-2 text-medium-emphasis mb-4">
              Adjust the Vuetify <code>$spacer</code> multiplier to inspect layout density.
            </p>

            <VSlider
              v-model="gapStep"
              :min="1"
              :max="6"
              :step="1"
              show-ticks="always"
              color="primary"
              aria-label="Spacing step multiplier"
              hide-details
              class="mb-4"
            />

            <div
              class="d-flex flex-wrap pa-4 rounded border bg-background"
              :style="{ gap: `${gapPixels}px` }"
            >
              <VChip color="primary" variant="flat" size="small">Primary</VChip>
              <VChip color="success" variant="tonal" size="small">Approved</VChip>
              <VChip color="warning" variant="tonal" size="small">Pending</VChip>
              <VChip color="info" variant="tonal" size="small">Synced</VChip>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>

    <!-- Column 3: Notification preferences + Brand token callout -->
    <VCol cols="12" lg="4">
      <div class="showcase-column d-flex flex-column gap-6">
        <VCard variant="outlined" class="bg-surface showcase-card">
          <VCardText class="pa-6">
            <h3 class="text-h6 mb-1">Payment methods</h3>
            <p class="text-body-2 text-medium-emphasis mb-5">Orders by method · Sample data</p>
            <div class="d-flex flex-column gap-4">
              <div v-for="method in [{ name: 'BCA', detail: 'Manual transfer', count: 400 }, { name: 'OK Mart', detail: 'Convenience store', count: 320 }, { name: '7-11', detail: 'Convenience store', count: 200 }]" :key="method.name" class="d-flex align-center gap-3">
                <VAvatar color="primary" variant="tonal" rounded size="36" aria-hidden="true"><VIcon icon="ri-bank-card-line" size="18" /></VAvatar>
                <div class="flex-grow-1 min-w-0"><div class="text-body-1 font-weight-medium">{{ method.name }}</div><div class="text-body-2 text-medium-emphasis">{{ method.detail }}</div></div>
                <span class="text-body-1 font-weight-medium">{{ method.count }}</span>
              </div>
            </div>
          </VCardText>
        </VCard>
        <VCard variant="outlined" class="bg-surface">
          <VCardText class="pa-6">
            <h3 class="text-h6 mb-1">Review notifications</h3>
            <p class="text-body-2 text-medium-emphasis mb-5">
              Configure which design-system checks notify your team.
            </p>

            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-center justify-space-between gap-3">
                <div>
                  <div class="text-body-1 font-weight-medium">Token updates</div>
                  <div class="text-body-2 text-medium-emphasis">Changes to semantic colors or typography</div>
                </div>
                <VSwitch
                  v-model="notifications.tokenUpdates"
                  color="primary"
                  hide-details
                  aria-label="Token updates notifications"
                />
              </div>

              <VDivider />

              <div class="d-flex align-center justify-space-between gap-3">
                <div>
                  <div class="text-body-1 font-weight-medium">Component releases</div>
                  <div class="text-body-2 text-medium-emphasis">New documented states and API examples</div>
                </div>
                <VSwitch
                  v-model="notifications.componentReleases"
                  color="primary"
                  hide-details
                  aria-label="Component releases notifications"
                />
              </div>

              <VDivider />

              <div class="d-flex align-center justify-space-between gap-3">
                <div>
                  <div class="text-body-1 font-weight-medium">Accessibility checks</div>
                  <div class="text-body-2 text-medium-emphasis">Contrast, keyboard focus, and ARIA alerts</div>
                </div>
                <VSwitch
                  v-model="notifications.accessibilityChecks"
                  color="primary"
                  hide-details
                  aria-label="Accessibility checks notifications"
                />
              </div>

              <VCheckbox
                v-model="notifications.quietHours"
                label="Mute non-critical alerts outside working hours"
                hide-details
                class="mt-1"
              />

              <div class="d-flex justify-end pt-2">
                <VBtn type="button" color="primary" @click="saveNotifications">
                  Save preferences
                </VBtn>
              </div>
            </div>
          </VCardText>
        </VCard>

        <VCard variant="outlined" class="brand-tint-card">
          <VCardText class="pa-6">
            <div class="d-flex align-start gap-3 mb-3">
              <VAvatar color="primary" variant="tonal" rounded size="38" aria-hidden="true">
                <VIcon icon="ri-contrast-drop-2-line" size="20" />
              </VAvatar>
              <div>
                <h3 class="text-h6 mb-1">Per-deployment brand token</h3>
                <p class="text-body-2 text-medium-emphasis mb-0">
                  Set <code>NUXT_PUBLIC_BRAND_PRIMARY</code> once—light, dark, and opacity variants derive automatically while keeping <code>on-primary</code> readable.
                </p>
              </div>
            </div>

            <div class="d-flex flex-wrap gap-3 mt-4">
              <VBtn
                size="small"
                color="primary"
                :to="{ name: 'design-system-color-system' }"
              >
                Inspect color tokens
              </VBtn>
              <VBtn
                size="small"
                variant="outlined"
                :to="{ name: 'components-buttons' }"
              >
                Button docs
              </VBtn>
            </div>
          </VCardText>
        </VCard>
      </div>
    </VCol>
  </VRow>
</template>

<style scoped lang="scss">
.showcase-column { block-size: 100%; }
.showcase-column > :last-child { flex-grow: 1; }

.showcase-gallery {
  display: grid;
  grid-template-columns: repeat(3, minmax(320px, 1fr));
  align-items: start;
  gap: 24px;
  margin: 0;

  > .v-col-12 {
    min-inline-size: 0;
    max-inline-size: none;
    inline-size: auto;
    padding: 0;
  }

  .showcase-column {
    block-size: auto;
  }

  .showcase-column > :last-child {
    flex-grow: 0;
  }
}

:deep(.v-card) {
  border-radius: 16px;
  box-shadow: none;
}

.revenue-chart { display: flex; gap: 12px; align-items: end; block-size: 148px; }
.revenue-chart__item { display: flex; flex: 1; min-inline-size: 0; block-size: 100%; flex-direction: column; gap: 8px; text-align: center; }
.revenue-chart__track { display: flex; flex: 1; align-items: end; justify-content: center; border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); }
.revenue-chart__track span { display: block; inline-size: min(100%, 44px); border-radius: 6px 6px 0 0; background: rgb(var(--v-theme-primary)); }
.order-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.order-stat { display: grid; grid-template-columns: 32px 1fr; align-items: center; gap: 8px; border-radius: 8px; background: rgb(var(--v-theme-background)); }
.order-stat > :last-child { grid-column: 1 / -1; }
.member-role-select {
  flex: 0 0 132px;
  max-inline-size: 100%;
}

.min-w-0 {
  min-inline-size: 0;
}

.brand-tint-card {
  border-color: rgba(var(--v-theme-primary), 0.24) !important;
  background-color: rgba(var(--v-theme-primary), 0.08) !important;
}
</style>
