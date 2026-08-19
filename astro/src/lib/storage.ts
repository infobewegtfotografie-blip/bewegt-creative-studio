/**
 * Safe localStorage/sessionStorage wrappers — direct port of script.js:2-34.
 * Swallows errors from private-mode/restricted contexts instead of crashing.
 */
export const safeStorage = {
  get(key: string, fallback: string): string {
    try {
      return window.localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string): void {
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // Browsers in private mode or restricted contexts may block storage.
    }
  },
};

export const safeSession = {
  get(key: string, fallback: string): string {
    try {
      return window.sessionStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  },
  set(key: string, value: string): void {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      // Browsers in private mode or restricted contexts may block storage.
    }
  },
};
