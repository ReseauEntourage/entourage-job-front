import { useRouter } from 'next/router';
import { ProfilesFilters } from 'src/api/types';
import { Department } from 'src/constants/departements';
import { HelpValue } from 'src/constants/helps';
import { useDirectoryRole } from './useDirectoryRole';

// Get the current query params for the directory filters
export function useDirectoryQueryParams() {
  const role = useDirectoryRole();
  const {
    query: { search, helps, businessSectorIds, departments },
  } = useRouter();

  const filters: ProfilesFilters = {
    role,
    helps: (helps || []) as HelpValue | HelpValue[],
    businessSectorIds: (businessSectorIds || []) as string[],
    departments: (departments || []) as Department | Department[],
  };

  if (search) {
    return {
      ...filters,
      search: search as string,
    };
  }

  return filters;
}
