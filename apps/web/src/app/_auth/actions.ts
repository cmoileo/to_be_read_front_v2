"use server";

import { cookies } from "next/headers";
import type { LoginCredentials, RegisterCredentials, AuthResponse } from "@repo/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function callApi<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({ message: "Erreur" }));
    throw new Error(data.message || "Erreur");
  }
  return res.json();
}

async function setAuthCookies(auth: AuthResponse) {
  const store = await cookies();
  store.set("tbr_access_token", auth.token.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  store.set("tbr_refresh_token", auth.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function loginAction(credentials: LoginCredentials) {
  const data = await callApi<AuthResponse>("/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  await setAuthCookies(data);
  return { user: data.user };
}

export async function registerAction(credentials: RegisterCredentials) {
  const data = await callApi<AuthResponse>("/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
  await setAuthCookies(data);
  return { user: data.user };
}

export async function logoutAction() {
  try {
    await callApi("/logout", { method: "POST" });
  } catch {}
  const store = await cookies();
  store.delete("tbr_access_token");
  store.delete("tbr_refresh_token");
}

export async function refreshAction() {
  const store = await cookies();
  const refreshToken = store.get("tbr_refresh_token")?.value;
  if (!refreshToken) throw new Error("Missing refresh token");
  const data = await callApi<{ token: { token: string }; refreshToken: string }>("/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
  store.set("tbr_access_token", data.token.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  store.set("tbr_refresh_token", data.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return true;
}

export async function getUserFromCookies() {
  const store = await cookies();
  const access = store.get("tbr_access_token")?.value;
  if (!access) return null;
  try {
    const res = await fetch(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${access}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export async function checkUsernameAvailability(username: string) {
  return callApi<{ available: boolean }>(`/auth/check-username/${username}`);
}

export async function resetPasswordRequest(email: string) {
  return callApi("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordConfirm(data: { token: string; password: string }) {
  return callApi("/auth/reset-password/confirm", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
