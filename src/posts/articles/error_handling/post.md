---
title: Exploring Error Handling
date: Aug 29th, 2026
descr: Exploration how to properly handle errors and exceptions aiming for great DX
---

# Why is handling Errors and Exceptions important?

Imagine you fetch user data from the API endpoint. It returns an error saying "An error occurred". Why did it fail?

- Is the endpoint correct?
- Am I authorized to access it?
- Did I wrongly format the payload?
- Is the database down?

You fill in a form and click the send button. A banner appears at the top saying "Processing form failed". Why did it fail?

- Did I fill in all the fields?
- Does a field expect different data?
- Did the internet connection break?
- Is the form broken?

There's much that can go wrong. Putting the work in ahead of time and anticipating why the application might fail will save us a lot of time later on.
Therefore, we should inform the consumer about errors as soon as a process fails.

A central concept in programming is to "fail fast". Why?
Realistically, you either work on a private project and invite other developers to contribute to your codebase or you work for a company and contribute code to a software product many other developers work on in alongside. Either way, you will produce code that other developers will eventually consume and maintain. How much they enjoy reading and working with it is also called the Developer Experience (DX). Nobody likes messy code that introduces more bugs than you can count when trying to introduce a new change. If you do, you are likely just built different than the average Joe or Jane. Thus, the goal should be to create code that can be easily discovered, understood, and changed, without introducing new bugs. Humans have only a limited amount of mental processing capacity. Having to keep track of too many files and steps will eventually exhaust us. If we fail fast we allow for faster feedback cycles and less cognitive load, meaning less exhaustion. If we fail with clear information about the error we allow for good context to understand why something failed and where to locate the failing error inside the codebase. By handling errors well as soon as possible we do a huge service to ourselves and fellow developers to understand why a system fails and how we can fix it.

## What is the difference between Errors and Exceptions?

Now with the goals of Error and Exception Handling out of the way let's cover why developers differentiate between Errors and Exceptions.

Errors are predictable scenarios of what could go wrong within a certain domain. They represent business-rule violations, missing input, or resources not found. Thus, they should return an explicit object structure.

Examples:

- A user inputs a wrongly formated email address
- A user entry was not found in the database

We know when these errors will occur and what can be done to fix this. Thus, we can introduce code to give developers and users feedback why, when, and where something failed and what can be done to achieve the desired result.

Exceptions on the other hand are errors that we cannot predict or recover from. These are things that are _exceptional_, usually unexpected infrastructure failures.

Examples:

