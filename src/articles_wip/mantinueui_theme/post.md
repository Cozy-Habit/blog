It generates all css variables based on the theme object at built time and sorts them based on the colorScheme of the application inside the browser.

```css
[data-mantine-color-scheme="light"] {
  --mantine-color-text: black;
  --mantine-color-brand: #228be6;
}

[data-mantine-color-scheme="dark"] {
  --mantine-color-text: white;
  --mantine-color-brand: #4dabf7;
}
```

This lets you switch themes instantly with zero repaint.

The same goes for the cssVariablesResolver where it generates the css variables and injects them in the :root object at build time.

Mantine doesn’t generate a static CSS file for these variables by itself, but:

- If you're using Vite (or a bundler with PostCSS, Tailwind, or SCSS), the CSS variables injected via Mantine will be available globally at build time too — as long as you use them in your :root or in a selector that persists in the DOM.

However:

- The cssVariablesResolver function still runs dynamically to determine what variables to inject.
- The variables it returns are made available in the final build output via inline styles or style tags, not baked into CSS files unless you extract them manually.

variantColorResolver runs at runtime and dynamically creates inline styles. It does not pre-generate any CSS at build time.
Instead, Mantine dynamically evaluates this function during component rendering, depending on the current theme, color, and variant.

Yes — you’re exactly right to think that the object returned from `variantColorResolver` is not directly applied as-is. Instead, Mantine **transforms it internally** before using it to generate actual styles. Let’s break it down:

---

## 🧱 What `variantColorResolver` Returns

The object you return from `variantColorResolver` typically looks like this:

```ts
return {
  background: ...,
  color: ...,
  border: ...,
  hover: ...,
};
```

These keys are **semantic tokens** — not directly CSS properties — and Mantine interprets them based on the component being styled.

---

## 🔄 How Mantine Uses the Returned Object

1. **Maps Semantic Keys to Actual CSS Properties**

   Based on the component and its `variant`, Mantine will translate those semantic keys to actual **CSS properties**. For example:

   | Key from resolver | Becomes...                         |
   | ----------------- | ---------------------------------- |
   | `background`      | `background-color`                 |
   | `color`           | `color`                            |
   | `border`          | `border-color` or `border`         |
   | `hover`           | `:hover` styles (background, etc.) |

   The mapping is **component-specific** — a `Button` might use `background`, but a `Badge` might treat the same keys differently.

2. **Applies Resolved Styles**

   Mantine uses the resolved object in one of two ways:

   * It creates **inline styles** like this:

     ```tsx
     <button style={{ backgroundColor: '...', color: '...' }} />
     ```

   * Or it assigns **CSS custom properties** to component scope:

     ```css
     --mantine-button-bg: ...;
     --mantine-button-color: ...;
     ```

     and then uses them in the actual CSS definition:

     ```css
     .mantine-Button-filled {
       background-color: var(--mantine-button-bg);
       color: var(--mantine-button-color);
     }
     ```

   Which route Mantine takes depends on whether the component uses `varsResolver` internally (many of them do).

3. **Incorporates Theme Defaults and Fallbacks**

   If your `variantColorResolver` returns `undefined` for any key, Mantine falls back to its **default resolver**. So you don't always need to define every key unless you want to override them all.

---

## 📦 Where Does This Happen?

Internally, when a Mantine component like `<Button variant="filled" color="brand" />` renders:

* It calls your `variantColorResolver(color, variant, theme)`
* Receives the style object
* Uses a **`varsResolver`** (inside the component’s source code) to translate that style object to usable values
* Injects those as inline styles or CSS variables

---

## ✅ Example in Context

```ts
variantColorResolver: (input, theme) => {
  const c = theme.colors[input.color];
  return {
    background: c?.[6],
    color: theme.white,
    hover: c?.[7],
  };
}
```

This might lead to:

```tsx
<button style={{
  backgroundColor: '#4dabf7',
  color: '#fff',
  ':hover': { backgroundColor: '#339af0' }
}} />
```

(Or the component sets those via `var(--mantine-button-bg)` etc.)

---

## 🧠 TL;DR

* `variantColorResolver` returns a **semantic style object**
* Mantine **translates those into actual CSS properties** using component-specific logic
* Styles are applied either via **CSS variables** or **inline styles**
* Fallbacks exist if some keys aren’t returned
* You don’t need to map directly to CSS yourself — Mantine handles that

---

Let me know if you want to see how this looks for a specific component like `Button`, `Badge`, or `Input`, or how you could extend it to custom components!
