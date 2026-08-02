# Module 8 — State Management

> Part of the [React Mastery course](./README.md). Previous: [Module 7 — Rendering Patterns](./Module07-Rendering.md). Next: [Module 9 — Performance](./Module09-Performance.md).

Most "state management" problems aren't solved by picking a library. They're solved by **putting state in the right place** and **noticing that half of it isn't really state at all.**

This module goes in that order: structure it well → keep it local → lift it → share it → and only then reach for a store.

Outputs below come from running React in Node. Scripts in [verify/](./verify/).

---

## 1. First: is it even state?

Before choosing where state lives, delete the state you don't need. React gives five rules for structuring it.

### 1. Group state that changes together

```jsx
const [x, setX] = useState(0);           // ❌ two things that always move together
const [y, setY] = useState(0);

const [pos, setPos] = useState({x: 0, y: 0});   // ✅ one thing
```

### 2. Don't allow impossible states

```jsx
const [isSending, setIsSending] = useState(false);   // ❌ both can be true at once
const [isSent, setIsSent] = useState(false);

const [status, setStatus] = useState('typing');      // ✅ 'typing' | 'sending' | 'sent'
const isSending = status === 'sending';
```

If two booleans can contradict each other, one day they will.

### 3. Don't store what you can calculate

```jsx
const [fullName, setFullName] = useState('');        // ❌ can drift
const fullName = firstName + ' ' + lastName;         // ✅ always right
```

### 4. Don't duplicate — store the id

```jsx
const [selectedItem, setSelectedItem] = useState(items[0]);   // ❌ a stale copy

const [selectedId, setSelectedId] = useState(0);              // ✅
const selectedItem = items.find(i => i.id === selectedId);
```

Edit the item in `items` and the ❌ version still shows the old object. It's a photocopy that never updates.

### 5. Flatten deep nesting

Updating `a.b.c.d` immutably means rebuilding the whole chain. Normalise it like a database table:

```jsx
{ 0: {id: 0, childIds: [1, 2]}, 1: {id: 1, childIds: []} }
```

**Analogy:** treat state like a **database**, not a filing cabinet full of photocopies. Store each fact once, reference it by id, and derive everything else. Photocopies go out of date the moment the original changes — which is exactly what a stale `selectedItem` is.

> React's summary: *"Make your state as simple as it can be — but no simpler."*

📚 [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)

---

## 2. The ladder — always climb from the bottom

```
1. Local state           useState / useReducer          ← start here, always
        ↓  two siblings need it
2. Lift it up            move to nearest common parent
        ↓  too much prop drilling
3. Composition           pass elements as children      ← try before context
        ↓  genuinely global, rarely changes
4. Context               theme, user, locale
        ↓  changes often, many consumers, need selectors
5. External store        Zustand, Redux, Jotai
```

**Most apps never need step 5.** The mistake is starting at 5 because the app "might get big."

**Analogy:** don't install a **public address system** because two people at the same desk need to talk. Speak to them (local state). If they're in different rooms, use the corridor (lift it up). The PA system is for announcements the whole building needs — and it interrupts everyone every time you use it.

---

## 3. Steps 1–3: local, lifted, composed

**Local** — the default. State lives in the component that uses it. Nothing else can break it.

**Lifted** — two components need the same value, so it moves to their nearest common parent and comes back down as props:

```jsx
function Parent() {
  const [query, setQuery] = useState('');       // one owner
  return (
    <>
      <SearchBar query={query} onChange={setQuery} />
      <Results query={query} />
    </>
  );
}
```

**Composition** — covered in Module 5 §5. If the only problem is prop drilling through components that don't use the data, pass the *finished element* instead of the data. That removes the drilling without introducing global state at all.

---

## 4. Step 4: Context — and its one real weakness

Context solves *distribution*, not *state*. It has no store of its own — it just carries a value down the tree.

**The weakness: context has no selectors.** Every consumer re-renders when the value changes, even if it only reads one field.

Verified — one context holding `{ user, theme }`, then two theme changes ([`store.cjs`](./verify/store.cjs)):

