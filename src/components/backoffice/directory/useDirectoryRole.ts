import { useRole } from 'src/hooks/queryParams/useRole';
import { assertIsDefined } from 'src/utils/asserts';

// Failsafe to make sure that the role query param is set
export function useDirectoryRole() {
  const roleFilter = useRole();

  assertIsDefined(roleFilter, 'No default role');

  return roleFilter;
}
