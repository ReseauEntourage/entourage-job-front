import { configureStore, combineSlices } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { extendedSlices } from 'src/use-cases';
import { createRootSaga } from './utils';

const uniqueExtendedSlices = Array.from(new Set(extendedSlices));
const slices = uniqueExtendedSlices.map(({ slice }) => slice);
const sagas = uniqueExtendedSlices.map(({ saga }) => saga);

const rootReducer = combineSlices(...slices);

const rootSaga = createRootSaga(sagas, (error) => {
  console.error('Error in root saga:', error);
});

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(sagaMiddleware);
  },
});

sagaMiddleware.run(rootSaga);
