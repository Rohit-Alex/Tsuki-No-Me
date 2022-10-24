const regexp = /src=/g;
const str = `<div class="se-component se-image-container __se__float-" contenteditable="false"><figure style="margin: 0px; width: 350px;"><img src="/emeditor/plugins/smiley/images/1.png" alt="INR" data-origin="350,32" data-proportion="true" data-size="350px,32px" data-align="" data-file-name="1.png" data-file-size="0" origin-size="10,15" style="width: 350px; height: 32px;" data-index="0"></figure></div><p>​</p><div class="se-component se-image-container __se__float- __se__float-none" contenteditable="false"><figure style="margin: 0px;"><img alt="image" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAPAAoDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwCj4k8IW2t+JLeDRZPD99qTaiTNFZW8z7F3Eubhy5GB3zgk9K9gsfBcNtYW0D2mhhoolQ7NMXbkADjcScfUk1haxn4a+KW1+AZ8OazcKmo269be4bgTIO4b+ID616SpDKGHIIyKAP/Z" data-origin="," data-proportion="true" data-align="none" data-file-name="Z" data-file-size="0" data-rotate="" data-rotatex="" data-rotatey="" data-size="," data-percentage="auto,auto" style="" data-index="1" origin-size="10,15"></figure></div><p><br></p><p>​<br></p>`;

const matches = str.matchAll(regexp);

for (const match of matches) {
    console.log(str.slice(match.index, match.index + match[0].length))
    console.log(`Found ${match[0]} start=${match.index} end=${match.index + match[0].length}.`);
    if (!match[0].substr(str.indexOf("src="), 15).includes('http') && !str.substr(str.indexOf("src="), 15).includes('data:image')) {
        const contentUrl = 'https://storage.googleapis.com'
        const replacedString = str.replace(/src=\\*"/g, 'src="' + contentUrl) // this detects if src=///////
        if (/\.png\\*/gi.test(replacedString)) { // .png/// check
            replacedString.replace(/\.png\\*/g, '.png')
        } else if (/\.jpeg\\*/gi.test(replacedString)) { // .png/// check
            replacedString.replace(/\.jpeg\\*/g, '.jpeg')
        } else if (/\.jpg\\*/gi.test(replacedString)) { // .png/// check
            replacedString.replace(/\.jpg\\*/g, '.jpg')
        } else if (/\.svg\\*/gi.test(replacedString)) { // .png/// check
            replacedString.replace(/\.svg\\*/g, '.svg')
        } else if (/\.gif\\*/gi.test(replacedString)) { // .png/// check
            replacedString.replace(/\.gif\\*/g, '.gif')
        }
    }
}
export const addImageBaseUrl = (data_html) => {
    let parser = new DOMParser();
    let parsedHtml = parser.parseFromString(data_html, "text/html");
    const baseUrl = 'https://storage.googleapis.com'
    parsedHtml.querySelectorAll("img").forEach((element, index) => {
        if (!element.outerHTML.includes(`src="${baseUrl}`) &&
            !element.outerHTML.includes(`src="data:image/apng`) &&
            !element.outerHTML.includes(`src="data:image/avif`) &&
            !element.outerHTML.includes(`src="data:image/gif`) &&
            !element.outerHTML.includes(`src="data:image/jpeg`) &&
            !element.outerHTML.includes(`src="data:image/png`) &&
            !element.outerHTML.includes(`src="data:image/svg+xml`) &&
            !element.outerHTML.includes(`src="data:image/webp`)
        ) {
            const tempHTML = element.outerHTML.replaceAll(`src="`, `src="${baseUrl}`)
            element.outerHTML = tempHTML
        }
    });
    // Input tag with type image is replaced by img tag
    parsedHtml.querySelectorAll("input").forEach((element, index) => {
        if (!element.outerHTML.includes(`src="${baseUrl}`) || element.type === "image") {
            let tempHTML = element.outerHTML.replaceAll(`input`, `img`).replaceAll(`src="`, `src="${baseUrl}`).replaceAll('type="image"', "")
            tempHTML = tempHTML.replaceAll("\\&quot;", "")
            element.outerHTML = tempHTML
        }
    });

    return parsedHtml.body.innerHTML.replaceAll("\\text", "")
}

console.log(addImageBaseUrl(str))