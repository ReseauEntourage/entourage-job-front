import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Pourquoi Entourage Pro', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Pourquoi Entourage Pro',
      '/entourage-pro',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
