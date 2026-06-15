# entourage-job-front — Claude Code Guide

## Project overview

Next.js + Redux + TypeScript frontend for the Entourage Pro platform — a network connecting job seekers, coaches, and companies.

**Related repos:**
- `entourage-job-back` — NestJS REST API (always update in parallel when touching API contracts)
- `entourage-landing-pages`, `entourage-tasks`, `sql-tools` — secondary repos

## Package manager

Always use **pnpm**, never npm.

```bash
pnpm add <package>      # install a dependency
pnpm install            # restore dependencies
```

`npm install` fails with `Cannot read properties of null (reading 'matches')` in this project.

## Code conventions

- **Comments and JSDoc must be written in English**, regardless of the conversation or PR language.
- UI strings and user-facing copy are in French — that is correct and intentional.

## Component system

**Never write raw HTML elements directly in business code.** Always use the component system.

### Two layers

| Layer | Location | Purpose |
|---|---|---|
| UI primitives | `src/components/ui/` | Generic, reusable — Button, Text, Input, Card, Spinner… |
| Business components | `src/components/` | App-specific — compose primitives + add domain logic |

### Primitives available (non-exhaustive)

`Button` · `Text` · `Headings` · `Inputs` (TextInput, TextArea, PhoneInput, DatePicker, CheckBox, Radio, SelectSimple…) · `Card` · `CardList` · `Tag` · `Badge` · `Alert` · `Spinner` · `Skeleton` · `Tooltip` · `Dropdown` · `Accordion` · `SimpleLink` · `SvgIcon` · `Images`

Import from the barrel: `import { Button, Text, Spinner } from '@/src/components/ui'`

### Styled-components conventions

Each component lives in its own folder with three files:

```
ComponentName/
  ComponentName.tsx          # React logic
  ComponentName.styles.ts    # Styled-components (named StyledComponentName)
  ComponentName.types.ts     # TypeScript types (when non-trivial)
  index.ts                   # export * from each file
```

- Styled component name: `Styled<ComponentName>` (e.g. `StyledButton`, `StyledCard`)
- Design tokens come from `src/constants/styles` (`COLORS`, `FONT_WEIGHTS`, etc.) — never hardcode hex values
- Conditional styles use `${({ prop }) => ...}` functions, not className toggling
- Hover / disabled states go in the styled component via `&:hover`, `&:disabled`

### When building new UI

1. Check if a primitive in `src/components/ui/` already covers the need
2. If the primitive needs a variant, add the variant prop there — don't fork it
3. If purely app-specific, create a business component in `src/components/` that composes primitives
4. Never create a new styled component that duplicates an existing primitive's responsibility

## Architecture notes

### State management
Redux with sagas. API calls flow: component → action → saga → `Api.*` → store.

### Network Directory feature (EN-9019)
The `NetworkDirectorySort` enum (`LAST_CONNECTION | RELEVANCE`) lives in `src/constants/network-directory.ts`. The `sort` parameter is threaded from URL → saga → `Api.getAllUsersProfiles` → backend query param.

For `RELEVANCE` sort the backend runs `findBySimilarity(annPoolSize=500, poolSize=500)` — expect higher latency than `LAST_CONNECTION`.

### Recommendation / embeddings
Profile similarity is computed server-side (pgvector + VoyageAI `voyage-4-lite`, 1024 dims). The front only passes filter params; scoring is entirely backend responsibility.

## Cross-repo workflow

When a change touches an API endpoint, update both repos in the same session:
1. Update the backend controller/service in `entourage-job-back`
2. Update the API type in `src/api/types.ts` and the consuming saga/hook in the front
