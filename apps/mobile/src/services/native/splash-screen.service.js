import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";
class SplashScreenServiceClass {
    constructor() {
        Object.defineProperty(this, "isNative", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Capacitor.isNativePlatform()
        });
    }
    async hide() {
        if (!this.isNative)
            return;
        await SplashScreen.hide({ fadeOutDuration: 300 });
    }
    async show() {
        if (!this.isNative)
            return;
        await SplashScreen.show({
            autoHide: false,
            fadeInDuration: 200,
        });
    }
}
export const SplashScreenService = new SplashScreenServiceClass();
