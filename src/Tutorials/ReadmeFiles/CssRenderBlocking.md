# Does CSS Parsing Block HTML Parsing?

## The question

We have a stylesheet linked in the `<head>`:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Hello</h1>
</body>
</html>
```

Does CSS parsing happen *before* HTML parsing, or always *after* it? And does the `<link>` tag pause HTML parsing while `style.css` downloads?

## Step-by-step browser flow

**Step 1 — the browser receives the HTML.**
The response starts streaming in, and the browser begins reading it top to bottom.

**Step 2 — HTML parsing starts immediately.**
The HTML parser starts building the DOM as soon as bytes arrive. At this point nothing has been parsed for CSS yet, because the parser hasn't even reached the `<link>` tag.

**Step 3 — the browser encounters `<link rel="stylesheet" href="style.css">`.**
It:
- Starts downloading `style.css` **asynchronously** (in parallel, off the main parsing thread).
- **Continues parsing the rest of the HTML** — the download does not pause the HTML parser.

**Step 4 — `style.css` finishes downloading.**
Once the bytes are in, the CSS parser runs over them and builds the **CSSOM** (CSS Object Model) — the styling equivalent of the DOM.

**Step 5 — DOM and CSSOM combine.**
Once *both* trees exist:

```
DOM + CSSOM → Render Tree → Layout → Paint
```

## Does HTML parsing wait for CSS?

**❌ HTML parsing — no.** The HTML parser keeps building the DOM while the stylesheet downloads in the background.

**✅ Rendering — yes.** The browser cannot paint anything until the CSSOM is ready, because it needs the computed styles to know how to lay out and paint each element.

This is exactly why CSS is described as **render-blocking**, not **parser-blocking** — it blocks the *pixels showing up*, not the *DOM being built*.

## Timeline

```
HTML arrives
      │
      ▼
HTML parsing starts
      │
      ▼
<link rel="stylesheet"> encountered
      │
      ├──────────────► CSS download starts (parallel)
      │                        │
      ▼                        ▼
Continue HTML parsing    style.css downloading
      │                        │
      ▼                        ▼
   DOM ready            CSS download finishes
                                │
                                ▼
                          CSS parsing
                                │
                                ▼
                          CSSOM ready

           DOM  +  CSSOM
                │
                ▼
           Render Tree
                │
                ▼
             Layout
                │
                ▼
              Paint
```
