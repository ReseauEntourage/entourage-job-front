import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { OrganizationTable } from '../OrganizationTable';
import { Organization } from '../OrganizationTable/Organization';
import { Api } from 'src/api';

import { CreationButtons } from 'src/components/backoffice/admin/CreationButtons';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import SearchBar from 'src/components/filters/SearchBar';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';
import BackToTop from 'src/components/utils/BackToTop';
import { Button } from 'src/components/utils/Button';
import { ORGANIZATION_FILTERS_DATA } from 'src/constants';
import { filtersToQueryParams } from 'src/utils/Filters';

const LIMIT = 50;

export function OrganizationList({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) {
  const [organizations, setOrganizations] = useState([]);
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
        <CreationButtons
          refreshList={() => fetchData(search, filters, offset, true)}
        />
      </HeaderBackoffice>
      {hasError ? (
        <Section className="uk-width-1-1">
          <div className=" uk-text-center uk-flex uk-flex-center">
            <div className="uk-width-xlarge">
              <h2 className="uk-margin-remove">
                Les structures n&apos;ont pas pu etre chargés correctement.
              </h2>
              <p>
                Contacte{' '}
                <span className="uk-text-primary">l&apos;équipe LinkedOut</span>{' '}
                pour en savoir plus.
              </p>
            </div>
          </div>
        </Section>
      ) : (
        <>
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
          {loading ? (
            <LoadingScreen />
          ) : (
            <div className="uk-overflow-auto uk-margin-top">
              <OrganizationTable organizations={organizationsList} />
            </div>
          )}
          {!loading && !allLoaded && (
            <div
              style={{ borderTop: '1px solid #e5e5e5' }}
              className="uk-text-center uk-width-1-1 uk-padding"
            >
              <Button
                style="custom-secondary"
                color="primaryOrange"
                onClick={() => fetchData(search, filters, offset, false)}
              >
                Voir toutes les structures
              </Button>
            </div>
          )}
          {!loading && allLoaded && organizations.length <= 0 && (
            <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
              <p className="uk-text-italic">Aucune structure trouvé</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

OrganizationList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape({}),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

OrganizationList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => null,
  setSearch: () => null,
  resetFilters: () => null,
};
