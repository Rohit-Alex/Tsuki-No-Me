# Tree-shaking demo — Module 14

Proves that tree-shaking needs ES modules, and measures the lodash import difference.

## Setup

```bash
cd verify/tree
npm init -y && npm i lodash lodash-es
```

## 1. ESM shakes, CommonJS doesn't

```bash
npx esbuild main-esm.js --bundle --minify --format=esm > out-esm.js
npx esbuild main-cjs.js --bundle --minify --platform=node > out-cjs.js
grep -c "NOT used" out-esm.js   # 0  → dead code removed  (49 bytes)
grep -c "NOT used" out-cjs.js   # 1  → dead code SHIPPED  (231 bytes)
```

`require()` is a runtime call that can take a variable, so the bundler can't
know statically what's used. ESM `import` is static and analysable.

## 2. The lodash lesson

```bash
for f in a b c; do
  npx esbuild $f.js --bundle --minify --format=esm > out-$f.js
  printf "%-40s %s bytes\n" "$(head -1 $f.js)" "$(wc -c < out-$f.js)"
done
```

Measured result — same function, three import styles:

```
import _ from 'lodash';                   73808 bytes
import debounce from 'lodash/debounce';    3478 bytes
import { debounce } from 'lodash-es';      2890 bytes
```

**25× difference from one import line.**
