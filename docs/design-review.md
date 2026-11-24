# Checklist review desain

Gunakan saat merencanakan dan menyerahkan perubahan UI. [design.md](../spec/design.md) tetap sumber token dan mapping komponen. Checklist ini menentukan cakupan pemeriksaan; bukan klaim semua halaman sudah lolos.

## Sebelum implementasi

- [ ] Tujuan halaman, pengguna, dan aksi utama jelas.
- [ ] Source rujukan dan komponen reusable sudah diperiksa melalui [peta repository](architecture.md) dan [katalog](components.md).
- [ ] Typography, warna semantic, spacing, radius, dan komponen dipetakan ke spesifikasi desain.
- [ ] Pemilik state, sumber data, persistensi, dan respons setiap aksi ditentukan.
- [ ] Untuk tabel baru, pilihan mobile card atau scrollable table dikonfirmasi jika mengubah layout secara material. Catat pilihan yang sudah diberikan; jangan menanyakannya lagi.

## Matriks tampilan

Gunakan viewport CSS berikut sebagai sampel review, bukan breakpoint baru. Periksa juga tepat di sekitar breakpoint komponen yang diubah.

| Viewport | Fokus pemeriksaan |
| --- | --- |
| 390 × 844 | Reflow mobile, target sentuh, dialog, label panjang, scroll tabel |
| 768 × 1024 | Peralihan kolom dan shell; UiTableView mobileCards memakai breakpoint internal 760px, jadi cek 759px dan 761px jika mode tersebut tersentuh |
| 1440 × 900 | Hierarki, alignment, lebar konten, kepadatan tabel dan aksi utama |

- [ ] Periksa light dan dark pada tampilan yang berubah; uji pilihan system jika logika tema diubah.
- [ ] Tidak ada scroll horizontal pada halaman; scroll terlokalisasi pada tabel atau area yang memang membutuhkannya.
- [ ] Judul, aksi, filter, dan isi memiliki urutan baca jelas tanpa dekorasi yang mengganggu.
- [ ] Typography memakai utility yang sesuai; warna/surface tetap terbaca di kedua tema.
- [ ] Teks panjang, data kosong, dan nilai besar tidak menutupi aksi atau memotong informasi penting.
- [ ] Zoom browser 200% tetap memungkinkan membaca dan menjalankan aksi.

## State dan interaksi

Tandai state yang tidak berlaku beserta alasannya. Jangan mengarang dukungan state yang belum diimplementasikan.

| State | Kriteria |
| --- | --- |
| Loading | Proses terlihat; aksi duplikat dicegah; layout tetap stabil |
| Empty | Bedakan belum ada data dan hasil filter kosong; tersedia aksi lanjut/reset yang relevan |
| Error | Pesan menjelaskan masalah dan cara mencoba lagi; input pengguna dipertahankan jika sesuai |
| Disabled | Alasan dapat dipahami; tidak menjadi satu-satunya cara menyampaikan informasi penting |
| Success | Hasil aksi terlihat; daftar/detail/count konsisten; feedback tidak mengganggu |
| Destructive | Target penghapusan jelas, konfirmasi sesuai pola, batal tidak mengubah data |

- [ ] Search/filter/tab/pagination bekerja dalam urutan yang benar; reset dan perubahan dataset tidak meninggalkan halaman kosong yang keliru.
- [ ] Refresh, navigasi langsung, dan record tidak ditemukan ditangani sesuai jenis persistensi.
- [ ] Seluruh aksi memiliki hasil nyata atau penjelasan ketersediaan yang jelas.

## Aksesibilitas dan motion

- [ ] Semua kontrol dapat dijangkau dan dijalankan dengan keyboard; focus terlihat dan urutannya masuk akal.
- [ ] Dialog menerima focus, dapat ditutup sesuai pola, dan mengembalikan focus ke pemicu.
- [ ] Input punya label; error terhubung ke field; tombol ikon punya accessible name.
- [ ] Status tidak mengandalkan warna saja; informasi penting tidak hanya ada pada hover.
- [ ] Target sentuh memadai dan kontrol berdekatan tidak mudah tertukar.
- [ ] Bila ada motion: tujuan jelas, mendahulukan transform/opacity, mendukung reduced motion, dan hover motion hanya pada perangkat yang mendukung hover.

## Bukti validasi dan handoff

Jalankan `pnpm lint:check` untuk perubahan kode. Jalankan `pnpm build` saat perubahan memengaruhi kompilasi/integrasi atau diwajibkan CI. Gunakan pemeriksaan tambahan sesuai risiko. Saat ini tidak ada script `typecheck` atau visual regression; jangan melaporkannya sudah dijalankan.

Untuk perubahan dokumentasi saja, periksa link lokal, whitespace, dan scope diff. Screenshot tidak diperlukan jika UI tidak berubah.

Catat hasil dengan format berikut:

```text
Scope dan file:
Route serta skenario/data yang diperiksa:
Viewport dan tema:
State serta keyboard/motion yang diperiksa:
Perintah validasi dan hasil:
Bukti screenshot (jika tersedia):
Belum diperiksa / blocker / alasan N/A:
```

Screenshot harus menyebut route, viewport, tema, dan state agar bisa direproduksi. Jika browser/backend tidak tersedia, laporkan pemeriksaan yang belum dilakukan. Jangan menyebut review visual lulus hanya dari membaca source. Untuk laporan Before/After, gunakan tabel `Before`, `After`, dan `Why` sesuai [AGENTS.md](../AGENTS.md).
