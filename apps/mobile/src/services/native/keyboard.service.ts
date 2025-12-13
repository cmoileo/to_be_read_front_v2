import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { Capacitor } from "@capacitor/core";

type KeyboardListener = (info: { keyboardHeight: number }) => void;

class KeyboardServiceClass {
  private isNative = Capacitor.isNativePlatform();
  private showListeners: Set<KeyboardListener> = new Set();
  private hideListeners: Set<() => void> = new Set();

  async hide(): Promise<void> {
    if (!this.isNative) return;
    await Keyboard.hide();
  }

  async setAccessoryBarVisible(isVisible: boolean): Promise<void> {
    if (!this.isNative) return;
    await Keyboard.setAccessoryBarVisible({ isVisible });
  }

  async setScroll(isDisabled: boolean): Promise<void> {
    if (!this.isNative) return;
    await Keyboard.setScroll({ isDisabled });
  }

  async setResizeMode(mode: KeyboardResize): Promise<void> {
    if (!this.isNative) return;
    await Keyboard.setResizeMode({ mode });
  }

  addShowListener(callback: KeyboardListener): () => void {
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

  addHideListener(callback: () => void): () => void {
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

  removeAllListeners(): void {
    if (!this.isNative) return;
    Keyboard.removeAllListeners();
    this.showListeners.clear();
    this.hideListeners.clear();
  }
}

export const KeyboardService = new KeyboardServiceClass();
