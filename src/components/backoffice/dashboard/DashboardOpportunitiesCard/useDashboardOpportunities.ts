import { ParsedUrlQueryInput } from "querystring";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { User } from "src/api/types";
import { ReduxRequestEvents } from "src/constants";
import { usePrevious } from "src/hooks/utils";
import { fetchOpportunitiesSelectors, fetchOpportunitiesTabCountsSelectors, opportunitiesActions, selectOpportunities, selectOpportunitiesTabCounts } from "src/use-cases/opportunities";
import { fetchProfilesSelectors, fetchSelectedProfileSelectors, profilesActions, selectSelectedProfile } from "src/use-cases/profiles";
import { getCandidateIdFromCoachOrCandidate, getUserCandidateFromCoachOrCandidate } from 'src/utils';
import UIkit from 'uikit';




export const useDashboardOpportunities = (
    user: User,
) => {
    const candidate = getUserCandidateFromCoachOrCandidate(user);
    const candidateId = getCandidateIdFromCoachOrCandidate(user);
    const opportunities = useSelector(selectOpportunities);
    const tabCounts = useSelector(selectOpportunitiesTabCounts)
    const userCandidateProfile = useSelector(selectSelectedProfile);

    const [ isDataLoading, setIsDataLoading ] = useState<boolean>(true);
    const [ opportunitiesDefaultFilters, setOpportunitiesDefaultFilter ] = useState<string | ParsedUrlQueryInput | null | undefined>();
    const dispatch = useDispatch();

    const fetchSelectedProfileStatus = useSelector(fetchSelectedProfileSelectors.selectFetchSelectedProfileStatus);
    const prevFetchSelectedProfileStatus = usePrevious(fetchSelectedProfileStatus);

    console.log(candidate);
    // useEffect(() => {
    //     if (prevFetchSelectedProfileStatus === ReduxRequestEvents.REQUESTED) {
    //         if (fetchSelectedProfileStatus === ReduxRequestEvents.SUCCEEDED) {
    //             setIsDataLoading(false);
    //         }
    //         if (fetchSelectedProfileStatus === ReduxRequestEvents.FAILED) {
    //             UIkit.notification('Une erreur est survenue', 'danger');
    //           }
    //         dispatch(profilesActions.fetchSelectedProfileReset());
    //     }
    // }, [fetchSelectedProfileStatus, prevFetchSelectedProfileStatus])
    // useEffect(() => {
    //     if (candidateId) {
    //         dispatch(profilesActions.fetchSelectedProfileRequested({userId: candidateId}));
    //     }
    // }, [candidateId])

    // const fetchOpportunitiesStatus = useSelector(fetchOpportunitiesSelectors.selectFetchOpportunitiesStatus);
    // const prevFetchOpportunitiesStatus = usePrevious(fetchOpportunitiesStatus)
    // useEffect(() => {
    //     if (prevFetchOpportunitiesStatus === ReduxRequestEvents.REQUESTED) {
    //         if (fetchOpportunitiesStatus === ReduxRequestEvents.SUCCEEDED) {
    //             setIsDataLoading(false);
    //         }
    //         if (fetchOpportunitiesStatus === ReduxRequestEvents.FAILED) {
    //             UIkit.notification('Une erreur est survenue', 'danger');
    //           }
    //         dispatch(opportunitiesActions.fetchOpportunitiesReset());
    //     }
    // }, [fetchOpportunitiesStatus, prevFetchOpportunitiesStatus])

    
    // useEffect(() => {
    //     if (candidate && candidateId && userCandidateProfile) {
    //         dispatch(opportunitiesActions.fetchOpportunitiesTabCountsRequested(candidateId));
    //         dispatch(opportunitiesActions.setOpportunitiesFilter({
    //             candidateId: candidateId,
    //             type: 'public',
    //             department: [userCandidateProfile.department],
    //             limit: 3,
    //             offset: 0,
    //             businessLines: userCandidateProfile.searchBusinessLines.map((businessLine) => businessLine.name),
    //         }));
    //         setOpportunitiesDefaultFilter({
    //                 department: [userCandidateProfile.department],
    //                 limit: 3,
    //                 offset: 0,
    //                 businessLines: userCandidateProfile.searchBusinessLines.map((businessLine) => businessLine.name),
                
    //         });
    //     }
    // }, [dispatch, candidate, candidateId, userCandidateProfile]);


    const [ numberOpportunitiesInProgess, setNumberOpportunitiesInProgress ] = useState<number>()

    // useEffect(() => {
    //     if (tabCounts) {
    //         setNumberOpportunitiesInProgress(tabCounts.find((tabCount) => tabCount.status === -1)?.count)
    //     }
    // }, [tabCounts])

    return {
        opportunities,
        numberOpportunitiesInProgess,
        opportunitiesDefaultFilters,
        candidateId,
        isDataLoading,
    };
}