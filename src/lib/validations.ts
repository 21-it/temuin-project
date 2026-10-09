import { z } from "zod";

export const createItemSchema = z.object({
  type: z.enum(["LOST", "FOUND"], {
    message: "Jenis laporan wajib dipilih (Hilang atau Temuan)",
  }),
  title: z
    .string()
    .min(3, "Nama barang minimal 3 karakter")
    .max(120, "Nama barang maksimal 120 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi barang minimal 10 karakter (jelaskan ciri fisik, warna, atau tanda khusus)")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  categoryId: z.string().min(1, "Kategori barang wajib dipilih"),
  locationId: z.string().min(1, "Lokasi kejadian/penemuan wajib dipilih"),
  dateOccurred: z.string().min(1, "Tanggal dan waktu kejadian wajib diisi"),
  reporterName: z
    .string()
    .min(2, "Nama pelapor minimal 2 karakter")
    .max(80, "Nama pelapor maksimal 80 karakter"),
  reporterClass: z.string().max(50, "Kelas/Jabatan maksimal 50 karakter").optional().nullable(),
  reporterContact: z
    .string()
    .min(6, "Nomor kontak (WhatsApp/Telepon/Email) minimal 6 karakter")
    .max(100, "Kontak maksimal 100 karakter"),
  imageUrls: z.array(z.string()).max(3, "Maksimal 3 foto pendukung").optional(),
  honeypot: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const createClaimSchema = z.object({
  itemId: z.string().min(1, "ID barang tidak valid"),
  claimantName: z.string().min(2, "Nama pengklaim minimal 2 karakter").max(80),
  claimantClass: z.string().max(50).optional().nullable(),
  claimantContact: z
    .string()
    .min(6, "Kontak yang dapat dihubungi (WhatsApp/Telepon) minimal 6 karakter")
    .max(100),
  proofDescription: z
    .string()
    .min(15, "Deskripsikan bukti kepemilikan secara rinci minimal 15 karakter (misal: isi dompet, goresan khusus, nomor seri, wallpaper, nota)")
    .max(1000, "Deskripsi bukti maksimal 1000 karakter"),
  honeypot: z.string().optional(),
});

export type CreateClaimInput = z.infer<typeof createClaimSchema>;

export const updateItemAdminSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(5).max(1000).optional(),
  categoryId: z.string().optional(),
  locationId: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "CLAIMED", "RETURNED", "REJECTED"]),
  handoverReceiver: z.string().max(100).optional().nullable(),
  adminNotes: z.string().max(500).optional().nullable(),
});

export const reviewClaimSchema = z.object({
  claimId: z.string(),
  status: z.enum(["APPROVED", "REJECTED"]),
  adminNotes: z.string().max(500).optional().nullable(),
  markItemReturned: z.boolean().optional(),
  handoverReceiver: z.string().max(100).optional().nullable(),
});

export const schoolSettingSchema = z.object({
  name: z.string().min(3, "Nama sekolah minimal 3 karakter"),
  tagline: z.string().max(150).optional().nullable(),
  contactEmail: z.string().email("Format email sekolah tidak valid"),
  contactPhone: z.string().min(6, "Nomor kontak sekolah minimal 6 karakter"),
  address: z.string().max(250).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().email("Masukkan alamat email yang valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});
