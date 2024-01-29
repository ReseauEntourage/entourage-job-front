import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { DirectoryList } from '../DirectoryList';
import { SearchBar } from 'src/components/filters/SearchBar';
import { Button } from 'src/components/utils';
import { DIRECTORY_FILTERS_DATA } from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  USER_ROLES,
} from 'src/constants/users';
import { useFilters } from 'src/hooks';
import {
  selectProfilesFilters,
  selectProfilesSearchFilter,
} from 'src/use-cases/profiles';
import { isRoleIncluded } from 'src/utils';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryContainer,
} from './DirectoryContainer.styles';
import { useRoleFilter } from './useRoleFilter';

const route = '/backoffice/annuaire';

export function DirectoryContainer() {
  const { push } = useRouter();
  const roleFilter = useRoleFilter();

  const { setFilters, setSearch, resetFilters } = useFilters(
    DIRECTORY_FILTERS_DATA,
    `/backoffice/annuaire`,
    ['role'],
    GA_TAGS.PAGE_ANNUAIRE_SUPPRIMER_FILTRES_CLIC
  );

  const filters = useSelector(selectProfilesFilters);
  const search = useSelector(selectProfilesSearchFilter);

  return (
    <StyledDirectoryContainer>
      <SearchBar
        filtersConstants={DIRECTORY_FILTERS_DATA}
        filters={filters}
        resetFilters={resetFilters}
        search={search}
        setSearch={setSearch}
        setFilters={setFilters}
        placeholder="Rechercher..."
      />
      <StyledDirectoryButtonContainer>
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
