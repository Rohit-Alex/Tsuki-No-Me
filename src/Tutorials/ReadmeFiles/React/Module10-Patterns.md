# Module 10 — Patterns

> Part of the [React Mastery course](./README.md). Previous: [Module 9 — Performance](./Module09-Performance.md). Next: [Module 11 — React 16 → 19](./Module11-VersionHistory.md).

Patterns are answers to one recurring question: **how do you share behaviour between components without copy-pasting it?**

React has answered that question three different ways over the years. Two of those answers are now history — but you still need to recognise them, because interviewers ask and old codebases are full of them.

Outputs verified by running React in Node. Scripts in [verify/](./verify/).

---

## 1. The problem every pattern solves

You have a dropdown. Then a modal, a tooltip, and an autocomplete. All four need: open/closed state, close-on-outside-click, close-on-Escape, and focus management.

Copy-paste it four times and you'll fix the same bug four times.

The history of React patterns is four attempts at avoiding that:

```
2015  Mixins            → removed, name collisions
2016  HOCs              → wrapper hell
2017  Render props      → nesting pyramids
2019  Custom hooks      → current answer
```

**Analogy:** it's the same story as **power tools**. Mixins were a machine that welded extra parts onto yours — if two welded the same spot, neither worked. HOCs were putting your tool inside a bigger tool, then inside another, until you couldn't see the original. Render props let you pass a shape *into* the tool, but stacking them got unwieldy. Hooks are just **attachments you clip on** — take what you need, no wrapping.

---

## 2. Custom hooks — the default answer

Covered in Module 6 §9; here's why it wins as a *pattern*.

```jsx
function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open   = useCallback(() => setIsOpen(true), []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(o => !o), []);
  return { isOpen, open, close, toggle };
}

function Modal()    { const { isOpen, close } = useDisclosure(); /* ... */ }
function Dropdown() { const { isOpen, toggle } = useDisclosure(); /* ... */ }
```

No wrapper components, no extra tree depth, no name collisions, and it composes — a hook can call other hooks.

**When a hook isn't enough:** hooks share *logic*, not *markup*. If components also need shared structure (a `<Tabs>` with a `<TabList>` and `<TabPanels>`), you need one of the composition patterns below.

---

## 3. Compound components

For a component with **parts that belong together** — tabs, accordions, selects, menus.

```jsx
<Tabs defaultTab="profile">
  <Tabs.List>
    <Tabs.Tab id="profile">Profile</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="profile">Profile content</Tabs.Panel>
</Tabs>
```

The user controls layout and markup; the parent owns the shared state. Compare with the configuration-object alternative:

```jsx
<Tabs tabs={[{id: 'profile', label: 'Profile', content: <Profile/>}]} />  // ❌ rigid
```

Every new requirement — an icon, a badge, a disabled tab, a custom separator — becomes another prop. Compound components push that back to the caller.

**Analogy:** a config-object component is a **vending machine** — fixed slots, and if you want something not on the menu, tough. Compound components are **LEGO** — you get the pieces and build what you need.

### Build it with Context, not `cloneElement`

Most tutorials teach compound components using `Children.map` + `cloneElement` to inject props. **React explicitly discourages this**, and there's a concrete reason.

Verified ([`patterns.cjs`](./verify/patterns.cjs)):

```
=== cloneElement version ===
  direct children  : A* B     (A is active — works)
  wrapped children : A* C D   <- C and D got NOTHING

=== Context version ===
  nested children  : A C D*   <- C IS active, even nested
```

The moment a child is wrapped in another component, `cloneElement` can't reach it. `Children.count` reports 2 while 3 tabs render, because it only sees **direct JSX children** — it cannot look inside `<MoreTabs />`.

> React's docs: *"Using `Children` is uncommon and can lead to fragile code"* and *"Cloning children makes it hard to tell how the data flows through your app."*

The context version:

```jsx
const TabsContext = createContext(null);

function Tabs({ children, defaultTab }) {
  const [active, setActive] = useState(defaultTab);
  const value = useMemo(() => ({ active, setActive }), [active]);
  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

function Tab({ id, children }) {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  );
}

Tabs.List = TabList;
Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
```

