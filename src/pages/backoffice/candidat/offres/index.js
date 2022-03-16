import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters, useTabFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import { Section } from 'src/components/utils';
import Api from 'src/Axios';
import {
  OFFER_CANDIDATE_FILTERS_DATA,
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useRouter } from 'next/router';
import CandidateOpportunityList from 'src/components/backoffice/candidate/CandidateOpportunityList';
import { usePrevious } from 'src/hooks/utils';

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const {
    isReady,
    replace,
    query: { q, offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);
  const prevUser = usePrevious(user);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDefaultFilters, setLoadingDefaultFilters] = useState(true);

  const [candidatId, setCandidatId] = useState();
  const prevCandidatId = usePrevious(candidatId);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateFilters,
    {
      href: '/backoffice/candidat/offres',
    },
    ['offerId']
  );

  const { tabFilters, setTabFilters } = useTabFilters(
    OFFER_CANDIDATE_FILTERS_DATA,
    {
      href: '/backoffice/candidat/offres',
    },
    ['offerId']
  );

  const setCandidatDefaults = useCallback(
    (candId, candidatZone) => {
      if (!tag) {
        const params = {
          tag: OFFER_CANDIDATE_FILTERS_DATA[1].tag,
          ...restParams,
        };

        Api.get(`/cv/`, {
          params: {
            userId: candId,
          },
        })
          .then(({ data }) => {
            if (data.locations && data.locations.length > 0) {
              params.department = data.locations;
            } else if (candidatZone && candidatZone !== ADMIN_ZONES.HZ) {
              const defaultDepartmentsForCandidate = DEPARTMENTS_FILTERS.filter(
                (dept) => {
                  return candidatZone === dept.zone;
                }
              );

              params.department = defaultDepartmentsForCandidate.map((dept) => {
                return dept.value;
              });
            }
            /* if (data.businessLines && data.businessLines.length > 0) {
              params.businessLines = _.uniq(
                data.businessLines.map((businessLine) => {
                  return businessLine.name;
                })
              );
            } */
            replace(
              {
                pathname: `/backoffice/candidat/offres${
                  offerId ? '/[offerId]' : ''
                }`,
                query: params,
              },
              {
                pathname: `/backoffice/candidat/offres${
                  offerId ? `/${offerId}` : ''
                }`,
                query: params,
              },
              {
                shallow: true,
              }
            );
          })
          .catch(() => {
            setHasError(true);
          });
      } else {
        setCandidatId(candId);
        setLoadingDefaultFilters(false);
      }
    },
    [offerId, replace, restParams, tag]
  );

  useEffect(() => {
    if (isReady) {
      const redirectParams = tag
        ? {
            tag,
            ...restParams,
          }
        : restParams;

      // For retrocompatibility
      if (q) {
        replace(
          {
            pathname: '/backoffice/candidat/offres/[offerId]',
            query: redirectParams,
          },
          {
            pathname: `/backoffice/candidat/offres/${q}`,
            query: redirectParams,
          },
          {
            shallow: true,
          }
        );
      } else if (user) {
        if (
          user.role !== USER_ROLES.COACH &&
          user.role !== USER_ROLES.CANDIDAT
        ) {
          replace(
            {
              pathname: `/backoffice/admin/offres${
                offerId ? '/[offerId]' : ''
              }`,
              query: redirectParams,
            },
            {
              pathname: `/backoffice/admin/offres${
                offerId ? `/${offerId}` : ''
              }`,
              query: redirectParams,
            },
            {
              shallow: true,
            }
          );
        } else if (user !== prevUser || !candidatId) {
          setLoading(true);
          if (user.role === USER_ROLES.CANDIDAT) {
            setCandidatDefaults(user.id, user.zone);
            setLoading(false);
          } else if (user.role === USER_ROLES.COACH) {
            Api.get(`/user/candidat/`, {
              params: {
                coachId: user.id,
              },
            })
              .then(({ data }) => {
                if (data) {
                  setCandidatDefaults(data.candidat.id, user.zone);
                } else {
                  setHasError(true);
                }
                setLoading(false);
              })
              .catch(() => {
                setHasError(true);
                setLoading(false);
              });
          }
        } else {
          setLoadingDefaultFilters(true);
          setCandidatDefaults(candidatId, user.zone);
        }
      }
    }
  }, [
    candidatId,
    isReady,
    offerId,
    prevCandidatId,
    prevUser,
    q,
    replace,
    restParams,
    setCandidatDefaults,
    tag,
    user,
  ]);

  return (
    <LayoutBackOffice
      title={
        user && user.role === USER_ROLES.CANDIDAT
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      <Section>
        <>
          {!loading && hasError && <OpportunityError />}
          {!user || !candidatId || loadingDefaultFilters || loading ? (
            <div className="uk-text-center">
              <div data-uk-spinner />
            </div>
          ) : (
            <CandidateOpportunityList
              search={search}
              filters={filters}
              resetFilters={resetFilters}
              setSearch={setSearch}
              setFilters={setFilters}
              candidatId={candidatId}
              tabFilters={tabFilters}
              setTabFilters={setTabFilters}
            />
          )}
        </>
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
