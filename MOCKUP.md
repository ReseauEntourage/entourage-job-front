# Mockup Context — Entourage Pro Front

Context file read by `/opsx:mockup` to generate visually faithful mockups for Entourage Pro changes.

This file lives at the root of the `entourage-job-front` repository. All paths below are relative to this root.

```
frontendPath: .
```

---

## Key files to read

Always read these before generating a mockup:

| Purpose                                    | Path                                                                               |
| ------------------------------------------ | ---------------------------------------------------------------------------------- |
| Colors, breakpoints, font weights, heights | `src/constants/styles.ts`                                                          |
| Button sizes and variants                  | `src/components/ui/Button/button.constants.ts`                                     |
| Section/container spacing                  | `src/components/ui/Section/Section.styles.ts`                                      |
| Standard layout (public + backoffice)      | `src/components/layouts/Layout.tsx`                                                |
| Backoffice layout wrapper                  | `src/components/layouts/LayoutBackOffice.tsx`                                      |
| Connected nav links (per role)             | `src/features/navs/NavConnected/NavConnectedContent/NavConnectedContent.utils.tsx` |
| Dashboard (cards, two-column grid)         | `src/features/backoffice/dashboard/Dashboard.tsx`                                  |
| Network directory (annuaire)               | `src/features/backoffice/network-directory/NetworkDirectory.tsx`                   |
| Messaging (split panel)                    | `src/features/backoffice/messaging/Messaging.tsx`                                  |
| Profile (header + editable sections)       | `src/features/backoffice/profile/Profile.tsx`                                      |
| Wizard layout (content + side panel)       | `src/features/wizard/shell/WizardContentLayout.tsx`                                |
| Wizard layout styles                       | `src/features/wizard/shell/WizardContentLayout.styles.ts`                          |

---

## Design tokens

### Colors (from `src/constants/styles.ts → COLORS`)

**Primary palette**

- Primary blue (CTA, links, focus): `#47A8B9`
- Dark blue (hover states): `#2D7FA6`
- Extra dark blue: `#1A5670`
- Hover blue (light bg on hover): `#EEF8FA`

**Neutrals**

- White: `#FFFFFF`
- Hover white: `#f2f2f2`
- Light gray (backgrounds): `#F5F5F5`
- Gray (borders): `#D9D9D9`
- Medium gray (secondary text): `#A0A0A0`
- Dark gray: `#6D6C6C`
- Black (primary text): `#363636`

**Feedback**

- Green (success): `#79CC6B`
- Light red (error): `#F1545D`
- Extra light red (error bg): `#FEEAEA`
- Orange social: `#F55F24`
- Medium orange (CTA variant): `#FF9C5D`

**Background tints**

- Extra extra light orange: `#FFF8F6`
- Extra light orange: `#FEEAE3`
- Extra light teal: `#e8f6f8`
- Light blue-green: `#C1E9DF`

### Typography

```css
font-family: Poppins;

font-weight-normal:   400
font-weight-medium:   500
font-weight-semibold: 600
font-weight-bold:     700
```

### Spacing & layout

```
Desktop breakpoint: 960px
Header height:      80px (desktop and mobile)
Section padding:    24px desktop / 12px mobile
Default section padding: 50px
Max content width:  1360px (with 15px horizontal padding)
```

### Shadows & borders

```
Card shadow:    0px 4px 12px rgba(0,0,0,0.05)
Default radius: 5px (buttons, cards)
Rounded radius: 20px (pill buttons)
```

---

## Component inventory

### Button (`src/components/ui/Button/`)

Four style variants:

| Variant     | Background  | Text      | Border    |
| ----------- | ----------- | --------- | --------- |
| `primary`   | `#47A8B9`   | white     | `#47A8B9` |
| `secondary` | white       | `#47A8B9` | `#47A8B9` |
| `default`   | white       | `#363636` | `#D9D9D9` |
| `text`      | transparent | `#363636` | none      |

Sizes: `small` (13px / 6px 10px), `medium` (14px / 11px 19px), `large` (16px / 16px 32px), `xlarge` (18px / 20px 40px).

### Badge / Tag

Small colored label. Variants use the brand palette. Rounded pill shape (`border-radius: 20px`).

### Alert

Notification banner. Variants: `success` (green), `error` (light red bg `#FEEAEA`), `info` (light teal).

