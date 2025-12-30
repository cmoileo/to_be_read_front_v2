declare const process: any;

// Get API URL at build time - Vite will replace these
// @ts-ignore
const VITE_API_URL = import.meta.env?.VITE_API_URL || "";

const getApiUrl = (): string => {
  // 1. Vite environment variables (mobile app) - evaluated at build time
  if (VITE_API_URL) {
    return VITE_API_URL;
  }
  
  // 2. Next.js client-side (window.ENV)
  if (typeof window !== "undefined") {
    return (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  }
  
  // 3. Next.js server-side
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 4. Fallback
  return "http://localhost:3333";
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 30000,
} as const;
