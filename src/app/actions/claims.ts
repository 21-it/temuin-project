"use server";

import { prisma } from "@/lib/prisma";
import {
  createClaimSchema,
  reviewClaimSchema,
  CreateClaimInput,
} from "@/lib/validations";
import { validateHoneypot, checkRateLimit } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createClaimAction(rawInput: CreateClaimInput) {
  try {
    // 1. Honeypot check
    if (!validateHoneypot(rawInput.honeypot)) {
      return { error: "Aktivitas mencurigakan (Bot)." };
    }

    // 2. Rate limiting check
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "client-ip";
    const rate = checkRateLimit(`claim-${ip}`, 8, 60 * 1000);
    if (!rate.allowed) {
      return {
        error:
          "Terlalu banyak pengajuan klaim dalam waktu singkat. Silakan tunggu 1 menit.",
      };
    }

    // 3. Validation
    const parsed = createClaimSchema.safeParse(rawInput);
    if (!parsed.success) {
      return {
        error: parsed.error.issues[0]?.message || "Data klaim tidak lengkap.",
      };
    }

    const { itemId, claimantName, claimantClass, claimantContact, proofDescription } =
      parsed.data;

    // Pastikan item ada dan belum berstatus RETURNED
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return { error: "Barang yang ingin diklaim tidak ditemukan." };
    }

    if (item.status === "RETURNED") {
      return {
        error:
          "Barang ini sudah diserahkan/dikembalikan kepada pemilik sebelumnya.",
      };
    }

    // Simpan klaim baru
    const claim = await prisma.claim.create({
      data: {
        itemId,
        claimantName: claimantName.trim(),
        claimantClass: claimantClass ? claimantClass.trim() : null,
        claimantContact: claimantContact.trim(),
        proofDescription: proofDescription.trim(),
        status: "PENDING",
      },
    });

    // Tandai status barang menjadi CLAIMED agar terlihat sedang dalam proses verifikasi
    if (item.status === "ACTIVE") {
      await prisma.item.update({
        where: { id: itemId },
        data: { status: "CLAIMED" },
      });
    }

    revalidatePath("/barang");
    revalidatePath(`/barang/${itemId}`);
    revalidatePath("/admin");
    revalidatePath("/admin/klaim");

    return {
      success: true,
      claimId: claim.id,
      message:
        "Pengajuan klaim berhasil dikirim! Petugas sekolah akan meninjau bukti Anda dan menghubungi kontak yang tertera.",
    };
  } catch (err: unknown) {
    console.error("Gagal membuat klaim:", err);
    return {
      error: "Terjadi kesalahan sistem saat memproses klaim. Coba lagi beberapa saat.",
    };
  }
}

export async function reviewClaimAction(rawInput: unknown) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "Akses ditolak. Silakan login kembali." };
  }

  const parsed = reviewClaimSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data tinjauan tidak valid." };
  }

  const { claimId, status, adminNotes, markItemReturned, handoverReceiver } =
    parsed.data;

  try {
    const claim = await prisma.claim.findUnique({
      where: { id: claimId },
      include: { item: true },
    });

    if (!claim) {
      return { error: "Data klaim tidak ditemukan." };
    }

    // Update claim status
    await prisma.claim.update({
      where: { id: claimId },
      data: {
        status,
        adminNotes: adminNotes ?? undefined,
      },
    });

    // Jika klaim disetujui dan ditandai serah terima selesai
    if (status === "APPROVED" && markItemReturned) {
      await prisma.item.update({
        where: { id: claim.itemId },
        data: {
          status: "RETURNED",
          handoverDate: new Date(),
          handoverReceiver:
            handoverReceiver ||
            `${claim.claimantName} (${claim.claimantClass || "Pemilik"})`,
          adminNotes: adminNotes || "Klaim kepemilikan telah diverifikasi dan barang diserahkan.",
        },
      });
    } else if (status === "REJECTED") {
      // Periksa apakah masih ada klaim PENDING lain untuk item ini
      const pendingClaims = await prisma.claim.count({
        where: {
          itemId: claim.itemId,
          status: "PENDING",
          id: { not: claimId },
        },
      });

      if (pendingClaims === 0 && claim.item.status === "CLAIMED") {
        // Kembalikan status item ke ACTIVE jika tidak ada klaim tertunda lainnya
        await prisma.item.update({
          where: { id: claim.itemId },
          data: { status: "ACTIVE" },
        });
      }
    }

    revalidatePath("/barang");
    revalidatePath(`/barang/${claim.itemId}`);
    revalidatePath("/admin");
    revalidatePath("/admin/klaim");
    revalidatePath("/admin/laporan");

    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal meninjau klaim:", err);
    return { error: "Gagal memperbarui status klaim." };
  }
}
