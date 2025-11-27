import { useState } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { Send } from "lucide-react";
import { useTranslation } from "react-i18next";

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  isLoading?: boolean;
}

export function CommentForm({ onSubmit, isLoading = false }: CommentFormProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isLoading) return;

    await onSubmit(content.trim());
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={t("comments.placeholder")}
        className="min-h-[60px] resize-none flex-1"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!content.trim() || isLoading}
        className="h-10 w-10 flex-shrink-0"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
