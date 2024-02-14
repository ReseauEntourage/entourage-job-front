import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authenticationActions,
  fetchUserSelectors,
  logoutSelectors,
  selectCurrentUser,
} from 'src/use-cases/authentication';
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
      dispatch(authenticationActions.fetchUserRequested());
    }
  }, [dispatch, isFetchUserIdle]);

  useEffect(() => {
    if (!isAuthenticationPending && !isUserAuthorized) {
      if (isUserAuthenticated && currentUserRole) {
        replace(getDefaultUrl(currentUserRole));
      } else {
        push(
          asPath && !isLogoutSucceeded
            ? {
                pathname: '/login',
                query: {
                  requestedPath: asPath,
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
    push,
    replace,
  ]);

  return {
    isCurrentRouteReady,
  };
}
