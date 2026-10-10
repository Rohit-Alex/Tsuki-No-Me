# Cookie Consent SDK — Notifying Dependent Services

## 1. Problem Statement

Our `CookieConsentManager` stores and manages user consent preferences. However, other services such as analytics and marketing must know when those preferences change.

For example, if a user revokes analytics consent, the analytics integration must stop tracking.

The consent manager should notify dependent services without being tightly coupled to specific integrations.

**Goal:** Design a mechanism that propagates consent changes, supports multiple subscribers, and allows services to clean up their subscriptions.

---

## 2. Approaches Considered

### Approach 1: Observer Pattern — `subscribe()` / `unsubscribe()`

The consent manager maintains a collection of listeners. Services subscribe to consent updates and receive the latest consent snapshot.

```ts
const unsubscribe = manager.subscribe((consent) => {
  if (consent.categories.analytics) {
    startAnalytics();
  } else {
    stopAnalytics();
  }
});

// When the service is disposed:
unsubscribe();
```

**Advantages**
- Services receive consent updates promptly.
- The manager does not need to know which services are listening.
- Multiple services can subscribe independently.
- Unsubscription provides a clear cleanup mechanism.
- Easy to implement and test without an external dependency.

**Trade-offs**
- Listeners must unsubscribe when no longer needed.
- Listener errors should not prevent other subscribers from being notified.
- Subscribers must receive defensive copies to prevent mutation of internal state.
- The SDK must define whether new subscribers receive the current state immediately.
- Cross-tab changes require a separate synchronization mechanism.

**Decision:** Selected as the primary mechanism for our SDK.

### Approach 2: Event Emitter / Publish-Subscribe (Pub/Sub)

The manager publishes named events, such as `consent:changed`, and services subscribe to those events.

```ts
manager.on("consent:changed", ({ consent }) => {
  // React to the new consent state.
});
```

**Advantages**
- Supports multiple event types.
- Keeps publishers and subscribers loosely coupled.
- Can be extended with events such as `consent:initialized` or `consent:reset`.

**Trade-offs**
- Requires event registration, dispatch, and cleanup logic.
- May introduce unnecessary abstraction when the SDK only needs a small number of events.

**Decision:** Not selected separately because a simple subscription API is sufficient for the current requirements. Observer and Pub/Sub concepts overlap, although Pub/Sub commonly emphasizes named events.

### Approach 3: Native Browser Events — `EventTarget` / `CustomEvent`

The manager can dispatch a browser event whenever consent changes.

```ts
manager.addEventListener("consentchange", handler);

// Cleanup:
manager.removeEventListener("consentchange", handler);
```

**Advantages**
- Uses standard browser APIs.
- Familiar `addEventListener()` and `removeEventListener()` semantics.
- Integrates naturally with browser-oriented code.

**Trade-offs**
- More browser-specific unless server-side environments are handled explicitly.
- Event payloads still need defensive copies.
- Does not automatically synchronize separate tabs.

**Decision:** A valid alternative, but a custom subscription API gives us direct control over the SDK's contract.

### Approach 4: Category-Specific Callbacks

Services subscribe to changes for a specific category.

```ts
manager.onConsentChange("analytics", (allowed) => {
  if (allowed) {
    startAnalytics();
  } else {
    stopAnalytics();
  }
});
```

**Advantages**
- Services receive only the updates relevant to them.
- Avoids unnecessary callbacks when unrelated categories change.

**Trade-offs**
- Requires category-specific listener management.
- Adds complexity to the public API and implementation.
- Requires logic to compare previous and updated category values.

**Decision:** Deferred until the SDK supports enough categories or integrations to justify the additional complexity.

### Approach 5: Polling

Services periodically check the current consent state.

```ts
const intervalId = setInterval(() => {
  const allowed = manager.hasConsent("analytics");
  // Compare with the previous value and react if changed.
}, 1000);
```

**Advantages**
- Simple conceptually.
- Can be useful when the underlying state source has no notification mechanism.

**Trade-offs**
- Changes are detected only after the next polling interval.
- Repeated checks waste work when nothing changes.
- Timers require cleanup.
- Delayed reaction is undesirable when consent is revoked.

**Decision:** Rejected because consent changes should be propagated promptly.

### Approach 6: React Integration — `useSyncExternalStore`

A React adapter can subscribe to the manager and update components when consent changes.

```tsx
const consent = useConsent(manager);
```

**Advantages**
- Useful for consent banners, settings pages, and React UI.
- Integrates with React's external-store subscription mechanism.

**Trade-offs**
- React-specific and should not be required by the core SDK.
- Re-rendering the UI does not automatically stop analytics or marketing integrations.

