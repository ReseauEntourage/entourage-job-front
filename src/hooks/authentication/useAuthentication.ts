import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectCurrentUser,
  fetchUserSelectors,
  authenticationActions,
} from 'src/use-cases/authentication';
import { getDefaultUrl } from 'src/utils/Redirects';
import { useRoutePermissions } from './useRoutePermissions';

export function useAuthentication() {
  const { replace, asPath, push} = useRouter();
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

  const isCurrentRouteReady = !isAuthenticationPending && isUserAuthorized;

  const currentUserRole = currentUser?.role;

  useEffect(() => {
    if (isFetchUserIdle) {
      dispatch(authenticationActions.fetchUserRequested());
    }
  }, [dispatch, isFetchUserIdle]);

  useEffect(() => {
    if (!isAuthenticationPending && !isUserAuthorized) {
      if (asPath && !currentUserRole) {
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
      } else if (currentUserRole) {
        replace(getDefaultUrl(currentUserRole));
      }
    }
  }, [currentUserRole, isAuthenticationPending, isUserAuthorized, replace]);

  return {
    isCurrentRouteReady,
  };
}
