import { Keyboard } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";
class KeyboardServiceClass {
    constructor() {
        Object.defineProperty(this, "isNative", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Capacitor.isNativePlatform()
        });
        Object.defineProperty(this, "showListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "hideListeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
    }
    async hide() {
        if (!this.isNative)
            return;
        await Keyboard.hide();
    }
    async setAccessoryBarVisible(isVisible) {
        if (!this.isNative)
            return;
        await Keyboard.setAccessoryBarVisible({ isVisible });
    }
    async setScroll(isDisabled) {
        if (!this.isNative)
            return;
        await Keyboard.setScroll({ isDisabled });
    }
    async setResizeMode(mode) {
        if (!this.isNative)
            return;
        await Keyboard.setResizeMode({ mode });
    }
    addShowListener(callback) {
        this.showListeners.add(callback);
        if (this.showListeners.size === 1 && this.isNative) {
            Keyboard.addListener("keyboardWillShow", (info) => {
                this.showListeners.forEach((listener) => listener(info));
            });
        }
        return () => {
            this.showListeners.delete(callback);
        };
    }
    addHideListener(callback) {
        this.hideListeners.add(callback);
        if (this.hideListeners.size === 1 && this.isNative) {
            Keyboard.addListener("keyboardWillHide", () => {
                this.hideListeners.forEach((listener) => listener());
            });
        }
        return () => {
            this.hideListeners.delete(callback);
        };
    }
    removeAllListeners() {
        if (!this.isNative)
            return;
        Keyboard.removeAllListeners();
        this.showListeners.clear();
        this.hideListeners.clear();
    }
}
export const KeyboardService = new KeyboardServiceClass();
