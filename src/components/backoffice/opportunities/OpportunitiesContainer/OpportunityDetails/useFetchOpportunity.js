import { useContext, useEffect, useState } from 'react';
import Api from 'src/api/index.ts';
import { usePrevious } from 'src/hooks/utils';
import { UserContext } from 'src/components/store/UserProvider';
import { USER_ROLES } from 'src/constants';

export function useFetchOpportunity(opportunityId, candidateId) {
  const { user } = useContext(UserContext);
  const [opportunity, setOpportunity] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const prevOpportunityId = usePrevious(opportunityId);

  useEffect(() => {
    async function fetchOpportunity() {
      const { data: fetchedOpportunity } = await Api.getOpportunityById(
        opportunityId
      );
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
      } else {
        setOpportunity(fetchedOpportunity);
      }
      setIsLoading(false);
    }

    if (opportunityId && opportunityId !== prevOpportunityId) {
      setIsLoading(true);
      fetchOpportunity();
    }
  }, [candidateId, opportunity, opportunityId, prevOpportunityId, user.role]);

  return { opportunity, isLoading };
}
