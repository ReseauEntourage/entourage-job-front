import React, { useCallback, useContext, useState } from 'react';
import { ADMIN_ZONES, DEPARTMENTS_FILTERS } from 'src/constants/departements';
import { useFilters } from 'src/hooks';
import { UserContext } from 'src/store/UserProvider';
import LayoutBackOffice from 'src/components/backoffice/LayoutBackOffice';
import Api from 'src/api/index.ts';
import {
  CANDIDATE_USER_ROLES,
  OPPORTUNITY_FILTERS_DATA,
  USER_ROLES,
} from 'src/constants';
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
import {
  areRolesIncluded,
  getCandidateIdFromCoachOrCandidate,
  getRelatedUser,
} from 'src/utils';
import _ from 'lodash';
import { validate as uuidValidate } from 'uuid';

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

  const prevHasLoadedDefaultFilters = usePrevious(hasLoadedDefaultFilters);

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

  useDeepCompareEffect(async () => {
    if (
      user &&
      (user !== prevUser ||
        opportunityType !== prevOpportunityType ||
        hasLoadedDefaultFilters !== prevHasLoadedDefaultFilters ||
        queryParamsOpportunities.status !== prevStatus)
    ) {
      // Si changement de page et donc potentiel premier chargement
      if (opportunityType !== prevOpportunityType) {
        setHasLoadedDefaultFilters(false);
      }
      if (user.role === USER_ROLES.ADMIN) {
        // Redirection si on est connecté en tant qu'admin
        await replace(
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
          await replace(
            {
              pathname: `/backoffice/candidat/offres/private${
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
          const candId = getCandidateIdFromCoachOrCandidate(user);
          setCandidateId(candId);
          setLoading(false);
        }
      } else if (opportunityType === 'public') {
        // Cas pour les offres publiques
        const { status, ...restQueryParams } = queryParamsOpportunities;
        const candidate = areRolesIncluded(CANDIDATE_USER_ROLES, [user.role])
          ? user
          : getRelatedUser(user);
        if (
          candidate &&
          !hasLoadedDefaultFilters &&
          _.isEmpty(restQueryParams)
        ) {
          // Si on a pas encore appliqué les filtres par défaut
          // Et si on a pas d'autres paramètres qui indiquerait qu'on est pas sur un premier chargement de la page
          // Appliquer les filtres par défaut
          setCandidateDefaultsIfPublicTag(candidate.id, candidate.zone);
        } else {
          // Si on a déjà appliqué les filtres par défaut
          // Ou si on a d'autres paramètres donc ce n'est pas un premier chargement de la page
          setCandidateId(candidate?.id);
          setHasLoadedDefaultFilters(true);
        }
      } else {
        // Dernier cas pour la rétrocompatibilité.
        // Si pas de opportunityType, on regarde si on a un opportunityId dans opportunityType.
        // Redirection par défaut sur les offres privées
        const realOpportunityId = uuidValidate(opportunityType)
          ? opportunityType
          : opportunityId;
        await replace(
          `/backoffice/candidat/offres/private${
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
  ]);

  let content;
  if (
    loading ||
    !user ||
    (opportunityType === 'public' && !hasLoadedDefaultFilters)
  ) {
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
        user && areRolesIncluded(CANDIDATE_USER_ROLES, [user.role])
          ? 'Mes opportunités'
          : 'Opportunités du candidat'
      }
    >
      {opportunityType ? content : null}
    </LayoutBackOffice>
  );
};
export default Opportunities;
