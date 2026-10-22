import { visitorRequests } from '../e2e/intercept/user/visitor.req';

/**
 * Shared helpers of the public pages captures (`public-page-*.shot.ts`): one spec per page of
 * the public site, to check quickly that the floating public nav never covers the page content.
 */

/** Same visitor set-up as the e2e visitor journey: no welcome modal, mocked random CV cards. */
export const prepareVisitor = () => {
  window.localStorage.setItem('entourage-pro-modal-closed', 'true');
  // Nothing outside the app is reached: external links and resources are answered locally.
  cy.intercept(
    { url: /^https?:\/\/(?!localhost)/ },
    { statusCode: 200, body: '' }
  );
  visitorRequests.GET.forEach((request) => {
    if (request.alias) {
      cy.intercept('GET', request.path, request.data).as(request.alias);
    } else {
      cy.intercept('GET', request.path, request.data);
    }
  });
};

/** Waits for the public nav, so that the capture always shows it above the page. */
export const waitForPublicNav = () => {
  cy.get('#nav').should('be.visible');
};

/** Visits a public page as a visitor and captures it, nav included. */
export const capturePublicPage = (
  title: string,
  path: string,
  caption?: string,
  failOnStatusCode = true
) => {
  prepareVisitor();
  cy.visit(path, { failOnStatusCode });
  waitForPublicNav();
  cy.capture(title, { caption });
};

/**
 * Opens a page whose data is loaded in `getInitialProps`: on a direct visit that request runs on
 * the server, out of reach of `cy.intercept`. Navigating from another page runs it in the browser.
 */
export const visitClientSide = (path: string) => {
  prepareVisitor();
  cy.visit('/legal-notice');
  waitForPublicNav();
  cy.window().then((win) => {
    (
      win as unknown as { next: { router: { push: (url: string) => void } } }
    ).next.router.push(path);
  });
  cy.location('pathname').should('eq', path.split('?')[0]);
  waitForPublicNav();
};
