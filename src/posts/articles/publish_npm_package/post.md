---
title: Publishing npm packages and adding it to CI/CD pipeline
date: July 1th, 2025
descr: Publishing npm packages to npm registry and GitHub Packages Registry. Different approaches to automizing and streamlining the process with GitHub workflows
---

# Different ways to publish npm packages

## Table of contents

- [NPM Registry](#npm-registry)
- [GitHub Package Registry](#github-package-registry)
- [Speeding up the workflow](#speeding-up-the-workflow)
- [Semantic Release (AKA the holy grail of package releases)](#semantic-release-aka-the-holy-grail-of-package-releases)
- [Conclusion](#conclusion)

This is my first time publishing my own dummy package to a registry. Very exciting! This post covers my exploration on how I published packages and added it to a CI/CD pipeline with cache optimization. The package I am publishing is the result of another post where I reviewed my learnings from the [Vite course by Steve Kinney](https://cozy-habit.github.io/vite_course). So let's get started.

To publish a package we first need to understand the tools we use to accomplish it.

## package.json

`repository` key let's you add a link to the respective GitHub repo where the package is stored.
TODO

## .npmrc

This is the config file for npm. Npm will create a global config file for you in `~/.npmrc`, but you can also overwrite them by creating one in your `User` directory, as well as repository scoped by adding one to your repo folder.

Here's an example config setup:

```ini
@your-scope:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Let's look at both lines:

```ini
@your-scope:registry=https://npm.pkg.github.com/
```

This tells `npm` that any package starting with `@your-scope` should use GitHub's registry instead of the default npm registry. If you don’t do this, npm will try to publish or fetch these scoped packages from the default npmjs.org, which will fail for private GitHub-hosted packages.

This must match the name field in your package.json, e.g.:

```json
{
    "name": "@your-scope/my-library"
}
```

Let's look at the last line:

```ini
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

GitHub Packages require authentication even to install public packages from private repos. This provides authentication to GitHub's registry. `${GITHUB_TOKEN}` should be an environment variable (in GitHub Actions or `.env`). This avoids hardcoding tokens — secure and CI-friendly.

## NPM Registry

I now want to publish a public package to the the default npm registry. Private packages require a paid plan and we all know that I don't like to pay for stuff. I have a repository containing an application folder and a library folder:

```
/app
/lib
/node_modules
.npmrc
package-lock.json
package.json
```

```json
//package.json
{
    "name": "@cozy-habit/lib",
    "version": "1.0.0",
    "description": "This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.",
    "main": "./dist/frl.umd.cjs",
    "module": "./dist/frl.js",
    "files": ["dist"],
    "exports": {
        ".": {
            "import": "./dist/frl.js",
            "require": "./dist/frl.umd.cjs",
            "types": "./dist/index.d.ts"
        }
    },
    "type": "module",
    "repository": {
        "type": "git",
        "url": "https://github.com/Cozy-Habit/blabla.git"
    },
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
}
```

I first need to authenticate to npm by running `npm adduser` and logging into my npm account in the browser. If done so you should see a confirmation message `Logged in on https://registry.npmjs.org/.` on the CLI:

![alt text](image-1.png)

I can then run `npm publish --access public`

![alt text](image.png)

And now my package pops up on my npm account in the package section:

![alt text](image-2.png)

If we now try to publish the same version to the registry we will receive an error as we cannot overwrite that version. So we have to either increase the version manually or run `npm version patch` which does it for us

```json
{
    "name": "@cozy-habit/lib",
    "version": "1.0.1", //increase version number
    "description": "This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.",
    "main": "./dist/frl.umd.cjs",
    "module": "./dist/frl.js",
    "files": ["dist"],
    "exports": {
        ".": {
            "import": "./dist/frl.js",
            "require": "./dist/frl.umd.cjs",
            "types": "./dist/index.d.ts"
        }
    },
    "type": "module",
    "repository": {
        "type": "git",
        "url": "https://github.com/Cozy-Habit/blabla.git"
    },
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
}
```

and then run the publish command:

![alt text](image-3.png)

We can automate this by adding another npm script to our package.json:

```json
"scripts": {
    //...
    "publish:lib": "cd lib && npm version patch && npm publish --access public"
},
```

But as this is a pain to do manually for every release, we can automate this process with a GitHub workflow so that it runs every time we push code to the main branch.

### GitHub Workflow

As I have a monorepo I have to make sure that I run npm publish from the lib directory.
TODO

## GitHub Package Registry

GitHub Package Registry (GPR) allows developers to publish unlimited private packages to GitHub's own package registry.

If we want to manually upload the file we need to adjust our `.npmrc` file:

```ini
@cozy-habit:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

In the `package.json` we can optionally add a repository URL so that the package gets linked to it and shows up on the respective repo page. Fortunately my GitHub username is the same, else I'd have to change the scope in the `package.json`.

```json
{
    "name": "@cozy-habit/lib", //@cozy-habit is the scope and simply represents a namespace for my packages
    "version": "1.0.0",
    "description": "This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.",
    "main": "./dist/frl.umd.cjs",
    "module": "./dist/frl.js",
    "files": ["dist"],
    "publishConfig": {
        "registry": "https://npm.pkg.github.com/"
    },
    "exports": {
        ".": {
            "import": "./dist/frl.js",
            "require": "./dist/frl.umd.cjs",
            "types": "./dist/index.d.ts"
        }
    },
    "type": "module",
    "repository": {
        "type": "git",
        "url": "https://github.com/Cozy-Habit/blabla.git"
    },
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC"
}
```

When trying to run the script `npm run publish:lib` I saw in my command line that the user couldn't be authenticated to the endpoint, which meant that `GITHUB_TOKEN` couldn't be read.

I chatted with my pal GPT and he said the following:

> The reason environment variables are not being inserted in the .npmrc file is because .npmrc does not support shell-style environment variable interpolation (like ${GITHUB_TOKEN} or $GITHUB_TOKEN). It is not a shell script — it's a plain config file read directly by the npm CLI, which doesn't do any variable substitution. <br> <br> The environment variable needs to be available in the shell session before the `npm publish` - or any npm command that reads `.npmrc` - runs so that the variable can be replaced with its value.

I wondered why other configs like Vite or ESLint can use environment variables:

> Vite config files (vite.config.js/ts) are JavaScript or TypeScript files, so they are executed as code by Node.js and it can load your `.env` or environment variables into `process.env` <br> <br> `.npmrc` is a plain text config file. Which means it is not a script, so it doesn’t evaluate JavaScript or call dotenv or any shell expansion on its own. `.npmrc` can use environment variables but only when interpreted by the `npm` CLI itself.

So how does dot-env then work?

> **The dotenv library:** <br> <ul><li>Reads your `.env` file (e.g., KEY=value)</li><li>Parses its contents</li><li>Injects the key-value pairs into process.env of the current Node.js process</li></ul>📌 It does not export those variables to your shell or globally across processes. <br> <br> **It does not make the variables available to:** <ul><li>other terminal commands (npm, git, curl, etc.)</li><li>shell sessions or subprocesses</li><li>configuration files like .npmrc unless they are interpreted by a Node.js process with dotenv loaded manually (which is not how .npmrc works)</li></ul>

This means that `dot-env` won't help me in making the `.env` variables available to the `npm` process and I need to look for another solution.

While researching for a solution I found [this article](https://barker.codes/blog/loading-dot-env-files-in-a-unix-shell/) by Kieran Barker and the solution is to use
`set -a ; . ./.env ; set +a` in `Bash` to load the `.env` variables into the shell session. So this is my adjusted npm script:

```json
"scripts":{
    //...
    "publish:lib": "cd lib && set -a ; . ./.env ; set +a && npm version patch && npm publish"
}
```

And this actually did the trick:

![alt text](image-4.png)

### GitHub Workflow

We can now adjust our GitHub workflow for uploading the package to GPR instead:

```yml
name: Publish package to GitHub Packages
on:
    push:
        branches: [main]
        paths:
            - 'lib/**'
            - '.github/workflows/publish-lib.yml'
jobs:
    build:
        runs-on: ubuntu-latest
        permissions:
            contents: read
            packages: write
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4 # Setup .npmrc file to publish to GitHub Packages
              with:
                  node-version: '20.x'
                  registry-url: 'https://npm.pkg.github.com' # Defaults to the user or organization that owns the workflow file
            - run: npm ci
            - run: npm run build:lib
            - run: cd lib && npm version patch
            - run: npm publish
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

When running our script in the workflow we will run into an error as the `.env` file does not exist remotely. Instead the workflow provides us the `GITHUB_TOKEN` by itself and we only need to pass it to the `env` key when running `npm publish`.

Instead of providing a separate auth token to GitHub Secrets we can simply use the `GITHUB_TOKEN` from the secrets object which will be automatically provided on every workflow run. This will authenticate us to upload the package to the registry in our username scope.

The `setup-node@4` action automatically creates a `.npmrc` file containing the correct configuration to the registry, which is why we only need our manually created `.npmrc` file if we want to publish the package manually from the command line.

Technically, we can get rid of the `.npmrc` and `npm script` alltogether, as this GitHub workflow does everything for us.

When running the workflow it threw the same error again: `"User cannot be authenticated with the token provided."`. Why is that?

The action `setup-node@v4` actually creates a new `.npmrc` file in the home directory of the runner, but because we provide another `.npmrc` file locally in the repository it will gain precedence over the other created by the action. The variable TODO hence the error.

TODO ... Make sure to add write permissions for content

## Speeding up the workflow

When we build our package we first need to make sure that we have all our packages installed. This step can be sped up by caching the node modules in between GitHub action runs. I found this article on [NPM caching](https://medium.com/@ruben.alapont/npm-caching-speeding-up-your-development-process-340dcdc554b3) by Ruben Alapont who explains npm caching in a simplified and straight-forward way.

We can activate the npm caching in our GitHub workflow by using the `cache` action like this:

```yml
#...
- name: Cache node modules
  id: cache-npm
  uses: actions/cache@v4
  env:
    cache-name: cache-node-modules
  with:
    # npm cache files are stored in `~/.npm` on Linux/macOS
    path: ~/.npm
    key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
    ${{ runner.os }}-build-
#...
```

This can be achieved even simpler by enabling caching via the `setup-node` action:

```yml
#...
- name: Set up node and cache node modules
- uses: actions/setup-node@v4
  with:
      node-version: '20.x'
      registry-url: 'https://npm.pkg.github.com'
      cache: 'npm'
#...
```

This is the workflow before adding cache:

![alt text](image-5.png)

This is the same workflow after adding cache:

![alt text](image-6.png)

Here we see "Cache hit" and "Cache restored successfully" when the `setup-node action` runs. Looking at the succeeding step where the packages are actually being installed the time it took to complete this step got reduced from 14s to 10s overall. At first I was expecting it to be almost instantaneous, so I wondered if I did something wrong. After a quick chat with GPT I learned the following:

- caching packages means that their already downloaded tarball files are stored locally in a cache directory
- this speeds up subsequent installs by not redownloading packages
- `npm install` still needs to resolve dependencies and relink modules.
- it doesn’t fully skip `node_modules` creation like a persistent `node_modules` cache would.
- So a 3–5s speedup is expected — 10s is reasonable.

To speed it up even further I could use `pnpm` as it is faster and more efficient for CI caching and still compatible with most npm projects.

## Semantic Release (AKA the holy grail of package releases)

The semantic-release docs are very good to get started with the package.

You simply install it with `npm install --save-dev semantic-release` and then add it to the workflow:

```yml
name: Publish package to GitHub Packages
on:
    push:
        branches: [main]
        paths: # will only trigger if changes are applied to these paths
            - 'lib/**'
            - '.github/workflows/deploy-image.yml'
jobs:
    build:
        runs-on: ubuntu-latest
        permissions:
            contents: write
            packages: write
            issues: write
            pull-requests: write
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4 # Setup .npmrc file to publish to GitHub Packages
              with:
                  node-version: '20.x'
                  registry-url: 'https://npm.pkg.github.com' # Defaults to the user or organization that owns the workflow file
                  cache: 'npm'
            - name: Install dependencies
              run: npm ci
            - name: Build package
              run: npm run build:lib
            - name: Semantic release
              working-directory: ./lib
              run: npx semantic-release
              env:
                  GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN}}
```

It is important to update the permissions as the command will run code to comment on PRs, close issues, add labels and create GitHub releases (in some cases). Else it will throw errors that the ressource is not accessible by the integration. Then these permissions are active in the `GITHUB_TOKEN` which will be made available in the shell session's environment variables. In order to publish the package the tool will read the `.npmrc` file to check to which directory it is supposed to publish the package. Therefore we can simply use our old `.npmrc` file:

```ini
@cozy-habit:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

If we weren't to use this file the tool would expect the `NODE_AUTH_TOKEN` to be passed to the `env` key in the workflow (as this is actually the default variable name instead of `GITHUB_TOKEN`) so that it can authorize to the npm registry which would be chosen as configured in the default `.npmrc` file in the home directory of the runner.

## Conclusion

TODO

## Sources

- [Loading dot env files in a unix shell](https://barker.codes/blog/loading-dot-env-files-in-a-unix-shell/) by Kieran Barker
- [NPM caching](https://medium.com/@ruben.alapont/npm-caching-speeding-up-your-development-process-340dcdc554b3) by Ruben Alapont
- [Caching dependencies to speed up workflows](https://docs.github.com/en/actions/how-tos/writing-workflows/choosing-what-your-workflow-does/caching-dependencies-to-speed-up-workflows) by GitHub Docs
- [actions/cache Docs](https://github.com/actions/cache)
- [actions/setup-node Docs](https://github.com/actions/setup-node#caching-global-packages-data)
