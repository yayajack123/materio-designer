# Katalog komponen Materio Designer

Inventaris source sebelum penyederhanaan menu starter. Bahasa API dipertahankan sesuai implementasi.

## Cakupan dan cara membaca

Mencakup **97 komponen** dalam `components/`, `@core/components/`, `@layouts/components/`, `layouts/components/`, dan `views/`. Halaman route di `pages/`, root `app.vue`/`error.vue`, serta wrapper Nuxt `layouts/default.vue`/`blank.vue` bukan komponen library dan tidak dihitung; file tersebut tetap diperiksa sebagai konsumen. Vuetify dan library pihak ketiga tidak disalin menjadi entri komponen lokal.

Setiap entri mencatat tujuan, kontrak props/default/event/model/expose dari source, slot outlet publik, dan konsumen statis. Kontrak TypeScript adalah cuplikan deklarasi, bukan contoh yang bisa langsung dijalankan. Tipe lokal pendukung disertakan; tipe impor mengikuti sumber aslinya. `defineModel` berarti prop serta event `update:*` yang dihasilkan Vue. Tidak ada deklarasi berarti tidak ada kontrak eksplisit, bukan jaminan tidak menerima fallthrough attrs.

Konsumen ditentukan dari tag PascalCase/kebab-case dan impor path literal pada source aplikasi; bukan analisis reachability runtime. “Tidak ditemukan” tidak berarti aman dihapus: auto-import, alias, barrel export, dan rendering dinamis memerlukan penelusuran lanjutan. Slot yang disediakan kepada Vuetify tidak dianggap slot publik komponen ini.

**Status:** inventaris source, bukan sertifikasi produksi. Data contoh, integrasi backend, aksesibilitas, loading/error, dan route bawaan perlu diverifikasi saat komponen dipakai. Komponen bawaan template dibedakan dari UI reusable proyek; tidak ada klaim bahwa semua komponen dibuat khusus untuk aplikasi ini.

## Aturan penggunaan

**Alias tanpa file komponen:** `IconBtn` didaftarkan sebagai alias `VBtn` di [plugins/vuetify/index.ts](../plugins/vuetify/index.ts), dengan default pada [plugins/vuetify/defaults.ts](../plugins/vuetify/defaults.ts). Kontrak props/event/slot mengikuti VBtn; alias ini tidak dihitung sebagai file komponen lokal. Berikan accessible name pada tombol yang hanya berisi ikon. Komponen Vuetify lainnya mengikuti mapping [design.md](../spec/design.md).

- Gunakan [design.md](../spec/design.md) untuk Poppins, skala teks, tema semantic, radius, dan mapping komponen.
- Dahulukan UiSectionHeader, UiTableView, UiAutoComplete dan Vuetify untuk halaman baru.
- Parent menangani persistensi/API jika komponen hanya menerbitkan event. Dialog pembayaran, OTP, referral, dan paket dengan data contoh bukan layanan siap produksi.
- Pertahankan komponen domain akademi/marketing sebagai referensi; penghapusan menu tidak sama dengan penghapusan source atau proteksi route.
- Contoh tabel starter memakai **scrollable table**, sesuai pilihan pengguna.

## Panduan pemilihan komponen

Pilih berdasarkan perilaku yang dibutuhkan, lalu baca kontrak source. Tabel ini melengkapi mapping [design.md](../spec/design.md), tanpa memperkenalkan komponen atau token baru.

| Kebutuhan | Pilihan | Batasan dan rujukan |
| --- | --- | --- |
| Judul, deskripsi, back, aksi halaman | UiSectionHeader | Slot `actions`; `titleClass` default `text-h5`, gunakan `text-h4` bila pola halaman memerlukannya. [Source](../components/ui/UiSectionHeader.vue) |
| Halaman daftar dengan tab/filter/loading | UiTableView | Parent mengelola filter, error, dan data. Gunakan `header-actions`, `filters`, `reset-filters`, dan `v-model:activeTab`. [CRUD list](../pages/page-template/crud-page/index.vue) |
| Tabel sederhana di dalam section | VDataTable atau VTable | VDataTable untuk perilaku data seperti pagination; VTable untuk markup tabel statis. Hindari shell halaman ganda. [Table examples](../pages/components/table.vue) |
| Pagination dari backend | UiTableView dengan slot `table-content` dan tabel/pagination milik parent | `hidePagination` hanya menyembunyikan footer; bukan implementasi fetching server. Lihat mapping tabel di spesifikasi desain |
| Pengelompokan mobile berbeda | UiTableView `mobileCards` dan slot `mobile-cards` | Keduanya wajib dipasangkan; breakpoint internal 760px. Konfirmasi pilihan layout sesuai agents.md. Default tetap scrollable table |
| Pilihan lokal | VSelect atau VAutocomplete | VSelect untuk pilihan langsung; VAutocomplete saat pencarian lokal membantu. [Select](../pages/components/select.vue), [Autocomplete](../pages/components/autocomplete.vue) |
| Pilihan remote dengan pencarian dan pagination | UiAutoComplete | `v-model` dan `callback({ search, page })`; hasil `{ data, meta: { current_page, last_page } }`. Parent menyediakan feedback error; komponen mencatat error ke console. [Source](../components/ui/UiAutoComplete.vue) |
| Form dasar | VForm, VTextField dan kontrol Vuetify | Ikuti defaults proyek dan validator yang sesuai; halaman memiliki submit/loading/error. [Text Field](../pages/components/text-field.vue), [validators](../@core/utils/validators.ts) |
| Permukaan dan grid | VCard, VRow/VCol | Gunakan saat grouping dibutuhkan; ikuti gutter 24px dan mapping surface dari spesifikasi |
| Aksi biasa atau ikon | VBtn atau IconBtn | IconBtn alias VBtn, bukan wrapper lokal; tombol ikon wajib punya accessible name. [Buttons](../pages/components/buttons.vue) |
| Konfirmasi atau edit singkat | VDialog | Parent memiliki state buka, submit dan target; cek keyboard/focus. [Dialog](../pages/components/dialog.vue), [CRUD list](../pages/page-template/crud-page/index.vue) |
| Status dan feedback | VChip, VAlert, VSnackbar | Chip untuk status, alert untuk pesan di konteks, snackbar untuk feedback sementara. Toast memakai pola VSnackbar yang sudah ada. [Alert](../pages/components/alert.vue), [Snackbar](../pages/components/snackbar.vue), [Toast](../pages/components/toast.vue) |
| Langkah proses | AppStepper | Reuse API yang ada dan kontrol Back/Next milik halaman. [Stepper](../pages/components/stepper.vue) |
| Halaman dokumentasi komponen | BaseComponentDoc | Supply preview/variants/states dan metadata API; jangan duplikasi layout dokumentasi. [Buttons](../pages/components/buttons.vue) |

Sebelum membuat komponen baru, periksa kebutuhan perilaku yang belum terwakili. Komponen domain pada inventaris berikut bukan pengganti otomatis untuk UI generik. Setelah implementasi, gunakan [checklist review desain](design-review.md).

## Indeks

### Contoh penggunaan komponen UI proyek

Contoh berikut dipasang pada template Vue; state dan callback dimiliki halaman pemakai.

```vue
<UiSectionHeader title="Daftar item" description="Kelola item aplikasi.">
  <template #actions>
    <VBtn @click="openCreateDialog">Tambah item</VBtn>
  </template>
</UiSectionHeader>

<UiTableView
  title="Daftar item"
  :headers="headers"
  :items="items"
  :loading="loading"
  hide-filters
>
  <template #no-data>Belum ada item.</template>
</UiTableView>

<UiAutoComplete
  v-model="selectedItem"
  :callback="fetchOptions"
  label="Pilih item"
  item-title="name"
  item-value="id"
/>
```

`fetchOptions({ search, page })` harus mengembalikan Promise berisi `{ data, meta: { current_page, last_page } }`. Handler `openCreateDialog`, `headers`, `items`, `loading`, dan `selectedItem` disediakan halaman. UiTableView default memakai tabel scrollable; tidak perlu mengaktifkan `mobileCards` untuk pilihan starter ini.

