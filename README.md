# LinkedOut Frontend

## Modules principaux & versions

> Node 16.x.x

> React 17.0.2

> Next.js 12.1.0

> Webpack 4.46.0

> ESLint 7.32.0

> Babel 7.16.5

## Architecture

- `.github`: configuration de la CI avec **_Github Actions_**
- `.husky` : scripts de hook de commit avec **_Husky_**
- `/assets` : fichiers de styles globaux avec **_UIkit_**
- `/public` : stockage des ressources non dynamique accessible publiquement tels que les images, le CSS ou les fonts
- `/src`
  - `/components` : dossier contenant les composants **_React_** écrit avec les particularités de **_Next.js_**
  - `/constants` : fichiers de constantes
  - `/hooks` : hooks communs à plusieurs composants
  - `/lib` : librairies pure JS (analytics ...)
  - `/pages` : dossier contenant les composants **_React_** de rendu de pages
  - `/styles` : feuilles CSS compilés à partir de **_UIkit_** + certains styles customs
  - `/utils` : fonctions utilitaires communes
  - `Axios.js` : configuration **_Axios_** pour communiquer facilement avec l'API
- `.editorconfig` : configuration par défaut de la syntaxe du code de l'éditeur
- `.env` : à ajouter pour gérer les variables d'environnements ([cf. exemple](#fichier-env-minimal))
- `.eslintignore` : configuration pour **_ESLint_**
- `.eslintrc.json` : configuration pour **_ESLint_**
- `next.config.js` : fichier de configuration pour **_Next.js_**
- `.prettierignore` : configuration pour **_Prettier_**
- `.prettierrc.json` : configuration pour **_Prettier_**
- `Procfile` : configuration des process **_Heroku_** à lancer après déploiement
- `server-next.js`: point d'entrée de lancement du serveur

## Configuration

### Avec Docker

#### Build image et container

```
docker-compose build
```

#### Lancer le projet en mode dev

```
docker-compose up
```

### Sans Docker

#### Installation des modules

```
npm install
```

#### Lancement en en mode développement

```
yarn dev
```

### Lancement en mode production

(pour le moment sans Docker)

```
yarn build
npm start
```

### Prettier + Linter

```
yarn lint
yarn format
```

avec docker, précéder chaque commande par "docker exec front ${cmd}"

Ces deux commandes sont lancées par les hooks de commit

### Storybook

```
yarn storybook
```

### Tests

#### Tests Unitaires - Jest

La commande pour lancer les tests une fois:

```
yarn test
```

La commande pour lancer les tests en mode watch:

```
yarn test:watch
```

Si vous souhaitez obtenir le code coverage:

```
npx jest --coverage
```

Un dossier coverage sera créé. Afin de pouvoir le consulter dans le navigateur:

```
yarn posttest:cov
```

#### tests End to End - Cypress

La commande suivante permet de lancer les tests Cypress:

```
npx run cypress
```

Pour obtenir la vidéo des tests sur cypress.io, utilisez la commande suivante:

```
yarn cypress:io
```

### Fichier .env minimal

```dotenv
ADMIN_CANDIDATES_HZ=
ADMIN_CANDIDATES_LILLE=
ADMIN_CANDIDATES_LORIENT=
ADMIN_CANDIDATES_LYON=
ADMIN_CANDIDATES_PARIS=
ADMIN_CANDIDATES_RENNES=
ADMIN_COMPANIES_HZ=
ADMIN_COMPANIES_LILLE=
ADMIN_COMPANIES_LORIENT=
ADMIN_COMPANIES_LYON=
ADMIN_COMPANIES_PARIS=
ADMIN_COMPANIES_RENNES=
ADRESSE_LOCAUX_PARIS=
API_URL=
ASSOCIATION_BROCHURE=
AWSS3_CDN_URL=
AWSS3_IMAGE_DIRECTORY=
AWSS3_URL=
CDN_URL=
CYPRESS_IO_ID=
CYPRESS_IO_KEY=
DONATION_LINK=
FB_APP_ID=
FB_DOMAIN_VERIFICATION=
FB_PIXEL_ID=
GA_TRACKING_ID=
GTM_TRACKING_ID=
HEROKU_APP_NAME=
HEROKU_RELEASE_VERSION=
IRAISER_DONATION_LINK=
LINKEDIN_PARTNER_ID=
MAILJET_CONTACT_EMAIL=
PUSHER_API_KEY=
SENTRY_AUTH_TOKEN=
SENTRY_DSN=
SERVER_URL=
SHOW_POPUP=
TARTEAUCITRON_UUID=
TOOLBOX_URL=
TUTORIAL_CV=
TUTORIAL_INTERVIEW_TRAINING=
TUTORIAL_PP=
TUTORIAL_VIDEO_CV=
TUTORIAL_VIDEO_FIRST_STEPS=
TUTORIAL_VIDEO_OFFERS=
TUTORIAL_VIDEO_OFFERS_2=
WEBINAR_URL=
WOMENS_DAY=
```

## Styles

Les fichiers du thème globale, qui utilisent la librairie **_UIkit_**, se trouvent dans le dossier `/assets/custom` :

- `entourage.less` : style globale qui surcharge le thème par défaut de **_UIkit_**

- `entourage.print.less` : style utilisé pour le CV en version PDF

- `/icons` : icônes en SVG rajoutés aux icônes **_UIkit_**

Après avoir modifié les fichiers du thème, ou après avoir rajouté un icône, il faut recompiler les fichiers en CSS :

- Installer d'abord **_UIkit_** au sein de son propre module :

```
yarn uikit-install
```

- Si le module est déjà installé, le mettre à jour ;

```
yarn uikit-update
```

- Ensuite, compiler les fichiers SCSS en CSS :

```
yarn uikit-compile
```

Les fichiers transformés se retrouvent dans le dossier `/src/styles/dist`.

## Déploiement

Le déploiement se fait automatiquement grâce à **_Github Actions_** et **_Heroku_**.

Si un commit est poussé sur `develop`, l'application sera déployé sur la pre-production : **[https://entourage-job-front-preprod.herokuapp.com](https://entourage-job-front-preprod.herokuapp.com)**

Si un commit est poussé sur `master`, l'application sera déployé sur la production : **[https://linkedout.fr](https://linkedout.fr)**

Comme il n'y a pas de tests, **_Github Actions_** n'est utilisé que pour déployer le projet sur **_Heroku_**.

##

Régulièrement, cleaner le code en supprimant les commposants qui ne sont plus utilisés:

```
npx dead-exports
```

## Stack technique

![Stack technique LinkedOut](./stack.svg)
