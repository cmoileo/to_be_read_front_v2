import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

class HapticsServiceClass {
  private isNative = Capacitor.isNativePlatform();

  async impact(style: ImpactStyle = ImpactStyle.Medium): Promise<void> {
    if (!this.isNative) return;
    await Haptics.impact({ style });
  }

  async lightImpact(): Promise<void> {
    await this.impact(ImpactStyle.Light);
  }

  async mediumImpact(): Promise<void> {
    await this.impact(ImpactStyle.Medium);
  }

  async heavyImpact(): Promise<void> {
    await this.impact(ImpactStyle.Heavy);
  }

  async notification(type: NotificationType = NotificationType.Success): Promise<void> {
    if (!this.isNative) return;
    await Haptics.notification({ type });
  }

  async success(): Promise<void> {
    await this.notification(NotificationType.Success);
  }

  async warning(): Promise<void> {
    await this.notification(NotificationType.Warning);
  }

  async error(): Promise<void> {
    await this.notification(NotificationType.Error);
  }

  async selectionStart(): Promise<void> {
    if (!this.isNative) return;
    await Haptics.selectionStart();
  }

  async selectionChanged(): Promise<void> {
    if (!this.isNative) return;
    await Haptics.selectionChanged();
  }

  async selectionEnd(): Promise<void> {
    if (!this.isNative) return;
    await Haptics.selectionEnd();
  }
}

export const HapticsService = new HapticsServiceClass();
