import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Vérification de l’adresse e-mail', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Vérification de l’adresse e-mail',
      '/verification-email',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
