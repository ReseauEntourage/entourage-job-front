import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { allContactTypes } from '@/src/constants/contactTypes';
import { ProfileNudges } from '@/src/constants/nudges';
import { DirectoryList } from '../DirectoryList';
import { useDirectoryQueryParams } from '../useDirectoryQueryParams';
import { Api } from 'src/api';
import { BusinessSector, Nudge } from 'src/api/types';
import {
  MobileFilterButton,
  MobileFilterDrawer,
} from 'src/components/filters/MobileFilters';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Button, Section } from 'src/components/utils';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { Filter, FilterConstant } from 'src/constants/utils';
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
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [businessSectorsFilters, setBusinessSectorsFilters] = useState<
    FilterConstant<string>[]
  >([]);
  const [nudgesFilters, setNudgesFilters] = useState<FilterConstant<string>[]>([
    ...ProfileNudges,
  ]);
  const directoryFiltersParams = useDirectoryQueryParams();
  const {
    role,
    departments,
    nudgeIds,
    businessSectorIds,
    search,
    contactTypes,
  } = directoryFiltersParams;

  const DirectoryFilters: Filter[] = [
    {
      key: 'departments',
      constants: DEPARTMENTS_FILTERS,
      title: 'Département',
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_DEPARTEMENT_CLIC,
    },
    {
      key: 'nudgeIds',
      constants: nudgesFilters,
      title: "Type d'aide",
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    },
    {
      key: 'businessSectorIds',
      constants: businessSectorsFilters,
      title: "Secteur d'activité",
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    },
    {
      key: 'contactTypes',
      constants: allContactTypes,
      title: 'Type de contact',
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    },
  ];

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
      nudgeIds: mutateToArray(nudgeIds).map((nudgeId) =>
        findConstantFromValue(nudgeId, nudgesFilters)
      ),
      businessSectorIds: mutateToArray(businessSectorIds).map(
        (businessSectorId) =>
          findConstantFromValue(businessSectorId, businessSectorsFilters)
      ),
      contactTypes: mutateToArray(contactTypes).map((contactType) =>
        findConstantFromValue(contactType, allContactTypes)
      ),
    };
  }, [
    departments,
    nudgeIds,
    businessSectorIds,
    contactTypes,
    businessSectorsFilters,
    nudgesFilters,
  ]);

  const totalFiltersCount = useMemo(() => {
    return Object.values(filters).reduce(
      (acc, curr) => acc + (curr ? curr.length : 0),
      0
    );
  }, [filters]);

  const handleOpenFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  /**
   * Methods
   */
  const fetchBusinessSectors = async () => {
    try {
      const { data } = await Api.getAllBusinessSectors({
        limit: 50,
        offset: 0,
      });
      setBusinessSectorsFilters(
        data.map((businessSector: BusinessSector) => ({
          label: businessSector.name,
          value: businessSector.id,
        }))
      );
    } catch (error) {
      console.error('Error fetching business sectors:', error);
    }
  };

  const fetchNudges = async () => {
    try {
      const { data } = await Api.getAllNudges({
        limit: 50,
        offset: 0,
      });
      setNudgesFilters(
        data.map((nudge: Nudge) => ({
          label:
            ProfileNudges.find(
              (profileNudge) => profileNudge.value === nudge.value
            )?.label || '',
          value: nudge.id,
        }))
      );
    } catch (error) {
      console.error('Error fetching nudges:', error);
    }
  };

  /**
   * Hooks
   */

  useEffect(() => {
    fetchBusinessSectors();
    fetchNudges();
  }, []);

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledHeaderDirectory>
            <HeaderBackoffice
              title="Bienvenue sur votre réseau"
              description="Découvrez les membres de la communauté et développez votre carnet d'adresse."
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
              placeholder="Rechercher par prénom, nom ou métier"
              additionalButtons={
                <StyledDirectoryButtonContainer isMobile={isMobile}>
                  {isMobile && (
                    <MobileFilterButton
                      onClick={handleOpenFilterDrawer}
                      count={totalFiltersCount}
                    />
                  )}
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    variant={
                      isRoleIncluded([UserRoles.CANDIDATE], role)
                        ? 'primary'
                        : 'secondary'
                    }
                    rounded
                    onClick={() => {
                      push({
                        pathname: route,
                        query: {
                          ...directoryFiltersParams,
                          role: [UserRoles.CANDIDATE],
                        },
                      });
                    }}
                  >
                    Les candidats
                  </Button>
                  <Button
                    size={isMobile ? 'small' : 'large'}
                    variant={
                      isRoleIncluded([UserRoles.COACH], role)
                        ? 'primary'
                        : 'secondary'
                    }
                    onClick={() => {
                      push({
                        pathname: route,
                        query: {
                          ...directoryFiltersParams,
                          role: UserRoles.COACH,
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

      {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={handleCloseFilterDrawer}
          onApplyFilters={() => undefined}
          filters={filters}
          setFilters={setFilters}
          filterData={DirectoryFilters}
        />
      )}
    </>
  );
}
