### Network Optimization
1. **Assets Optimization**
    - i. **CSS Optimization**
    - ii. **JS Optimization**
    - iii. **Fonts Optimization**
    - iv. **Images Optimization**
    - v. **Video Optimization**
2. **Lazy Loading**
3. **CSR and SSR**
4. **Compression Technique**
5. **Improving Layout Shifts**

### CSS Optimization
1. **Reduce Excessive Use of Inline Styles**
   - Leads to an increase in bundle size and slows the rendering process.
2. **Use a CSS Preprocessor (Sass) or CSS Modules**
   - Scope your CSS to individual components, which can help to avoid conflicts.
3. **Use CSS-in-JS**
   - Styled-components and Aphrodite can help you write more dynamic and reusable CSS.
4. **Static Extraction**
   - Identifying styles that do not change during runtime and extracting them during the build process. This reduces the size of JavaScript bundles and improves loading times.
   - **How to do**: 
     Styled Components offers the `babel-plugin-styled-components` plugin, which supports static extraction. Configure this plugin in the project's Babel configuration.

```
module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: [
        [
            'babel-plugin-styled-components',
            {
                ssr: true, // Enable server-side rendering support
                displayName: true, // Enable display names for easier debugging
                preprocess: false, // Disable preprocessing of styled components
                pure: true, // Enable static extraction
            },
        ],
    ],
};
```

5. **Critical CSS**
   - Critical CSS is a technique used to improve the perceived performance and load time of web pages by prioritizing the rendering of above-the-fold content.
   - **How to do**:
     - i. Require third-party plugin like `critters-webpack-plugin`.
     - ii. Configure webpack.
     - iii. Override the critter plugin.
     - iv. Generate the critical CSS while building the app.

6. **CSS Tree Shaking**
   - CSS Tree Shaking involves removing unused CSS rules from stylesheets to reduce the overall file size and optimize loading performance.
   - **Implementation**:
     - i. Configure webpack.
     - ii. Add a plugin like `PurgeCSSPlugin`.

### Video Optimization
1. **Compress the Video Before Using It**
2. **Use Progressive Enhancement**
   - Load the most optimized format first and use video as a fallback.
   
   ```
    <video poster="add-svg-code-poster.jpg">
        <source src="add-svg-code.webm" type="video/webm">
        <source src="add-svg-code.mp4" type="video/mp4">
        <p>Your browser cannot play the provided video file.</p>
    </video>
    ```

3. Responsive poster image for video till it gets load. (add poster attribute in the video tag)
4. Stream videos instead of downloading it while playing.
5. Preload video if required
6. Remove audio track for muted videos, when used as background

### Font Optimization
1. **Prefer FOOT & FOIT**
   - FOOT (Fallback font till external font is loaded) and FOIT (Show nothing till external font is downloaded) can be achieved by using `font-display: swap`.
2. **Use Browser Efficient Format**
   - Prefer formats like WOFF2 for better performance.
3. **Prefer Fetching Font from CDN**
   - Fetch fonts from a Content Delivery Network (CDN) and enable caching.
4. **Preload the Fonts**
   - Try to preload the fonts to improve performance.

```css
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('roboto-regular.woff2') format('woff2');
}

@font-face {
  font-family: 'Roboto Fallback';
  font-style: normal;
  font-weight: 400;
  src: local('Times New Roman');
  ascent-override: 84.57%;
  descent-override: 22.25%;
  line-gap-override: 0%;
  size-adjust: 109.71%;
}

html {
  font-family: 'Roboto', 'Roboto Fallback';
}
```

### Image Optimization
1. **Use Compressed Images**
2. **Use Progressive Enhancement**
   - Make use of `avif` and `webp` formats in supported browsers, with normal images as fallback.
```
    <picture>
        <source srcSet="path/to/image.webp" type="image/webp" />
        <source srcSet="path/to/image.jpg" type="image/jpeg" /> 
        <img src="path/to/image.jpg" alt="Descriptive text" />
    </picture>
```
3. Blurry image / skeleton loader / solid fallback image for images getting loading
4. lazing loading of images when they enter view-port
5. preloading hero images
6. use CDN for fetching images
7. Responsive Images - (Specify multiple images for different screen sizes, enabling browsers to download the most appropriate image size.)

   ```
        <img
            srcSet="
                path/to/your/image-small.jpg 320w,  // for small screens
                path/to/your/image-medium.jpg 480w, // for medium screens
                path/to/your/image-large.jpg 800w   // for large screens
            "
            sizes="(max-width: 320px) 280px, (max-width: 480px) 440px, 800px"
            src="path/to/your/image-medium.jpg" // Default image
            alt="Descriptive text for the image"
        />
    ```

### JS Optimization

1. **Use `async` and `defer` as Required** 
   - Prefer `defer` to avoid blocking HTML parsing.
2. **Preload Script Tag** 
   - Use the `link` tag with `rel` and `as` attributes to preload scripts.
3. **Use Web Workers** 
   - Offload tasks to a web worker to keep the main thread responsive.

### Avoid Memory Leaks in React
1. **Global Memory Allocation Leak**
   - Ensure global variables are managed properly to avoid leaks.
2. **Closure Unused Functions Leaks**
   - Avoid keeping unnecessary closures around.
3. **Clearing Observers and Event Listeners**
   - Properly remove observers and event listeners when they are no longer needed.
4. **Clearing Timeouts and Interval IDs**
   - Ensure `setTimeout` and `setInterval` are cleared when not in use.
5. **Unhandled Promises**
   - Handle promises properly to avoid issues with unresolved or rejected promises.
6. **Virtualized List**
   - Use virtualization for long lists to optimize rendering and memory usage.
7. using react hooks like `useMemo`, `useCallback`, `memo`, `useDeffered`, `useTransition`
8. Making use of `throttle` and `debouncing` methods