```
=== A. ONE context holding {user, theme} ===
  after 2 THEME changes -> userReader re-rendered 2x  (it doesn't use theme!)
```

The component that only cares about `user` re-rendered both times, because the *object* changed.

### Fix 1 — split by what changes

```
=== B. SPLIT contexts ===
  after 2 THEME changes -> userReader 0x, themeReader 2x
```

Two changes, **zero** wasted renders. Same data, split into `UserContext` and `ThemeContext`:

```jsx
<UserContext.Provider value={user}>
  <ThemeContext.Provider value={theme}>
    {children}
  </ThemeContext.Provider>
</UserContext.Provider>
```

**Split contexts by how often they change.** A value that changes every keystroke should never share a context with one that changes twice a session.

### Fix 2 — split state from dispatch

React's own recommended pattern for scaling with `useReducer`:

```jsx
export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

<TasksContext.Provider value={tasks}>
  <TasksDispatchContext.Provider value={dispatch}>
    {children}
  </TasksDispatchContext.Provider>
</TasksContext.Provider>
```

`dispatch` is **stable forever** — it never changes identity. So components that only dispatch (a delete button, an add form) subscribe to a context that never updates, and never re-render when the data changes.

Wrap them in hooks so components don't touch context directly:

```jsx
export function useTasks()         { return useContext(TasksContext); }
export function useTasksDispatch() { return useContext(TasksDispatchContext); }
```

