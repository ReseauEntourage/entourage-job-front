# Tests Cypress pour l'app Entourage Pro

Les tests e2e sont utilisés afin de tester des parcours utilisateurs.

Ils sont exécutés :

- en local pendant le développement
- sur GitHub Actions (workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml))
  - lors de l'ouverture d'une PR sur `develop` ou `master`
  - à chaque commit sur une branche qui a une PR ouverte sur `develop` ou `master`
  - à chaque push sur la branche `develop` ou `master`

Les résultats ne sont envoyés à Cypress Cloud que pour les exécutions sur `develop`.

## Architecture

- `e2e/`
  - `test/` : les fichiers de specs avec tous les tests e2e
    - `journey/` : parcours communs (`company`, `formations-elearning`, `guide`, `referer`, `wizard`)
    - `user/` : parcours propres à un type d'utilisateur (`admin`, `auth`, `visitor`, `messaging`, `messaging-ai-assistant`, `messaging-dashboard-widget`)
    - `bootstrap.ts` : script qui lance la génération des fixtures
  - `intercept/` : les tableaux d'interception des requêtes back-end — un fichier `*.req.ts` par fichier de test, rangé selon la même arborescence `journey/` / `user/`
- `fixtures/` : dossier qui contient l'ensemble des fixtures utilisées par les intercepts
  - `api/` : fixtures générées dynamiquement (`api/generated/`)
  - `src/` : fonctions utilitaires permettant de générer les fixtures dynamiques (`user`, `login`, `messaging`, `organization`, `campaign`, `nudges`, `business-sectors`)
- `support/`
  - `e2e.ts` : point d'entrée du dossier support
  - `commands.ts` : ajout de commandes à l'objet `cy`

## Fonctionnement général

Les tests sont écrits dans le dossier `e2e/test`.

Au début de chaque test, des fixtures dynamiques sont générées, et l'ensemble des intercepts sont chargés avec leurs fixtures pour la bonne exécution des tests.

## Génération des fixtures

Dans le dossier `fixtures/src`, des fonctions helpers permettent de générer des fixtures qui seront écrites dans les fichiers du dossier `fixtures/api`.

Le fichier `support/commands.ts` ajoute chacune de ces fonctions helpers à l'objet `cy`, qui pourront ainsi être appelées depuis les fichiers de test.

Le fichier `e2e/test/bootstrap.ts` exécute l'ensemble des helpers pour générer les fixtures dynamiquement au début de chaque test. Les fichiers de tests appellent systématiquement la fonction `bootstrap()`.

Les fichiers qui sont à la racine du dossier `fixtures` sont des fixtures statiques, qui ne sont pas générées automatiquement mais qui sont utilisées dans les tests, n'ayant pas encore été migrées vers un fonctionnement de génération automatique.

## Environnement

Les variables spécifiques aux tests Cypress sont définies dans le fichier [`cypress.config.ts`](../cypress.config.ts). Elles dépendent des variables fixées à la racine :

- `CYPRESS_IO_PROJECT_ID` : pour envoyer les résultats du test sur Cypress Cloud
- `CYPRESS_IO_KEY` : clé d'enregistrement Cypress Cloud
- `NEXT_PUBLIC_SERVER_URL` : obligatoire, sert de `baseUrl` et permet de mocker les requêtes back-end sur la bonne URL

Pour le bon fonctionnement des tests et de l'appli, la liste des variables d'environnement supplémentaires qui doivent être présentes dans le fichier d'environnement à la racine se trouve dans le bloc `env` du fichier [`.github/workflows/ci.yml`](../.github/workflows/ci.yml).

## TS config

Les fichiers Cypress nécessitent, pour fonctionner en TypeScript, que l'option de compilation `isolatedModules` soit à `false`. Or Next, lors du build et du run de l'appli, utilise nécessairement `isolatedModules` à `true`.

Il faut donc garder ces configurations `tsconfig.json` séparées afin de ne pas avoir d'erreur TypeScript et de respecter l'écosystème de chaque techno (Next et Cypress). Les deux étendent le `tsconfig.base.json` de la racine :

- `src/tsconfig.json` — `isolatedModules: true`
- `cypress/tsconfig.json` — `isolatedModules: false`

## Exécuter les tests en local

L'application doit préalablement tourner en local pour que les tests soient exécutés.

- dans le terminal : `pnpm run cypress:io`
- émuler le navigateur : `pnpm run cypress:local`

L'exécution dans le terminal envoie automatiquement le résultat sur Cypress Cloud (elle lit `CYPRESS_IO_KEY` depuis le `.env`).

## Dette tech

- les intercepts n'ont pas tous été migrés dans le dossier `e2e/intercept`
- les fixtures ne sont pas toutes générées automatiquement
