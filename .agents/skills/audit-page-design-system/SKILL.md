---
name: audit-page-design-system
description: Audit komponen dan token design system pada halaman Materio Designer berdasarkan source. Gunakan untuk inventaris penggunaan, penelusuran default dan override, serta temuan kesesuaian terhadap spec/design.md.
---

# Audit page design system

Audit halaman yang diminta tanpa mengubah source aplikasi atau aturan desain. Default: inventaris komponen dan token, lalu temuan berbukti. Jangan otomatis memperbaiki temuan. Jika pengguna meminta fokus tertentu, sesuaikan kedalaman laporan.

## Target dan sumber acuan

Terima path Vue atau route. Temukan repository dan file route sebelum audit; gunakan `rg` untuk pencarian. Jika target belum disebut atau route cocok dengan beberapa halaman, minta target yang tepat. Jangan mengaudit seluruh repository sebagai pengganti target yang belum jelas.

Resolusi semua path berikut relatif terhadap root repository:

- [AGENTS.md](../../../AGENTS.md): aturan proyek dan skill yang diwajibkan.
- [spec/design.md](../../../spec/design.md): aturan token dan mapping desain.
- [docs/architecture.md](../../../docs/architecture.md): lokasi implementasi dan alur dependensi.
- [docs/components.md](../../../docs/components.md): panduan pemilihan dan inventaris awal; kontrak tetap diverifikasi di source.
- [docs/design-review.md](../../../docs/design-review.md): acuan bila audit mencakup pemeriksaan visual.

Baca aturan yang relevan dari file saat ini, jangan menyimpan salinan palette atau kontrak komponen dalam skill. Source menentukan API dan implementasi aktual; spesifikasi menentukan kesesuaian desain. Perbedaan keduanya adalah temuan sinkronisasi, bukan alasan mengabaikan salah satunya.

## Telusuri penggunaan aktual

Mulai dari halaman, lalu telusuri komponen lokal yang dirender, slot content, serta composable/data yang menghasilkan props atau class visual. Ikuti dependensi lokal transitif yang memengaruhi komponen atau token. Catat file yang diperiksa dan cabang yang belum terselesaikan. Impor yang tidak dirender tidak dihitung sebagai penggunaan template.

Pisahkan komponen langsung, turunan, dan shell global. Periksa shell hanya sejauh memengaruhi halaman; jangan memasukkan seluruh navigasi sebagai inventaris halaman. Untuk `v-if`, tab, dialog, slot, dan komponen dinamis, catat kondisi penggunaan. Inventaris source mencakup cabang yang mungkin dirender, bukan jaminan semua tampil bersamaan.

Resolusi tag PascalCase/kebab-case harus mempertimbangkan import eksplisit, Nuxt auto-import dan alias dalam `nuxt.config.ts`, serta registrasi Vuetify. Contoh: `IconBtn` adalah alias `VBtn`; verifikasi registrasinya di `plugins/vuetify/index.ts`. Jangan menyatakan komponen hilang hanya karena tidak ada import eksplisit.

Kelompokkan komponen proyek, `@core`/layout, Vuetify, pihak ketiga, dan markup khusus pembentuk pola UI. Tidak perlu mencatat setiap `div` atau `span`. Verifikasi props, slot, event, dan dukungan pola reusable sebelum menyarankan penggantian.

## Inventaris token dan asal nilai

Periksa typography, warna, spacing/layout, radius, border, elevation, serta motion jika ada. Catat simbol yang digunakan, peran visualnya, lokasi, asal nilai, dan override. Bila memungkinkan, bedakan nilai light/dark serta breakpoint atau state yang memengaruhinya.

Telusuri sesuai kebutuhan:

- Props, binding, utility class, inline style, dan scoped/unscoped style halaman serta komponen anak.
- `plugins/vuetify/theme.ts`, `defaults.ts`, dan `index.ts`, termasuk default bersarang, alias, dan `VDefaultsProvider` bila digunakan.
- Entry CSS di `nuxt.config.ts`, `assets/styles`, `@core/scss`, konfigurasi SCSS/Vuetify, dan `themeConfig.ts` bila berpengaruh.
- CSS custom properties, SCSS variables, nilai yang diwariskan, media query, selector specificity, dan override komponen. Jangan menganggap urutan pembacaan file sama dengan urutan cascade.

Tidak semua properti harus ditulis eksplisit pada halaman. Contoh: `VBtn` tanpa `rounded` dapat memperoleh `pill` dari defaults global. Verifikasi default dan override sebelum menyatakan pelanggaran. Nilai eksplisit juga belum tentu menjadi nilai efektif jika cascade belum diselesaikan.

