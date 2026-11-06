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

## Prouver qu'un refactor ne change rien (avant / après)

Les captures servent aussi de **filet visuel** : on génère une référence avant de toucher au
code, puis on compare chaque capture après coup, au pixel près (desktop 1440 px et mobile
390 px). Utilisé pour le retrait d'UIkit (`remove-uikit`, EN-7175).

```bash
# 1. Sur la branche non modifiée : build de production sans CDN, puis serveur
NEXT_PUBLIC_CDN_URL= pnpm build && NEXT_PUBLIC_CDN_URL= pnpm start

# 2. Générer la référence (toutes les specs) et la figer dans baseline/ (ignoré par git)
pnpm screenshots
rm -rf cypress/pr-screenshots/baseline && cp -r cypress/pr-screenshots/output cypress/pr-screenshots/baseline

# 3. Après les modifications : rebuild, relancer le serveur, régénérer et comparer
pnpm screenshots
pnpm screenshots:compare                       # tout
pnpm screenshots:compare public-page-home      # seulement les captures dont le nom commence ainsi
pnpm screenshots:compare --ignore cypress/pr-screenshots/unstable.txt
```

`compare.mjs` liste chaque écart (nombre de pixels différents, ou changement de taille de la
page), écrit une image de différence (pixels en rouge) dans `cypress/pr-screenshots/diff/`
(ignoré par git) et sort en code 1 au moindre écart. `pnpm screenshots:compare:check` vérifie
l'outil lui-même (images identiques → 0, images différentes → 1).

- **Reproductibilité** : `seed-random.ts` (chargé en premier par `support.ts`) seede
  `Math.random()` à chaque chargement de page et pour faker, de sorte que deux exécutions du
  même code donnent les mêmes pixels. Les captures qui restent instables malgré cela (barre de
  progression animée, carrousel qui avance seul…) sont listées dans `unstable.txt` : à
  relire à l'œil au lieu de les comparer.
- **Un écart apparaît ?** Relancer seulement la spec concernée
  (`pnpm screenshots cypress/pr-screenshots/<spec>.shot.ts`) puis recomparer : si l'écart a
  disparu ou change d'un passage à l'autre, la capture est instable (l'ajouter à
  `unstable.txt`) ; s'il revient identique, c'est un vrai changement de rendu.
