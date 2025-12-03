"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Input } from "./input";
import { Card, CardContent } from "./card";
import { Skeleton } from "./skeleton";
import { cn } from "../lib/utils";
import { useTranslation } from "react-i18next";
import type { GoogleBook } from "@repo/types";

interface BookSearchSelectProps {
  value: GoogleBook | null;
  onChange: (book: GoogleBook | null) => void;
  onSearch: (query: string) => Promise<GoogleBook[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

function BookSearchSkeleton() {
  return (
    <div className="p-3 flex gap-3 items-start">
      <Skeleton className="w-12 h-16 rounded flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

interface BookSearchSelectProps {
  value: GoogleBook | null;
  onChange: (book: GoogleBook | null) => void;
  onSearch: (query: string) => Promise<GoogleBook[]>;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function BookSearchSelect({
  value,
  onChange,
  onSearch,
  placeholder,
  disabled = false,
  error,
}: BookSearchSelectProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const resolvedPlaceholder = placeholder || t("bookSearch.placeholder");

  useEffect(() => {
    if (query.length >= 2) {
      setIsOpen(true);
      setIsLoading(true);
    } else {
      setIsOpen(false);
      setResults([]);
    }

    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const books = await onSearch(query);
          setResults(books);
        } catch (err) {
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, onSearch]);

  const handleSelect = (book: GoogleBook) => {
    onChange(book);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setQuery("");
    setResults([]);
  };

  if (value) {
    return (
      <Card className={cn(error && "border-destructive")}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {value.volumeInfo.imageLinks?.thumbnail && (
              <img
                src={value.volumeInfo.imageLinks.thumbnail}
                alt={value.volumeInfo.title}
                className="w-16 h-24 object-cover rounded"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{value.volumeInfo.title}</h3>
              {value.volumeInfo.authors && (
                <p className="text-sm text-muted-foreground truncate">
                  {value.volumeInfo.authors.join(", ")}
                </p>
              )}
              {value.volumeInfo.publishedDate && (
                <p className="text-xs text-muted-foreground">{value.volumeInfo.publishedDate}</p>
              )}
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("bookSearch.clearSelection")}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={resolvedPlaceholder}
        disabled={disabled}
        className={cn(error && "border-destructive")}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-auto">
          {isLoading ? (
            <div className="divide-y">
              <BookSearchSkeleton />
              <BookSearchSkeleton />
              <BookSearchSkeleton />
            </div>
          ) : results.length > 0 ? (
            results.map((book) => (
              <button
                key={book.id}
                type="button"
                onClick={() => handleSelect(book)}
                className="w-full p-3 hover:bg-accent flex gap-3 items-start text-left transition-colors"
              >
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-12 h-16 object-cover rounded flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{book.volumeInfo.title}</p>
                  {book.volumeInfo.authors && (
                    <p className="text-sm text-muted-foreground truncate">
                      {book.volumeInfo.authors.join(", ")}
                    </p>
                  )}
                  {book.volumeInfo.publishedDate && (
                    <p className="text-xs text-muted-foreground">{book.volumeInfo.publishedDate}</p>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">{t("bookSearch.noResults")}</div>
          )}
        </div>
      )}
    </div>
  );
}