Works at any nesting depth, and the data flow is explicit — each part *asks* for what it needs.

---

## 4. Render props

Pass a **function** that returns JSX, so the component supplies data and the caller supplies markup.

```jsx
<DataFetcher url="/api/user">
  {({ data, loading, error }) => {
    if (loading) return <Spinner />;
    if (error) return <Error error={error} />;
    return <Profile user={data} />;
  }}
</DataFetcher>
```

**Mostly replaced by custom hooks** — a hook does the same job with less ceremony:

```jsx
const { data, loading, error } = useFetch('/api/user');   // ✅ no nesting
```

**But render props aren't dead.** They're still the right tool when the component needs to control *where and how often* the function runs:

```jsx
<List
  items={products}
  renderItem={(product, isHighlighted) => (
    <Row title={product.title} isHighlighted={isHighlighted} />
  )}
/>
```

`List` owns the loop and the highlight state; the caller owns the row markup. A hook can't do that — hooks return values, they don't render.

This is also React's **recommended replacement for `cloneElement`**.

⚠️ **The nesting pyramid** is why they fell out of favour:

```jsx
<Mouse>{mouse =>
  <Theme>{theme =>
    <Auth>{user =>            // ❌ three levels deep, and it's just data
      <Thing mouse={mouse} theme={theme} user={user} />
    }</Auth>
  }</Theme>
}</Mouse>
```

Three hooks, three lines, no nesting.

---

## 5. Higher-Order Components (legacy)

A function that takes a component and returns a wrapped component.

```jsx
function withAuth(Component) {
  return function WithAuth(props) {
    const user = useUser();
    if (!user) return <Login />;
    return <Component {...props} user={user} />;
  };
}

export default withAuth(Dashboard);
```

**Recognise them, don't write them.** You'll see `connect()` (Redux), `withRouter()`, `withStyles()` in older code.

Three problems that killed them:

**1. Wrapper hell.** DevTools shows five layers that render nothing.

```jsx
withRouter(connect(mapState)(withStyles(styles)(MyComponent)))
```

**2. Prop collisions.** Two HOCs both inject `data` — the outer one silently wins. No error, no warning.

**3. Unclear origin.** Where did `user` come from? You must read every HOC in the chain to find out.

**Analogy:** an HOC is **gift wrapping**. One layer is fine. Five layers and you can't tell what's inside, and if two wrappers each stick a label saying "fragile," only one is visible.

Hooks fix all three: no wrapper, explicit naming at the call site, and you can see exactly where each value came from.

---

## 6. Headless components

Separate **behaviour** from **appearance**. The library ships logic, state, and accessibility; you ship every pixel.

```jsx
// Headless: no markup opinions at all
const { getInputProps, getMenuProps, getItemProps, isOpen } = useCombobox({ items });

<input {...getInputProps()} className="my-own-styles" />
<ul {...getMenuProps()}>
  {isOpen && items.map((item, i) => (
    <li key={item.id} {...getItemProps({ item, index: i })}>{item.name}</li>
  ))}
</ul>
```

This is what Radix, Headless UI, TanStack Table, and Downshift do.

**Why it's the dominant library pattern now:** styled component libraries lose every fight with design systems. You end up overriding CSS, fighting specificity, or forking. Headless gives you the hard parts — keyboard nav, ARIA attributes, focus traps, screen reader announcements — and none of the opinions.

**Analogy:** a styled component library is a **furnished flat** — move-in ready, but you're living with someone else's sofa. Headless is an **unfurnished flat with the plumbing and wiring done**. The parts you can't easily do yourself are handled; everything visible is yours.

---

## 7. Controlled / uncontrolled and the state reducer

Any reusable component should support **both** modes (Module 5 §4):

```jsx
function Toggle({ value, defaultValue = false, onChange }) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const on = isControlled ? value : internal;

  function toggle() {
    if (!isControlled) setInternal(!on);
    onChange?.(!on);
  }
  return <button onClick={toggle}>{on ? 'On' : 'Off'}</button>;
}
```

