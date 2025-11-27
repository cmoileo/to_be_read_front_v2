import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { MobileBookService } from "../services/mobile-book.service";

export const bookKeys = {
  all: ["books"] as const,
  detail: (bookId: string) => [...bookKeys.all, "detail", bookId] as const,
  reviews: (bookId: string) => [...bookKeys.all, "reviews", bookId] as const,
};

export const useSingleBookViewModel = (bookId: string) => {
  const {
    data: book,
    isLoading: isLoadingBook,
    error: bookError,
  } = useQuery({
    queryKey: bookKeys.detail(bookId),
    queryFn: () => MobileBookService.getBook(bookId),
    enabled: !!bookId,
  });

  const {
    data: reviewsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingReviews,
  } = useInfiniteQuery({
    queryKey: bookKeys.reviews(bookId),
    queryFn: ({ pageParam = 1 }) => MobileBookService.getBookReviews(bookId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.currentPage < lastPage.meta.lastPage) {
        return lastPage.meta.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!bookId,
  });

  const handleLoadMoreReviews = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const allReviews = reviewsData?.pages.flatMap((page) => page.data) ?? [];
  const totalReviews = reviewsData?.pages[0]?.meta.total ?? 0;

  return {
    book: book ?? null,
    reviews: allReviews,
    totalReviews,
    isLoading: isLoadingBook || isLoadingReviews,
    isLoadingBook,
    isLoadingReviews,
    hasMoreReviews: hasNextPage ?? false,
    isFetchingMoreReviews: isFetchingNextPage,
    bookError,
    handleLoadMoreReviews,
  };
};
