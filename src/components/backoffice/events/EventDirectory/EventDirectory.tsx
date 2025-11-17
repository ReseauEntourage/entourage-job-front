import React, { useEffect, useMemo } from 'react';
import { Api } from '@/src/api';
import {
  MobileFilterButton,
  MobileFilterDrawer,
} from '@/src/components/filters/MobileFilters';
import { SearchBar } from '@/src/components/filters/SearchBar/SearchBar';
import {
  EVENT_MODES_FILTERS,
  EVENT_TYPES_FILTERS,
} from '@/src/constants/events';
import { GA_TAGS } from '@/src/constants/tags';
import { Filter, FilterConstant } from '@/src/constants/utils';
import { useFilters } from '@/src/hooks';
import { useAuthenticatedUser } from '@/src/hooks/authentication/useAuthenticatedUser';
import { useIsMobile } from '@/src/hooks/utils';
import { findConstantFromValue, mutateToArray } from '@/src/utils';
import { EventDirectoryList } from '../EventDirectoryList/EventDirectoryList';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Section } from 'src/components/utils';
import {
  StyledEventDirectoryButtonContainer,
  StyledEventDirectoryContainer,
  StyledEventDirectoryHeaderSectionContent,
} from './EventDirectory.styles';
import { useEventDirectoryQueryParams } from './useEventDirectoryQueryParams';

export function EventDirectory() {
  const isMobile = useIsMobile();

  // State to avoid reapplying the default filter
  const [isDefaultDepartmentSet, setIsDefaultDepartmentSet] =
    React.useState(false);

  // Query params for filters
  const { modes, search, departmentIds, eventTypes } =
    useEventDirectoryQueryParams();

  // Departments for the department filter
  const [departmentsIdsFilters, setDepartmentsIdsFilters] = React.useState<
    FilterConstant[]
  >([]);

  // State for filter drawer visibility on mobile
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);

  // Current authenticated user
  const currentUser = useAuthenticatedUser();

  // Define filters for the Event Directory
  const eventDirectoryFilters: Filter[] = [
    {
      key: 'modes',
      constants: EVENT_MODES_FILTERS,
      title: 'Format',
      tag: GA_TAGS.PAGE_EVENTS_FILTRE_MODE_CLIC,
    } as Filter,
    {
      key: 'eventTypes',
      constants: EVENT_TYPES_FILTERS,
      title: "Type d'événement",
      tag: GA_TAGS.PAGE_EVENTS_FILTRE_TYPE_CLIC,
    } as Filter,
    {
      key: 'departmentIds',
      constants: departmentsIdsFilters,
      title: 'Département',
      tag: GA_TAGS.PAGE_EVENTS_FILTRE_DEPARTMENT_CLIC,
    } as Filter,
  ];

  // Fetch departments for the department filter
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

  // Compute filters based on query params
  const filters = useMemo(() => {
    return {
      modes: mutateToArray(modes).map((format) =>
        findConstantFromValue(format, EVENT_MODES_FILTERS)
      ),
      eventTypes: mutateToArray(eventTypes).map((types) =>
        findConstantFromValue(types, EVENT_TYPES_FILTERS)
      ),
      departmentIds: mutateToArray(departmentIds).map((department) =>
        findConstantFromValue(department, departmentsIdsFilters)
      ),
    };
  }, [modes, eventTypes, departmentIds, departmentsIdsFilters]);

  // Compute total number of applied filters
  const totalFiltersCount = useMemo(() => {
    return Object.values(filters).reduce(
      (acc, curr) => acc + (curr ? curr.length : 0),
      0
    );
  }, [filters]);

  // Handlers for setting filters and search
  const { setFilters, setSearch, resetFilters } = useFilters(
    eventDirectoryFilters,
    `/backoffice/events`,
    [],
    GA_TAGS.PAGE_EVENTS_SUPPRIMER_FILTRES_CLIC
  );

  /**
   * Hooks
   */
  useEffect(() => {
    // Fetch departments on mount
    fetchDepartments();
  }, []);

  useEffect(() => {
    // Set default department filter based on user's profile
    if (
      !isDefaultDepartmentSet &&
      currentUser?.userProfile?.department &&
      departmentsIdsFilters.length > 0
    ) {
      const department = departmentsIdsFilters.find((dept) => {
        if (dept.label && currentUser.userProfile.department) {
          return dept.label === currentUser.userProfile.department;
        }
        return null;
      });
      setFilters({
        departmentIds: department ? [department] : [],
      });
      setIsDefaultDepartmentSet(true);
    }
  }, [
    isDefaultDepartmentSet,
    currentUser.userProfile.department,
    departmentsIdsFilters,
    setFilters,
  ]);

  const handleOpenFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const handleCloseFilterDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  return (
    <>
      <StyledBackgroundedHeaderBackoffice>
        <Section className="custom-page">
          <StyledEventDirectoryHeaderSectionContent>
            <HeaderBackoffice
              title="Découvrez tous les évenements"
              description="Découvrez tous les événements Entourage Pro"
              noSeparator
            />

            <SearchBar
              light
              filtersConstants={eventDirectoryFilters}
              filters={filters}
              resetFilters={() => {
                resetFilters();
              }}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher par nom"
              additionalButtons={
                isMobile && (
                  <StyledEventDirectoryButtonContainer isMobile={isMobile}>
                    <MobileFilterButton
                      onClick={handleOpenFilterDrawer}
                      count={totalFiltersCount}
                    />
                  </StyledEventDirectoryButtonContainer>
                )
              }
            />
          </StyledEventDirectoryHeaderSectionContent>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StyledEventDirectoryContainer>
          <EventDirectoryList />
        </StyledEventDirectoryContainer>
      </Section>

      {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={handleCloseFilterDrawer}
          onApplyFilters={() => undefined}
          filters={filters}
          setFilters={setFilters}
          filterData={eventDirectoryFilters}
        />
      )}
    </>
  );
}
