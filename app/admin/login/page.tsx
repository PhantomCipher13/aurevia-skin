/**
 * /admin/login is no longer used.
 * The unified /auth/login page now handles both admin and customer sign-in.
 * Admins are automatically redirected to /admin after signing in.
 */
import { redirect } from "next/navigation";

export default function AdminLoginRedirect() {
  redirect("/auth/login");
}