### Card

Rounded box (`border-radius: 5px`), white background, shadow `rgba(0,0,0,0.05)`. Inner padding typically 16–24px.

### Section + Container

- `<Section>` provides vertical padding (24px desktop / 12px mobile)
- Inner `.section-container`: `max-width: 1360px`, `margin: auto`, `padding: 0 15px`
- Variant `.small`: `max-width: 700px`

### Input / Form fields

Border: `#D9D9D9`, focus border: `#47A8B9`, radius: `5px`, background: white. Error state: border `#F1545D`.

### AvailabilityTag

Colored pill indicating candidate availability status (e.g., "En recherche active", "À l'écoute du marché"). Used on profile cards and the network directory.

### Spinner / Skeleton

Skeleton uses muted shimmer colors (`#EDEDED36` / `#F7F7F736`). Spinner is primary blue.

### Modal

Centered overlay with semi-transparent dark backdrop. Title at top, content body, action buttons in footer. Two variants: standard `Modal` and decorative `PrettyModal` (with illustration or decorative header).

### Notification (toast)

Toast messages in the top-right corner. Variants map to Alert states (success / error / info). Auto-dismiss after a few seconds.

### Table

Used in admin pages. Standard bordered table with header row. Rows have hover state (`#f2f2f2`). Often paired with pagination and a filter bar.

### Accordion

Collapsible sections, toggle on click. Used for grouped resource lists and FAQ-style content.

### ProgressBar

Thin colored bar (primary blue fill on gray track). Used in wizard flows and gamification contexts (achievement progression).

### Popover / Tooltip

Floating content anchored to a trigger element. Tooltip: small text label. Popover: larger rich content block.

### OffCanvas

Slide-in panel from the side. Used for mobile filters drawer and secondary content panels.

### Dropdown

Menu that opens on click of a trigger. Used in nav (user menu) and filter selectors.

---

## User roles

The application has four roles with different nav items and accessible pages:

| Role        | Description                        | Main nav items                                                                                                          |
| ----------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `CANDIDATE` | Job seeker                         | Tableau de bord, Mon profil, Réseau d'entraide, Événements, Ressources                                                  |
| `COACH`     | Network volunteer / company member | Tableau de bord, Mon profil, (Mon entreprise if admin), Réseau d'entraide, Événements, Ressources                       |
| `REFERER`   | Prescribers (social workers)       | Tableau de bord, Mon profil, Réseau d'entraide, Événements, Ressources                                                  |
| `ADMIN`     | Entourage staff                    | Les membres (Candidats / Coachs / Prescripteurs), Les structures partenaires, Mon profil, Réseau d'entraide, Événements |

All authenticated users have access to:

- **Messages** (dedicated icon in the nav, with unread-count badge)
- **Se déconnecter** (user avatar dropdown)

---

## Layout patterns

### Standard public page

```
┌─────────────────────────────────────┐
│  NavPublic (80px, white, logo left) │
│  + hamburger on mobile              │
├─────────────────────────────────────┤
│  Section (padding 24px)             │
│    .section-container (max 1360px)  │
│      [page content]                 │
│  /Section                           │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

### Authenticated backoffice page

No footer. NavConnected shows role-dependent links.

```
┌──────────────────────────────────────────────────┐
│  NavConnected (80px, white, logo left)            │
│    [role-specific links]  [Messages icon]  [👤▾] │
├──────────────────────────────────────────────────┤
│  [optional: colored header band]                  │
│  Section                                          │
│    .section-container (max 1360px)                │
│      [page content]                               │
│  /Section                                         │
└──────────────────────────────────────────────────┘
```

### Dashboard (two-column)

Route: `/backoffice/dashboard`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  Section                                              │
│  ┌──────────────────┐  ┌────────────────────────┐    │
│  │  Left column     │  │  Right column          │    │
│  │  (~30%)          │  │  (~70%)                │    │
│  │                  │  │                        │    │
│  │  Profile card    │  │  Next steps card       │    │
│  │  Company card    │  │  Recommendations       │    │
│  │  Staff contact   │  │  Messaging preview     │    │
│  │                  │  │  Achievement progress  │    │
│  └──────────────────┘  └────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

Mobile: single column — right column first, then left column below.

### Network directory (Annuaire)

Route: `/backoffice/annuaire`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  Colored header band (light teal bg #e8f6f8)          │
│    Title + description                                │
│    Search bar + filter dropdowns                      │
├──────────────────────────────────────────────────────┤
│  Section                                              │
│    Grid of profile cards (3–4 cols desktop, 1 mobile) │
│    Paginated / infinite scroll                        │
└──────────────────────────────────────────────────────┘
```

