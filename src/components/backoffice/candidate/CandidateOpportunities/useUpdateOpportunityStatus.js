import { useRouter } from 'next/router';
import { useEffect } from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api/index.ts';
import { useCandidateId } from 'src/components/backoffice/opportunities/useCandidateId.ts';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';

import { OFFER_STATUS } from 'src/constants';
import { usePrevious } from 'src/hooks/utils';

export function useUpdateOpportunityStatus() {
  const {
    replace,
    pathname,
    query: { updateStatus, ...restQuery },
  } = useRouter();

  const candidateId = useCandidateId();
  const opportunityId = useOpportunityId();

  const prevUpdateStatus = usePrevious(updateStatus);

  useEffect(() => {
    const archiveOffer = async () => {
      await Api.putJoinOpportunity({
        OpportunityId: opportunityId,
        UserId: candidateId,
        archived: true,
        status: OFFER_STATUS[4].value,
      });
      UIkit.notification("L'offre a été archivée", 'success');
    };

    const updateStatusOffer = async (newStatus) => {
      await Api.putJoinOpportunity({
        OpportunityId: opportunityId,
        UserId: candidateId,
        archived: false,
        status: newStatus,
      });
      UIkit.notification("Le statut de l'offre a été mis à jour", 'success');
    };

    if (updateStatus && prevUpdateStatus !== updateStatus) {
      const statusAsNumber = parseInt(updateStatus, 10);
      if (statusAsNumber === OFFER_STATUS[4].value) {
        archiveOffer();
      } else {
        updateStatusOffer(statusAsNumber);
      }
      replace(
        {
          pathname,
          query: restQuery,
        },
        undefined,
        { shallow: true }
      );
    }
  }, [
    candidateId,
    opportunityId,
    pathname,
    prevUpdateStatus,
    replace,
    restQuery,
    updateStatus,
  ]);
}
