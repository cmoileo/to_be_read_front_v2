import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { MobileStorage } from "../../services/mobile-storage.service";
import { SingleReviewScreen, ReportDialog } from "@repo/ui";
import { useSingleReviewViewModel } from "../../viewmodels/use-single-review-viewmodel";
import { useReportViewModel } from "../../viewmodels/use-report-viewmodel";
import { usePlatform } from "../../hooks/use-platform";
import { PageTransition } from "../../components/page-transition";

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
  const router = useRouter();
  const { reviewId } = Route.useParams();
  const reviewIdNum = parseInt(reviewId, 10);
  const { isMobile } = usePlatform();

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

  const reportViewModel = useReportViewModel();

  const handleBack = () => {
    router.history.back();
  };

  const handleAuthorClick = (authorId: number) => {
    navigate({ to: "/user/$userId", params: { userId: String(authorId) } });
  };

  const handleBookClick = (bookId: string) => {
    navigate({ to: "/book/$bookId", params: { bookId } });
  };

  const handleReportReview = (reviewId: number) => {
    reportViewModel.openReportDialog("review", reviewId);
  };

  const handleReportComment = (commentId: number) => {
    reportViewModel.openReportDialog("comment", commentId);
  };

  return (
    <PageTransition className={isMobile ? 'pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]' : ''}>
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
        onBookClick={handleBookClick}
        onReportReview={handleReportReview}
        onReportComment={handleReportComment}
      />

      <ReportDialog
        open={reportViewModel.isOpen}
        onOpenChange={reportViewModel.closeReportDialog}
        entityType={reportViewModel.entityType}
        entityId={reportViewModel.entityId}
        onSubmit={reportViewModel.submitReport}
        isLoading={reportViewModel.isLoading}
      />
    </PageTransition>
  );
}
