import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import { SingleReviewScreen } from "@repo/ui";
import { useSingleReviewViewModel } from "../../viewmodels/use-single-review-viewmodel";

export const Route = createFileRoute("/review/$reviewId")({
  beforeLoad: async () => {
    const hasTokens = await MobileStorage.hasTokens();
    if (!hasTokens) {
      throw redirect({ to: "/onboarding" });
    }
  },
  component: SingleReviewPage,
});

function SingleReviewPage() {
  const navigate = useNavigate();
  const { reviewId } = Route.useParams();
  const reviewIdNum = parseInt(reviewId, 10);

  const {
    review,
    comments,
    isLoading,
    hasMoreComments,
    isFetchingMoreComments,
    isCreatingComment,
    handleLikeReview,
    handleLikeComment,
    handleCreateComment,
    handleDeleteComment,
    handleLoadMoreComments,
  } = useSingleReviewViewModel(reviewIdNum);

  const handleBack = () => {
    navigate({ to: "/" });
  };

  const handleAuthorClick = (authorId: number) => {
    navigate({ to: "/user/$userId", params: { userId: String(authorId) } });
  };

  return (
    <SingleReviewScreen
      review={review}
      comments={comments}
      isLoading={isLoading}
      hasMoreComments={hasMoreComments}
      isFetchingMoreComments={isFetchingMoreComments}
      isCreatingComment={isCreatingComment}
      onBack={handleBack}
      onLikeReview={handleLikeReview}
      onLikeComment={handleLikeComment}
      onDeleteComment={handleDeleteComment}
      onCreateComment={handleCreateComment}
      onLoadMoreComments={handleLoadMoreComments}
      onAuthorClick={handleAuthorClick}
    />
  );
}
