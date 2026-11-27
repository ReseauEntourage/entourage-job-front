import { visitorRequests } from '../e2e/intercept/user/visitor.req';
import bootstrap from '../e2e/test/bootstrap';

describe("Page d'accueil - bouton play de la vidéo", () => {
  bootstrap();

  beforeEach(() => {
    window.localStorage.setItem('entourage-pro-modal-closed', 'true');
    visitorRequests.GET.forEach((request) => {
      if (request.alias) {
        cy.intercept('GET', request.path, request.data).as(request.alias);
      } else {
        cy.intercept('GET', request.path, request.data);
      }
    });
    // YouTube is unreachable from the capture runner: serve a local image as
    // the thumbnail so the play button is shown on a realistic background.
    cy.intercept(
      { method: 'GET', hostname: /(img\.youtube\.com|i\.ytimg\.com)/ },
      (req) => {
        req.redirect(
          '/static/img/front-office/homepage/homepage-hero-desktop.png'
        );
      }
    );
  });

  it('affiche le bouton play bleu sur la miniature', () => {
    cy.visit('/');

    // Leave room for the sticky header so it does not cover the video
    cy.get('.yt-lite.videoCustom')
      .first()
      .scrollIntoView({
        offset: { top: -160, left: 0 },
      });
    cy.get('.yt-lite.videoCustom .playBtnCustom').should('be.visible');

    cy.capture('Vidéo - bouton play', {
      capture: 'viewport',
      caption: 'Bouton play bleu centré, sans contour.',
    });
  });
});
