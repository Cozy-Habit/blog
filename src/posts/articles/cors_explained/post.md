---
title: CORS
date: June 1st, 2025
descr: What CORS is, how it works and its limitations
---

# CORS Explained

Have you seen this error when looking into your network tab of your DevTools?

```
Access to fetch at 'https://example.com/data' from origin 'http://localhost:3000' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## Table of contents

- [What is CORS?](#what-is-cors)
- [Why the CORS error is shown](#why-the-cors-error-is-shown)
- [How to fix the CORS error](#how-to-fix-the-cors-error)
- [Limitations of CORS](#limitations-of-cors)

## What is CORS?

CORS stands for Cross-Origin Resource Sharing and is a security feature of the browser software. CORS manages which websites are allowed to access the resources on a server. Let's dissect it:

- Cross-Origin: a request from a different domain, protocol, or port than your own.
- Resource: the data or API endpoint you’re trying to access.
- Sharing: allowing that cross-origin request by explicitly sending permission headers.

## Why the CORS error is shown

Imagine the server having a bodyguard to check who's on the guest list and you simply not being invited to the party. The bodyguard telling you you're not on it is the CORS error.

Let's put it into technical terms. When you send a request from your frontend to a server, the browser enforces the Same-Origin Policy (SOP). SOP checks the protocol, domain, and port of the request. If they don’t match, the server must explicitly allow it. The response contains the Access-Control-Allow-Origin header. The browser will check if your endpoint is listed in that header. If so you're good to go and the browser will process the resource. If not then this means that the server denied you access to the requested resource, because your endpoint is not allowed to do so. The browser will notify you about it with an error message in the console.

The CORS error also pops up if you write your own backend service and forget to configure CORS so that the server doesn't include the Access-Control-Allow-Origin header in the response to the browser. The browser will automatically dispose of anything that doesn't have that header as a security mechanism.

## How to fix the CORS error

If you don't have the authority to change the backend service code because it's a third-party service then there's little you can do. But if you can you might want to research on how to either add the CORS header and/or whitelist the desired endpoint so that you can request the resource from that server for the specific tools used on the backend.

You should never “fix” CORS by disabling it or using \* in production unless you truly want all origins allowed.

## Limitations of CORS

Unfortunately, CORS has its limits and can't protect the user from all the attacks out there.

One known attack is called CSRF which stands for Cross-Site Request Forgery. CORS only checks whether or not to show the response to the user. Imagine an attacker can lure the user into clicking a link leading to an evil website which sends a request to a banking server to execute a transaction to the attacker's bank details. The browser automatically attaches the respective cookies needed for authentication in the server request which means that it will bypass authentication security. Once SOP gets to do its job in the browser the payment has long been executed. It will see that the origin (browser) is not allowed to access the server's resources so it discards the response which could be something like 'Transaction successful' and instead the browser will throw the CORS error. The attacker doesn't care as they've already received the transaction and bought some nice shoes from their bounty.

CSRF is mitigated using CSRF tokens or SameSite cookies, not by CORS

As CORS is a feature inside the browser to protect the user it won't work if `curl` is used inside the terminal.

## Sources

- [Video - Master CORS / ByteMonk](https://www.youtube.com/watch?v=E6jgEtj-UjI&t=20s)
- University Course Databases and Web Technologies by Prof. Andreas Hannig