**Decision:** Can be implemented as an optional React adapter on top of the framework-independent SDK.

### Approach 7: Cross-Tab Synchronization

The browser's `storage` event or `BroadcastChannel` can communicate consent changes between tabs.

**Advantages**
- Allows other tabs to respond when consent changes elsewhere.
- Helps prevent one tab from continuing to use stale consent state.

**Trade-offs**
- Requires message validation, synchronization, cleanup, and conflict handling.
- Separate from notifying listeners within a single manager instance.
- Storage-event behavior differs between `localStorage` and `sessionStorage`.

**Decision:** Deferred as an additional feature if cross-tab synchronization is required.

---

## 3. Final Decision: `subscribe()` / `unsubscribe()`

We selected a lightweight, observer-style subscription API for the SDK core.

### API Contract

- `subscribe(listener)` registers a listener.
- The listener immediately receives the current consent snapshot.
- Future consent changes notify active listeners.
- `subscribe()` returns an `unsubscribe()` function.
- Each subscriber receives a defensive copy of the consent state.
- An error in one listener must not prevent other listeners from receiving updates.

### Why Notify Immediately on Subscription?

Consider this sequence:

1. The user grants analytics consent.
2. The analytics integration initializes afterward.
3. The analytics integration subscribes to consent changes.

If subscriptions only receive future changes, analytics would not know that consent had already been granted. It would wait until another consent change occurred.

By immediately delivering the current snapshot, the same callback handles both initial synchronization and future updates.

### Why Return an Unsubscribe Function?

The subscriber owns the lifecycle of its subscription.

When a service is disposed, replaced, or no longer needed, it can unsubscribe explicitly. This prevents stale callbacks and helps avoid memory leaks.

```ts
const unsubscribe = manager.subscribe(handleConsentChange);

// Later:
unsubscribe();
```

---

## 4. Expected Notification Flow

1. The application initializes the `CookieConsentManager`.
2. A service subscribes to consent updates.
3. The service immediately receives the current consent snapshot.
4. The service enables or disables its functionality according to consent.
5. The user changes their consent preferences.
6. The manager validates and updates its in-memory state.
7. The manager attempts to persist the updated consent and notifies subscribers.
8. Each service responds to the new consent state.
9. When a service is disposed, it calls its `unsubscribe()` function.

**Important:** A persistence failure should not prevent active services from responding to an in-memory consent change. However, the failure should be observable because the updated consent may not survive a page reload.

---

## 5. Application Usage Example

```ts
// Initialize the SDK twice.
const manager1 = CookieConsentManager.init();
const manager2 = CookieConsentManager.init();

console.log(manager1 === manager2); // true: same singleton

// Subscribe to consent updates.
const unsubscribe = manager1.subscribe((consent) => {
  if (consent.categories.analytics) {
    startAnalytics();
  } else {
    stopAnalytics();
  }
});

// Change consent through either reference.
manager2.acceptAll();
manager1.updateConsent({ analytics: false });

// Stop receiving updates when the integration is disposed.
unsubscribe();
```

`startAnalytics()` and `stopAnalytics()` represent integration-specific functions. They should be designed to handle repeated calls safely and clean up active tracking when consent is revoked.

---

## 6. Important Implementation Considerations

### State and notification order

Update the manager's in-memory state before notifying subscribers. Subscribers should always receive the latest state.

### Defensive copies

Never expose the manager's internal consent object directly. Pass a copy of the object and its nested `categories` object to prevent accidental mutation.

### Listener error isolation

Wrap listener execution so one failing integration does not prevent the remaining listeners from being notified.

### Re-entrant updates

A listener might trigger another consent update while notifications are running. A production implementation should define how nested updates are handled; a queued notification strategy can help maintain predictable ordering.

### Consent revocation

Notification alone is insufficient. Each integration must stop future tracking and handle active timers, queued events, and other collection mechanisms when consent is revoked.

### Initial consent gating

Optional trackers must not initialize before consent is granted. The SDK should provide a reliable way for integrations to check the current consent state before starting.

### Cross-tab updates

The in-memory subscription API only notifies listeners attached to the same manager instance. Use `BroadcastChannel` or an appropriate storage-event strategy if cross-tab synchronization is required.

---

## 7. Summary

We chose `subscribe()` / `unsubscribe()` because it provides a simple, framework-independent mechanism for propagating consent changes while keeping the consent manager decoupled from individual services.

The immediate initial snapshot ensures that late-initializing services receive the current consent state. Future notifications keep active services synchronized, and the unsubscribe function provides explicit lifecycle cleanup.

More advanced features—category-specific subscriptions, React integration, and cross-tab synchronization—can be added later without changing the core responsibility of the consent manager.