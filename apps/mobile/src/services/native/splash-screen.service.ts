import { SplashScreen } from "@capacitor/splash-screen";
import { Capacitor } from "@capacitor/core";

class SplashScreenServiceClass {
  private isNative = Capacitor.isNativePlatform();

  async hide(): Promise<void> {
    if (!this.isNative) return;
    await SplashScreen.hide({ fadeOutDuration: 300 });
  }

  async show(): Promise<void> {
    if (!this.isNative) return;
    await SplashScreen.show({
      autoHide: false,
      fadeInDuration: 200,
    });
  }
}

export const SplashScreenService = new SplashScreenServiceClass();
