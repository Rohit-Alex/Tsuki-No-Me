/*
Problem statement
You're building a reusable Cookie Consent Manager SDK for a web application. Multiple components across the application need to read and update cookie preferences, but the application must maintain a consistent consent state.
Your task is to design the SDK using JavaScript classes.

Requirements
1. SDK initialization
The application should initialize the SDK with configuration:
CookieConsentManager.init({
  storage: "localStorage",
  defaultConsent: {
    necessary: true,
    analytics: false,
    marketing: false,
  },
});
*/

const INTERNAL = Symbol("internal");
const SERVICES = new Set(["necessary", "analytics", "marketing"]);
const USER_COOKIE_CONSENT_STORAGE_KEY = "user-cookie-consent-data";

class WebStorageAdapter {
  #storage;

  constructor(storage) {
    this.#storage = storage;
  }

  getItem() {
    const value = this.#storage.getItem(USER_COOKIE_CONSENT_STORAGE_KEY);

    if (value === null) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  setItem(value) {
    this.#storage.setItem(
      USER_COOKIE_CONSENT_STORAGE_KEY,
      JSON.stringify(value),
    );
  }

  removeItem() {
    this.#storage.removeItem(USER_COOKIE_CONSENT_STORAGE_KEY);
  }
}

class CookieStorageAdapter {
  #key;

  constructor(key = USER_COOKIE_CONSENT_STORAGE_KEY) {
    this.#key = key;
  }

  getItem() {
    const prefix = `${encodeURIComponent(this.#key)}=`;

    const cookie = document.cookie
      .split("; ")
      .find((item) => item.startsWith(prefix));

    if (!cookie) {
      return null;
    }

    const encodedValue = cookie.slice(prefix.length);

    try {
      return JSON.parse(decodeURIComponent(encodedValue));
    } catch {
      return null;
    }
  }

  setItem(value) {
    const encodedKey = encodeURIComponent(this.#key);
    const encodedValue = encodeURIComponent(JSON.stringify(value));

    document.cookie = [
      `${encodedKey}=${encodedValue}`,
      "Path=/",
      "Max-Age=31536000",
      "SameSite=Lax",
    ].join("; ");
  }

  removeItem() {
    document.cookie = [
      `${encodeURIComponent(this.#key)}=`,
      "Path=/",
      "Max-Age=0",
      "SameSite=Lax",
    ].join("; ");
  }
}

class MemoryStorageAdapter {
  #value = null;

  getItem() {
    return this.#value;
  }

  setItem(value) {
    this.#value = value;
  }

  removeItem() {
    this.#value = null;
  }
}

function createStorageAdapter(type) {
  try {
    switch (type) {
      case "localStorage":
        return new WebStorageAdapter(window.localStorage);

      case "sessionStorage":
        return new WebStorageAdapter(window.sessionStorage);

      case "cookie":
        return new CookieStorageAdapter();

      default:
        throw new Error(`Unsupported storage: ${type}`);
    }
  } catch {
    return new MemoryStorageAdapter();
  }
}

class CookieConsentManager {
  static #instance = null;
  #listeners = new Set();
  #storage;

  #consent = {
    status: "pending",
    categories: {
      necessary: true,
      analytics: false,
      marketing: false,
    },
    updatedAt: null,
  };

  constructor(token, storage) {
    if (token !== INTERNAL) {
      throw new Error("Use CookieConsentManager.init()");
    }

    this.#storage = storage;
    this.#restoreConsent();
  }

  static init({ storage = "localStorage" } = {}) {
    if (!CookieConsentManager.#instance) {
      const adapter = createStorageAdapter(storage);

      CookieConsentManager.#instance = new CookieConsentManager(
        INTERNAL,
        adapter,
      );
    }

