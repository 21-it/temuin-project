"use server";

import { prisma } from "@/lib/prisma";
import { schoolSettingSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSchoolSettingAction(data: {
  name: string;
  tagline?: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
}) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "Akses ditolak. Silakan login terlebih dahulu." };
  }

  const parsed = schoolSettingSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data profil sekolah tidak valid." };
  }

  try {
    const updated = await prisma.schoolSetting.upsert({
      where: { id: "default" },
      update: {
        name: parsed.data.name.trim(),
        tagline: parsed.data.tagline?.trim(),
        contactEmail: parsed.data.contactEmail.trim(),
        contactPhone: parsed.data.contactPhone.trim(),
        address: parsed.data.address?.trim(),
      },
      create: {
        id: "default",
        name: parsed.data.name.trim(),
        tagline: parsed.data.tagline?.trim(),
        contactEmail: parsed.data.contactEmail.trim(),
        contactPhone: parsed.data.contactPhone.trim(),
        address: parsed.data.address?.trim(),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/pengaturan");

    return { success: true, setting: updated };
  } catch (err: unknown) {
    console.error("Gagal memperbarui pengaturan sekolah:", err);
    return { error: "Gagal menyimpan pengaturan sekolah." };
  }
}

export async function addCategoryAction(name: string) {
  const session = await auth();
  if (!session) return { error: "Akses ditolak." };

  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) {
    return { error: "Nama kategori minimal 2 karakter." };
  }

  try {
    const created = await prisma.category.create({
      data: { name: trimmed },
    });
    revalidatePath("/admin/pengaturan");
    revalidatePath("/lapor");
    return { success: true, category: created };
  } catch {
    return { error: "Kategori dengan nama tersebut sudah ada." };
  }
}

export async function deleteCategoryAction(id: string) {
  const session = await auth();
  if (!session) return { error: "Akses ditolak." };

  try {
    const itemsCount = await prisma.item.count({ where: { categoryId: id } });
    if (itemsCount > 0) {
      return {
        error: `Tidak dapat menghapus kategori ini karena masih digunakan oleh ${itemsCount} laporan barang.`,
      };
    }
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus kategori." };
  }
}

export async function addLocationAction(name: string) {
  const session = await auth();
  if (!session) return { error: "Akses ditolak." };

  const trimmed = name.trim();
  if (!trimmed || trimmed.length < 2) {
    return { error: "Nama lokasi minimal 2 karakter." };
  }

  try {
    const created = await prisma.location.create({
      data: { name: trimmed },
    });
    revalidatePath("/admin/pengaturan");
    revalidatePath("/lapor");
    return { success: true, location: created };
  } catch {
    return { error: "Lokasi dengan nama tersebut sudah ada." };
  }
}

export async function deleteLocationAction(id: string) {
  const session = await auth();
  if (!session) return { error: "Akses ditolak." };

  try {
    const itemsCount = await prisma.item.count({ where: { locationId: id } });
    if (itemsCount > 0) {
      return {
        error: `Tidak dapat menghapus lokasi ini karena masih terhubung dengan ${itemsCount} laporan barang.`,
      };
    }
    await prisma.location.delete({ where: { id } });
    revalidatePath("/admin/pengaturan");
    return { success: true };
  } catch {
    return { error: "Gagal menghapus lokasi." };
  }
}
