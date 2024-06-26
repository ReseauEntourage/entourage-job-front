import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  selectVerifyEmailTokenError,
  verifyEmailTokenSelectors,
} from 'src/use-cases/authentication';

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
      dispatch(authenticationActions.verifyEmailTokenReset());
    };
  }, [dispatch]);

  return { isLoading, verifyEmailTokenError };
}
