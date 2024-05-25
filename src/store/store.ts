import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, spawn, call } from 'typed-redux-saga';
import { useCasesConfig } from 'src/use-cases';
import { UseCaseConfigItem } from 'src/use-cases/types';

const useCasesList = Object.values(useCasesConfig) as UseCaseConfigItem[];

const reducers = useCasesList.reduce(
  (acc, { slice }) => ({
    ...acc,
    [slice.name]: slice.reducer,
  }),
  {}
);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(sagaMiddleware);
  },
});

function* rootSaga() {
  yield* all(
    useCasesList
      .filter((useCase) => !!useCase.saga)
      .map((useCase) =>
        // eslint-disable-next-line func-names
        spawn(function* () {
          while (true) {
            try {
              yield* call(useCase.saga);
              break;
            } catch (error) {
              store.dispatch({
                type: 'SAGA_ERROR',
                error: error?.toString?.(),
                useCaseName: useCase.slice.name,
              });
            }
          }
        })
      )
  );
}

sagaMiddleware.run(rootSaga);
