# Temuin — Portal Lapor & Temu Barang Hilang Kampus / Sekolah

> **Temuin** adalah aplikasi web modern, sederhana, dan minimalis untuk pelaporan, pencarian, dan pengelolaan barang hilang (*lost and found*) di lingkungan institusi pendidikan (sekolah, madrasah, SMK, perguruan tinggi/kampus).
>
> Dirancang ramah *mobile* (*mobile-first*), tanpa mewajibkan siswa membuat akun untuk mencari barang, serta siap diadopsi (*SaaS/multi-school ready*) dengan kustomisasi identitas sekolah.

---

## 🌟 Fitur Utama

### 1. Sisi Siswa & Publik (Tanpa Perlu Login)
- **Beranda (Landing Page):** Nilai proposisi yang jelas, tombol aksi cepat (*Call-to-Action*) "Lapor Barang Hilang" dan "Lapor Barang Temuan", bilah pencarian instan, dan statistik ringkas sekolah.
- **Jelajah & Katalog Barang (`/barang`):**
  - Pencarian kata kunci secara instan (nama barang, nomor seri, ciri fisik, merek, atau kode lacak).
  - Filter multi-kriteria: Jenis (*Semua*, *Barang Hilang*, *Barang Temuan*), Kategori (Elektronik, Alat Tulis, Dompet, dll.), Lokasi (Kantin, Lab, Lapangan, dll.), dan Status (*Aktif*, *Sedang Diklaim*, *Sudah Dikembalikan*).
  - Tampilan kartu barang yang rapi dan elegan.
- **Detail Barang (`/barang/[id]`):**
  - Galeri foto dokumentasi.
  - Rincian lokasi penemuan/kehilangan, tanggal, dan deskripsi ciri-ciri khusus.
  - *Status Badge* yang tenang dan informatif (Hilang = amber, Ditemukan = hijau/emerald, Sudah Dikembalikan = abu-abu/slate).
  - Perlindungan privasi: Kontak pelapor disembunyikan dari publik demi mencegah *spam* dan penipuan.
  - Banner bukti serah terima (tanggal & nama penerima) jika barang telah kembali ke pemiliknya.
- **Formulir Pelaporan Cepat (`/lapor`, `/lapor/hilang`, `/lapor/temuan`):**
  - Pemilihan jenis laporan yang intuitif.
  - Unggah foto dokumentasi (hingga 3 foto, validasi format JPG/PNG/WebP, batas maks 3 MB per foto).
  - Dilengkapi proteksi *honeypot* anti-bot dan *in-memory rate limiting*.
- **Alur Pengajuan Klaim Kepemilikan (Claim Flow):**
  - Pengklaim dapat mengajukan bukti kepemilikan terperinci (ciri khas, nomor seri, isi tas/dompet, atau nota transaksi).
  - Status barang otomatis diperbarui menjadi "Sedang Diklaim" untuk peninjauan petugas.
- **Pelacakan Mandiri via Kode (`/lacak`):**
  - Pelapor mendapatkan kode lacak unik (contoh: `TMN-2026-F001`).
  - Lacak progres visual: *Dilaporkan* ➔ *Diverifikasi Petugas* ➔ *Proses Klaim* ➔ *Selesai Diserahkan*.

---

### 2. Sisi Petugas & Administrator (`/admin`)
- **Autentikasi Aman:** Login menggunakan *credentials* (NextAuth.js v5) dengan enkripsi kata sandi *bcryptjs*.
- **Ringkasan Operasional Kampus (`/admin`):**
  - Kartu metrik: Total Laporan, Hilang Masih Dicari, Temuan Aktif Diamankan, Selesai Dikembalikan, Laporan Menunggu Moderasi, dan Klaim Tertunda.
  - Notifikasi tindakan penting (*Action Needed Banner*).
  - Tabel aktivitas pelaporan terkini dan antrean klaim masuk.
- **Kelola Seluruh Laporan (`/admin/laporan`):**
  - Tinjau dan moderasi laporan baru: Setujui (*Approve*) menjadi Aktif atau Tolak (*Reject*).
  - Akses aman kontak pelapor (WhatsApp langsung) untuk koordinasi.
  - Pencatatan serah terima barang (*Handover modal*): catat nama penerima sah dan tanggal penyerahan.
  - Edit dan hapus laporan barang.
