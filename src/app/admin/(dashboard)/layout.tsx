import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  const setting = await prisma.schoolSetting.findFirst({
    where: { id: "default" },
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        user={session.user}
        schoolName={setting?.name || "SMA Negeri 1 Teladan"}
      />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
