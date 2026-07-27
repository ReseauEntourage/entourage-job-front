# entourage-job-front — overview

> Added by the `entourage_specs` meta-repo. The submodule's own canonical README lives at `README.md`.

The PRO product frontend. Next.js 15 (App Router) + React 19 + Redux Toolkit + Redux-Saga. Serves candidates, coaches, companies and admins with responsive UI for job placement, CV profiles, real-time messaging, event management and company engagement. Tested with Cypress (cloud-recorded on Cypress.io) and Jest. Storybook component library with Chromatic visual regression. Hosted on Heroku.

## Interactions

- **Backend**: HTTPS REST via Axios to `NEXT_PUBLIC_API_URL` (the `entourage-job-back` API). Auth tokens stored in cookies.
- **Real-time messaging**: Pusher JS 7.6 client (`NEXT_PUBLIC_PUSHER_API_KEY`) for coach/candidate live chat.
- **Analytics / monitoring**:
  - Google Analytics (`NEXT_PUBLIC_GA_TRACKING_ID`) via `gtag.ts`.
  - Datadog RUM Browser 6.24 (`NEXT_PUBLIC_DD_APP_ID`, `NEXT_PUBLIC_DD_CLIENT_TOKEN`).
  - Datadog APM via `dd-trace` 5.76 for SSR.
- **Content / CDN**: AWS S3 + CloudFront via `NEXT_PUBLIC_AWSS3_CDN_URL` / `NEXT_PUBLIC_CDN_URL` (images, CVs).
- **Social / consent**: Facebook Pixel (`NEXT_PUBLIC_FB_APP_ID`, `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION`), Tarte au Citron cookie banner (`NEXT_PUBLIC_TARTEAUCITRON_UUID`), `react-share` social buttons.
- **Maps / video**: `google-maps-react` for coaching zones, `react-lite-youtube-embed` for video embeds.
- **External APIs**: data-inclusion.gouv.fr (`NEXT_PUBLIC_DATA_INCLUSION_TOKEN`), Mailjet contact form (`NEXT_PUBLIC_MAILJET_CONTACT_EMAIL`).
- **Configurable URLs**: `NEXT_PUBLIC_TOOLBOX_*_URL`, `NEXT_PUBLIC_URL_COACH_COMPANY_KIT`, `NEXT_PUBLIC_URL_MESURE_D_IMPACT`, `NEXT_PUBLIC_DONATION_LINK`.
- **Tests**: Cypress.io cloud (`CYPRESS_IO_KEY`, `CYPRESS_IO_PROJECT_ID = 5t68y6`).

## Installing / scripts

```bash
corepack enable
pnpm install
pnpm run test:ts-check

# Dev
pnpm run dev               # next dev --turbopack
pnpm run dev:network       # accessible from LAN (mobile testing)

# Prod
pnpm run build
pnpm start

# Testing
pnpm run test              # ts-check + eslint + jest
pnpm run test:unit
pnpm run test:ts-check
pnpm run test:eslint
pnpm run test:e2e          # Cypress cloud (cypress:io)
pnpm run cypress:local
pnpm run cypress:io

# Tooling
pnpm run lint
pnpm run format
pnpm run storybook
pnpm run build-storybook
pnpm run chromatic
pnpm run add-icons
pnpm dlx dead-exports
```

Docker:

- `docker-compose.yml` — Node.js + Next.js dev server.

Heroku Procfile:

```
web: pnpm start
```

CI/CD: GitHub Actions (`.github/workflows/ci.yml`, `release.yml`, `storybook.yml`).

## External libraries

