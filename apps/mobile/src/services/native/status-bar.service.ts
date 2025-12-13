import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";

class StatusBarServiceClass {
  private isNative = Capacitor.isNativePlatform();

  async setStyleLight(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setStyle({ style: Style.Light });
  }

  async setStyleDark(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setStyle({ style: Style.Dark });
  }

  async setBackgroundColor(color: string): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setBackgroundColor({ color });
  }

  async hide(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.hide();
  }

  async show(): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.show();
  }

  async setOverlaysWebView(overlay: boolean): Promise<void> {
    if (!this.isNative) return;
    await StatusBar.setOverlaysWebView({ overlay });
  }
}

export const StatusBarService = new StatusBarServiceClass();
