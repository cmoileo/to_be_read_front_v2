import type { User, Review } from "@repo/types";

export interface ProfileState {
  user: User | null;
  reviews: Review[];
  isLoading: boolean;
  currentPage: number;
  hasMore: boolean;
}

export const getInitialProfileState = (): ProfileState => ({
  user: null,
  reviews: [],
  isLoading: false,
  currentPage: 1,
  hasMore: true,
});

export const setProfileUser = (state: ProfileState, user: User): ProfileState => ({
  ...state,
  user,
});

export const setProfileReviews = (
  state: ProfileState,
  reviews: Review[],
  append: boolean = false
): ProfileState => ({
  ...state,
  reviews: append ? [...state.reviews, ...reviews] : reviews,
});

export const setProfileLoading = (state: ProfileState, isLoading: boolean): ProfileState => ({
  ...state,
  isLoading,
});

export const setProfilePagination = (
  state: ProfileState,
  currentPage: number,
  hasMore: boolean
): ProfileState => ({
  ...state,
  currentPage,
  hasMore,
});

export const clearProfileState = (): ProfileState => getInitialProfileState();
