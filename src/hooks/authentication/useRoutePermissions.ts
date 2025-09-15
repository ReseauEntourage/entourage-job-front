import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from 'src/use-cases/current-user';
import { assertCondition } from 'src/utils/asserts';
import { authenticatedPermissions } from './permissions';

export function useRoutePermissions() {
  const { pathname } = useRouter();

  const currentUser = useSelector(selectCurrentUser);
  const isUserAuthenticated = !!currentUser;
  const currentUserRole = currentUser?.role;

  const isUserAuthorized = useMemo(() => {
    // Recherche des règles applicables à la route actuelle
    const routesRules = authenticatedPermissions.filter((route) => {
      return route.paths.some((path) => pathname.startsWith(path));
    });

    // Si aucune règle trouvée, la route est publique (autorisée)
    if (routesRules.length === 0) {
      return true;
    }

    // Si l'utilisateur n'est pas connecté et qu'il existe des règles, accès refusé
    if (!isUserAuthenticated) {
      return false;
    }

    // Vérifier si la route autorise tous les rôles authentifiés
    const areAnyRolesAllowed = routesRules.some(
      (routeRules) => routeRules.roles === '*'
    );

    if (areAnyRolesAllowed) {
      return true;
    }

    // Vérifier si le rôle de l'utilisateur correspond à un des rôles autorisés
    const isRoleAuthorized = routesRules.some((routeRules) => {
      assertCondition(
        Array.isArray(routeRules.roles),
        'Roles must be an array'
      );

      return routeRules.roles.some((role) => {
        return role === currentUserRole;
      });
    });
    return isRoleAuthorized;
  }, [isUserAuthenticated, pathname, currentUserRole]);

  return {
    isUserAuthorized,
  };
}
