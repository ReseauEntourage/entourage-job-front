import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { validate as uuidValidate } from 'uuid';
import { Api } from 'src/api';
import { LayoutBackOffice } from 'src/components/backoffice/LayoutBackOffice';
import { LoadingScreen } from 'src/components/backoffice/LoadingScreen';
import { CandidateOpportunities } from 'src/components/backoffice/candidate/CandidateOpportunities';
import { OpportunityError } from 'src/components/backoffice/opportunities/OpportunityError';
import { Section } from 'src/components/utils';
import { OPPORTUNITY_FILTERS_DATA } from 'src/constants';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { GA_TAGS } from 'src/constants/tags';
import { USER_ROLES } from 'src/constants/users';
import { useAuthenticatedUser } from 'src/hooks/authentication/useAuthenticatedUser';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useOpportunityType } from 'src/hooks/queryParams/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { useFilters } from 'src/hooks/useFilters';
import { usePrevious } from 'src/hooks/utils';
import { getCandidateFromCoach } from 'src/utils/Finding';

// filters for the query
const candidateQueryFilters = OPPORTUNITY_FILTERS_DATA.slice(1);

const Opportunities = () => {
  const { replace } = useRouter();

  const candidateId = useCandidateId();
  const prevCandidatId = usePrevious(candidateId);

  const opportunityId = useOpportunityId();

  const opportunityType = useOpportunityType();
  const prevOpportunityType = usePrevious(opportunityType);

  const queryParamsOpportunities = useQueryParamsOpportunities();
  const prevStatus = usePrevious(queryParamsOpportunities.status);

  const user = useAuthenticatedUser();
  const prevUser = usePrevious(user);

  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [hasLoadedDefaultFilters, setHasLoadedDefaultFilters] = useState(false);

  const prevHasLoadedDefaultFilters = usePrevious(hasLoadedDefaultFilters);

  const { filters, setFilters, search, setSearch, resetFilters } = useFilters(
    candidateQueryFilters,
    `/backoffice/candidat/${candidateId}/offres/${opportunityType}`,
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
            pathname: `/backoffice/candidat/${candidateId}/offres/public${
              opportunityId ? `/${opportunityId}` : ''
            }`,
            query: params,
          },
          undefined,
          {
            shallow: true,
          }
        );
        setHasLoadedDefaultFilters(true);
      } catch (e) {
        setHasError(true);
      }
    },
    [opportunityId, replace, queryParamsOpportunities, candidateId]
  );

  useDeepCompareEffect(() => {
    if (
      candidateId &&
      (user !== prevUser ||
        opportunityType !== prevOpportunityType ||
        hasLoadedDefaultFilters !== prevHasLoadedDefaultFilters ||
        queryParamsOpportunities.status !== prevStatus ||
        candidateId !== prevCandidatId)
    ) {
      // Si changement de page et donc potentiel premier chargement
      if (opportunityType !== prevOpportunityType) {
        setHasLoadedDefaultFilters(false);
      }
      if (user.role === USER_ROLES.ADMIN) {
        // Redirection si on est connecté en tant qu'admin
        replace(
          `/backoffice/admin/offres${opportunityId ? `/${opportunityId}` : ''}`,
          undefined,
          {
            shallow: true,
          }
        );
      } else if (opportunityType === 'private') {
        // Cas pour les offres privée
        if (!queryParamsOpportunities.status) {
          // Si pas le paramètre status dans l'URL
          // Redirection par défaut pour tout le temps avoir le paramètre status
          replace(
            {
              pathname: `/backoffice/candidat/${candidateId}/offres/private${
                opportunityId ? `/${opportunityId}` : ''
              }`,
              query: { status: -1 },
            },
            undefined,
            {
              shallow: true,
            }
          );
        } else {
          // On a déja le paramètre status
          setLoading(false);
        }
      } else if (opportunityType === 'public') {
        // Cas pour les offres publiques
        const { status, ...restQueryParams } = queryParamsOpportunities;
        const candidate =
          user.role === USER_ROLES.CANDIDATE
            ? user
            : getCandidateFromCoach(user, candidateId);

        if (
          candidate &&
          !hasLoadedDefaultFilters &&
          _.isEmpty(restQueryParams)
        ) {
          // Si on a pas encore appliqué les filtres par défaut
          // Et si on a pas d'autres paramètres qui indiquerait qu'on est pas sur un premier chargement de la page
          // Appliquer les filtres par défaut
          setCandidateDefaultsIfPublicTag(candidate.id, candidate.zone);
        } else if (!hasLoadedDefaultFilters) {
          // Si on a déjà appliqué les filtres par défaut
          // Ou si on a d'autres paramètres donc ce n'est pas un premier chargement de la page
          setHasLoadedDefaultFilters(true);
        } else {
          setLoading(false);
        }
      } else {
        // Dernier cas pour la rétrocompatibilité.
        // Si pas de opportunityType, on regarde si on a un opportunityId dans opportunityType.
        // Redirection par défaut sur les offres privées
        const realOpportunityId = uuidValidate(opportunityType)
          ? opportunityType
          : opportunityId;
        replace(
          `/backoffice/candidat/${candidateId}/offres/private${
            realOpportunityId ? `/${realOpportunityId}` : ''
          }`,
          undefined,
          {
            shallow: true,
          }
        );
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
    prevCandidatId,
  ]);

  let content;
  if (loading || (opportunityType === 'public' && !hasLoadedDefaultFilters)) {
    content = <LoadingScreen />;
  } else if (hasError) {
    content = <OpportunityError />;
  } else if (!candidateId) {
    content = (
      <div className="uk-flex uk-flex-column uk-flex-middle uk-margin-large-top">
        <h2 className="uk-text-bold uk-text-center">
          <span className="uk-text-primary">Aucun candidat</span> n&apos;est
          rattaché à ce compte.
        </h2>
        <p className="uk-text-center">
          Il peut y avoir plusieurs raisons à ce sujet. Contacte l&apos;équipe
          Entourage Pro pour en savoir plus.
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
        user.role === USER_ROLES.CANDIDATE
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      <Section className="custom-page">
        {opportunityType ? content : <LoadingScreen />}
      </Section>
    </LayoutBackOffice>
  );
};
export default Opportunities;
