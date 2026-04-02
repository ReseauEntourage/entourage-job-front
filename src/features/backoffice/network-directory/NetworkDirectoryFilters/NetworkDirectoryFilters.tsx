import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Api } from '@/src/api';
import { BusinessSector, Nudge } from '@/src/api/types';
import { Text, Button } from '@/src/components/ui';
import { allContactTypes } from '@/src/constants/contactTypes';
import { DEPARTMENTS_FILTERS } from '@/src/constants/departements';
import {
  NetworkDirectoryEntity,
  NetworkDirectorySort,
} from '@/src/constants/network-directory';
import { ProfileNudges } from '@/src/constants/nudges';
import { GA_TAGS } from '@/src/constants/tags';
import { UserRoles } from '@/src/constants/users';
import { Filter, FilterConstant } from '@/src/constants/utils';
import {
  MobileFilterButton,
  MobileFilterDrawer,
} from '@/src/features/filters/MobileFilters';
import { SearchBar } from '@/src/features/filters/SearchBar/SearchBar';
import { useFilters } from '@/src/hooks';
import { useIsMobile } from '@/src/hooks/utils';
import {
  findConstantFromValue,
  isRoleIncluded,
  mutateToArray,
} from '@/src/utils';
import { useNetworkDirectoryQueryParams } from '../hooks/useNetworkDirectoryQueryParams';
import {
  StyledDirectoryButtonContainer,
  StyledDirectoryFilters,
  StyledDirectoryOrderBy,
  StyledDirectoryOrderByButtonsContainer,
  StyledSeparator,
} from './NetworkDirectoryFilters.styles';

const route = '/backoffice/annuaire';

const availabilityFilters: FilterConstant<boolean>[] = [
  { value: true, label: 'Uniquement les profils disponibles' },
];

