"use client";

import { useState, type ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen" style={{ background: "#0D0B09" }}>
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      {/* Left margin equals sidebar width so content is never hidden behind it */}
      <div
        className="flex-1 flex flex-col min-w-0 overflow-x-hidden transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        {children}
      </div>
    </div>
  );
}
