# Libraries

All npm packages declared in `package.json`, grouped by theme.

---

## Framework & Routing

### `next`

| | |
|---|---|
| **Version** | `16.2.12` |
| **Release date** | November 2025 (approximate) |
| **Changelog** | [releases](https://github.com/vercel/next.js/releases) |

React framework providing routing, SSR/SSG, and the build/dev pipeline.

**Used in:** Core of the app — `src/pages/*` (Pages Router), `src/pages/_app.tsx` (global providers, Datadog RUM init, global CSS imports), `next.config.mjs` (Turbopack SVG rules, webpack fallback, `dotenv` loading). `dev`/`build`/`start` scripts run via `--turbopack`.

**Alternatives:** Remix, Vite + React Router, Gatsby.

### `react` / `react-dom`

| | |
|---|---|
| **Version** | `19.2.8` |
| **Release date** | December 2024 (React 19 initial), patch releases ongoing (approximate) |
| **Changelog** | [react changelog](https://github.com/facebook/react/blob/main/CHANGELOG.md) |

Core UI library and its DOM renderer.

**Used in:** App-wide — every component, hook and page.

**Alternatives:** Vue, Svelte, SolidJS.

---

## State Management

### `@reduxjs/toolkit`

| | |
|---|---|
| **Version** | `^2.12.0` |
| **Release date** | 2023 (RTK 2.0), ongoing minor releases (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/reduxjs/redux-toolkit/blob/master/CHANGELOG.md) |

Opinionated toolset for Redux (slices, thunks, store configuration).

**Used in:** `src/store/store.ts` (`configureStore`, `combineReducers`, custom `listenerMiddleware`), ~15 `*.slice.ts` files under `src/use-cases/*` (registration, profiles, notifications, onboarding, authentication, current-user, company, refering, recruitement-alerts, onboardingOld), plus `src/store/utils/createRequestAdapter/` (custom async-request-state adapter) and an RTK Query-style `api.slice.ts`.

**Alternatives:** Zustand, Jotai, MobX, plain Context API.

### `react-redux`

| | |
|---|---|
| **Version** | `^9.3.0` |
| **Release date** | 2023 (v9 major), ongoing (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/reduxjs/react-redux/blob/master/CHANGELOG.md) |

Official React bindings for Redux (`useSelector`, `useDispatch`, `Provider`).

**Used in:** Extremely widely (155 files) across `src/use-cases/*`, `src/hooks/*`, `src/features/*`, and `_app.tsx` (`Provider`).

**Alternatives:** Zustand, Jotai, Context API.

### `rxjs`

| | |
|---|---|
| **Version** | `^7.8.2` |
| **Release date** | 2021 (v7 major), ongoing (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md) |

Reactive extensions library (Observables, Subjects, operators).

**Used in:** `src/features/modals/Modal/openModal.tsx` only — implements an imperative, observable-based API for opening modals outside the normal React render tree.

**Alternatives:** plain event emitters, XState, Zen Observable.

---

## HTTP & Realtime

### `axios`

| | |
|---|---|
| **Version** | `^1.18.1` |
| **Release date** | 2024–2025, 1.x line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/axios/axios/blob/v1.x/CHANGELOG.md) |

Promise-based HTTP client.

**Used in:** `src/api/api.ts` (central `Api` class wrapping `axios.create()`), `src/api/interceptor.ts` (typed interceptors), `src/api/axiosErrors.ts` (`AxiosError` handling), and ~14 `src/use-cases/*/*.api.ts` files plus some feature components.

**Alternatives:** native `fetch`, ky, superagent.

### `pusher-js`

| | |
|---|---|
| **Version** | `^7.6.0` |
| **Release date** | 2022–2023, 7.x line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/pusher/pusher-js/blob/master/CHANGELOG.md) |

WebSocket client for the Pusher Channels realtime service.

