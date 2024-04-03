import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { DirectoryList } from '../DirectoryList';
import { useDirectoryQueryParams } from '../useDirectoryQueryParams';
import { SearchBar } from 'src/components/filters/SearchBar';
import { Button, Section } from 'src/components/utils';
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
  findConstantFromValue,
  isRoleIncluded,
  mutateToArray,
} from 'src/utils';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryContainer,
} from './DirectoryContainer.styles';

const route = '/backoffice/annuaire';

export function DirectoryContainer() {
  const { push } = useRouter();
  const isMobile = useIsMobile();

  const directoryFiltersParams = useDirectoryQueryParams();
  const { role, departments, helps, businessLines, search } =
    directoryFiltersParams;

  const { setFilters, setSearch, resetFilters } = useFilters(
    DirectoryFilters,
    `/backoffice/annuaire`,
    [],
    GA_TAGS.PAGE_ANNUAIRE_SUPPRIMER_FILTRES_CLIC
  );

  const filters = useMemo(() => {
    return {
      departments: mutateToArray(departments).map((department) =>
        findConstantFromValue(department, DEPARTMENTS_FILTERS)
      ),
      helps: mutateToArray(helps).map((help) =>
        findConstantFromValue(help, ProfileHelps)
      ),
      businessLines: mutateToArray(businessLines).map((businessLine) =>
        findConstantFromValue(businessLine, BUSINESS_LINES)
      ),
    };
  }, [departments, helps, businessLines]);

  return (
    <StyledDirectoryContainer>
      <Section className="custom-primary">
        <SearchBar
          filtersConstants={DirectoryFilters}
          filters={filters}
          resetFilters={() => {
            resetFilters();
          }}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Rechercher..."
          additionalButtons={
            <StyledDirectoryButtonContainer isMobile={isMobile}>
              <Button
                size={isMobile ? 'small' : 'large'}
                style={`custom-secondary${
                  isRoleIncluded(CANDIDATE_USER_ROLES, role) ? '-inverted' : ''
                }`}
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...directoryFiltersParams,
                      role: CANDIDATE_USER_ROLES,
                    },
                  });
                }}
              >
                Les candidats
              </Button>
              <Button
                size={isMobile ? 'small' : 'large'}
                style={`custom-secondary${
                  isRoleIncluded(COACH_USER_ROLES, role) ? '-inverted' : ''
                }`}
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...directoryFiltersParams,
                      role: USER_ROLES.COACH,
                    },
                  });
                }}
              >
                Les coachs
              </Button>
            </StyledDirectoryButtonContainer>
          }
        />
      </Section>
      <DirectoryList />
    </StyledDirectoryContainer>
  );
}
