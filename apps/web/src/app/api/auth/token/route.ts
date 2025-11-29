import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("tbr_access_token")?.value;

    if (!accessToken) {
      return NextResponse.json({ accessToken: null }, { status: 200 });
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Failed to get access token:", error);
    return NextResponse.json({ accessToken: null }, { status: 200 });
  }
}
