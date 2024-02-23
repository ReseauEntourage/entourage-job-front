import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { authenticatedPermissions } from './permissions';

export function useRoutePermissions() {
  const { pathname } = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const isUserAuthenticated = !!currentUser;
  const currentUserRole = currentUser?.role;

  const isUserAuthorized = useMemo(() => {
    const routesRules = authenticatedPermissions.filter((route) => {
      return route.paths.some((path) => pathname.startsWith(path));
    });

    if (routesRules.length === 0) {
      return true;
    }

    if (!isUserAuthenticated) {
      return false;
    }

    const areAnyRolesAllowed = routesRules.some(
      (routeRules) => routeRules.roles === '*'
    );

    if (areAnyRolesAllowed) {
      return true;
    }

    return routesRules.some((routeRules) => {
      if (!Array.isArray(routeRules.roles)) {
        throw new Error('Roles must be an array');
      }

      return routeRules.roles.some((role) => {
        return role === currentUserRole;
      });
    });
  }, [isUserAuthenticated, pathname, currentUserRole]);

  return {
    isUserAuthorized,
  };
}
