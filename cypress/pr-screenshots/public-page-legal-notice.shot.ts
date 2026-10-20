import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Mentions légales', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Mentions légales',
      '/legal-notice',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
