# Rencana starter template

## Tujuan dan lingkup

1. Dokumentasikan seluruh komponen lokal sebelum perubahan navigasi dalam `docs/components.md`: tujuan, kontrak API, slot, konsumen statis, dan keterbatasan yang terlihat pada source.
2. Sisakan menu Dashboard dan grup Design System dengan Typography, Color System, Component pada navigasi vertikal maupun horizontal. Kosongkan menu bawah.
3. Dashboard memakai halaman starter `pages/index.vue` yang sudah tersedia, bukan dashboard akademi. Modul dan komponen lama tetap disimpan sebagai referensi; route lama tetap dapat diakses langsung.
4. Pisahkan tujuan route Design System tanpa menduplikasi showcase. Pertahankan contoh Component Review di halaman Component sebagai bagian kedua, bukan submenu keempat.

## Area perubahan dan reuse

- `navigation/vertical/index.ts`, `navigation/horizontal/index.ts`: gunakan struktur `children` dan renderer grup yang sudah tersedia.
- `pages/design-system.vue`: shell `NuxtPage`; halaman index mengarahkan ke Typography.
- `pages/design-system/{typography,color-system,component}.vue`: route terpisah dengan judul halaman.
- `components/design-system/DesignSystemShowcase.vue`: pindahkan showcase lama ke komponen dengan prop section.
- `README.md`, `spec/design.md`, `docs/components.md`: dokumentasi dan mapping terbaru.

**Gap komponen:** belum ada showcase Design System yang dapat dipasang pada tiga route. Ekstraksi komponen baru diperlukan untuk memakai ulang konten dan state demo yang sudah ada. Komponen ini memuat showcase lengkap, bukan wrapper Vuetify tanpa perilaku. Tidak menambah dependency atau token.

## Data, state, dan interaksi

- Route menentukan section: typography, colors, atau components. State demo tetap lokal; tidak ada backend atau state global baru.
- Item sidebar menggunakan nama route terpisah sehingga status aktif dan grup mengikuti URL, termasuk reload serta Back/Forward.
- Header dan tabel tetap memakai Vuetify/UiTableView. Dialog, filter, toggle, dan snackbar demo dipertahankan.
- Menu dihapus dari konfigurasi; file/domain data tidak dihapus. Profil/notifikasi/theme switcher adalah kontrol navbar, bukan menu modul sidebar.

## Token dan responsif

- Poppins, utility typography, semantic primary/surface/on-surface/background dari `spec/design.md`; brand green dan logo Materio tetap.
- Tidak menambah motion. Pertahankan spacing, border, radius dan breakpoint komponen yang sudah tersedia.
- Pengguna sudah memilih **Scrollable table**: kolom tetap, geser horizontal di viewport sempit. Alternatif Mobile card mengubah pengelompokan data dan hierarki aksi; tidak dipilih.

## Risiko dan validasi

- Data showcase dan komponen template masih berisi contoh akademi. Tidak mengklaim seluruh komponen siap produksi.
- Lint sebelumnya terblokir `.eslintrc.cjs` yang hilang; Git metadata juga tidak tersedia. Laporkan batas ini tanpa mengarang konfigurasi asal.
- Validasi cakupan inventaris serta tautan lokal, kompilasi Vue/TypeScript, build produksi, tujuan route/menu, dan tampilan light/dark/mobile melalui browser.
- Tidak perlu keputusan produk tambahan untuk scope ini. Penghapusan source modul atau penonaktifan route memerlukan scope terpisah.
