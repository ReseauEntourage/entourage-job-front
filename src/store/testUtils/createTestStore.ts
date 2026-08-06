import {
  AnyAction,
  combineReducers,
  configureStore,
  Reducer,
} from '@reduxjs/toolkit';
import { api } from '@/src/store/api/api.slice';
import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import { getPreloadedState } from '@/src/store/preloadedState';
import { useCasesConfig } from '@/src/use-cases';
import type { RootState as AuthenticationRootState } from '@/src/use-cases/authentication/authentication.slice';
import type { RootState as CompanyRootState } from '@/src/use-cases/company/company.slice';
import type { RootState as CurrentUserRootState } from '@/src/use-cases/current-user/current-user.slice';
import type { RootState as ElearningRootState } from '@/src/use-cases/elearning/elearning.slice';
import type { RootState as EventsRootState } from '@/src/use-cases/events/events.slice';
import type { RootState as GamificationRootState } from '@/src/use-cases/gamification/gamification.slice';
import type { RootState as MessagingRootState } from '@/src/use-cases/messaging/messaging.slice';
import type { RootState as NotificationsRootState } from '@/src/use-cases/notifications/notifications.slice';
import type { RootState as OnboardingRootState } from '@/src/use-cases/onboarding/onboarding.slice';
import type { RootState as OnboardingOldRootState } from '@/src/use-cases/onboardingOld/onboarding.slice';
// Side-effect only: no slice/saga left (see use-cases/index.ts).
import '@/src/use-cases/profile-completion';
import type { RootState as ProfilesRootState } from '@/src/use-cases/profiles/profiles.slice';
import type { RootState as RecruitementAlertsRootState } from '@/src/use-cases/recruitement-alerts/recruitement-alerts.slice';
import type { RootState as ReferingRootState } from '@/src/use-cases/refering/refering.slice';
import type { RootState as RegistrationRootState } from '@/src/use-cases/registration/registration.slice';
import { UseCaseConfigItem } from '@/src/use-cases/types';

const useCasesList = Object.values(useCasesConfig) as UseCaseConfigItem[];

const reducersMap: Record<string, any> = {
  [api.reducerPath]: api.reducer,
};

useCasesList.forEach(({ slice }) => {
  reducersMap[slice.name] = slice.reducer;
});

// Cast once: `reducersMap` is built dynamically from the runtime use-cases
// registry (see `TestRootState` comment above for why it can't be typed
// through `combineReducers`' own inference).
const reducers = combineReducers(reducersMap) as unknown as Reducer<
  TestRootState,
  AnyAction,
  Partial<TestRootState>
>;

// Built from each domain's own (already independently-typed) `RootState`
// instead of `ReturnType<typeof reducers>`: combining all 15 domains'
// createSlice-generated types through combineReducers' own generic
// inference is complex enough that the TypeScript checker silently widens
// the result to `unknown` (reproduced with a minimal repro, not specific to
// this codebase). Intersecting the pre-resolved per-domain types sidesteps
// that entirely.
export type TestRootState = AuthenticationRootState &
  CompanyRootState &
  CurrentUserRootState &
  ElearningRootState &
  EventsRootState &
  GamificationRootState &
  MessagingRootState &
  NotificationsRootState &
  OnboardingRootState &
  OnboardingOldRootState &
  ProfilesRootState &
  RecruitementAlertsRootState &
  ReferingRootState &
  RegistrationRootState & {
    [K in typeof api.reducerPath]: ReturnType<typeof api.reducer>;
  };

/**
 * Builds a real store from the same use-case reducer registry as the
 * production store (`src/store/store.ts`), so behavioral tests exercise the
 * actual listener -> RTK Query -> reducer -> selector chain instead of a
 * mocked one.
 */
export function createTestStore(preloadedState?: Partial<TestRootState>) {
  const store = configureStore({
    reducer: reducers,
    // Mirrors `store.ts`: `authentication`'s access token comes from
    // `getPreloadedState()` (localStorage) — `seedAccessToken()` in tests
    // relies on this same read happening here. An explicit
    // `preloadedState.authentication` still overrides it.
    preloadedState: { ...getPreloadedState(), ...preloadedState },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: true, serializableCheck: false })
        .prepend(listenerMiddleware.middleware)
        .concat(api.middleware),
  });

  return store;
}

export type TestStore = ReturnType<typeof createTestStore>;
