// Feature flag store: cache + subscribe pattern.
// Version 1: constructor function. Version 2: class. Same behavior.
// Run: node FeatureFlagStore.js

// ---------- Version 1: constructor function ----------
function FeatureFlagStore(fetchFlag) {
  const cache = new Map(); // id -> value
  const listeners = new Map(); // id -> Set of callbacks
  const globalListeners = new Set(); // callbacks for every flag

  this.getFlag = async function (id) {
    if (cache.has(id)) return cache.get(id); // cache hit: no fetch
    const value = await fetchFlag(id); // cache miss: fetch once
    cache.set(id, value);
    return value;
  };

  this.subscribe = function (idOrCallback, callback) {
    // subscribe(fn) -> listen to ALL flags
    if (typeof idOrCallback === "function") {
      globalListeners.add(idOrCallback);
      return () => globalListeners.delete(idOrCallback);
    }
    // subscribe(id, fn) -> listen to ONE flag
    if (!listeners.has(idOrCallback)) listeners.set(idOrCallback, new Set());
    const callbacks = listeners.get(idOrCallback);
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  this.updateFlag = function (id, newValue) {
    const oldValue = cache.get(id);
    if (cache.has(id) && oldValue === newValue) return; // no change, no noise

    cache.set(id, newValue);

    listeners.get(id)?.forEach((cb) => cb(newValue, oldValue));
    globalListeners.forEach((cb) =>
      cb({ id, value: newValue, previousValue: oldValue })
    );
  };
}

// ---------- Version 2: class ----------
class FeatureFlagStoreClass {
  #fetchFlag;
  #cache = new Map();
  #listeners = new Map();
  #globalListeners = new Set();

  constructor(fetchFlag) {
    this.#fetchFlag = fetchFlag;
  }

  async getFlag(id) {
    if (this.#cache.has(id)) return this.#cache.get(id);
    const value = await this.#fetchFlag(id);
    this.#cache.set(id, value);
    return value;
  }

  subscribe(idOrCallback, callback) {
    if (typeof idOrCallback === "function") {
      this.#globalListeners.add(idOrCallback);
      return () => this.#globalListeners.delete(idOrCallback);
    }
    if (!this.#listeners.has(idOrCallback)) {
      this.#listeners.set(idOrCallback, new Set());
    }
    const callbacks = this.#listeners.get(idOrCallback);
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  }

  updateFlag(id, newValue) {
    const oldValue = this.#cache.get(id);
    if (this.#cache.has(id) && oldValue === newValue) return;

    this.#cache.set(id, newValue);

    this.#listeners.get(id)?.forEach((cb) => cb(newValue, oldValue));
    this.#globalListeners.forEach((cb) =>
      cb({ id, value: newValue, previousValue: oldValue })
    );
  }
}

// ---------- Demo / check (runs against both versions) ----------
async function demo(Store, label) {
  let fetches = 0;
  const store = new Store(async (id) => {
    fetches++;
    return id === "darkMode";
  });

  const one = [];
  const all = [];
  const unsubOne = store.subscribe("darkMode", (v, prev) => one.push([prev, v]));
  const unsubAll = store.subscribe((change) => all.push(change));

  // caching: second read must not fetch again
  console.assert((await store.getFlag("darkMode")) === true);
  console.assert((await store.getFlag("darkMode")) === true);
  console.assert(fetches === 1, "cache hit should not fetch");

  store.updateFlag("darkMode", true); // same value -> ignored
  console.assert(one.length === 0 && all.length === 0, "same value must not notify");

  store.updateFlag("darkMode", false); // changed value
  store.updateFlag("newCheckout", true); // other flag
  console.assert(one.length === 1, "specific listener only hears darkMode");
  console.assert(all.length === 2, "global listener hears every flag");
  console.assert(all[1].previousValue === undefined);

  unsubAll();
  unsubOne();
  store.updateFlag("darkMode", true);
  console.assert(one.length === 1 && all.length === 2, "unsubscribed = silent");

  console.log(label, "ok", { fetches, one, all });
}

(async () => {
  await demo(FeatureFlagStore, "function:");
  await demo(FeatureFlagStoreClass, "class:   ");
})();
