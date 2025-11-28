import { API_CONFIG } from "@repo/api-client";
import { MobileStorage } from "./mobile-storage.service";

export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public errors?: Array<{ field: string; rule: string; message: string }>
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
  skipRefresh?: boolean;
}

export class HttpInterceptor {
  private static isRefreshing = false;
  private static refreshPromise: Promise<string> | null = null;

  private static async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = await MobileStorage.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(`${API_CONFIG.baseURL}/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          await MobileStorage.clearTokens();
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        const accessToken = data.token?.token || data.token?.value;
        if (!accessToken) {
          throw new Error("Invalid token payload");
        }
        await MobileStorage.setAccessToken(accessToken);
        await MobileStorage.setRefreshToken(data.refreshToken);

        return accessToken;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  static async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = true, skipRefresh = false, ...fetchConfig } = config;

    const headers: Record<string, string> = {};

    if (!(fetchConfig.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (fetchConfig.headers) {
      Object.assign(headers, fetchConfig.headers);
    }

    if (requiresAuth) {
      const token = await MobileStorage.getAccessToken();
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
        const errorData = await response
          .json()
          .catch(() => ({ message: "Une erreur est survenue" }));

        if (
          response.status === 401 &&
          errorData.code === "UNAUTHENTICATED" &&
          !skipRefresh &&
          requiresAuth
        ) {
          try {
            const newToken = await this.refreshAccessToken();
            (headers as Record<string, string>)["Authorization"] = `Bearer ${newToken}`;

            const retryResponse = await fetch(url, {
              ...fetchConfig,
              headers,
            });

            if (!retryResponse.ok) {
              const retryErrorData = await retryResponse
                .json()
                .catch(() => ({ message: "Une erreur est survenue" }));
              throw new HttpError(
                retryErrorData.message,
                retryResponse.status,
                retryErrorData.code,
                retryErrorData.errors
              );
            }

            if (retryResponse.status === 204) {
              return {} as T;
            }

            return await retryResponse.json();
          } catch (refreshError) {
            await MobileStorage.clearTokens();
            throw new HttpError("Session expirée", 401, "SESSION_EXPIRED");
          }
        }

        throw new HttpError(errorData.message, response.status, errorData.code, errorData.errors);
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
    const isFormData = data instanceof FormData;

    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  static put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    if (config?.headers) {
      Object.assign(headers, config.headers);
    }

    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      headers,
      body: isFormData ? data : data ? JSON.stringify(data) : undefined,
    });
  }

  static delete<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}
