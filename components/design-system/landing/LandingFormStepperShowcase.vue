<script setup lang="ts">
import AppStepper from '@/@core/components/AppStepper.vue'
import { alphaDashValidator, requiredValidator } from '@core/utils/validators'

const emit = defineEmits<{
  (e: 'notify', message: string): void
}>()

const currentStep = ref(0)

const steps = [
  { title: 'Module identity', subtitle: 'Title & route slug' },
  { title: 'Table & layout', subtitle: 'Responsive behavior' },
  { title: 'Review & scaffold', subtitle: 'Starter summary' },
]

const blueprint = reactive({
  title: 'Inventory Directory',
  slug: 'inventory-directory',
  navGroup: 'Page & Template',
  tableMode: 'mobile-cards' as 'mobile-cards' | 'scrollable',
  includeFilters: true,
})

const navGroupOptions = ['Foundation', 'Component', 'Page & Template']

const isStepOneValid = computed(() =>
  requiredValidator(blueprint.title) === true
  && requiredValidator(blueprint.slug) === true
  && alphaDashValidator(blueprint.slug) === true,
)

const canAdvance = computed(() => (currentStep.value === 0 ? isStepOneValid.value : true))

const generatedSnippet = computed(() => `<UiTableView
  title="${blueprint.title.trim() || 'Untitled'}"
  :headers="headers"
  :items="filteredItems"${blueprint.tableMode === 'mobile-cards' ? '\n  :mobile-cards="true"' : ''}${!blueprint.includeFilters ? '\n  hide-filters' : ''}
/>`)

const nextStep = () => {
  if (!canAdvance.value || currentStep.value >= steps.length - 1) return
  currentStep.value += 1
}

const prevStep = () => {
  if (currentStep.value <= 0) return
  currentStep.value -= 1
}

const resetWizard = () => {
  currentStep.value = 0
  blueprint.title = 'Inventory Directory'
  blueprint.slug = 'inventory-directory'
  blueprint.navGroup = 'Page & Template'
  blueprint.tableMode = 'mobile-cards'
  blueprint.includeFilters = true
  emit('notify', 'Blueprint stepper reset to defaults.')
}
</script>

<template>
  <VCard variant="outlined" class="bg-surface">
    <VCardText class="pa-6 pa-md-8">
      <div class="d-flex flex-wrap align-center justify-space-between gap-3 mb-6">
        <div>
          <h3 class="text-h5 mb-1">Page blueprint wizard</h3>
          <p class="text-body-2 text-medium-emphasis mb-0">
            Centered <code>AppStepper</code> paired with validated controls and keyboard-accessible step actions.
          </p>
        </div>
        <VBtn
          size="small"
          variant="outlined"
          :to="{ name: 'components-stepper' }"
        >
          Stepper docs
        </VBtn>
      </div>

      <AppStepper
        v-model:current-step="currentStep"
        :items="steps"
        :is-active-step-valid="canAdvance"
        layout="centered"
      />

      <p class="text-body-2 text-medium-emphasis text-center mt-4 mb-6" role="status">
        Step {{ currentStep + 1 }} of {{ steps.length }}: <strong class="text-high-emphasis">{{ steps[currentStep].title }}</strong>
      </p>

      <VDivider class="mb-6" />

      <!-- Step 1 -->
      <VRow v-if="currentStep === 0">
        <VCol cols="12" md="6">
          <VTextField
            v-model="blueprint.title"
            label="Page title"
            placeholder="e.g. Student Directory"
            :rules="[requiredValidator]"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VTextField
            v-model="blueprint.slug"
            label="Route slug"
            placeholder="e.g. student-directory"
            :rules="[requiredValidator, alphaDashValidator]"
          />
        </VCol>
        <VCol cols="12" md="6">
          <VSelect
            v-model="blueprint.navGroup"
            label="Navigation group"
            :items="navGroupOptions"
          />
        </VCol>
      </VRow>

      <!-- Step 2 -->
      <VRow v-else-if="currentStep === 1">
        <VCol cols="12" md="7">
          <div class="text-subtitle-1 font-weight-medium mb-2">Responsive table presentation</div>
          <VRadioGroup v-model="blueprint.tableMode" hide-details class="mb-4">
            <VRadio
              value="mobile-cards"
              label="Mobile cards — Stack rows into dedicated cards below 760px"
            />
            <VRadio
              value="scrollable"
              label="Scrollable table — Preserve full column comparison with horizontal scroll"
            />
          </VRadioGroup>

          <VCheckbox
            v-model="blueprint.includeFilters"
            label="Include search and status filter toolbar"
            hide-details
          />
        </VCol>

        <VCol cols="12" md="5">
          <div class="pa-4 rounded border bg-background">
            <div class="text-body-2 font-weight-medium mb-1"> Design guideline </div>
            <p class="text-body-2 text-medium-emphasis mb-0">
              Confirm responsive table mode during planning whenever column density vs. mobile action hierarchy affects layout.
            </p>
          </div>
        </VCol>
      </VRow>

      <!-- Step 3 -->
      <VRow v-else>
        <VCol cols="12" md="5">
          <dl class="summary-list mb-0">
            <div class="summary-row">
              <dt class="text-body-2 text-medium-emphasis">Page title</dt>
              <dd class="text-body-1 font-weight-medium">{{ blueprint.title }}</dd>
            </div>
            <div class="summary-row">
              <dt class="text-body-2 text-medium-emphasis">Route path</dt>
              <dd class="text-body-2"><code>/{{ blueprint.slug }}</code></dd>
            </div>
            <div class="summary-row">
              <dt class="text-body-2 text-medium-emphasis">Menu group</dt>
              <dd class="text-body-2">{{ blueprint.navGroup }}</dd>
            </div>
            <div class="summary-row">
              <dt class="text-body-2 text-medium-emphasis">Mobile mode</dt>
              <dd class="text-body-2">
                <VChip size="small" color="primary" variant="tonal">
                  {{ blueprint.tableMode === 'mobile-cards' ? 'Mobile cards' : 'Scrollable table' }}
                </VChip>
              </dd>
            </div>
          </dl>
        </VCol>

        <VCol cols="12" md="7">
          <div class="text-body-2 font-weight-medium mb-2">Generated template snippet</div>
          <pre class="snippet-box bg-background rounded border pa-4 text-body-2 mb-0"><code class="text-high-emphasis">{{ generatedSnippet }}</code></pre>
        </VCol>
      </VRow>

      <VDivider class="my-6" />

      <div class="d-flex flex-wrap align-center justify-space-between gap-3">
        <VBtn
          type="button"
          variant="text"
          color="secondary"
          :disabled="currentStep === 0"
          @click="resetWizard"
        >
          Reset
        </VBtn>

        <div class="d-flex flex-wrap gap-3">
          <VBtn
            type="button"
            variant="outlined"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            Back
          </VBtn>
          <VBtn
            v-if="currentStep < steps.length - 1"
            type="button"
            color="primary"
            :disabled="!canAdvance"
            @click="nextStep"
          >
            Continue
          </VBtn>
          <VBtn
            v-else
            type="button"
            color="primary"
            @click="emit('notify', `Blueprint ready for /${blueprint.slug}.`)"
          >
            Finish preview
          </VBtn>
        </div>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-block-end: 10px;
  border-block-end: thin solid rgba(var(--v-border-color), var(--v-border-opacity));

  dd {
    margin: 0;
  }
}

.snippet-box {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
