import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Candidats', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Candidats',
      '/candidats',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
