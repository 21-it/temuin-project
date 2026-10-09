import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const setting = await prisma.schoolSetting.findFirst({
    where: { id: "default" },
  });

  const schoolName = setting?.name || "SMA Negeri 1 Teladan";
  const tagline = setting?.tagline;
  const logoUrl = setting?.logoUrl || "/school-logo.svg";
  const contactEmail = setting?.contactEmail || "info@sekolah.sch.id";
  const contactPhone = setting?.contactPhone || "+62 812-3456-7890";
  const address = setting?.address;

  return (
    <div className="flex min-h-screen flex-col bg-[#fcfcfd]">
      <Navbar
        schoolName={schoolName}
        tagline={tagline}
        logoUrl={logoUrl}
      />
      <main className="flex-1">{children}</main>
      <Footer
        schoolName={schoolName}
        tagline={tagline}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        address={address}
      />
    </div>
  );
}
