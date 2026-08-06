# Permissions des routes

- [Fonctionnement](#fonctionnement)
- [Permissions actuelles](#permissions-actuelles)
- [Autoriser une route pour tous les utilisateurs connectés](#autoriser-une-route-pour-tous-les-utilisateurs-connectés)
- [Routes publiques](#routes-publiques)
- [Redirection lorsqu'une route n'est pas autorisée](#redirection-lorsquune-route-nest-pas-autorisée)

---

## Fonctionnement

Les permissions autorisent ou non l'accès à certaines routes selon le rôle de l'utilisateur. La configuration se trouve dans [permissions.ts](../src/hooks/authentication/permissions.ts), et l'évaluation dans [useRoutePermissions.ts](../src/hooks/authentication/useRoutePermissions.ts).

Chaque permission possède une clé `paths` et une clé `roles` :

```ts
{
  paths: [...],
  roles: [...],
},
```

L'évaluation se fait en trois temps sur le `pathname` courant :

1. On collecte **toutes** les permissions dont l'un des `paths` est un préfixe de la route active (`pathname.startsWith(path)`).
2. Si aucune ne correspond → la route est **publique**, l'accès est autorisé.
3. Sinon, l'utilisateur doit être connecté, puis l'accès est accordé si **au moins une** des permissions retenues l'autorise — soit parce qu'elle vaut `roles: '*'`, soit parce que son tableau `roles` contient le rôle de l'utilisateur.

Règles :

- une route peut être présente dans plusieurs permissions ;
- un rôle peut être présent dans plusieurs permissions ;
- **l'ordre du tableau n'a pas d'importance** : les permissions applicables sont combinées, la plus permissive l'emporte. Pour restreindre une sous-route, il ne suffit donc pas de la déclarer plus bas dans le tableau — il faut que la route parente ne soit pas déjà ouverte plus largement ;
- les `paths` utilisent la syntaxe de route Next.js, paramètres compris (`/backoffice/profile/[userId]`).

### Exemples

```ts
{
  paths: ['/backoffice/parametres'],
  roles: [UserRoles.ADMIN, UserRoles.CANDIDATE],
},
```

- un admin ou un candidat sera autorisé à accéder à toutes les routes commençant par `/backoffice/parametres`

```ts
{
  paths: ['/backoffice/dashboard'],
  roles: [UserRoles.CANDIDATE, UserRoles.COACH, UserRoles.REFERER],
},
{
  paths: ['/backoffice/admin'],
  roles: [UserRoles.ADMIN],
},
```

- le tableau de bord est ouvert aux candidats, coachs et prescripteurs, mais pas aux admins
- l'espace admin est réservé aux admins

## Permissions actuelles

Les rôles sont définis dans [`src/constants/users.ts`](../src/constants/users.ts) : `Candidat`, `Coach`, `Prescripteur` (`REFERER`), `Admin`.

| Routes | Rôles autorisés |
| --- | --- |
| `/backoffice/parametres`, `/backoffice/profile/[userId]`, `/backoffice/annuaire`, `/backoffice/messaging`, `/backoffice/events`, `/backoffice/events/[eventId]`, `/backoffice/alerte-candidats/[alertId]`, `/backoffice/companies/parametres`, `/backoffice/companies/[companyId]`, `/backoffice/companies/[companyId]/collaborators` | tous les utilisateurs connectés (`'*'`) |
| `/backoffice/dashboard`, `/backoffice/candidat/[candidateId]`, `/backoffice/candidat/[candidateId]/cv` | Candidat, Coach, Prescripteur |
| `/backoffice/candidat/list`, `/backoffice/referer/orienter/[step]`, `/backoffice/referer/orienter/confirmation` | Prescripteur |
| `/backoffice/admin` | Admin |

## Autoriser une route pour tous les utilisateurs connectés

Pour autoriser une route à tous les utilisateurs connectés, utiliser `roles: '*'` :

```ts
{
  paths: ['/backoffice/parametres'],
  roles: '*',
},
```

:warning: cette route ne sera pas accessible aux utilisateurs non connectés.

## Routes publiques

Si une route n'est présente dans aucun `paths`, elle est considérée comme publique et donc accessible à tous (y compris les utilisateurs non connectés).

## Redirection lorsqu'une route n'est pas autorisée

Lorsqu'une route n'est pas autorisée :

- si l'utilisateur est connecté, il est redirigé vers la route par défaut correspondant à son rôle, donnée par `getDefaultUrl()` ([Redirects.ts](../src/utils/Redirects.ts)) ;
- si l'utilisateur n'est pas connecté, il est redirigé vers la page d'accueil.

| Rôle | Route par défaut |
| --- | --- |
| Admin | `/backoffice/admin/membres` |
| Candidat | `/backoffice/dashboard` |
| Coach | `/backoffice/dashboard` |
| Prescripteur | `/backoffice/dashboard` |
