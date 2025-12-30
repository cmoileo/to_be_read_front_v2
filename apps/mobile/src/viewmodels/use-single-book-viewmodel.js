import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MobileBookService } from "../services/mobile-book.service";
import { MobileToReadListService } from "../services/mobile-to-read-list.service";
import { queryKeys, addBookToListCache, removeBookFromListCache } from "@repo/stores";
export const useSingleBookViewModel = (bookId) => {
    const queryClient = useQueryClient();
    const { data: book, isLoading: isLoadingBook, error: bookError, } = useQuery({
        queryKey: queryKeys.books.detail(bookId),
        queryFn: () => MobileBookService.getBook(bookId),
        enabled: !!bookId,
    });
    const { data: reviewsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading: isLoadingReviews, } = useInfiniteQuery({
        queryKey: queryKeys.books.reviews(bookId),
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
    const { data: isInReadList = false } = useQuery({
        queryKey: queryKeys.books.isInList(bookId),
        queryFn: async () => {
            const result = await MobileToReadListService.getToReadList(1);
            return result.data.some((item) => item.googleBookId === bookId);
        },
        enabled: !!bookId,
    });
    const addToListMutation = useMutation({
        mutationFn: () => MobileToReadListService.addToReadList(bookId),
        onMutate: async () => {
            addBookToListCache(queryClient, bookId);
        },
        onError: () => {
            removeBookFromListCache(queryClient, bookId);
        },
    });
    const removeFromListMutation = useMutation({
        mutationFn: () => MobileToReadListService.removeFromReadList(bookId),
        onMutate: async () => {
            removeBookFromListCache(queryClient, bookId);
        },
        onError: () => {
            addBookToListCache(queryClient, bookId);
        },
    });
    const handleToggleReadList = () => {
        if (isInReadList) {
            removeFromListMutation.mutate();
        }
        else {
            addToListMutation.mutate();
        }
    };
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
        isInReadList,
        isAddingToList: addToListMutation.isPending || removeFromListMutation.isPending,
        handleToggleReadList,
    };
};