    return CookieConsentManager.#instance;
  }

  #cloneConsent(consent) {
    return {
      ...consent,
      categories: { ...consent.categories },
    };
  }

  getConsent() {
    return this.#cloneConsent(this.#consent);
  }

  subscribe(listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Listener must be a function");
    }

    this.#listeners.add(listener);

    // Immediately deliver the current state.
    this.#notifyListener(listener, this.#consent);

    // Return an unsubscribe function.
    return () => {
      this.#listeners.delete(listener);
    };
  }

  #notifyListener(listener, consent) {
    try {
      listener(this.#cloneConsent(consent));
    } catch (error) {
      // A failing listener must not break the SDK.
      console.error("Consent listener failed:", error);
    }
  }

  #notifyAll() {
    // Snapshot the listeners so additions/removals during
    // notification don't change this iteration.
    const listeners = [...this.#listeners];

    for (const listener of listeners) {
      // A listener may have unsubscribed during notification.
      if (!this.#listeners.has(listener)) continue;

      this.#notifyListener(listener, this.#consent);
    }
  }

  #restoreConsent() {
    try {
      const saved = this.#storage.getItem(CONSENT_KEY);

      if (saved === null || saved === undefined) {
        return;
      }

      if (!isValidConsent(saved)) {
        this.#storage.removeItem(CONSENT_KEY);
        return;
      }

      this.#consent = {
        status: saved.status,
        categories: { ...saved.categories },
        updatedAt: saved.updatedAt,
      };
    } catch {
      // Fail closed: retain the pending state.
      this.#consent = {
        status: "pending",
        categories: {
          necessary: true,
          analytics: false,
          marketing: false,
        },
        updatedAt: null,
      };
    }
  }

  #commitConsent(next) {
    this.#consent = next;

    // Persistence failure shouldn't prevent in-memory updates
    // or notifications to active services.
    this.#persistConsent();

    this.#notifyAll();

    return this.getConsent();
  }

  #persistConsent() {
    try {
      this.#storage.setItem(this.#consent);
      return true;
    } catch {
      // State remains available in memory,
      // but persistence has failed.
      return false;
    }
  }

  hasConsent(category) {
    return this.#consent.categories[category] === true;
  }

  acceptAll() {
    return this.#commitConsent({
      status: "accepted",
      categories: {
        necessary: true,
        analytics: true,
        marketing: true,
      },
      updatedAt: Date.now(),
    });
  }

  rejectOptional() {
    return this.#commitConsent({
      status: "rejected",
      categories: {
        necessary: true,
        analytics: false,
        marketing: false,
      },
      updatedAt: Date.now(),
    });
  }

  updateConsent(categories) {
    const keys = Object.keys(categories);

    const invalidKeys = keys.filter((key) => !SERVICES.has(key));

    if (invalidKeys.length) {
      throw new Error(`Invalid categories: ${invalidKeys.join(", ")}`);
    }

    if (keys.length === 0) {
      return this.getConsent();
    }

    const hasInvalidValue = Object.values(categories).some(
      (value) => typeof value !== "boolean",
    );

    if (hasInvalidValue) {
      throw new TypeError("Consent values must be boolean");
    }

    return this.#commitConsent({
      status: "custom",
      categories: {
        ...this.#consent.categories,
        ...categories,
        necessary: true,
      },
      updatedAt: Date.now(),
    });
  }
}

/* <-------- USAGE -------->

* Initialize twice 
const manager1 = CookieConsentManager.init();
const manager2 = CookieConsentManager.init();

console.log(manager1 === manager2); // true — same instance

* Subscribe to consent changes (also receives current consent immediately)
const unsubscribe = manager1.subscribe((consent) => {
  if (consent.categories.analytics) {
    console.log("Analytics enabled");
    startAnalytics();
  } else {
    console.log("Analytics disabled");
    stopAnalytics();
  }
});

* User accepts all cookies
manager2.acceptAll(); // Analytics enabled

* User revokes analytics consent
manager1.updateConsent({ analytics: false }); // Analytics disabled

* Clean up when the integration is no longer needed
unsubscribe();

*/
