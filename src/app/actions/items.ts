"use server";

import { prisma } from "@/lib/prisma";
import {
  createItemSchema,
  updateItemAdminSchema,
  CreateItemInput,
} from "@/lib/validations";
import { generateTrackingCode } from "@/lib/utils";
import { validateHoneypot, checkRateLimit } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createItemAction(rawInput: CreateItemInput) {
  try {
    // 1. Honeypot check
    if (!validateHoneypot(rawInput.honeypot)) {
      return { error: "Aktivitas tidak wajar terdeteksi (Bot)." };
    }

    // 2. Rate limiting check
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "client-ip";
    const rate = checkRateLimit(`report-${ip}`, 10, 60 * 1000);
    if (!rate.allowed) {
      return {
        error:
          "Anda telah mengirim terlalu banyak laporan dalam waktu singkat. Mohon tunggu 1 menit.",
      };
    }

    // 3. Zod validation
    const parsed = createItemSchema.safeParse(rawInput);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Data formulir tidak valid";
      return { error: firstError };
    }

    const {
      type,
      title,
      description,
      categoryId,
      locationId,
      dateOccurred,
      reporterName,
      reporterClass,
      reporterContact,
      imageUrls,
    } = parsed.data;

    const trackingCode = generateTrackingCode(type);

    const newItem = await prisma.item.create({
      data: {
        type,
        title: title.trim(),
        description: description.trim(),
        categoryId,
        locationId,
        dateOccurred: new Date(dateOccurred),
        status: "PENDING", // Menunggu moderasi staf/admin sekolah
        trackingCode,
        reporterName: reporterName.trim(),
        reporterClass: reporterClass ? reporterClass.trim() : null,
        reporterContact: reporterContact.trim(),
        images: {
          create: (imageUrls || []).map((url) => ({ url })),
        },
      },
      include: {
        images: true,
        category: true,
        location: true,
      },
    });

    revalidatePath("/barang");
    revalidatePath("/admin");
    revalidatePath("/admin/laporan");

    return {
      success: true,
      trackingCode: newItem.trackingCode,
      itemId: newItem.id,
      itemTitle: newItem.title,
    };
  } catch (error: unknown) {
    console.error("Gagal membuat laporan barang:", error);
    return {
      error: "Terjadi kesalahan internal saat memproses laporan. Silakan periksa koneksi Anda.",
    };
  }
}

export async function trackItemByCode(trackingCode: string) {
  try {
    const cleanedCode = trackingCode.trim().toUpperCase();
    if (!cleanedCode) {
      return { error: "Masukkan kode pelacakan yang valid" };
    }

    const item = await prisma.item.findUnique({
      where: { trackingCode: cleanedCode },
      include: {
        category: true,
        location: true,
        images: true,
        claims: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            adminNotes: true,
          },
        },
      },
    });

    if (!item) {
      return {
        error: `Laporan dengan kode "${cleanedCode}" tidak ditemukan. Pastikan format penulisan sudah benar (contoh: TMN-2026-F001).`,
      };
    }

    // Masking info kontak pelapor untuk keamanan publik
    return {
      success: true,
      item: {
        ...item,
        reporterContact: item.reporterContact
          ? item.reporterContact.slice(0, 3) + "****" + item.reporterContact.slice(-2)
          : "-",
      },
    };
  } catch (err: unknown) {
    console.error("Gagal melacak barang:", err);
    return { error: "Terjadi kendala saat mencari laporan pelacakan." };
  }
}

export async function updateItemAdminAction(rawInput: unknown) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "Sesi Anda telah berakhir. Silakan login kembali." };
  }

  const parsed = updateItemAdminSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data pembaharuan tidak valid." };
  }

  const { id, title, description, categoryId, locationId, status, handoverReceiver, adminNotes } =
    parsed.data;

  try {
    const updateData: Record<string, unknown> = {
      status,
      adminNotes: adminNotes ?? undefined,
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categoryId) updateData.categoryId = categoryId;
    if (locationId) updateData.locationId = locationId;

    if (status === "RETURNED") {
      updateData.handoverDate = new Date();
      if (handoverReceiver) {
        updateData.handoverReceiver = handoverReceiver;
      }
    } else {
      updateData.handoverDate = null;
      updateData.handoverReceiver = null;
    }

    const updated = await prisma.item.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/barang");
    revalidatePath(`/barang/${id}`);
    revalidatePath("/admin");
    revalidatePath("/admin/laporan");
    revalidatePath("/lacak");

    return { success: true, item: updated };
  } catch (err: unknown) {
    console.error("Gagal memperbarui item oleh admin:", err);
    return { error: "Gagal menyimpan perubahan laporan." };
  }
}

export async function deleteItemAdminAction(id: string) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  try {
    await prisma.item.delete({
      where: { id },
    });

    revalidatePath("/barang");
    revalidatePath("/admin");
    revalidatePath("/admin/laporan");

    return { success: true };
  } catch (err: unknown) {
    console.error("Gagal menghapus laporan:", err);
    return { error: "Gagal menghapus data laporan barang." };
  }
}