📚 [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

---

## 5. Step 5: external stores

Splitting contexts works until you have twelve of them. At that point you want **selectors** — subscribing to a *slice* rather than a whole value.

Verified, same test with an external store ([`store.cjs`](./verify/store.cjs)):

```
=== C. External store + useSyncExternalStore (selector) ===
  after 2 THEME changes -> user subscriber 0x, theme subscriber 2x
```

Identical result to split contexts — but you get it from **one** store with selectors, instead of manually splitting providers.

```jsx
// Zustand
const useStore = create(set => ({
  user: null, theme: 'light',
  setTheme: t => set({ theme: t }),
}));

const theme = useStore(s => s.theme);   // ← subscribes to this slice only
```

**Analogy:** context is a **group chat** — every message notifies everyone. A store with selectors is **following specific topics** — you're only pinged for the ones you subscribed to.

### `useSyncExternalStore` — the bridge

Every store library uses this hook under the hood:

```jsx
const value = useSyncExternalStore(store.subscribe, store.getSnapshot);
```

Verified working ([`tearing.cjs`](./verify/tearing.cjs)):

```
initial          : sync:0
after store.set  : sync:42  <- component re-rendered from an EXTERNAL source
```

**Why it exists — tearing.** From Module 3, rendering is interruptible. React can render half the tree, pause, and resume. If a store changes during that pause, the second half reads a *newer* value than the first — one commit showing two different truths. That's tearing. `useSyncExternalStore` makes React re-read and stay consistent.

> This is why you can't just use `useState` + a module variable and call it a store. Under concurrent rendering it can tear.

### Redux middleware — thunk and saga

Middleware sits between dispatching an action and the reducer receiving it. It's how Redux handles side effects, since reducers must stay pure.

```
dispatch(action)  →  middleware  →  middleware  →  reducer  →  new state
```

**Redux Thunk** — dispatch a *function* instead of an action object:

```js
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'user/loading' });
  const user = await api.getUser(id);
  dispatch({ type: 'user/loaded', payload: user });
};
```

Simple, and enough for most apps. Bundled with Redux Toolkit by default.

**Redux Saga** — side effects as generator functions, a declarative way to express complex async flows:

```js
function* fetchUserSaga(action) {
  yield put({ type: 'user/loading' });
  const user = yield call(api.getUser, action.id);
  yield put({ type: 'user/loaded', payload: user });
}
```

Worth the extra concepts only for genuinely complex orchestration — cancellation, debouncing, racing requests, retries, long-running background tasks. For ordinary "fetch and store," thunk is less machinery, and a query library (§6) is usually better than either.

**Interview framing:** thunk is *imperative* async; saga is *declarative* async built on generators. Saga is far more testable — you assert on the yielded effects with no mocking — at the cost of a steeper learning curve.

### Picking a library

| | Use when |
|---|---|
| **Zustand** | Small API, hooks-native, selectors built in. Good default. |
| **Redux Toolkit** | Large teams, strict conventions, time-travel debugging, complex middleware. |
| **Jotai / Recoil** | Atomic state — lots of small independent pieces. |
| **XState** | Genuine state machines — complex flows with impossible-state prevention. |

Redux's reputation for boilerplate is mostly pre-Toolkit. Modern RTK is far lighter than the 2018 version people remember.

---

## 6. The split that matters most: server state ≠ client state

Most "we need Redux" moments are actually **server data being managed by hand.**

```jsx
// ❌ what people write — and it's already missing half the problem
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/todos')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

That's three state variables per request, and it still doesn't handle: caching, refetch on focus, deduplicating two components requesting the same thing, retries, pagination, stale-while-revalidate, or cancelling on unmount.

```jsx
// ✅ TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
});
```

**The distinction:**

| | Client state | Server state |
|---|---|---|
| Owner | Your app | The server |
| Examples | Modal open, form draft, theme | Users, orders, products |
| Can go stale | No | **Yes, constantly** |
| Needs caching | No | Yes |
| Tool | `useState`, Zustand | TanStack Query, SWR, RTK Query |

**Analogy:** client state is **your own notebook** — you're the only author, it's never out of date. Server state is a **cached copy of someone else's notebook** — they keep editing theirs, so yours is a guess that needs refreshing. Treating a borrowed copy as if you owned it is the root of most stale-data bugs.

**Practical effect:** move server data into a query library and the amount of global state left over is usually small enough that `useState` plus a little context handles all of it.

---

## 7. Interview Questions

### Basic

**Q: When do you lift state up?**
When two or more components need the same value. It moves to their nearest common parent, which owns it and passes it down.

**Q: `useState` vs `useReducer`?**
`useState` for independent values. `useReducer` when several pieces change together, or when update logic is complex enough to want testing in isolation — a reducer is a pure function.

**Q: Is Context a state management library?**
No. It's a *distribution* mechanism — it carries a value down the tree without prop drilling. The state still lives in `useState` or `useReducer` somewhere above.

### Intermediate

**Q: Why does Context cause performance problems?**
No selectors — every consumer re-renders when the value changes, even if it reads one unrelated field. Verified: a `user`-only component re-rendered on both theme changes. Fixes are splitting contexts by change frequency, and splitting state from dispatch.

**Q: Why split state and dispatch into two contexts?**
`dispatch` never changes identity. Components that only dispatch subscribe to a context that never updates, so they never re-render when data changes.

**Q: How do you avoid duplicated state?**
Store an id, not a copy. `selectedId` plus a lookup always reflects the latest data; a stored `selectedItem` object goes stale the moment the original is edited.

**Q: Do you still need Redux?**
Usually not. Move server data to a query library and most remaining global state fits in `useState` plus context. Reach for a store when you have genuinely global, frequently-changing client state with many consumers.

### Senior

**Q: What is tearing and which hook prevents it?**
Tearing is one commit showing two different truths for what should be a single consistent value. It's only possible because rendering is interruptible (Module 3 §5): React can render `Header`, pause to let the browser breathe, and resume later to render `Sidebar`. If a value **outside** React's own state changes during that pause, `Header` and `Sidebar` end up rendering from two different moments in time, even though the user experiences it as one update.

```jsx
let theme = 'light';                          // ❌ a plain module variable
function Header()  { return <span>{theme}</span>; }
function Sidebar() { return <span>{theme}</span>; }
```

If `theme` flips to `'dark'` in the gap between `Header`'s render and `Sidebar`'s, they disagree — and nothing in React's own state tracking would have caught it, because `theme` was never state React manages. This is exactly why "just use a module variable plus `useState` to force updates" isn't a safe store under concurrent rendering, even though it works fine under the old, always-synchronous render model.

`useSyncExternalStore(subscribe, getSnapshot)` closes the gap by making React re-check `getSnapshot()` right before committing and, if it detects the value changed mid-render, discarding that render and redoing it synchronously — guaranteeing every component in one commit saw the same snapshot. Every mainstream store library (Redux, Zustand, Jotai) uses this hook internally for exactly this reason, which is why hand-rolling a store with `useState` and a shared variable is a trap: it looks correct in every manual test, and only tears under real concurrent scheduling, which is hard to reproduce and easy to ship.

**Q: Server state vs client state — why does the distinction matter?**
The distinction is about **who is authoritative**, and that single fact determines an entire list of problems one kind of state has and the other doesn't. Client state — a modal's open flag, a form draft, a theme toggle — is authored entirely by your app; whatever `useState` holds *is* the truth, permanently, until you change it again. Server state — a list of orders, another user's profile — is a snapshot of a fact someone else owns and can change at any moment without telling you (§6's "cached copy of someone else's notebook").

```jsx
// ❌ treats server data like client data — three variables, none of the real problems solved
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
useEffect(() => { fetch('/api/todos').then(r => r.json()).then(setData)...}, []);
```

That code compiles, works in a demo, and quietly omits caching (refetching the same data on every mount), deduplication (two components fetching the same URL simultaneously), revalidation (the data going stale the moment the tab loses and regains focus), retries, and race conditions if the component unmounts mid-request. None of these are edge cases — they're the *normal* behavior of data you don't own, and `useState` has no opinion about any of them because it was designed for data you do own.

This is why "we need Redux" is so often a misdiagnosis: the actual problem was never "sharing client state globally," it was "server data is being managed as if it were client data." Swapping in TanStack Query or SWR doesn't add features so much as it correctly names the problem — and once server state moves out, what's left over is usually small enough that `useState` plus a little context was always going to be sufficient for it (§6, "Practical effect").

**Q: How would you decide between context and a store?**
Two variables decide it: how often the value changes, and how many consumers only care about *part* of it. Context has exactly one lever to pull when performance suffers — split the value into more providers (§4) — and that lever has no cost when changes are rare, because "every consumer re-renders" is cheap if it almost never happens.

```
Rarely changes, most consumers read all of it     →  Context is fine (theme, locale, user)
Changes often, consumers only need one slice each →  Context forces a rewrite per slice
```

The mechanical reason a store wins for the second case: context has no selectors (§4, verified — a `user`-only reader re-rendered on every `theme` change in a combined context). The only fix is splitting into more contexts, one per thing that changes independently. That works fine for two or three, but a dozen frequently-changing values means a dozen providers, each requiring you to have correctly guessed the boundaries in advance — and every new field is a design decision about which provider it belongs in.

An external store with selectors (§5 — Zustand, Redux, Jotai) sidesteps the whole problem: one store, and each component names exactly the slice it reads (`useStore(s => s.theme)`), verified to produce the same zero-wasted-render result as manually splitting providers, without you having to pre-partition the state into separate contexts. The rule of thumb: reach for a store the moment you'd need to keep splitting contexts to chase re-renders — that's the signal you've outgrown "distribution" (what context does) and actually need "subscription" (what a store does).

**Q: How do you structure state to prevent bugs by design?**
The underlying idea is the same one Module 1 used to explain why React exists at all: turn a class of bug into something that can't be represented, rather than something you promise to avoid. Applied to state shape, that's §1's five rules, and each one removes a specific way state can silently disagree with itself.

**Make impossible combinations unrepresentable.** Two independent booleans can produce states that make no sense:

```jsx
const [isSending, setIsSending] = useState(false);   // ❌ both true at once is meaningless,
const [isSent, setIsSent] = useState(false);          //    but nothing stops it happening