- **Verifikasi Klaim Siswa (`/admin/klaim`):**
  - Periksa deskripsi bukti kepemilikan yang dikirim siswa.
  - Tombol kontak langsung ke WhatsApp pengklaim.
  - Putusan verifikasi: Setujui klaim sekaligus tandai barang selesai diserahkan (*Handover completed*), atau Tolak klaim dengan catatan.
- **Pengaturan Sekolah & Master Data (`/admin/pengaturan`):**
  - Ubah nama sekolah/kampus, slogan layanan, email pelayanan, nomor hotline pos satpam/TU, dan alamat kampus secara dinamis.
  - Kelola daftar kategori barang (tambah & hapus).
  - Kelola daftar lokasi resmi kampus (ruang kelas, lab, kantin, perpustakaan, musholla, lapangan, parkir).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components & Server Actions)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS v4 (Desain minimalis, bersih, ramah aksesibilitas WCAG AA)
- **Database & ORM:** [Prisma ORM](https://www.prisma.io/) (SQLite untuk kemudahan lokal dev, kompatibel dengan PostgreSQL untuk *production*)
- **Autentikasi:** [NextAuth.js v5](https://authjs.dev/) (Credentials Provider, JWT Session)
- **Validasi Data:** [Zod](https://zod.dev/)
- **Ikonografi:** [Lucide React](https://lucide.dev/)
- **Penyimpanan Berkas:** Abstraksi penyimpanan berkas (`IStorageService`) dengan implementasi lokal (`public/uploads`) yang siap dialihkan ke AWS S3 atau Cloudinary.

---

## 📁 Struktur Direktori

```text
temuin/
├── prisma/
│   ├── schema.prisma           # Skema basis data (User, Item, ItemImage, Claim, Category, Location, SchoolSetting)
│   └── seed.ts                 # Seeder data realistis sekolah Indonesia (15 item, kategori, lokasi, akun admin)
├── public/
│   ├── uploads/                # Berkas gambar dokumentasi barang
│   └── school-logo.svg         # Lambang/logo institusi pendidikan
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx      # Layout publik dengan dynamic school setting
│   │   │   ├── page.tsx        # Halaman utama (Landing page)
│   │   │   ├── barang/         # Katalog & filter barang
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx # Rincian barang & formulir klaim
│   │   │   ├── lapor/          # Pilihan lapor, form hilang, form temuan, & halaman sukses
│   │   │   │   ├── page.tsx
│   │   │   │   ├── hilang/page.tsx
│   │   │   │   ├── temuan/page.tsx
│   │   │   │   └── sukses/page.tsx
│   │   │   └── lacak/page.tsx  # Pelacakan mandiri menggunakan kode unik
│   │   ├── admin/
│   │   │   ├── login/page.tsx  # Halaman login petugas/admin
│   │   │   └── (dashboard)/
│   │   │       ├── layout.tsx  # Layout terproteksi admin dengan sidebar navigasi
│   │   │       ├── page.tsx    # Dashboard overview metrik & ringkasan
│   │   │       ├── laporan/page.tsx # Kelola, setujui, serah terima, & hapus laporan
│   │   │       ├── klaim/page.tsx   # Verifikasi pengajuan bukti klaim barang
│   │   │       └── pengaturan/page.tsx # Profil sekolah, kategori, & lokasi
│   │   ├── actions/            # Next.js Server Actions (items, claims, settings)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts # NextAuth route handler
│   │   │   └── upload/route.ts # Endpoint upload gambar dengan validasi
│   │   ├── globals.css         # Styling global & tokens warna
│   │   └── layout.tsx          # Root layout
│   ├── components/
│   │   ├── items/              # ItemCard, ItemFilters, ItemStatusBadge, ClaimModal, ItemDetailActions
│   │   ├── forms/              # ItemReportForm, ImageUploader
│   │   ├── admin/              # AdminReportsManager, AdminClaimsManager, AdminSettingsManager
│   │   └── layout/             # Navbar, Footer, AdminSidebar
│   └── lib/
│       ├── prisma.ts           # Singleton Prisma Client
│       ├── auth.ts             # Konfigurasi NextAuth credentials
│       ├── storage.ts          # Abstraksi IStorageService untuk upload berkas
│       ├── rate-limit.ts       # In-memory rate limiting & honeypot validator
│       ├── validations.ts      # Skema validasi Zod
│       └── utils.ts            # Helper tanggal Indonesia, kode lacak, classnames
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- **Node.js** v18.17+ atau v20+ (diuji pada v22)
- **npm** atau **yarn** / **pnpm**

### 2. Kloning & Pemasangan Dependensi
Masuk ke direktori proyek dan pasang seluruh paket:
```bash
cd temuin
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin file template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Isi konfigurasi pada file `.env`:
```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="kunci-rahasia-nextauth-minimal-32-karakter"
NEXTAUTH_SECRET="kunci-rahasia-nextauth-minimal-32-karakter"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Migrasi & Seeding Database
Sinkronkan skema database SQLite dan isi data awal realistis:
```bash
# Sinkronkan skema basis data
npx prisma db push

# Isi data awal (Admin, Staf, Kategori, Lokasi, dan ~15 Contoh Barang)
npm run db:seed
```

### 5. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Kredensial Akun Pengujian (Demo)

Untuk masuk ke **Dashboard Petugas & Admin** di `/admin/login`, gunakan akun berikut:

| Peran | Alamat Email | Kata Sandi | Keterangan |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@sekolah.sch.id` | `admin123` | Akses penuh: laporan, klaim, dan pengaturan sekolah |
| **Petugas / Staf** | `petugas@sekolah.sch.id` | `petugas123` | Staf keamanan / pos satpam: verifikasi laporan & klaim |
| **Staf Perpustakaan** | `rahma@sekolah.sch.id` | `petugas123` | Staf perpustakaan |

*(Tersedia tombol pintas klik-otomatis di halaman login `/admin/login` untuk mempermudah pengujian).*

---

## 🔒 Keamanan & Kebijakan Data

1. **Privasi Nomor Kontak:** Nomor telepon atau WhatsApp pelapor tidak pernah ditampilkan di halaman publik untuk mencegah potensi penyalahgunaan atau penipuan. Kontak hanya dapat dilihat oleh staf berwenang di dashboard `/admin`.
2. **Proteksi Anti-Spam (Honeypot & Rate Limiter):** Setiap formulir publik dilengkapi field tersembunyi (*honeypot*) untuk menangkap bot otomatis serta pembatas frekuensi request (*rate limiting* berbasis IP).
3. **Validasi Berkas Ketat:** Unggahan foto dibatasi hanya pada format `jpg`, `png`, dan `webp` dengan ukuran maksimum 3 MB per foto (maksimal 3 foto).
4. **Validasi Server-Side:** Seluruh data yang masuk divalidasi dan disanitasi menggunakan pustaka Zod sebelum disimpan ke database.

---

## 🌐 Panduan Deployment ke Produksi

### Menggunakan PostgreSQL (Supabase / Neon / Railway)
1. Ganti provider di `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Perbarui `DATABASE_URL` di file environment produksi dengan koneksi PostgreSQL.
3. Jalankan `npx prisma db push` atau `npx prisma migrate deploy`.
4. Jalankan `npm run db:seed` untuk data inisial.

### Menggunakan Cloud Storage (AWS S3 / Cloudinary)
Ubah `lib/storage.ts` dengan mengimplementasikan antarmuka `IStorageService`:
```typescript
export class S3StorageService implements IStorageService {
  async uploadFile(file: File) { /* integrasi @aws-sdk/client-s3 */ }
  async deleteFile(url: string) { /* hapus dari bucket S3 */ }
}
```
Dan ganti pemanggilan `getStorageService()` ke kelas tersebut tanpa perlu mengubah komponen antarmuka.

---

## 📄 Lisensi
Dilisensikan di bawah [MIT License](LICENSE).
Dikembangkan untuk mendukung integritas dan kenyamanan seluruh warga institusi pendidikan.
