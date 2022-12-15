import React, { useCallback, useContext, useEffect, useState } from "react";
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/components/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/api/index.ts';
import { OPPORTUNITY_FILTERS_DATA, USER_ROLES } from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useRouter } from 'next/router';
import CandidateOpportunities from 'src/components/backoffice/candidate/CandidateOpportunities';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { GA_TAGS } from 'src/constants/tags';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { useOpportunityId } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useOpportunityId';
import { useOpportunityType } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useOpportunityType';
import useDeepCompareEffect from 'use-deep-compare-effect';

// filters for the query
const candidateQueryFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const { isReady, replace } = useRouter();

  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();

  const queryParamsOpportunities = useQueryParamsOpportunities();

  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

  const [candidateId, setCandidateId] = useState();

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateQueryFilters,
    `/backoffice/candidat/offres/${opportunityType}`,
    ['offerId', 'type'],
    GA_TAGS.BACKOFFICE_CANDIDAT_SUPPRIMER_FILTRES_CLIC
  );

  const setCandidateDefaultsIfPublicTag = useCallback(
    async (candId, candidatZone) => {
      if (opportunityType === 'public') {
        const params = queryParamsOpportunities;

        try {
          const { data } = await Api.getCVByCandidateId(candId);

          if (data.locations && data.locations.length > 0) {
            params.department = data.locations.map(({ name }) => {
              return name;
            });
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

          await replace(
            {
              pathname: `/backoffice/candidat/offres/public${
                opportunityId ? `/${opportunityId}` : ''
              }`,
              query: params,
            },
            undefined,
            {
              shallow: true,
            }
          );
          setCandidateId(candId);
          setHasLoadedDefaultFilters(true);
        } catch (e) {
          setHasError(true);
        }
      } else if (opportunityType === 'private') {
        setCandidateId(candId);
        setHasLoadedDefaultFilters(true);
      }
    },
    [opportunityId, replace, queryParamsOpportunities, opportunityType]
  );

  const fetchAssociatedCandidate = useCallback(
    async (coachId) => {
      try {
        const { data } = await Api.getUserCandidate(coachId);
        if (data) {
          setCandidateDefaultsIfPublicTag(data.candidat.id, data.candidat.zone);
        } else {
          setHasLoadedDefaultFilters(true);
        }
      } catch (e) {
        setHasError(true);
        setHasLoadedDefaultFilters(true);
      }
    },
    [setCandidateDefaultsIfPublicTag]
  );

  useDeepCompareEffect(() => {
    if (opportunityType && user) {
      if (opportunityType === 'private') {
        if (!queryParamsOpportunities.status) {
          replace(
            {
              pathname: '/backoffice/candidat/offres/private',
              query: { status: -1 },
            },
            undefined,
            {
              shallow: true,
            }
          );
        }
      } else if (opportunityType !== 'public') {
        setHasLoadedDefaultFilters(false);
        replace(`/backoffice/candidat/offres/public`, undefined, {
          shallow: true,
        });
      }

      if (user.role === USER_ROLES.ADMIN) {
        replace(
          `/backoffice/admin/offres${opportunityId ? `/${opportunityId}` : ''}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (!hasLoadedDefaultFilters) {
        if (user.role === USER_ROLES.CANDIDAT) {
          setCandidateDefaultsIfPublicTag(user.id, user.zone);
        } else if (user.role === USER_ROLES.COACH) {
          fetchAssociatedCandidate(user.id, user.zone);
        }
      } else {
        setLoading(false);
      }
    }
  }, [
    fetchAssociatedCandidate,
    hasLoadedDefaultFilters,
    isReady,
    opportunityId,
    replace,
    queryParamsOpportunities,
    setCandidateDefaultsIfPublicTag,
    user,
    opportunityType,
  ]);

  let content;
  if (loading || !user || !hasLoadedDefaultFilters) {
    content = <LoadingScreen />;
  } else if (hasError) {
    content = <OpportunityError />;
  } else if (!candidateId) {
    content = (
      <div className="uk-flex uk-flex-column uk-flex-middle">
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte.
        </h2>
        <p className="uk-text-center">
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          LinkedOut pour en savoir plus.
        </p>
      </div>
    );
  } else {
    content = (
      <CandidateOpportunities
        isPublic={opportunityType === 'public'}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        candidateId={candidateId}
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
      {opportunityType ? content : null}
    </LayoutBackOffice>
  );
};
export default Opportunities;
