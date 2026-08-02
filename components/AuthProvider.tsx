"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

/* ── Types ───────────────────────────────────────────── */
interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  is_admin: boolean;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

/* ── Context ─────────────────────────────────────────── */
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/* ── Provider ────────────────────────────────────────── */
export function AuthProvider({ children }: { children: ReactNode }) {
  const sb = createClient();

  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState(true);

  /* ── Fetch profile row ── */
  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await sb
      .from("profiles")
      .select("id, full_name, phone, avatar_url, is_admin")
      .eq("id", uid)
      .single();
    setProfile(data as Profile | null);
  }, [sb]);

  /* ── Initialise auth session ── */
  useEffect(() => {
    const init = async () => {
      const { data: { session: s } } = await sb.auth.getSession();
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) await fetchProfile(s.user.id);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = sb.auth.onAuthStateChange(
      async (_event, s) => {
        setSession(s);
        setUser(s?.user ?? null);
        if (s?.user) await fetchProfile(s.user.id);
        else setProfile(null);
      }
    );
    return () => subscription.unsubscribe();
  }, [sb, fetchProfile]);

  /* ── Login ── */
  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    if (data.user) await fetchProfile(data.user.id);
    return { success: true };
  }, [sb, fetchProfile]);

  /* ── Register ── */
  const register = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { success: false, error: error.message };
    if (data.user) {
      // Profile is auto-created by trigger, but set name explicitly
      await sb.from("profiles").upsert({ id: data.user.id, full_name: fullName });
      await fetchProfile(data.user.id);
    }
    return { success: true };
  }, [sb, fetchProfile]);

  /* ── Logout ── */
  const logout = useCallback(async () => {
    await sb.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  }, [sb]);

  /* ── Update profile ── */
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { success: false, error: "Not logged in" };
    const { error } = await sb
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", user.id);
    if (error) return { success: false, error: error.message };
    await fetchProfile(user.id);
    return { success: true };
  }, [sb, user, fetchProfile]);

  /* ── Reset password ── */
  const resetPassword = useCallback(async (email: string) => {
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`;
    const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, [sb]);

  const value: AuthContextValue = {
    user,
    profile,
    session,
    isAuthenticated: !!user,
    isAdmin: profile?.is_admin ?? false,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
