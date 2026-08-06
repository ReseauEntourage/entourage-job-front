# Use cases

Un use case est une brique métier, indépendante de toute interface utilisateur.

Les use cases sont construits avec [Redux Toolkit](https://redux-toolkit.js.org/) et [RTK Query](https://redux-toolkit.js.org/rtk-query/overview). Commencez par lire la documentation de ces deux outils avant de continuer.

> **Historique** — ce projet utilisait auparavant `redux-saga`. La migration vers RTK Query est terminée : il n'y a plus aucune saga dans le code. Les décisions d'architecture de cette migration sont documentées dans le change OpenSpec archivé `2026-07-29-redux-saga-to-rtk-query` (les commentaires du code y font référence sous le nom `design.md`).

---

- [Architecture des fichiers](#architecture-des-fichiers)
- [Slice](#slice)
- [Endpoints RTK Query](#endpoints-rtk-query)
- [Listeners](#listeners)
- [Sélecteurs](#sélecteurs)
- [Adapters](#adapters)
- [Intégration](#intégration)
  - [Ajouter un nouveau use case](#ajouter-un-nouveau-use-case)
  - [Utilisation avec React](#utilisation-avec-react)
- [Tests](#tests)

---

## Architecture des fichiers

```
src/use-cases/authentication/
├── index.ts                        # API publique du use case
├── authentication.slice.ts         # état local du domaine (createSlice)
├── authentication.api.ts           # endpoints RTK Query (api.injectEndpoints)
├── authentication.listeners.ts     # branchement actions -> endpoints
├── authentication.selectors.ts     # sélecteurs publics
├── authentication.adapters.ts      # types d'erreur, adapters de requête/entité
└── *.spec.ts                       # tests unitaires
```

| Fichier | Rôle |
| --- | --- |
| `index.ts` | API publique : ré-exporte sélecteurs et hooks, expose `<domaine>Actions` et `<domaine>Config`, importe les listeners pour effet de bord |
| `*.slice.ts` | État **local** au domaine : ce que RTK Query ne stocke pas (sélection courante, saisie en cours, erreurs typées…) |
| `*.api.ts` | Appels réseau et cache, via `api.injectEndpoints` |
| `*.listeners.ts` | Réactions à des actions (les siennes ou celles d'un autre domaine) |
| `*.selectors.ts` | Lecture publique du store, y compris du cache RTK Query |
| `*.adapters.ts` | `createRequestAdapter`, `createEntityAdapter`, enums d'erreur |

Un domaine **peut n'avoir aucun slice** s'il est entièrement porté par RTK Query — c'est le cas de `profile-completion`, qui n'expose donc pas de config mais est importé pour son seul effet de bord d'enregistrement.

### `index.ts`

```ts
import { UseCaseConfigItem } from '../types';
import './authentication.listeners';
import { slice } from './authentication.slice';

export * from './authentication.selectors';
export * from './authentication.api';

export const authenticationActions = slice.actions;

export const authenticationConfig = {
  slice,
} as UseCaseConfigItem;
```

L'import `'./authentication.listeners'` est **volontairement sans binding** : il ne sert qu'à exécuter les `startListening` au chargement du module.

---

## Slice

Un slice combine reducer et actions. Voir la [documentation createSlice](https://redux-toolkit.js.org/api/createSlice).

Depuis la migration, un slice ne contient plus les données serveur (elles vivent dans le cache RTK Query), mais :

- l'état d'interface propre au domaine (`selectedConversationId`, `query`, `newMessage`…) ;
- les erreurs métier typées que RTK Query ne modélise pas telles quelles ;
- des **actions déclencheuses no-op**, qui servent de point d'entrée public au domaine.

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceRootState } from '@/src/store/utils';

interface State {
  accessToken: string | null;
  loginError: LoginError | null;
}

const initialState: State = {
  accessToken: null,
  loginError: null,
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    loginSucceeded(state, action: PayloadAction<{ accessToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.loginError = null;
    },
    // Action déclencheuse no-op : le traitement réel vit dans
    // `authentication.api.ts`, déclenché par `authentication.listeners.ts`.
    loginRequested(
      _state,
      _action: PayloadAction<{ email: string; password: string }>
    ) {},
  },
});

export type RootState = SliceRootState<typeof slice>;
```

Le pattern « action `*Requested` no-op + listener » remplace le `takeLatest` des sagas : les composants continuent de dispatcher une action métier lisible, sans connaître RTK Query.

---

## Endpoints RTK Query

Deux règles structurantes, valables pour **tous** les domaines :

1. **Une seule instance `createApi` pour toute l'application**, définie dans `src/store/api/api.slice.ts`. Chaque domaine ajoute ses endpoints avec `api.injectEndpoints({...})` — on ne crée jamais un second `createApi()`.
2. Cette instance utilise **`fakeBaseQuery()`** : chaque endpoint appelle l'instance Axios existante (`Api.*`, dans `src/api/api.ts`) depuis son propre `queryFn`, ce qui préserve l'authentification et les intercepteurs au lieu de les réimplémenter dans un `baseQuery` générique.

```ts
import { Api } from '@/src/api';
import { api } from '@/src/store/api/api.slice';
import { slice } from './authentication.slice';

const { loginSucceeded, loginFailed } = slice.actions;

export const LOGIN_FIXED_CACHE_KEY = 'login';

export const authenticationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      { accessToken: string },
      { email: string; password: string }
    >({
      queryFn: async ({ email, password }) => {
        try {
          const response = await Api.postAuthLogin({ email, password });
          return { data: { accessToken: response.data.token } };
        } catch (error) {
          return { error: 'INVALID_CREDENTIALS' as LoginError };
        }
      },
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginSucceeded(data));
        } catch (rejection) {
          dispatch(
            loginFailed({ error: (rejection as { error: LoginError }).error })
          );
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authenticationApi;
```

### Points d'attention

- **`queryFn` doit toujours retourner `{ data }` ou `{ error }`**, jamais lever. Une valeur d'erreur **falsy** est interprétée comme « pas d'erreur » : c'est pourquoi les enums d'erreur du projet utilisent des valeurs **chaîne** (`TOKEN_EXPIRED = 'TOKEN_EXPIRED'`) et non les valeurs numériques par défaut, qui commenceraient à `0`.
- **`queryFulfilled` rejette avec `{ error, isUnhandledError, meta }`**, pas avec la valeur retournée comme `error` : il faut lire `(rejection as { error: T }).error`.
- **`fixedCacheKey`** sert à partager le résultat d'une mutation entre le listener qui la déclenche et les composants qui l'observent — c'est le pattern documenté par RTK Query pour ce découpage.
- **Mise à jour optimiste du cache** : `api.util.updateQueryData` / `upsertQueryData` dans `onQueryStarted` remplacent ce que faisaient les reducers `*Succeeded` (voir `messaging.api.ts` pour un exemple complet).

---

## Listeners

Le projet utilise **un seul listener middleware partagé** (`src/store/listenerMiddleware.ts`), sur le même principe additif que `injectEndpoints`. Un domaine qui doit réagir à une action appelle `listenerMiddleware.startListening({...})` dans son propre fichier `*.listeners.ts`.

```ts
import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { authenticationApi, LOGIN_FIXED_CACHE_KEY } from './authentication.api';
import { slice } from './authentication.slice';

const { actions } = slice;

listenerMiddleware.startListening({
  actionCreator: actions.loginRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.login.initiate(action.payload, {
        fixedCacheKey: LOGIN_FIXED_CACHE_KEY,
      })
    );
  },
});
```

Un listener global est enregistré directement dans `listenerMiddleware.ts` : **à la déconnexion**, `logoutSucceeded` déclenche `api.util.resetApiState()`. La plupart des endpoints interrogent des données implicitement liées à l'utilisateur courant (via le token, pas via un identifiant explicite en argument) ; sans ce reset, une entrée de cache pourrait fuiter d'une session à l'autre.

---

## Sélecteurs

Un sélecteur expose publiquement les données du store. Il peut lire le slice **ou** le cache RTK Query.

```ts
import { RootState } from './authentication.slice';

export const selectCurrentUser = (state: RootState) =>
  state.authentication.user;
```

Pour lire une entrée de cache depuis un sélecteur, on passe par les sélecteurs générés par l'endpoint. Le `RootState` du domaine doit alors être élargi à la clé du reducer `api` :

```ts
import { api } from '@/src/store/api/api.slice';
import { RootState as MessagingSliceRootState } from './messaging.slice';

type RootState = MessagingSliceRootState & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

export const selectConversations = (state: RootState) =>
  messagingApi.endpoints.getConversations.select()(state).data ?? null;
```

Pour un statut de requête, `messaging.selectors.ts` fournit un helper `toReduxRequestStatus()` qui convertit les flags RTK Query (`isUninitialized` / `isLoading` / `isSuccess` / `isError`) vers l'enum `ReduxRequestEvents` déjà utilisée par les composants — ce qui évite de devoir migrer tous les consommateurs en même temps que la couche de données :

```ts
export const selectGetConversationsStatus = (state: RootState) =>
  toReduxRequestStatus(messagingApi.endpoints.getConversations.select()(state));
```

---

## Adapters

### `createRequestAdapter`

Utilitaire maison (`src/store/utils/`) qui génère, pour une requête gérée dans un slice, les actions `requested` / `succeeded` / `failed` / `reset` et les sélecteurs de statut associés (`selectIsXIdle`, `selectIsXRequested`, `selectIsXSucceeded`, `selectIsXFailed`, `selectXStatus`).

```ts
import { createRequestAdapter } from '@/src/store/utils';

export const loginRequestAdapter = createRequestAdapter('login').withPayloads<
  { email: string; password: string }, // payload de la requête
  { accessToken: string },             // payload du succès
  void                                 // payload de l'échec
>();
```

```ts
const initialState: State = {
  login: loginRequestAdapter.getInitialState(),
};

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    ...loginRequestAdapter.getReducers<State>((state) => state.login, {
      loginSucceeded(state, action) {
        state.accessToken = action.payload.accessToken;
      },
    }),
  },
});
```

> Pour du **nouveau code, préférez RTK Query** : ses `isLoading` / `isSuccess` / `isError` couvrent le même besoin sans slice dédié. `createRequestAdapter` reste utilisé par les domaines dont le statut n'a pas encore été migré.

### `createEntityAdapter`

Utilitaire fourni par Redux Toolkit pour gérer des collections normalisées. Voir la [documentation officielle](https://redux-toolkit.js.org/api/createEntityAdapter).

```ts
export const candidatEntityAdapter = createEntityAdapter<Candidat>();

// slice
const initialState: State = {
  candidats: candidatEntityAdapter.getInitialState(),
};

// selectors
export const { selectAll: selectCandidats } =
  candidatEntityAdapter.getSelectors<RootState>((state) => state.candidats.candidats);
```

---

## Intégration

### Ajouter un nouveau use case

1. Créer le dossier `src/use-cases/<domaine>/` avec les fichiers décrits plus haut.
2. Exposer `<domaine>Config` depuis son `index.ts`.
3. L'enregistrer dans `src/use-cases/index.ts` :

```ts
import { authenticationConfig } from './authentication';

export const useCasesConfig: UseCaseConfigType = {
  authenticationConfig,
  // …
};
```

`src/store/store.ts` parcourt cette liste et branche automatiquement chaque `slice.reducer` dans le store, aux côtés du reducer RTK Query. **Aucune modification de `store.ts` n'est nécessaire.**

Si le domaine n'a pas de slice, ne pas l'ajouter à `useCasesConfig` mais l'importer pour effet de bord :

```ts
import './profile-completion';
```

Penser également à ajouter son `RootState` à `TestRootState` dans `src/store/testUtils/createTestStore.ts`.

### Utilisation avec React

Deux styles cohabitent, tous deux valides.

**Via les hooks RTK Query** — à privilégier pour une lecture directe :

```tsx
export function ConversationList() {
  const { data: conversations, isLoading } = useGetConversationsQuery();

  if (isLoading) return <Spinner />;

  return <List items={conversations} />;
}
```

**Via actions et sélecteurs** — quand le domaine expose une intention métier ou orchestre plusieurs appels :

```tsx
export function DashboardPage() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(authenticationActions.loginRequested({ email, password }));
  }, [dispatch]);

  return <div>{currentUser?.firstName}</div>;
}
```

---

## Tests

`src/store/testUtils/` fournit de quoi tester un domaine contre un **vrai store**, et non un store mocké :

| Utilitaire | Usage |
| --- | --- |
| `createTestStore(preloadedState?)` | Store construit depuis le même registre de use cases que la production |
| `renderWithProviders(ui, options?)` | `render` de Testing Library enveloppé dans un `<Provider>` réel |
| `mockApi` | Mocks de l'instance `Api` |
| `seedAccessToken()` | Amorce un token dans `localStorage`, lu par `getPreloadedState()` |
| `flushPromises()` | Laisse la chaîne listener → RTK Query → reducer se résoudre |

Les tests exercent ainsi la chaîne complète *listener → endpoint → reducer → sélecteur*.

```ts
const store = createTestStore();
store.dispatch(authenticationActions.loginRequested({ email, password }));
await flushPromises();
expect(selectCurrentUser(store.getState())).toBeDefined();
```