Bedakan token semantic, primitive terdokumentasi, utility/default yang sesuai, dan literal custom. Nilai hardcoded tidak otomatis melanggar: `24px` mungkin sesuai aturan spacing. Periksa apakah ada token/utility pengganti yang setara secara semantik dan perilaku. Jangan mengganti ukuran ikon, chart, atau geometri dengan token spacing hanya karena angkanya sama. Periksa risiko gutter `VRow` yang digandakan sebelum menyarankan tambahan gap.

Untuk binding dinamis, petakan nilai yang dapat ditelusuri di source. Bila bergantung pada API, runtime config, style library yang tidak tersedia, atau rendering dinamis yang belum terpecahkan, tandai nilai efektif belum terverifikasi. Jangan menebak nilai akhir, contrast ratio, atau hasil render.

## Evaluasi kesesuaian

Gunakan status terpisah dari tingkat dampak:

- **Sesuai:** bukti penggunaan cocok dengan aturan yang disebutkan.
- **Penyimpangan:** bertentangan dengan aturan eksplisit; sertakan acuannya.
- **Perlu verifikasi:** bukti belum cukup untuk kesimpulan.
- **Peluang reuse:** alternatif reusable yang sudah diverifikasi mendukung kebutuhan; bukan otomatis pelanggaran.

Prioritaskan temuan berdasarkan dampak nyata: tinggi untuk risiko keterbacaan atau akses terhadap informasi/aksi utama, sedang untuk penyimpangan desain yang jelas, rendah untuk konsistensi lokal atau penyederhanaan. Pisahkan dampak dari kepastian bukti. Potensi masalah runtime tetap perlu verifikasi sampai diuji.

Setiap temuan memuat lokasi file/baris, cuplikan atau simbol penggunaan, aturan/source pembanding, dampak, rekomendasi spesifik, dan batasan bila ada. Temuan dokumentasi/source yang berbeda harus menunjukkan kedua lokasi. Gabungkan pengulangan dengan akar masalah sama dan daftar konsumen terdampak; jangan menghitung masalah default global sebagai banyak masalah halaman yang independen.

Jangan memaksa semua pola custom memakai wrapper proyek. Pastikan konteks dan kontraknya sesuai. Jangan merekomendasikan token atau komponen baru sebelum mencari yang tersedia. Jangan menghasilkan skor persentase tanpa metode yang disepakati, atau menyebut seluruh halaman lolos dari sampel pemeriksaan.

## Laporan dan batasan

Gunakan bahasa pengguna dan tautan file dengan baris yang telah diverifikasi. Sajikan:

1. **Cakupan:** route/file, dependensi yang diperiksa, kondisi/cabang, serta apakah source saja atau termasuk runtime.
2. **Inventaris komponen:** nama, kategori, langsung/turunan/shell, lokasi, peran, serta props/slot penting. Bedakan jenis komponen unik dan jumlah lokasi template jika menghitung; loop tidak membuktikan jumlah instance runtime.
3. **Inventaris token:** kategori, simbol/nilai, lokasi, asal/default/override, acuan desain, dan status. Kelompokkan penggunaan berulang agar tetap terbaca.
4. **Temuan prioritas:** bukti, dampak, dan saran perbaikan. Jika tidak ada penyimpangan terbukti, nyatakan hanya untuk cakupan yang diperiksa.
5. **Validasi dan batasan:** pemeriksaan yang dilakukan, dependensi/binding belum terpecahkan, serta langkah lanjut yang relevan.

Audit default cukup membaca source; tidak perlu build/lint aplikasi yang tidak berubah. Jangan menyimpan laporan ke file kecuali diminta. Jangan mengubah dokumentasi atau source untuk menyelaraskan hasil audit.

Jika pengguna meminta audit browser, gunakan route, state, viewport, dan tema dari checklist review yang relevan. Laporkan bukti aktual dan pemeriksaan yang tidak tersedia. Audit source saja tidak membuktikan kontras, keyboard, overflow, light/dark, atau reduced motion sudah lolos di runtime. Jangan menjalankan aksi destruktif atau mengubah data untuk membuktikan temuan.

## Contoh pemanggilan

```text
Gunakan $audit-page-design-system untuk audit /page-template/crud-page.
```

```text
Audit komponen dan token pages/page-template/order.vue, termasuk komponen anak. Fokus pada warna dan override default.
```
