import { redirect } from "next/navigation";
export default function AccountAddressesRedirect() {
  redirect("/account?tab=addresses");
}
