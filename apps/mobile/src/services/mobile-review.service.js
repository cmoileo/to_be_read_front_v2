import { HttpInterceptor } from "./http-interceptor.service";
function mapApiReviewToReview(apiReview) {
    return {
        id: apiReview.id,
        content: apiReview.content,
        value: apiReview.value,
        googleBookId: apiReview.googleBookId,
        authorId: apiReview.authorId,
        likesCount: apiReview.likesCount,
        isLiked: apiReview.hasUserLiked,
        isFromMe: apiReview.isFromMe,
        createdAt: apiReview.createdAt,
        author: {
            id: apiReview.author.id,
            userName: apiReview.author.userName,
            avatar: apiReview.author.avatar || apiReview.author.avatarUrl || null,
        },
        book: apiReview.book,
    };
}
function mapApiCommentToComment(apiComment) {
    return {
        id: apiComment.id,
        authorId: apiComment.authorId,
        content: apiComment.content,
        likesCount: apiComment.likesCount ?? 0,
        isLiked: apiComment.hasUserLiked ?? false,
        isFromCurrentUser: apiComment.isFromCurrentUser ?? true,
        createdAt: apiComment.createdAt,
        author: {
            id: apiComment.author.id,
            userName: apiComment.author.userName,
            avatar: apiComment.author.avatar || apiComment.author.avatarUrl || null,
        },
    };
}
export class MobileReviewService {
    static async getReview(reviewId) {
        const apiReview = await HttpInterceptor.get(`/review/${reviewId}`);
        return mapApiReviewToReview(apiReview);
    }
    static async getComments(reviewId, page = 1) {
        const response = await HttpInterceptor.get(`/comments/${reviewId}/${page}`);
        return {
            data: response.data.map(mapApiCommentToComment),
            meta: response.meta,
        };
    }
    static async createComment(reviewId, content) {
        const apiComment = await HttpInterceptor.post("/comment", {
            reviewId,
            content,
        });
        return mapApiCommentToComment(apiComment);
    }
    static async deleteComment(commentId) {
        await HttpInterceptor.delete(`/comment/${commentId}`);
    }
    static async likeComment(commentId) {
        return HttpInterceptor.get(`/comment/${commentId}/like`);
    }
    static async likeReview(reviewId) {
        return HttpInterceptor.get(`/review/${reviewId}/like`);
    }
}
