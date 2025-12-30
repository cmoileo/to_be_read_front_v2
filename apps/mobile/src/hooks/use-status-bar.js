import { useCallback } from "react";
import { StatusBarService } from "../services/native";
export function useStatusBar() {
    const setLight = useCallback(async () => {
        await StatusBarService.setStyleLight();
    }, []);
    const setDark = useCallback(async () => {
        await StatusBarService.setStyleDark();
    }, []);
    const setBackgroundColor = useCallback(async (color) => {
        await StatusBarService.setBackgroundColor(color);
    }, []);
    const hide = useCallback(async () => {
        await StatusBarService.hide();
    }, []);
    const show = useCallback(async () => {
        await StatusBarService.show();
    }, []);
    return {
        setLight,
        setDark,
        setBackgroundColor,
        hide,
        show,
    };
}
