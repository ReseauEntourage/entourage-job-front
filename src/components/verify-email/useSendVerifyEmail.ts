import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  sendVerifyEmailSelectors,
} from 'src/use-cases/authentication';

export function useSendVerifyEmail() {
  const [isSent, setIsSent] = useState(false);
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

  const sendVerifyEmailStatus = useSelector(
    sendVerifyEmailSelectors.selectSendVerifyEmailStatus
  );

  // On query response
  useEffect(() => {
    if (sendVerifyEmailStatus === ReduxRequestEvents.SUCCEEDED) {
      setIsSent(true);
    }
  }, [sendVerifyEmailStatus]);

  // on component unmount
  useEffect(() => {
    return () => {
      dispatch(authenticationActions.sendVerifyEmailReset());
    };
  }, [dispatch]);

  return { isSent, sendVerifyEmail };
}
