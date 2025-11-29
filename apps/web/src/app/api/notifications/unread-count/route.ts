import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("tbr_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ count: 0 });
    }

    const response = await fetch(`${API_URL}/notifications/unread-count`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json({ count: 0 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return NextResponse.json({ count: 0 });
  }
}
