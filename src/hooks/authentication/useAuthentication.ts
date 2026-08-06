import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReduxRequestEvents } from '@/src/constants';
import {
  authenticationActions,
  autologinSelectors,
  logoutSelectors,
} from '@/src/use-cases/authentication';

import {
  currentUserActions,
  fetchUserSelectors,
  selectCurrentUser,
} from '@/src/use-cases/current-user';

import { getDefaultUrl } from '@/src/utils/Redirects';
import { useRoutePermissions } from './useRoutePermissions';

export function useAuthentication() {
  const { replace, asPath, push, query, isReady, pathname } = useRouter();
  const dispatch = useDispatch();

  const isFetchUserSucceeded = useSelector(
    fetchUserSelectors.selectIsFetchUserSucceeded
  );
  const isLogoutSucceeded = useSelector(
    logoutSelectors.selectIsLogoutSucceeded
  );
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isFetchUserIdle = useSelector(fetchUserSelectors.selectIsFetchUserIdle);
  const currentUser = useSelector(selectCurrentUser);
  const { isUserAuthorized } = useRoutePermissions();
  const isUserAuthenticated = !!currentUser;
  const currentUserRole = currentUser?.role;

  // Interception du lien de notification de nouveau message : échange le
  // token d'autologin présent en query param contre une session, avant que
  // les effets ci-dessous ne déclenchent le fetch utilisateur classique ou
  // la redirection vers /login.
  const autologinToken =
    typeof query.autologinToken === 'string' ? query.autologinToken : null;
  const autologinStatus = useSelector(autologinSelectors.selectAutologinStatus);
  const isAutologinPending =
    isReady &&
    !!autologinToken &&
    autologinStatus !== ReduxRequestEvents.SUCCEEDED &&
    autologinStatus !== ReduxRequestEvents.FAILED;

  useEffect(() => {
    if (
      isReady &&
      autologinToken &&
      autologinStatus === ReduxRequestEvents.IDLE
    ) {
      dispatch(
        authenticationActions.autologinRequested({ token: autologinToken })
      );
    }
  }, [dispatch, isReady, autologinToken, autologinStatus]);

  // Une fois l'échange terminé (succès ou échec), retire le paramètre de
  // l'URL sans changer de destination, pour éviter qu'un rafraîchissement ne
  // retente un échange déjà consommé.
  useEffect(() => {
    if (
      autologinToken &&
      (autologinStatus === ReduxRequestEvents.SUCCEEDED ||
        autologinStatus === ReduxRequestEvents.FAILED)
    ) {
      const { autologinToken: _removed, ...restQuery } = query;
      replace({ pathname, query: restQuery }, undefined, { shallow: true });
    }
  }, [autologinToken, autologinStatus, pathname, query, replace]);

  const isAuthenticationPending =
    isAutologinPending || (!isFetchUserSucceeded && !isFetchUserFailed);

  // Trigger fetching user data if idle
  useEffect(() => {
    if (isFetchUserIdle && !isAutologinPending) {
      dispatch(currentUserActions.fetchUserRequested());
    }
  }, [
    dispatch,
    isFetchUserIdle,
    isFetchUserSucceeded,
    isFetchUserFailed,
    isAutologinPending,
    currentUser,
  ]);

  // Garde en mémoire la dernière redirection pour éviter les redirections en boucle
  const [lastRedirectionPath, setLastRedirectionPath] = useState<string | null>(
    null
  );

  // Gestion des redirections en fonction de l'état d'authentification/permissions uniquement
  useEffect(() => {
    const shouldRedirectToLogin =
      !isAuthenticationPending &&
      !isUserAuthorized &&
      lastRedirectionPath !== asPath;

    if (shouldRedirectToLogin) {
      if (isUserAuthenticated && currentUserRole) {
        const defaultUrl = getDefaultUrl(currentUserRole);
        setLastRedirectionPath(defaultUrl);
        replace(defaultUrl);
      } else {
        setLastRedirectionPath('/login');
        const requestedPathWithRealValues = asPath;
        if (asPath.startsWith('/login') && asPath.includes('requestedPath=')) {
          return;
        }
        push(
          asPath && !isLogoutSucceeded
            ? {
                pathname: '/login',
                query: {
                  requestedPath: requestedPathWithRealValues,
                },
              }
            : '/login'
        );
        if (isLogoutSucceeded) {
          dispatch(authenticationActions.logoutReset());
        }
      }
    }
  }, [
    asPath,
    currentUserRole,
    dispatch,
    isAuthenticationPending,
    isLogoutSucceeded,
    isUserAuthenticated,
    isUserAuthorized,
    lastRedirectionPath,
    push,
    replace,
  ]);

  return {
    isAuthRouteReady: isUserAuthorized,
    currentUser,
  };
}
