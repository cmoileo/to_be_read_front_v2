import { useCallback } from "react";
import { HapticsService } from "../services/native";
export function useHaptics() {
    const impact = useCallback(async (style) => {
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
    const notification = useCallback(async (type) => {
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
