<script lang="ts" setup>
import mainNavItems, { bottomNavItems } from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

// Components
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'
</script>

<template>
  <VerticalNavLayout
    :nav-items="mainNavItems"
    :bottom-nav-items="bottomNavItems"
  >
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <IconBtn
          id="vertical-nav-toggle-btn"
          class="ms-n2 d-lg-none"
          @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="ri-menu-line" />
        </IconBtn>

        <VSpacer />

        <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
        />
        <VBtn
          to="/create"
          size="small"
          variant="tonal"
          color="primary"
          prepend-icon="ri-equalizer-2-line"
          class="me-2 d-none d-sm-inline-flex"
        >
          Create
        </VBtn>
        <IconBtn
          to="/create"
          class="me-1 d-sm-none"
          aria-label="Create design system"
        >
          <VIcon
            icon="ri-equalizer-2-line"
            aria-hidden="true"
          />
        </IconBtn>
        <NavbarThemeSwitcher class="me-2" />
        <NavBarNotifications class="me-2" />

        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <!-- <Footer /> -->
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
