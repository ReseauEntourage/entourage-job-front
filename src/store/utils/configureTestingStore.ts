import { combineSlices, configureStore, Middleware } from '@reduxjs/toolkit';
import createSagaMiddleware, { Saga } from 'redux-saga';
import { createRootSaga } from './createRootSaga';
import { ExtendedSlicesList } from './types';

function createDispatchedActionsMiddleware() {
  const dispatchedActions: unknown[] = [];

  function dispatchedActionsMiddleware() {
    return (next: (action: unknown) => unknown) => (action: unknown) => {
      dispatchedActions.push(action);

      return next(action);
    };
  }

  return {
    dispatchedActionsMiddleware,
    dispatchedActions,
  };
}

interface ConfigureTestingStoreParams<
  ExtendedSlices extends ExtendedSlicesList
> {
  slices?: ExtendedSlices;
  isSagaEnabled?: boolean;
}

export function configureTestingStore<
  ExtendedSlices extends ExtendedSlicesList
>(params?: ConfigureTestingStoreParams<ExtendedSlices>) {
  const { slices: extendedSlices, isSagaEnabled = true } = params ?? {};

  const { dispatchedActionsMiddleware, dispatchedActions } =
    createDispatchedActionsMiddleware();

  const sagaMiddleware = isSagaEnabled ? createSagaMiddleware() : undefined;

  const middleware: Middleware[] = [dispatchedActionsMiddleware];

  if (sagaMiddleware) {
    middleware.push(sagaMiddleware);
  }

  const uniqueExtendedSlices = Array.from(new Set(extendedSlices));
  const slicesReducers = uniqueExtendedSlices.map(({ slice }) => slice);
  const slicesSagas = uniqueExtendedSlices
    .filter((saga) => !!saga)
    .map(({ saga }) => saga as Saga);

  const store = configureStore({
    reducer: combineSlices(...slicesReducers),
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(middleware);
    },
  });

  if (sagaMiddleware) {
    const rootSaga = createRootSaga(slicesSagas);

    sagaMiddleware.run(rootSaga);
  }

  // ---------------------------------------------
  //                  MOCK
  // ---------------------------------------------

  type TestingStore = typeof store & {
    mock: {
      dispatchedActions: unknown[];
    };
    resetDispatchMock(): void;
  };

  const testingStore = store as TestingStore;

  testingStore.mock = { dispatchedActions };
  testingStore.resetDispatchMock = () => {
    testingStore.mock.dispatchedActions.length = 0;
  };

  // ---------------------------------------------

  return testingStore;
}
