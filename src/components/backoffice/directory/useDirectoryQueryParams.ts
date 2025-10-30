import { useRouter } from 'next/router';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { DirectoryEntity } from '@/src/constants/entity';
import { UserRoles } from '@/src/constants/users';
import { useDirectoryEntity } from './useDirectoryEntity';
import { useDirectoryRole } from './useDirectoryRole';

export type DirectoryFilters = {
  role: UserRoles[];
  search?: string;
  nudgeIds: string[];
  departments: string[];
  businessSectorIds: string[];
  contactTypes: ContactTypeEnum | ContactTypeEnum[];
  entity: DirectoryEntity;
};

// Get the current query params for the directory filters
export function useDirectoryQueryParams() {
  const role = useDirectoryRole();
  const entity = useDirectoryEntity();
  const {
    query: { search, nudgeIds, businessSectorIds, departments, contactTypes },
  } = useRouter();

  const normalizeBusinessSectorIds = (): string[] => {
    if (!businessSectorIds) return [];
    if (Array.isArray(businessSectorIds)) return businessSectorIds as string[];
    return [businessSectorIds as string];
  };

  const normalizeDepartments = (): string[] => {
    if (!departments) return [];
    if (Array.isArray(departments)) return departments as string[];
    return [departments as string];
  };

  const filters: DirectoryFilters = {
    role,
    nudgeIds: (nudgeIds || []) as string[],
    businessSectorIds: normalizeBusinessSectorIds(),
    departments: normalizeDepartments(),
    contactTypes: (contactTypes || []) as ContactTypeEnum[],
    entity,
  };

  if (search) {
    return {
      ...filters,
      search: search as string,
    };
  }

  return filters;
}
