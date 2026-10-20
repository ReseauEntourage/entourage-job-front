import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Page introuvable', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Page introuvable',
      '/cette-page-nexiste-pas',
      'Le contenu commence sous le menu flottant.'
    );
  });
});
