import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  verifyEmailTokenSelectors,
} from 'src/use-cases/authentication';

export function useVerifyEmail() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState<boolean | undefined>(undefined);
  const dispatch = useDispatch();

  const {
    query: { token },
    isReady,
  } = useRouter();

  useEffect(() => {
    if (isReady) {
      if (token === undefined || typeof token !== 'string') {
        setIsError(true);
        setIsLoading(false);
      } else {
        const tokenString = token as string;
        dispatch(
          authenticationActions.verifyEmailTokenRequested({
            token: tokenString,
          })
        );
      }
    }
  }, [token, isReady, dispatch]);

  const verifyEmailTokenStatus = useSelector(
    verifyEmailTokenSelectors.selectVerifyEmailTokenStatus
  );

  useEffect(() => {
    if (verifyEmailTokenStatus === ReduxRequestEvents.SUCCEEDED) {
      setIsError(false);
      setIsLoading(false);
    }
    if (verifyEmailTokenStatus === ReduxRequestEvents.FAILED) {
      setIsError(true);
      setIsLoading(false);
    }
  }, [verifyEmailTokenStatus]);

  // on component unmount
  useEffect(() => {
    return () => {
      dispatch(authenticationActions.verifyEmailTokenReset());
    };
  }, [dispatch]);

  return { isLoading, isError };
}
