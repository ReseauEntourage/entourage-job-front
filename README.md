# Entourage Pro Frontend

Document mis à jour le 05/08/2024

[![Entourage Pro [front-end]](https://github.com/ReseauEntourage/entourage-job-front/actions/workflows/main.yml/badge.svg)](https://github.com/ReseauEntourage/entourage-job-front/actions/workflows/main.yml)

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
| **Node**    | 18.x    |
| **YARN**    | 1.22.x  |
| **Next.js** | 12.1.0  |
| **React**   | 17.0.2  |
| **Webpack** | 5.74.0  |
| **esLint**  | 8.0.1   |

## Architecture

- `entourage-job-front/`
- `.github`: configuration de la CI avec **_Github Actions_**
- `.husky` : scripts de hook de commit avec **_Husky_**
- `.storybook` : Dossier de configuration de Storybook
- `assets/` : fichiers de styles globaux avec **_UIkit_**
- `cypress/` : fichiers de tests e2e **_Cypress_**
- `public/` : stockage des ressources non dynamique accessible publiquement tels que les images, le CSS ou les fonts
- `src/`
  - `api/`: dossier contenant la définition de l'_*Api*_
  - `components/` : dossier contenant les composants **_React_** écrit avec les particularités de **_Next.js_**
  - `constants/` : fichiers de constantes
  - `hooks/` : hooks communs à plusieurs composants
  - `lib/` : librairies pure JS (analytics ...)
  - `pages/` : dossier contenant les composants **_React_** de rendu de pages
  - `store/` : dossier contenant la définition du store **_reduxjs/toolkit_**
  - `styles/` : feuilles CSS compilés à partir de **_UIkit_** + certains styles customs
  - `use-cases/` : store redux séparé en modules
  - `utils/` : fonctions utilitaires communes
  - `tsconfig`: configuration TS pour l'app
- `.editorconfig`: configuration par défaut de la syntaxe du code de l'éditeur
- `.env`: fichier de configuration de votre environnement local
- `.env.dist`: fichier de distribution des variables d'env
- `.eslintignore`: configuration pour **_ESLint_**
- `.eslintrc.json`: configuration pour **_ESLint_**
- `.gitignore.json`: configuration des fichiers et dossiers ignorés dans le stage de Git
- `.lintstagedrc.js`: fichier de configuration du lint-stage
- `.prettierignore`: configuration des fichiers et dossiers ignorés par _*Prettier*_
- `.prettierrc.json`: configuration pour **_Prettier_**
- `cypress.config.ts`: configuration pour **_Cypress_**
- `docker-compose.yml`: Définition des différents containers Docker pour le développement local
- `Dockerfile`: configuration du container Docker de l'application
- `jest.config.js`: configuration de _*Jest*_
- `Makefile`: permet l'execution de la commande `make init` créant interactivement le fichier `.env`
- `next-env.d.ts`: Fichier auto-généré par _*nextjs*_
- `next.config.js`: configuration pour _*nexjs*_
- `package.json`: configuration du projet et des dépendances
- `Procfile` : configuration des process **_Heroku_** à lancer après déploiement
- `server-next.js`: point d'entrée de lancement du serveur
- `tracer.ts`: fichier d'initialisation de la connexion à DataDog
- `next.config.js`: fichier de configuration pour **_Next.js_**
- `Procfile`: configuration des process **_Heroku_** à lancer après déploiement
- `.prettierrc.json`: configuration pour **_Prettier_**

## Installation

### Pré-requis

- Avoir installé yarn [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#debian-stable) est requis pour installer le projet

```
npm install -g yarn
```

- Avoir correctement intallé et exécuté le [back-end Entourage Pro](https://github.com/ReseauEntourage/entourage-job-back)

- Avoir créé un fichier avec les variables d'environnement nécessaires en utilisant .env.dist

### Variables d'environnement

Installation des dépendances

```
yarn install
```

### Lancement en mode développement

```
yarn dev
```

### Lancement en mode développement (utilisable sur le réseau local)

Pratique pour tester l'application sur mobile.

- Créer un fichier `.env.network` :

```
SERVER_URL=http://192.168.1.35:3001/
API_URL=http://192.168.1.35:3002/
```

- Remplacer l'adresse IP par votre IP locale sur votre réseau

- Lancer l'application avec `yarn dev:network`

- Accéder à l'application sur un autre appareil en utilisant l'url `http://192.168.1.35:3001/`

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

### TS Config

Du fait d'une différence nécessaire de configuration TS entre le dossier `src`et `cypress`, nous avons dû créer un fichier `tsconfig.base.json` à la racine du projet. Le dossier `src`de l'app autant que le dossier `cypress`des tests utilisent chacun leur propre `tsconfig`en extension de la base.

Le path du `tsconfig`pour le build de l'app est fixé dans le fichier `next.config.ts`.

Pour tester le typage du projet (app + cypress), utiliser

```
yarn run test:ts-check
```

### Storybook

Les différents composants de l'application front sont documentés dans un storybook.

Pour executer Storybook en local :

```
yarn storybook
```

Lorsque vous ajoutez de nouvelles icones dans "/assets/icons", n'oubliez pas de les intégrer au storybook grâce à cette commande :

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

## Déploiement

Le déploiement se fait automatiquement grâce à **_Github Actions_** et **_Heroku_**.

Si une branche, après PR et review, est mergée à `develop` alors l'application sera automatiquement déployée sur la pre-production: **[https://entourage-job-front-preprod.herokuapp.com](https://entourage-job-front-preprod.herokuapp.com)**

Si une branche, après test en pre-production, est mergée à `master`, alors l'application sera automatiquement déployée sur la production: **[https://Entourage Pro.fr](https://Entourage Pro.fr)**

## Extra.

Régulièrement, lancer la commande ci-dessous, afin de cleaner le code en supprimant les dependances, imports, et exports qui ne sont plus utilisés

```
npx dead-exports
```

## A lire également

L'ensemble des documentations du répertoire : [./docs](./docs/)

- [Routes Permissions](./docs/routes-permissions.md)
- [Use Cases](./docs/use-cases.md)

## Stack technique

![Stack technique Entourage Pro](./stack.svg)
