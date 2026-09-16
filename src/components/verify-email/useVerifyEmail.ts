import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import {
  authenticationActions,
  autologinSelectors,
  selectVerifyEmailTokenError,
  useVerifyEmailTokenMutation,
  VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
  verifyEmailTokenSelectors,
} from '@/src/use-cases/authentication';

export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const {
    query: { token, autologinToken },
    isReady,
  } = useRouter();

  useEffect(() => {
    if (isReady) {
      const tokenString = token as string;
      dispatch(
        authenticationActions.verifyEmailTokenRequested({
          token: tokenString,
        })
      );
    }
  }, [token, isReady, dispatch]);

  const verifyEmailTokenStatus = useSelector(
    verifyEmailTokenSelectors.selectVerifyEmailTokenStatus
  );
  const verifyEmailTokenError = useSelector(selectVerifyEmailTokenError);
  const [, { reset: resetVerifyEmailToken }] = useVerifyEmailTokenMutation({
    fixedCacheKey: VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
  });

  // The global `useAuthentication` hook consumes `autologinToken` and strips
  // it from the URL once resolved — remember whether it was present so this
  // hook can keep waiting on it after that.
  const [hasAutologinToken, setHasAutologinToken] = useState(false);
  useEffect(() => {
    if (typeof autologinToken === 'string') {
      setHasAutologinToken(true);
    }
  }, [autologinToken]);

  const autologinStatus = useSelector(autologinSelectors.selectAutologinStatus);
  const isAutologinResolved =
    !hasAutologinToken ||
    autologinStatus === ReduxRequestEvents.SUCCEEDED ||
    autologinStatus === ReduxRequestEvents.FAILED;

  useEffect(() => {
    if (
      (verifyEmailTokenStatus === ReduxRequestEvents.SUCCEEDED ||
        verifyEmailTokenStatus === ReduxRequestEvents.FAILED) &&
      isAutologinResolved
    ) {
      setIsLoading(false);
    }
  }, [verifyEmailTokenStatus, verifyEmailTokenError, isAutologinResolved]);

  // on component unmount
  useEffect(() => {
    return () => {
      resetVerifyEmailToken();
    };
  }, [resetVerifyEmailToken]);

  const shouldRedirectToWizard =
    verifyEmailTokenStatus === ReduxRequestEvents.SUCCEEDED &&
    hasAutologinToken &&
    autologinStatus === ReduxRequestEvents.SUCCEEDED;

  return { isLoading, verifyEmailTokenError, shouldRedirectToWizard };
}
