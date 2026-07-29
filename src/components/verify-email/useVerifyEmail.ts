import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import {
  authenticationActions,
  selectVerifyEmailTokenError,
  useVerifyEmailTokenMutation,
  VERIFY_EMAIL_TOKEN_FIXED_CACHE_KEY,
  verifyEmailTokenSelectors,
} from '@/src/use-cases/authentication';

export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const {
    query: { token },
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

  useEffect(() => {
    if (
      verifyEmailTokenStatus === ReduxRequestEvents.SUCCEEDED ||
      verifyEmailTokenStatus === ReduxRequestEvents.FAILED
    ) {
      setIsLoading(false);
    }
  }, [verifyEmailTokenStatus, verifyEmailTokenError]);

  // on component unmount
  useEffect(() => {
    return () => {
      resetVerifyEmailToken();
    };
  }, [resetVerifyEmailToken]);

  return { isLoading, verifyEmailTokenError };
}