### Messaging

Route: `/backoffice/messaging`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  ┌──────────────────────┬─────────────────────────┐  │
│  │  Conversation list   │  Active conversation    │  │
│  │  (left panel)        │  (right panel)          │  │
│  │                      │                         │  │
│  │  [search input]      │  Message thread         │  │
│  │  [conv. item]        │  (scrollable)           │  │
│  │  [conv. item ●]      │                         │  │
│  │  ...                 │  [text input + send]    │  │
│  └──────────────────────┴─────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

Mobile: list panel first; selecting a conversation navigates to conversation view.

### Profile / Paramètres

Routes: `/backoffice/parametres`, `/backoffice/profile/[userId]`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  HeaderProfile                                        │
│    Avatar + name + role badge + AvailabilityTag       │
│    (desktop: horizontal band; mobile: stacked)        │
├──────────────────────────────────────────────────────┤
│  Section (max-width ~700px, centered)                 │
│    Editable sections (personal info, bio, skills,    │
│    experiences, formations)                           │
│    Each section: title + content + "Modifier" button  │
└──────────────────────────────────────────────────────┘
```

### Events listing

Route: `/backoffice/events`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  Colored header band                                  │
│    Title + description                                │
├──────────────────────────────────────────────────────┤
│  Section                                              │
│    Event cards (date badge, title, location, CTA)     │
│    (list or grid layout)                              │
└──────────────────────────────────────────────────────┘
```

### Ressources / Formations

