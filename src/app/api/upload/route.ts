import { NextRequest, NextResponse } from "next/server";
import { getStorageService } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "client-ip";
    const rate = checkRateLimit(`upload-${ip}`, 15, 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan unggah foto. Tunggu beberapa saat." },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Berkas gambar tidak ditemukan." },
        { status: 400 }
      );
    }

    const storage = getStorageService();
    const result = await storage.uploadFile(file);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ url: result.url });
  } catch (err: unknown) {
    console.error("Gagal unggah foto:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat memproses gambar." },
      { status: 500 }
    );
  }
}
