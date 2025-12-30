import { HttpInterceptor } from "./http-interceptor.service";
export class MobileFeedService {
    static async getFeed(page = 1) {
        return HttpInterceptor.get(`/feed/${page}`);
    }
    static async likeReview(reviewId) {
        return HttpInterceptor.get(`/review/${reviewId}/like`);
    }
}