Routes: `/backoffice/ressources/formations`, `/backoffice/ressources/aides-locales`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected                                         │
├──────────────────────────────────────────────────────┤
│  Section                                              │
│    Header (title + description)                       │
│    Cards / Accordion list of resources                │
│    External links (toolbox, e-learning platform)      │
└──────────────────────────────────────────────────────┘
```

### Wizard layout (WizardContentLayout)

Routes: `/wizard`, `/wizard/run`

```
┌──────────────────────────────────────────────────────┐
│  TopBar: Logo (left) + AuthSection (right)            │
│  [ProgressBar below topbar]                           │
├──────────────────────────────────────────┬───────────┤
│                                          │           │
│   Main content (flex: 1)                 │ Side panel│
│   Step title + form fields               │ (fixed w, │
│   + navigation buttons                   │ colored   │
│     [Back]            [Suivant →]        │ bg)       │
│                                          │           │
└──────────────────────────────────────────┴───────────┘
```

- `sidePanelSide` can be `left` or `right`
- When side panel is on the left, the logo moves inside it
- Mobile: collapses to single column with mobile header

### Admin — member/structure list

Routes: `/backoffice/admin/membres`, `/backoffice/admin/structures`

```
┌──────────────────────────────────────────────────────┐
│  NavConnected (Admin role)                            │
├──────────────────────────────────────────────────────┤
│  Section                                              │
│    Filter bar (search input + role/zone dropdowns)    │
│    Data table (paginated)                             │
│      [checkbox] Name | Role | Zone | Actions          │
│    Pagination controls                                │
└──────────────────────────────────────────────────────┘
```

---

## Page inventory

### Public pages (NavPublic + Footer)

| Route                            | Description                                               |
| -------------------------------- | --------------------------------------------------------- |
| `/`                              | Home — hero, value props, CTAs for candidates and coaches |
| `/candidats`                     | Landing for job seekers                                   |
| `/aider`                         | Landing for coaches / volunteers                          |
| `/orienter`                      | Landing for referers / prescribers                        |
| `/entreprises/s-engager`         | Companies engagement landing                              |
| `/entreprises/recruter-inclusif` | Inclusive hiring landing                                  |
| `/partenaires`                   | Partner organizations                                     |
| `/login`                         | Login form (email + password, LinkedIn OAuth)             |
| `/contact`                       | Contact form                                              |
| `/conseils-posture`              | Coaching posture advice content                           |
| `/cgu`                           | Terms of use                                              |
| `/cookies`                       | Cookie policy                                             |
| `/data-privacy`                  | Privacy policy                                            |
| `/legal-notice`                  | Legal notice                                              |

### Authentication & onboarding flows

| Route                       | Layout              | Description                                    |
| --------------------------- | ------------------- | ---------------------------------------------- |
| `/wizard`                   | WizardContentLayout | Registration entry — role selection            |
| `/wizard/run`               | WizardContentLayout | Multi-step registration wizard                 |
| `/reset/[id]/[token]`       | Simple              | Password reset form                            |
| `/reset/success`            | Simple              | Reset success confirmation                     |
| `/verification-email`       | Simple              | Email verification prompt                      |
| `/auth/linkedin/callback`   | —                   | LinkedIn OAuth callback (redirect only)        |
| `/finaliser-compte-oriente` | Simple              | Finalize account for users referred by a coach |
| `/coach-certification/[id]` | Simple              | Coach certification achievement page           |
| `/merci` / `/merci/[type]`  | Simple              | Thank-you / post-registration confirmation     |

### Authenticated backoffice (NavConnected, no Footer)

| Route                                       | Role access             | Description                              |
| ------------------------------------------- | ----------------------- | ---------------------------------------- |
| `/backoffice/dashboard`                     | All                     | Personalized dashboard                   |
| `/backoffice/parametres`                    | All                     | User profile settings (editable)         |
| `/backoffice/profile/[userId]`              | All                     | Public profile view                      |
| `/backoffice/annuaire`                      | All                     | Network directory                        |
| `/backoffice/messaging`                     | All                     | Messaging (conversation list + thread)   |
| `/backoffice/events`                        | All                     | Events listing                           |
| `/backoffice/events/[eventId]`              | All                     | Event detail                             |
| `/backoffice/ressources/aides-locales`      | Candidate/Coach/Referer | Local support structures                 |
| `/backoffice/ressources/formations`         | Candidate/Coach         | E-learning / training page               |
| `/backoffice/candidat/[id]`                 | Coach / Admin           | Candidate detail (coach view)            |
| `/backoffice/referer`                       | Referer                 | Referer dashboard                        |
| `/backoffice/referer/candidates`            | Referer                 | List of referred candidates              |
| `/backoffice/referer/orienter/[step]`       | Referer                 | Referral wizard (multi-step)             |
| `/backoffice/referer/orienter/confirmation` | Referer                 | Referral confirmation                    |
| `/backoffice/alerte-candidats/[alertId]`    | Coach                   | Recruitment alert detail                 |
| `/backoffice/companies/[id]`                | Coach (admin)           | Company profile                          |
| `/backoffice/companies/[id]/collaborators`  | Coach (admin)           | Company collaborators management         |
| `/backoffice/companies/parametres`          | Coach (admin)           | Company settings                         |
| `/backoffice/admin`                         | Admin                   | Admin home                               |
| `/backoffice/admin/membres`                 | Admin                   | Members list (filterable by role + zone) |
| `/backoffice/admin/membres/[id]`            | Admin                   | Member detail + edit                     |
| `/backoffice/admin/structures`              | Admin                   | Partner organizations list               |
| `/backoffice/admin/create-mailing-list`     | Admin                   | Mailing list generation tool             |

---

## Figma

```
figmaFileUrl: (à renseigner)
```

<!-- Add the Figma file URL when available -->

---

## Notes for mockup generation

- Entourage Pro targets three primary users: **candidates** (chercheurs d'emploi), **coaches** (bénévoles / salariés en entreprise), and **referers** (prescripteurs sociaux)
- The distinction between "public" and "backoffice" is fundamental: public pages use `NavPublic` + `Footer`; authenticated pages use `NavConnected` without footer
- Primary CTA color is `#47A8B9` (blue-teal); orange (`#F55F24`) is used for social/community features
- Form-heavy pages and profile sections typically use `max-width: 700px` centered containers
- Backoffice list pages (annuaire, events) have a colored header band (`StyledBackgroundedHeaderBackoffice`) — light teal background
- Gamification (achievement cards, progression bars) appears on the dashboard for Candidates and Coaches
- Messaging has an unread-count badge on the nav icon
- Mobile: nav collapses to hamburger; multi-column layouts stack to single column
- The `entourage-job-front` symlink is at `PRO/entourage-job-front` in the specs repository