const [status, setStatus] = useState('typing');      // ✅ 'typing' | 'sending' | 'sent' — only one at a time, by construction
```

With two booleans, "sending AND sent" is a state the type system happily allows and your UI has to defend against. With one enum, that combination doesn't exist as a value — there's nothing to defend against, because it was never representable.

**Derive instead of storing.** A `fullName` field stored alongside `firstName`/`lastName` can drift the moment one changes and you forget to update the other; computing it during render means there's only ever one thing to keep in sync.

**Store the id, not the object.** A `selectedItem` object is a snapshot that goes stale the instant the underlying data changes elsewhere; a `selectedId` plus a lookup is always current, because it re-reads the live data every render (§1, rule 4).

**Normalize nested data.** Deeply nested state means an update has to rebuild an entire chain of parent objects immutably — easy to get subtly wrong. Flattened, keyed-by-id state (§1, rule 5) means an update touches exactly one record.

All four are the same move: don't let two things claim to represent one fact. Where there's one source of truth, drift is structurally impossible — not something you have to remember to prevent.

---

## 8. Common Mistakes

- ❌ Reaching for Redux on day one "in case it gets big."
- ❌ Storing derived values — they drift. Calculate during render.
- ❌ Storing a whole object when an id would do — the copy goes stale.
- ❌ Multiple booleans that can contradict each other. Use one status field.
- ❌ One giant context holding everything. *(Verified: 2 wasted renders in a 2-field context.)*
- ❌ Putting a fresh object in a context value without `useMemo`.
- ❌ Managing server data with `useState` + `useEffect` — no caching, dedup, or revalidation.
- ❌ A module variable as a store without `useSyncExternalStore` — it can tear.
- ❌ Global state for something one component uses.

---

## 9. Official Documentation References

- [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure) · [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)
- [`useReducer`](https://react.dev/reference/react/useReducer) · [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)
- [TanStack Query](https://tanstack.com/query/latest) · [Zustand](https://zustand.docs.pmnd.rs/) · [Redux Toolkit](https://redux-toolkit.js.org/)

---

## 10. Revision Notes

1. **Fix the structure first.** Group related state, ban impossible states, derive instead of storing, store ids not copies, flatten nesting.
2. **Climb the ladder:** local → lift → compose → context → store. Most apps stop at 3 or 4.
3. **Context distributes, it doesn't store.** The state still lives in `useState`/`useReducer`.
4. **Context has no selectors** — every consumer re-renders. *(Verified: 2 wasted renders.)*
5. **Split contexts by change frequency** → 0 wasted renders. *(Verified.)*
6. **Split state from dispatch** — `dispatch` is stable, so dispatch-only components never re-render.
7. **Stores give selectors** — subscribe to a slice. *(Verified: same 0 wasted renders from one store.)*
8. **`useSyncExternalStore` prevents tearing** — concurrent rendering can otherwise show two truths in one commit.
9. **Server state ≠ client state.** Server data needs caching and revalidation; use a query library.
10. Most "we need Redux" is really "we need TanStack Query."

**Soundbites**
- "Treat state like a database, not a drawer of photocopies."
- "Context distributes state; it doesn't manage it."
- "Context is a group chat; a store with selectors is following topics."
- "Server state is a cached copy of someone else's notebook."
- "Make impossible states unrepresentable."

---

## 11. Practice Exercises

**1 — Delete state.** Find a component with 4+ `useState` calls. Remove every value that can be derived, and merge any that always change together. Count what's left.

**2 — Kill the impossible states.** Take a form with `isLoading`, `isError`, `isSuccess` booleans. Replace with one `status` enum and list the combinations that were previously possible but meaningless.

**3 — Feel the context problem.** Build a context holding `{user, theme}`, log renders in a user-only component, and change the theme twice. Then split the contexts and watch the count drop to zero.

**4 — Stable dispatch.** Build a todo app with `useReducer` + two contexts. Confirm an add-button component that only dispatches doesn't re-render when the list changes.

**5 — Store the id.** Build a list with a selected item stored as an *object*. Edit that item and watch the selection show stale data. Switch to storing the id.

**6 — Replace the fetch trio.** Take a `data`/`loading`/`error` + `useEffect` component and convert it to TanStack Query. Note what you got for free: caching, dedup, refetch on focus.

**7 — Interview rehearsal.** 2 minutes: *"How do you decide where state lives?"* Walk the ladder, and say what forces each step.

---

**Next:** [Module 9 — Performance](./Module09-Performance.md) — memoization measured, virtualization, profiling, render waterfalls.
