import { useRouter } from 'next/router';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpNames } from 'src/constants/helps';

export function useDirectoryFiltersQueryParams() {
  const {
    query: { search, helps, businessLines, departments },
  } = useRouter();

  const filters: {
    search?: string;
    helps: HelpNames | HelpNames[];
    departments: Department | Department[];
    businessLines: BusinessLineValue | BusinessLineValue[];
  } = {
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
