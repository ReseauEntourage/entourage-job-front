import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Section } from '@/src/components/ui';
import { allContactTypes } from '@/src/constants/contactTypes';
import { DirectoryEntity } from '@/src/constants/entity';
import { ProfileNudges } from '@/src/constants/nudges';
import { DirectoryList } from '../DirectoryList';
import { useDirectoryQueryParams } from '../useDirectoryQueryParams';
import { Api } from 'src/api';
import { BusinessSector, Nudge } from 'src/api/types';
import { DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { UserRoles } from 'src/constants/users';
import { Filter, FilterConstant } from 'src/constants/utils';
import {
  MobileFilterButton,
  MobileFilterDrawer,
} from 'src/features/filters/MobileFilters';
import { SearchBar } from 'src/features/filters/SearchBar/SearchBar';
import { HeaderBackoffice } from 'src/features/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/features/headers/HeaderBackoffice/HeaderBackoffice.styles';
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
  const [departmentsIdsFilters, setDepartmentsIdsFilters] = useState<
    FilterConstant<string>[]
  >([]);
  const [businessSectorsFilters, setBusinessSectorsFilters] = useState<
    FilterConstant<string>[]
  >([]);
  const [nudgesFilters, setNudgesFilters] = useState<FilterConstant<string>[]>([
    ...ProfileNudges,
  ]);
  const directoryFiltersParams = useDirectoryQueryParams();
  const {
    entity,
    role,
    departments,
    nudgeIds,
    businessSectorIds,
    search,
    contactTypes,
  } = directoryFiltersParams;

  const DirectoryFilters: Filter[] = useMemo(() => {
    // Filters definitions
    const departmentByIdFilter = {
      key: 'departments',
      constants: departmentsIdsFilters,
      title: 'Département',
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_DEPARTEMENT_CLIC,
    } as Filter;

    const nudgesIdsFilters = {
      key: 'nudgeIds',
      constants: nudgesFilters,
      title: "Type d'aide",
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    } as Filter;

    const businessSectorsFilter = {
      key: 'businessSectorIds',
      constants: businessSectorsFilters,
      title: "Secteur d'activité",
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    } as Filter;

    const contactTypesFilter = {
      key: 'contactTypes',
      constants: allContactTypes,
      title: 'Type de contact',
      tag: GA_TAGS.PAGE_ANNUAIRE_FILTRE_AIDE_CLIC,
    } as Filter;

    // Assigning filters based on entity
    const userFilters = [
      departmentByIdFilter,
      nudgesIdsFilters,
      businessSectorsFilter,
      contactTypesFilter,
    ];
    const companyFilters = [businessSectorsFilter, departmentByIdFilter];

    // Return relevant filters
    return entity === DirectoryEntity.USER ? userFilters : companyFilters;
  }, [businessSectorsFilters, departmentsIdsFilters, entity, nudgesFilters]);

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

  const fetchDepartments = async () => {
    try {
      const { data } = await Api.getAllDepartments({ search: '' });
      setDepartmentsIdsFilters(
        data.map((department) => ({
          label: `${department.name} (${department.value})`,
          value: department.id,
        }))
      );
    } catch (error) {
      console.error('Error fetching departments:', error);
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

  const renderSearchBar = useCallback(() => {
    if (entity === DirectoryEntity.USER) {
      return (
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
            isMobile && (
              <StyledDirectoryButtonContainer>
                <MobileFilterButton
                  onClick={handleOpenFilterDrawer}
                  count={totalFiltersCount}
                />
              </StyledDirectoryButtonContainer>
            )
          }
        />
      );
    }
    if (entity === DirectoryEntity.COMPANY) {
      return (
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
          placeholder="Rechercher par nom d'entreprise"
          additionalButtons={
            isMobile && (
              <StyledDirectoryButtonContainer>
                <MobileFilterButton
                  onClick={handleOpenFilterDrawer}
                  count={totalFiltersCount}
                />
              </StyledDirectoryButtonContainer>
            )
          }
        />
      );
    }
    return null;
  }, [
    DirectoryFilters,
    entity,
    filters,
    isMobile,
    resetFilters,
    search,
    setFilters,
    setSearch,
    totalFiltersCount,
  ]);

  /**
   * Hooks
   */
  useEffect(() => {
    fetchBusinessSectors();
    fetchDepartments();
    fetchNudges();
  }, []);

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledHeaderDirectory>
            <HeaderBackoffice
              title="Bienvenue sur votre réseau"
              description="Découvrez les membres de la communauté, nos entreprises partenaires et développez votre carnet d'adresse."
              noSeparator
            />
            <StyledDirectoryButtonContainer>
              <Button
                size={isMobile ? 'small' : 'medium'}
                variant={
                  entity === DirectoryEntity.USER &&
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
                      entity: 'user',
                      departments: [],
                      role: [UserRoles.CANDIDATE],
                    },
                  });
                }}
              >
                Les candidats
              </Button>
              <Button
                size={isMobile ? 'small' : 'medium'}
                variant={
                  entity === DirectoryEntity.USER &&
                  isRoleIncluded([UserRoles.COACH], role)
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...directoryFiltersParams,
                      entity: 'user',
                      departments: [],
                      role: UserRoles.COACH,
                    },
                  });
                }}
              >
                Les coachs
              </Button>

              <Button
                size={isMobile ? 'small' : 'medium'}
                variant={
                  entity === DirectoryEntity.COMPANY ? 'primary' : 'secondary'
                }
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...directoryFiltersParams,
                      entity: DirectoryEntity.COMPANY,
                      role: null,
                      departments: [],
                    },
                  });
                }}
              >
                Les entreprises
              </Button>
            </StyledDirectoryButtonContainer>

            {renderSearchBar()}
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
          filters={filters}
          setFilters={setFilters}
          filterData={DirectoryFilters}
        />
      )}
    </>
  );
}
