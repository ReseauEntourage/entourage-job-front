import { UserRoles } from 'src/constants/users';
import { useRole } from 'src/hooks/queryParams/useRole';

/**
 * Returns the active role(s) for the network directory
 * from the `role` URL query param.
 *
 * Acts as a safety fallback: if no role is present in the URL
 * (e.g. direct access before the redirection hook has run),
 * returns `[UserRoles.COACH]` as the default value.
 *
 * @returns The role filter from the URL, or `[UserRoles.COACH]` by default.
 */
export function useNetworkDirectoryRole() {
  const roleFilter = useRole();

  return roleFilter || [UserRoles.COACH];
}
