# Dokumentasi base component

## Tujuan dan scope

- Pisahkan Component dari Foundation menjadi grup menu utama.
- Tambahkan lima submenu: Buttons, Text Field, Tabs, Stepper, Breadcrumb; semuanya memakai `ri-circle-line`.
- Setiap halaman memiliki urutan section yang sama: Overview, Preview, Variants, States, Usage, API, Accessibility.
- Pertahankan `/design-system/component` sebagai showcase lama yang masih dapat diakses langsung. Grup baru menggunakan `/components/*`; index grup mengarah ke Buttons.

## Area perubahan dan reuse

- Navigasi vertikal sebagai sumber bersama navigasi horizontal.
- Halaman baru di `pages/components/` menggunakan VBtn, VTextField, VTabs/VWindow, AppStepper, dan VBreadcrumbs dari dependensi Vuetify terpasang.
- Breadcrumb belum ditemukan dalam implementasi halaman; dokumentasikan sebagai komponen Vuetify tersedia, bukan komponen custom yang sudah dipakai.
- **Gap komponen:** belum ada kerangka dokumentasi dengan tujuh section seragam. Tambahkan `BaseComponentDoc` untuk menyatukan heading, preview slots, code sample, API reference, dan accessibility guidance. Ini abstraksi dokumentasi, bukan wrapper Vuetify tanpa perilaku.
- Dokumentasikan kerangka baru dalam `docs/components.md`; update `spec/design.md` dan README.

## Data dan interaksi

- State demo lokal per halaman, tanpa API/dependensi baru.
- Preview dan variants memberi feedback nyata: tombol menerbitkan status demo; field memvalidasi input; tab mengubah panel; stepper dikontrol lewat Back/Next; breadcrumb memiliki tautan route yang nyata.
- States menunjukkan disabled/loading/error sesuai komponen. Contoh bukan operasi produksi.
- AppStepper existing memiliki keterbatasan navigasi keyboard pada layout default; contoh memakai layout centered serta kontrol VBtn berlabel. Tidak memperbaiki perilaku global di luar scope.
- API reference berupa definition list, bukan tabel baru. Tidak ada keputusan responsif tabel tambahan.

## Token dan layout

- Poppins, judul `text-h4`, heading section `text-h5`, teks `text-body-1/2`, semantic primary/surface/background/on-surface dari design spec.
- VRow/VCol sebagai grid, 24px gutters; stack memakai gap-6. VBtn mengikuti pill default.
- Code block wrap pada mobile. Tidak ada token atau animasi baru.

## Risiko dan validasi

- Props API bersifat referensi yang dipakai contoh, bukan salinan seluruh API Vuetify.
- Verifikasi sumber AppStepper dan default proyek sebelum mendokumentasikan perilakunya.
- Compile seluruh Vue yang berubah; build produksi; cek route/submenu, feedback demo, mobile overflow, light/dark, serta tautan dokumentasi.
- Lint masih terblokir `.eslintrc.cjs` yang hilang; tidak menambah konfigurasi yang tidak diketahui.

## Hasil validasi

- Build produksi berhasil; warning ekstraksi SSR styles Vuetify tetap ada.
- Tujuh file Vue baru berhasil dikompilasi; navigasi lolos pemeriksaan sintaks TypeScript.
- Lima route diuji melalui browser, masing-masing memiliki tujuh section dalam urutan sama.
- Semua halaman diuji pada lebar 390px tanpa overflow halaman; breadcrumb membungkus dan current-page tetap terbaca.
- Demo tombol/loading, validasi field, perpindahan panel tab, aktivasi keyboard tab, Next/Reset stepper, serta ancestor link/redirect breadcrumb berhasil.
- Shared documentation shell diperiksa dalam light/dark; inline code memakai text-high-emphasis agar tidak mewarisi warna code bawaan yang kurang terbaca pada dark.
- Katalog mencakup 97/97 file komponen lokal; tautan dokumentasi lokal valid.
