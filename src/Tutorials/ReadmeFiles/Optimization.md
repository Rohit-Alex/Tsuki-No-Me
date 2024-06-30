### Network Optimization
    1> Assets Optimization
        i> CSS Optimization
        ii> JS Optmization
        iii> Fonts optmization
        iv> Images optimization
        v> Video optimization
    2> Lazy loading
    3> CSR and SSR
    4> Compression technique
    5> Improving layout shifts

### CSS Optimization:
1> Reduces excessive use of inline styles (leads to increase in bundle size and slows rendering process)
2> Use a CSS preprocessor (Sass) or CSS modules (scope your CSS to individual components, which can help to avoid conflicts).
3> Use CSS in JS ( styled-components and Aphrodite can help you write more dynamic and reusable CSS.)
4> Static Extraction: (Identifying styles class components that do not change during runtime and extracting them during the build process. By precomputing static styles, static extraction reduces the size of JavaScript bundles and improves loading times, leading to better performance)
    How to do: 
     Styled Components offers the babel-plugin-styled-components plugin, which supports static extraction. By configuring this plugin in the project's Babel configuration, static styles of app component can be extracted during compilation.

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

5> Critical css: (Critical CSS is a technique used in web development to improve the perceived performance and load time of web pages by prioritizing the rendering of above-the-fold content. It involves identifying the CSS rules that are necessary to render the visible portion of a web page (the "above-the-fold" content) and including only those rules inline in the HTML document.)
    How to do: 
            i > Require third party plugin like critters-webpack-plugin
            ii> configure webpack
            iii> overriding the critter plugin
            iv> generating the critical css while building the app

6> CSS Tree Shaking: CSS Tree Shaking is a concept borrowed from JavaScript's tree shaking, which refers to the process of eliminating dead code or unused code from the final bundle. In the context of CSS, tree shaking involves removing unused CSS rules from style sheets to reduce the overall file size and optimize loading performance
        Implementation:
                        i> configuring webpack
                        ii> adding a plugin PurgeCSSPlugin
            
### Video Optimization
1> Compress the video before using it.
2> Use progressive enhancement (load the most optimized format first and the use video as a fallback)
    ```
        <video poster="add-svg-code-poster.jpg>
            <source src="add-svg-code.webm" type="video/webm">
            <source src="add-svg-code.mp4" type="video/mp4">
            <p>Your browser cannot play the provided video file.</p>
        </video>
    ```
3> Responsive poster image for video till it gets load. (add poster attribute in the video tag)
4> Stream videos instead of downloading it while playing.
5> Preload video if required
6> Remove audio track for muted videos, when used as background

### Font Optimization
1> prefer FOOT (fallback font till external font is loaded) & FOIT (show nothing till external font is downloaded). 
   This is acheived by font-display: swap
2>  use browser efficient format like WOFF2
3> Prefer fetching font from CDN and enable caching
4> Try to preload the fonts

```
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


### JS Optimization

1> use asyn and defer as requried (prefer defer)
2> preload script tag under link tag with rel attribut and as attribute
3> use webworker
###### Avoid Memory leaks in react
    1> Global memory allocation leak
    2> closure unused functions leaks
    3> clearing oberver and even-listener
    4> clearing timeouts and interval id
    5> unhandled or promise returning nothing, (neither resolve nor reject)
    6> virtualized list

### Image Optimization
1> use compressed image
2> use progressive enhancement (make use of avif and webp format in supported browser and normal images as fallback)
    ```
       <picture>
            <source srcSet="path/to/image.webp" type="image/webp" />
            <source srcSet="path/to/image.jpg" type="image/jpeg" /> 
            <img src="path/to/image.jpg" alt="Descriptive text" />
        </picture>
    ```
3> Blurry image / skeleton loader / solid fallback image for images getting loading
4> lazing loading of images when they enter view-port
5> preloading hero images
6> use CDN for fetching images
7> Responsive Images - (Specify multiple images for different screen sizes, enabling browsers to download the most appropriate image size.)
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




