import { useRouter } from 'next/router';
import { BusinessLineValue } from 'src/constants';
import { Department } from 'src/constants/departements';
import { HelpNames } from 'src/constants/helps';

export function useDirectoryFiltersParams() {
  const {
    query: { search, helps, businessLines, departments },
  } = useRouter();

  return {
    search: search as string,
    helps: helps as HelpNames | HelpNames[],
    businessLines: businessLines as BusinessLineValue | BusinessLineValue[],
    departments: departments as Department | Department[],
  };
}
