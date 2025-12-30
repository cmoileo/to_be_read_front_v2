import { HttpInterceptor } from "./http-interceptor.service";
function mapApiUserToUser(apiUser) {
    return {
        id: apiUser.id,
        userName: apiUser.userName,
        avatar: apiUser.avatarUrl,
        biography: apiUser.biography,
        followersCount: apiUser.followersCount,
        followingCount: apiUser.followingCount,
        reviewsCount: apiUser.reviewsCount,
        isFollowing: apiUser.isFollowing,
        isMe: apiUser.isMe,
        isPrivate: apiUser.isPrivate,
        followRequestStatus: apiUser.followRequestStatus,
        createdAt: apiUser.createdAt,
        updatedAt: apiUser.createdAt,
    };
}
function mapApiFollowUserToFollowUser(apiUser) {
    return {
        id: apiUser.id,
        userName: apiUser.userName,
        avatar: apiUser.avatar || apiUser.avatarUrl || null,
        biography: apiUser.biography,
        isFollowing: apiUser.isFollowing,
        isMe: apiUser.isMe,
    };
}
export class MobileUserService {
    static async getUser(userId) {
        const apiUser = await HttpInterceptor.get(`/user/${userId}`);
        return mapApiUserToUser(apiUser);
    }
    static async getUserReviews(userId, page = 1) {
        return HttpInterceptor.get(`/user/${userId}/reviews/${page}`);
    }
    static async followUser(userId) {
        return HttpInterceptor.get(`/user/${userId}/follow`);
    }
    static async unfollowUser(userId) {
        return HttpInterceptor.get(`/user/${userId}/unfollow`);
    }
    static async cancelFollowRequest(userId) {
        return HttpInterceptor.delete(`/user/${userId}/cancel-follow-request`);
    }
    static async getFollowers(userId, page = 1) {
        const response = await HttpInterceptor.get(`/followers/${userId}/${page}`);
        return {
            ...response,
            data: response.data.map(mapApiFollowUserToFollowUser),
        };
    }
    static async getFollowings(userId, page = 1) {
        const response = await HttpInterceptor.get(`/followings/${userId}/${page}`);
        return {
            ...response,
            data: response.data.map(mapApiFollowUserToFollowUser),
        };
    }
}
