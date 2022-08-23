# LinkedOut Frontend

------

## Modules principaux & versions

> Node 14.x.x

> React 17.0.2

> Next.js 12.1.0

> Webpack 4.46.0

> ESLint 7.32.0

> Babel 7.16.5

------

## Architecture

- `.github`: configuration de la CI avec __*Github Actions*__
- `.husky` : scripts de hook de commit avec __*Husky*__
- `/assets` : fichiers de styles globaux avec __*UIkit*__
- `/public` : stockage des éléments non dynamique tels que les images, le CSS ou les fonts
- `/src`
  - `/components` : dossier contenant les composants __*React*__ écrit avec les particularités de __*Next.js*__
  - `/constants` : fichiers de constantes
  - `/hooks` : hooks communs à plusieurs composants
  - `/lib` : librairies pure JS (analytics ...)
  - `/pages` : dossier contenant les composants __*React*__ de rendu de pages
  - `/styles` : feuilles CSS compilés à partir de __*UIkit*__ + certains styles customs
  - `/utils` : fonctions utilitaires communes
  - `Axios.js` : configuration __*Axios*__ pour communiquer facilement avec l'API
- `.editorconfig` : configuration par défaut de la syntaxe du code de l'éditeur
- `.env` : à ajouter pour gérer les variables d'environnements ([cf. exemple](#fichier-env-minimal))
- `.eslintignore` : configuration pour __*ESLint*__
- `.eslintrc.json` : configuration pour __*ESLint*__
- `next.config.js` : fichier de configuration pour __*Next.js*__
- `.prettierignore` : configuration pour __*Prettier*__
- `.prettierrc.json` : configuration pour __*Prettier*__
- `Procfile` : configuration des process __*Heroku*__ à lancer au déploiement
- `server-next`: point d'entrée de lancement du serveur
---

## Configuration

### Installation et scripts

#### Installation des modules :
```
npm install
```

#### Lancement en dev :
```
npm run dev
```

#### Lancement en prod :
```
npm run build
npm start
```

#### Prettier + Linter :
```
npm run lint
npm run format
```
Ces deux commandes sont lancés par les hooks de commit

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
```

---

## Styles

Les fichiers du thème globale, qui utilisent la librairie __*UIkit*__, se trouvent dans le dossier `/assets/custom` :

- `entourage.less` : style globale qui surcharge le thème par défaut de __*UIkit*__

- `entourage.print.less` : style utilisé pour le CV en version PDF

- `/icons` : icônes en SVG rajoutés aux icônes __*UIkit*__

Après avoir modifié les fichiers du thème, ou après avoir rajouté un icône, il faut recompiler les fichiers en CSS :

- Installer d'abord __*UIkit*__ au sein de son propre module :
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

Le déploiement se fait automatiquement grâce à __*Github Actions*__ et __*Heroku*__.

Si un commit est poussé sur `develop`, l'application sera déployé sur la pre-production : [https://entourage-job-front-preprod.herokuapp.com](https://entourage-job-front-preprod.herokuapp.com)

Si un commit est poussé sur `master`,  l'application sera déployé sur la production : [https://linkedout.fr]()

Comme il n'y a pas de tests, __*Github Actions*__ n'est utilisé que pour déployer le projet sur __*Heroku*__
