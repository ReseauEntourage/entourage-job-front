import React, { useEffect, useMemo } from 'react';
import { Api } from '@/src/api';
import { SearchBar } from '@/src/components/filters/SearchBar/SearchBar';
import {
  EVENT_MODES_FILTERS,
  EVENT_TYPES_FILTERS,
} from '@/src/constants/event';
import { GA_TAGS } from '@/src/constants/tags';
import { Filter, FilterConstant } from '@/src/constants/utils';
import { useFilters } from '@/src/hooks';
import { findConstantFromValue, mutateToArray } from '@/src/utils';
import { DirectoryList } from '../../directory/DirectoryList';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import { StyledBackgroundedHeaderBackoffice } from 'src/components/headers/HeaderBackoffice/HeaderBackoffice.styles';
import { Section } from 'src/components/utils';
import {
  StyledEventDirectoryContainer,
  StyledEventDirectoryHeaderSectionContent,
} from './EventDirectory.styles';
import { useEventDirectoryQueryParams } from './useEventDirectoryQueryParams';

export function EventDirectory() {
  const eventDirectoryFiltersParams = useEventDirectoryQueryParams();
  const { modes, search, departmentIds, eventTypes } =
    eventDirectoryFiltersParams;
  const [departmentsIdsFilters, setDepartmentsIdsFilters] = React.useState<
    FilterConstant[]
  >([]);

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

  const { setFilters, setSearch, resetFilters } = useFilters(
    eventDirectoryFilters,
    `/backoffice/events`,
    [],
    GA_TAGS.PAGE_ANNUAIRE_SUPPRIMER_FILTRES_CLIC
  );

  /**
   * Hooks
   */
  useEffect(() => {
    fetchDepartments();
  }, []);

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
              placeholder="Rechercher par nom ou lieu"
              // additionalButtons={
              //   isMobile && (
              //     <StyledDirectoryButtonContainer isMobile={isMobile}>
              //       <MobileFilterButton
              //         onClick={handleOpenFilterDrawer}
              //         count={totalFiltersCount}
              //       />
              //     </StyledDirectoryButtonContainer>
              //   )
              // }
            />
          </StyledEventDirectoryHeaderSectionContent>
        </Section>
      </StyledBackgroundedHeaderBackoffice>
      <Section className="custom-page">
        <StyledEventDirectoryContainer>
          <DirectoryList />
        </StyledEventDirectoryContainer>
      </Section>

      {/* {isMobile && (
        <MobileFilterDrawer
          isOpen={isFilterDrawerOpen}
          onClose={handleCloseFilterDrawer}
          onApplyFilters={() => undefined}
          filters={filters}
          setFilters={setFilters}
          filterData={DirectoryFilters}
        />
      )} */}
    </>
  );
}
