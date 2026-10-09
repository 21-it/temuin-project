import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Menghapus data lama...");
  await prisma.claim.deleteMany();
  await prisma.itemImage.deleteMany();
  await prisma.item.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.schoolSetting.deleteMany();

  console.log("🏫 Membuat profil sekolah & admin...");
  await prisma.schoolSetting.create({
    data: {
      id: "default",
      name: "SMA Negeri 1 Teladan",
      tagline: "Layanan Terpadu Lapor & Temu Barang Hilang Kampus",
      logoUrl: "/school-logo.svg",
      contactEmail: "lostandfound@sman1teladan.sch.id",
      contactPhone: "+62 812-8899-7700",
      address: "Jl. Pendidikan Wijaya No. 12, Kebayoran Baru, Jakarta Selatan",
    },
  });

  const saltRounds = 10;
  const adminPassword = await bcrypt.hash("admin123", saltRounds);
  const staffPassword = await bcrypt.hash("petugas123", saltRounds);

  await prisma.user.createMany({
    data: [
      {
        name: "Admin Pusat (TU / Kesiswaan)",
        email: "admin@sekolah.sch.id",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
      {
        name: "Pak Budi Santoso (Petugas Keamanan)",
        email: "petugas@sekolah.sch.id",
        passwordHash: staffPassword,
        role: "STAFF",
      },
      {
        name: "Ibu Rahmawati (Staf Perpustakaan)",
        email: "rahma@sekolah.sch.id",
        passwordHash: staffPassword,
        role: "STAFF",
      },
    ],
  });

  console.log("📂 Membuat kategori & lokasi...");
  const categoriesData = [
    { name: "Elektronik" },
    { name: "Alat Tulis & Buku" },
    { name: "Dompet & Uang" },
    { name: "Aksesoris & Pakaian" },
    { name: "Kunci & Kendaraan" },
    { name: "Dokumen & Kartu Identitas" },
    { name: "Botol Minum & Bekal" },
    { name: "Lain-lain" },
  ];

  const categories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categories[cat.name] = created.id;
  }

  const locationsData = [
    { name: "Ruang Kelas X MIPA 1 - 4" },
    { name: "Ruang Kelas XI IPS 1 - 3" },
    { name: "Ruang Kelas XII" },
    { name: "Perpustakaan Lt. 2" },
    { name: "Kantin Utama & Gazebo" },
    { name: "Lapangan Basket & Futsal" },
    { name: "Lab Komputer 1" },
    { name: "Lab Biologi & Fisika" },
    { name: "Masjid / Musholla Sekolah" },
    { name: "Area Parkir Motor Siswa" },
    { name: "Lobby Gedung Utama" },
  ];

  const locations: Record<string, string> = {};
  for (const loc of locationsData) {
    const created = await prisma.location.create({ data: loc });
    locations[loc.name] = created.id;
  }

  console.log("📦 Membuat data barang realistis...");

  const items = [
    {
      type: "FOUND",
      title: "Tumbler Stainless Steel Corkcicle Putih 475ml",
      description:
        "Ditemukan di bangku panjang kantin dekat warung Bu Ani saat istirahat kedua. Ada sedikit lecet di bagian bawah dan stiker kucing hologram di tutupnya.",
      categoryId: categories["Botol Minum & Bekal"],
      locationId: locations["Kantin Utama & Gazebo"],
      dateOccurred: new Date(Date.now() - 2 * 3600 * 1000), // 2 jam lalu
      status: "ACTIVE",
      trackingCode: "TMN-2026-F001",
      reporterName: "Dimas Arya",
      reporterClass: "XI IPS 2",
      reporterContact: "081299887711",
      images: ["/uploads/sample-tumbler.svg"],
    },
    {
      type: "LOST",
      title: "Kalkulator Scientific Casio fx-991EX ClassWiz Hitam",
      description:
        "Tertinggal di meja paling belakang lab komputer saat ujian simulasi UTBK. Pada tutup gesernya terdapat stiker inisial 'R.P.' dengan spidol silver.",
      categoryId: categories["Elektronik"],
      locationId: locations["Lab Komputer 1"],
      dateOccurred: new Date(Date.now() - 18 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-L002",
      reporterName: "Rizky Pratama",
      reporterClass: "XII MIPA 3",
      reporterContact: "085711223344",
      images: ["/uploads/sample-calc.svg"],
    },
    {
      type: "FOUND",
      title: "Dompet Kulit Cokelat Lipat 3 & Kartu Pelajar",
      description:
        "Ditemukan di anak tangga perpustakaan lt. 2. Berisi sejumlah uang tunai dan kartu perpustakaan atas nama siswi kelas X. Pemilik harap verifikasi rincian isi dompet.",
      categoryId: categories["Dompet & Uang"],
      locationId: locations["Perpustakaan Lt. 2"],
      dateOccurred: new Date(Date.now() - 24 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-F003",
      reporterName: "Ibu Siti Rahmawati",
      reporterClass: "Staf Perpustakaan",
      reporterContact: "081388776655",
      images: ["/uploads/sample-wallet.svg"],
    },
    {
      type: "LOST",
      title: "Jaket Hoodie Uniqlo Abu-abu Ukuran L",
      description:
        "Ditinggal di tribun lapangan basket saat latihan ekskul basket sore hari. Ada bordir kecil logo basket di lengan kiri.",
      categoryId: categories["Aksesoris & Pakaian"],
      locationId: locations["Lapangan Basket & Futsal"],
      dateOccurred: new Date(Date.now() - 36 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-L004",
      reporterName: "Farhan Zulkarnain",
      reporterClass: "XI MIPA 1",
      reporterContact: "082133445566",
      images: ["/uploads/sample-jacket.svg"],
    },
    {
      type: "FOUND",
      title: "Gantungan Kunci Motor Honda Vario + Flashdisk Sandisk 32GB",
      description:
        "Ditemukan di dekat tiang nomor 4 parkiran motor siswa. Gantungan berbentuk miniatur karakter Luffy One Piece berbahan karet.",
      categoryId: categories["Kunci & Kendaraan"],
      locationId: locations["Area Parkir Motor Siswa"],
      dateOccurred: new Date(Date.now() - 6 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-F005",
      reporterName: "Pak Slamet",
      reporterClass: "Petugas Keamanan",
      reporterContact: "081822334455",
      images: ["/uploads/sample-keys.svg"],
    },
    {
      type: "LOST",
      title: "Earphone TWS Baseus Encok WM01 Warna Hitam",
      description:
        "Casing charging earphone tertinggal di laci meja kelas X MIPA 2 sebelum perpindahan jam olahraga. Casing ada gantungan tali merah.",
      categoryId: categories["Elektronik"],
      locationId: locations["Ruang Kelas X MIPA 1 - 4"],
      dateOccurred: new Date(Date.now() - 48 * 3600 * 1000),
      status: "CLAIMED",
      trackingCode: "TMN-2026-L006",
      reporterName: "Nadhira Aulia",
      reporterClass: "X MIPA 2",
      reporterContact: "081977665544",
      images: ["/uploads/sample-earphone.svg"],
    },
    {
      type: "FOUND",
      title: "Kacamata Frame Bulat Hitam Minus dengan Kotak Biru",
      description:
        "Ditemukan di rak sepatu depan Musholla sekolah setelah sholat Dzuhur berjamaah. Merk tertulis Berrybarton.",
      categoryId: categories["Aksesoris & Pakaian"],
      locationId: locations["Masjid / Musholla Sekolah"],
      dateOccurred: new Date(Date.now() - 10 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-F007",
      reporterName: "Ahmad Fauzi",
      reporterClass: "XII IPS 1",
      reporterContact: "085899881122",
      images: ["/uploads/sample-glasses.svg"],
    },
    {
      type: "FOUND",
      title: "Buku Paket Matematika Peminatan Kelas XII Erlangga",
      description:
        "Kondisi bersampul mika bening. Ada catatan tulisan tangan di halaman depan tapi nama sudah terhapus sebagian. Ditemukan di meja guru lab fisika.",
      categoryId: categories["Alat Tulis & Buku"],
      locationId: locations["Lab Biologi & Fisika"],
      dateOccurred: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      status: "RETURNED",
      trackingCode: "TMN-2026-F008",
      reporterName: "Ibu Dra. Ratna",
      reporterClass: "Guru Matematika",
      reporterContact: "081233221100",
      handoverDate: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      handoverReceiver: "Bagas Wicaksono (XII MIPA 4)",
      adminNotes: "Diserahkan di Ruang TU setelah menunjukkan catatan tugas di halaman 45.",
      images: ["/uploads/sample-book.svg"],
    },
    {
      type: "LOST",
      title: "Kartu Pelajar & e-Money Mandiri Edisi Star Wars",
      description:
        "Hilang saat jam istirahat di sekitar koridor depan lobby utama. Saldo e-Money sekitar 50rb, ada sticker logo OSIS di belakang kartu.",
      categoryId: categories["Dokumen & Kartu Identitas"],
      locationId: locations["Lobby Gedung Utama"],
      dateOccurred: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      status: "RETURNED",
      trackingCode: "TMN-2026-L009",
      reporterName: "Muhammad Ilham",
      reporterClass: "X MIPA 4",
      reporterContact: "081733441199",
      handoverDate: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      handoverReceiver: "Muhammad Ilham (Pemilik Asli)",
      adminNotes: "Ditemukan oleh staf kebersihan dan dicocokkan dengan NISN siswa.",
      images: ["/uploads/sample-idcard.svg"],
    },
    {
      type: "FOUND",
      title: "Jam Tangan Casio G-Shock Matte Black GA-2100",
      description:
        "Ditemukan di wastafel kamar mandi putra dekat lapangan futsal. Jarum analog & display digital aktif, tali resin hitam mulus.",
      categoryId: categories["Aksesoris & Pakaian"],
      locationId: locations["Lapangan Basket & Futsal"],
      dateOccurred: new Date(Date.now() - 8 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-F010",
      reporterName: "Aldi Gunawan",
      reporterClass: "XI IPS 3",
      reporterContact: "082299001122",
      images: ["/uploads/sample-watch.svg"],
    },
    {
      type: "LOST",
      title: "Tempat Pensil Motif Kotak-kotak Hijau Sage",
      description:
        "Tertinggal di meja ruang kelas XI IPS 1. Berisi pulpen Pilot G2 0.5, penghapus Faber Castell hitam, penggaris besi 15cm, dan tipp-ex pita.",
      categoryId: categories["Alat Tulis & Buku"],
      locationId: locations["Ruang Kelas XI IPS 1 - 3"],
      dateOccurred: new Date(Date.now() - 14 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-L011",
      reporterName: "Tiara Anindya",
      reporterClass: "XI IPS 1",
      reporterContact: "085611229988",
      images: ["/uploads/sample-pencilcase.svg"],
    },
    {
      type: "FOUND",
      title: "Kotak Bekal Tupperware Biru Tosca Isi Sendok Garpu",
      description:
        "Tertinggal di meja piknik gazebo samping kantin saat jam pulang sekolah. Kondisi bersih bertutup kedap udara.",
      categoryId: categories["Botol Minum & Bekal"],
      locationId: locations["Kantin Utama & Gazebo"],
      dateOccurred: new Date(Date.now() - 3 * 3600 * 1000),
      status: "PENDING", // Menunggu review admin
      trackingCode: "TMN-2026-F012",
      reporterName: "Rian Saputra",
      reporterClass: "X MIPA 1",
      reporterContact: "081399884433",
      images: ["/uploads/sample-lunchbox.svg"],
    },
    {
      type: "LOST",
      title: "Flashdisk Kingston DataTraveler 64GB Metal",
      description:
        "Tertancap di PC nomor 12 lab komputer 1 saat pelajaran TIK. Berisi file tugas presentasi kelompok sejarah dan file tugas video.",
      categoryId: categories["Elektronik"],
      locationId: locations["Lab Komputer 1"],
      dateOccurred: new Date(Date.now() - 7 * 3600 * 1000),
      status: "PENDING", // Menunggu review admin
      trackingCode: "TMN-2026-L013",
      reporterName: "Kevin Christian",
      reporterClass: "XII MIPA 1",
      reporterContact: "081244556677",
      images: ["/uploads/sample-usb.svg"],
    },
    {
      type: "LOST",
      title: "Topi Baseball Polos Warna Navy Bordir NYC Putih",
      description:
        "Terjatuh atau tertinggal di lorong antara masjid dan lab komputer saat hujan deras kemarin siang.",
      categoryId: categories["Aksesoris & Pakaian"],
      locationId: locations["Masjid / Musholla Sekolah"],
      dateOccurred: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-L014",
      reporterName: "Rendra Kusuma",
      reporterClass: "XI MIPA 3",
      reporterContact: "087799112233",
      images: ["/uploads/sample-cap.svg"],
    },
    {
      type: "FOUND",
      title: "Kunci Loker Nomor 89 dengan Gantungan Akrilik Musik",
      description:
        "Ditemukan di bawah bangku koridor gedung kelas XII. Pemilik loker silakan datang ke pos satpam atau ruang OSIS.",
      categoryId: categories["Kunci & Kendaraan"],
      locationId: locations["Ruang Kelas XII"],
      dateOccurred: new Date(Date.now() - 5 * 3600 * 1000),
      status: "ACTIVE",
      trackingCode: "TMN-2026-F015",
      reporterName: "Siti Nurhaliza",
      reporterClass: "XII IPS 2",
      reporterContact: "081566778899",
      images: ["/uploads/sample-keys.svg"],
    },
  ];

  for (const itemData of items) {
    const { images, ...data } = itemData;
    const createdItem = await prisma.item.create({
      data,
    });

    if (images && images.length > 0) {
      await prisma.itemImage.createMany({
        data: images.map((url) => ({
          itemId: createdItem.id,
          url,
        })),
      });
    }

    // Jika item status CLAIMED (misalnya TMN-2026-L006), tambahkan data claim contoh
    if (createdItem.status === "CLAIMED") {
      await prisma.claim.create({
        data: {
          itemId: createdItem.id,
          claimantName: "Ananda Bintang",
          claimantClass: "X MIPA 2",
          claimantContact: "081299008811",
          proofDescription:
            "Case earphone saya yang hilang warna hitam dengan nomor seri SN-99812 di bagian dalam tutupnya. Saya masih punya box aslinya dan invoice pembelian Tokopedia jika diperlukan.",
          status: "PENDING",
        },
      });
    }
  }

  console.log("✅ Seed database berhasil diselesaikan!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
