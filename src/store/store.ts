import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { useCasesConfig } from '@/src/use-cases';
import { UseCaseConfigItem } from '@/src/use-cases/types';
import { api } from './api/api.slice';
import { listenerMiddleware } from './listenerMiddleware';
import { getPreloadedState } from './preloadedState';

const useCasesList = Object.values(useCasesConfig) as UseCaseConfigItem[];

const reducersMap: Record<string, any> = {
  [api.reducerPath]: api.reducer,
};

useCasesList.forEach(({ slice }) => {
  reducersMap[slice.name] = slice.reducer;
});

// Cast needed so `api.middleware` (which requires the `api` reducer key to
// be concretely present in the root state type) and `preloadedState` type
// check: `reducersMap`'s `Record<string, any>` typing otherwise widens
// `combineReducers`' inferred state to a bare index signature that doesn't
// satisfy either. See `createTestStore.ts` for the same pattern.
type StoreState = Record<string, any> & {
  [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
};

const reducers = combineReducers(reducersMap) as unknown as Reducer<
  StoreState,
  AnyAction,
  Partial<StoreState>
>;

export const store = configureStore({
  reducer: reducers,
  preloadedState: getPreloadedState(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: true, serializableCheck: false })
      .prepend(listenerMiddleware.middleware)
      .concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;
