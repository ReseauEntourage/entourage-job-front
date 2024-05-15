import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authenticationActions,
  sendVerifyEmailSelectors,
} from 'src/use-cases/authentication';

export function useSendVerifyEmail() {
  const dispatch = useDispatch();

  const {
    query: { token },
    isReady,
  } = useRouter();

  // either get the token from the verify email page or get the user's email on the login page
  // Dispathing
  const sendVerifyEmail = () => {
    if (isReady) {
      if (token !== undefined && typeof token === 'string') {
        dispatch(
          authenticationActions.sendVerifyEmailRequested({
            token,
          })
        );
      }
    }
  };

  const isSent = useSelector(
    sendVerifyEmailSelectors.selectIsSendVerifyEmailSucceeded
  );

  // on component unmount
  useEffect(() => {
    return () => {
      dispatch(authenticationActions.sendVerifyEmailReset());
    };
  }, [dispatch]);

  return { isSent, sendVerifyEmail };
}