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
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';

const candidateFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const {
    isReady,
    replace,
    query: { q, offerId, tag, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

  const [candidatId, setCandidatId] = useState();

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateFilters,
    '/backoffice/candidat/offres',
    ['offerId']
  );

  const { tabFilters, setTabFilters } = useTabFilters(
    OFFER_CANDIDATE_FILTERS_DATA,
    '/backoffice/candidat/offres',
    ['offerId']
  );

  const setCandidatDefaultsIfNoTag = useCallback(
    async (candId, candidatZone) => {
      if (!tag) {
        const params = {
          tag: OFFER_CANDIDATE_FILTERS_DATA[0].tag,
          ...restParams,
        };

        try {
          const { data } = await Api.get(`/cv/`, {
            params: {
              userId: candId,
            },
          });

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

          /*
            if (data.businessLines && data.businessLines.length > 0) {
              params.businessLines = _.uniq(
                data.businessLines.map((businessLine) => {
                  return businessLine.name;
                })
              );
            }
          */

          await replace(
            {
              pathname: `/backoffice/candidat/offres${
                offerId ? `/${offerId}` : ''
              }`,
              query: params,
            },
            undefined,
            {
              shallow: true,
            }
          );
          setCandidatId(candId);
          setHasLoadedDefaultFilters(true);
        } catch (e) {
          setHasError(true);
        }
      } else {
        setCandidatId(candId);
        setHasLoadedDefaultFilters(true);
      }
      setHasLoadedDefaultFilters(true);
    },
    [offerId, replace, restParams, tag]
  );

  const fetchAssociatedCandidate = useCallback(
    async (coachId) => {
      try {
        const { data } = await Api.get(`/user/candidat/`, {
          params: {
            coachId,
          },
        });
        if (data) {
          setCandidatDefaultsIfNoTag(data.candidat.id, data.candidat.zone);
        } else {
          setHasLoadedDefaultFilters(true);
        }
      } catch (e) {
        setHasError(true);
        setHasLoadedDefaultFilters(true);
      }
    },
    [setCandidatDefaultsIfNoTag]
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
            pathname: `/backoffice/candidat/offres/${q}`,
            query: redirectParams,
          },
          undefined,
          {
            shallow: true,
          }
        );
      } else if (user) {
        if (user.role === USER_ROLES.ADMIN) {
          replace(
            `/backoffice/admin/offres${offerId ? `/${offerId}` : ''}`,
            undefined,
            {
              shallow: true,
            }
          );
        } else if (!hasLoadedDefaultFilters) {
          if (user.role === USER_ROLES.CANDIDAT) {
            setCandidatDefaultsIfNoTag(user.id, user.zone);
          } else if (user.role === USER_ROLES.COACH) {
            fetchAssociatedCandidate(user.id, user.zone);
          }
        } else {
          setLoading(false);
        }
      }
    }
  }, [
    fetchAssociatedCandidate,
    hasLoadedDefaultFilters,
    isReady,
    offerId,
    q,
    replace,
    restParams,
    setCandidatDefaultsIfNoTag,
    tag,
    user,
  ]);

  let content;
  if (loading || !user || !hasLoadedDefaultFilters) {
    content = <LoadingScreen />;
  } else if (hasError) {
    content = <OpportunityError />;
  } else if (!candidatId) {
    content = (
      <>
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte.
        </h2>
        <p className="uk-text-center">
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          LinkedOut pour en savoir plus.
        </p>
      </>
    );
  } else {
    content = (
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
    );
  }

  return (
    <LayoutBackOffice
      title={
        user && user.role === USER_ROLES.CANDIDAT
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      <Section>{content}</Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
