"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "@/components/ToastProvider";

const ease = [0.16, 1, 0.3, 1] as const;

const defaultSettings: Record<string, string> = {
  hero_headline: "Skin That Speaks\nFor Itself",
  hero_subtitle: "Dermatologist-tested formulas. Clean ingredients. Effortless results.",
  announcement_bar: "Free Shipping on Orders Above ₹999 · 100% Clean Beauty · Dermatologist Tested",
  footer_tagline: "Luxury skincare crafted for naturally radiant skin.",
  about_headline: "Born from a love of\npure, purposeful beauty.",
  about_body: "AUREVIA SKIN was founded on a simple belief — that effective skincare doesn't need to be complicated, harsh, or filled with unnecessary chemicals.",
  contact_email: "hello@aureviaskin.com",
  contact_phone: "+1 (800) AUREVIA",
  privacy_intro: "Your privacy is important to us. This policy describes how we collect and use your information.",
  shipping_policy: "Free standard shipping on orders above ₹999. Express shipping available at checkout.",
  return_policy: "We offer hassle-free returns within 30 days of purchase.",
};

const sections = [
  {
    key: "homepage",
    label: "Homepage",
    icon: "⬡",
    fields: [
      { key: "announcement_bar", label: "Announcement Bar", type: "text", hint: "Shown at top of every page" },
      { key: "hero_headline", label: "Hero Headline", type: "textarea", hint: "Use \\n for line break" },
      { key: "hero_subtitle", label: "Hero Subtitle", type: "text" },
    ],
  },
  {
    key: "pages",
    label: "About & Contact",
    icon: "✦",
    fields: [
      { key: "about_headline", label: "About Headline", type: "textarea" },
      { key: "about_body", label: "About Body Text", type: "textarea" },
      { key: "contact_email", label: "Contact Email", type: "text" },
      { key: "contact_phone", label: "Contact Phone", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    icon: "◻",
    fields: [
      { key: "footer_tagline", label: "Footer Tagline", type: "text" },
    ],
  },
  {
    key: "policies",
    label: "Policies",
    icon: "◎",
    fields: [
      { key: "privacy_intro", label: "Privacy Policy Intro", type: "textarea" },
      { key: "shipping_policy", label: "Shipping Policy", type: "textarea" },
      { key: "return_policy", label: "Return Policy", type: "textarea" },
    ],
  },
];

export default function AdminCMSPage() {
  const [activeSection, setActiveSection] = useState("homepage");
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const section = sections.find((s) => s.key === activeSection)!;

  const handleSave = async () => {
    setSaving(true);
    await new Promise((res) => setTimeout(res, 600));
    // TODO: call updateSetting() server action for each changed field
    setSaving(false);
    showToast("Settings saved successfully", "success");
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(199,160,100,0.12)",
    color: "#EAD9C3",
    fontFamily: "var(--font-body)",
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader title="CMS" subtitle="Edit website content without touching code" />

      <div className="flex-1 flex gap-0">
        {/* Section sidebar */}
        <div
          className="w-56 flex-shrink-0 p-4 border-r"
          style={{ borderColor: "rgba(199,160,100,0.08)", background: "rgba(0,0,0,0.1)" }}
        >
          {sections.map((s) => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-1 text-left transition-all"
              style={{
                background: activeSection === s.key ? "rgba(199,160,100,0.12)" : "transparent",
                color: activeSection === s.key ? "#C7A064" : "rgba(234,217,195,0.5)",
                fontFamily: "var(--font-body)",
              }}
            >
              <span className="text-[12px]">{s.icon}</span>
              <span className="text-[12px] font-medium">{s.label}</span>
            </button>
          ))}
        </div>

        {/* Content editor */}
        <div className="flex-1 p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease }}
            className="max-w-2xl"
          >
            <h2
              className="text-[18px] font-medium mb-6"
              style={{ fontFamily: "var(--font-heading)", color: "#EAD9C3" }}
            >
              {section.label}
            </h2>

            <div className="space-y-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label
                    className="block text-[10px] tracking-[0.12em] uppercase mb-2"
                    style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.4)" }}
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl text-[13px] outline-none resize-none leading-[1.6]"
                      style={inputStyle}
                    />
                  ) : (
                    <input
                      type="text"
                      value={settings[field.key] || ""}
                      onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl text-[13px] outline-none"
                      style={inputStyle}
                    />
                  )}
                  {field.hint && (
                    <p className="mt-1.5 text-[11px]" style={{ fontFamily: "var(--font-body)", color: "rgba(234,217,195,0.25)" }}>
                      {field.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8 pt-6" style={{ borderTop: "1px solid rgba(199,160,100,0.08)" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 rounded-xl text-[12px] tracking-[0.08em] uppercase font-semibold transition-all hover:shadow-[0_4px_16px_rgba(199,160,100,0.2)] disabled:opacity-60"
                style={{ background: "#C7A064", color: "#FFFFFF", fontFamily: "var(--font-body)" }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={() => setSettings(defaultSettings)}
                className="px-6 py-3 rounded-xl text-[12px] tracking-[0.08em] uppercase font-medium transition-all hover:bg-white/5"
                style={{ border: "1px solid rgba(199,160,100,0.15)", color: "rgba(234,217,195,0.5)", fontFamily: "var(--font-body)" }}
              >
                Reset to Defaults
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
