import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");

  if (!q) {
    return NextResponse.json({ message: "Query parameter 'q' is required" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("tbr_access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const params = new URLSearchParams({ q });
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  try {
    const response = await fetch(`${API_URL}/books?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Error fetching books" }));
      return NextResponse.json(error, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch books" }, { status: 500 });
  }
}
