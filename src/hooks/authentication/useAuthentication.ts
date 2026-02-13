import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSelectors } from 'src/use-cases/authentication';

import {
  currentUserActions,
  fetchUserSelectors,
  selectCurrentUser,
} from 'src/use-cases/current-user';

import { getDefaultUrl } from 'src/utils/Redirects';
import { useRoutePermissions } from './useRoutePermissions';

export function useAuthentication() {
  const { replace, asPath, push } = useRouter();
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
  const isAuthenticationPending = !isFetchUserSucceeded && !isFetchUserFailed;
  const { isUserAuthorized } = useRoutePermissions();
  const isUserAuthenticated = !!currentUser;
  const currentUserRole = currentUser?.role;

  // Trigger fetching user data if idle
  useEffect(() => {
    if (isFetchUserIdle) {
      dispatch(currentUserActions.fetchUserRequested());
    }
  }, [
    dispatch,
    isFetchUserIdle,
    isFetchUserSucceeded,
    isFetchUserFailed,
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
      }
    }
  }, [
    asPath,
    currentUserRole,
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
