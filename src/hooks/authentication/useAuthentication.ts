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

  const isCurrentRouteReady = isUserAuthorized;

  const isUserAuthenticated = !!currentUser;

  const currentUserRole = currentUser?.role;

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

  useEffect(() => {
    // Éviter les redirections en boucle en vérifiant si nous avons déjà redirigé vers ce chemin
    const shouldRedirect =
      !isAuthenticationPending &&
      !isUserAuthorized &&
      lastRedirectionPath !== asPath;

    if (shouldRedirect) {
      if (isUserAuthenticated && currentUserRole) {
        const defaultUrl = getDefaultUrl(currentUserRole);
        setLastRedirectionPath(defaultUrl);
        replace(defaultUrl);
      } else {
        setLastRedirectionPath('/login');

        // Extraire la valeur réelle de alertId si présente dans l'URL
        const requestedPathWithRealValues = asPath;

        // Si nous sommes sur la page de login, vérifier si le requestedPath contient des paramètres de route dynamiques
        if (asPath.startsWith('/login') && asPath.includes('requestedPath=')) {
          // On est déjà sur la page de login, ne pas rediriger à nouveau
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
    isCurrentRouteReady,
  };
}