- The database is down
- Network timeout (a device or server doesn't reply in time to a network request and is therefore being aborted)
- A bug

## What does good Error Handling look like?

Errors can occur anywhere if a certain state does not meet the expected state. Just to name a few examples:

Expected: Email entered into the input field has the correct format.
Actual: The field is empty. The Email data is not correctly formatted, because the @ sign is missing.

Expected: Fetching data from the API endpoint will return the desired data.
Actual: You are not allowed to access that endpoint. The provided userId does not exist.

Developer Seniority is usually measured by the experience you've collected over time to adequately anticipate what could possibly go wrong at any point and how to mitigate these errors to increase developement efficiency.

A pragmatic codebase separates expected domain outcomes from unexpected infrastructure failures, applying different strategies across layers. During my research I stumbled over a few prominent approaches for different use cases which I would like to cover in the following sections.

### Domain / Business Logic

Core business rules have predictable branching (e.g., duplicate email, insufficient funds). TypeScript enforces checking every path and helps when the caller must make a business decision based on why the operation failed. Let's look at a function to create a new diary entry and improve it step by step to showcase this approach.

```ts
export default function CreateDiaryEntryPage() {
    const [formData, setFormData] = useState<DiaryEntryFormValues | undefined>(undefined);

    async function handleNewDiaryEntry () {
        const newDiaryEntry = await createDiaryEntry(formData);

        //...
    }

    return <form>
        {...}
    </form>
}
```

Imagine you didn't implement this `createDiaryEntry` function and you're goal is to simply create a new diary entry to move on with your feature. Suddenly your application fails and you see the error `"User is unauthorized"`.

How do you know why it fails? Well, we have a rough idea.
How do you know how to fix it to go on with your day? We can use a try/catch block to handle the error.
How do we know what other errors might be thrown before runtim? We don't.
How can we expect our users to know how to deal with these errors if we can't make sense of them ourselves? We can't.

This is frustrating. Now we have to inspect the function implementation of possibly multiple layers downwards to figure out what we can expect to cover all exceptions in the try/catch block. This is called _Leaky Abstraction_ and isn't ideal. Additionally, in catch blocks errors are always `unknown` an require manual checks:

```ts
export default function CreateDiaryEntryPage() {
    const [formData, setFormData] = useState<DiaryEntryFormValues | undefined>(undefined);

    async function handleNewDiaryEntry () {
        try{
            const newDiaryEntry = await createDiaryEntry(formData);
        } catch(err) {
            if(err === "User is unauthorized") //do something...
            else if(err === "Invalid data") //do something...
            else console.error("Unknown error", err)
        }
    }

    return <form>
        {...}
    </form>
}
```

What if `createDiaryEntry` logic was altered and an error was removed? We'd have unused code.
What if an error was added? We'd have an unhandled error that could break production code.

So let's try to improve this function ahead of time. This is the current function code:

```ts
async function createDiaryEntry(data: DiaryEntryFormValues) {
    const user = await DatabaseService.fetchUser(Id);
    if (!user) throw new Error('User is undefined');

    const permissions = await DatabaseService.fetchUserPermissions(user);
    if (!permissions.can('diaryEntry', 'create'))
        throw new Error('User unauthorized');

    const result = diaryEntrySchema.safeParse(data);
    if (!result.success) throw new Error('Invalida data');

    try {
        const diaryEntry = await createDiaryEntry({
            ...result.data,
            userId: user.id,
        });
        return diaryEntry;
    } catch {
        throw new Error('Unexpected error');
    }
}
```

First, we want the consumer to know what errors to expect. For this we can create a Typescript type that tells the consumer that the result of `createDiaryEntry` can either be successful and contain a data object or it failed and contains an error object. This i also called the Result Pattern or Either Pattern and looks something like this:

```ts
type Result<S, E extends { reason: string }> = [E, null] | [null, S];

function ok<S>(data: S): Result<S, never> {
    return [null, data];
}

function err<const R extends string, E extends { reason: R }>(
    error: E
): Result<never, E> {
    return [error, null];
}
```

By using the `ok` function to return successfully fetched data, and the `error` function for returning error messages, they automatically create Arrays satisfying the expected `Result` type that informs the consumer on what to expect:

```ts
async function createDiaryEntry(
    data: DiaryEntryFormValues
): Promise<Result<DiaryEntry, CreateDiaryEntryError>> {
    const user = await DatabaseService.fetchUser(Id);
    if (!user) return err({ reason: 'User is undefined' });

    const permissions = await DatabaseService.fetchUserPermissions(user);
    if (!permissions.can('diaryEntry', 'create'))
        return err({ reason: 'User unauthorized' });

    const result = diaryEntrySchema.safeParse(data);
    if (!result.success) return err({ reason: 'Invalida data' });

    try {
        const diaryEntry = await createDiaryEntry({
            ...result.data,
            userId: user.id,
        });

        return ok(diaryEntry);
    } catch {
        return err({ reason: 'Unexpected error' });
    }
}
```

The adjusted `createDiaryEntry` can now be consumed like this:

```ts
export default function CreateDiaryEntryPage() {
    const [formData, setFormData] = useState<DiaryEntryFormValues | undefined>(undefined);

    async function handleNewDiaryEntry () {
        const [error, diaryEntry] = await createDiaryEntry(formData);

        if(error === null) {
            //handle success case
        }

        const reason = error.reason;
        switch (reason){
            case "User unauthorized": {
                //handle error case
            }
            case "Invalid data": {
                //handle another error case
            }
            case "User is undefined": {
                //handle another error case
            }
            case "Unexpected error": {
                //handle another error case
            }
            default: {
                throw new Error(`Unhandled error: ${reason satisfies never}`)
            }
        }
    }

    return <form>
        {...}
    </form>
}
```

As no Error objects is being thrown and the database request is already being handled with a try/catch block inside `createDiaryEntry` , the try/catch block enclosing the `createDiaryEntry` call can be removed. As the result of `createDiaryEntry` is an Array containing either an error object or the requested data object as defined in the `Result` type. The advanced Typescript type allows for proper typesafety which suggests all possible errors that might occur to handle individually. This is thanks to the generic type `const R extends string` in the `err` function and is considered a discriminated union.

The `satisfies` keyword in the `default` case will show an error in our IDE if a reason hasn't been handled or isn't a possible error. This way we can handle different errors before runtime and keep all error cases updated.

Libraries like `effect` or `neverthrow` implement this functionality already for you.

### API Entry Point

//IN PROGRESS

### Data Access / Infrastructure

Network drops, database crashes, and third-party outages are unpredictable; manually wrapping every low-level query in a Result adds excessive noise.

//IN PROGRESS

//RFC 7807 compliant response?

### Global Error Boundary

Serves as the safety net: logs stack traces to observability tools (e.g., Sentry, Datadog) and returns generic 500 Internal Server Error to the client.

//IN PROGRESS

## Conclusion

Error handling is not an afterthought to patch around buggy code—it is an architectural design choice that defines your software's Developer Experience (DX) and system resilience.

To summarize the three core pillars:

1. **Domain Logic:** Treat expected domain failures as data using **Result Types** or discriminated unions. This makes business logic branching explicit, testable, and type-safe.
2. **Infrastructure:** Allow unexpected catastrophic failures (DB crashes, broken sockets) to **`throw`**, bubbling up directly to global boundaries.
3. **API Boundaries:** Translate domain errors into expressive **RFC 9457 Problem Details** payloads for clear client feedback, while letting global middleware capture unhandled exceptions.

By pairing type-safe predictable errors with solid global fallback nets, you make your codebase is easier to maintain, faster to debug, and significantly more pleasant to work in.

## Sources

- https://www.youtube.com/watch?v=ovnyeq-Xxrc
