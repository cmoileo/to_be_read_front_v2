import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { SingleBookScreen } from "@repo/ui";
import { useSingleBookViewModel } from "../../viewmodels/use-single-book-viewmodel";

export const Route = createFileRoute("/book/$bookId")({
  component: SingleBookPage,
});

function SingleBookPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();

  const {
    book,
    reviews,
    totalReviews,
    isLoading,
    hasMoreReviews,
    isFetchingMoreReviews,
    handleLoadMoreReviews,
  } = useSingleBookViewModel(bookId);

  const handleBack = () => {
    router.history.back();
  };

  const handleReviewClick = (reviewId: number) => {
    navigate({ to: "/review/$reviewId", params: { reviewId: String(reviewId) } });
  };

  const handleAuthorClick = (authorId: number) => {
    navigate({ to: "/user/$userId", params: { userId: String(authorId) } });
  };

  return (
    <SingleBookScreen
      book={book}
      reviews={reviews}
      totalReviews={totalReviews}
      isLoading={isLoading}
      hasMoreReviews={hasMoreReviews}
      isFetchingMoreReviews={isFetchingMoreReviews}
      onBack={handleBack}
      onLoadMoreReviews={handleLoadMoreReviews}
      onReviewClick={handleReviewClick}
      onAuthorClick={handleAuthorClick}
    />
  );
}
