import { TokenStorage } from "@repo/services";
import { API_CONFIG } from "./config";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: Array<{ field: string; rule: string; message: string }>
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

export class HttpClient {
  private static async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, ...fetchConfig} = config;

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchConfig.headers,
    };

    if (requiresAuth) {
      const token = TokenStorage.getToken();
      if (token) {
        (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
      }
    }

    const url = `${API_CONFIG.baseURL}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...fetchConfig,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Une erreur est survenue" }));
        throw new HttpError(errorData.message, response.status, errorData.errors);
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }
      throw new HttpError("Erreur de connexion au serveur", 0);
    }
  }

  static get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "GET" });
  }

  static post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: "DELETE" });
  }
}
