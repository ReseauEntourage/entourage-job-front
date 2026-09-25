import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@/src/api';
import {
  isEmailAlreadyVerifiedError,
  isInvalidTokenError,
  isTokenExpiredError,
} from '@/src/api/axiosErrors';
import { PostAuthFinalizeAccountParams } from '@/src/api/types';
import { Text } from '@/src/components/ui';
import { Spinner } from '@/src/components/ui/Spinner';
import { FormWithValidation } from '@/src/features/forms/FormWithValidation';
import { formFinalizeAccount } from '@/src/features/forms/schemas/formFinalizeAccount';
import { AppDispatch } from '@/src/store/store';
import {
  authenticationApi,
  LOGIN_FIXED_CACHE_KEY,
  selectAccessToken,
} from '@/src/use-cases/authentication';
import {
  currentUserActions,
  currentUserApi,
  FETCH_USER_FIXED_CACHE_KEY,
  fetchUserSelectors,
  selectCurrentUser,
} from '@/src/use-cases/current-user';
import { SendFinalizeReferedUserButton } from '../SendFinalizeReferedUserButton';
import { getTokenExpirationDate } from '../getTokenExpirationDate';

export const EXPIRED_LINK_MESSAGE =
  "Votre lien d'activation a expiré. Vous pouvez en recevoir un nouveau par email.";
export const INVALID_LINK_MESSAGE =
  "Ce lien d'activation n'est pas valide. Vérifiez que vous avez bien ouvert le lien reçu par email.";

const DEFAULT_REDIRECT_PATH = '/backoffice/dashboard';

export const FINALIZE_GENERIC_ERROR_MESSAGE =
  'Une erreur est survenue. Veuillez réessayer.';
export const LOGIN_AFTER_FINALIZE_ERROR_MESSAGE =
  'Votre mot de passe a bien été enregistré, mais la connexion a échoué. Réessayez avec ce même mot de passe.';
export const ALREADY_FINALIZED_MESSAGE =
  'Vous avez déjà défini un mot de passe';

const isExpired = (token: string) => {
  const expirationDate = getTokenExpirationDate(token);
  return !!expirationDate && expirationDate.getTime() < Date.now();
};

/**
 * Only internal paths are honored, so the page can never be used to send
 * someone to another site. The value is resolved the way the browser would
 * (e.g. `/\evil.example` becomes `https://evil.example`) and kept only if it
 * stays on the current origin.
 */
export const getRedirectPath = (requestedPath: unknown) => {
  if (typeof requestedPath !== 'string' || !requestedPath.startsWith('/')) {
    return DEFAULT_REDIRECT_PATH;
  }
  try {
    const { origin } = window.location;
    const url = new URL(requestedPath, origin);
    return url.origin === origin
      ? `${url.pathname}${url.search}${url.hash}`
      : DEFAULT_REDIRECT_PATH;
  } catch {
    return DEFAULT_REDIRECT_PATH;
  }
};

/**
 * The single screen on which an account without a password gets its first
 * one. Identity comes either from the activation link (`?token=`) or, without
 * a token, from the session of an account that has no password yet (e.g. after
 * an autologin link, see `usePasswordSetupRedirect`).
 */
export const FinalizeAccount = () => {
  const [tokenString, setToken] = useState<string | null>(null);
  const [isLinkExpired, setIsLinkExpired] = useState(false);
  // Set once the password is saved: a retry after a failed login must only
  // retry the login, the account being already finalized.
  const [finalizedEmail, setFinalizedEmail] = useState<string | null>(null);
  const {
    query: { token, requestedPath },
    isReady,
    push,
  } = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const currentUser = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const isFetchUserSucceeded = useSelector(
    fetchUserSelectors.selectIsFetchUserSucceeded
  );
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isSessionWithoutPassword = currentUser?.hasPassword === false;
  // Without a token, a stored session may still turn out to be an account
  // without a password: wait for it rather than flashing the invalid link.
  const isWaitingForSession =
    !!accessToken &&
    !currentUser &&
    !isFetchUserSucceeded &&
    !isFetchUserFailed;

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
    if (isWaitingForSession) {
      return <Spinner />;
    }
    if (!isSessionWithoutPassword) {
      return <Text>{INVALID_LINK_MESSAGE}</Text>;
    }
  }

  if (tokenString && isLinkExpired) {
    return (
      <>
        <Text>{EXPIRED_LINK_MESSAGE}</Text>
        <SendFinalizeReferedUserButton token={tokenString} />
      </>
    );
  }

  return (
    <>
      <FormWithValidation
        submitText="Se connecter"
        formSchema={formFinalizeAccount}
        onSubmit={async ({ setPassword }, setError) => {
          let email = finalizedEmail;
          if (!email) {
            const params: PostAuthFinalizeAccountParams = {
              ...(tokenString ? { token: tokenString } : {}),
              password: setPassword,
            };
            try {
              const response = await Api.postAuthFinalizeAccount(params);
              email = response.data;
              setFinalizedEmail(email);
            } catch (err) {
              if (isTokenExpiredError(err)) {
                // Expired between page load and submit, or client clock ahead.
                setIsLinkExpired(true);
              } else if (isInvalidTokenError(err)) {
                setError(INVALID_LINK_MESSAGE);
              } else if (isEmailAlreadyVerifiedError(err)) {
                setError(ALREADY_FINALIZED_MESSAGE);
              } else {
                // Network error, 5xx...: never leave the submission silent.
                setError(FINALIZE_GENERIC_ERROR_MESSAGE);
              }
              return;
            }
          }

          // Wait for the new session and the refreshed identity before
          // leaving: the next page must not mount with the restricted session,
          // nor be sent back here by `usePasswordSetupRedirect`.
          try {
            await dispatch(
              authenticationApi.endpoints.login.initiate(
                { email, password: setPassword },
                { fixedCacheKey: LOGIN_FIXED_CACHE_KEY }
              )
            ).unwrap();
            const identity = await dispatch(
              currentUserApi.endpoints.fetchUser.initiate(undefined, {
                fixedCacheKey: FETCH_USER_FIXED_CACHE_KEY,
              })
            ).unwrap();
            dispatch(currentUserActions.fetchUserSucceeded(identity));
          } catch {
            setError(LOGIN_AFTER_FINALIZE_ERROR_MESSAGE);
            return;
          }
          setError('');
          await push(getRedirectPath(requestedPath));
        }}
      />
    </>
  );
};
