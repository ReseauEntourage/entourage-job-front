import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  authenticationActions,
  fetchUserSelectors,
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
  const isFetchUserFailed = useSelector(
    fetchUserSelectors.selectIsFetchUserFailed
  );
  const isFetchUserIdle = useSelector(fetchUserSelectors.selectIsFetchUserIdle);
  const isAuthenticationPending = !isFetchUserSucceeded && !isFetchUserFailed;
  const currentUser = useSelector(selectCurrentUser);

  const { isUserAuthorized } = useRoutePermissions();

  const isCurrentRouteReady = isUserAuthorized;

  const currentUserRole = currentUser?.role;

  useEffect(() => {
    if (isFetchUserIdle) {
      dispatch(authenticationActions.fetchUserRequested());
    }
  }, [dispatch, isFetchUserIdle]);

  useEffect(() => {
    if (!isAuthenticationPending && !isUserAuthorized) {
      if (currentUserRole) {
        replace(getDefaultUrl(currentUserRole));
      } else {
        push(
          asPath
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
    currentUserRole,
    isAuthenticationPending,
    isUserAuthorized,
    replace,
    asPath,
    push,
  ]);

  return {
    isCurrentRouteReady,
  };
}
