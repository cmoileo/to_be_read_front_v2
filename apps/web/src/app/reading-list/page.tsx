import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ReadingListClient from "./reading-list-client";

export default async function ReadingListPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tbr_access_token")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  return <ReadingListClient />;
}
