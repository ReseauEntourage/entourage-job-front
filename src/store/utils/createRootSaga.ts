/* eslint-disable func-names */
import { Saga } from 'redux-saga';
import { all, call, spawn, put } from 'typed-redux-saga';

export function createRootSaga(
  sagas: Saga[],
  onError?: (error: Error) => void
) {
  return function* rootSaga() {
    yield* all(
      sagas.map((saga) =>
        spawn(function* () {
          while (true) {
            try {
              yield* call(saga);
              break;
            } catch (error) {
              if (onError && error instanceof Error) {
                onError(error);
              }

              yield* put({
                type: 'SAGA_ERROR',
                error: error?.toString?.(),
              });
            }
          }
        })
      )
    );
  };
}