| Komponen | Kelompok | Source |
| --- | --- | --- |
| [AppBarSearch](#appbarsearch) | Core bawaan | [@core/components/AppBarSearch.vue](../@core/components/AppBarSearch.vue) |
| [AppDrawerHeaderSection](#appdrawerheadersection) | Core bawaan | [@core/components/AppDrawerHeaderSection.vue](../@core/components/AppDrawerHeaderSection.vue) |
| [AppStepper](#appstepper) | Core bawaan | [@core/components/AppStepper.vue](../@core/components/AppStepper.vue) |
| [BuyNow](#buynow) | Core bawaan | [@core/components/BuyNow.vue](../@core/components/BuyNow.vue) |
| [CustomizerSection](#customizersection) | Core bawaan | [@core/components/CustomizerSection.vue](../@core/components/CustomizerSection.vue) |
| [DialogCloseBtn](#dialogclosebtn) | Core bawaan | [@core/components/DialogCloseBtn.vue](../@core/components/DialogCloseBtn.vue) |
| [DropZone](#dropzone) | Core bawaan | [@core/components/DropZone.vue](../@core/components/DropZone.vue) |
| [I18n](#i18n) | Core bawaan | [@core/components/I18n.vue](../@core/components/I18n.vue) |
| [MoreBtn](#morebtn) | Core bawaan | [@core/components/MoreBtn.vue](../@core/components/MoreBtn.vue) |
| [Notifications](#notifications) | Core bawaan | [@core/components/Notifications.vue](../@core/components/Notifications.vue) |
| [ProductDescriptionEditor](#productdescriptioneditor) | Core bawaan | [@core/components/ProductDescriptionEditor.vue](../@core/components/ProductDescriptionEditor.vue) |
| [ScrollToTop](#scrolltotop) | Core bawaan | [@core/components/ScrollToTop.vue](../@core/components/ScrollToTop.vue) |
| [Shortcuts](#shortcuts) | Core bawaan | [@core/components/Shortcuts.vue](../@core/components/Shortcuts.vue) |
| [TablePagination](#tablepagination) | Core bawaan | [@core/components/TablePagination.vue](../@core/components/TablePagination.vue) |
| [TheCustomizer](#thecustomizer) | Core bawaan | [@core/components/TheCustomizer.vue](../@core/components/TheCustomizer.vue) |
| [ThemeSwitcher](#themeswitcher) | Core bawaan | [@core/components/ThemeSwitcher.vue](../@core/components/ThemeSwitcher.vue) |
| [TiptapEditor](#tiptapeditor) | Core bawaan | [@core/components/TiptapEditor.vue](../@core/components/TiptapEditor.vue) |
| [AppDateTimePicker](#appdatetimepicker) | Core bawaan | [@core/components/app-form-elements/AppDateTimePicker.vue](../@core/components/app-form-elements/AppDateTimePicker.vue) |
| [CustomCheckboxes](#customcheckboxes) | Core bawaan | [@core/components/app-form-elements/CustomCheckboxes.vue](../@core/components/app-form-elements/CustomCheckboxes.vue) |
| [CustomCheckboxesWithIcon](#customcheckboxeswithicon) | Core bawaan | [@core/components/app-form-elements/CustomCheckboxesWithIcon.vue](../@core/components/app-form-elements/CustomCheckboxesWithIcon.vue) |
| [CustomCheckboxesWithImage](#customcheckboxeswithimage) | Core bawaan | [@core/components/app-form-elements/CustomCheckboxesWithImage.vue](../@core/components/app-form-elements/CustomCheckboxesWithImage.vue) |
| [CustomRadios](#customradios) | Core bawaan | [@core/components/app-form-elements/CustomRadios.vue](../@core/components/app-form-elements/CustomRadios.vue) |
| [CustomRadiosWithIcon](#customradioswithicon) | Core bawaan | [@core/components/app-form-elements/CustomRadiosWithIcon.vue](../@core/components/app-form-elements/CustomRadiosWithIcon.vue) |
| [CustomRadiosWithImage](#customradioswithimage) | Core bawaan | [@core/components/app-form-elements/CustomRadiosWithImage.vue](../@core/components/app-form-elements/CustomRadiosWithImage.vue) |
| [AppCardActions](#appcardactions) | Core bawaan | [@core/components/cards/AppCardActions.vue](../@core/components/cards/AppCardActions.vue) |
| [AppCardCode](#appcardcode) | Core bawaan | [@core/components/cards/AppCardCode.vue](../@core/components/cards/AppCardCode.vue) |
| [CardStatisticsHorizontal](#cardstatisticshorizontal) | Core bawaan | [@core/components/cards/CardStatisticsHorizontal.vue](../@core/components/cards/CardStatisticsHorizontal.vue) |
| [CardStatisticsVertical](#cardstatisticsvertical) | Core bawaan | [@core/components/cards/CardStatisticsVertical.vue](../@core/components/cards/CardStatisticsVertical.vue) |
| [CardStatisticsWithIcon](#cardstatisticswithicon) | Core bawaan | [@core/components/cards/CardStatisticsWithIcon.vue](../@core/components/cards/CardStatisticsWithIcon.vue) |
| [CardStatisticsWithImages](#cardstatisticswithimages) | Core bawaan | [@core/components/cards/CardStatisticsWithImages.vue](../@core/components/cards/CardStatisticsWithImages.vue) |
| [HorizontalNav](#horizontalnav) | Infrastruktur layout | [@layouts/components/HorizontalNav.vue](../@layouts/components/HorizontalNav.vue) |
| [HorizontalNavGroup](#horizontalnavgroup) | Infrastruktur layout | [@layouts/components/HorizontalNavGroup.vue](../@layouts/components/HorizontalNavGroup.vue) |
| [HorizontalNavLayout](#horizontalnavlayout) | Infrastruktur layout | [@layouts/components/HorizontalNavLayout.vue](../@layouts/components/HorizontalNavLayout.vue) |
| [HorizontalNavLink](#horizontalnavlink) | Infrastruktur layout | [@layouts/components/HorizontalNavLink.vue](../@layouts/components/HorizontalNavLink.vue) |
| [HorizontalNavPopper](#horizontalnavpopper) | Infrastruktur layout | [@layouts/components/HorizontalNavPopper.vue](../@layouts/components/HorizontalNavPopper.vue) |
| [TransitionExpand](#transitionexpand) | Infrastruktur layout | [@layouts/components/TransitionExpand.vue](../@layouts/components/TransitionExpand.vue) |
| [VNodeRenderer](#vnoderenderer) | Infrastruktur layout | [@layouts/components/VNodeRenderer.tsx](../@layouts/components/VNodeRenderer.tsx) |
| [VerticalNav](#verticalnav) | Infrastruktur layout | [@layouts/components/VerticalNav.vue](../@layouts/components/VerticalNav.vue) |
| [VerticalNavGroup](#verticalnavgroup) | Infrastruktur layout | [@layouts/components/VerticalNavGroup.vue](../@layouts/components/VerticalNavGroup.vue) |
| [VerticalNavLayout](#verticalnavlayout) | Infrastruktur layout | [@layouts/components/VerticalNavLayout.vue](../@layouts/components/VerticalNavLayout.vue) |
| [VerticalNavLink](#verticalnavlink) | Infrastruktur layout | [@layouts/components/VerticalNavLink.vue](../@layouts/components/VerticalNavLink.vue) |
| [VerticalNavSectionTitle](#verticalnavsectiontitle) | Infrastruktur layout | [@layouts/components/VerticalNavSectionTitle.vue](../@layouts/components/VerticalNavSectionTitle.vue) |
| [AppLoadingIndicator](#apploadingindicator) | Komponen aplikasi | [components/AppLoadingIndicator.vue](../components/AppLoadingIndicator.vue) |
| [AppPricing](#apppricing) | Komponen aplikasi | [components/AppPricing.vue](../components/AppPricing.vue) |
| [AppSearchHeader](#appsearchheader) | Komponen aplikasi | [components/AppSearchHeader.vue](../components/AppSearchHeader.vue) |
| [ErrorHeader](#errorheader) | Komponen aplikasi | [components/ErrorHeader.vue](../components/ErrorHeader.vue) |
| [MeetingJournalReportPreview](#meetingjournalreportpreview) | Komponen aplikasi | [components/MeetingJournalReportPreview.vue](../components/MeetingJournalReportPreview.vue) |
| [VueApexCharts.client](#vueapexchartsclient) | Komponen aplikasi | [components/VueApexCharts.client.vue](../components/VueApexCharts.client.vue) |
| [DesignSystemShowcase](#designsystemshowcase) | Komponen aplikasi | [components/design-system/DesignSystemShowcase.vue](../components/design-system/DesignSystemShowcase.vue) |
| [BaseComponentDoc](#basecomponentdoc) | Dokumentasi reusable | [components/design-system/BaseComponentDoc.vue](../components/design-system/BaseComponentDoc.vue) |
| [AddAuthenticatorAppDialog](#addauthenticatorappdialog) | Dialog | [components/dialogs/AddAuthenticatorAppDialog.vue](../components/dialogs/AddAuthenticatorAppDialog.vue) |
| [AddEditAddressDialog](#addeditaddressdialog) | Dialog | [components/dialogs/AddEditAddressDialog.vue](../components/dialogs/AddEditAddressDialog.vue) |
| [AddEditPermissionDialog](#addeditpermissiondialog) | Dialog | [components/dialogs/AddEditPermissionDialog.vue](../components/dialogs/AddEditPermissionDialog.vue) |
| [AddEditRoleDialog](#addeditroledialog) | Dialog | [components/dialogs/AddEditRoleDialog.vue](../components/dialogs/AddEditRoleDialog.vue) |
| [AddPaymentMethodDialog](#addpaymentmethoddialog) | Dialog | [components/dialogs/AddPaymentMethodDialog.vue](../components/dialogs/AddPaymentMethodDialog.vue) |
| [AllStudentDialog](#allstudentdialog) | Dialog | [components/dialogs/AllStudentDialog.vue](../components/dialogs/AllStudentDialog.vue) |
| [ApproveProjectDialog](#approveprojectdialog) | Dialog | [components/dialogs/ApproveProjectDialog.vue](../components/dialogs/ApproveProjectDialog.vue) |
| [CardAddEditDialog](#cardaddeditdialog) | Dialog | [components/dialogs/CardAddEditDialog.vue](../components/dialogs/CardAddEditDialog.vue) |
| [ConfirmDialog](#confirmdialog) | Dialog | [components/dialogs/ConfirmDialog.vue](../components/dialogs/ConfirmDialog.vue) |
| [CreateAppDialog](#createappdialog) | Dialog | [components/dialogs/CreateAppDialog.vue](../components/dialogs/CreateAppDialog.vue) |
| [EnableOneTimePasswordDialog](#enableonetimepassworddialog) | Dialog | [components/dialogs/EnableOneTimePasswordDialog.vue](../components/dialogs/EnableOneTimePasswordDialog.vue) |
| [PaymentProvidersDialog](#paymentprovidersdialog) | Dialog | [components/dialogs/PaymentProvidersDialog.vue](../components/dialogs/PaymentProvidersDialog.vue) |
| [PresenceDialog](#presencedialog) | Dialog | [components/dialogs/PresenceDialog.vue](../components/dialogs/PresenceDialog.vue) |
| [PricingPlanDialog](#pricingplandialog) | Dialog | [components/dialogs/PricingPlanDialog.vue](../components/dialogs/PricingPlanDialog.vue) |
| [ReferAndEarnDialog](#referandearndialog) | Dialog | [components/dialogs/ReferAndEarnDialog.vue](../components/dialogs/ReferAndEarnDialog.vue) |
| [RejectProjectDialog](#rejectprojectdialog) | Dialog | [components/dialogs/RejectProjectDialog.vue](../components/dialogs/RejectProjectDialog.vue) |
| [ScheduleDetailsDialog](#scheduledetailsdialog) | Dialog | [components/dialogs/ScheduleDetailsDialog.vue](../components/dialogs/ScheduleDetailsDialog.vue) |
| [ScoreHistoryDialog](#scorehistorydialog) | Dialog | [components/dialogs/ScoreHistoryDialog.vue](../components/dialogs/ScoreHistoryDialog.vue) |
| [ShareProjectDialog](#shareprojectdialog) | Dialog | [components/dialogs/ShareProjectDialog.vue](../components/dialogs/ShareProjectDialog.vue) |
| [TwoFactorAuthDialog](#twofactorauthdialog) | Dialog | [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue) |
| [UserInfoEditDialog](#userinfoeditdialog) | Dialog | [components/dialogs/UserInfoEditDialog.vue](../components/dialogs/UserInfoEditDialog.vue) |
| [UserUpgradePlanDialog](#userupgradeplandialog) | Dialog | [components/dialogs/UserUpgradePlanDialog.vue](../components/dialogs/UserUpgradePlanDialog.vue) |
| [MarketingBuilder](#marketingbuilder) | Marketing | [components/marketing/MarketingBuilder.vue](../components/marketing/MarketingBuilder.vue) |
| [MarketingCanvas](#marketingcanvas) | Marketing | [components/marketing/MarketingCanvas.vue](../components/marketing/MarketingCanvas.vue) |
| [MarketingColorField](#marketingcolorfield) | Marketing | [components/marketing/MarketingColorField.vue](../components/marketing/MarketingColorField.vue) |
| [MarketingElementProperties](#marketingelementproperties) | Marketing | [components/marketing/MarketingElementProperties.vue](../components/marketing/MarketingElementProperties.vue) |
| [MarketingJournalPage](#marketingjournalpage) | Marketing | [components/marketing/MarketingJournalPage.vue](../components/marketing/MarketingJournalPage.vue) |
| [MarketingPreviewDocument](#marketingpreviewdocument) | Marketing | [components/marketing/MarketingPreviewDocument.vue](../components/marketing/MarketingPreviewDocument.vue) |
| [MarketingTemplateDetailsDrawer](#marketingtemplatedetailsdrawer) | Marketing | [components/marketing/MarketingTemplateDetailsDrawer.vue](../components/marketing/MarketingTemplateDetailsDrawer.vue) |
| [AccountAvatar](#accountavatar) | Pengaturan akun | [components/sections/account-settings/AccountAvatar.vue](../components/sections/account-settings/AccountAvatar.vue) |
| [AccountSettings](#accountsettings) | Pengaturan akun | [components/sections/account-settings/AccountSettings.vue](../components/sections/account-settings/AccountSettings.vue) |
| [AccountSettingsDelete](#accountsettingsdelete) | Pengaturan akun | [components/sections/account-settings/AccountSettingsDelete.vue](../components/sections/account-settings/AccountSettingsDelete.vue) |
| [AccountSettingsSecurity](#accountsettingssecurity) | Pengaturan akun | [components/sections/account-settings/AccountSettingsSecurity.vue](../components/sections/account-settings/AccountSettingsSecurity.vue) |
| [ThemeCard](#themecard) | Komponen aplikasi | [components/themes/ThemeCard.vue](../components/themes/ThemeCard.vue) |
| [UiAutoComplete](#uiautocomplete) | UI reusable proyek | [components/ui/UiAutoComplete.vue](../components/ui/UiAutoComplete.vue) |
| [UiSectionHeader](#uisectionheader) | UI reusable proyek | [components/ui/UiSectionHeader.vue](../components/ui/UiSectionHeader.vue) |
| [UiTableView](#uitableview) | UI reusable proyek | [components/ui/UiTableView.vue](../components/ui/UiTableView.vue) |
| [DefaultLayoutWithHorizontalNav](#defaultlayoutwithhorizontalnav) | Komposisi shell | [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue) |
| [DefaultLayoutWithVerticalNav](#defaultlayoutwithverticalnav) | Komposisi shell | [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue) |
| [Footer](#footer) | Komposisi shell | [layouts/components/Footer.vue](../layouts/components/Footer.vue) |
| [NavBarNotifications](#navbarnotifications) | Komposisi shell | [layouts/components/NavBarNotifications.vue](../layouts/components/NavBarNotifications.vue) |
| [NavSearchBar](#navsearchbar) | Komposisi shell | [layouts/components/NavSearchBar.vue](../layouts/components/NavSearchBar.vue) |
| [NavbarShortcuts](#navbarshortcuts) | Komposisi shell | [layouts/components/NavbarShortcuts.vue](../layouts/components/NavbarShortcuts.vue) |
| [NavbarThemeSwitcher](#navbarthemeswitcher) | Komposisi shell | [layouts/components/NavbarThemeSwitcher.vue](../layouts/components/NavbarThemeSwitcher.vue) |
| [UserProfile](#userprofile) | Komposisi shell | [layouts/components/UserProfile.vue](../layouts/components/UserProfile.vue) |
| [AuthProvider](#authprovider) | View pendukung | [views/pages/authentication/AuthProvider.vue](../views/pages/authentication/AuthProvider.vue) |
| [AddNewUserDrawer](#addnewuserdrawer) | View pendukung | [views/user/AddNewUserDrawer.vue](../views/user/AddNewUserDrawer.vue) |

## AppBarSearch

**Kelompok:** Core bawaan. **Source:** [@core/components/AppBarSearch.vue](../@core/components/AppBarSearch.vue).

Dialog pencarian global dengan hasil, grup saran, serta navigasi keyboard.

**Kontrak eksplisit:**

```ts
interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'search', value: string): void;
}

interface Props {
    isDialogVisible: boolean;
    searchResults: T[];
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `searchResult`, `suggestions`, `noData`, `noDataSuggestion`

**Konsumen statis:** [layouts/components/NavSearchBar.vue](../layouts/components/NavSearchBar.vue)

## AppDrawerHeaderSection

**Kelompok:** Core bawaan. **Source:** [@core/components/AppDrawerHeaderSection.vue](../@core/components/AppDrawerHeaderSection.vue).

Header drawer dengan judul dan tombol batal/tutup melalui event.

**Kontrak eksplisit:**

```ts
defineProps<{
    title: string;
}>()

defineEmits<{
    (e: 'cancel', el: MouseEvent): void;
}>()
```

**Slot publik:** `beforeClose`

**Konsumen statis:** [views/user/AddNewUserDrawer.vue](../views/user/AddNewUserDrawer.vue), [pages/user-variant-2.vue](../pages/user-variant-2.vue)

## AppStepper

**Kelompok:** Core bawaan. **Source:** [@core/components/AppStepper.vue](../@core/components/AppStepper.vue).

Indikator langkah horizontal/vertikal dengan model langkah aktif.

**Kontrak eksplisit:**

```ts
interface Item {
    title: string;
    icon?: string | object;
    size?: string;
    subtitle?: string;
}

type Direction = 'vertical' | 'horizontal';

interface Props {
    items: Item[];
    currentStep?: number;
    direction?: Direction;
    iconSize?: string | number;
    isActiveStepValid?: boolean;
    align?: 'start' | 'center' | 'end' | 'default';
    layout?: 'default' | 'centered';
}

interface Emit {
    (e: 'update:currentStep', value: number): void;
}

withDefaults(defineProps<Props>(), {
    currentStep: 0,
    direction: 'horizontal',
    iconSize: 52,
    isActiveStepValid: undefined,
    align: 'default',
    layout: 'default',
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/dialogs/CreateAppDialog.vue](../components/dialogs/CreateAppDialog.vue), [pages/marketing/templates/new.vue](../pages/marketing/templates/new.vue)

## BuyNow

**Kelompok:** Core bawaan. **Source:** [@core/components/BuyNow.vue](../@core/components/BuyNow.vue).

Tombol promosi template bawaan; bukan kebutuhan inti starter.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CustomizerSection

**Kelompok:** Core bawaan. **Source:** [@core/components/CustomizerSection.vue](../@core/components/CustomizerSection.vue).

Bagian berjudul di panel customizer dengan konten slot.

**Kontrak eksplisit:**

```ts
interface Props {
    title: string;
    divider?: boolean;
}

withDefaults(defineProps<Props>(), {
    divider: true,
})
```

**Slot publik:** `default`

**Konsumen statis:** [@core/components/TheCustomizer.vue](../@core/components/TheCustomizer.vue)

## DialogCloseBtn

**Kelompok:** Core bawaan. **Source:** [@core/components/DialogCloseBtn.vue](../@core/components/DialogCloseBtn.vue).

Tombol tutup dialog yang menerbitkan click ke parent.

**Kontrak eksplisit:**

```ts
interface Props {
    icon?: string;
    iconSize?: string;
}

withDefaults(defineProps<Props>(), {
    icon: 'ri-close-line',
    iconSize: '24',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/dialogs/AddAuthenticatorAppDialog.vue](../components/dialogs/AddAuthenticatorAppDialog.vue), [components/dialogs/AddEditAddressDialog.vue](../components/dialogs/AddEditAddressDialog.vue), [components/dialogs/AddEditPermissionDialog.vue](../components/dialogs/AddEditPermissionDialog.vue), [components/dialogs/AddEditRoleDialog.vue](../components/dialogs/AddEditRoleDialog.vue), [components/dialogs/AddPaymentMethodDialog.vue](../components/dialogs/AddPaymentMethodDialog.vue), [components/dialogs/AllStudentDialog.vue](../components/dialogs/AllStudentDialog.vue), [components/dialogs/ApproveProjectDialog.vue](../components/dialogs/ApproveProjectDialog.vue), [components/dialogs/CardAddEditDialog.vue](../components/dialogs/CardAddEditDialog.vue), [components/dialogs/CreateAppDialog.vue](../components/dialogs/CreateAppDialog.vue), [components/dialogs/EnableOneTimePasswordDialog.vue](../components/dialogs/EnableOneTimePasswordDialog.vue), [components/dialogs/PaymentProvidersDialog.vue](../components/dialogs/PaymentProvidersDialog.vue), [components/dialogs/PresenceDialog.vue](../components/dialogs/PresenceDialog.vue), [components/dialogs/PricingPlanDialog.vue](../components/dialogs/PricingPlanDialog.vue), [components/dialogs/ReferAndEarnDialog.vue](../components/dialogs/ReferAndEarnDialog.vue), [components/dialogs/RejectProjectDialog.vue](../components/dialogs/RejectProjectDialog.vue), [components/dialogs/ScheduleDetailsDialog.vue](../components/dialogs/ScheduleDetailsDialog.vue), [components/dialogs/ShareProjectDialog.vue](../components/dialogs/ShareProjectDialog.vue), [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue), [components/dialogs/UserInfoEditDialog.vue](../components/dialogs/UserInfoEditDialog.vue), [components/dialogs/UserUpgradePlanDialog.vue](../components/dialogs/UserUpgradePlanDialog.vue), [pages/dashboard-teacher.vue](../pages/dashboard-teacher.vue), [pages/reports.vue](../pages/reports.vue)

## DropZone

**Kelompok:** Core bawaan. **Source:** [@core/components/DropZone.vue](../@core/components/DropZone.vue).

Area drop file contoh menggunakan composable drag/drop dan preview file lokal.

**Kontrak eksplisit:**

```ts
interface FileData {
    file: File;
    url: string;
}
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## I18n

**Kelompok:** Core bawaan. **Source:** [@core/components/I18n.vue](../@core/components/I18n.vue).

Menu pilihan bahasa yang mengikuti konfigurasi locale.

**Kontrak eksplisit:**

```ts
import type { I18nLanguage } from '@layouts/types'

interface Props {
    languages: I18nLanguage[];
    location?: any;
}

withDefaults(defineProps<Props>(), {
    location: 'bottom end',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## MoreBtn

**Kelompok:** Core bawaan. **Source:** [@core/components/MoreBtn.vue](../@core/components/MoreBtn.vue).

Menu aksi ringkas dengan ikon dan item menu dari props.

**Kontrak eksplisit:**

```ts
interface Props {
    menuList?: unknown[];
    itemProps?: boolean;
    iconSize?: string;
}

defineProps<Props>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [@core/components/cards/CardStatisticsVertical.vue](../@core/components/cards/CardStatisticsVertical.vue)

## Notifications

**Kelompok:** Core bawaan. **Source:** [@core/components/Notifications.vue](../@core/components/Notifications.vue).

Menu notifikasi, status terbaca, hapus, dan aksi ke parent.

**Kontrak eksplisit:**

```ts
import type { Notification } from '@layouts/types'

interface Props {
    notifications: Notification[];
    badgeProps?: object;
    location?: any;
}

interface Emit {
    (e: 'read', value: number[]): void;
    (e: 'unread', value: number[]): void;
    (e: 'remove', value: number): void;
    (e: 'click:notification', value: Notification): void;
}

withDefaults(defineProps<Props>(), {
    location: 'bottom end',
    badgeProps: undefined,
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/NavBarNotifications.vue](../layouts/components/NavBarNotifications.vue)

## ProductDescriptionEditor

**Kelompok:** Core bawaan. **Source:** [@core/components/ProductDescriptionEditor.vue](../@core/components/ProductDescriptionEditor.vue).

Editor deskripsi produk berbasis Tiptap dengan toolbar format.

**Kontrak eksplisit:**

```ts
defineProps<{
    modelValue: string;
    placeholder?: string;
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## ScrollToTop

**Kelompok:** Core bawaan. **Source:** [@core/components/ScrollToTop.vue](../@core/components/ScrollToTop.vue).

Kontrol kembali ke atas berdasarkan posisi scroll halaman.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## Shortcuts

**Kelompok:** Core bawaan. **Source:** [@core/components/Shortcuts.vue](../@core/components/Shortcuts.vue).

Menu kumpulan shortcut dengan ikon, judul, dan tujuan navigasi.

**Kontrak eksplisit:**

```ts
interface Shortcut {
    icon: string;
    title: string;
    subtitle: string;
    to: object | string;
}

interface Props {
    togglerIcon?: string;
    shortcuts: Shortcut[];
}

withDefaults(defineProps<Props>(), {
    togglerIcon: 'ri-star-smile-line',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/NavbarShortcuts.vue](../layouts/components/NavbarShortcuts.vue)

## TablePagination

**Kelompok:** Core bawaan. **Source:** [@core/components/TablePagination.vue](../@core/components/TablePagination.vue).

Kontrol jumlah item per halaman dan nomor halaman; data/pagination dikelola parent.

**Kontrak eksplisit:**

```ts
interface Props {
    page: number;
    itemsPerPage: number;
    totalItems: number;
}

interface Emit {
    (e: 'update:page', value: number): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## TheCustomizer

**Kelompok:** Core bawaan. **Source:** [@core/components/TheCustomizer.vue](../@core/components/TheCustomizer.vue).

Panel konfigurasi tampilan melalui store tema/layout dan cookie preferensi.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## ThemeSwitcher

**Kelompok:** Core bawaan. **Source:** [@core/components/ThemeSwitcher.vue](../@core/components/ThemeSwitcher.vue).

Menu mode system/light/dark yang mengikuti store konfigurasi.

**Kontrak eksplisit:**

```ts
import type { ThemeSwitcherTheme } from '@layouts/types'

defineProps<{
    themes: ThemeSwitcherTheme[];
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/NavbarThemeSwitcher.vue](../layouts/components/NavbarThemeSwitcher.vue)

## TiptapEditor

**Kelompok:** Core bawaan. **Source:** [@core/components/TiptapEditor.vue](../@core/components/TiptapEditor.vue).

Editor rich text berbasis Tiptap dengan model konten HTML dan toolbar.

**Kontrak eksplisit:**

```ts
interface Props {
    modelValue: string;
    placeholder?: string;
    isDivider?: boolean;
}

withDefaults(defineProps<Props>(), {
    isDivider: true,
})

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AppDateTimePicker

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/AppDateTimePicker.vue](../@core/components/app-form-elements/AppDateTimePicker.vue).

Adapter Flatpickr dengan gaya Vuetify dan dukungan atribut/slot input.

**Kontrak eksplisit:**

```ts
interface Emit {
    (e: 'click:control', val: MouseEvent): true;
    (e: 'mousedown:control', val: MouseEvent): true;
    (e: 'update:focused', val: MouseEvent): true;
    (e: 'update:modelValue', val: string): void;
    (e: 'click:clear', el: MouseEvent): void;
}

defineProps({
    autofocus: Boolean,
    counter: [Boolean, Number, String] as PropType<true | number | string>,
    counterValue: Function as PropType<(value: any) => number>,
    prefix: String,
    placeholder: String,
    persistentPlaceholder: Boolean,
    persistentCounter: Boolean,
    suffix: String,
    type: {
        type: String,
        default: 'text',
    },
    modelModifiers: Object as PropType<Record<string, boolean>>,
    ...makeVInputProps({
        density: 'comfortable',
        hideDetails: 'auto',
    }),
    ...makeVFieldProps({
        variant: 'outlined',
        color: 'primary',
    }),
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/attendance.vue](../pages/attendance.vue), [pages/reports.vue](../pages/reports.vue)

## CustomCheckboxes

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomCheckboxes.vue](../@core/components/app-form-elements/CustomCheckboxes.vue).

Pilihan multi-select bergaya kartu dengan label/deskripsi.

**Kontrak eksplisit:**

```ts
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
    selectedCheckbox: string[];
    checkboxContent: CustomInputContent[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedCheckbox', value: string[]): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CustomCheckboxesWithIcon

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomCheckboxesWithIcon.vue](../@core/components/app-form-elements/CustomCheckboxesWithIcon.vue).

Pilihan checkbox kartu dengan ikon.

**Kontrak eksplisit:**

```ts
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
    selectedCheckbox: string[];
    checkboxContent: CustomInputContent[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedCheckbox', value: string[]): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CustomCheckboxesWithImage

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomCheckboxesWithImage.vue](../@core/components/app-form-elements/CustomCheckboxesWithImage.vue).

Pilihan checkbox kartu dengan gambar.

**Kontrak eksplisit:**

```ts
import type { GridColumn } from '@core/types'

interface Props {
    selectedCheckbox: string[];
    checkboxContent: {
        bgImage: string;
        value: string;
        label?: string;
    }[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedCheckbox', value: string[]): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `label`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CustomRadios

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomRadios.vue](../@core/components/app-form-elements/CustomRadios.vue).

Pilihan tunggal bergaya kartu dengan label/deskripsi.

**Kontrak eksplisit:**

```ts
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
    selectedRadio: string;
    radioContent: CustomInputContent[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedRadio', value: string): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `default`

**Konsumen statis:** [components/dialogs/AddEditAddressDialog.vue](../components/dialogs/AddEditAddressDialog.vue), [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue)

## CustomRadiosWithIcon

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomRadiosWithIcon.vue](../@core/components/app-form-elements/CustomRadiosWithIcon.vue).

Pilihan radio kartu dengan ikon.

**Kontrak eksplisit:**

```ts
import type { CustomInputContent, GridColumn } from '@core/types'

interface Props {
    selectedRadio: string;
    radioContent: CustomInputContent[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedRadio', value: string): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CustomRadiosWithImage

**Kelompok:** Core bawaan. **Source:** [@core/components/app-form-elements/CustomRadiosWithImage.vue](../@core/components/app-form-elements/CustomRadiosWithImage.vue).

Pilihan radio kartu dengan gambar.

**Kontrak eksplisit:**

```ts
import type { GridColumn } from '@core/types'

interface Props {
    selectedRadio: string;
    radioContent: {
        bgImage: string | undefined;
        value: string;
        label?: string;
    }[];
    gridColumn?: GridColumn;
}

interface Emit {
    (e: 'update:selectedRadio', value: string): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** `content`, `label`

**Konsumen statis:** [@core/components/TheCustomizer.vue](../@core/components/TheCustomizer.vue)

## AppCardActions

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/AppCardActions.vue](../@core/components/cards/AppCardActions.vue).

Kartu dengan aksi collapse, refresh, close, dan slot konten.

**Kontrak eksplisit:**

```ts
interface Props {
    collapsed?: boolean;
    noActions?: boolean;
    actionCollapsed?: boolean;
    actionRefresh?: boolean;
    actionRemove?: boolean;
    loading?: boolean | undefined;
    title?: string;
}

interface Emit {
    (e: 'collapsed', isContentCollapsed: boolean): void;
    (e: 'refresh', stopLoading: () => void): void;
    (e: 'trash'): void;
    (e: 'initialLoad'): void;
    (e: 'update:loading', loading: boolean): void;
}

withDefaults(defineProps<Props>(), {
    collapsed: false,
    noActions: false,
    actionCollapsed: false,
    actionRefresh: false,
    actionRemove: false,
    loading: undefined,
    title: undefined,
})

defineEmits<Emit>()
```

**Slot publik:** `title`, `before-actions`, `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AppCardCode

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/AppCardCode.vue](../@core/components/cards/AppCardCode.vue).

Kartu demo dengan slot preview dan panel kode TypeScript/JavaScript.

**Kontrak eksplisit:**

```ts
type CodeLanguages = 'ts' | 'js';

interface Props {
    title: string;
    code: CodeProp;
    codeLanguage?: string;
    noPadding?: boolean;
}

type CodeProp = Record<CodeLanguages, string>;

withDefaults(defineProps<Props>(), {
    codeLanguage: 'markup',
    noPadding: false,
})
```

**Slot publik:** `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CardStatisticsHorizontal

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/CardStatisticsHorizontal.vue](../@core/components/cards/CardStatisticsHorizontal.vue).

Kartu statistik ringkas dengan susunan horizontal.

**Kontrak eksplisit:**

```ts
interface Props {
    title: string;
    color?: string;
    icon: string;
    stats: number;
    change: number;
}

withDefaults(defineProps<Props>(), {
    color: 'primary',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CardStatisticsVertical

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/CardStatisticsVertical.vue](../@core/components/cards/CardStatisticsVertical.vue).

Kartu statistik dengan susunan vertikal dan perubahan persentase.

**Kontrak eksplisit:**

```ts
interface Props {
    title: string;
    color?: string;
    icon: string;
    stats: string;
    change: number;
    subtitle: string;
}

withDefaults(defineProps<Props>(), {
    color: 'primary',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CardStatisticsWithIcon

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/CardStatisticsWithIcon.vue](../@core/components/cards/CardStatisticsWithIcon.vue).

Kartu statistik dengan ikon serta keterangan/perubahan.

**Kontrak eksplisit:**

```ts
defineProps<{
    title: string;
    value: string;
    change: number;
    desc: string;
    icon: string;
    iconColor: string;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## CardStatisticsWithImages

**Kelompok:** Core bawaan. **Source:** [@core/components/cards/CardStatisticsWithImages.vue](../@core/components/cards/CardStatisticsWithImages.vue).

Kartu statistik dengan ilustrasi/gambar pendamping.

**Kontrak eksplisit:**

```ts
interface Props {
    title: string;
    subtitle: string;
    stats: string;
    change: number;
    image: string;
    color?: string;
}

withDefaults(defineProps<Props>(), {
    color: 'primary',
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## HorizontalNav

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/HorizontalNav.vue](../@layouts/components/HorizontalNav.vue).

Daftar item navigasi horizontal yang memilih renderer link/group.

**Kontrak eksplisit:**

```ts
import type { HorizontalNavItems, NavGroup, NavLink } from '@layouts/types'

defineProps<{
    navItems: HorizontalNavItems;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [@layouts/components/HorizontalNavLayout.vue](../@layouts/components/HorizontalNavLayout.vue)

## HorizontalNavGroup

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/HorizontalNavGroup.vue](../@layouts/components/HorizontalNavGroup.vue).

Grup navigasi horizontal dengan submenu dan pemeriksaan akses CASL.

**Kontrak eksplisit:**

```ts
import type { NavGroup } from '@layouts/types'

interface Props {
    item: NavGroup;
    childrenAtEnd?: boolean;
    isSubItem?: boolean;
}

withDefaults(defineProps<Props>(), {
    childrenAtEnd: false,
    isSubItem: false,
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## HorizontalNavLayout

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/HorizontalNavLayout.vue](../@layouts/components/HorizontalNavLayout.vue).

Shell layout horizontal dengan navbar, navigasi, konten, dan footer.

**Kontrak eksplisit:**

```ts
import type { HorizontalNavItems } from '@layouts/types'

defineProps<{
    navItems: HorizontalNavItems;
}>()
```

**Slot publik:** `navbar`, `default`, `footer`

**Konsumen statis:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue)

## HorizontalNavLink

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/HorizontalNavLink.vue](../@layouts/components/HorizontalNavLink.vue).

Link navigasi horizontal dengan status aktif dan pemeriksaan akses.

**Kontrak eksplisit:**

```ts
import type { NavLink } from '@layouts/types'

interface Props {
    item: NavLink;
    isSubItem?: boolean;
}

withDefaults(defineProps<Props>(), {
    isSubItem: false,
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## HorizontalNavPopper

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/HorizontalNavPopper.vue](../@layouts/components/HorizontalNavPopper.vue).

Popover submenu horizontal berbasis Floating UI; menutup saat route berubah.

**Kontrak eksplisit:**

```ts
import type { ReferenceElement } from '@floating-ui/dom'

interface Props {
    popperInlineEnd?: boolean;
    tag?: string;
    contentContainerTag?: string;
    isRtl?: boolean;
}

withDefaults(defineProps<Props>(), {
    popperInlineEnd: false,
    tag: 'div',
    contentContainerTag: 'div',
    isRTL: false,
})
```

**Slot publik:** `default`, `content`

**Konsumen statis:** [@layouts/components/HorizontalNavGroup.vue](../@layouts/components/HorizontalNavGroup.vue)

## TransitionExpand

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/TransitionExpand.vue](../@layouts/components/TransitionExpand.vue).

Transisi ekspansi tinggi konten; infrastruktur animasi bawaan.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [@layouts/components/VerticalNavGroup.vue](../@layouts/components/VerticalNavGroup.vue)

**Catatan implementasi:** Mengukur dan menganimasikan height; bukan transform/opacity. Tinjau prefers-reduced-motion saat digunakan kembali.

## VNodeRenderer

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VNodeRenderer.tsx](../@layouts/components/VNodeRenderer.tsx).

Renderer VNode atau array VNode dari konfigurasi, termasuk logo aplikasi.

**Kontrak eksplisit:**

```ts
import type { PropType, VNode } from 'vue'

export type VNodeRenderer = InstanceType<typeof VNodeRenderer>;

props: {
    nodes: {
        type: [Array, Object] as PropType<VNode | VNode[]>,
        required: true,
    },
}
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [@layouts/components/VerticalNav.vue](../@layouts/components/VerticalNav.vue), [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [pages/login.vue](../pages/login.vue)

## VerticalNav

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VerticalNav.vue](../@layouts/components/VerticalNav.vue).

Sidebar responsif dengan logo, menu utama/bawah, serta kontrol overlay/collapse.

**Kontrak eksplisit:**

```ts
import type { Component } from 'vue'

import type { NavGroup, NavLink, NavSectionTitle, VerticalNavItems } from '@layouts/types'

interface Props {
    tag?: string | Component;
    navItems: VerticalNavItems;
    bottomNavItems?: VerticalNavItems;
    isOverlayNavActive: boolean;
    toggleIsOverlayNavActive: (value: boolean) => void;
}

withDefaults(defineProps<Props>(), {
    tag: 'aside',
})
```

**Slot publik:** `nav-header`, `before-nav-items`, `nav-items`, `after-nav-items`

**Konsumen statis:** [@layouts/components/VerticalNavLayout.vue](../@layouts/components/VerticalNavLayout.vue)

## VerticalNavGroup

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VerticalNavGroup.vue](../@layouts/components/VerticalNavGroup.vue).

Grup sidebar bertingkat dengan status aktif dan perilaku accordion.

**Kontrak eksplisit:**

```ts
import type { NavGroup } from '@layouts/types'

defineProps<{
    item: NavGroup;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## VerticalNavLayout

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VerticalNavLayout.vue](../@layouts/components/VerticalNavLayout.vue).

Shell layout vertikal yang menyelaraskan overlay dan sidebar responsif.

**Kontrak eksplisit:**

```ts
import type { VerticalNavItems } from '@layouts/types'

interface Props {
    navItems: VerticalNavItems;
    bottomNavItems?: VerticalNavItems;
    verticalNavAttrs?: {
        wrapper?: string;
        wrapperProps?: Record<string, unknown>;
    };
}

withDefaults(defineProps<Props>(), {
    verticalNavAttrs: () => ({}),
})
```

**Slot publik:** `vertical-nav-header`, `before-vertical-nav-items`, `after-vertical-nav-items`, `navbar`, `default`, `footer`

**Konsumen statis:** [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## VerticalNavLink

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VerticalNavLink.vue](../@layouts/components/VerticalNavLink.vue).

Link sidebar dengan status aktif, badge, dan pemeriksaan akses CASL.

**Kontrak eksplisit:**

```ts
import type { NavLink } from '@layouts/types'

defineProps<{
    item: NavLink;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## VerticalNavSectionTitle

**Kelompok:** Infrastruktur layout. **Source:** [@layouts/components/VerticalNavSectionTitle.vue](../@layouts/components/VerticalNavSectionTitle.vue).

Judul kelompok sidebar yang mengikuti mode mini dan akses.

**Kontrak eksplisit:**

```ts
import type { NavSectionTitle } from '@layouts/types'

defineProps<{
    item: NavSectionTitle;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AppLoadingIndicator

**Kelompok:** Komponen aplikasi. **Source:** [components/AppLoadingIndicator.vue](../components/AppLoadingIndicator.vue).

Indikator progres perpindahan halaman Nuxt; status mengikuti hook navigasi, bukan progres unduhan aktual.

**Kontrak eksplisit:**

```ts
defineExpose({
    fallbackHandle,
    resolveHandle,
})
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AppPricing

**Kelompok:** Komponen aplikasi. **Source:** [components/AppPricing.vue](../components/AppPricing.vue).

Showcase paket harga dengan pilihan bulanan/tahunan dan data contoh internal; bukan integrasi pembayaran.

**Kontrak eksplisit:**

```ts
interface Pricing {
    title?: string;
    cols?: number | string;
    sm?: number | string;
    md?: string | number;
    lg?: string | number;
    xl?: string | number;
}

defineProps<Pricing>()
```

**Slot publik:** `heading`, `subtitle`

**Konsumen statis:** [components/dialogs/PricingPlanDialog.vue](../components/dialogs/PricingPlanDialog.vue)

## AppSearchHeader

**Kelompok:** Komponen aplikasi. **Source:** [components/AppSearchHeader.vue](../components/AppSearchHeader.vue).

Header pencarian bergambar dengan varian latar light/dark dan input melalui atribut turunan.

**Kontrak eksplisit:**

```ts
interface Props {
    title?: string;
    subtitle?: string;
    customClass?: string;
    placeholder?: string;
}

withDefaults(defineProps<Props>(), {
    placeholder: 'Ask a question..',
})
```

**Slot publik:** `default`

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## ErrorHeader

**Kelompok:** Komponen aplikasi. **Source:** [components/ErrorHeader.vue](../components/ErrorHeader.vue).

Header halaman error dengan kode status, judul, dan deskripsi.

**Kontrak eksplisit:**

```ts
interface Props {
    statusCode?: string | number;
    title?: string;
    description?: string;
}

defineProps<Props>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [error.vue](../error.vue)

## MeetingJournalReportPreview

**Kelompok:** Komponen aplikasi. **Source:** [components/MeetingJournalReportPreview.vue](../components/MeetingJournalReportPreview.vue).

Pratinjau laporan jurnal pertemuan berbasis siswa, sesi, buku, dan pertemuan; memuat identitas Timedoor.

**Kontrak eksplisit:**

```ts
import type { StudentRecord } from '@/data/students'

import type { StudentSession } from '@/data/studentSessions'

import type { StudentBook } from '@/data/studentBooks'

defineProps<{
    student: Pick<StudentRecord, 'name'>;
    session: Pick<StudentSession, 'code'>;
    book: Pick<StudentBook, 'title'>;
    meeting: Pick<StudentMeeting, 'startsAt' | 'endsAt' | 'teacherName' | 'className' | 'lessons'>;
    journal: MeetingJournal;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/marketing/MarketingPreviewDocument.vue](../components/marketing/MarketingPreviewDocument.vue), [pages/daily-journal/[id].vue](../pages/daily-journal/[id].vue), [pages/meeting-journal/create.vue](../pages/meeting-journal/create.vue), [pages/student-meeting-journal.vue](../pages/student-meeting-journal.vue)

## VueApexCharts.client

**Kelompok:** Komponen aplikasi. **Source:** [components/VueApexCharts.client.vue](../components/VueApexCharts.client.vue).

Adapter client-only untuk vue3-apexcharts; atribut dan slot diteruskan ke chart.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## BaseComponentDoc

**Kelompok:** Dokumentasi reusable. **Source:** [components/design-system/BaseComponentDoc.vue](../components/design-system/BaseComponentDoc.vue).

Kerangka dokumentasi dengan urutan Overview, Preview, Variants, States, Usage, API, Accessibility. Menggunakan UiSectionHeader, VRow/VCol, dan VCard; kode dibungkus agar tidak menyebabkan overflow mobile. API ditampilkan sebagai definition list. Parent mengelola semua state demo.

**Kontrak eksplisit:**

```ts
interface ApiItem {
  name: string
  type: string
  description: string
}
defineProps<{
  title: string
  description: string
  componentName: string
  source: string
  overview: string
  usage: string
  api: ApiItem[]
  accessibility: string[]
}>()
```

Semua props wajib. Tidak ada default, event, model, atau expose eksplisit.

**Slot publik:** `preview`, `variants`, `states`.

**Konsumen statis:** [Buttons](../pages/components/buttons.vue), [Text Field](../pages/components/text-field.vue), [Tabs](../pages/components/tabs.vue), [Stepper](../pages/components/stepper.vue), [Breadcrumb](../pages/components/breadcrumb.vue).

**Batasan:** referensi API berisi kontrak yang dipakai contoh, bukan API lengkap Vuetify. Contoh Breadcrumb memakai VBreadcrumbs dari dependensi terpasang, bukan komponen custom sebelumnya. AppStepper memakai centered layout dan tombol Back/Next; keterbatasan keyboard layout default didokumentasikan tanpa mengubah komponen global.

## DesignSystemShowcase

Showcase lama tetap tersedia di /design-system/component sebagai referensi. Menu utama Component kini memakai halaman terpisah di /components/*.

**Kelompok:** Komponen aplikasi. **Source:** [components/design-system/DesignSystemShowcase.vue](../components/design-system/DesignSystemShowcase.vue).

Showcase Design System bersama untuk route Typography, Color System, dan Component; section menentukan konten, state filter/dialog/snackbar tetap lokal. Component Review ditampilkan sebagai bagian kedua pada section components.

**Kontrak eksplisit:**

```ts
defineProps<{
    section: 'typography' | 'colors' | 'components';
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/design-system/color-system.vue](../pages/design-system/color-system.vue), [pages/design-system/component.vue](../pages/design-system/component.vue), [pages/design-system/typography.vue](../pages/design-system/typography.vue)

## AddAuthenticatorAppDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AddAuthenticatorAppDialog.vue](../components/dialogs/AddAuthenticatorAppDialog.vue).

Dialog kode authenticator dengan gambar QR contoh; mengirim kode melalui event submit.

**Kontrak eksplisit:**

```ts
interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'submit', value: string): void;
}

interface Props {
    authCode?: string;
    isDialogVisible: boolean;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue)

## AddEditAddressDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AddEditAddressDialog.vue](../components/dialogs/AddEditAddressDialog.vue).

Form tambah/edit alamat tagihan; data dikirim ke parent melalui submit.

**Kontrak eksplisit:**

```ts
interface BillingAddress {
    firstName: string | undefined;
    lastName: string | undefined;
    selectedCountry: string | null;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    contact: string;
    country: string | null;
    state: string;
    zipCode: number | null;
}

interface Props {
    billingAddress?: BillingAddress;
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'submit', value: BillingAddress): void;
}

withDefaults(defineProps<Props>(), {
    billingAddress: () => ({
        firstName: '',
        lastName: '',
        selectedCountry: null,
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        contact: '',
        country: null,
        state: '',
        zipCode: null,
    }),
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AddEditPermissionDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AddEditPermissionDialog.vue](../components/dialogs/AddEditPermissionDialog.vue).

Form nama permission; mengirim nama baru ke parent tanpa menyimpan sendiri.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
    permissionName?: string;
}

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'update:permissionName', value: string): void;
}

withDefaults(defineProps<Props>(), {
    permissionName: '',
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AddEditRoleDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AddEditRoleDialog.vue](../components/dialogs/AddEditRoleDialog.vue).

Form role dan matriks permission read/write/create dengan select-all; penyimpanan dikelola parent.

**Kontrak eksplisit:**

```ts
interface Permission {
    name: string;
    read: boolean;
    write: boolean;
    create: boolean;
}

interface Roles {
    name: string;
    permissions: Permission[];
}

interface Props {
    rolePermissions?: Roles;
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'update:rolePermissions', value: Roles): void;
}

withDefaults(defineProps<Props>(), {
    rolePermissions: () => ({
        name: '',
        permissions: [],
    }),
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AddPaymentMethodDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AddPaymentMethodDialog.vue](../components/dialogs/AddPaymentMethodDialog.vue).

Dialog pemilihan penyedia kartu pembayaran dengan aset light/dark; data metode merupakan contoh.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AllStudentDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/AllStudentDialog.vue](../components/dialogs/AllStudentDialog.vue).

Daftar siswa dengan status kuota/kehadiran/laptop dan event approve/reject per siswa.

**Kontrak eksplisit:**

```ts
interface Student {
    id: string;
    name: string;
    course: string;
    badgeText: string;
    badgeColor: 'warning' | 'error' | 'success';
    isPresent: boolean;
    hasLaptop: boolean;
}

interface Props {
    isDialogVisible: boolean;
    students: Student[];
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'approve-student', studentId: string): void;
    (e: 'reject-student', studentId: string): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/attendance.vue](../pages/attendance.vue)

## ApproveProjectDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ApproveProjectDialog.vue](../components/dialogs/ApproveProjectDialog.vue).

Konfirmasi persetujuan project/item; menerbitkan confirm lalu menutup dialog.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
    itemType?: string;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'confirm'): void;
}

withDefaults(defineProps<Props>(), {
    itemType: 'project',
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/assessments.vue](../pages/assessments.vue)

## CardAddEditDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/CardAddEditDialog.vue](../components/dialogs/CardAddEditDialog.vue).

Form data kartu pembayaran; submit meneruskan detail ke parent, bukan memproses transaksi.

**Kontrak eksplisit:**

```ts
interface Details {
    number: string;
    name: string;
    expiry: string;
    cvv: string;
    isPrimary: boolean;
    type: string;
}

interface Emit {
    (e: 'submit', value: Details): void;
    (e: 'update:isDialogVisible', value: boolean): void;
}

interface Props {
    cardDetails?: Details;
    isDialogVisible: boolean;
}

withDefaults(defineProps<Props>(), {
    cardDetails: () => ({
        number: '',
        name: '',
        expiry: '',
        cvv: '',
        isPrimary: false,
        type: '',
    }),
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## ConfirmDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ConfirmDialog.vue](../components/dialogs/ConfirmDialog.vue).

Konfirmasi umum dengan hasil konfirmasi atau pembatalan dan pesan hasil tersendiri.

**Kontrak eksplisit:**

```ts
interface Props {
    confirmationQuestion: string;
    isDialogVisible: boolean;
    confirmTitle: string;
    confirmMsg: string;
    cancelTitle: string;
    cancelMsg: string;
}

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'confirm', value: boolean): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/dialogs/UserUpgradePlanDialog.vue](../components/dialogs/UserUpgradePlanDialog.vue), [components/sections/account-settings/AccountAvatar.vue](../components/sections/account-settings/AccountAvatar.vue), [components/sections/account-settings/AccountSettings.vue](../components/sections/account-settings/AccountSettings.vue)

## CreateAppDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/CreateAppDialog.vue](../components/dialogs/CreateAppDialog.vue).

Wizard contoh pembuatan aplikasi: detail, framework, database, billing, dan submit.

**Kontrak eksplisit:**

```ts
defineProps<{
    isDialogVisible: boolean;
}>()

defineEmits<{
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'updatedData', val: unknown): void;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## EnableOneTimePasswordDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/EnableOneTimePasswordDialog.vue](../components/dialogs/EnableOneTimePasswordDialog.vue).

Dialog aktivasi OTP menggunakan data form dan event ke parent; bukan layanan OTP mandiri.

**Kontrak eksplisit:**

```ts
interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
    (e: 'submit', value: string): void;
}

interface Props {
    mobileNumber?: string;
    isDialogVisible: boolean;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue)

## PaymentProvidersDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/PaymentProvidersDialog.vue](../components/dialogs/PaymentProvidersDialog.vue).

Dialog penyedia pembayaran dengan konten contoh; integrasi transaksi tidak disediakan.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## PresenceDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/PresenceDialog.vue](../components/dialogs/PresenceDialog.vue).

Dialog pencatatan kehadiran untuk alur akademi.

**Kontrak eksplisit:**

```ts
interface Student {
    id: string;
    name: string;
    course: string;
    badgeText: string;
    badgeColor: 'warning' | 'error' | 'success';
    isPresent: boolean;
    hasLaptop: boolean;
}

interface Teacher {
    id: string;
    name: string;
}

interface ClassSession {
    id: string;
    name: string;
    room: string;
    date: string;
    teachersCount: number;
    teachers: Teacher[];
    timeStart: string;
    timeEnd: string;
    duration: string;
    className: string;
    meetingType: string;
    meetingNumber: string;
    status: 'Active' | 'Ongoing' | 'Waiting Approval' | 'Completed';
    students: Student[];
}

interface StudentEquipment {
    laptop: boolean;
    mouse: boolean;
    headphone: boolean;
    speaker: boolean;
    charger: boolean;
}

interface LocalStudent extends Student {
    quota: string;
    remarks: string;
    showEquipment: boolean;
    equipment: StudentEquipment;
}

interface Props {
    isDialogVisible: boolean;
    classSession: ClassSession | null;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'submitAttendance', payload: {
        students: Student[];
        isStartClass: boolean;
    }): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/attendance-detail.vue](../pages/attendance-detail.vue), [pages/attendance.vue](../pages/attendance.vue)

## PricingPlanDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/PricingPlanDialog.vue](../components/dialogs/PricingPlanDialog.vue).

Dialog showcase paket harga yang menggunakan AppPricing.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## ReferAndEarnDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ReferAndEarnDialog.vue](../components/dialogs/ReferAndEarnDialog.vue).

Dialog contoh referral dengan informasi undangan dan tautan berbagi.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## RejectProjectDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/RejectProjectDialog.vue](../components/dialogs/RejectProjectDialog.vue).

Dialog penolakan project/item dengan alasan dan konfirmasi ke parent.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
    itemType?: string;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'confirm'): void;
}

withDefaults(defineProps<Props>(), {
    itemType: 'project',
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/assessments.vue](../pages/assessments.vue)

## ScheduleDetailsDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ScheduleDetailsDialog.vue](../components/dialogs/ScheduleDetailsDialog.vue).

Dialog rincian jadwal kelas/pertemuan dan aksi yang tersedia pada jadwal.

**Kontrak eksplisit:**

```ts
interface StudentMember {
    name: string;
    initials: string;
    studentId: string;
    book: string;
    ageGroup: string;
    meetingsLeft: number;
    latestLesson: {
        number: string;
        title: string;
    };
}

interface CalendarEvent {
    id: string;
    title: string;
    subtitle?: string;
    date: string;
    startTime: string;
    endTime: string;
    type: 'class' | 'time_off';
    room?: string;
    classType?: string;
    status?: string;
    students?: StudentMember[];
}

interface Props {
    isDialogVisible: boolean;
    event: CalendarEvent | null;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
    (e: 'startClass', eventId: string): void;
    (e: 'deleteEvent', eventId: string): void;
    (e: 'seeHistory', student: any): void;
}

withDefaults(defineProps<Props>(), {
    event: null,
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/schedule.vue](../pages/schedule.vue)

## ScoreHistoryDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ScoreHistoryDialog.vue](../components/dialogs/ScoreHistoryDialog.vue).

Dialog riwayat nilai siswa untuk alur assessment.

**Kontrak eksplisit:**

```ts
interface QuestionResult {
    number: number;
    type: 'Short Answer' | 'Multiple Choice' | 'Free Text';
    correct: number;
    total: number;
    timeSpent: string;
}

interface ScoreAttempt {
    label: 'First Score' | 'Last Score' | 'Best Score';
    icon: string;
    date: string;
    timeSpent: string;
    score: number;
    maxScore: number;
    points: number;
    questions: QuestionResult[];
}

interface StudentInfo {
    name: string;
    initials: string;
    studentId: string;
    className?: string;
    book: string;
    lessonName: string;
}

interface Props {
    isDialogVisible: boolean;
    student?: StudentInfo | null;
    attempts?: ScoreAttempt[];
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

withDefaults(defineProps<Props>(), {
    student: null,
    attempts: () => [],
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/assessments.vue](../pages/assessments.vue), [pages/schedule.vue](../pages/schedule.vue)

## ShareProjectDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/ShareProjectDialog.vue](../components/dialogs/ShareProjectDialog.vue).

Dialog contoh berbagi project dan pengaturan akses anggota.

**Kontrak eksplisit:**

```ts
interface Props {
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

type Permission = 'Owner' | 'Can Edit' | 'Can Comment' | 'Can View';

interface Member {
    avatar: string;
    name: string;
    email: string;
    permission: Permission;
}

defineProps<Props>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## TwoFactorAuthDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/TwoFactorAuthDialog.vue](../components/dialogs/TwoFactorAuthDialog.vue).

Dialog pemilihan metode autentikasi dua faktor; membutuhkan alur backend saat dipakai produksi.

**Kontrak eksplisit:**

```ts
import type { CustomInputContent } from '@core/types'

interface Emit {
    (e: 'update:isDialogVisible', value: boolean): void;
}

interface Props {
    isDialogVisible: boolean;
    smsCode?: string;
    authAppCode?: string;
}

withDefaults(defineProps<Props>(), {
    isDialogVisible: false,
    smsCode: '',
    authAppCode: '',
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## UserInfoEditDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/UserInfoEditDialog.vue](../components/dialogs/UserInfoEditDialog.vue).

Form edit informasi user dengan submit ke parent.

**Kontrak eksplisit:**

```ts
interface UserData {
    id: number | undefined;
    fullName: string | undefined;
    company: string;
    role: string;
    username: string;
    country: string;
    contact: string | undefined;
    email: string | undefined;
    currentPlan: string;
    status: string | undefined;
    avatar: string;
    taskDone: number | null;
    projectDone: number | null;
    taxId: string;
    language: string[];
}

interface Props {
    userData?: UserData;
    isDialogVisible: boolean;
}

interface Emit {
    (e: 'submit', value: UserData): void;
    (e: 'update:isDialogVisible', val: boolean): void;
}

withDefaults(defineProps<Props>(), {
    userData: () => ({
        avatar: '',
        company: '',
        contact: '',
        country: null,
        currentPlan: '',
        email: '',
        fullName: '',
        id: 0,
        role: '',
        status: null,
        username: '',
        language: [],
        projectDone: 0,
        taskDone: 0,
        taxId: '',
    }),
})

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## UserUpgradePlanDialog

**Kelompok:** Dialog. **Source:** [components/dialogs/UserUpgradePlanDialog.vue](../components/dialogs/UserUpgradePlanDialog.vue).

Dialog contoh perubahan paket user dan informasi paket.

**Kontrak eksplisit:**

```ts
interface Emit {
    (e: 'update:isDialogVisible', val: boolean): void;
}

interface Prop {
    isDialogVisible: boolean;
}

defineProps<Prop>()

defineEmits<Emit>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## MarketingBuilder

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingBuilder.vue](../components/marketing/MarketingBuilder.vue).

Editor visual blok marketing dengan panel Elements/Layers/Styles/Variables, zoom, undo/redo, serta upload gambar lokal.

**Kontrak eksplisit:**

```ts
import type { MarketingBlock, MarketingVariable, MarketingVariableType } from '@/composables/useMarketingTemplates'

defineProps<{
    modelValue: MarketingBlock[];
    variables: MarketingVariable[];
    baseMargin?: number;
}>()

defineEmits<{
    'update:modelValue': [
        MarketingBlock[]
    ];
    'update:variables': [
        MarketingVariable[]
    ];
    'update:baseMargin': [
        number
    ];
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/marketing/templates/new.vue](../pages/marketing/templates/new.vue)

**Catatan implementasi:** Penyimpanan melalui parent/composable, browser-local, bukan server upload. Batas gambar dan template mengikuti `utils/marketingCanvas.ts`; shortcut diabaikan dalam input dan preview. Data blok/variabel: `composables/useMarketingTemplates.ts`.

## MarketingCanvas

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingCanvas.vue](../components/marketing/MarketingCanvas.vue).

Renderer blok marketing pada kanvas, dengan interaksi seleksi dan resize sesuai props; dipakai builder dan pratinjau.

**Kontrak eksplisit:**

```ts
import type { MarketingBlock } from '@/composables/useMarketingTemplates'

import type { ResizeHandle } from '@/utils/marketingCanvas'

withDefaults(defineProps<{
    blocks: MarketingBlock[];
    values?: Record<string, string>;
    editable?: boolean;
    interactive?: boolean;
    dragging?: boolean;
    selectedId?: string;
    pageMode?: 'mobile' | 'a4';
    height?: number;
    showPageLimit?: boolean;
}>(), { values: undefined, editable: false, interactive: false, dragging: false, selectedId: '', pageMode: 'mobile', height: undefined, showPageLimit: true })

defineEmits<{
    select: [
        string
    ];
    drag: [
        PointerEvent,
        MarketingBlock
    ];
    resize: [
        PointerEvent,
        MarketingBlock,
        ResizeHandle
    ];
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/marketing/MarketingBuilder.vue](../components/marketing/MarketingBuilder.vue), [components/marketing/MarketingJournalPage.vue](../components/marketing/MarketingJournalPage.vue), [components/marketing/MarketingPreviewDocument.vue](../components/marketing/MarketingPreviewDocument.vue)

## MarketingColorField

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingColorField.vue](../components/marketing/MarketingColorField.vue).

Pemilih warna token library atau HEX kustom dengan validasi dan preview.

**Kontrak eksplisit:**

```ts
defineProps<{
    modelValue: string;
    label: string;
    items: string[];
}>()

defineEmits<{
    'update:modelValue': [
        string
    ];
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/marketing/MarketingElementProperties.vue](../components/marketing/MarketingElementProperties.vue)

## MarketingElementProperties

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingElementProperties.vue](../components/marketing/MarketingElementProperties.vue).

Inspector properti blok marketing, termasuk geometri, teks, warna, gambar, dan aksi terkait.

**Kontrak eksplisit:**

```ts
import type { MarketingBlock, MarketingBlockStyle } from '@/composables/useMarketingTemplates'

defineProps<{
    block: MarketingBlock;
    canvasHeight: number;
    canForward: boolean;
    canBackward: boolean;
}>()

defineEmits<{
    patch: [
        Partial<MarketingBlock>
    ];
    reorder: [
        number
    ];
}>()
```

**Slot publik:** `media`

**Konsumen statis:** [components/marketing/MarketingBuilder.vue](../components/marketing/MarketingBuilder.vue)

## MarketingJournalPage

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingJournalPage.vue](../components/marketing/MarketingJournalPage.vue).

Renderer halaman marketing pada laporan jurnal dari snapshot/template atau fallback demo.

**Kontrak eksplisit:**

```ts
import type { MarketingPageSnapshot } from '@/composables/useMarketingTemplates'

defineProps<{
    snapshot: MarketingPageSnapshot;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/daily-journal/[id].vue](../pages/daily-journal/[id].vue), [pages/meeting-journal/create.vue](../pages/meeting-journal/create.vue), [pages/student-meeting-journal.vue](../pages/student-meeting-journal.vue)

## MarketingPreviewDocument

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingPreviewDocument.vue](../components/marketing/MarketingPreviewDocument.vue).

Pembungkus preview proporsional untuk format mobile atau A4; memuat konten melalui slot.

**Kontrak eksplisit:**

```ts
import type { MarketingBlock } from '@/composables/useMarketingTemplates'

defineProps<{
    blocks: MarketingBlock[];
    baseMargin?: number;
    values: Record<string, string>;
    mode: 'a4' | 'mobile';
    content: 'page2' | 'full';
    testSample?: boolean;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/marketing/MarketingTemplateDetailsDrawer.vue](../components/marketing/MarketingTemplateDetailsDrawer.vue), [pages/marketing/templates/new.vue](../pages/marketing/templates/new.vue)

## MarketingTemplateDetailsDrawer

**Kelompok:** Marketing. **Source:** [components/marketing/MarketingTemplateDetailsDrawer.vue](../components/marketing/MarketingTemplateDetailsDrawer.vue).

Drawer detail template marketing dengan informasi template dan aksi yang didelegasikan ke parent.

**Kontrak eksplisit:**

```ts
defineProps<{
    modelValue: boolean;
    template: MarketingTemplate | null;
}>()

defineEmits<{
    'update:modelValue': [
        boolean
    ];
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/marketing/templates/index.vue](../pages/marketing/templates/index.vue)

## AccountAvatar

**Kelompok:** Pengaturan akun. **Source:** [components/sections/account-settings/AccountAvatar.vue](../components/sections/account-settings/AccountAvatar.vue).

Bagian avatar akun dengan pemilihan/penggantian gambar.

**Kontrak eksplisit:**

```ts
import type { UiAutoCompleteCallbackResponse } from '@/components/ui/UiAutoComplete.vue'
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/account-settings.vue](../pages/account-settings.vue)

## AccountSettings

**Kelompok:** Pengaturan akun. **Source:** [components/sections/account-settings/AccountSettings.vue](../components/sections/account-settings/AccountSettings.vue).

Form pengaturan akun terhubung repository API, store autentikasi, dan validasi proyek.

**Kontrak eksplisit:**

```ts
import type { UiAutoCompleteCallbackResponse } from '@/components/ui/UiAutoComplete.vue'
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/account-settings.vue](../pages/account-settings.vue)

## AccountSettingsDelete

**Kelompok:** Pengaturan akun. **Source:** [components/sections/account-settings/AccountSettingsDelete.vue](../components/sections/account-settings/AccountSettingsDelete.vue).

Bagian penghapusan/deaktivasi akun dengan konfirmasi.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/account-settings.vue](../pages/account-settings.vue)

## AccountSettingsSecurity

**Kelompok:** Pengaturan akun. **Source:** [components/sections/account-settings/AccountSettingsSecurity.vue](../components/sections/account-settings/AccountSettingsSecurity.vue).

Bagian keamanan akun, termasuk perubahan password melalui API/validasi proyek.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/account-settings.vue](../pages/account-settings.vue)

## ThemeCard

**Kelompok:** Komponen aplikasi. **Source:** [components/themes/ThemeCard.vue](../components/themes/ThemeCard.vue).

Kartu tema dengan preview, waktu pembaruan, kategori, dan visibility; mendukung klik, Enter, dan Space.

**Kontrak eksplisit:**

```ts
interface ThemeCardProps {
    name: string;
    updatedAt: string;
    image: string;
    category: string;
    visibility: string;
}

defineProps<ThemeCardProps>()

defineEmits<{
    (event: 'select'): void;
}>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/themes.vue](../pages/themes.vue)

**Catatan implementasi:** Hover saat ini memakai transform dan transition bawaan; reduced-motion serta pembatasan hover pointer belum ditambahkan. Ini catatan inventaris, bukan perbaikan dalam pekerjaan dokumentasi.

## UiAutoComplete

**Kelompok:** UI reusable proyek. **Source:** [components/ui/UiAutoComplete.vue](../components/ui/UiAutoComplete.vue).

Autocomplete asinkron dengan pencarian debounce 500 ms dan pengambilan halaman berikutnya saat scroll.

**Kontrak eksplisit:**

```ts
import type { VAutocomplete } from 'vuetify/components'

export interface UiAutoCompleteCallbackResponse {
    data: any[];
    meta: {
        current_page: number;
        last_page: number;
    };
}

interface UiAutoCompleteProps {
    callback: (data: any) => Promise<UiAutoCompleteCallbackResponse>;
}

defineProps<UiAutoCompleteProps>()

defineModel<any>()
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [components/sections/account-settings/AccountAvatar.vue](../components/sections/account-settings/AccountAvatar.vue), [components/sections/account-settings/AccountSettings.vue](../components/sections/account-settings/AccountSettings.vue), [views/user/AddNewUserDrawer.vue](../views/user/AddNewUserDrawer.vue), [pages/user-variant-2.vue](../pages/user-variant-2.vue), [pages/user.vue](../pages/user.vue)

**Catatan implementasi:** Callback menerima `{ search, page }`, mengembalikan `{ data, meta: { current_page, last_page } }`. Loading aktif selama request dan hasil request lama diabaikan; error masih hanya dicatat ke console. Hasil halaman ditambahkan tanpa deduplikasi. Popup Vuetify dapat di-teleport sehingga listener scroll di dalam root komponen perlu ditinjau saat memakai pagination; parent tetap bertanggung jawab atas feedback error.

## UiSectionHeader

**Kelompok:** UI reusable proyek. **Source:** [components/ui/UiSectionHeader.vue](../components/ui/UiSectionHeader.vue).

Judul dan deskripsi halaman, aksi di kanan, serta navigasi kembali opsional.

**Kontrak eksplisit:**

```ts
import type { RouteLocation } from '#vue-router'

interface Props {
    title: string;
    titleClass?: string;
    description?: string;
    back?: RouteLocation;
    customBack?: boolean;
}

withDefaults(defineProps<Props>(), { titleClass: 'text-h5' })

defineEmits(['click:back'])
```

**Slot publik:** `actions`

**Konsumen statis:** [components/ui/UiTableView.vue](../components/ui/UiTableView.vue), [pages/account-settings.vue](../pages/account-settings.vue), [pages/assessments.vue](../pages/assessments.vue), [pages/attendance-detail.vue](../pages/attendance-detail.vue), [pages/marketing/rule-tester.vue](../pages/marketing/rule-tester.vue), [pages/marketing/templates/index.vue](../pages/marketing/templates/index.vue), [pages/marketing/templates/new.vue](../pages/marketing/templates/new.vue), [pages/meeting-journal/create.vue](../pages/meeting-journal/create.vue), [pages/student-meeting-journal.vue](../pages/student-meeting-journal.vue), [pages/student-session-detail.vue](../pages/student-session-detail.vue), [pages/student-session-history.vue](../pages/student-session-history.vue), [pages/user-variant-2.vue](../pages/user-variant-2.vue), [pages/user.vue](../pages/user.vue)

UiSectionHeader juga digunakan pada halaman [Spacing](../pages/design-system/spacing.vue) dalam grup Foundation.
Kerangka [BaseComponentDoc](../components/design-system/BaseComponentDoc.vue) memakai UiSectionHeader untuk judul seragam pada dokumentasi base component.
Halaman [Iconography](../pages/design-system/iconography.vue) juga memakai UiSectionHeader dan mendokumentasikan VIcon serta alias IconBtn, termasuk ukuran, ikon proyek, semantic aliases, dan aksesibilitas.

## UiTableView

**Kelompok:** UI reusable proyek. **Source:** [components/ui/UiTableView.vue](../components/ui/UiTableView.vue).

Kerangka halaman tabel: header, tab, filter, loading skeleton, tampilan alternatif, dan tabel Vuetify.

**Kontrak eksplisit:**

```ts
interface TabItem {
    label: string;
    value: string;
    count?: number;
    icon?: string;
    badgeColor?: string;
}

withDefaults(defineProps<{
    title: string;
    description?: string;
    tabs?: TabItem[];
    headers?: any[];
    items?: any[];
    loading?: boolean;
    itemsPerPage?: number;
    hideFilters?: boolean;
    hidePagination?: boolean;
    tabsInsideCard?: boolean;
    cardClass?: string;
    tableClass?: string;
    flat?: boolean;
    showViewToggle?: boolean;
    mobileCards?: boolean;
    back?: any;
}>(), {
    tabs: () => [],
    headers: () => [],
    items: () => [],
    loading: false,
    itemsPerPage: 10,
    hideFilters: false,
    hidePagination: false,
    tabsInsideCard: false,
    cardClass: undefined,
    tableClass: undefined,
    flat: false,
    showViewToggle: false,
    mobileCards: false,
})

defineEmits<{
    (e: 'reset-filters'): void;
}>()

defineModel<string>('activeTab')

defineModel<string>('viewType', { default: 'list' })
```

**Slot publik:** `header-actions`, `card-header`, `filters`, `filter-actions`, `view-toggle`, `table-content`, `dynamic: slotName`, `mobile-cards`, `dynamic: `view-${viewType}``

**Konsumen statis:** [components/design-system/DesignSystemShowcase.vue](../components/design-system/DesignSystemShowcase.vue), [pages/attendance-detail.vue](../pages/attendance-detail.vue), [pages/classes.vue](../pages/classes.vue), [pages/course.vue](../pages/course.vue), [pages/dashboard-teacher.vue](../pages/dashboard-teacher.vue), [pages/marketing/templates/index.vue](../pages/marketing/templates/index.vue), [pages/marketing/templates/new.vue](../pages/marketing/templates/new.vue), [pages/student-detail.vue](../pages/student-detail.vue), [pages/student-session-detail.vue](../pages/student-session-detail.vue), [pages/student-session-history.vue](../pages/student-session-history.vue), [pages/students.vue](../pages/students.vue)

**Catatan implementasi:** `mobileCards` default `false`; mode kartu membutuhkan slot `mobile-cards` eksplisit. Breakpoint internal 760px. Jika diaktifkan tanpa slot, tabel desktop tetap disembunyikan di mobile: selalu sediakan slot. `hidePagination` hanya mengubah footer tabel; pagination data kustom/server harus diatur parent. Error data tidak ditangani komponen.

## DefaultLayoutWithHorizontalNav

**Kelompok:** Komposisi shell. **Source:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue).

Komposisi shell horizontal dengan konfigurasi menu, logo, theme switcher, dan profil.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** `default`

**Konsumen statis:** [layouts/default.vue](../layouts/default.vue)

## DefaultLayoutWithVerticalNav

**Kelompok:** Komposisi shell. **Source:** [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue).

Komposisi shell vertikal dengan menu utama/bawah, notifikasi, theme switcher, dan profil.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** `default`

**Konsumen statis:** [layouts/default.vue](../layouts/default.vue)

## Footer

**Kelompok:** Komposisi shell. **Source:** [layouts/components/Footer.vue](../layouts/components/Footer.vue).

Footer aplikasi bawaan.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [@layouts/components/HorizontalNavLayout.vue](../@layouts/components/HorizontalNavLayout.vue), [@layouts/components/VerticalNavLayout.vue](../@layouts/components/VerticalNavLayout.vue), [components/MeetingJournalReportPreview.vue](../components/MeetingJournalReportPreview.vue), [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## NavBarNotifications

**Kelompok:** Komposisi shell. **Source:** [layouts/components/NavBarNotifications.vue](../layouts/components/NavBarNotifications.vue).

Penyedia data notifikasi contoh dan handler untuk komponen Notifications.

**Kontrak eksplisit:**

```ts
import type { Notification } from '@layouts/types'
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## NavSearchBar

**Kelompok:** Komposisi shell. **Source:** [layouts/components/NavSearchBar.vue](../layouts/components/NavSearchBar.vue).

Integrasi pencarian navbar dengan data/saran dan route contoh template.

**Kontrak eksplisit:**

```ts
import type { RouteLocationRaw } from 'vue-router'

import type { SearchResults } from '@db/app-bar-search/types'

interface Suggestion {
    icon: string;
    title: string;
    url: RouteLocationRaw;
}

interface SuggestionGroup {
    title: string;
    content: Suggestion[];
}
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

**Catatan implementasi:** Banyak saran menuju route template yang mungkin tidak ada dalam clone. Inventaris tidak mengesahkan semua tujuan route.

## NavbarShortcuts

**Kelompok:** Komposisi shell. **Source:** [layouts/components/NavbarShortcuts.vue](../layouts/components/NavbarShortcuts.vue).

Penyedia shortcut contoh; tujuan route bawaan harus ditinjau sebelum digunakan.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

**Catatan implementasi:** Daftar shortcut berisi route template yang mungkin tidak tersedia; belum diverifikasi lewat klik.

## NavbarThemeSwitcher

**Kelompok:** Komposisi shell. **Source:** [layouts/components/NavbarThemeSwitcher.vue](../layouts/components/NavbarThemeSwitcher.vue).

Konfigurasi pilihan system/light/dark untuk ThemeSwitcher.

**Kontrak eksplisit:**

```ts
import type { ThemeSwitcherTheme } from '@layouts/types'
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

## UserProfile

**Kelompok:** Komposisi shell. **Source:** [layouts/components/UserProfile.vue](../layouts/components/UserProfile.vue).

Menu profil dari auth store dan logout melalui repository API.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [layouts/components/DefaultLayoutWithHorizontalNav.vue](../layouts/components/DefaultLayoutWithHorizontalNav.vue), [layouts/components/DefaultLayoutWithVerticalNav.vue](../layouts/components/DefaultLayoutWithVerticalNav.vue)

**Catatan implementasi:** Logout memanggil API; pada local demo tanpa backend jangan menganggap logout server sudah tersedia.

## AuthProvider

**Kelompok:** View pendukung. **Source:** [views/pages/authentication/AuthProvider.vue](../views/pages/authentication/AuthProvider.vue).

Tombol provider sosial contoh dengan warna light/dark; tidak menyediakan OAuth backend.

**Kontrak eksplisit:**

Tidak ada props/event/model/expose eksplisit.

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** Tidak ditemukan dalam source aplikasi yang diperiksa.

## AddNewUserDrawer

**Kelompok:** View pendukung. **Source:** [views/user/AddNewUserDrawer.vue](../views/user/AddNewUserDrawer.vue).

Form tambah user dengan validasi dan pengambilan role dari API; userData dikirim ke parent.

**Kontrak eksplisit:**

```ts
import type { UiAutoCompleteCallbackResponse } from '@/components/ui/UiAutoComplete.vue'

defineProps({
    isDrawerOpen: {
        type: Boolean,
        default: false,
    },
    roleList: {
        type: Array,
        default: () => ([]),
    },
})

defineEmits(['update:isDrawerOpen', 'userData'])
```

**Slot publik:** Tidak ada outlet slot eksplisit.

**Konsumen statis:** [pages/user-variant-2.vue](../pages/user-variant-2.vue), [pages/user.vue](../pages/user.vue)
