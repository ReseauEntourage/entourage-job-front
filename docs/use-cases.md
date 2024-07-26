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
- [Testing](#testing)
  - [Mock api et fake entities](#mock-api-et-fake-entities)
  - [Jest matchers](#jest-matchers)
    - [toHaveDispatchedAction()](#tohavedispatchedaction)
    - [toHaveDispatchedActionTimes()](#tohavedispatchedactiontimes)
  - [Exemples](#exemples)
    - [Test de succès](#test-de-succès)
    - [Test d'échec](#test-déchec)
- [Integrations](#integration)
  - [Ajouter un-nouveau use-case](#ajouter-un-nouveau-use-case)
  - [Utilisation avec React](#utilisation-avec-react)
  - [Testing avec React](#testing-avec-react)

## Architecture

```
/use-cases/authentication
  └── index.ts
  └── authentication.adapters.ts
  └── authentication.extraSelectors.ts
  └── authentication.slice.ts
  └── authentication.saga.ts
  └── authentication.spec.ts
```

- `index.ts` - api public du use-case
- `authentication.adapters.ts` - utilistaire pour les requêtes et les entitiés
- `authentication.selectors.ts` - selecteurs redux du slice combiné à des selecteurs d'autres slices
- `authentication.slice.ts` - slice redux - [documentation officielle](https://redux-toolkit.js.org/api/createSlice)
- `authentication.saga.ts` - saga redux - [documentation officielle](https://redux-saga.js.org/)
- `authentication.spec.ts` - test unitaires

## Index

`index.ts`

```ts
import { saga } from './authentication.saga';
import { slice } from './authentication.slice';
export { extraSelectors } from './authentication.selectors';

export const authentication = createExtendedSlice({
  slice,
  saga,
  extraSelectors,
});
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
  selectors: {
    selectorUserId(state) {
      return state.userId;
    },
    selectorIsFetching(state) {
      return state.isFetching;
    }
  }
});

export type RootState = SliceRootState<typeof slice>;
```

## Extra selecteurs

Un selecteur permet d'exporter les données du store de manière public. Les selecteurs du slice sont exportable depuis la clé `selectors` dans la fonction `createSlice`, cependant il arrive régulièrement d'avoir besoin d'utiliser un selecteur d'un autre slice. Pour ça, il est possible d'utiliser les `extraSelectors` de la fonction `createExtendedSlice`, en renseignant les extra selecteur dans un fichier `*.selectors.ts`

`authentication.selectors.ts`

```ts
import { RootState } from './authentication.slice.ts';
import { user } from '../user';

export function selectIsCurrentUserAllowedToEditProfile(state: RootState) {
  const isAdmin = user.selectors.selectIsAdmin(state);
  const isLogged = !!state.authentication.user;

  return isAdmin && isLogged;
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
  selectors: {
    selectAccessToken: (state) => state.accessToken,
    ...loginRequestAdapter.getSelectors<State>(state => login),
  }
});

...
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

export const candidatEntityAdapterSelectors = candidatEntityAdapter.getSelectors();
```

`candidats.slice.ts`

```ts
import { EntityState } from '@reduxjs/toolkit';
import { Candidat } from 'src/api/types';
import {
  candidatEntityAdapter,
  candidatEntityAdapterSelectors,
} from './candidats.adapters';

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
    },
    selectAllCandidats(state) {
      return candidatEntityAdapterSelectors.selectAll(state.candidats);
    }
  },
});

...
```

`candidats.selectors.ts`

extra selector are use to combine selector from multiple slices.

```ts
import { RootState } from './candidats.slice';
import { candidatEntityAdapter, candidatEntityAdapterSelectors } from './candidats.adapters';
import { authentication } from '../authentication';

export function selectCurrentCandidat(state: RootState) {
  const currentUserId = authentication.selectors.selectCurrentUserId(state);
  const canddidat = candidatEntityAdapterSelectors.selectById(state.candidats, currentUserId);

  return canddidat;
}
```

# Testing

Pour tester un use case, nous utilisons les actions et les selecteurs.Les tests ne doivent pas avoir connaissance des saga.

Le flow de test est le suivant:
- on dispatch des actions
- on vérifie le retour de selecteurs

Parfois, nous pouvons également vérifier que certaines actions on correctement été dispatch.

Nous utilisons la syntaxe Gherkin: Given, When, Then.

Given: état initial de l'application
When: action utilisateur
Then: état attendu

## Mock api et fake entities

Afin de pouvoir simuler le comportement des retours api, nous avons besoin de fausse donnée. Pour ça, nous avons besoin de créer de fausse entitée en utilisant [fakerjs](https://fakerjs.dev/), dans le dossier `src/api/fake-entities` .

Ensuite, nous avons besoin de surcharger les appels api, via des fonction `mockApiSuccess` et `mockApiError` . Il est important de ne pas oublier de simuler l'état asynchrone avec `await` sur le retour de l'api.

## Jest matchers

- [toHaveDispatchedAction()](#tohavedispatchedaction)
- [toHaveDispatchedActionTimes()](#tohavedispatchedactiontimes)

### `toHaveDispatchedAction()`

Deux notations sont possibles :

#### 1. `toHaveDispatchedAction(action)`

Permet de vérifier qu'une action a été dispatch sans vérifier le payload

```ts
expect(store).toHaveDispatchedAction(authentication.actions.loginRequested)
```

```ts
expect(store).not.toHaveDispatchedAction(authentication.actions.loginRequested)
```

#### 2. `toHaveDispatchedAction(action())`

Permet de vérifier qu'une action a été dispatch avec un payload exact

```ts
expect(store).toHaveDispatchedAction(authentication.actions.loginRequested({ email: '...', password: '...' }))
```

```ts
expect(store).not.toHaveDispatchedAction(authentication.actions.loginRequested({ email: '...', password: '...' }));
```

### `toHaveDispatchedActionTimes()`

Ce matcher est identique à `toHaveDispatchedAction` mais va permettre de compter le nombre d'appels

```ts
expect(store).toHaveDispatchedActionTimes(2, authentication.actions.loginRequested);
```

## Exemples

### Test de succès

```ts
import { createFakeUser } from 'src/api/fake-entities/createUser';
import { mockApiSuccess } from 'src/api/testUtils';
import { configureTestingStore } from 'src/store/utils/configureTestingStore';;
import { authentication } from '.';

describe('authentication', () => {
  it(`
    Given post auth login is set to return ACCESS_TOKEN_FROM_SERVER
    When the user dispatchs loginRequested with email and password
    Then access token should be equal to TOKEN
  `, async () => {
    const accessToken = 'ACCESS_TOKEN_FROM_SERVER';
    const user = createFakeUser();

    const postAuthLoginPromise = mockApiSuccess('postAuthLogin', {
      data: {
        token: accessToken,
        user,
      },
    });

    const store = configureTestingStore({
      slices: [authentication],
    });

    store.dispatch(
      authentication.actions.loginRequested({
        email: 'john.doe@domain.com',
        password: 'abc',
      })
    );

    await postAuthLoginPromise();

    expect(authentication.selectors.selectAccessToken(store.getState())).toEqual(accessToken);
    expect(store).toHaveDispatchedAction(authentication.actions.loginSucceeded);
  });
});
```

### Test d'échec

```ts
import { createIsTooManyRequests } from 'src/api/axiosErrors';
import { mockApiError } from 'src/api/testUtils';
import { configureTestingStore } from 'src/store/utils/configureTestingStore';;
import { authentication } from '.';

describe('authentication', () => {
  it(`
    Given post auth login is set to failed with too many request error
    When the user dispatchs loginRequested with email and password
    Then login error should be RATE_LIMIT
  `, async () => {
    const postAuthLoginPromise = mockApiError(
      'postAuthLogin',
      createIsTooManyRequests()
    );

    const store = configureTestingStore({
      slices: [authentication],
    });

    store.dispatch(
      authentication.actions.loginRequested({
        email: 'john.doe@domain.com',
        password: 'abc',
      })
    );

    try {
      await postAuthLoginPromise();
    } catch {
      // do nothing
    }

    expect(authentication.actions.selectLoginError(store.getState())).toBe('RATE_LIMIT');
  });
})
```

Note: ne pas oublié le try / catch, car nous simulons une erreur serveur

# Integration

## Ajouter un nouveau use case

`src/use-cases/index.ts`

il suffit d'ajouter la configuration du nouveau use case dans l'objet `useCaseConfig`

```ts
import { authentication } from 'use-cases/authentication';

export const extendedSlices = [
  authentication,
];
```

## Utilisation avec React

`DashboardPage.tsx`

```tsx
import { useSelector, useDispatch } from 'react-redux';
import { authentication } from './use-cases/authentication';

export function DashboardPage() {
  const dispatch = useDispatch();

  const isFetchUserRequested = useSelector(authentication.selectors.selectIsFetchUserRequested);
  const currentUser = useSelector(authentication.selectors.selectCurrentUser);

  useEffect(() => {
    dispatch(authentication.actions.fetchUserRequested());
  }, [dispatch]);

  if (isFetchUserRequested) {
    return <Loader />;
  }

  return <div>{user.name}</div>;
}
```

## Testing avec React

TODO
