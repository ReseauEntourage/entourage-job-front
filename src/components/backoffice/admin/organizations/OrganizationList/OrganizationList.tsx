import React, { useCallback, useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { OrganizationTable } from '../OrganizationTable';
import { Organization } from '../OrganizationTable/Organization';
import { Api } from 'src/api';

import { Organization as OrganizationType } from 'src/api/types';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { AdminCreationButtons } from 'src/components/backoffice/admin/AdminCreationButtons';
import { SearchBar } from 'src/components/filters/SearchBar/SearchBar';
import { HeaderBackoffice } from 'src/components/headers/HeaderBackoffice';
import {
  Section,
  Button,
  BackToTop,
  ContainerWithTextCentered,
  Text,
} from 'src/components/utils';
import { H4 } from 'src/components/utils/Headings';
import { ORGANIZATION_FILTERS_DATA } from 'src/constants';
import { FilterObject } from 'src/constants/utils';
import { filtersToQueryParams } from 'src/utils/Filters';
import { StyledOrganizationsListButtonContainer } from './OrganizationList.styles';

const LIMIT = 50;

interface OrganizationListProps {
  filters: FilterObject<typeof ORGANIZATION_FILTERS_DATA>;
  setFilters: (
    updatedFilters: FilterObject<typeof ORGANIZATION_FILTERS_DATA>
  ) => void;
  search?: string;
  setSearch: (search?: string) => void;
  resetFilters: () => void;
}
export function OrganizationList({
  search,
  filters = {},
  setFilters,
  setSearch,
  resetFilters,
}: OrganizationListProps) {
  const [organizations, setOrganizations] = useState<OrganizationType[]>([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(
    async (searchValue, filtersValue, offsetValue, doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setOrganizations([]);
      }
      try {
        const { data: organizationsData } = await Api.getAllOrganizations({
          params: {
            limit: LIMIT,
            offset: doReset ? 0 : offsetValue,
            search: searchValue,
            ...filtersToQueryParams(filtersValue),
          },
        });

        if (doReset) {
          setOrganizations(organizationsData);
          setOffset(LIMIT);
          setAllLoaded(false);
        } else {
          setOrganizations((pevOrganizations) => {
            return [...pevOrganizations, ...organizationsData];
          });
          setOffset((prevOffset) => {
            return prevOffset + LIMIT;
          });
        }

        if (organizationsData.length < LIMIT) {
          setAllLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setHasError(true);
      }

      setLoading(false);
    },
    []
  );

  useDeepCompareEffect(() => {
    fetchData(search, filters, offset, true);
  }, [search, filters]);

  const organizationsList = useMemo(() => {
    return organizations.map((organization, key) => {
      return (
        <Organization
          refreshOrganizations={() => fetchData(search, filters, offset, true)}
          organization={organization}
          key={key}
        />
      );
    });
  }, [fetchData, filters, offset, organizations, search]);

  return (
    <>
      <BackToTop />
      <HeaderBackoffice
        title="Gestion des structures"
        description="Ici vous pouvez accéder à toutes les informations sur les structures"
      >
        <AdminCreationButtons
          refreshList={() => fetchData(search, filters, offset, true)}
        />
      </HeaderBackoffice>
      {hasError ? (
        <Section>
          <ContainerWithTextCentered>
            <H4 title="Les structures n'ont pas pu etre chargés correctement." />
            <Text size="large">
              Contacte l&apos;équipe Entourage Pro pour en savoir plus.
            </Text>
          </ContainerWithTextCentered>
        </Section>
      ) : (
        <>
          <Section className="custom-primary custom-fixed">
            <SearchBar
              filtersConstants={ORGANIZATION_FILTERS_DATA}
              filters={filters}
              resetFilters={resetFilters}
              search={search}
              setSearch={setSearch}
              setFilters={setFilters}
              placeholder="Rechercher..."
              smallSelectors
            />
          </Section>
          {loading ? (
            <LoadingScreen />
          ) : (
            <OrganizationTable organizations={organizationsList} />
          )}
          {!loading && !allLoaded && (
            <StyledOrganizationsListButtonContainer>
              <Button
                variant="secondary"
                rounded
                onClick={() => fetchData(search, filters, offset, false)}
              >
                Voir toutes les structures
              </Button>
            </StyledOrganizationsListButtonContainer>
          )}
          {!loading && allLoaded && organizations.length <= 0 && (
            <ContainerWithTextCentered>
              <Text variant="italic">Aucune structure trouvé</Text>
            </ContainerWithTextCentered>
          )}
        </>
      )}
    </>
  );
}
