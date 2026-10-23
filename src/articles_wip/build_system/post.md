---
title: The function and use of build systems
date: Sept 30th, 2025
descr: Exploration what build systems are and what they are comprised of
---

# The function and use of build systems

I've been using Vite for a while and I knew that it was considered as a bundler. But the bundler is actually just one part of Vite's features. It is a build system. So I wanted to know what a build system does on a broader scale and how I know that a tool is considered a build system.

## What can be considered a build system?

A build system is any setup (software + configuration) that can orchestrate multiple steps in a build pipeline to transform source code into something deployable or runnable.

A build system is simply put a build toolchain. A chain of tools that are run one after the other.

### Characteristics of a Build System

A tool (or framework of tools) qualifies as a build system if it can:

- Run different tools in sequence (or in parallel)
    - e.g. compile TypeScript, then bundle JS, then minify, then copy assets.
- Express dependencies between tasks
    - e.g. don’t minify until bundling is done.
- Automate repetitive tasks
    - not just “bundle once,” but handle test runs, asset pipelines, etc.
- Provide reproducibility
    - same source → same output (important in CI/CD).
- (Often) Handle incremental builds
    - only rebuild what changed (big in tools like Bazel, Pants, Buck).

### Examples of Build Systems

- General-purpose build systems:
    - Make, CMake (C/C++ world)
    - Bazel, Pants, Buck (large-scale, polyglot builds)
    - Gradle, Maven, Ant (Java ecosystem)
- Task runners (build orchestrators):
    - Grunt, Gulp → mostly about automating tasks with JS, sometimes orchestrating bundlers.
    - npm scripts / yarn / pnpm → primitive, but still a build system if you chain tasks.
- Modern frontend build systems:
    - Webpack (kind of both) → bundler + build toolchain.
    - Vite → uses Rollup (bundler) but manages the whole pipeline (dev, HMR, assets, env, prod).
    - Next.js / Nuxt / Remix → meta-build systems that wrap bundling, SSR, routing, etc.

## Composition of a build system

### Running a bundler

### Compiling code (TypeScript → JS, SCSS → CSS)

### Linting & testing

### Minifying

### Running dev servers

### Copying static assets

## Conclusion

To come back to the example tool I introduced at the beginning, Vite is a build system or build tool as offers many features to provide a complete build pipeline.

- allows to serve files locally (dev server)
- changes to the code are immediately synced on the dev server (Hot Module Replacement - HMR)
- creates and optimized built of the development code (bundler)
- plugins allow the flexible addition of tools to the dev or build process, such as transpiling `.vue` files into JavaScript code so that the bundler can work with it, or adding Vue Devtools to the dev server for easier debugging

## Sources
