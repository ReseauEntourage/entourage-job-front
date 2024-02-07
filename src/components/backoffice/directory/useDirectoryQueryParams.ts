import { useRouter } from 'next/router';
import { ProfilesFilters } from 'src/api/types';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpNames } from 'src/constants/helps';
import { useDirectoryRole } from './useDirectoryRole';

// Get the current query params for the directory filters
export function useDirectoryQueryParams() {
  const role = useDirectoryRole();

  const {
    query: { search, helps, businessLines, departments },
  } = useRouter();

  const filters: ProfilesFilters = {
    role,
    helps: (helps || []) as HelpNames | HelpNames[],
    businessLines: (businessLines || []) as
      | BusinessLineValue
      | BusinessLineValue[],
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
