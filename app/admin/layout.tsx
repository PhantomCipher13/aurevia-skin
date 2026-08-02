import AdminSidebar from "./components/AdminSidebar";
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
      <div className="flex min-h-screen" style={{ background: "#0D0B09" }}>
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          {children}
        </div>
      </div>
    </AdminAuthGuard>
  );
}
