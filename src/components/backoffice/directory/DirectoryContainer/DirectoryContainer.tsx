import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DirectoryList } from '../DirectoryList';
import { SearchBar } from 'src/components/filters/SearchBar';
import { Button } from 'src/components/utils';
import { BUSINESS_LINES, DirectoryFilters } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { ProfileHelps } from 'src/constants/helps';
import { GA_TAGS } from 'src/constants/tags';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { useFilters } from 'src/hooks';
import { useIsMobile } from 'src/hooks/utils';
import {
  selectProfilesBusinessLinesFilters,
  selectProfilesDepartmentsFilters,
  selectProfilesHelpsFilters,
  selectProfilesSearchFilter,
} from 'src/use-cases/profiles';
import { findConstantFromValue, isRoleIncluded } from 'src/utils';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryContainer,
} from './DirectoryContainer.styles';
import { useRoleFilter } from './useRoleFilter';

const route = '/backoffice/annuaire';

export function DirectoryContainer() {
  const { push } = useRouter();
  const roleFilter = useRoleFilter();

  const isMobile = useIsMobile();

  const { setFilters, setSearch, resetFilters } = useFilters(
    DirectoryFilters,
    `/backoffice/annuaire`,
    [],
    GA_TAGS.PAGE_ANNUAIRE_SUPPRIMER_FILTRES_CLIC
  );

  const departmentsFilters = useSelector(selectProfilesDepartmentsFilters);
  const helpsFilters = useSelector(selectProfilesHelpsFilters);
  const businessLinesFilters = useSelector(selectProfilesBusinessLinesFilters);
  const search = useSelector(selectProfilesSearchFilter);

  const filters = useMemo(() => {
    return {
      departments:
        departmentsFilters?.map((department) =>
          findConstantFromValue(department, DEPARTMENTS_FILTERS)
        ) || [],
      helps:
        helpsFilters?.map((help) =>
          findConstantFromValue(help, ProfileHelps)
        ) || [],
      businessLines:
        businessLinesFilters?.map((businessLine) =>
          findConstantFromValue(businessLine, BUSINESS_LINES)
        ) || [],
    };
  }, [departmentsFilters, helpsFilters, businessLinesFilters]);

  return (
    <StyledDirectoryContainer>
      <SearchBar
        filtersConstants={DirectoryFilters}
        filters={filters}
        resetFilters={resetFilters}
        search={search}
        setSearch={setSearch}
        setFilters={setFilters}
        placeholder="Rechercher..."
      />
      <StyledDirectoryButtonContainer isMobile={isMobile}>
        <Button
          style={`custom-secondary${
            isRoleIncluded(CANDIDATE_USER_ROLES, roleFilter) ? '-inverted' : ''
          }`}
          onClick={() => {
            push({
              pathname: route,
              query: { role: CANDIDATE_USER_ROLES },
            });
          }}
        >
          Les candidats
        </Button>
        <Button
          style={`custom-secondary${
            isRoleIncluded(COACH_USER_ROLES, roleFilter) ? '-inverted' : ''
          }`}
          onClick={() => {
            push({
              pathname: route,
              query: { role: USER_ROLES.COACH },
            });
          }}
        >
          Les coachs
        </Button>
      </StyledDirectoryButtonContainer>
      <DirectoryList />
    </StyledDirectoryContainer>
  );
}