`<Toggle defaultValue />` just works; `<Toggle value={x} onChange={setX} />` gives the parent control. This mirrors how `<input>` behaves, which is why it feels natural.

**The state reducer pattern** goes further — let the caller intercept *how* state changes:

```jsx
<Toggle
  stateReducer={(state, action) => {
    if (action.type === 'toggle' && state.clicks >= 3) {
      return state;                 // caller vetoes the change
    }
    return defaultReducer(state, action);
  }}
/>
```

Rare, but it's the escape hatch that prevents a fork when someone needs behaviour you didn't anticipate. Downshift popularised it.

---

## 8. Container / Presentational (historical)

Split components into "smart" (data, state) and "dumb" (markup only).

```jsx
function UserListContainer() {              // fetches
  const { data } = useQuery(['users'], fetchUsers);
  return <UserList users={data} />;
}
function UserList({ users }) {              // renders
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Dan Abramov, who popularised it, later withdrew the advice** — hooks let you extract logic without splitting components arbitrarily.

The *underlying idea* still holds: keep data-fetching separate from presentation. But use a custom hook, not a mandatory two-component split.

---

## 9. Choosing

| You need to share… | Use |
|---|---|
| Stateful logic | **Custom hook** |
| Logic + flexible markup structure | **Compound components** (with context) |
| Logic where the parent controls the loop | **Render props** |
| Behaviour with zero styling opinions | **Headless** |
| Nothing — it's one component | Just write the component |

Default to a custom hook. Reach for the others when a hook genuinely can't express it.

---

## 10. Interview Questions

### Basic

**Q: What's a higher-order component?**
A function that takes a component and returns a new one wrapping it, injecting props or behaviour. Largely replaced by hooks, but still common in older code — `connect()`, `withRouter()`.

**Q: What are compound components?**
A parent and a set of child parts sharing implicit state — `<Tabs>` with `<Tabs.Tab>`. The caller controls layout and markup; the parent owns the state.

**Q: What's a render prop?**
A prop whose value is a function returning JSX. The component supplies data, the caller supplies markup.

### Intermediate

**Q: Why did hooks replace HOCs and render props?**
HOCs caused wrapper hell, silent prop collisions, and untraceable prop origins. Render props caused deep nesting when composed. Hooks share logic with no wrapper component, no naming conflicts, and explicit values at the call site.

**Q: Why shouldn't you build compound components with `cloneElement`?**
It only reaches **direct** JSX children. Verified: wrap a child in another component and it receives nothing — `Children.count` reported 2 while 3 tabs rendered. The context version worked at any depth. React's docs call `Children` and `cloneElement` fragile for exactly this reason.

**Q: Are render props obsolete?**
No. Hooks replaced the *data-sharing* use, but render props still win when the component controls the loop or the call frequency — `renderItem` in a list, where the parent owns iteration and the caller owns row markup. It's also React's recommended replacement for `cloneElement`.

**Q: What are headless components?**
Components or hooks that provide behaviour, state, and accessibility without markup or styles — Radix, Headless UI, TanStack Table. You get keyboard nav and ARIA handling; you write every pixel.

### Senior

**Q: Design a `<Select>` for a design system. What patterns?**
A design-system `<Select>` has to survive requirements you haven't heard yet — a new icon system next quarter, a team that wants completely different markup, a one-off behavior tweak nobody anticipated. Each pattern in this module exists to defer a different kind of lock-in, and a real component combines several:

```jsx
<Select value={id} onChange={setId}>          {/* controlled/uncontrolled (§7) */}
  <Select.Option value="a">{icon} A</Select.Option>   {/* compound components (§3) */}
  <Select.Group label="Fruit">
    <Select.Option value="b">B</Select.Option>
  </Select.Group>
