import React, { useCallback, useContext, useState } from 'react';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/api/index.ts';
import { OPPORTUNITY_FILTERS_DATA, USER_ROLES } from 'src/constants';
import OpportunityError from 'src/components/opportunities/OpportunityError';
import { useRouter } from 'next/router';
import { CandidateOpportunities } from 'src/components/backoffice/candidate/CandidateOpportunities';
import LoadingScreen from 'src/components/backoffice/cv/LoadingScreen';
import { GA_TAGS } from 'src/constants/tags';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { usePrevious } from 'src/hooks/utils';
import { getCandidateIdFromCoachOrCandidate, getRelatedUser } from 'src/utils';

// filters for the query
const candidateQueryFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const { replace } = useRouter();

  const opportunityId = useOpportunityId();

  const opportunityType = useOpportunityType();
  const prevOpportunityType = usePrevious(opportunityType);

  const queryParamsOpportunities = useQueryParamsOpportunities();
  const prevStatus = usePrevious(queryParamsOpportunities.status);

  const { user } = useContext(UserContext);
  const prevUser = usePrevious(user);

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
      let params = { ...queryParamsOpportunities };

      try {
        const { data } = await Api.getCVByCandidateId(candId);

        if (data.locations && data.locations.length > 0) {
          params = {
            ...params,
            department: data.locations.map(({ name }) => {
              return name;
            }),
          };
        } else if (candidatZone && candidatZone !== ADMIN_ZONES.HZ) {
          const defaultDepartmentsForCandidate = DEPARTMENTS_FILTERS.filter(
            (dept) => {
              return candidatZone === dept.zone;
            }
          );

          params = {
            ...params,
            department: defaultDepartmentsForCandidate.map((dept) => {
              return dept.value;
            }),
          };
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
    },
    [opportunityId, replace, queryParamsOpportunities]
  );

  useDeepCompareEffect(() => {
    if (
      user &&
      (user !== prevUser ||
        opportunityType !== prevOpportunityType ||
        queryParamsOpportunities.status !== prevStatus)
    ) {
      if (opportunityType !== prevOpportunityType) {
        setHasLoadedDefaultFilters(false);
      }
      if (user.role === USER_ROLES.ADMIN) {
        replace(
          `/backoffice/admin/offres${opportunityId ? `/${opportunityId}` : ''}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (opportunityType === 'private') {
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
        } else {
          const candId = getCandidateIdFromCoachOrCandidate(user);
          setCandidateId(candId);
          setHasLoadedDefaultFilters(true);
          setLoading(false);
        }
      } else if (opportunityType === 'public') {
        if (!hasLoadedDefaultFilters) {
          const candidate =
            user.role === USER_ROLES.CANDIDAT ? user : getRelatedUser(user);
          setCandidateDefaultsIfPublicTag(candidate.id, candidate.zone);
        }
      } else {
        replace(`/backoffice/candidat/offres/public`, undefined, {
          shallow: true,
        });
      }
    } else {
      setLoading(false);
    }
  }, [
    hasLoadedDefaultFilters,
    opportunityId,
    replace,
    queryParamsOpportunities.status,
    prevStatus,
    setCandidateDefaultsIfPublicTag,
    user,
    prevUser,
    opportunityType,
    prevOpportunityType,
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
