import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Connexion', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Connexion',
      '/login',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
