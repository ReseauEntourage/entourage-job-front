# Tests Cypress pour l'app Entourage pro

Les tests e2e sont utilisés afin de tester des parcours utilisateurs.

Ils sont exécutés:

- en local pendant le developpement
- sur le Github Actions
  - lors de l'ouverture d'une PR sur `develop` ou `master`
  - à chaque commit sur une branche qui a une PR ouverte sur `develop` ou `master`
  - à chaque push sur la branche `develop` ou `master`

## Architecture

- `e2e/`
  - `test/`: les fichiers de specs avec tous les tests e2e
    - `journey/`: parcours communs
    - `user/`: parcours propre à un type de user
  - `intercept/`: les tableaux d'interception des requêtes en backend -- un fichier par fichier de test
  - `bootstrap.ts`: script qui lance la génération des json
- `fixtures/`: dossier qui contient l'ensemble des fixtures utilisées par les intercepts
  - `api/`: fixtures générées dynamiquement
  - `src/`: fonctions utilitaires permettant de générer les fixtures dynamiques
- `support/`
  - `e2e.ts`: point d'entrée du dossier support
  - `command.ts`: ajout de commandes à l'objet `cy`

## Fonctionnement général

Les tests sont écrits dans le dossier `e2e/test`.

Au début de chaque test, des fixtures dynamiques seront générées, et l'ensemble des intercepts seront chargés avec leurs fixtures pour la bonne exécution des tests.

## Génération des fixtures

Dans le dossier `fixtures/src`, des fonctions helpers ont été crées et permettent de générer des fixtures qui seront écrites dans les fichiers du dossier `fixtures/api`.

Le fichier `command.ts` permet d'ajouter chacune des fonctions helpers à l'objet `cy`qui pourront ainsi être appelées sur les fichiers de test.

Le fichier `bootstrap.ts` exécute l'ensemble des helpers pour générer les fixtures dynamiquement au début de chaque test.

Les fichiers de tests appellent systématiquement la fonction `bootstrap()`.

Les fichiers qui sont à la racine du dossier `fixtures` sont des fixtures statiques, qui ne sont pas générées automatiquement, mais qui sont utilisées dans les tests, n'ayant pas encore été migrées vers un fonctionnement de génération automatique.

## Environnement

Les variables spécifiques aux tests cypress sont définies dans le fichier `cypress.config.ts`.
Elles dépendent des variables fixées à la racine:

- `CYPRESS_IO_PROJECT_ID`: pour envoyer les résultats du test sur la plateforme cypress.io
- `SERVER_URL`: mandatory, pour mocker les requêtes en backend sur la bonne URL

Pour le bon fonctionnement des tests et de l'appli, la liste des variables d'environnement supplémentaires qui doivent être présentes dans le fichier d'environnement à la racine se trouvent dans le fichier `.github/workflows/main.yml`.

## TS config

Les fichiers cypress nécessitent, pour fonctionner en Typescript, que l'option de compilation `isolatedModule` soit à `false`. Or Next, lors du build et du run de l'appli, utilise nécessairement l'option `isolatedModule` à `true`.

Il faut donc garder cette configuration des `tsconfig.json` séparée afin de ne pas avoir d'erreur typescript et de respecter l'écosystème de chaque techno (Next et Cypress)/

## Exécuter les tests en local

L'application doit préalablement tourner en local pour que soient exécutés les tests.

- sur le terminal: `yarn run cypress:io`
- émuler le navigateur: `yarn run cypress:local`

L'exécution sur le terminal envoie automatiquement le résultat sur la plateforme cypress.io.

## Dette tech

30/05/24

- les intercepts n'ont pas toutes été migrées dans le dossier `test/intercept`
- les fixtures ne sont pas toutes générées automatiquement
