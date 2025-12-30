import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";
class HapticsServiceClass {
    constructor() {
        Object.defineProperty(this, "isNative", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Capacitor.isNativePlatform()
        });
    }
    async impact(style = ImpactStyle.Medium) {
        if (!this.isNative)
            return;
        await Haptics.impact({ style });
    }
    async lightImpact() {
        await this.impact(ImpactStyle.Light);
    }
    async mediumImpact() {
        await this.impact(ImpactStyle.Medium);
    }
    async heavyImpact() {
        await this.impact(ImpactStyle.Heavy);
    }
    async notification(type = NotificationType.Success) {
        if (!this.isNative)
            return;
        await Haptics.notification({ type });
    }
    async success() {
        await this.notification(NotificationType.Success);
    }
    async warning() {
        await this.notification(NotificationType.Warning);
    }
    async error() {
        await this.notification(NotificationType.Error);
    }
    async selectionStart() {
        if (!this.isNative)
            return;
        await Haptics.selectionStart();
    }
    async selectionChanged() {
        if (!this.isNative)
            return;
        await Haptics.selectionChanged();
    }
    async selectionEnd() {
        if (!this.isNative)
            return;
        await Haptics.selectionEnd();
    }
}
export const HapticsService = new HapticsServiceClass();
