# Permissions des routes

- [Fonctionnement](#fonctionnement)
- [Autoriser une route pour tous les utilisateurs connectés](#autoriser-une-route-pour-tous-les-utilisateurs-connectés)
- [Routes publiques](#routes-publiques)
- [Redirection lorsqu'une route n'est pas autorisée](#redirection-lorsquune-route-nest-pas-autorisée)

---

## Fonctionnement

Les permissions permettent d'autoriser ou non l'accès à certaines routes selon le rôle de l'utilisateur. Voir le fichier de configuration des [permissions.ts](../src/hooks/authentication/permissions.ts) .

Les permissions du tableau sont évaluées dans l'ordre.
Chaque permission possède une clé `paths` et une clé `roles`:

```ts
{
  paths: [...],
  roles: [...],
},
```

Lorsque la route active correspond à l'un des `paths` de la permission, les rôles de la permissions sont évalués. Si un rôle correspond à celui de l'utilisateur connecté, alors la route est autorisée. Sinon, la permissions suivante du tableau est évaluée jusqu'à ce qu'une permission corresponde à la route active et au rôle de l'utilisateur.

Règles:

- une route peut être présente dans plusieurs permissions
- un rôle peut être présent dans plusieurs permissions

### Exemples

```ts
{
  paths: ['/backoffice/parametres'],
  roles: [USER_ROLES.ADMIN, USER_ROLES.CANDIDAT],
},
```

- un admin ou un candidat sera autorisé à accéder à toutes les routes commençant par `/backoffice/parametres`

---

```ts
{
  paths: ['/backoffice'],
  roles: [USER_ROLES.ADMIN],
},
{
  paths: ['/backoffice/parametres', '/backoffice/candidat'],
  roles: [USER_ROLES.CANDIDATE],
},
```

- un admin sera autorisé à accéder à toutes les routes commençant par `/backoffice`
- un candidat sera seulement autorisé à accéder aux routes commençant par `/backoffice/parametres` et `/backoffice/candidat`

## Autoriser une route pour tous les utilisateurs connectés

Pour autoriser une route à tous les utilisateurs connectés, il faut utiliser `roles: '*'`

```ts
{
  paths: ['/backoffice/parametres'],
  roles: '*',
},
```

:warning: cette route ne sera pas accéssible aux utilisateurs non connectés

## Routes publiques

Si une route n'est présente dans aucun `paths`, elle est considérée comme publique et donc accéssible à tous (y compris les utilisateurs non connectés).

## Redirection lorsqu'une route n'est pas autorisée

Lorsqu'une route n'est pas autorisée:

- si l'utilisateur est connecté, il est redirigé vers la route par défault correspondant à son role. [Voir les routes par défault](../src/utils/Redirects.ts)
- si l'utlisateur n'est pas connecté, il est redirigé vers la page d'accueil
