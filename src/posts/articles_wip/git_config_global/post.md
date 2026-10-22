---
title: Looking into Git Config files (+ cool Git aliases)
descr: My first steps on learning Git, handy tools and cool cheat sheet, as well as handy Git aliases
date: June 2th, 2025
thumbnail: https://img.icons8.com/badges/512/git.png
draft: true
---

# Looking into Git Config files

<!-- prettier-ignore-start -->

## Git Cheat Sheet

|command|explanation|
|---|----|
|`git config --list --show-origin`|lists all information of each config file, including the file's file system location|
|`git config --global alias.<alias> <command-to-be-aliased>`|add an alias for a git command. <br><br> Example: `git config --global alias.co "checkout"` and then you can run `git co` instead of `git checkout` to checkout a branch. <br><br> A new section will be added to your config: <br> `[alias] co = checkout`|
|`git config --global credential.helper store`|...|


## Git helpful aliases

|Alias|Command|
|---|---|
|`st`|`status`|
|`br`|`branch`|
|`co`| `checkout`|
|`sw`|`switch`|
|`c`|`commit`|
|`tree`|`log --all --graph --decorate --oneline`|

These are shell aliases:

|`stash`|`git add .; git stash` stage all files and stash|


<!-- prettier-ignore-end -->

//git help config help.autocorrect ?

## Sources

- [You Have Been Using Git The WRONG Way](https://www.youtube.com/watch?v=nzrU9xPPF80) by CodeHead
- [10 Levels of Git aliases: Beginner to Intermediate concepts](https://www.eficode.com/blog/10-levels-of-git-aliases-beginner-to-intermediate-concepts)
- [Share your best git alias you made](https://www.reddit.com/r/git/comments/1c8upsv/share_your_best_git_alias_you_made/) - Reddit Post
