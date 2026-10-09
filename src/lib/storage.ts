import fs from "fs";
import path from "path";
import crypto from "crypto";

export interface IStorageService {
  uploadFile(file: File): Promise<{ url: string; error?: string }>;
  deleteFile(url: string): Promise<boolean>;
}

export class LocalStorageService implements IStorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: File): Promise<{ url: string; error?: string }> {
    // 1. Validasi Tipe File (hanya JPG, PNG, WEBP)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return {
        url: "",
        error: "Format berkas tidak didukung. Harap gunakan format JPG, PNG, atau WebP.",
      };
    }

    // 2. Validasi Ukuran (Maksimal 3 MB)
    const MAX_SIZE = 3 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return {
        url: "",
        error: "Ukuran berkas terlalu besar. Batas maksimal adalah 3 MB per foto.",
      };
    }

    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const ext = path.extname(file.name) || (file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg");
      const randomName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
      const filePath = path.join(this.uploadDir, randomName);

      await fs.promises.writeFile(filePath, buffer);

      return {
        url: `/uploads/${randomName}`,
      };
    } catch (err: unknown) {
      console.error("Gagal menyimpan berkas lokal:", err);
      return {
        url: "",
        error: "Gagal memproses unggahan foto. Silakan coba kembali.",
      };
    }
  }

  async deleteFile(url: string): Promise<boolean> {
    try {
      if (!url.startsWith("/uploads/")) return false;
      const fileName = path.basename(url);
      const filePath = path.join(this.uploadDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Gagal menghapus berkas:", err);
      return false;
    }
  }
}

// Singleton storage service yang mudah diganti ke S3/Cloudinary via environment variable
export function getStorageService(): IStorageService {
  return new LocalStorageService();
}