- **Serveur « chaud »** : le premier passage après un démarrage à froid de `next start` peut
  donner des hauteurs de page différentes (optimisation d'images). Lancer une première fois
  `pnpm screenshots` pour rien, puis capturer la référence.
- **Sandbox sans accès direct à Internet** (ex. session Claude Code web) : lancer
  `NO_PROXY='*' no_proxy='*' pnpm screenshots`. Sans cela, une requête externe non interceptée
  fait planter Cypress avec `read ECONNRESET`.
- Régénérer la référence quand `support.ts`, `seed-random.ts` ou une fixture change : le
  rendu de la référence en dépend.

## Couverture des fichiers qui utilisaient UIkit (`remove-uikit`, EN-7175)

Audit fait avant le retrait d'UIkit : pour chaque fichier source qui contenait des classes
`uk-*` ou du JS UIkit, la capture qui l'exerce. « **non couvert** » = aucune capture ne montre
ce fichier ; il se relit à l'œil (tâche 11.7 du change). Les captures instables
(`unstable.txt`) sont marquées ⚠️.

| Fichier(s)                                                                                                                                            | Capture                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `pages/{cgu,cookies,legal-notice,data-privacy,404,contact,partenaires,entourage-pro}.tsx`                                                             | `public-page-<page>`                                                                                |
| `pages/coach-certification/[achievementId].tsx`                                                                                                       | `public-page-coach-certification`                                                                   |
| `pages/cv/[userId].tsx`                                                                                                                               | `public-page-cv` ⚠️                                                                                 |
| `components/ui/{Grid,Section,Background,SimpleLink,Images/Logo}`, `Navbar/NavbarLogo`, `features/partials/Footer/*` (dont `AssociationEntourage`)     | toutes les `public-page-*` (menu et pied de page)                                                   |
| `components/ui/Navbar/Nav/Nav.styles.tsx`, `NavConnectedContent.desktop.tsx`, `Images/ImgProfile`                                                     | `connected-nav`, `admin-dashboard`                                                                  |
| `features/partials/common/{Chapter,NewsletterPartial}.tsx`                                                                                            | `public-page-entourage-pro` (Chapter), `public-page-{404,merci,candidat,aider}` (NewsletterPartial) |
| `features/partials/pages/HomePage/CandidatListPartial`, `partials/CV/CVList`                                                                          | `public-page-home`                                                                                  |
| `components/ui/Carousel`, `partials/common/CandidateTestimoniesOrientation`, `partials/utils/CarouselItem`                                            | `public-page-home`, `public-page-candidats` (carrousel : voir `unstable.txt`)                       |
| `partials/pages/Candidats/ShareCandidatesCVTutorial`, `partials/utils/MultipleCTA`                                                                    | `public-page-candidats`                                                                             |
| `partials/pages/Partenaires/SimpleSection`                                                                                                            | `public-page-partenaires`                                                                           |
| `partials/pages/Entreprises/EntreprisesEnSavoirPlus`                                                                                                  | `public-page-entreprises-*`                                                                         |
| `features/merci/Merci`                                                                                                                                | `public-page-merci`                                                                                 |
| `features/filters/{SearchBar,FiltersDropdowns,FiltersCheckboxes}`                                                                                     | `admin-members` (dropdown du filtre Zone ouvert, cases cochées et non cochées, desktop)             |
| `backoffice/admin/members/MemberDetails/{MemberDetails,MemberDetailsHeader}`                                                                          | `admin-members` (détail d'un membre)                                                                |
| `features/modals/Modal/ModalGeneric/ModalConfirm`                                                                                                     | `admin-members` (confirmation de suppression)                                                       |
| `backoffice/dashboard/DashboardJoinWhatsappModal`                                                                                                     | `dashboard-whatsapp-modal`                                                                          |
| `backoffice/messaging/.../MessagingMessageSuspiciousModal`                                                                                            | `messaging-suspicious-link-content`                                                                 |
| `components/ui/Button/ButtonPost` (spinner `data-uk-spinner`), `pages/backoffice/admin/membres/[memberId]` (spinner de chargement)                    | **non couvert** : état transitoire, invisible une fois la page chargée                              |
| `ModalShareCV`                                                                                                                                        | **non couvert** : s'ouvre à la fermeture d'une fenêtre de partage externe (`react-share`)           |
| `features/modals/SuccessModalContent`                                                                                                                 | **non couvert** : succès d'inscription / d'intérêt, parcours non capturé                            |
| `partials/utils/NumberGrid/{NumberGrid,NumberCard}`, `ModalNotificationSending`, `components/ui/Inputs/ToggleWithModal/{ToggleWithModal,ModalToggle}` | **code mort** : aucun fichier ne les importe ; à supprimer plutôt que migrer                        |
| `*.stories.tsx`, `*.test.tsx`, `*.spec.tsx`                                                                                                           | sans objet (mis à jour avec le composant)                                                           |

## Détails techniques

- **Deux exécutions de Cypress** (`run.mjs`) plutôt qu'un `cy.viewport()` dans le test :
  `useIsDesktop()` lit d'abord le user-agent au rendu SSR. L'exécution mobile utilise donc un
  user-agent iPhone, faute de quoi la page serait rendue en desktop puis rebasculerait.
- **Page entière** : le `fullPage` natif de Cypress assemble des captures successives,
  répète le header fixe et le laisse masquer les éléments ciblés. `cy.capture()` agrandit
  plutôt le viewport à la hauteur du document le temps d'une capture unique. Contrepartie :
  un élément dimensionné en `100vh` s'étire sur toute la capture.
- **Navigateur** : Electron, fourni avec Cypress, identique en local et en CI.
