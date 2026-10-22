---
title: Different ways of adding custom fonts
date: Sept 28th, 2025
descr: Exploration of the differences in font files, how to add custom fonts to an application, and how to use font variations in css
---

# Different ways of importing custom fonts

For my [weather app](https://cozy-habit.github.io/frontendmentor_weatherApp) I need two different font families: `Bricolage Grotesque` and `DM Sans`.

I will explore different ways of using them in my app.

## Table of contents

- [Font file types](#font-file-types)
- [@import url() file from CDN](#import-url-file-from-cdn)
- [@font-face declaration from local file](#font-face-declaration-from-local-file)
- [Difference between static and variable fonts](#difference-between-static-and-variable-fonts)
- [Conclusion](#conclusion)

## Font file types

As with everything else in the web dev field there are different file types for fonts that each have their legitimate use-case.

Here's a [comprehensive article](https://www.whitepeakdigital.com/blog/font-file-types-explained/) on the up's and down's of each font file type by Jackson Gartner.

Essentially:

- Many font file downloads contain `.ttf` files. This is the most used file type.
- `.ttf` files are usually very big in size and less efficient in rendering and loading on web pages compared to newer, web-optimised formats like `.woff`.
- If web performance is crucial they can be converted into `.woff2` files through different websites, such as https://everythingfonts.com/ttf-to-woff2.

## @import url() file from CDN

The easiest way is to import the font files from a CDN from Google or another font provider as a single URL. I can either include it in the `<style>` tag in the `index.html`:

```html
<head>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

        .my-style {
            font-family: 'Bricolage Grotesque', sans-serif;
        }
    </style>
</head>
```

Or I can include it in the stylesheet:

```css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');

.my-style {
    font-family: 'Bricolage Grotesque', sans-serif;
}
```

## @font-face declaration from local file

Another way is to download the font files and store it in the project workspace. I can then reference it and declare all the font-faces I need for my app.

```css
@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: normal;
    src: url(/fonts/Bricolage_Grotesque/static/BricolageGrotesque-Bold.woff2)
        format(woff2);
    font-weight: 700;
}
```

The browser will request the font files from the public folder. Font files are usually considered being assets which is why bundlers will not copy them into the public folder in the build process. Either you configure your bundler to add them or you can a separate script to copy them into the public folder or you can simply store them in the public folder out of the gate.

This way your browser will be able to request the font files.

### Difference between static and variable fonts

Static fonts describe font files containing only one variation of the font, for instance a file for bold 500, another for bold 600, another for italic, so on and so forth. This means that you need to declare a font-face for each variation you want:

```css
@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: normal;
    src: url(/fonts/Bricolage_Grotesque/static/BricolageGrotesque-ExtraBold.woff2)
        format(woff2);
    font-weight: 800;
}

@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: normal;
    src: url(/fonts/Bricolage_Grotesque/static/BricolageGrotesque-Bold.woff2)
        format(woff2);
    font-weight: 700;
}

@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: normal;
    src: url(/fonts/Bricolage_Grotesque/static/BricolageGrotesque-SemiBold.woff2)
        format(woff2);
    font-weight: 600;
}

@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: italic;
    src: url(/fonts/Bricolage_Grotesque/static/BricolageGrotesque-Italic-SemiBold.woff2)
        format(woff2);
    font-weight: 600;
}
```

A workaround are variable fonts, where all font variations are contained in a single file. Which variations are actually contained depends on the specifications of the provider.

```css
@font-face {
    font-family: 'Bricolage Grotesque';
    font-style: normal;
    src: url(/fonts/Bricolage_Grotesque/BricolageGrotesque-VariableFont_opsz\,wdth\,wght.woff2)
        format(woff2);
    font-weight: 700;
}
```

Variable fonts allow to transition fonts neatly in between different font variations.

```css
h1 {
    font-size: 3.2em;
    line-height: 1.1;
    font-weight: 800;
    transition: font-variation-settings 500ms;
}

h1:hover {
    font-weight: 500;
}
```

Typical font variations can be specified via certain attributes as already demonstrated. These are also called axes.

![alt text](image.png)

Looking at the variable font file name it already hints off the variations contained in it which we can utilize via the css attributes. For `BricolageGrotesque-VariableFont_opsz\,wdth\,wght.ttf` these are `opsz` (font-optical-sizing), `wdth` (font-wdith) and `wght` (font-weight).

The `font-variation-settings` css attribute allows to set all of these attributes in a single line.

```css
h1 {
    font-size: 3.2em;
    line-height: 1.1;
    font-variation-settings: 'wght' 200 'wdth' 75 'opsz' 72;
    font-style: normal;
    transition:
        font-variation-settings 500ms,
        font-style 500ms;
}

h1:hover {
    font-variation-settings: 'wght' 900 'wdth' 125 'opsz' 14;
}
```

Though `font-variation-settings` isn't widely implemented in browsers yet according to [can-i-use](https://caniuse.com/?search=font-variation-settings). Rather stick to the traditional css attributes as listed above.

![alt text](image-1.png)

## Conclusion

Adding font files to an application isn't as complex as I had initially thought it would be.

There are still some things to look out for when doing so in order to optimize DX and web performance.

## Sources

- https://www.youtube.com/watch?v=0fVymQ7SZw0 by Kevin Powell
- https://www.whitepeakdigital.com/blog/font-file-types-explained/ by Jackson Gartner
- https://fonts.google.com/
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
