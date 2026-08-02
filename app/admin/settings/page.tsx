"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/components/AuthProvider";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function AdminSettingsPage() {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState(profile?.full_name ?? "");
  const [email] = useState(user?.email ?? "");
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [saving, setSaving] = useState(false);

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(199,160,100,0.12)",
    color: "#EAD9C3",
    fontFamily: "var(--font-body)",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    color: "rgba(234,217,195,0.45)",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  };

  const saveProfile = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    showToast("Profile updated", "success");
  };

  const changePassword = async () => {
    if (!currentPwd) { showToast("Enter current password", "info"); return; }
    if (newPwd !== confirmPwd) { showToast("Passwords do not match", "info"); return; }
    if (newPwd.length < 8) { showToast("Password must be at least 8 characters", "info"); return; }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    showToast("Password updated successfully", "success");
  };

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="Settings" subtitle="Manage your admin account" />

      <div className="flex-1 p-8">
        <div className="max-w-2xl space-y-8">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
          >
            <h2 className="text-[15px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Admin Profile
            </h2>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-semibold"
                style={{ background: "rgba(199,160,100,0.2)", color: "#C7A064" }}
              >
                {name.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <p className="text-[13px] font-medium" style={{ fontFamily: "var(--font-body)", color: "#EAD9C3" }}>{name || "Admin"}</p>
                <p className="text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.35)" }}>Administrator</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block mb-2" style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block mb-2" style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 rounded-xl text-[13px] outline-none opacity-50"
                  style={inputStyle}
                />
                <p className="mt-1.5 text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.25)" }}>
                  Email cannot be changed here. Contact support.
                </p>
              </div>
            </div>

            <button
              onClick={saveProfile}
              disabled={saving}
              className="mt-5 px-6 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)] disabled:opacity-50"
              style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </motion.div>

          {/* Password */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
            className="p-6 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(199,160,100,0.08)" }}
          >
            <h2 className="text-[15px] font-medium mb-5" style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}>
              Change Password
            </h2>

            <div className="space-y-5">
              {[
                { label: "Current Password", value: currentPwd, setter: setCurrentPwd },
                { label: "New Password", value: newPwd, setter: setNewPwd },
                { label: "Confirm New Password", value: confirmPwd, setter: setConfirmPwd },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block mb-2" style={labelStyle}>{f.label}</label>
                  <input
                    type="password"
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                    style={inputStyle}
                    placeholder="••••••••"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={changePassword}
              disabled={saving}
              className="mt-5 px-6 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-medium transition-all hover:bg-white/5 disabled:opacity-50"
              style={{ border: "1px solid rgba(199,160,100,0.2)", color: "rgba(234,217,195,0.6)", fontFamily: "var(--font-body)" }}
            >
              Update Password
            </button>
          </motion.div>

          {/* Danger zone */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease }}
            className="p-6 rounded-2xl"
            style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}
          >
            <h2 className="text-[15px] font-medium mb-2" style={{ fontFamily: "var(--font-heading)", color: "#ef4444" }}>
              Sign Out
            </h2>
            <p className="text-[12px] mb-4" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}>
              You will be returned to the login page.
            </p>
            <button
              onClick={handleLogout}
              className="px-6 py-3 rounded-xl text-[11px] tracking-[0.08em] uppercase font-semibold transition-all hover:shadow-[0_4px_12px_rgba(239,68,68,0.2)]"
              style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)", fontFamily: "var(--font-body)" }}
            >
              Sign Out of Admin
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
