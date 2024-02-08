import { useRole } from 'src/hooks/queryParams/useRole';

// Failsafe to maake sure that the role query param is set
export function useDirectoryRole() {
  const roleFilter = useRole();
  if (!roleFilter) {
    throw new Error('No default role');
  }

  return roleFilter;
}
