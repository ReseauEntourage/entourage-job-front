import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { Api } from 'src/api';

import { Member } from 'src/components/backoffice/admin/MemberList/Member';
import {
  StyledActionsContainer,
  StyledTable,
} from 'src/components/backoffice/admin/MemberList/MemberList.styles';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import SearchBar from 'src/components/filters/SearchBar';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { Section } from 'src/components/utils';
import BackToTop from 'src/components/utils/BackToTop/index';
import { Button } from 'src/components/utils/Button';
import {
  CANDIDATE_USER_ROLES,
  COACH_USER_ROLES,
  MEMBER_FILTERS_DATA,
} from 'src/constants';
import { GA_TAGS } from 'src/constants/tags';
import { useBulkActions } from 'src/hooks/useBulkActions';
import { usePrevious } from 'src/hooks/utils';
import { isRoleIncluded, filtersToQueryParams } from 'src/utils';
import { MemberCreationButtons } from './MemberCreationButtons/MemberCreationButtons';

const LIMIT = 50;

export function MemberList({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
}) {
  const {
    query: { role: queryRole },
  } = useRouter();

  const role = queryRole as string;

  const prevRole = usePrevious(role);
  const [filtersConst, setFiltersConst] = useState(MEMBER_FILTERS_DATA);

  const [numberOfResults, setNumberOfResults] = useState(0);

  const [members, setMembers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allLoaded, setAllLoaded] = useState(false);
  const [offset, setOffset] = useState(0);

  const fetchData = useCallback(
    (searchValue, filtersValue, roleValue, offsetValue, doReset) => {
      setHasError(false);
      if (doReset) {
        setLoading(true);
        setMembers([]);
      }
      Api.getUsersMembers({
        params: {
          limit: LIMIT,
          offset: doReset ? 0 : offsetValue,
          role: roleValue,
          query: searchValue,
          ...filtersToQueryParams(filtersValue),
        },
      })
        .then(({ data }) => {
          if (doReset) {
            setMembers(data);
            setNumberOfResults(data.length);
            setOffset(LIMIT);
            setAllLoaded(false);
          } else {
            setMembers((prevMembers) => {
              return [...prevMembers, ...data];
            });
            setOffset((prevOffset) => {
              return prevOffset + LIMIT;
            });
            setNumberOfResults((prevNumberOfResults) => {
              return prevNumberOfResults + data.length;
            });
          }

          if (data.length < LIMIT) {
            setAllLoaded(true);
          }
        })
        .catch((err) => {
          console.error(err);
          setHasError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    []
  );

  const { selectElement, executeAction, hasSelection } = useBulkActions(
    'candidate',
    async () => {
      await fetchData(search, filters, role, offset, true);
    },
    GA_TAGS.BACKOFFICE_ADMIN_MASQUER_MASSE_CLIC
  );

  useDeepCompareEffect(() => {
    fetchData(search, filters, role, offset, true);
  }, [search, filters, role]);

  useEffect(() => {
    if (role !== prevRole) {
      const initialFiltersConst = isRoleIncluded(COACH_USER_ROLES, role)
        ? [MEMBER_FILTERS_DATA[0], MEMBER_FILTERS_DATA[2]]
        : MEMBER_FILTERS_DATA;

      setFiltersConst(initialFiltersConst);
    }
  }, [prevRole, role]);

  const roleToPage = {
    Candidat: 'candidates',
    Coach: 'coachs',
  };

  const handleSelectedMembers = (memberId) => {
    selectElement({ id: memberId });
  };

  return (
    <>
      <BackToTop />
      <HeaderBackoffice
        title={`Gestion des ${role?.toLocaleLowerCase()}s`}
        description={`Ici vous pouvez accéder à tous les profils des ${
          role?.toLocaleLowerCase() || 'membres'
        }s afin d'effectuer un suivi individuel de leur avancée.`}
        page={roleToPage[role]}
      >
        <MemberCreationButtons
          fetchMembers={() => fetchData(search, filters, role, offset, true)}
        />
      </HeaderBackoffice>
      {hasError ? (
        <Section className="uk-width-1-1">
          <div className=" uk-text-center uk-flex uk-flex-center">
            <div className="uk-width-xlarge">
              <h2 className="uk-margin-remove">
                Les membres n&apos;ont pas pu etre chargés correctement.
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
            filtersConstants={filtersConst}
            filters={filters}
            numberOfResults={numberOfResults}
            resetFilters={resetFilters}
            search={search}
            setSearch={setSearch}
            setFilters={setFilters}
            placeholder="Rechercher..."
            smallSelectors
          />
          {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
            <StyledActionsContainer>
              <Button
                style="custom-secondary"
                size="small"
                disabled={!hasSelection}
                color="primaryOrange"
                onClick={() => {
                  return executeAction({ hidden: true }, 'put');
                }}
              >
                Masquer CV
              </Button>
            </StyledActionsContainer>
          )}
          {loading ? (
            <LoadingScreen />
          ) : (
            <div className="uk-overflow-auto uk-margin-top table-wrapper">
              <StyledTable>
                <thead>
                  <tr>
                    <th className="uk-text-nowrap">{role}</th>
                    {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
                      <th>Coach</th>
                    )}
                    {isRoleIncluded(COACH_USER_ROLES, role) && (
                      <th>Candidat</th>
                    )}
                    <th>Zone</th>
                    <th>Dernière connexion</th>
                    {isRoleIncluded(CANDIDATE_USER_ROLES, role) && (
                      <>
                        <th>En emploi</th>
                        <th>Statut CV</th>
                        <th>CV masqué</th>
                        <th>Sélection</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody data-testid="member-list">
                  {members.map((member, key) => {
                    return (
                      <Member
                        role={role}
                        member={member}
                        key={key}
                        callback={handleSelectedMembers}
                      />
                    );
                  })}
                </tbody>
              </StyledTable>
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
                onClick={async () => {
                  await fetchData(search, filters, role, offset, false);
                }}
              >
                Voir tous les {role?.toLocaleLowerCase()}s
              </Button>
            </div>
          )}
          {!loading && allLoaded && members.length <= 0 && (
            <div className="uk-height-small uk-flex uk-flex-center uk-flex-middle">
              <p className="uk-text-italic">Aucun membre trouvé</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

MemberList.propTypes = {
  search: PropTypes.string,
  filters: PropTypes.shape({}),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
};

MemberList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => null,
  setSearch: () => null,
  resetFilters: () => null,
};
