import '../support/commands';

export interface CaptureOptions {
  /** Caption displayed under the title in the PR description. */
  caption?: string;
  /** Whole page (default) or only the device viewport. Ignored for an element capture. */
  capture?: 'fullPage' | 'viewport';
}

/** Metadata written next to each PNG, read by cypress/pr-screenshots/render-markdown.mjs. */
export interface CaptureMeta {
  slug: string;
  title: string;
  caption?: string;
  spec: string;
  index: number;
  device: string;
  file: string;
}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Captures the page (`cy.capture(...)`) or an element
       * (`cy.get(...).capture(...)`) for the PR description, on the current device.
       */
      capture(title: string, options?: CaptureOptions): Chainable<void>;
    }
  }
}

const OUTPUT_DIR = 'cypress/pr-screenshots/output';

// The support file is re-evaluated for each spec: the counter orders the captures of one
// spec; the maps catch titles that would overwrite each other's files, while letting a
// retried test capture its titles again.
let sequence = 0;
const slugOwners = new Map<string, string>();
let attemptSlugs = new Set<string>();

beforeEach(() => {
  attemptSlugs = new Set();
});

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

Cypress.Commands.add(
  'capture',
  { prevSubject: 'optional' },
  (subject, title, options = {}) => {
    const device = Cypress.expose('device') as string;
    const spec = Cypress.spec.name.replace(/\.shot\.ts$/, '');
    const slug = slugify(`${spec}-${title}`);
    const test = Cypress.currentTest.titlePath.join(' > ');
    const owner = slugOwners.get(slug);
    if (attemptSlugs.has(slug) || (owner && owner !== test)) {
      throw new Error(
        `cy.capture(): "${title}" gives the same file name as another capture of this spec (${slug}), use a distinct title`
      );
    }
    slugOwners.set(slug, test);
    attemptSlugs.add(slug);
    const name = `${slug}.${device}`;
    const index = sequence++;

    // Lazy images off screen (below the fold, hidden carousel slides) would never load:
    // force them eager, then wait for every image and font.
    cy.document({ log: false }).then((doc) => {
      doc.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        (img as HTMLImageElement).loading = 'eager';
      });
    });
    cy.window({ log: false }).should((win) => {
      const pending = Array.from(win.document.images)
        .filter((img) => !img.complete)
        .map((img) => img.src);
      expect(pending.join(', '), 'images still loading').to.equal('');
    });
    cy.document({ log: false }).its('fonts.status').should('equal', 'loaded');

    const shotOptions = {
      disableTimersAndAnimations: true,
      overwrite: true,
      capture: 'viewport',
    } as const;
    const { viewportWidth, viewportHeight } = Cypress.config();
    const fullPage = !!subject || options.capture !== 'viewport';

    // Cypress' own `fullPage` stitches scrolled captures, which repeats the fixed header
    // and lets it cover elements. Growing the viewport to the document height instead
    // captures everything in one shot, without scrolling.
    if (fullPage) {
      cy.document({ log: false }).then((doc) => {
        cy.viewport(
          viewportWidth,
          Math.max(viewportHeight, doc.documentElement.scrollHeight),
          {
            log: false,
          }
        );
      });
    }
    if (subject) {
      cy.wrap(subject, { log: false }).screenshot(name, shotOptions);
    } else {
      cy.screenshot(name, shotOptions);
    }
    if (fullPage) {
      cy.viewport(viewportWidth, viewportHeight, { log: false });
    }

    const meta: CaptureMeta = {
      slug,
      title,
      caption: options.caption,
      spec,
      index,
      device,
      file: `${name}.png`,
    };
    cy.writeFile(`${OUTPUT_DIR}/${name}.json`, meta, { log: false });
  }
);
