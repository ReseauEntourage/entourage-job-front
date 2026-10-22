import bootstrap from '../e2e/test/bootstrap';
import { capturePublicPage } from './publicPages';

describe('Page publique : Orienter', () => {
  bootstrap();

  it('le début du contenu est visible sous le menu', () => {
    capturePublicPage(
      'Orienter',
      '/orienter',
      'Le hero commence en haut de la page, sous le menu flottant.'
    );
  });
});
