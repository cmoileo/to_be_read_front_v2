import { HttpInterceptor } from "./http-interceptor.service";
export class MobileProfileService {
    static async getMyProfile() {
        return HttpInterceptor.get("/me");
    }
    static async getProfile(userId) {
        return HttpInterceptor.get(`/user/${userId}`);
    }
    static async updateProfile(data) {
        const formData = new FormData();
        if (data.userName !== undefined) {
            formData.append("userName", data.userName);
        }
        if (data.biography !== undefined) {
            formData.append("biography", data.biography);
        }
        if (data.locale !== undefined) {
            formData.append("locale", data.locale);
        }
        if (data.avatar !== undefined && data.avatar !== null) {
            formData.append("avatar", data.avatar);
        }
        return HttpInterceptor.put("/me", formData);
    }
    static async getMyReviews(page = 1) {
        return HttpInterceptor.get(`/my-reviews/${page}`);
    }
    static async getUserReviews(userId, page = 1) {
        return HttpInterceptor.get(`/user/${userId}/reviews/${page}`);
    }
    static async deleteReview(reviewId) {
        await HttpInterceptor.delete(`/review/${reviewId}`);
    }
}
