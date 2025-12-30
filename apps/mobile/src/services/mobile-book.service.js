import { HttpInterceptor } from "./http-interceptor.service";
function mapApiReviewToBookReview(apiReview) {
    return {
        id: apiReview.id,
        content: apiReview.content,
        value: apiReview.value,
        googleBookId: apiReview.googleBookId,
        authorId: apiReview.authorId,
        createdAt: apiReview.createdAt,
        author: {
            id: apiReview.author.id,
            userName: apiReview.author.userName,
            avatar: apiReview.author.avatar || apiReview.author.avatarUrl || null,
        },
        likesCount: Number(apiReview.likesCount) || 0,
        commentsCount: Number(apiReview.commentsCount) || 0,
        isLiked: apiReview.hasUserLiked ?? false,
        isFromMe: apiReview.isFromMe ?? false,
    };
}
export class MobileBookService {
    static async getBook(googleBookId) {
        return HttpInterceptor.get(`/book/${googleBookId}`);
    }
    static async getBookReviews(googleBookId, page = 1) {
        const response = await HttpInterceptor.get(`/book/${googleBookId}/reviews/${page}`);
        return {
            data: response.data.map(mapApiReviewToBookReview),
            meta: response.meta,
        };
    }
}
