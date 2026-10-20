import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Politique de cookies', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Politique de cookies',
      '/cookies',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
