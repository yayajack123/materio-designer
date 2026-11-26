<script setup lang="ts">
definePageMeta({ sidebarRoute: 'page-template-form' })
useHead({ title: 'Form template' })

type Language = 'English' | 'Indonesia' | 'Mandarin'
type Copy = { title: string; description: string }
const languages: Language[] = ['English', 'Indonesia', 'Mandarin']
const language = ref<Language>('Indonesia')
const initial = () => ({
  translations: {
    English: { title: '', description: '' },
    Indonesia: { title: 'Free Shipping on Orders Over NT$500 – Don’t Miss Out!', description: 'Minimum spend: NT$1,000\nDiscount: NT$200\nValid until: September 30, 2024\nApplicable on all categories except sale items' },
    Mandarin: { title: '', description: '' },
  } as Record<Language, Copy>,
  type: 'Discount', recipient: 'General customer', start: '', end: '', quota: 2, globalQuota: 200,
  useCode: true, code: '9012HA', minimum: 200, discountType: 'Percentage', nominal: 20, active: true,
})
const form = ref(initial())
const saved = ref(JSON.stringify(form.value))
const savedImage = ref('')
const imagePreview = ref('')
const imageError = ref('')
const submitted = ref(false)
const feedback = ref('')
const snackbar = ref(false)
const discardDialog = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const required = (value: unknown) => !!String(value ?? '').trim() || 'This field is required.'
const positive = (value: unknown) => Number(value) > 0 || 'Enter a number greater than zero.'
const dateOrder = () => !form.value.start || !form.value.end || form.value.end > form.value.start || 'End date must be after start date.'
const nominalRule = (value: unknown) => Number(value) > 0 && (form.value.discountType !== 'Percentage' || Number(value) <= 100) || (form.value.discountType === 'Percentage' ? 'Enter a value from 1 to 100.' : 'Enter a number greater than zero.')
const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

async function save() {
  submitted.value = true
  const result = await formRef.value?.validate()
  if (!result?.valid || imageError.value) {
    feedback.value = 'Check the highlighted fields before saving.'
    snackbar.value = true
    return
  }
  saved.value = JSON.stringify(form.value)
  savedImage.value = imagePreview.value
  feedback.value = 'Changes saved for this page session.'
  snackbar.value = true
}

function discard() {
  form.value = JSON.parse(saved.value)
  imagePreview.value = savedImage.value
  imageError.value = ''
  submitted.value = false
  discardDialog.value = false
  feedback.value = 'Changes discarded.'
  snackbar.value = true
}

function selectImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 500 * 1024) {
    imageError.value = 'Choose a JPG or PNG file no larger than 500 KB.'
    return
  }
  imageError.value = ''
  const reader = new FileReader()
  reader.onload = () => { imagePreview.value = String(reader.result) }
  reader.onerror = () => { imageError.value = 'Could not read the image. Try another file.' }
  reader.readAsDataURL(file)
}
</script>

