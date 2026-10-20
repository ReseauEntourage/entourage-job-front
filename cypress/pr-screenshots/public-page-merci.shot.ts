import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Merci', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Merci',
      '/merci?type=coach',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
