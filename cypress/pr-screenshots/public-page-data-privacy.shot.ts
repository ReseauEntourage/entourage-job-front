import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Politique de confidentialité', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Politique de confidentialité',
      '/data-privacy',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
