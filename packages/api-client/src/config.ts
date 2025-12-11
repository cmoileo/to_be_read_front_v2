declare const process: any;

const getApiUrl = (): string => {
  // 1. Vite environment variables (mobile app)
  // @ts-ignore - import.meta.env is available in Vite but not in Next.js
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) {
    // @ts-ignore
    return import.meta.env.VITE_API_URL as string;
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
