export const getInitialProfileState = () => ({
    user: null,
    reviews: [],
    isLoading: false,
    currentPage: 1,
    hasMore: true,
});
export const setProfileUser = (state, user) => ({
    ...state,
    user,
});
export const setProfileReviews = (state, reviews, append = false) => ({
    ...state,
    reviews: append ? [...state.reviews, ...reviews] : reviews,
});
export const setProfileLoading = (state, isLoading) => ({
    ...state,
    isLoading,
});
export const setProfilePagination = (state, currentPage, hasMore) => ({
    ...state,
    currentPage,
    hasMore,
});
export const clearProfileState = () => getInitialProfileState();
