export const queryKeys = {
  connectedUser: {
    all: ["connectedUser"] as const,
    profile: () => [...queryKeys.connectedUser.all, "profile"] as const,
  },

  feed: {
    all: ["feed"] as const,
    list: () => [...queryKeys.feed.all, "list"] as const,
  },

  notifications: {
    all: ["notifications"] as const,
    list: () => [...queryKeys.notifications.all, "list"] as const,
    unreadCount: () => [...queryKeys.notifications.all, "unreadCount"] as const,
  },

  users: {
    all: ["users"] as const,
    detail: (userId: number) => [...queryKeys.users.all, "detail", userId] as const,
    reviews: (userId: number) => [...queryKeys.users.all, "reviews", userId] as const,
  },

  reviews: {
    all: ["reviews"] as const,
    detail: (reviewId: number) => [...queryKeys.reviews.all, "detail", reviewId] as const,
    comments: (reviewId: number) => [...queryKeys.reviews.all, "comments", reviewId] as const,
  },

  books: {
    all: ["books"] as const,
    detail: (bookId: string) => [...queryKeys.books.all, "detail", bookId] as const,
    reviews: (bookId: string) => [...queryKeys.books.all, "reviews", bookId] as const,
    isInList: (bookId: string) => [...queryKeys.books.all, "isInList", bookId] as const,
  },

  toReadList: {
    all: ["toReadList"] as const,
    list: () => [...queryKeys.toReadList.all, "list"] as const,
    bookIds: () => [...queryKeys.toReadList.all, "bookIds"] as const,
  },

  followList: {
    all: ["followList"] as const,
    followers: (userId: number) => [...queryKeys.followList.all, "followers", userId] as const,
    followings: (userId: number) => [...queryKeys.followList.all, "followings", userId] as const,
  },

  likes: {
    review: (reviewId: number) => ["likes", "review", reviewId] as const,
  },

  follow: {
    user: (userId: number) => ["follow", "user", userId] as const,
  },

  myReviews: (userId: number | undefined) => ["myReviews", userId] as const,

  search: {
    all: ["search"] as const,
  },
};
