# Entourage Pro Frontend

[![Entourage Pro [front-end]](https://github.com/ReseauEntourage/entourage-job-front/actions/workflows/main.yml/badge.svg?branch=chore%2Fgithub-action)](https://github.com/ReseauEntourage/entourage-job-front/actions/workflows/main.yml)

## Sommaire

- [Modules principaux & versions](#modules-principaux--versions)
- [Architecture](#architecture)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Tests](#tests)
- [Styles](#styles)
- [Pipeline](#pipeline)
- [Déploiement](#déploiement)
- [Extra.](#extra.)
- [Stack technique](#stack-technique)
- Code
  - [Use cases](./docs/use-cases.md)
  - [Permissions des routes](./docs/routes-permissions.md)

## Modules principaux & versions

| App         | Version |
| ----------- | ------- |
| **Node**    | 16.17.x |
| **NPM**     | 8.15.x  |
| **YARN**    | 1.22.x  |
| **Next.js** | 12.3.4  |
| **React**   | 17.0.2  |
| **Webpack** | 4.46.0  |
| **esLint**  | 7.32.0  |

## Architecture

- `entourage-job-front/`
- `.github`: configuration de la CI avec **_Github Actions_**
- `.husky` : scripts de hook de commit avec **_Husky_**
- `assets/` : fichiers de styles globaux avec **_UIkit_**
- `public/` : stockage des ressources non dynamique accessible publiquement tels que les images, le CSS ou les fonts
- `src/`
  - `components/` : dossier contenant les composants **_React_** écrit avec les particularités de **_Next.js_**
  - `constants/` : fichiers de constantes
  - `hooks/` : hooks communs à plusieurs composants
  - `lib/` : librairies pure JS (analytics ...)
  - `pages/` : dossier contenant les composants **_React_** de rendu de pages
  - `styles/` : feuilles CSS compilés à partir de **_UIkit_** + certains styles customs
  - `use-cases/` : store redux séparé en modules
  - `utils/` : fonctions utilitaires communes
- `.editorconfig`: configuration par défaut de la syntaxe du code de l'éditeur
- `Makefile`: permet l'execution de la commande `make init` créant interactivement le fichier `.env`
- `.env.dist`: fichier de distribution
- `.eslintignore`: configuration pour **_ESLint_**
- `.eslintrc.json`: configuration pour **_ESLint_**
- `next.config.js`: fichier de configuration pour **_Next.js_**
- `.prettierignore`: configuration pour **_Prettier_**
- `.prettierrc.json`: configuration pour **_Prettier_**
- `Procfile`: configuration des process **_Heroku_** à lancer après déploiement
- `server-next.js`: point d'entrée de lancement du serveur

## Configuration

Construire le fichier _.env_ contenant les variables d'environnement

```
make init
```

Vérifier que le [back-end Entourage Pro](https://github.com/ReseauEntourage/entourage-job-back) fonctionne correctement

```
docker ps
```

[Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) est requis pour installer le projet

```
npm install -g yarn
```

Installation des dépendances - décrite dans le fichier _yarn-lock.json_

```
yarn install
```

### Lancement en mode développement

```
yarn dev
```

### Lancement en mode production

Pour le moment sans Docker

```
yarn build
```

Puis

```
npm start
```

### Prettier + Linter

```
yarn lint && yarn format
```

Avec docker, précéder chaque commande par `docker exec front ${cmd}`

Ces deux commandes sont lancées par les hooks de commit

Si un bug apparait lors de l'utilisation de git ajouter l'option suivante

```
--no-verify
```

### Storybook

Pour accéder à la page documenté des composants

```
yarn storybook
```

Don't forget to import icons into the storybook when adding a new one in "/assets/icons"

```
yarn add-icons
```

## Styles

> Suppression progressive de la librairie **_UIkit_**

Les fichiers du thème globale, qui utilisent la librairie <strike>**_UIkit_**</strike>, se trouvent dans le dossier `/assets/custom`

- `entourage.less` : style globale qui surcharge le thème par défaut de <strike>**_UIkit_**</strike>

- `entourage.print.less` : style utilisé pour le CV en version PDF

- `/icons` : icônes en SVG rajoutés aux icônes <strike>**_UIkit_**</strike>

Après avoir modifié les fichiers du thème, ou après avoir rajouté un icône, il faut recompiler les fichiers en CSS

- Installer d'abord <strike>**_UIkit_**</strike> au sein de son propre module

```
yarn uikit-install
```

- Si le module est déjà installé, le mettre à jour

```
yarn uikit-update
```

- Ensuite, compiler les fichiers SCSS en CSS

```
yarn uikit-compile
```

Les fichiers se retrouvent dans le dossier _/src/styles/dist_.

## Tests

### Tests Unitaires - Jest

La commande pour lancer les tests une fois

```
yarn test
```

La commande pour lancer les tests en mode watch

```
yarn test:watch
```

Si vous souhaitez obtenir le code coverage

```
jest --coverage
```

Un dossier coverage sera créé. Afin de pouvoir le consulter dans le navigateur.

### Tests End to End (E2E) - Cypress

La commande suivante permet de lancer les tests Cypress:

```
yarn cypress:local
```

Pour obtenir la vidéo des tests sur cypress.io, utilisez la commande suivante:

```
yarn cypress:io
```

## Pipeline CI/CD

#### Pipeline CI

Lire le fichier _.github/workflows/main.yml_
Ce fichier constitue le workflow [Github Actions](https://docs.github.com/fr/actions)

À chaque évènement de type: open, synchronized, reopened sur une PR executera le workflow.

Et ici la documentation concernant l'action [Cypress.io](https://docs.cypress.io/guides/continuous-integration/github-actions).

#### Pipeline CD

> W.I.P.

## Déploiement

Le déploiement se fait automatiquement grâce à **_Github Actions_** et **_Heroku_**.

Si une branche, après PR et review, est mergée à `develop` alors l'application sera automatiquement déployée sur la pre-production: **[https://entourage-job-front-preprod.herokuapp.com](https://entourage-job-front-preprod.herokuapp.com)**

Si une branche, après test en pre-production, est mergée à `master`, alors l'application sera automatiquement déployée sur la production: **[https://Entourage Pro.fr](https://Entourage Pro.fr)**

## Extra.

Régulièrement, lancer la commande ci-dessous, afin de cleaner le code en supprimant les dependances, imports, et exports qui ne sont plus utilisés

```
npx dead-exports
```

## Stack technique

Dernier update: _14/12/2023_

![Stack technique Entourage Pro](./stack.svg)
