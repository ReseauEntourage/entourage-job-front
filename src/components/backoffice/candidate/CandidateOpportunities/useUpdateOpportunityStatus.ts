import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { OFFER_STATUS } from 'src/constants';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';

import { usePrevious } from 'src/hooks/utils';
import { notificationsActions } from 'src/use-cases/notifications';

export function useUpdateOpportunityStatus() {
  const {
    replace,
    pathname,
    query: { updateStatus: updateStatusFromQuery, ...restQuery },
  } = useRouter();

  const candidateId = useCandidateId();
  const opportunityId = useOpportunityId();

  const updateStatus = updateStatusFromQuery as string;

  const prevUpdateStatus = usePrevious(updateStatus);

  const dispatch = useDispatch();

  useEffect(() => {
    const archiveOffer = async () => {
      await Api.putJoinOpportunity({
        OpportunityId: opportunityId,
        UserId: candidateId,
        archived: true,
        status: OFFER_STATUS[4].value,
      });
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: "L'offre a été archivée",
        })
      );
    };

    const updateStatusOffer = async (newStatus) => {
      await Api.putJoinOpportunity({
        OpportunityId: opportunityId,
        UserId: candidateId,
        archived: false,
        status: newStatus,
      });
      dispatch(
        notificationsActions.addNotification({
          type: 'success',
          message: "Le statut de l'offre a été mis à jour",
        })
      );
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
    dispatch,
  ]);
}
