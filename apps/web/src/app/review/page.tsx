"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateReviewForm, useToast } from "@repo/ui";
import { useCreateReviewViewModel } from "@/viewmodels/use-create-review-viewmodel";
import { useAuthContext } from "@/models/hooks/use-auth-context";

export default function ReviewPage() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const viewModel = useCreateReviewViewModel();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleSubmit = async (data: { content: string; value: number; googleBookId: string }) => {
    const success = await viewModel.createReview(data);
    if (success) {
      toast({
        title: "Critique publiée",
        description: "Votre critique a été publiée avec succès",
      });
    }
  };

  return (
    <div className="container py-8">
      <CreateReviewForm
        onSubmit={handleSubmit}
        onSearchBooks={viewModel.searchBooks}
        isLoading={viewModel.isLoading}
        error={viewModel.error}
      />
    </div>
  );
}
