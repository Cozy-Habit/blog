---
title: How to avoid CSS style collisions
date: Oct 4th, 2025
descr: The standard CSS causes unintended collisions and how scoped and modularized CSS solves this common issue
---

# How to avoid CSS style collisions

## How are style collisions caused?

### Scoped styles vs Module styles

#### 🔴 Example with **Scoped Styles**

Imagine two components both defining a `.title` class.

**`ComponentA.vue`**

```vue
<template>
    <h1 class="title">Hello from A</h1>
</template>

<style scoped>
.title {
    color: red;
}
</style>
```

**`ComponentB.vue`**

```vue
<template>
    <h1 class="title">Hello from B</h1>
</template>

<style scoped>
.title {
    color: blue;
}
</style>
```

### What Vue does under the hood

- Vue adds **unique data attributes** per component:

    - `ComponentA` → `<h1 class="title" data-v-a1b2>`
    - `ComponentB` → `<h1 class="title" data-v-c3d4>`

- And rewrites CSS:

    ```css
    .title[data-v-a1b2] {
        color: red;
    }
    .title[data-v-c3d4] {
        color: blue;
    }
    ```

✅ Result: No collision between `.title` in A and `.title` in B.
❌ But: If you **accidentally leak a global style** (e.g. `h1 { color: green }` in a global stylesheet), both titles will still be affected, because `scoped` only protects _local selectors_, not the actual class names.

---

## 🟢 Example with **CSS Modules**

**`ComponentA.vue`**

```vue
<template>
    <h1 :class="$style.title">Hello from A</h1>
</template>

<style module>
.title {
    color: red;
}
</style>
```

**`ComponentB.vue`**

```vue
<template>
    <h1 :class="$style.title">Hello from B</h1>
</template>

<style module>
.title {
    color: blue;
}
</style>
```

### What Vue does under the hood

- Vue generates **unique class names** for each file:

    - `ComponentA` → `.title___a1b2c3`
    - `ComponentB` → `.title___d4e5f6`

- Final DOM:

    ```html
    <h1 class="title___a1b2c3">Hello from A</h1>
    <h1 class="title___d4e5f6">Hello from B</h1>
    ```

- CSS:

    ```css
    .title___a1b2c3 {
        color: red;
    }
    .title___d4e5f6 {
        color: blue;
    }
    ```

✅ Result: Zero chance of collision — even global styles targeting `.title` won’t touch these, because `.title___a1b2c3` ≠ `.title`.

---

## ⚖️ Key Difference

- **Scoped**: Prevents _intra-app_ collisions by scoping via attributes, but global CSS can still override if you’re not careful.
- **Modules**: Ensures **total uniqueness** of class names, safe even in projects with big shared CSS or third-party libraries.

## Conclusions

## Sources