export const NetworkDirectoryFilters = () => {
  const { push } = useRouter();
  const networkDirectoryQueryParams = useNetworkDirectoryQueryParams();
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
  const sortsFilter: FilterConstant<NetworkDirectorySort>[] = useMemo(
    () => [
      {
        value: NetworkDirectorySort.LAST_CONNECTION,
        label: 'Dernière connexion',
      },
      { value: NetworkDirectorySort.RELEVANCE, label: 'Pertinence' },
    ],
    []
  );
  const {
    entity,
    role,
    departments,
    nudgeIds,
    businessSectorIds,
    search,
    contactTypes,
    isAvailable,
    sort,
  } = networkDirectoryQueryParams;

  const selectedEntityNetworkDirectoryFilters: Filter[] = useMemo(() => {
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

    const availabilityFilter = {
      key: 'isAvailable',
      constants: availabilityFilters,
      title: 'Disponibilité',
    } as Filter;

    // Assigning filters based on entity
    const userFilters = [
      departmentByIdFilter,
      nudgesIdsFilters,
      businessSectorsFilter,
      contactTypesFilter,
      availabilityFilter,
    ];
    const companyFilters = [businessSectorsFilter, departmentByIdFilter];

    // Return relevant filters
    return entity === NetworkDirectoryEntity.USER
      ? userFilters
      : companyFilters;
  }, [businessSectorsFilters, departmentsIdsFilters, entity, nudgesFilters]);

  const { setFilters, setSearch, resetFilters } = useFilters(
    selectedEntityNetworkDirectoryFilters,
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
      isAvailable:
        isAvailable !== undefined
          ? [findConstantFromValue(isAvailable, availabilityFilters)]
          : [],
      sort:
        sort !== undefined ? [findConstantFromValue(sort, sortsFilter)] : [],
    };
  }, [
    departments,
    nudgeIds,
    businessSectorIds,
    contactTypes,
    isAvailable,
    sort,
    sortsFilter,
    nudgesFilters,
    businessSectorsFilters,
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
  /**
   * Hooks
   */
  useEffect(() => {
    fetchBusinessSectors();
    fetchDepartments();
    fetchNudges();
  }, []);

  const additionalButtons = useMemo(() => {
    return (
      isMobile && (
        <>
          <StyledDirectoryButtonContainer>
            <MobileFilterButton
              onClick={handleOpenFilterDrawer}
              count={totalFiltersCount}
            />
          </StyledDirectoryButtonContainer>
          <MobileFilterDrawer
            isOpen={isFilterDrawerOpen}
            onClose={handleCloseFilterDrawer}
            filters={filters}
            setFilters={setFilters}
            filterData={selectedEntityNetworkDirectoryFilters}
          />
        </>
      )
    );
  }, [
    isMobile,
    totalFiltersCount,
    isFilterDrawerOpen,
    filters,
    setFilters,
    selectedEntityNetworkDirectoryFilters,
  ]);

  const renderSearchBar = useCallback(() => {
    if (entity === NetworkDirectoryEntity.USER) {
      return (
        <SearchBar
          light
          filtersConstants={selectedEntityNetworkDirectoryFilters}
          filters={filters}
          resetFilters={() => {
            resetFilters();
          }}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Rechercher par prénom, nom ou métier"
          additionalButtons={additionalButtons}
        />
      );
    }
    if (entity === NetworkDirectoryEntity.COMPANY) {
      return (
        <SearchBar
          light
          filtersConstants={selectedEntityNetworkDirectoryFilters}
          filters={filters}
          resetFilters={() => {
            resetFilters();
          }}
          search={search}
          setSearch={setSearch}
          setFilters={setFilters}
          placeholder="Rechercher par nom d'entreprise"
          additionalButtons={additionalButtons}
        />
      );
    }
    return null;
  }, [
    entity,
    selectedEntityNetworkDirectoryFilters,
    filters,
    search,
    setSearch,
    setFilters,
    additionalButtons,
    resetFilters,
  ]);

  return (
    <StyledDirectoryFilters>
      <StyledDirectoryButtonContainer>
        <Button
          size={isMobile ? 'small' : 'medium'}
          variant={
            entity === NetworkDirectoryEntity.USER &&
            isRoleIncluded([UserRoles.CANDIDATE], role)
              ? 'primary'
              : 'secondary'
          }
          rounded
          onClick={() => {
            push({
              pathname: route,
              query: {
                ...networkDirectoryQueryParams,
                entity: NetworkDirectoryEntity.USER,
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
            entity === NetworkDirectoryEntity.USER &&
            isRoleIncluded([UserRoles.COACH], role)
              ? 'primary'
              : 'secondary'
          }
          onClick={() => {
            push({
              pathname: route,
              query: {
                ...networkDirectoryQueryParams,
                entity: NetworkDirectoryEntity.USER,
                departments: [],
                role: [UserRoles.COACH],
              },
            });
          }}
        >
          Les coachs
        </Button>

        <Button
          size={isMobile ? 'small' : 'medium'}
          variant={
            entity === NetworkDirectoryEntity.COMPANY ? 'primary' : 'secondary'
          }
          onClick={() => {
            push({
              pathname: route,
              query: {
                ...networkDirectoryQueryParams,
                entity: NetworkDirectoryEntity.COMPANY,
                role: null,
                departments: [],
                sort: undefined,
              },
            });
          }}
        >
          Les entreprises
        </Button>
      </StyledDirectoryButtonContainer>

      {renderSearchBar()}

      {entity === NetworkDirectoryEntity.USER && (
        <>
          <StyledSeparator />
          <StyledDirectoryOrderBy>
            <Text size="small">Trier par :</Text>
            <StyledDirectoryOrderByButtonsContainer>
              <Button
                size="small"
                variant={
                  sort === NetworkDirectorySort.RELEVANCE
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...networkDirectoryQueryParams,
                      sort: NetworkDirectorySort.RELEVANCE,
                    },
                  });
                }}
              >
                Pertinence
              </Button>
              <Button
                size="small"
                variant={
                  sort === NetworkDirectorySort.LAST_CONNECTION
                    ? 'primary'
                    : 'secondary'
                }
                onClick={() => {
                  push({
                    pathname: route,
                    query: {
                      ...networkDirectoryQueryParams,
                      sort: NetworkDirectorySort.LAST_CONNECTION,
                    },
                  });
                }}
              >
                Dernière connexion
              </Button>
            </StyledDirectoryOrderByButtonsContainer>
          </StyledDirectoryOrderBy>
        </>
      )}
    </StyledDirectoryFilters>
  );
};
