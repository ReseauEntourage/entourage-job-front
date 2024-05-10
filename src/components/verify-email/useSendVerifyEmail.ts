import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from 'src/constants';
import {
  authenticationActions,
  sendVerifyEmailSelectors,
} from 'src/use-cases/authentication';

export function useSendVerifyEmail(email?: string) {
  const dispatch = useDispatch();

  const {
    query: { token },
    isReady,
  } = useRouter();

  // either get the token from the verify email page or get the user's email on the login page
  // Dispathing
  const sendVerifyEmail = () => {
    if (isReady) {
      // if token is set
      if (token !== undefined && typeof token === 'string') {
        dispatch(
          authenticationActions.sendVerifyEmailRequested({
            token,
          })
        );
      }
      // probably on the login page, getting the users email
      else if (email) {
        dispatch(
          authenticationActions.sendVerifyEmailRequested({
            email,
          })
        );
      }
    }
  };

  const sendVerifyEmailStatus = useSelector(
    sendVerifyEmailSelectors.selectSendVerifyEmailStatus
  );

  const isSendEmailSuccess =
    sendVerifyEmailStatus === ReduxRequestEvents.SUCCEEDED;
  const isSendEmailFailed = sendVerifyEmailStatus === ReduxRequestEvents.FAILED;

  // on component unmount
  useEffect(() => {
    return () => {
      dispatch(authenticationActions.sendVerifyEmailReset());
    };
  }, [dispatch]);

  return { isSendEmailSuccess, isSendEmailFailed, sendVerifyEmail };
}
