import { listenerMiddleware } from '@/src/store/listenerMiddleware';
import {
  AUTOLOGIN_FIXED_CACHE_KEY,
  authenticationApi,
  LOGIN_FIXED_CACHE_KEY,
  LOGOUT_FIXED_CACHE_KEY,
  SEND_VERIFY_EMAIL_FIXED_CACHE_KEY,
  VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
  VERIFY_OTP_FIXED_CACHE_KEY,
} from './authentication.api';
import { slice } from './authentication.slice';

const { actions } = slice;

/** Translates `loginRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.loginRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.login.initiate(action.payload, {
        fixedCacheKey: LOGIN_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `logoutRequestedSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.logoutRequested,
  effect: (_action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.logout.initiate(undefined, {
        fixedCacheKey: LOGOUT_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `verifyEmailTokenSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.verifyEmailTokenRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.verifyEmailToken.initiate(action.payload, {
        fixedCacheKey: VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `sendVerifyEmailSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.sendVerifyEmailRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.sendVerifyEmail.initiate(action.payload, {
        fixedCacheKey: SEND_VERIFY_EMAIL_FIXED_CACHE_KEY,
      })
    );
  },
});

/** Translates `verifyOtpSaga`'s trigger. */
listenerMiddleware.startListening({
  actionCreator: actions.verifyOtpRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.verifyOtp.initiate(action.payload, {
        fixedCacheKey: VERIFY_OTP_FIXED_CACHE_KEY,
      })
    );
  },
});

listenerMiddleware.startListening({
  actionCreator: actions.autologinRequested,
  effect: (action, listenerApi) => {
    listenerApi.dispatch(
      authenticationApi.endpoints.autologin.initiate(action.payload, {
        fixedCacheKey: AUTOLOGIN_FIXED_CACHE_KEY,
      })
    );
  },
});
