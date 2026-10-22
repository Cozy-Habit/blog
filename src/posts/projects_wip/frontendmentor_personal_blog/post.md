---
title: FrontendMentor Challenge - Personal Blog
description: This is the description for this FrontendMentor project
tags: TypeScript, Next.js, Tailwind, HeroUI
date: 7th June, 2025
websiteLink: https://cozy-habit.github.io/
repoLink: https://github.com/Cozy-Habit/cozy-habit.github.io
---

# FrontendMentor Challenge - Personal Blog

Unfortunately, I don't have a subscription so I eyeballed everything based off the sample designs.
[Link to challenge](https://www.frontendmentor.io/challenges/personal-blog-lJpVCnmozL)

## Project Background

I wanted to create a centralized website on which I can share my personal coding journey while learning new technologies along the way.

## Static Previews

## TechStack

### TypeScript

### Next.js

### Tailwind

I also wanted to see what all the fuss is about Tailwind, so I finally played around with it throughout the course of this project.

### HeroUI

This component library caught my eye when I was researching on accessible libraries. It is headless but uses Tailwind for styling and React Aria as its base components to provide accessible and functional components.

## Strategy

- Add DevTools to make my life a little easier and keep my Codebase a little cleaner (ESLint, Prettier)
- First I am gonna build out the entire logic to make sure that it works before losing myself in the styling part
- Adding Tailwind and HeroUI

## Challenges and Solutions

### Statically generating the blog pages

https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props

Adding Github workflow to build the static pages.

Learning how fs library works.

### The morning I spent 4 hours trying to host Strapi on a cloud server

In case you're interested about a more detailed version of this entire Strapi ordeal you can read up on it here.

### Converting Markdown into React Components

After the entire Strapi ordeal I decided to go with the approach to add my posts as markdown files and have them statically exported as html files in the build process when uploading my application to Github Pages.

I needed to add a function so that Next.js could build the static pages based on the parameters:

```
//code
```

After creating a few mock-markdown files and seeing that it was working I wanted to have the content rendered with certain components to keep the styling and functionality consistent with the overall website.

To achieve that I used the react-remark package which reads the markdown content and depending on the tag it returns a react component of my choice with the content added to it.

```
//code
```

I also wanted to display certain information about the post on the feedpage as a teaser. I recalled that there was a package called grey-matter which let's you add tags to a markdown file and turn it into an object passing it to the grey-matter parser.

This way I was able to interate through all the markdown files and pass the metadata to the feed item component.

```
//code
```

This meant that I still needed to add all the metadata manually but it would suffice for now until I find a clever way to automate it without spending any money.

### Playing around with Remark Plugins

There's this set of Rehype and Remark Plugins. Rehype extends parsing features for HTML, whereas Remark focuses on Markdown.

### Creating a table of content from markdown headings

### Static pages build failed

StackOverflow to the rescue: https://stackoverflow.com/questions/79124951/type-error-in-next-js-route-type-params-id-string-does-not-satis

### BasePath incorrect for transforming image paths

Add env variable and basePath when fetching post content. Add env variable to github workflow as well. First I tried in the top level then i tried on step level.

## Learnings
