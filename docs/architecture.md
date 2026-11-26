# Peta repository

Panduan menemukan source sebelum mengubah fitur. Untuk token dan mapping desain, gunakan [design.md](../spec/design.md); untuk kontrak komponen, gunakan [katalog komponen](components.md).

## Lokasi dan tanggung jawab

| Area | Source | Tanggung jawab |
| --- | --- | --- |
| Konfigurasi aplikasi | [nuxt.config.ts](../nuxt.config.ts), [themeConfig.ts](../themeConfig.ts) | Runtime config, auto-import, alias, modul, identitas dan shell |
| Routes | [pages](../pages) | Route berbasis file; komposisi halaman dan interaksi pengguna |
| Shell | [layouts](../layouts), [@layouts](../@layouts) | Layout default/blank dan infrastruktur navigasi |
| Menu | [vertical/index.ts](../navigation/vertical/index.ts), [horizontal/index.ts](../navigation/horizontal/index.ts) | Horizontal mengekspor konfigurasi menu vertikal yang sama |
| Komponen proyek | [components/ui](../components/ui) | UiTableView, UiSectionHeader, UiAutoComplete |
| Komponen template | [@core/components](../@core/components) | Stepper, date picker, editor, theme switcher, dan utilitas UI |
| Dokumentasi visual | [pages/components](../pages/components), [pages/design-system](../pages/design-system), [pages/landing.vue](../pages/landing.vue), [pages/create.vue](../pages/create.vue) | Contoh komponen, foundation, landing overview, dan interactive Design System Creator |
| Logika fitur | [composables](../composables), [utils](../utils) | State/logika reusable dan fungsi pendukung |
| State auth | [stores/auth.ts](../stores/auth.ts) | User, role, permission, dan computed status autentikasi |
| API client | [plugins/api.ts](../plugins/api.ts), [repository](../repository) | Penyedia `$api`, modul auth/profile/admin, dan FetchFactory |
| API proxy | [server/api/[...].ts](../server/api/%5B...%5D.ts) | Meneruskan `/api/*` dan `/api/sanctum/*` ke backend konfigurasi |
| Akses route | [middleware](../middleware), [permission/route.ts](../permission/route.ts) | Auth/guest dan pemeriksaan permission route |
| Tipe domain | [types](../types) | Kontrak user, permission, dan modul |
| Tema dan defaults | [plugins/vuetify](../plugins/vuetify) | Warna light/dark, default komponen, alias IconBtn dan ikon |
| Style | [assets/styles](../assets/styles), [@core/scss](../@core/scss) | Style aplikasi, konfigurasi SCSS dan fondasi template |
| Ikon | [plugins/iconify/build-icons.ts](../plugins/iconify/build-icons.ts) | Source bundling; `icons.css` hasil generate |
| Rencana dan CI | [plan](../plan), [.github/workflows/ci.yml](../.github/workflows/ci.yml) | Rencana fitur dan pemeriksaan otomatis |

## Alur data

Untuk integrasi backend, telusuri halaman pemakai, `$api` dari `plugins/api.ts`, modul `repository/modules`, lalu `repository/factory.ts`. Factory menangani request dan kebutuhan CSRF/cookie. Request `/api/*` melewati proxy Nitro menuju backend. Jangan menyimpulkan backend tersedia dari keberadaan client atau route proxy.

Auth menggunakan Pinia di `stores/auth.ts`. Plugin [check-auth.server.ts](../plugins/check-auth.server.ts) mengambil profil dan permission ketika auth diaktifkan. Middleware auth/guest memeriksa konfigurasi dan status user; middleware permission global membaca mapping route. Saat menambah route terlindungi, periksa metadata middleware dan mapping permission yang berlaku. Menu tersembunyi bukan proteksi akses.

Demo lokal memakai `AUTH_ENABLED=false` dan backend URL kosong. [useCrudPageDemo.ts](../composables/useCrudPageDemo.ts) berbagi data siswa melalui Nuxt `useState`; perubahan demo tidak disimpan ke backend. State lokal `ref` cocok untuk dialog/filter milik satu halaman. Ikuti pola fitur terdekat sebelum memilih state baru.

## Implementasi rujukan

| Kebutuhan | Mulai dari | Batasan |
| --- | --- | --- |
| Daftar, filter, create/edit/delete | [CRUD list](../pages/page-template/crud-page/index.vue) | Data demo satu sesi |
| Detail dan record tidak ditemukan | [CRUD detail](../pages/page-template/crud-page/%5Bid%5D.vue) | Bagian tanpa data ditandai tidak tersedia |
| Template detail dengan identitas dan settings | [Detail Page](../pages/page-template/detail-page.vue) | Data siswa lokal; tab Session/Books belum berisi dataset |
| Daftar dan detail order | [Order template](../pages/page-template/order.vue), [OrderDetail](../components/order/OrderDetail.vue) | Data demo sesi aplikasi; produk mobile menggunakan mobile cards |
| Tab dataset dan dialog jadwal | [Class List](../pages/page-template/class-list.vue) | Detail dan pembuatan belum tersedia |
| Dokumentasi komponen interaktif | [Buttons](../pages/components/buttons.vue), [BaseComponentDoc](../components/design-system/BaseComponentDoc.vue) | State contoh lokal |
| Foundation | [Spacing](../pages/design-system/spacing.vue), [Iconography](../pages/design-system/iconography.vue) | Rujukan token dan pemakaian, bukan fitur domain |

Routes domain lama tetap tersedia sebagai referensi. Periksa dependensi API, asumsi data, dan kelengkapan state sebelum menyalinnya.

## Urutan kerja agent

1. Baca [AGENTS.md](../AGENTS.md), spesifikasi desain, lalu source fitur terkait.
   Gunakan template dan pattern yang relevan sebagai referensi struktur dan interaksi; sesuaikan domain, konten, data, aksi, dan integrasi dengan kebutuhan pengguna.
2. Pilih komponen melalui [panduan pemilihan](components.md#panduan-pemilihan-komponen); verifikasi kontrak langsung di source.
3. Tentukan pemilik state, persistensi, interaksi, dan state gagal sebelum implementasi.
4. Validasi sesuai [checklist review desain](design-review.md), lalu laporkan bukti dan batasan.

Gunakan Node dari `.nvmrc` dan pnpm dari `package.json`. Perintah dan CI dijelaskan di [GitHub starter maintenance](github-setup.md). Perbarui peta ini saat tanggung jawab folder atau alur aplikasi berubah.
