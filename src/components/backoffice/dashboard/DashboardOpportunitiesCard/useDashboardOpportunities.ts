import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UIkit from 'uikit';
import {
  OpportunitiesFiltersForCandidate,
  User,
  UserCandidateWithUsers,
  UserProfile,
} from 'src/api/types';
import { ReduxRequestEvents } from 'src/constants';
import {
  fetchOpportunitiesAsCandidateSelectors,
  fetchOpportunitiesTabCountsSelectors,
  opportunitiesActions,
  selectOpportunities,
  selectOpportunitiesTabCounts,
} from 'src/use-cases/opportunities';
import {
  getCandidateIdFromCoachOrCandidate,
  getUserCandidateFromCoachOrCandidate,
} from 'src/utils';

export const useDashboardOpportunities = (user: User) => {
  const opportunities = useSelector(selectOpportunities);
  const tabCounts = useSelector(selectOpportunitiesTabCounts);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [opportunitiesDefaultFilters, setOpportunitiesDefaultFilter] =
    useState<OpportunitiesFiltersForCandidate>();
  const dispatch = useDispatch();

  const fetchOpportunitiesStatus = useSelector(
    fetchOpportunitiesAsCandidateSelectors.selectFetchOpportunitiesAsCandidateStatus
  );
  useEffect(() => {
    if (fetchOpportunitiesStatus === ReduxRequestEvents.SUCCEEDED) {
      setIsDataLoading(false);
    }
    if (fetchOpportunitiesStatus === ReduxRequestEvents.FAILED) {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  }, [fetchOpportunitiesStatus, dispatch]);

  const isFetchOpportunitiesTabCountsFailed = useSelector(
    fetchOpportunitiesTabCountsSelectors.selectIsFetchOpportunitiesTabCountsFailed
  );
  useEffect(() => {
    if (isFetchOpportunitiesTabCountsFailed) {
      UIkit.notification('Une erreur est survenue', 'danger');
    }
  }, [isFetchOpportunitiesTabCountsFailed, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(opportunitiesActions.fetchOpportunitiesAsCandidateReset());
      dispatch(opportunitiesActions.fetchOpportunitiesTabCountsReset());
    };
  }, [dispatch]);

  const [candidate, setCandidate] = useState<UserCandidateWithUsers | User>();
  const [candidateId, setCandidateId] = useState<string>();

  useEffect(() => {
    const candidateTemp = getUserCandidateFromCoachOrCandidate(user);
    const candidateIdTemp = getCandidateIdFromCoachOrCandidate(user);
    if (user && candidateIdTemp && candidateTemp && isDataLoading) {
      let candidateIdArg: string = candidateIdTemp;
      if (Array.isArray(candidateIdTemp)) {
        [candidateIdArg] = candidateIdTemp;
      }
      setCandidateId(candidateIdArg);
      let userCandidateProfile: UserProfile;
      if (
        Array.isArray(candidateTemp) &&
        candidateTemp[0]?.candidat?.userProfile
      ) {
        userCandidateProfile = candidateTemp[0]?.candidat?.userProfile;
        setCandidate(candidateTemp[0]?.candidat);
      } else {
        setCandidate(user);
        userCandidateProfile = user?.userProfile;
      }
      dispatch(
        opportunitiesActions.fetchOpportunitiesTabCountsRequested(
          candidateIdArg
        )
      );
      dispatch(
        opportunitiesActions.fetchOpportunitiesAsCandidateRequested({
          candidateId: candidateIdArg,
          type: 'public',
          department: [userCandidateProfile.department],
          limit: 3,
          businessLines: userCandidateProfile.searchBusinessLines.map(
            (businessLine) => businessLine.name
          ),
        })
      );
      setOpportunitiesDefaultFilter({
        type: 'public',
        department: [userCandidateProfile.department],
        businessLines: userCandidateProfile.searchBusinessLines.map(
          (businessLine) => businessLine.name
        ),
      });
    }
  }, [dispatch, user, isDataLoading]);

  const [numberOpportunitiesInProgess, setNumberOpportunitiesInProgress] =
    useState<number>();

  useEffect(() => {
    if (tabCounts) {
      setNumberOpportunitiesInProgress(
        tabCounts.find((tabCount) => tabCount.status === -1)?.count
      );
    }
  }, [tabCounts]);

  return {
    opportunities,
    numberOpportunitiesInProgess,
    opportunitiesDefaultFilters,
    candidateId,
    isDataLoading,
    candidate,
  };
};
