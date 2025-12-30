import { HttpInterceptor } from "./http-interceptor.service";
import { MobileStorage } from "./mobile-storage.service";
export class MobileAuthService {
    static async register(data) {
        return HttpInterceptor.post("/register", data, { requiresAuth: false });
    }
    static async login(data) {
        return HttpInterceptor.post("/login", data, { requiresAuth: false });
    }
    static async logout() {
        const result = await HttpInterceptor.post("/logout");
        await MobileStorage.clearTokens();
        return result;
    }
    static async getMe() {
        return HttpInterceptor.get("/me");
    }
    static async revokeRefreshToken() {
        const refreshToken = await MobileStorage.getRefreshToken();
        if (refreshToken) {
            await HttpInterceptor.post("/revoke-refresh-token", { refreshToken });
        }
    }
    static async deleteAccount() {
        const result = await HttpInterceptor.delete("/me");
        await MobileStorage.clearTokens();
        return result;
    }
    static async updateNotificationSettings(pushNotificationsEnabled) {
        return HttpInterceptor.put("/me/notification-settings", {
            pushNotificationsEnabled,
        });
    }
    static async updatePrivacySettings(data) {
        return HttpInterceptor.put("/me/privacy-settings", data);
    }
}
