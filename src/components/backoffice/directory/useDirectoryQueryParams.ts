import { useRouter } from 'next/router';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { ProfilesFilters } from 'src/api/types';
import { Department } from 'src/constants/departements';
import { useDirectoryRole } from './useDirectoryRole';

// Get the current query params for the directory filters
export function useDirectoryQueryParams() {
  const role = useDirectoryRole();
  const {
    query: { search, nudgeIds, businessSectorIds, departments, contactTypes },
  } = useRouter();

  const filters: ProfilesFilters = {
    role,
    nudgeIds: (nudgeIds || []) as string[],
    businessSectorIds: (businessSectorIds || []) as string[],
    departments: (departments || []) as Department | Department[],
    contactTypes: (contactTypes || []) as ContactTypeEnum[],
  };

  if (search) {
    return {
      ...filters,
      search: search as string,
    };
  }

  return filters;
}
