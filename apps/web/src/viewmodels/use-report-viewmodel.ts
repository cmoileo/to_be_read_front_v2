import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReportsApi } from "@repo/api-client";
import type { ReportEntityType, ReportReason } from "@repo/types";
import { useToast } from "@repo/ui";
import { useTranslation } from "react-i18next";

export function useReportViewModel() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [entityType, setEntityType] = useState<ReportEntityType>("review");
  const [entityId, setEntityId] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: (data: { reason: ReportReason; description?: string }) =>
      ReportsApi.createReport({
        entityType,
        entityId,
        reason: data.reason,
        description: data.description,
      }),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("report.success"),
      });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      const isAlreadyReported = error.message.includes("already");
      toast({
        title: t("common.error"),
        description: isAlreadyReported ? t("report.alreadyReported") : t("report.error"),
        variant: "destructive",
      });
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
    mutation.mutate({ reason, description });
  };

  return {
    isOpen,
    entityType,
    entityId,
    isLoading: mutation.isPending,
    openReportDialog,
    closeReportDialog,
    submitReport,
  };
}
