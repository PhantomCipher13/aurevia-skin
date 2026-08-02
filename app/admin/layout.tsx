import SidebarLayout from "./components/SidebarLayout";
import AdminAuthGuard from "./components/AdminAuthGuard";

export const metadata = {
  title: "Admin — AUREVIA SKIN",
  description: "AUREVIA SKIN Admin Dashboard",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthGuard>
      <SidebarLayout>{children}</SidebarLayout>
    </AdminAuthGuard>
  );
}
