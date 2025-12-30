import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
class StatusBarServiceClass {
    constructor() {
        Object.defineProperty(this, "isNative", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Capacitor.isNativePlatform()
        });
    }
    async setStyleLight() {
        if (!this.isNative)
            return;
        await StatusBar.setStyle({ style: Style.Light });
    }
    async setStyleDark() {
        if (!this.isNative)
            return;
        await StatusBar.setStyle({ style: Style.Dark });
    }
    async setBackgroundColor(color) {
        if (!this.isNative)
            return;
        await StatusBar.setBackgroundColor({ color });
    }
    async hide() {
        if (!this.isNative)
            return;
        await StatusBar.hide();
    }
    async show() {
        if (!this.isNative)
            return;
        await StatusBar.show();
    }
    async setOverlaysWebView(overlay) {
        if (!this.isNative)
            return;
        await StatusBar.setOverlaysWebView({ overlay });
    }
}
export const StatusBarService = new StatusBarServiceClass();
