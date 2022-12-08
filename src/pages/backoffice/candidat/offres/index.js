import React, { useCallback, useContext, useState } from 'react';
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

// filters for the query
const candidateQueryFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const {
    isReady,
    replace,
    query: { offerId, type, ...restParams },
  } = useRouter();

  const { user } = useContext(UserContext);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

  const [candidateId, setCandidateId] = useState();

  const [tag, setTag] = useState();

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateQueryFilters,
    `/backoffice/candidat/offres/${type}`,
    ['offerId', 'type'],
    GA_TAGS.BACKOFFICE_CANDIDAT_SUPPRIMER_FILTRES_CLIC
  );

  const setCandidateDefaultsIfPublicTag = useCallback(
    async (candId, candidatZone) => {
      if (type === 'public') {
        const params = restParams;

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
                offerId ? `/${offerId}` : ''
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
    [offerId, replace, restParams, type]
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

  useEffect(() => {
    console.log(isReady, 'is ready');
    if (isReady && user) {
      if (type === 'public') {
        setTag('public');
        if (
          hasLoadedDefaultFilters &&
          !restParams.department &&
          !restParams.businessLines
        ) {
          setHasLoadedDefaultFilters(false);
        }
      } else if (type === 'private') {
        if (!restParams.status) {
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
        setTag('');
      } else {
        replace(`/backoffice/candidat/offres/public`, undefined, {
          shallow: true,
        });
      }

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
          console.log('will set default');
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
    offerId,
    replace,
    restParams,
    setCandidateDefaultsIfPublicTag,
    tag,
    user,
    type,
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
        isPublic={tag === 'public'}
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
