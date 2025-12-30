import { API_CONFIG } from "@repo/api-client";
import { MobileStorage } from "./mobile-storage.service";
export class HttpError extends Error {
    constructor(message, status, code, errors) {
        super(message);
        Object.defineProperty(this, "status", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: status
        });
        Object.defineProperty(this, "code", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: code
        });
        Object.defineProperty(this, "errors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: errors
        });
        this.name = "HttpError";
    }
}
export class HttpInterceptor {
    static async refreshAccessToken() {
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
            }
            finally {
                this.isRefreshing = false;
                this.refreshPromise = null;
            }
        })();
        return this.refreshPromise;
    }
    static async request(endpoint, config = {}) {
        const { requiresAuth = true, skipRefresh = false, ...fetchConfig } = config;
        const headers = {};
        if (!(fetchConfig.body instanceof FormData)) {
            headers["Content-Type"] = "application/json";
        }
        if (fetchConfig.headers) {
            Object.assign(headers, fetchConfig.headers);
        }
        if (requiresAuth) {
            const token = await MobileStorage.getAccessToken();
            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
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
                if (response.status === 401 &&
                    errorData.code === "UNAUTHENTICATED" &&
                    !skipRefresh &&
                    requiresAuth) {
                    try {
                        const newToken = await this.refreshAccessToken();
                        headers["Authorization"] = `Bearer ${newToken}`;
                        const retryResponse = await fetch(url, {
                            ...fetchConfig,
                            headers,
                        });
                        if (!retryResponse.ok) {
                            const retryErrorData = await retryResponse
                                .json()
                                .catch(() => ({ message: "Une erreur est survenue" }));
                            throw new HttpError(retryErrorData.message, retryResponse.status, retryErrorData.code, retryErrorData.errors);
                        }
                        if (retryResponse.status === 204) {
                            return {};
                        }
                        return await retryResponse.json();
                    }
                    catch (refreshError) {
                        await MobileStorage.clearTokens();
                        throw new HttpError("Session expirée", 401, "SESSION_EXPIRED");
                    }
                }
                throw new HttpError(errorData.message, response.status, errorData.code, errorData.errors);
            }
            if (response.status === 204) {
                return {};
            }
            return await response.json();
        }
        catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError("Erreur de connexion au serveur", 0);
        }
    }
    static get(endpoint, config) {
        return this.request(endpoint, { ...config, method: "GET" });
    }
    static post(endpoint, data, config) {
        const isFormData = data instanceof FormData;
        return this.request(endpoint, {
            ...config,
            method: "POST",
            body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });
    }
    static put(endpoint, data, config) {
        const isFormData = data instanceof FormData;
        const headers = {};
        if (!isFormData) {
            headers["Content-Type"] = "application/json";
        }
        if (config?.headers) {
            Object.assign(headers, config.headers);
        }
        return this.request(endpoint, {
            ...config,
            method: "PUT",
            headers,
            body: isFormData ? data : data ? JSON.stringify(data) : undefined,
        });
    }
    static delete(endpoint, data, config) {
        return this.request(endpoint, {
            ...config,
            method: "DELETE",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
}
Object.defineProperty(HttpInterceptor, "isRefreshing", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: false
});
Object.defineProperty(HttpInterceptor, "refreshPromise", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: null
});
