import { redirect } from "next/navigation";
export default function AccountSettingsRedirect() {
  redirect("/account?tab=profile");
}