- **Framework / rendering**: Next.js 15.5.15, React 19.0.0, React-DOM 19, Webpack 5, `next-with-less` 3.0.1.
- **State**: `@reduxjs/toolkit` 1.9.7, `react-redux` 8.1.3, `redux-saga` 1.3.0, `typed-redux-saga` 1.5.0, `rxjs` 7.8.2.
- **Styling**: UIKit 3.6.22 (legacy, being phased out), `styled-components` 5.3.11, Less 4.2.2, SVGR.
- **Forms / input**: `react-hook-form` 7.54.2, `react-phone-number-input` 3.4.12, `react-select` 5.10.1.
- **HTTP / utils**: `axios` 0.31.0, `check-password-strength` 2.0.10.
- **Real-time**: `pusher-js` 7.6.0.
- **Components**: `react-transition-group` 4.4.5, `react-spinners` 0.13.8, `react-tooltip` 5.28.0, `react-countup` 4.4.0, `react-visibility-sensor` 5.1.1, `react-lite-youtube-embed` 3.3.3, `react-share` 5.3.0, `react-modal` 3.16.3, `swiper` 12.1.2, `mobile-detect` 1.4.5, `google-maps-react` 2.0.6.
- **Content**: `marked` 4 + `dompurify` 3.4.1.
- **Monitoring**: `@datadog/browser-rum` 6.24.0, `dd-trace` 5.76 (SSR).
- **Test**: Cypress 14.2.0, Jest 30.4.2, `@testing-library/react` 16.2.0, `@testing-library/jest-dom` 6.6.3, Storybook 10.3.5, Chromatic 6.24.1.

## Used technologies

- **Language**: TypeScript 5.9.3.
- **Runtime**: Node.js 22.x (per `package.json` engines), 20.x supported.
- **Framework**: Next.js 15 (App Router) + React 19.
- **State**: Redux Toolkit + Redux-Saga.
- **Styling**: CSS Modules + LESS + styled-components.
- **Real-time**: Pusher WebSocket.
- **CI/CD**: GitHub Actions.
- **Deployment**: Heroku, Docker.

## Secrets (env vars)

`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_ENV`,
`NEXT_PUBLIC_DD_APP_ID`, `NEXT_PUBLIC_DD_CLIENT_TOKEN`, `DD_SERVICE`, `DD_ENV`,
`NEXT_PUBLIC_GA_TRACKING_ID`,
`NEXT_PUBLIC_AWSS3_URL`, `NEXT_PUBLIC_AWSS3_CDN_URL`, `NEXT_PUBLIC_CDN_URL`, `NEXT_PUBLIC_AWSS3_IMAGE_DIRECTORY`,
`NEXT_PUBLIC_FB_APP_ID`, `NEXT_PUBLIC_FB_DOMAIN_VERIFICATION`, `NEXT_PUBLIC_TARTEAUCITRON_UUID`,
`CYPRESS_IO_KEY`, `CYPRESS_IO_PROJECT_ID`,
`NEXT_PUBLIC_TOOLBOX_CANDIDATE_URL`, `NEXT_PUBLIC_TOOLBOX_COACH_URL`, `NEXT_PUBLIC_TOOLBOX_COMPANY_URL`, `NEXT_PUBLIC_URL_COACH_COMPANY_KIT`, `NEXT_PUBLIC_URL_MESURE_D_IMPACT`, `NEXT_PUBLIC_DONATION_LINK`,
`NEXT_PUBLIC_MAILJET_CONTACT_EMAIL`, `NEXT_PUBLIC_PUSHER_API_KEY`,
`NEXT_PUBLIC_DATA_INCLUSION_TOKEN`,
`NEXT_PUBLIC_PINNED_COMMUNICATION_URL`, `NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_URL`, `NEXT_PUBLIC_PINNED_COMMUNICATION_TITLE`, `NEXT_PUBLIC_PINNED_COMMUNICATION_IMAGE_RATIO`,
`NEXT_PUBLIC_LINKIFY_SAFE_DOMAINS`, `NEXT_PUBLIC_MESSAGING_FORBIDDEN_EXPRESSIONS`,
`NEXT_PUBLIC_WOMENS_DAY`, `NEXT_PUBLIC_SHOW_POPUP`,
`HEROKU_RELEASE_VERSION`, `HEROKU_RELEASE_COMMIT`.

`NEXT_PUBLIC_*` values are inlined at build time and visible in the browser bundle — they should not contain anything that must stay private.
