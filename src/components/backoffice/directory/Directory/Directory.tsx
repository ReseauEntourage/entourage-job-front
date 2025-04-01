import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { DirectoryList } from '../DirectoryList';
import { useDirectoryQueryParams } from '../useDirectoryQueryParams';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Button, Section } from 'src/components/utils';
import { BUSINESS_LINES, DirectoryFilters } from 'src/constants';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { ProfileHelps } from 'src/constants/helps';
import { GA_TAGS } from 'src/constants/tags';
import { USER_ROLES } from 'src/constants/users';
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
  StyledHeaderDirectory,
} from './Directory.styles';

const route = '/backoffice/annuaire';

export function Directory() {
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
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledHeaderDirectory>
            <HeaderBackoffice
              title="Bienvenue sur votre réseau"
              description={
                "Découvrez les membres de la communauté et développez votre carnet d'adresse."
              }
              noSeparator
            />
            <SearchBar
              light
              filtersConstants={DirectoryFilters}
              filters={filters}
              resetFilters={() => {
                resetFilters();
              }}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher par nom, prénom..."
              additionalButtons={
                <StyledDirectoryButtonContainer isMobile={isMobile}>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    style={`custom-secondary${
                      isRoleIncluded([USER_ROLES.CANDIDATE], role)
                        ? '-inverted'
                        : ''
                    }`}
                    onClick={() => {
                      push({
                        pathname: route,
                        query: {
                          ...directoryFiltersParams,
                          role: [USER_ROLES.CANDIDATE],
                        },
                      });
                    }}
                  >
                    Les candidats
                  </Button>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    style={`custom-secondary${
                      isRoleIncluded([USER_ROLES.COACH], role)
                        ? '-inverted'
                        : ''
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
          </StyledHeaderDirectory>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StyledDirectoryContainer>
          <DirectoryList />
        </StyledDirectoryContainer>
      </Section>
    </>
  );
}
