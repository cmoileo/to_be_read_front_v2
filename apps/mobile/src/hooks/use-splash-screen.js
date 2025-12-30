import { useEffect, useCallback, useState } from "react";
import { SplashScreenService } from "../services/native";
export function useSplashScreen() {
    const [isReady, setIsReady] = useState(false);
    useEffect(() => {
        if (isReady) {
            SplashScreenService.hide();
        }
    }, [isReady]);
    const hideSplash = useCallback(async () => {
        await SplashScreenService.hide();
    }, []);
    const showSplash = useCallback(async () => {
        await SplashScreenService.show();
    }, []);
    const setReady = useCallback(() => {
        setIsReady(true);
    }, []);
    return {
        hideSplash,
        showSplash,
        isReady,
        setReady,
    };
}
