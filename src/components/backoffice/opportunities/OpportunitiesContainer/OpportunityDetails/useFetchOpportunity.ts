import { useContext, useEffect, useState } from 'react';
import { Api } from 'src/api';
import { OpportunityWithOpportunityUsers } from 'src/api/types';
import { USER_ROLES } from 'src/constants/users';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/store/UserProvider';

export function useFetchOpportunity(
  opportunityId: string,
  candidateId: string,
  fetchOpportunities: () => void
) {
  const { user } = useContext(UserContext);
  const [opportunity, setOpportunity] =
    useState<Partial<OpportunityWithOpportunityUsers>>();
  const [isLoading, setIsLoading] = useState(false);
  const prevOpportunityId = usePrevious(opportunityId);
  const prevCandidateId = usePrevious(candidateId);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchOpportunity() {
      const { data: fetchedOpportunity } = await Api.getOpportunityById(
        opportunityId
      );
      if (user.role === USER_ROLES.COACH_EXTERNAL) {
        const [fetchedOppUser] = fetchedOpportunity.opportunityUsers.filter(
          (oppUser) => {
            return oppUser.UserId === candidateId;
          }
        );
        fetchedOpportunity.opportunityUsers = fetchedOppUser;
      }
      if (
        user.role !== USER_ROLES.ADMIN &&
        candidateId &&
        (!fetchedOpportunity.opportunityUsers ||
          !fetchedOpportunity.opportunityUsers.seen)
      ) {
        const { data: opportunityUsers } = await Api.postJoinOpportunity({
          opportunityId: fetchedOpportunity.id,
          candidateId,
        });
        setOpportunity({ ...fetchedOpportunity, opportunityUsers });
        await fetchOpportunities();
      } else {
        setOpportunity(fetchedOpportunity);
      }
      setIsLoading(false);
      setRefresh(false);
    }

    if (
      opportunityId &&
      (refresh ||
        (opportunityId && opportunityId !== prevOpportunityId) ||
        (candidateId && candidateId !== prevCandidateId))
    ) {
      setIsLoading(true);
      fetchOpportunity();
    }
  }, [
    candidateId,
    opportunity,
    opportunityId,
    prevOpportunityId,
    user.role,
    refresh,
    prevCandidateId,
    fetchOpportunities,
  ]);

  function refreshOpportunity() {
    setRefresh(true);
  }

  return { opportunity, isLoading, refreshOpportunity };
}
