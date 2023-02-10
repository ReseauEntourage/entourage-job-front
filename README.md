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
npm run dev
```

### Lancement en mode production

(pour le moment sans Docker)

```
npm run build
npm start
```

### Prettier + Linter

```
npm run lint
npm run format
```

avec docker, précéder chaque commande par "docker exec front ${cmd}"

Ces deux commandes sont lancées par les hooks de commit

### Storybook

```
npm run storybook
```

### Tests

#### Tests Unitaires - Jest

La commande pour lancer les tests une fois:

```
npm run test
```

La commande pour lancer les tests en mode watch:

```
npm run test:watch
```

Si vous souhaitez obtenir le code coverage:

```
npx jest --coverage
```

Un dossier coverage sera créé. Afin de pouvoir le consulter dans le navigateur:

```
npm run posttest:cov
```

#### tests End to End - Cypress

La commande suivante permet de lancer les tests Cypress:

```
npx run cypress
```

Pour obtenir la vidéo des tests sur cypress.io, utilisez la commande suivante:

```
npm run cypress:io
```

### Fichier .env minimal

```dotenv
AIRTABLE_LINK_COMPANY_HELP=
AIRTABLE_LINK_COMPANY_SENSITIZATION=
AIRTABLE_LINK_COMPANY_SPONSOR=
AIRTABLE_LINK_JOIN_LINKEDOUT=
AIRTABLE_LINK_PROFESSIONAL_REINTEGRATION=
API_URL=
ASSOCIATION_APPOINTMENT=
ASSOCIATION_BROCHURE=
AWSS3_CDN_URL=
AWSS3_IMAGE_DIRECTORY=
AWSS3_URL=
CDN_URL=
FB_APP_ID=
FB_DOMAIN_VERIFICATION=
FB_PIXEL_ID=
GA_TRACKING_ID=
GTM_TRACKING_ID=
LINKEDIN_PARTNER_ID=
MAILJET_CONTACT_EMAIL=
PORT=
PUSHER_API_KEY=
SERVER_URL=
TOOLBOX_URL=
TUTORIAL_CV=
TUTORIAL_INTERVIEW_TRAINING=
TUTORIAL_PP=
TUTORIAL_VIDEO_CV=
TUTORIAL_VIDEO_FIRST_STEPS=
TUTORIAL_VIDEO_OFFERS=
TUTORIAL_VIDEO_OFFERS_2=
CYPRESS_IO_KEY=
LOCAL_DIRNAME=
```

## Styles

Les fichiers du thème globale, qui utilisent la librairie **_UIkit_**, se trouvent dans le dossier `/assets/custom` :

- `entourage.less` : style globale qui surcharge le thème par défaut de **_UIkit_**

- `entourage.print.less` : style utilisé pour le CV en version PDF

- `/icons` : icônes en SVG rajoutés aux icônes **_UIkit_**

Après avoir modifié les fichiers du thème, ou après avoir rajouté un icône, il faut recompiler les fichiers en CSS :

- Installer d'abord **_UIkit_** au sein de son propre module :

```
npm run uikit-install
```

- Si le module est déjà installé, le mettre à jour ;

```
npm run uikit-update
```

- Ensuite, compiler les fichiers SCSS en CSS :

```
npm run uikit-compile
```

Les fichiers transformés se retrouvent dans le dossier `/src/styles/dist`.

## Déploiement

Le déploiement se fait automatiquement grâce à **_Github Actions_** et **_Heroku_**.

Si un commit est poussé sur `develop`, l'application sera déployé sur la pre-production : **[https://entourage-job-front-preprod.herokuapp.com](https://entourage-job-front-preprod.herokuapp.com)**

Si un commit est poussé sur `master`, l'application sera déployé sur la production : **[https://linkedout.fr](https://linkedout.fr)**

Comme il n'y a pas de tests, **_Github Actions_** n'est utilisé que pour déployer le projet sur **_Heroku_**.

## Stack technique

![Stack technique LinkedOut](./stack.svg)
