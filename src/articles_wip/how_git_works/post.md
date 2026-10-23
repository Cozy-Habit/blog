---
title: How Git works under the hood
descr: I have always been wondering about how Git actually works behind the scenes. I want to explore a few of the concepts in this post.
date: June 2th, 2025
thumbnail: https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-512.png
---

# How Git works under the hood

When using my standard git operations such as `git checkout`, `git pull`, `git push`, etc. I have always been wondering about how Git actually works behind the scenes. I want to explore a few of the concepts in this post.

## How does git store the local and remote branches?

`.git/refs/head` -> stores the data for the local branches

`.git/refs/remotes` -> stores the data for the remote branches

The files inside `.git/refs/origin/feature` (or more typically, `.git/refs/remotes/origin/feature-branch`) represent **references** or **pointers** to specific commits in the Git history. These files store a commit hash that points to the **latest commit** on the `origin/feature-branch` (the remote-tracking branch for your feature branch).

Here’s a breakdown of what you’re seeing:

### What’s Inside `.git/refs/remotes/origin/feature-branch`?

- This file contains the **commit SHA** (the unique hash identifier) of the **latest commit** on the remote `origin/feature-branch`.
- This SHA is what Git uses to keep track of the state of that branch on the remote repository.

When you run `git fetch`, Git updates this file with the latest commit hash from the remote repository. However, it does **not** merge these changes into your local branch automatically unless you explicitly tell it to (via `git merge` or `git pull`).

### Example of What’s Inside:
Suppose you look inside the file `.git/refs/remotes/origin/feature-branch` and see something like:

```
8b23cf023e90214d60a41c568ae99d5d7e3129f1
```

This string is the SHA-1 hash of the latest commit on the `origin/feature-branch`. It tells Git which commit is the tip of that branch on the remote (i.e., `origin`).

### How Does Git Use This?
1. **Tracking the remote branch**: Git stores the latest commit hash in these files to help you track the state of remote branches.
   - For example, if your local `feature-branch` diverges from `origin/feature-branch`, Git compares the commit hashes of these branches to identify differences.
   
2. **Merging changes**: When you run `git merge origin/feature-branch`, Git reads this commit hash, fetches the corresponding commit, and then merges it into your local branch.

3. **Keeping local and remote branches in sync**: This reference lets Git know where the remote branch is, so it can easily sync up (using `git pull` or `git fetch`).

### Remote-tracking branches (`origin/feature-branch`):
- These are not your **local branches**, but rather **copies of remote branches** (which are fetched from the remote repository).
- Remote-tracking branches exist inside `.git/refs/remotes/`, and Git keeps them up-to-date when you run `git fetch`

In short, this file inside `.git/refs/remotes/origin/feature-branch` is a pointer to the latest commit on the remote feature branch (`origin/feature-branch`). It helps Git track the state of the branch on the remote repository.


## Where is the actual data for each branch stored?

- **All the data required for a merge is stored in the `.git` directory**, including commit, tree, and blob objects.
- You can view and interact with this data using Git commands, which provide an abstraction layer over the underlying files, making it easier to work with the repository without directly accessing the raw object files.
- This structure allows Git to perform merges and other operations efficiently, leveraging the commit hashes to access the necessary state of the project at any given point.

---
## How does `git fetch`, `git merge` and `git pull` work? 

`git fetch` + `git merge origin/development` -> will pull last changes from development branch

Imagine it like a dog fetching branches (remote branches). If you don't specify what it should fetch `git fetch` it'll fetch all the branches for you. If you prompt it to fetch a specific branch `git fetch <namespace> <branch-name>` it'll fetch only that branch. Usually `<namespace>` will be called `origin` by default as this is the origin you cloned the repo from.

You can then prepare the branch you have with the branch the dog just fetched for you and compare the differences between them with `git diff <local-branch-name> <remote-branch-name>`. You can then take the branch from the dog `git merge <remote-branch-name>`.


## Why is it called 'git fetch origin feature-branch' instead of 'git fetch origin/feature-branch' like the merge command?

The different syntaxes (`git fetch origin feature-branch` vs. `git merge origin/feature-branch`) reflect **different concepts** Git is working with, even though they seem similar on the surface.

### 1. **`git fetch` is about communication with the remote repository**:

- When you run `git fetch`, you are talking to the remote repository (`origin`). Git doesn’t care if that branch exists locally yet. It’s just saying: "Ask the remote `origin` to give me the latest updates on `feature-branch`." That’s why you just write the branch name — it’s about what exists **on the remote**.

### 2. **`git merge` is about merging local branches**:

- When you run `git merge origin/feature-branch`, you are merging **what you’ve already fetched** from the remote into your current branch. By this point, `origin/feature-branch` exists **locally** as a remote-tracking branch. So, you refer to that local reference using the `origin/branch` notation.

### The Core Difference:

- **`git fetch` is asking for remote info (which is always remote-focused)**.
- **`git merge` works with your local knowledge of the remote branches (which are local-focused)**.

So, while yes, it's a syntactical difference you have to "deal with," it also stems from the fact that these commands interact with branches in **different contexts**. Git tries to make it clear where the branch is coming from—either directly from a remote or from your local tracking references of the remote.