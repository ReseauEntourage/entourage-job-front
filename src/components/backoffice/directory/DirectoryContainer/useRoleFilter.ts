import { useSelector } from 'react-redux';
import { selectProfilesRoleFilter } from 'src/use-cases/profiles';

export function useRoleFilter() {
  const roleFilter = useSelector(selectProfilesRoleFilter);
  if (!roleFilter) {
    throw new Error('No default role');
  }

  return roleFilter;
}
