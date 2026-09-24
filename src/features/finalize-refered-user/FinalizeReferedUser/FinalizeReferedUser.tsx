import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Api } from '@/src/api';
import {
  isEmailAlreadyVerifiedError,
  isInvalidTokenError,
  isTokenExpiredError,
} from '@/src/api/axiosErrors';
import { PostAuthFinalizeReferedUserParams } from '@/src/api/types';
import { Spinner } from '@/src/components/ui/Spinner';
import { FormWithValidation } from '@/src/features/forms/FormWithValidation';
import { formFinalizeReferedUser } from '@/src/features/forms/schemas/formFinalizeReferedUser';
import { authenticationActions } from '@/src/use-cases/authentication';
import { SendFinalizeReferedUserButton } from '../SendFinalizeReferedUserButton';
import { getTokenExpirationDate } from '../getTokenExpirationDate';

export const EXPIRED_LINK_MESSAGE =
  "Votre lien d'activation a expiré. Vous pouvez en recevoir un nouveau par email.";
export const INVALID_LINK_MESSAGE =
  "Ce lien d'activation n'est pas valide. Vérifiez que vous avez bien ouvert le lien reçu par email.";

const isExpired = (token: string) => {
  const expirationDate = getTokenExpirationDate(token);
  return !!expirationDate && expirationDate.getTime() < Date.now();
};

export const FinalizeReferedUser = () => {
  const [tokenString, setToken] = useState<string | null>(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  const {
    query: { token },
    isReady,
    push,
  } = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReady) {
      const queryToken = typeof token === 'string' ? token : null;
      setToken(queryToken);
      // Tell the candidate right away, rather than after they typed a password
      // for nothing. The backend still rejects expired tokens on submit.
      setIsLinkExpired(!!queryToken && isExpired(queryToken));
    }
  }, [token, isReady]);

  if (!isReady) {
    return <Spinner />;
  }

  if (!tokenString) {
    return <p>{INVALID_LINK_MESSAGE}</p>;
  }

  if (isLinkExpired) {
    return (
      <>
        <p>{EXPIRED_LINK_MESSAGE}</p>
        <SendFinalizeReferedUserButton token={tokenString} />
      </>
    );
  }

  return (
    <>
      <FormWithValidation
        submitText="Se connecter"
        formSchema={formFinalizeReferedUser}
        onSubmit={async ({ setPassword }, setError) => {
          const params: PostAuthFinalizeReferedUserParams = {
            token: tokenString,
            password: setPassword,
          };
          try {
            const response = await Api.postAuthFinalizeReferedUser(params);
            setError('');
            dispatch(
              authenticationActions.loginRequested({
                email: response.data,
                password: setPassword,
              })
            );
            await push('/backoffice/dashboard');
          } catch (err) {
            if (isTokenExpiredError(err)) {
              // Expired between page load and submit, or client clock ahead.
              setIsLinkExpired(true);
            }
            if (isInvalidTokenError(err)) {
              setError(INVALID_LINK_MESSAGE);
            }
            if (isEmailAlreadyVerifiedError(err)) {
              setError('Vous avez déja défini un mot de passe');
            }
          }
        }}
      />
    </>
  );
};
