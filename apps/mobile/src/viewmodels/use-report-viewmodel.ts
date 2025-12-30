import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReportsApi } from "@repo/api-client";
import type { ReportEntityType, ReportReason, CreateReportData } from "@repo/types";
import { useTranslation } from "@repo/ui";

export interface UseReportViewModelProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useReportViewModel = ({ onSuccess, onError }: UseReportViewModelProps = {}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [entityType, setEntityType] = useState<ReportEntityType>("review");
  const [entityId, setEntityId] = useState<number>(0);

  const reportMutation = useMutation({
    mutationFn: (data: CreateReportData) => ReportsApi.createReport(data),
    onSuccess: () => {
      setIsOpen(false);
      onSuccess?.();
    },
    onError: (error: Error) => {
      const message = error.message?.includes("already reported")
        ? t("report.alreadyReported")
        : t("report.error");
      onError?.(message);
    },
  });

  const openReportDialog = (type: ReportEntityType, id: number) => {
    setEntityType(type);
    setEntityId(id);
    setIsOpen(true);
  };

  const closeReportDialog = () => {
    setIsOpen(false);
  };

  const submitReport = (reason: ReportReason, description?: string) => {
    reportMutation.mutate({
      entityType,
      entityId,
      reason,
      description,
    });
  };

  return {
    isOpen,
    entityType,
    entityId,
    isLoading: reportMutation.isPending,
    openReportDialog,
    closeReportDialog,
    setIsOpen,
    submitReport,
  };
};
