import {
  AnyAction,
  combineReducers,
  configureStore,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, spawn, call } from 'typed-redux-saga';
import { useCasesConfig } from 'src/use-cases';
import { UseCaseConfigItem } from 'src/use-cases/types';

const useCasesList = Object.values(useCasesConfig) as UseCaseConfigItem[];

const reducersMap: Record<string, any> = {};

useCasesList.forEach(({ slice }) => {
  reducersMap[slice.name] = slice.reducer;
});

const reducers = combineReducers(reducersMap);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware({ thunk: true, serializableCheck: false }),
    sagaMiddleware,
  ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

function* rootSaga() {
  yield* all(
    useCasesList
      .filter((useCase) => !!useCase.saga)
      .map((useCase) =>
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
