---
name: update-libraries
description: Generate or update LIBRARIES.md at the root of the entourage-job-front repo to document all npm dependencies in package.json. Use when the user asks to "update libraries", "sync LIBRARIES.md", "update the library doc", or when package.json has changed.
allowed-tools: Bash, Read, Edit, Write, Grep, Glob
---

Generate or update `LIBRARIES.md` at the root of the entourage-job-front repo to reflect the current state of `package.json`.

## Context

This is a **single-package Next.js 15 / React 19 frontend** with one `package.json` at the root. There are no sub-projects or workspaces — all dependencies are declared in that single file.

## Steps

### 1. Read the current dependency list

Extract all `dependencies` and `devDependencies` from `entourage-job-front/package.json`. Separate them clearly — production deps drive the app, devDependencies are build/test/tooling only.

### 2. Detect changes against LIBRARIES.md (if it exists)

- New packages not yet documented → add them
- Packages no longer in package.json → remove them
- Version bumps → update version and release date fields
- No changes → state so and exit

### 3. For new or updated packages, understand their usage

Search the source files (`src/**/*.{ts,tsx,js}`) to understand how the package is actually used in this codebase before writing the entry.

### 4. Write each entry in this format

```
### `package-name`

| | |
|---|---|
| **Version** | `x.y.z` |
| **Release date** | Month YYYY (approximate) |
| **Changelog** | [CHANGELOG.md](url) |

One-sentence description of what the library does.

**Used in:** which parts of the app use it and what for.

**Alternatives:** comma-separated alternatives.
```

### 5. Group entries under the following thematic sections

Use these groups (create new ones if a package doesn't fit):

**Production dependencies:**
- Framework & Routing — Next.js, React, React DOM
- State Management — Redux Toolkit, Redux Saga, typed-redux-saga, React Redux
- UI Components & Styling — Styled Components, UIKit, Lucide React, Swiper, React Modal, React Select, React Tooltip, React Spinners, React Transition Group, React Phone Number Input, React Share, React Visibility Sensor, React Countdown, React Image File Resizer
- Maps — Google Maps React
- Forms — React Hook Form
- Real-time — Pusher JS
- HTTP & Networking — Axios, cors, express, express-sslify
- Monitoring & Observability — Sentry (react, node, tracing, webpack-plugin), Datadog Browser RUM, dd-trace
- Utilities — Lodash, Moment, UUID, Validator, Cookies-next, check-password-strength, array-move, string-hash, mobile-detect, use-deep-compare-effect, dotenv, rxjs, postcss, less, prop-types

**Dev dependencies *(dev)*:**
- Testing — Jest, Testing Library (react, jest-dom), Cypress, Faker, Storybook 8, Chromatic, expect
- Linting & Formatting — ESLint (airbnb config, next plugin, typed-redux-saga plugin, import, react, react-hooks, jsx-a11y, prettier, storybook, typescript, jest, cypress plugins), Prettier, TypeScript ESLint
- Build Tooling — TypeScript, Webpack, SVGR, tsconfig-paths-webpack-plugin, next-with-less, less-loader, babel-plugin-styled-components, circular-dependency-plugin
- Developer Experience — Husky, Lint-staged, npm-run-all

### 6. Write the file

Produce `LIBRARIES.md` with this structure:

```
# Libraries

All npm packages declared in `package.json`, grouped by theme.

---

## [Group name]

### `package-name`
...

---
```

Mark dev-only packages with *(dev)* in their section header or inline.

Be precise about versions — use the exact version string from `package.json` (e.g. `^19.0.0`, `15.4.10`).
