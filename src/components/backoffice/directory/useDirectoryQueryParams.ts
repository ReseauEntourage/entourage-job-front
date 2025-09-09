import { useRouter } from 'next/router';
import { ContactTypeEnum } from '@/src/constants/contactTypes';
import { DirectoryEntity } from '@/src/constants/entity';
import { HelpValue } from '@/src/constants/nudges';
import { UserRoles } from '@/src/constants/users';
import { DepartmentName } from 'src/constants/departements';
import { useDirectoryEntity } from './useDirectoryEntity';
import { useDirectoryRole } from './useDirectoryRole';

export type DirectoryFilters = {
  role: UserRoles[];
  search?: string;
  helps: HelpValue | HelpValue[];
  departments: DepartmentName[];
  businessSectorIds: string[];
  contactTypes: ContactTypeEnum | ContactTypeEnum[];
  entity: DirectoryEntity;
};

// Get the current query params for the directory filters
export function useDirectoryQueryParams() {
  const role = useDirectoryRole();
  const entity = useDirectoryEntity();
  const {
    query: { search, helps, businessSectorIds, departments, contactTypes },
  } = useRouter();

  const normalizeBusinessSectorIds = (): string[] => {
    if (!businessSectorIds) return [];
    if (Array.isArray(businessSectorIds)) return businessSectorIds as string[];
    return [businessSectorIds as string];
  };

  const normalizeDepartments = (): DepartmentName[] => {
    if (!departments) return [];
    if (Array.isArray(departments)) return departments as DepartmentName[];
    return [departments as DepartmentName];
  };

  const filters: DirectoryFilters = {
    role,
    helps: (helps || []) as HelpValue | HelpValue[],
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
