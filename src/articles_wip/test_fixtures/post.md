# Learning about Test Fixtures

One of my university modules covering DevOps concepts introduced me to Test Fixtures. At first I was wondering what it is. And then I read the Playwright Docs and figured that they also used Test Fixtures. In this post I will explore Test Fixtures in Playwright.

## What are Test Fixtures?

They enable us to reuse Playwright code across files and tests

## How to define a Test Fixture?

Fixtures run automatically, so no need to explicitly call them

https://chatgpt.com/c/686bbfb8-d37c-8003-946b-4b3641028f85

## How scopes work

At first I had a hard time wrapping my head around the meaning of scopes and why they are used.

'test': runs before each test, tears down after each test (default).

'worker': runs once per worker process, shared by all tests in that worker, torn down when the worker finishes.

So 'test' is the default scope, but if you want to set it so 'worker' to persist it throught the all tests run in one session then you will need to define an array and pass the object containing the scope key as second parameter.

I thought at first, why use an array? Isn't this only used to set static values?

It can be used for static values, but when setting the scope the array notation is required, so you can also add an async function instead of a static value to define your Test Fixture and use `use()` to set the value once your done with the computational part.

The docs provide a nice example for that:

```

```

## Why pass page to user()?

You technically don’t have to pass page to use() unless you’re overriding it or you want to provide a modified version of it.
For example:

If you simply do some setup using page, but your test will use its own page fixture, you don’t need to pass it.

If you want your test to receive the pre-configured or logged-in page, then passing it to use(page) means "This is the version of page I want the test to work with."

Case 1: No Override — page is just used for setup

```js
const myTest = test.extend({
    webApp: async ({ page }, use) => {
        await page.goto('/login');
        await page.fill('#user', 'admin');
        await page.click('text=Login');

        // No need to pass page — test will use its own page
        await use();
    },
});

myTest('my test', async ({ page }) => {
    // This is a brand new page instance, not the one from the fixture
    await page.goto('/something');
});
```

Case 2: Override — provide the prepared page

```js
const myTest = test.extend({
    page: async ({ page }, use) => {
        await page.goto('/login');
        await page.fill('#user', 'admin');
        await page.click('text=Login');

        // Pass the logged-in page to the test
        await use(page);
    },
});

myTest('my test', async ({ page }) => {
    // This page is already logged in!
    await page.goto('/something');
});
```
