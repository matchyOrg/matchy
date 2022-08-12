# Contributing Guide
Welcome, interested person! Contributions are welcome. If you're ever unsure, feel free to open an issue.

Preferably, features are developed in another branch or fork. After the feature is ready, a pull request to the master branch should be opened.

This file contains everything you need to know to contribute to this project.
<br><br>

**Table of Contents:**
- [Contributing Guide](#contributing-guide)
- [Frontend](#frontend)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Recommended Tooling](#recommended-tooling)
  - [Used Libraries](#used-libraries)
  - [Recommended IDE Setup](#recommended-ide-setup)
  - [Customize configuration](#customize-configuration)
  - [Project Setup](#project-setup)
    - [Re-generate Supabase Types](#re-generate-supabase-types)
    - [Compile and Hot-Reload for Development](#compile-and-hot-reload-for-development)
    - [Type-Check, Compile and Minify for Production](#type-check-compile-and-minify-for-production)
    - [Run Unit Tests with Vitest](#run-unit-tests-with-vitest)
    - [Lint with ESLint](#lint-with-eslint)
- [Backend](#backend)
- [What's next?](#whats-next)
<br><br><br><br>

# Frontend
## Prerequisites
- [Node 16 or greater](https://nodejs.org/en/). Don't install Chocolatey.
- A code editor (see below)

## Setup
1. Fork the repository
2. Clone your fork
3. Open the `frontend` folder in your IDE
4. `npm install`
5. `npm run dev`

## Recommended Tooling
I recommend using [Visual Studio Code](https://code.visualstudio.com/) with
- [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) to format your files
- Settings &rarr; Format On Save &rarr; Enable (`"editor.formatOnSave": true,`)
  - If you are using autosave: Settings &rarr; Autosave &rarr; On Focus Change (`"files.autoSave": "onFocusChange",`)
- [Vue Language Features (Volar) Extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for Vue.js
- [TypeScript Vue Plugin (Volar) Extension](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) for Vue.js. Take-over mode is *not* recommended, so just get this plugin.
- [UnoCSS](https://marketplace.visualstudio.com/items?itemName=antfu.unocss) 
- [(optional)Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens) to see all the errors inline with the code
- [(optional)TODO Highlight Extension](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
- [(optional - project specific)Eslint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) to automatically show lots of little warnings
- [(optional - project specific)i18n Ally](https://marketplace.visualstudio.com/items?itemName=Lokalise.i18n-ally) for translating and internationalizing code

As for settings, I personally am a fan of those "inlay hints". <br>
I also totally recommend using a decent browser such as Firefox or a Chromium browser with
- [Vue Devtools](https://devtools.vuejs.org/) to get top-notch debugging support

## Used Libraries
The most important ones are
- [Typescript](https://www.typescriptlang.org/) - Typesafe Javascript
- [Vue 3](https://github.com/vuejs/vue-next/) - Vue 3 with [the composition API](https://vuejs.org/guide/extras/composition-api-faq.html#what-is-composition-api)
- Vant for our UI components *and for icons*

We are also using
- [Vite](https://github.com/vuejs/vite) - a speedy Vue.js framework

## Recommended IDE Setup
[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration
See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Re-generate Supabase Types
[Read here about Supabase Typescript types](https://supabase.com/docs/guides/api/generating-types)
```sh
npm run type-gen
```

### Compile and Hot-Reload for Development
```sh
npm run dev
```

### Type-Check, Compile and Minify for Production
```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)
```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
<br><br><br><br>

# Backend
As you probably noticed, we didn't write any backend and are using the BaaS called [supabase](https://supabase.com/).
Check out [this sweet demo](https://supabase.com/docs/guides/with-vue-3) to find out how to get started with vue and let me know what your email address is so I can give you access to our supabase workspace (haha that rhymes nicely).
<br><br><br><br>

# What's next?
Next you can:
- check out the existing documentation in `./docs`
- [join our discord](https://discord.gg/tFf2RkTg) 🙌
- let your friends know about this project 🤝
