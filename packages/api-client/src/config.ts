declare const process: any;

const getApiUrl = (): string => {
  if (typeof window !== "undefined") {
    return (window as any).ENV?.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  }
  
  if (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  return "http://localhost:3333";
};

export const API_CONFIG = {
  baseURL: getApiUrl(),
  timeout: 30000,
} as const;
