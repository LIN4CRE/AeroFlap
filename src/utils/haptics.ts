/**
 * AeroFlap Haptic Feedback Engine
 * Leverages the W3C Vibration API with distinct calibrated rhythmic patterns
 * for mobile immersion on supported Android and iOS devices.
 */

export const HAPTIC_PATTERNS = {
  // Game Start: Energetic spooling ramp/thrust pulse [pulse, pause, pulse, pause, thrust]
  GAME_START: [35, 45, 55, 40, 95],

  // Collision: Heavy visceral crash with secondary impact shudder
  COLLISION: [110, 50, 160, 45, 75],

  // Feather Collection: Crisp, tactile double-tap twinkle
  FEATHER_COLLECT: [25, 40, 35],

  // Flap Swoosh: Feather-light quick tap
  FLAP: [12],

  // Quick Dive: Snappy downward swoosh
  QUICK_DIVE: [22],

  // Obstacle Cleared: Subtle confirmation tick
  SCORE_POINT: [16],

  // Level Up / Fanfare: Celebratory rhythmic cascade
  FANFARE: [30, 40, 40, 40, 80, 50, 120],

  // UI Button Click: Ultra-crisp micro-tap
  UI_CLICK: [8]
} as const;

export type HapticType = keyof typeof HAPTIC_PATTERNS;

class HapticManager {
  private enabled: boolean = true;

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;
  }

  public trigger(type: HapticType): boolean {
    if (!this.enabled || !this.isSupported()) {
      return false;
    }

    try {
      const pattern = HAPTIC_PATTERNS[type];
      return navigator.vibrate(pattern as unknown as VibratePattern);
    } catch {
      return false;
    }
  }

  public triggerCustom(pattern: number | number[]): boolean {
    if (!this.enabled || !this.isSupported()) {
      return false;
    }

    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }

  public stop(): void {
    if (this.isSupported()) {
      try {
        navigator.vibrate(0);
      } catch {
        // ignore
      }
    }
  }
}

export const haptics = new HapticManager();
