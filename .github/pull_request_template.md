🗒️ **Ticket Jira :** [EN-XXXX](https://entourage-asso.atlassian.net/browse/EN-XXXX)
📐 **Specs :** ReseauEntourage/entourage-specs#XXX · change `<nom-du-change>`
🚧 **PR Back :** ReseauEntourage/entourage-job-back#XXX

<!--
Replace XXX with the PR numbers: GitHub turns `owner/repo#123` into a link and shows the PR title and state on hover.
📐 Specs: the entourage-specs PR carries the why and the how (proposal.md, design.md, specs, tasks.md); design is reviewed there.
  Link the PR rather than the change folder, which moves under changes/archive/ when the change is archived.
  No OpenSpec change (hotfix, version bump…): write « aucun » and explain why in « En bref ».
🚧 PR Back: delete the line if this PR only touches this repo.
-->

## 💬 En bref

<!-- 1 to 3 lines: what this PR changes on the front side. Do not copy the design, it lives in the specs PR. -->

## 🔍 Points d'attention

<!-- What deserves the reviewer's attention: deviation from design.md, non-obvious implementation choice, fragile area. « RAS » otherwise. -->

## 🖼️ Captures

<!--
Filled AUTOMATICALLY by the « PR screenshots » workflow from the cypress/pr-screenshots/*.shot.ts
specs added or modified in this PR (desktop + mobile).
Visible change => add or update a capture spec (cypress/pr-screenshots/README.md).
Do not edit the content between the two markers: it is rewritten on every push.
-->

<!-- screenshots:start -->
_⏳ Les captures apparaîtront ici après l'exécution du workflow **PR screenshots**._
<!-- screenshots:end -->

## 🚀 Déploiement

<!-- Tick what applies. -->

- [ ] Dépend de la PR back — à merger après elle
- [ ] Nouvelle variable d'environnement — ajoutée à `.env.dist`, à créer sur Heroku (staging et prod) avant le déploiement
- [ ] Rien de particulier
