import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import {
  CREATE_USER_FIXED_CACHE_KEY,
  registrationApi,
} from './registration.api';
import {
  selectInvitationId,
  selectPreRegistrationPreferences,
  selectRegistrationData,
  selectRegistrationIsEnded,
  selectRegistrationSelectedFlow,
} from './registration.selectors';
import { slice } from './registration.slice';

/** Translates `createUserRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: slice.actions.createUserRequested,
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as never;

    listenerApi.dispatch(
      registrationApi.endpoints.createUser.initiate(
        {
          data: selectRegistrationData(state),
          selectedFlow: selectRegistrationSelectedFlow(state),
          invitationId: selectInvitationId(state),
          preRegistrationPreferences: selectPreRegistrationPreferences(state),
        },
        { fixedCacheKey: CREATE_USER_FIXED_CACHE_KEY }
      )
    );
  },
});

/**
 * Translates `moveForwardInRegistrationSaga` — forces a render after moving
 * forward, but not on the last step (`isLoading` then stays `true`, owned by
 * the `createUser` mutation's own loading state instead).
 */
listenerMiddleware.startListening({
  actionCreator: slice.actions.moveForwardInRegistration,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(slice.actions.setRegistrationIsLoading(true));

    const isEnded = selectRegistrationIsEnded(listenerApi.getState() as never);
    if (!isEnded) {
      await listenerApi.delay(300);
      listenerApi.dispatch(slice.actions.setRegistrationIsLoading(false));
    }
  },
});

/** Translates `resetRegistrationDataSaga` — forces a render after resetting. */
listenerMiddleware.startListening({
  actionCreator: slice.actions.resetRegistrationData,
  effect: async (_action, listenerApi) => {
    listenerApi.dispatch(slice.actions.setRegistrationIsLoading(true));
    await listenerApi.delay(300);
    listenerApi.dispatch(slice.actions.setRegistrationIsLoading(false));
  },
});