<template>
  <section>
    <UiSectionHeader title="Create voucher" title-class="text-h4" description="Complete the form below to create a promotion." class="mb-6">
      <template #actions><div class="d-flex flex-wrap align-center gap-3"><TemplatePrompt template="form" /><VBtn variant="outlined" @click="discardDialog = true">Discard</VBtn><VBtn color="primary" prepend-icon="ri-check-line" @click="save">Save</VBtn></div></template>
    </UiSectionHeader>
    <VAlert type="info" variant="tonal" class="mb-6">Demo template: changes are kept only during this page session.</VAlert>
    <VForm ref="formRef" :validate-on="submitted ? 'input' : 'submit'" @submit.prevent="save">
      <VRow>
        <VCol cols="12" md="8" class="d-flex flex-column gap-6">
          <VCard variant="outlined" class="form-card bg-surface pa-6">
            <div class="form-card-title"><VAvatar color="primary" variant="tonal" rounded size="32"><VIcon icon="ri-book-read-line" size="20" /></VAvatar><h2 class="text-h5">Basic information</h2></div>
            <VTabs v-model="language" class="v-tabs-bordered mb-6" aria-label="Content language"><VTab v-for="item in languages" :key="item" :value="item">{{ item }}</VTab></VTabs>
            <div class="d-flex flex-column gap-6"><VTextField v-model="form.translations[language].title" label="Title" :rules="[required]" /><VTextarea v-model="form.translations[language].description" label="Description" rows="4" /></div>
          </VCard>
          <VCard variant="outlined" class="form-card bg-surface pa-6">
            <div class="form-card-title"><VAvatar color="primary" variant="tonal" rounded size="32"><VIcon icon="ri-book-read-line" size="20" /></VAvatar><h2 class="text-h5">Detail information</h2></div>
            <div class="d-flex flex-column gap-6"><VSelect v-model="form.type" label="Type" :items="['Discount', 'Free shipping']" /><VSelect v-model="form.recipient" label="Role of promotion recipient" :items="['General customer', 'Member', 'All customers']" /><VRow><VCol cols="12" sm="6"><VTextField v-model="form.start" type="datetime-local" label="Start date" :rules="[required]" /></VCol><VCol cols="12" sm="6"><VTextField v-model="form.end" type="datetime-local" label="End date" :rules="[required, dateOrder]" /></VCol></VRow><VTextField v-model.number="form.quota" type="number" min="1" label="Quota / user" :rules="[positive]" /><VTextField v-model.number="form.globalQuota" type="number" min="1" label="Global quota" :rules="[positive]" /><div class="switch-box"><VSwitch v-model="form.useCode" label="Use voucher code" color="primary" hide-details /></div><VTextField v-if="form.useCode" v-model="form.code" label="Voucher code" :rules="[required]" /></div>
          </VCard>
          <VCard v-if="form.type === 'Discount'" variant="outlined" class="form-card bg-surface pa-6">
            <div class="form-card-title"><VAvatar color="primary" variant="tonal" rounded size="32"><VIcon icon="ri-ticket-2-line" size="20" /></VAvatar><h2 class="text-h5">Discount setting</h2></div>
            <div class="d-flex flex-column gap-6"><VTextField v-model.number="form.minimum" type="number" min="0" label="Minimum spend" prefix="NTD" :rules="[value => Number(value) >= 0 || 'Enter zero or a positive amount.']" /><VSelect v-model="form.discountType" label="Type" :items="['Percentage', 'Fixed amount']" /><VTextField v-model.number="form.nominal" type="number" min="1" label="Nominal" :suffix="form.discountType === 'Percentage' ? '%' : 'NTD'" :hint="form.discountType === 'Percentage' ? 'Enter between 1 and 100' : undefined" persistent-hint :rules="[nominalRule]" /></div>
          </VCard>
        </VCol>
        <VCol cols="12" md="4"><VCard variant="outlined" class="form-card bg-surface pa-6"><div class="form-card-title"><VAvatar color="primary" variant="tonal" rounded size="32"><VIcon icon="ri-settings-3-line" size="20" /></VAvatar><h2 class="text-h5">Settings</h2></div><div class="switch-box mb-6"><VSwitch v-model="form.active" label="Active" color="primary" hide-details /></div><p class="text-body-1 mb-3">Promotion image</p><input ref="fileInput" type="file" accept="image/jpeg,image/png" class="visually-hidden" aria-label="Promotion image" @change="selectImage"><button type="button" class="image-picker" @click="fileInput?.click()"><img v-if="imagePreview" :src="imagePreview" alt="Selected promotion image"><template v-else><VIcon icon="ri-add-line" size="24" /><span>Upload image</span></template></button><p class="text-body-2 text-medium-emphasis mt-3 mb-0">Upload JPG or PNG, recommended ratio 2:1, maximum 500 KB.</p><p v-if="imageError" class="text-body-2 text-error mt-2 mb-0" role="alert">{{ imageError }}</p><VBtn v-if="imagePreview" variant="text" class="mt-2" @click="imagePreview = ''; imageError = ''">Remove image</VBtn></VCard></VCol>
      </VRow>
    </VForm>
    <VDialog v-model="discardDialog" max-width="440"><VCard class="pa-4"><VCardTitle>Discard changes?</VCardTitle><VCardText>Restore the last saved version of this demo form?</VCardText><VCardActions><VSpacer /><VBtn variant="text" @click="discardDialog = false">Cancel</VBtn><VBtn color="primary" @click="discard">Discard changes</VBtn></VCardActions></VCard></VDialog>
    <VSnackbar v-model="snackbar">{{ feedback }}</VSnackbar>
  </section>
</template>

<style scoped>
.form-card { border-radius: 12px; }
.form-card-title { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
.switch-box { border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); border-radius: 6px; padding: 4px 16px; }
.image-picker { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; width: 100%; aspect-ratio: 2 / 1; border: 1px dashed rgba(var(--v-border-color), .3); border-radius: 8px; background: rgb(var(--v-theme-background)); overflow: hidden; }
.image-picker img { width: 100%; height: 100%; object-fit: contain; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
