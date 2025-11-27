import { ArrowLeft, BookOpen, Calendar, Building2, Globe, Hash } from "lucide-react";
import { Button } from "../components/button";
import { Separator } from "../components/separator";
import { Rating } from "../components/rating";
import { Avatar, AvatarFallback, AvatarImage } from "../components/avatar";
import { Card, CardContent } from "../components/card";
import { useTranslation } from "react-i18next";

interface BookInfo {
  id: string;
  volumeInfo: {
    title: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
    imageLinks?: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
  };
}

interface ReviewAuthor {
  id: number;
  userName: string;
  avatar: string | null;
}

interface Review {
  id: number;
  content: string;
  value: number;
  authorId: number;
  createdAt: string;
  author: ReviewAuthor;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isFromMe: boolean;
}

interface SingleBookScreenProps {
  book: BookInfo | null;
  reviews: Review[];
  totalReviews: number;
  isLoading?: boolean;
  hasMoreReviews?: boolean;
  isFetchingMoreReviews?: boolean;
  onBack?: () => void;
  onLoadMoreReviews?: () => void;
  onReviewClick?: (reviewId: number) => void;
  onAuthorClick?: (authorId: number) => void;
}

export function SingleBookScreen({
  book,
  reviews,
  totalReviews,
  isLoading = false,
  hasMoreReviews = false,
  isFetchingMoreReviews = false,
  onBack,
  onLoadMoreReviews,
  onReviewClick,
  onAuthorClick,
}: SingleBookScreenProps) {
  const { t } = useTranslation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getLanguageName = (code?: string) => {
    if (!code) return null;
    const languages: Record<string, string> = {
      en: "English",
      fr: "Français",
      es: "Español",
      de: "Deutsch",
      it: "Italiano",
      pt: "Português",
      ja: "日本語",
      zh: "中文",
      ko: "한국어",
      ru: "Русский",
    };
    return languages[code] || code.toUpperCase();
  };

  const getIsbn = () => {
    const isbn13 = book?.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_13");
    const isbn10 = book?.volumeInfo.industryIdentifiers?.find((id) => id.type === "ISBN_10");
    return isbn13?.identifier || isbn10?.identifier;
  };

  if (isLoading && !book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-muted-foreground">{t("book.notFound")}</p>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            {t("common.back")}
          </Button>
        )}
      </div>
    );
  }

  const { volumeInfo } = book;
  const coverImage = volumeInfo.imageLinks?.medium || 
                     volumeInfo.imageLinks?.large || 
                     volumeInfo.imageLinks?.thumbnail;

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl pb-24">
      {onBack && (
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back")}
        </Button>
      )}

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0 mx-auto md:mx-0">
          {coverImage ? (
            <img
              src={coverImage}
              alt={volumeInfo.title}
              className="w-48 h-72 object-cover rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-48 h-72 bg-muted rounded-lg flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{volumeInfo.title}</h1>
            {volumeInfo.subtitle && (
              <p className="text-lg text-muted-foreground mt-1">{volumeInfo.subtitle}</p>
            )}
          </div>

          {volumeInfo.authors && volumeInfo.authors.length > 0 && (
            <p className="text-lg">
              {t("book.by")} <span className="font-medium">{volumeInfo.authors.join(", ")}</span>
            </p>
          )}

          {volumeInfo.averageRating && (
            <div className="flex items-center gap-3">
              <Rating value={volumeInfo.averageRating} readOnly size="sm" max={5} />
              <span className="text-sm text-muted-foreground">
                {volumeInfo.averageRating.toFixed(1)}
                {volumeInfo.ratingsCount && ` (${volumeInfo.ratingsCount.toLocaleString()} ${t("book.ratings")})`}
              </span>
            </div>
          )}

          {volumeInfo.categories && volumeInfo.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {volumeInfo.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            {volumeInfo.pageCount && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{volumeInfo.pageCount} {t("book.pages")}</span>
              </div>
            )}

            {volumeInfo.publishedDate && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{volumeInfo.publishedDate}</span>
              </div>
            )}

            {volumeInfo.publisher && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{volumeInfo.publisher}</span>
              </div>
            )}

            {volumeInfo.language && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>{getLanguageName(volumeInfo.language)}</span>
              </div>
            )}

            {getIsbn() && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground col-span-2">
                <Hash className="h-4 w-4" />
                <span>ISBN: {getIsbn()}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {volumeInfo.description && (
        <>
          <Separator className="my-6" />
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">{t("book.description")}</h2>
            <p 
              className="text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: volumeInfo.description }}
            />
          </div>
        </>
      )}

      <Separator className="my-6" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("book.reviews")}</h2>
          <span className="text-sm text-muted-foreground">
            {totalReviews} {totalReviews === 1 ? t("book.review") : t("book.reviewsCount")}
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t("book.noReviews")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card 
                key={review.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => onReviewClick?.(review.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAuthorClick?.(review.author.id);
                      }}
                      type="button"
                      className="flex-shrink-0"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.author.avatar || undefined} alt={review.author.userName} />
                        <AvatarFallback>{review.author.userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAuthorClick?.(review.author.id);
                          }}
                          type="button"
                          className="font-semibold hover:underline"
                        >
                          @{review.author.userName}
                        </button>
                        <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
                      </div>

                      <Rating value={review.value} readOnly size="sm" />

                      <p className="text-sm line-clamp-3">{review.content}</p>

                      <div className="flex gap-4 text-xs text-muted-foreground pt-1">
                        <span>❤️ {Number(review.likesCount) || 0}</span>
                        <span>💬 {Number(review.commentsCount) || 0}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {hasMoreReviews && (
              <Button
                variant="outline"
                className="w-full"
                onClick={onLoadMoreReviews}
                disabled={isFetchingMoreReviews}
              >
                {isFetchingMoreReviews ? t("common.loading") : t("common.loadMore")}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