**Used in:** `src/constants/pusher.ts` — a `getPusher()` singleton defining the `profile-generation-channel` and `embedding-channel` channels for realtime AI profile-generation/embedding status updates in the messaging/AI features.

**Alternatives:** Socket.IO, Ably, native WebSocket.

---

## UI Components & Styling

### `styled-components`

| | |
|---|---|
| **Version** | `^6.4.4` |
| **Release date** | 2022 (v6 major), ongoing (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/styled-components/styled-components/blob/main/CHANGELOG.md) |

CSS-in-JS library for component-scoped styling.

**Used in:** Nearly all component styling app-wide (283 files, `*.styles.ts`/`.styles.tsx` across `src/components/ui/*` and `src/features/*`); configured globally in `_app.tsx` via `StyleSheetManager` with a custom `shouldForwardProp`, plus `src/styles/GlobalStyle.ts` for global CSS. See the project's [component system conventions](../CLAUDE.md) for the `Styled<ComponentName>` pattern.

**Alternatives:** Emotion, CSS Modules, Tailwind CSS, vanilla-extract.

### `@emotion/is-prop-valid`

| | |
|---|---|
| **Version** | `^1.4.0` |
| **Release date** | 2023–2024 (approximate) |
| **Changelog** | [releases](https://github.com/emotion-js/emotion/releases) |

Validates whether a string is a real DOM/SVG attribute.

**Used in:** `src/styles/shouldForwardProp.ts`, as the global `shouldForwardProp` filter passed to styled-components' `StyleSheetManager` in `_app.tsx`, to stop non-DOM props from leaking onto native elements.

**Alternatives:** manual prop allowlists, `@styled-system/should-forward-prop`.

### `uikit`

| | |
|---|---|
| **Version** | `3.6.22` |
| **Release date** | ~2021 (approximate) |
| **Changelog** | [changelog](https://github.com/uikit/uikit/blob/develop/changelog.md) |

Lightweight CSS/JS UI framework (grid, offcanvas, utility classes).

**Used in:** A customized/vendored fork — comment in `_app.tsx` notes "modified version of UIkit because of a bug where we can't touch scroll on Offcanvas". CSS imported globally from `src/styles/dist/css/uikit.entourage.min.css`; JS API used directly in `src/hooks/useUploadImage.ts`, `src/components/ui/Grid.tsx`, `src/components/ui/Carousel/Carousel.tsx`, and its utility classes are used across ~40 files.

**Alternatives:** Bootstrap, Tailwind CSS, Bulma.

### `lucide-react`

| | |
|---|---|
| **Version** | `^0.447.0` |
| **Release date** | October 2024 (approximate) |
| **Changelog** | [releases](https://github.com/lucide-icons/lucide/releases) |

React icon component set.

**Used in:** `src/components/ui/Icons/LucidIcon.tsx`, a single wrapper component centralizing icon rendering, reused elsewhere (e.g. `AssistantMessageBubble.tsx` in the AI messaging panel).

**Alternatives:** react-icons, Font Awesome, Heroicons.

### `react-modal`

| | |
|---|---|
| **Version** | `^3.16.3` |
| **Release date** | 2023 (approximate) |
| **Changelog** | [releases](https://github.com/reactjs/react-modal/releases) |

Accessible modal/dialog component.

**Used in:** `src/features/modals/Modal/Modal.tsx`, the core generic modal wrapper used across the app's modal system (`ModalGeneric`, etc.).

**Alternatives:** Radix UI Dialog, Headless UI, native `<dialog>`.

### `react-select`

| | |
|---|---|
| **Version** | `^5.10.1` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [releases](https://github.com/JedWatson/react-select/releases) |

Customizable select/dropdown component (standard, async, creatable).

**Used in:** `src/components/ui/Inputs/Selects/Selects.tsx`, `Select/Select.tsx`, `SelectAsync/SelectAsync.tsx`, `SelectCreatable/SelectCreatable.tsx` — the shared Select component family, also referenced in `src/features/forms/utils/computeCompletionRate.utils.ts`.

**Alternatives:** downshift, Radix UI Select, native `<select>`.

### `react-tooltip`

| | |
|---|---|
| **Version** | `^5.28.0` |
| **Release date** | 2024–2025 (approximate) |
| **Changelog** | [releases](https://github.com/ReactTooltip/react-tooltip/releases) |

Tooltip component.

**Used in:** `src/pages/_app.tsx` (global CSS import), providing app-wide tooltip functionality.

**Alternatives:** Radix UI Tooltip, Floating UI.

### `react-spinners`

| | |
|---|---|
| **Version** | `^0.13.8` |
| **Release date** | 2022 (approximate) |
| **Changelog** | [releases](https://github.com/davidhu2000/react-spinners/releases) |

Collection of loading spinner components.

**Used in:** `src/components/ui/Spinner/Spinner.tsx`, the app's single shared loading spinner wrapper.

**Alternatives:** custom CSS spinners, react-loading.

### `react-transition-group`

| | |
|---|---|
| **Version** | `^4.4.5` |
| **Release date** | 2022 (approximate) |
| **Changelog** | [releases](https://github.com/reactjs/react-transition-group/releases) |

Low-level animation helpers for component mount/unmount transitions.

**Used in:** `src/components/ui/Notification/NotificationWrapper.tsx` only, animating toast/notification enter-exit transitions.

**Alternatives:** Framer Motion, react-spring.

### `swiper`

| | |
|---|---|
| **Version** | `^12.1.2` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [releases](https://github.com/nolimits4web/swiper/releases) |

Touch-enabled slider/carousel library.

**Used in:** `src/components/ui/CarouselSwiper/CarouselSwiper.tsx` and `src/features/backoffice/companies/CompanyProfile/CompanyParts/CompanyCollaboratorsPreviewList/` — the swipeable carousel component and a company-collaborators preview carousel.

**Alternatives:** react-slick, embla-carousel, Keen Slider.

### `react-lite-youtube-embed`

| | |
|---|---|
| **Version** | `^3.3.3` |
| **Release date** | 2023 (approximate) |
| **Changelog** | [releases](https://github.com/ibrahimcesar/react-lite-youtube-embed/releases) |

Lightweight, facade-based YouTube embed component.

**Used in:** `src/pages/_app.tsx` (global CSS import), `src/features/backoffice/elearning/elearning-unit/ElearningUnit.styles.ts`, `src/features/partials/pages/Entreprises/EntreprisesVideo/EntreprisesVideo.tsx` — video embeds on marketing pages and the e-learning unit feature.

**Alternatives:** react-youtube, native `<iframe>`.

### `react-countup` / `react-visibility-sensor`

| | |
|---|---|
| **Version** | `react-countup ^4.4.0`, `react-visibility-sensor ^5.1.1` |
| **Release date** | 2020–2021 (approximate) |
| **Changelog** | [react-countup releases](https://github.com/glennreyes/react-countup/releases) · [react-visibility-sensor releases](https://github.com/joshwnj/react-visibility-sensor/releases) |

Animated number counter, paired with a viewport-visibility detector to trigger the animation on scroll.

**Used in:** `src/features/partials/utils/NumberGrid/NumberCard.tsx` only — animated stat counters on marketing/landing pages, triggered when scrolled into view.

**Alternatives:** Framer Motion `useInView` + custom tweening, react-intersection-observer.

### `react-share`

| | |
|---|---|
| **Version** | `^5.3.0` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [releases](https://github.com/nygardk/react-share/releases) |

Social network share button components.

**Used in:** `src/features/partials/CV/CVShareButtons/CVShareButtons.tsx` only, for sharing candidate CV/profile pages to social networks.

**Alternatives:** hand-rolled share links (intent URLs), react-social-share-buttons.

### `react-phone-number-input`

| | |
|---|---|
| **Version** | `^3.4.12` |
| **Release date** | 2024–2025 (approximate) |
| **Changelog** | [releases](https://github.com/catamphetamine/react-phone-number-input/releases) |

Phone number input with country-aware formatting and validation.

**Used in:** `src/components/ui/Inputs/PhoneInput/PhoneInput.tsx` (the shared phone input component), consumed by ~10 form schemas (registration, referral, company contact, personal data). Its CSS is globally imported in `_app.tsx`.

**Alternatives:** libphonenumber-js directly, react-international-phone.

### `react-image-file-resizer`

| | |
|---|---|
| **Version** | `^0.3.11` |
| **Release date** | 2019 (approximate) |
| **Changelog** | [releases](https://github.com/onurzorluer/react-image-file-resizer/releases) |

Client-side image resizing before upload.

**Used in:** `src/hooks/useUploadImage.ts` only, to resize avatars/photos client-side prior to upload, alongside `uikit`'s upload/progress helpers.

**Alternatives:** browser-image-compression, canvas-based manual resizing.

### `@svgr/webpack`

| | |
|---|---|
| **Version** | `^8.1.0` |
| **Release date** | 2023 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/gregberge/svgr/blob/main/CHANGELOG.md) |

Build-time transform converting SVG files into React components.

**Used in:** Not imported in `src/`; configured directly in `next.config.mjs` (Turbopack `rules` for `*.svg` and the webpack fallback loader), enabling `import Icon from './icon.svg'` usage across the app. Also backs the `add-icons` script (`assets/icons/export-script.js`).

**Alternatives:** `next/image` with static SVGs, manual inline SVG components.

---

## Forms & Validation

### `react-hook-form`

| | |
|---|---|
| **Version** | `^7.54.2` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/react-hook-form/react-hook-form/blob/master/docs/CHANGELOG.md) |

Performant form state management and validation library.

**Used in:** The primary form-handling library across the app (~24 files) — `src/components/ui/Inputs/Inputs.types.ts` (shared typing), all edit/registration/onboarding forms under `src/features/forms/`, `src/features/registration/`, and `src/features/profile/`.

**Alternatives:** Formik, native form state with `useState`, TanStack Form.

### `validator`

| | |
|---|---|
| **Version** | `^13.15.22` |
| **Release date** | 2024–2025, 13.x line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/validatorjs/validator.js/blob/master/CHANGELOG.md) |

String validation and sanitization utilities.

**Used in:** Form schema files under `src/features/forms/schemas/*` (e.g. `formLostPwd.ts`, `formAddUser.tsx`, `formLogin.ts`, `formCompanyContact.ts`) and registration forms — mainly `isEmail` for email validation and `equals` for confirmation-field matching, across ~13 files.

**Alternatives:** zod, yup, Joi.

### `check-password-strength`

| | |
|---|---|
| **Version** | `^2.0.10` |
| **Release date** | 2021 (approximate) |
| **Changelog** | [releases](https://github.com/DerekPeirce/check-password-strength/releases) |

Password strength scoring utility.

**Used in:** Registration and password-related forms — `formRegistrationAccount.tsx`, `formRegistrationRefererAccount.tsx`, `formFinalizeReferedUser.tsx`, `formResetPassword.tsx`, `formChangePassword.tsx` — for client-side password strength feedback.

**Alternatives:** zxcvbn, custom regex-based scoring.

### `prop-types`

| | |
|---|---|
| **Version** | `^15.8.1` |
| **Release date** | 2022 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/facebook/prop-types/blob/main/CHANGELOG.md) |

Runtime prop type validation for React components.

**Used in:** Confined to legacy, pre-TypeScript-migration `.js` files — `src/store/DataProvider.js`, `src/pages/entourage-pro.tsx`, `src/pages/partenaires.tsx`, `src/features/modals/Modal/ModalGeneric/ModalNotificationSending/ModalNotificationSending.js`.

**Alternatives:** TypeScript prop typing (the direction the rest of the codebase has already moved to).

---

## Content Rendering

### `marked`

| | |
|---|---|
| **Version** | `4` |
| **Release date** | 2022, v4 line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/markedjs/marked/blob/master/CHANGELOG.md) |

Markdown-to-HTML parser.

**Used in:** `src/features/backoffice/messaging/MessagingAIPanel/AssistantMessageBubble/AssistantMessageBubble.tsx`, to render AI assistant markdown responses, sanitized afterward via `dompurify`.

**Alternatives:** markdown-it, remark.

### `dompurify`

| | |
|---|---|
| **Version** | `^3.4.1` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/cure53/DOMPurify/blob/main/CHANGELOG.md) |

HTML sanitizer to prevent XSS.

**Used in:** Same `AssistantMessageBubble.tsx` component, sanitizing `marked`-rendered HTML before injecting AI assistant chat responses into the DOM.

**Alternatives:** sanitize-html, isomorphic-dompurify.

---

## Utilities & Hooks

### `lodash`

| | |
|---|---|
| **Version** | `^4.18.1` |
| **Release date** | 2021, 4.x line (approximate) |
| **Changelog** | [releases](https://github.com/lodash/lodash/releases) |

General-purpose utility library (collections, cloning, comparisons).

**Used in:** Broadly (~20 files) — `src/hooks/useUpdateUser.tsx`, `useUpdateCompany.ts`, `src/use-cases/registration/registration.selectors.ts`, `src/features/cards/CandidatCard.tsx`, `src/constants/departements.ts`, `src/utils/Filters.ts`, `src/hooks/useFilters.ts`.

**Alternatives:** native ES methods, Ramda, es-toolkit.

### `moment`

| | |
|---|---|
| **Version** | `^2.30.1` |
| **Release date** | 2023 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/moment/moment/blob/develop/CHANGELOG.md) |

Date/time parsing and formatting library (maintenance mode upstream).

**Used in:** ~26 files — date formatting/parsing across forms, webinar/event select labels (e.g. `SelectOptionWebinarLabel.tsx`), and legal pages (`src/pages/cgu.tsx`).

**Alternatives:** date-fns, Day.js, Temporal (native, future).

### `uuid`

| | |
|---|---|
| **Version** | `^11.1.1` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/uuidjs/uuid/blob/main/CHANGELOG.md) |

RFC-compliant UUID generation.

**Used in:** ~24 files including Storybook stories (`ProfileCard.stories.tsx`, `CardList.stories.tsx`, `CompanyCard.stories.tsx` for mock IDs) and app code such as `src/features/navs/NavConnected/NavConnectedContent/NavConnectedContent.mobile.tsx` and `src/components/Layout.tsx`.

**Alternatives:** `crypto.randomUUID()` (native), nanoid.

### `mobile-detect`

| | |
|---|---|
| **Version** | `^1.4.5` |
| **Release date** | 2020 (approximate) |
| **Changelog** | [releases](https://github.com/hgoebl/mobile-detect.js/releases) |

User-agent-string based device/OS detection.

**Used in:** `src/hooks/utils/usePlatforms.ts`, instantiated with the SSR-provided `userAgent` (`useSSRDataContext`) to determine desktop vs. mobile/tablet for SSR-safe responsive behavior, combined with `@react-hook/window-size` for client-side updates.

**Alternatives:** `ua-parser-js`, CSS-only responsive design (media queries).

### `use-deep-compare-effect`

| | |
|---|---|
| **Version** | `^1.8.1` |
| **Release date** | 2021 (approximate) |
| **Changelog** | [releases](https://github.com/kentcdodds/use-deep-compare-effect/releases) |

`useEffect` variant that deep-compares dependencies instead of reference-comparing them.

**Used in:** `src/features/backoffice/admin/members/MemberList/MemberList.tsx` and `src/features/backoffice/admin/organizations/OrganizationList/OrganizationList.tsx`, avoiding unnecessary effect re-runs when filter objects are referentially different but deeply equal.

**Alternatives:** manual `JSON.stringify` dependency, `useMemo`-stabilized dependencies.

### `@n8tb1t/use-scroll-position`

| | |
|---|---|
| **Version** | `^2.0.3` |
| **Release date** | 2020 (approximate) |
| **Changelog** | [releases](https://github.com/n8tb1t/use-scroll-position/releases) |

React hook tracking window scroll position.

**Used in:** `src/hooks/useIsAtBottom.ts` only, to detect when the user has scrolled to the bottom of the page, paired with `@react-hook/window-size`.

**Alternatives:** manual `window.addEventListener('scroll', ...)`, `react-use`'s `useScroll`.

### `@react-hook/change`

| | |
|---|---|
| **Version** | `^1.0.0` |
| **Release date** | 2019 (approximate) |
| **Changelog** | [releases](https://github.com/react-hookz/web/releases) |

Hook that fires a callback only when a tracked value actually changes.

**Used in:** `src/hooks/useUpdateUser.tsx` and `src/hooks/useUpdateProfile.tsx` (user/profile update flows), alongside lodash comparisons and `react-redux` dispatch/selector calls.

**Alternatives:** manual `useRef` + comparison in `useEffect`.

### `@react-hook/window-size`

| | |
|---|---|
| **Version** | `^3.1.1` |
| **Release date** | 2021 (approximate) |
| **Changelog** | [releases](https://github.com/react-hookz/web/releases) |

React hooks exposing window width/height reactively.

**Used in:** `src/hooks/useIsAtBottom.ts`, `src/hooks/utils/usePlatforms.ts` (`useIsDesktop`/`useIsMobile`, combined with `mobile-detect`), `src/components/ui/Inputs/TextArea/useLineLimit.ts` (auto-resizing textarea line counting). Its ESM/CJS interop required a `jest.config.js` workaround (`customExportConditions: []`).

**Alternatives:** `useMediaQuery` custom hook, `react-use`'s `useWindowSize`.

---

## Monitoring & Observability

### `@datadog/browser-rum`

| | |
|---|---|
| **Version** | `^6.24.0` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/DataDog/browser-sdk/blob/main/CHANGELOG.md) |

Real User Monitoring (RUM) SDK for frontend observability.

**Used in:** `src/pages/_app.tsx`, initialized once via `datadogRum.init()` with `service: 'entourage-pro-next'`, site `datadoghq.eu`, reading `NEXT_PUBLIC_DD_APP_ID` / `NEXT_PUBLIC_DD_CLIENT_TOKEN` / `NEXT_PUBLIC_ENV` / `NEXT_PUBLIC_RELEASE_VERSION` env vars.

**Alternatives:** Sentry, New Relic Browser, self-hosted RUM.

### `dd-trace`

| | |
|---|---|
| **Version** | `^5.76.0` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/DataDog/dd-trace-js/blob/master/CHANGELOG.md) |

Datadog APM tracer for Node.js server-side tracing.

**Used in:** No usage found in `src/`, `next.config.mjs`, or any custom server/instrumentation file. Appears to be an unused/dead dependency in this repo — worth confirming whether it's intended for a not-yet-wired-up server-side tracing setup, or safe to remove.

**Alternatives:** OpenTelemetry SDK, remove if confirmed unused.

---

## Environment & Test Assertions

### `dotenv`

| | |
|---|---|
| **Version** | `^16.4.7` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) |

Loads environment variables from `.env` files.

**Used in:** `next.config.mjs` (`dotenv.config()`, making env vars available to Next config logic) and `cypress.config.ts` (`import 'dotenv/config'`) for e2e test env loading. Not needed inside `src/` since Next.js already loads `.env` for app runtime.

**Alternatives:** Next.js's built-in `.env` support (already relied on elsewhere).

### `expect`

| | |
|---|---|
| **Version** | `^29.7.0` |
| **Release date** | 2023, Jest 29 line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/jestjs/jest/blob/main/CHANGELOG.md) |

Standalone Jest assertion library, usable outside a full Jest runtime.

**Used in:** Explicitly imported in some spec files — `src/store/utils/createRequestAdapter/createRequestAdapter.spec.ts`, `src/use-cases/refering/refering.api.spec.ts`, `src/hooks/useContactEligibility.spec.tsx` — rather than relying solely on the global Jest `expect`. Declared as a production dependency, though only used in tests.

**Alternatives:** Jest's built-in global `expect` (already available via the `jest` devDependency), chai.

---

## Testing _(dev)_

### `jest` / `jest-environment-jsdom`

| | |
|---|---|
| **Version** | `jest ^30.4.2`, `jest-environment-jsdom ^30.4.1` |
| **Release date** | 2025, Jest 30 line (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/jestjs/jest/blob/main/CHANGELOG.md) |

Unit test runner and its jsdom test environment.

**Used in:** `jest.config.js` wraps `next/jest`, explicitly sets `testEnvironmentOptions: { customExportConditions: [] }` to work around ESM/CJS resolution issues with `@react-hook/window-size`. Extensive `*.spec.ts(x)` and `__tests__` files throughout `src/`.

**Alternatives:** Vitest.

### `@testing-library/react` / `@testing-library/jest-dom` / `@types/jest`

| | |
|---|---|
| **Version** | `@testing-library/react ^16.2.0`, `@testing-library/jest-dom ^6.6.3`, `@types/jest ^30.0.0` |
| **Release date** | 2024–2025 (approximate) |
| **Changelog** | [testing-library releases](https://github.com/testing-library/react-testing-library/releases) |

React component testing utilities and Jest DOM matchers.

**Used in:** Component and hook spec files across `src/`.

**Alternatives:** Enzyme (deprecated), Vitest + Testing Library.

### `cypress`

| | |
|---|---|
| **Version** | `^15.19.0` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/cypress-io/cypress/blob/develop/CHANGELOG.md) |

End-to-end testing framework.

**Used in:** `cypress.config.ts` + `cypress/` folder (`e2e`, `support/commands.ts`, `support/e2e.ts`, `fixtures/`). The `cypress:io` script runs against a Cypress Cloud key read from `.env`; `cypress:local` opens the interactive runner.

**Alternatives:** Playwright.

### `@faker-js/faker`

| | |
|---|---|
| **Version** | `^8.4.1` |
| **Release date** | 2024 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/faker-js/faker/blob/main/CHANGELOG.md) |

Fake/mock data generator.

**Used in:** Cypress fixture generators under `cypress/fixtures/src/*`, producing mock API responses (users, messaging, campaigns, business sectors, nudges, login).

**Alternatives:** Chance.js, hand-written fixtures.

---

## Linting & Formatting _(dev)_

### `eslint` and plugins

| | |
|---|---|
| **Version** | `eslint ^9.39.5`, `@typescript-eslint/eslint-plugin ^8.65.0`, `@typescript-eslint/parser ^8.65.0`, `@typescript-eslint/utils 8.65.0`, `@eslint/js ^10.0.1`, `@next/eslint-plugin-next 16.2.12`, `eslint-plugin-import-x ^4.17.1`, `eslint-plugin-jest ^29.16.0`, `eslint-plugin-jsx-a11y ^6.10.2`, `eslint-plugin-react ^7.37.5`, `eslint-plugin-react-hooks ^7.1.1`, `globals ^16.5.0` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [ESLint releases](https://github.com/eslint/eslint/releases) |

Static code linting, TypeScript-aware, with Next.js/React/JSX-a11y/import/jest rule sets.

**Used in:** `eslint.config.mjs` plus a custom `eslint-rules/` folder for project-specific rules; `test:eslint` script runs with `--fix --max-warnings=0`.

**Alternatives:** Biome, oxlint.

### `prettier` and plugins

| | |
|---|---|
| **Version** | `prettier ^3.9.6`, `eslint-config-prettier ^10.1.8`, `eslint-plugin-prettier ^5.5.6` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/prettier/prettier/blob/main/CHANGELOG.md) |

Opinionated code formatter, wired into ESLint.

**Used in:** `.prettierrc.json`; `format` script runs over `**/*.{js,jsx,md,json,ts,tsx}`.

**Alternatives:** Biome formatter, dprint.

---

## Type Checking _(dev)_

### `typescript` and `@types/*`

| | |
|---|---|
| **Version** | `typescript ^6.0.3`, `@types/node ^20.17.24`, `@types/react 19.2.17`, `@types/react-dom 19.2.3` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [TypeScript release notes](https://github.com/microsoft/TypeScript/releases) |

TypeScript compiler and type definitions for Node/React.

**Used in:** `tsconfig.base.json`, `tsconfig.stories.json`; strict typing across the whole `src/` tree. `test:ts-check` script runs `tsc --noEmit`. Note `@types/react`/`@types/react-dom` versions are pinned via `overrides` to stay aligned with the installed `react`/`react-dom` version.

**Alternatives:** Flow, JSDoc-based typing.

---

## Storybook _(dev)_

### `storybook` and addons

| | |
|---|---|
| **Version** | `storybook ^10.3.5`, `@storybook/react ^10.3.5`, `@storybook/nextjs-vite ^10.3.5`, `@storybook/addon-links ^10.3.5`, `@chromatic-com/storybook ^5.1.2`, `chromatic ^6.24.1` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/storybookjs/storybook/blob/next/CHANGELOG.md) |

Component workshop for building/documenting UI in isolation, plus visual regression testing via Chromatic.

**Used in:** `.storybook/main.ts` and `preview.tsx`; `*.stories.tsx` files throughout `src/components/ui/*`. `storybook`/`build-storybook` scripts run the dev server/static build; `chromatic` script runs visual regression (`--exit-zero-on-changes`). The Vite-based builder (`@storybook/nextjs-vite`) pulls in `vite`/`vite-tsconfig-paths` as a build dependency.

**Alternatives:** Ladle, Histoire.

### `vite` / `vite-tsconfig-paths`

| | |
|---|---|
| **Version** | `vite ^8.0.10`, `vite-tsconfig-paths ^6.1.1` |
| **Release date** | 2025 (approximate) |
| **Changelog** | [CHANGELOG.md](https://github.com/vitejs/vite/blob/main/CHANGELOG.md) |

Build tool used under the hood by Storybook's `@storybook/nextjs-vite` builder, plus a plugin resolving TS path aliases.

**Used in:** Not used directly by the app (which builds via Next.js/Turbopack) — only as Storybook's build dependency.

**Alternatives:** webpack (Storybook's other builder option).

---

## Developer Experience _(dev)_

### `husky` / `lint-staged`

| | |
|---|---|
| **Version** | `husky ^8.0.3`, `lint-staged ^13.3.0` |
| **Release date** | 2023 (approximate) |
| **Changelog** | [husky releases](https://github.com/typicode/husky/releases) · [lint-staged releases](https://github.com/lint-staged/lint-staged/releases) |

Git hooks manager and staged-file linter runner.

**Used in:** `.husky/pre-commit` hook + `.lintstagedrc.js`; the `prepare` script runs `husky install` on `pnpm install`.

**Alternatives:** simple-git-hooks, pre-commit (Python-based).

### `npm-run-all`

| | |
|---|---|
| **Version** | `^4.1.5` |
| **Release date** | 2018 (approximate) |
| **Changelog** | [releases](https://github.com/mysticatea/npm-run-all/releases) |

Runs multiple npm scripts sequentially or in parallel.

**Used in:** The `test` script (`run-s test:*`) to sequence `test:ts-check`, `test:eslint`, `test:unit`.

**Alternatives:** `npm-run-all2` (maintained fork), shell `&&` chaining, concurrently.
