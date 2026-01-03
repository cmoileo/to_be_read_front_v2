"use client";

import { useState } from "react";
import { Button } from "../components/button";
import { Textarea } from "../components/textarea";
import { Label } from "../components/label";
import { Rating } from "../components/rating";
import { BookSearchSelect } from "../components/book-search-select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { Switch } from "../components/switch";
import { useTranslation } from "react-i18next";
import type { GoogleBook } from "@repo/types";

interface CreateReviewFormProps {
  onSubmit: (data: {
    content: string;
    value: number;
    googleBookId: string;
    containsSpoiler?: boolean;
  }) => Promise<void>;
  onSearchBooks: (query: string) => Promise<GoogleBook[]>;
  isLoading?: boolean;
  error?: string;
}

export function CreateReviewForm({
  onSubmit,
  onSearchBooks,
  isLoading = false,
  error,
}: CreateReviewFormProps) {
  const { t } = useTranslation();
  const [selectedBook, setSelectedBook] = useState<GoogleBook | null>(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [containsSpoiler, setContainsSpoiler] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedBook) {
      newErrors.book = t("review.errors.bookRequired");
    }

    if (rating === 0) {
      newErrors.rating = t("review.errors.ratingRequired");
    }

    if (content.trim().length < 3) {
      newErrors.content = t("review.errors.contentMin");
    }

    if (content.trim().length > 1000) {
      newErrors.content = t("review.errors.contentMax");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedBook) {
      return;
    }

    try {
      await onSubmit({
        content: content.trim(),
        value: rating,
        googleBookId: selectedBook.id,
        containsSpoiler,
      });

      setSelectedBook(null);
      setRating(0);
      setContent("");
      setContainsSpoiler(false);
      setErrors({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t("review.create.title")}</CardTitle>
        <CardDescription>{t("review.create.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="book">{t("review.create.bookLabel")}</Label>
            <BookSearchSelect
              value={selectedBook}
              onChange={setSelectedBook}
              onSearch={onSearchBooks}
              placeholder={t("review.create.bookPlaceholder")}
              disabled={isLoading}
              error={errors.book}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("review.create.ratingLabel")}</Label>
            <div className="flex items-start flex-col gap-4">
              <Rating value={rating} onChange={setRating} max={5} disabled={isLoading} size="lg" />
            </div>
            {errors.rating && <p className="text-sm text-destructive">{errors.rating}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{t("review.create.contentLabel")}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("review.create.contentPlaceholder")}
              disabled={isLoading}
              className="min-h-[150px]"
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{errors.content}</span>
              <span>{content.length}/1000</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4 space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="spoiler-toggle" className="cursor-pointer">
                {t("review.create.spoilerLabel")}
              </Label>
              <p className="text-sm text-muted-foreground">
                {t("review.create.spoilerDescription")}
              </p>
            </div>
            <Switch
              id="spoiler-toggle"
              checked={containsSpoiler}
              onCheckedChange={setContainsSpoiler}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full" size="lg">
            {isLoading ? t("common.loading") : t("review.create.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
