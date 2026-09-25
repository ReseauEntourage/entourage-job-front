🗒️ **Ticket Jira :** [EN-XXXX](https://entourage-asso.atlassian.net/browse/EN-XXXX)
📐 **Specs :** ReseauEntourage/entourage-specs#XXX · change `<nom-du-change>`
🚧 **PR Back :** ReseauEntourage/entourage-job-back#XXX

<!--
Remplacer XXX par les numéros de PR : GitHub transforme `owner/repo#123` en lien et affiche le titre et l'état de la PR au survol.
📐 Specs : la PR entourage-specs porte le pourquoi et le comment (proposal.md, design.md, specs, tasks.md) ; c'est là que se relit la conception.
  On lie la PR plutôt que le dossier du change, qui est déplacé sous changes/archive/ à l'archivage.
  Pas de change OpenSpec (hotfix, montée de version…) : écrire « aucun » et dire pourquoi dans « En bref ».
🚧 PR Back : supprimer la ligne si la PR ne touche que ce repo.
-->

## 💬 En bref

<!-- 1 à 3 lignes : ce que change cette PR côté front. Ne pas recopier la conception, elle est dans la PR specs. -->

## 🔍 Points d'attention

<!-- Ce qui mérite l'œil du reviewer : écart avec design.md, choix d'implémentation non évident, zone fragile. « RAS » sinon. -->

## 🖼️ Captures

<!-- Pour tout changement visible. Glisser les images dans les cellules ; supprimer la section sinon. -->

<details open>
<summary>Avant / après</summary>

| Avant | Après |
|:-:|:-:|
| | |

</details>

## 🚀 Déploiement

<!-- Cocher ce qui s'applique. -->

- [ ] Dépend de la PR back — à merger après elle
- [ ] Nouvelle variable d'environnement — ajoutée à `.env.dist`, à créer sur Heroku (staging et prod) avant le déploiement
- [ ] Rien de particulier
