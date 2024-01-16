# Use cases

Un use case est une brique métier, indépendante de toute interface utilisateur et service externe.
Les use case sont construit avec [Redux toolkit](https://redux-toolkit.js.org/). Commencez par lire la documentation de redux toolkit avant de continuer.

---

- [Architecture](#files-architecture)
  - [index](#index)
  - [slice](#slice)
  - [saga](#saga)
  - [selecteurs](#selecteurs)
  - [adapteurs](#adapteurs)
    - [requête](#requête)
    - [entité](#entité)
- [Integrations](#integration)
  - [Ajouter un-nouveau use-case](#ajouter-un-nouveau-use-case)
  - [Utilisation avec React](#utilisation-avec-react)

## Architecture

```
/use-cases/authentication
  └── index.ts
  └── authentication.adapters.ts
  └── authentication.selectors.ts
  └── authentication.slice.ts
  └── authentication.saga.ts
  └── authentication.spec.ts
```

- `index.ts` - api public du use-case
- `authentication.adapters.ts` - utilistaire pour les requêtes et les entitiés
- `authentication.selectors.ts` - selecteurs redux
- `authentication.slice.ts` - slice redux - [documentation officielle](https://redux-toolkit.js.org/api/createSlice)
- `authentication.saga.ts` - saga redux - [documentation officielle](https://redux-saga.js.org/)
- `authentication.spec.ts` - test unitaires

## Index

`index.ts`

```ts
import { saga } from './authentication.saga';
import { slice } from './authentication.slice';

export * from './authentication.selectors';

export const authenticationActions = slice.actions;

export const authenticationConfig = {
  slice,
  saga,
};
```

## Slice

Un slice est une combinaison de reducer + actions. Voir [Redux toolkit slice documentation](https://redux-toolkit.js.org/api/createSlice)

`authentication.slice.ts`

```ts
import { SliceRootState } from 'src/store/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  userId: string | null;
  isFetching: boolean;
}

const initialState: State = {
  userId: null,
  isFetching: false,
};

const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    fetchCurrentUserRequested(state) {
      state.isFetching = true;
    },
    fetchCurrentUserSucceeded(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
    },
  },
});

export type RootState = SliceRootState<typeof slice>;
```

## Selecteurs

Un selecteur permet d'exporter les données du store de manière public.

`authentication.selectors.ts`

```ts
import { RootState } from './authentication.slice.ts';

export function selectCurrentUser(state: RootState) {
  return state.authentication.user;
}
```

## Saga

[official redux saga documentation](https://redux-saga.js.org/)

Redux saga permet de créer des effet de bord comme des appels api, mais également de gérer des scénario complexes.

Par défaut, redux saga fonctionne assez mal avec TypeScript. Pour pallier à ce problème, nous utilisons [typed-redux-saga](https://github.com/agiledigital/typed-redux-saga), une surcouche qui permet d'améliorer le typage des effect comme `call`, `select`, etc.

`authentication.saga.ts`

```ts
import { takeLatest, call } from 'typed-redux-saga';
import { authenticationSlice } from './authentication.slice';

const { fetchCurrentUserRequested, fetchCurrentUserSucceeded } = slice.actions;

function* fetchCurrentUserRequestedSaga(action: ReturnType<typeof fetchCurrentUserRequested>) {
  const user = yield* call(...);

  yield put(fetchCurrentUserSucceeded({ user }));
}

export function* authenticationSaga() {
  yield* takeLatest(fetchCurrentUserRequested, fetchCurrentUserRequestedSaga);
}
```

# Adapteurs

## Requête

`createRequestAdapter()` est un utilitaire qui permet de générer des actions et selecteurs pour gérer des requêtes api.

actions:

- `requested`
- `succeeded`
- `failed`
- `reset`

`authentication.adapters.ts`

```ts
import {
  createRequestAdapter,
  RequestState,
  SliceRootState,
} from 'src/store/utils';

export const loginRequestAdapter = createRequestAdapter('login').withPayloads<
  { email: string; password: string }, // request payload
  { accessToken: string }, // success payload
  void // failed payload
>();
```

`authentication.slice.ts`

```ts

interface State {
  accessToken: string | null;
  login: RequestState<typeof loginRequestAdapter>
}

const initialState: State {
  accessToken: null,
  login: loginRequestAdapter.getInitialState()
}

export const slice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
      ...loginRequestAdapter.getReducers<State>(state => state.login, {
        loginSucceeded(state, action) {
          state.accessToken = action.payload.accessToken;
        },
      }),
  },
});

...
```

`authentication.selector.ts`

```ts
import { RootState, loginRequest } from './authentication.slice';

export const loginSelectors = loginRequest.getSelectors<RootState>(
  (state) => state.authentication.login
);
```

## Entité

`createEntityAdapter()` est un utilitaire fourni par redux toolkit et qui permet de générer des entitée (création, modification, suppression). Voir [redux-toolkit createEntityAdapter()](https://redux-toolkit.js.org/api/createEntityAdapter)

Exemple:

`candidats.adapters.ts`

```ts
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
import { SliceRootState } from 'src/store/utils';
import { Candidat } from 'src/api/types';

export const candidatEntityAdapter = createEntityAdapter<Candidat>();
```

`candidats.slice.ts`

```ts
import { EntityState } from '@reduxjs/toolkit';
import { Candidat } from 'src/api/types';

interface State {
  candidats: EntityState<Candidat>;
}

const initialState: State {
  candidats: candidatEntityAdapter.getInitialState(),
}

export const slice = createSlice({
  name: 'candidats',
  initialState,
  reducers: {
    fetchCandidatsSucceeded(state, action: Payload<{ candidats: Candidat[] }>) {
      candidatEntityAdapter.setAll(state.candidats, action.payload.candidats);
    }
  },
});

...
```

`candidats.selectors.ts`

```ts
import { RootState } from './candidats.slice';
import { candidatEntityAdapter } from './candidats.adapters';

export const { selectAll: selectCandidats } =
  candidatEntityAdapter.getSelectors<RootState>(
    (state) => state.candidats.candidats
  );
```

# Integration

## Ajouter un nouveau use case

`src/use-cases/index.ts`

il suffit d'ajouter la configuration du nouveau use case dans l'objet `useCaseConfig`

```ts
import { authenticationConfig } from 'use-cases/authentication';

export const useCaseConfig = {
  authenticationConfig,
};
```

## Utilisation avec React

`DashboardPage.tsx`

```tsx
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCurrentUser,
  selectIsFetchUserRequested,
  authenticationActions,
} from './use-cases/authentication';

export function DashboardPage() {
  const dispatch = useDispatch();

  const isFetchUserRequested = useSelector(selectIsFetchUserRequested);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(authenticationActions.fetchUserRequested());
  }, [dispatch]);

  if (isFetchUserRequested) {
    return <Loader />;
  }

  return <div>{user.name}</div>;
}
```
