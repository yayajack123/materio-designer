<script setup lang="ts">
import type { RouteLocation } from '#vue-router'

interface Props {
  title: string
  titleClass?: string
  description?: string
  back?: RouteLocation
  customBack?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  titleClass: 'text-h5',
})
const emit = defineEmits(['click:back'])

const handleBackClick = (e: MouseEvent) => {
  if (props.customBack) {
    e.preventDefault()
    e.stopPropagation()
    emit('click:back')
  }
}
</script>

<template>
  <div class="d-flex align-center gap-3 mb-5">
    <IconBtn
      v-if="props.back"
      color="secondary"
      class="me-4"
      aria-label="Back"
      :to="props.customBack ? undefined : props.back"
      @click="handleBackClick"
    >
      <VIcon
        icon="ri-arrow-left-line"
        aria-hidden="true"
      />
      <VTooltip
        activator="parent"
        location="top"
      >
        Back
      </VTooltip>
    </IconBtn>
    <VRow>
      <VCol
        cols="12"
        md="8"
      >
        <h1 :class="[props.titleClass, 'font-weight-medium text-high-emphasis ui-section-header__title']">
          {{ props.title }}
        </h1>
        <p
          v-if="props.description"
          class="mb-0 text-body-1 text-medium-emphasis ui-section-header__description"
        >
          {{ props.description }}
        </p>
      </VCol>

      <VCol
        cols="12"
        md="4"
        class="d-flex gap-3 align-center flex-wrap justify-md-end"
      >
        <slot name="actions" />
      </VCol>
    </VRow>
  </div>
</template>

<style scoped>
.ui-section-header__title {
  text-wrap: balance;
}

.ui-section-header__description {
  text-wrap: pretty;
}
</style>
