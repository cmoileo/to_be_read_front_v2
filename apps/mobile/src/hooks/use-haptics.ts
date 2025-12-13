import { useCallback } from "react";
import { HapticsService } from "../services/native";
import { ImpactStyle, NotificationType } from "@capacitor/haptics";

interface UseHapticsResult {
  impact: (style?: ImpactStyle) => Promise<void>;
  lightImpact: () => Promise<void>;
  mediumImpact: () => Promise<void>;
  heavyImpact: () => Promise<void>;
  notification: (type?: NotificationType) => Promise<void>;
  success: () => Promise<void>;
  warning: () => Promise<void>;
  error: () => Promise<void>;
  selectionStart: () => Promise<void>;
  selectionChanged: () => Promise<void>;
  selectionEnd: () => Promise<void>;
}

export function useHaptics(): UseHapticsResult {
  const impact = useCallback(async (style?: ImpactStyle) => {
    await HapticsService.impact(style);
  }, []);

  const lightImpact = useCallback(async () => {
    await HapticsService.lightImpact();
  }, []);

  const mediumImpact = useCallback(async () => {
    await HapticsService.mediumImpact();
  }, []);

  const heavyImpact = useCallback(async () => {
    await HapticsService.heavyImpact();
  }, []);

  const notification = useCallback(async (type?: NotificationType) => {
    await HapticsService.notification(type);
  }, []);

  const success = useCallback(async () => {
    await HapticsService.success();
  }, []);

  const warning = useCallback(async () => {
    await HapticsService.warning();
  }, []);

  const error = useCallback(async () => {
    await HapticsService.error();
  }, []);

  const selectionStart = useCallback(async () => {
    await HapticsService.selectionStart();
  }, []);

  const selectionChanged = useCallback(async () => {
    await HapticsService.selectionChanged();
  }, []);

  const selectionEnd = useCallback(async () => {
    await HapticsService.selectionEnd();
  }, []);

  return {
    impact,
    lightImpact,
    mediumImpact,
    heavyImpact,
    notification,
    success,
    warning,
    error,
    selectionStart,
    selectionChanged,
    selectionEnd,
  };
}
