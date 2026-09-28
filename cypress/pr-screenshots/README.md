# Captures d'écran des PR

Toute PR qui modifie l'interface montre le **rendu réel** des écrans concernés, en desktop
(1440 px) et en mobile (390 px), directement dans sa description.

## Fonctionnement

1. La PR ajoute ou modifie une spec `cypress/pr-screenshots/<capability>.shot.ts`.
2. Le workflow [`.github/workflows/pr-screenshots.yml`](../../.github/workflows/pr-screenshots.yml)
   builde l'app (`next build` puis `next start`, sans CDN) et exécute **uniquement les specs de
   capture ajoutées ou modifiées par la PR**, une fois en desktop puis une fois en mobile. Le
   back-end est mocké exactement comme pour les tests e2e (`cy.intercept` et fixtures
   générées) : aucune donnée réelle, aucun back-end à lancer.
3. Les PNG sont publiés sur la branche orpheline `pr-screenshots` (`pr-<numéro>/<sha>/`), puis
   injectés dans la section « 🖼️ Captures » de la PR, entre les marqueurs
   `<!-- screenshots:start -->` et `<!-- screenshots:end -->`. Chaque push les régénère.
4. Si la PR touche `src/**/*.tsx`, `*.styles.ts`, `*.css`, `public/static/img/` ou `assets/icons/` sans spec de capture, la section
   affiche un avertissement. Une PR fermée sans merge voit ses captures supprimées de la branche.

> ⚠️ Le dépôt est public, et la branche `pr-screenshots` l'est donc aussi : une capture ne doit
> montrer que des fixtures, jamais de données issues d'un vrai environnement.

## Écrire une spec de capture

```ts
import { buildCurrentUser } from '../fixtures/src/messaging/messagingBuilders';
import { interceptCurrentUser } from '../e2e/intercept/user/auth.req';
import bootstrap from '../e2e/test/bootstrap';

describe('Tableau de bord', () => {
  bootstrap();

  it('coach connecté', () => {
    // Mêmes intercepts et fixtures que les tests e2e.
    interceptCurrentUser({
      statusCode: 200,
      body: buildCurrentUser({ role: 'Coach' }),
    });

    cy.visit('/backoffice/dashboard');
    // Attendre l'état à montrer AVANT la capture (données chargées, modale ouverte…).
    cy.wait('@getCurrent');

    cy.capture('Tableau de bord', { caption: 'Nouveau widget messagerie.' });
    // Capture ciblée sur un élément :
    cy.get('[data-testid="dashboard-messaging-widget"]').capture(
      'Widget messagerie'
    );
  });
});
```

Exemple complet : [`dashboard.shot.ts`](dashboard.shot.ts).

- Un fichier par capability. Réutiliser les intercepts (`cypress/e2e/intercept/`) et les
  fixtures (`cypress/fixtures/`) des tests e2e.
- `cy.capture(titre, { caption?, capture? })` capture la page entière par défaut, ou
  seulement le viewport avec `capture: 'viewport'`. Chaîné sur un élément
  (`cy.get(...).capture(titre)`), il capture uniquement cet élément. Avant chaque capture, la
  commande force le chargement des images lazy puis attend les images et les polices ; les
  animations sont désactivées.
- Chaque titre doit être unique dans sa spec : il donne le nom du fichier (`cy.capture()` échoue sinon).
- Montrer ce qui a changé : ouvrir la modale, remplir le formulaire, afficher l'état
  d'erreur… Plusieurs `capture()` par test si besoin.
- Mocker **toutes** les requêtes de la page : une requête non interceptée laisse un spinner
  ou un état d'erreur sur la capture.
- Pour un parcours propre au mobile (menu hamburger…) : `Cypress.expose('device')` vaut
  `'desktop'` ou `'mobile'`.
- Les specs restent dans le dépôt : `pnpm screenshots` sans argument produit une visite
  visuelle de toutes les pages couvertes.

## Exécuter en local

L'app doit tourner en **mode production**, sans CDN. En mode dev, l'indicateur Next.js
apparaîtrait sur les captures.

```bash
NEXT_PUBLIC_CDN_URL= pnpm build && NEXT_PUBLIC_CDN_URL= pnpm start
pnpm screenshots cypress/pr-screenshots/dashboard.shot.ts
# → cypress/pr-screenshots/output/*.png (ignoré par git)
```

Pour une app servie sur un autre port que celui de `NEXT_PUBLIC_SERVER_URL`, préfixer la
commande par `NEXT_PUBLIC_SERVER_URL=http://localhost:<port>`.

## Détails techniques

- **Deux exécutions de Cypress** (`run.mjs`) plutôt qu'un `cy.viewport()` dans le test :
  `useIsDesktop()` lit d'abord le user-agent au rendu SSR. L'exécution mobile utilise donc un
  user-agent iPhone, faute de quoi la page serait rendue en desktop puis rebasculerait.
- **Page entière** : le `fullPage` natif de Cypress assemble des captures successives,
  répète le header fixe et le laisse masquer les éléments ciblés. `cy.capture()` agrandit
  plutôt le viewport à la hauteur du document le temps d'une capture unique. Contrepartie :
  un élément dimensionné en `100vh` s'étire sur toute la capture.
- **Navigateur** : Electron, fourni avec Cypress, identique en local et en CI.
