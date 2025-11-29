import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NotificationsClient from "./notifications-client";

export default async function NotificationsPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return <NotificationsClient />;
}