</Select>
```

**Compound components with context** (§3) give structure without a rigid `options` array — a new requirement like icons or nested groups is just more JSX, not a new prop, and it works at any nesting depth because it's context, not `cloneElement` (§3's verified failure mode: `cloneElement` only reaches direct children).

**Controlled and uncontrolled support** (§7) means the design system doesn't force every consumer into wiring `value`/`onChange` — `<Select defaultValue="a">` works standalone, `<Select value={x} onChange={setX}>` hands control to a parent doing validation.

**Headless prop getters** (§6) are what let *other* teams reskin the same behavior without forking — `getOptionProps()` ships the ARIA attributes, keyboard nav, and focus trap; the design system's own styled `<Select>` and a completely different team's unstyled version can share the identical logic.

The state reducer (§7) is the rarest addition, reserved for behavior you genuinely can't predict — letting a caller veto or rewrite a state transition instead of forking the whole component. The unifying goal across all four: every predictable new requirement should be satisfiable by composing the existing API, so nobody's first instinct is to copy the source and modify it.

**Q: Why is Container/Presentational no longer recommended?**
The pattern solved a real problem — mixing data-fetching and markup in one component makes both harder to test and reuse — but it solved it the only way available before hooks existed: by forcing a *file-level* split into two components, even when nothing else about the code needed one.

```jsx
// Before hooks — the split is mandatory even for one small piece of logic
function UserListContainer() {
  const { data } = useQuery(['users'], fetchUsers);
  return <UserList users={data} />;         // extra component, extra file, extra prop-passing
}
function UserList({ users }) { return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>; }

// After hooks — same separation of concerns, no forced component split
function useUsers() { return useQuery(['users'], fetchUsers).data; }
function UserList() {
  const users = useUsers();
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

Both versions separate data-fetching from rendering — that underlying instinct was correct and still holds. What changed is that a hook can now carry the "smart" half without needing a second component and a second file to live in. The container/presentational split was solving "how do I extract logic" with the only lever available at the time — components — when the real unit of reuse should have been logic itself.

Dan Abramov, who wrote the original post that popularized the pattern, later added a retraction note to the top of it once hooks shipped, saying essentially this: the pattern was a workaround for a missing primitive, not a design principle worth preserving for its own sake. It's a useful case study in reading advice for the *problem* it solves rather than the specific mechanism — the mechanism aged out, the problem it addressed didn't.

**Q: When would you accept an HOC in a new codebase?**
Almost only when the thing you need to inject can't be expressed as a value a hook returns — it has to be a *component wrapping a component*, because the behavior operates at the render-tree level, not the data level.

The clean example is error boundaries (Module 5 §8): catching a render error requires `componentDidCatch` / `getDerivedStateFromError`, which only exist on classes, and which need to wrap *children*, not receive props from a caller. A hook returns values; it can't intercept a child throwing during render. So:

```jsx
function withErrorBoundary(Component, fallback) {
  return function Wrapped(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
```

This is a legitimate HOC in 2026 for exactly one reason: there is no hook-shaped alternative, because "catch a render error in my children" isn't a value, it's structural wrapping. Contrast with the classic `withAuth` (§5) — checking `useUser()` and conditionally rendering — which is pure data plus a conditional, expressible entirely as a hook with zero need for a wrapper component.

The other case worth naming: integrating a third-party library whose own public API is HOC-shaped (an older Redux `connect()`, some legacy chart library). There you're not *choosing* an HOC, you're stuck with one at the boundary — the right move is usually to wrap it once at the integration point and expose a hook-based API to the rest of your app, so the HOC pattern doesn't spread past that one seam.

**Q: How do you decide between a custom hook and a compound component?**
Ask what's actually being shared: values, or a tree shape. A hook shares *logic* — it returns state and functions, and the caller decides entirely how to render them (§2's `useDisclosure`, returning `{ isOpen, open, close, toggle }` with zero opinions about markup). A compound component shares *logic and structure together* — the parent owns state, but the caller still writes real JSX with a specific shape the parent expects (`<Tabs.List>` containing `<Tabs.Tab>`s, coordinated through context).

```jsx
// Hook: caller builds everything from returned values
const { isOpen, toggle } = useDisclosure();
return isOpen && <div onClick={toggle}>...</div>;   // 100% caller's markup

// Compound component: caller writes a specific tree shape, parent coordinates it
<Tabs><Tabs.List><Tabs.Tab id="a">A</Tabs.Tab></Tabs.List></Tabs>
```

The test that decides it: if you can imagine two totally different UIs built from the same returned values, it's a hook — `useDisclosure` could back a modal, a dropdown, or an accordion, because it exposes nothing but booleans and functions. If the components genuinely need to coordinate with each other as siblings — a `Tab` needs to know which `Tab` is active, a `Panel` needs to know if it should render — that coordination has to live somewhere, and compound components with context (§3) are the shape that provides it without every sibling manually wiring props to every other sibling.

The strongest libraries (Radix, Downshift, Headless UI) ship both, layered: a hook for consumers who want total control of markup, and a compound-component or headless wrapper on top of the same hook for consumers who want a batteries-included version. That's not redundancy — it's offering the logic at two different levels of structural commitment.

---

## 11. Common Mistakes

- ❌ Building compound components with `cloneElement` — silently breaks the moment a child is wrapped. *(Verified.)*
- ❌ Writing new HOCs when a hook would do.
- ❌ Stacking render props into a nesting pyramid.
- ❌ A component that's controlled-only or uncontrolled-only — support both.
- ❌ Forgetting `useMemo` on a compound component's context value (Module 5 §6).
- ❌ Splitting Container/Presentational by habit rather than need.
- ❌ Reaching for a pattern before there's duplication. Two similar components aren't yet a pattern.

---

## 12. Official Documentation References

- [`Children`](https://react.dev/reference/react/Children) — *"can lead to fragile code"* · [`cloneElement`](https://react.dev/reference/react/cloneElement) — *"uncommon and can lead to fragile code"*
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [Presentational and Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) — Dan Abramov's retraction note is at the top

---

## 13. Revision Notes

1. Every pattern answers: **how do I share behaviour without copy-paste?**
2. History: Mixins → HOCs → render props → **custom hooks**.
3. **Custom hooks are the default.** No wrapper, no collisions, composable.
4. **Compound components** share logic *and* structure. Build with **context**.
5. **`cloneElement` only reaches direct children** — it breaks on nesting. *(Verified: C and D got nothing.)*
6. React's docs call `Children` and `cloneElement` **fragile** and recommend render props, context, or hooks.
7. **Render props still win** when the parent controls the loop (`renderItem`).
8. **HOCs:** recognise them, don't write them. Wrapper hell, prop collisions, unclear origins.
9. **Headless** = behaviour + accessibility, zero styling. The dominant library pattern now.
10. Reusable components should support **controlled and uncontrolled** modes.
11. **Container/Presentational is retracted** — hooks removed the need.
12. Don't reach for a pattern before you have real duplication.

**Soundbites**
- "Hooks are attachments you clip on; HOCs were wrapping the tool in another tool."
- "cloneElement can't see past the first layer of children."
- "Config-object components are vending machines; compound components are LEGO."
- "Headless is an unfurnished flat with the wiring already done."
- "Two similar components aren't a pattern yet."

---

## 14. Practice Exercises

**1 — Break `cloneElement`.** Build a compound `<Tabs>` with `Children.map` + `cloneElement`. Confirm it works, then wrap two tabs in a `<MoreTabs>` component and watch them stop receiving props. Rebuild with context and confirm the fix.

**2 — Extract a hook.** Find two components sharing open/close logic. Pull out `useDisclosure` and delete the duplication.

**3 — Convert an HOC.** Take a `withSomething` HOC and rewrite it as a hook. Compare the DevTools tree before and after.

**4 — Build a compound component.** Make `<Accordion>` with `<Accordion.Item>`, `<Accordion.Header>`, `<Accordion.Panel>` using context. Support multiple open panels via a prop.

**5 — Support both modes.** Write a `<Rating>` that works as `<Rating defaultValue={3} />` and `<Rating value={x} onChange={setX} />`. Test both.

**6 — Go headless.** Take a styled dropdown and split it: a hook returning state and prop getters, plus a thin styled component using it. Then build a second, visually different dropdown on the same hook.

**7 — Interview rehearsal.** 2 minutes: *"How would you share logic between components, and how has that changed?"* Cover mixins → HOCs → render props → hooks, with what each fixed and what it broke.

---

**Next:** [Module 11 — React 16 → 17 → 18 → 19](./Module11-VersionHistory.md), version by version.
