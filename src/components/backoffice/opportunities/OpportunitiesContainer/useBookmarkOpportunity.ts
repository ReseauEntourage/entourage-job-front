import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Api } from 'src/api';
import { useCandidateId } from 'src/hooks/queryParams/useCandidateId';
import { notificationsActions } from 'src/use-cases/notifications';

export function useBookmarkOpportunity(opportunityId, opportunityUsersProp) {
  const [opportunityUsers, setOpportunityUsers] =
    useState(opportunityUsersProp);

  const candidateId = useCandidateId();

  const dispatch = useDispatch();

  useEffect(() => {
    setOpportunityUsers(opportunityUsersProp);
  }, [opportunityUsersProp]);

  const bookmarkOpportunity = useCallback(async () => {
    try {
      let opportunityUser = opportunityUsers;
      if (!opportunityUser) {
        ({ data: opportunityUser } = await Api.postJoinOpportunity({
          opportunityId,
          candidateId,
        }));
      }
      const { data: updatedOpportunityUsers } = await Api.putJoinOpportunity({
        ...opportunityUser,
        bookmarked: !opportunityUser.bookmarked,
      });

      setOpportunityUsers(updatedOpportunityUsers);
    } catch (err) {
      console.error(err);
      dispatch(
        notificationsActions.addNotification({
          type: 'danger',
          message:
            "Une erreur s'est produite lors de l'ajout de l'offre aux favoris",
        })
      );
    }
  }, [candidateId, opportunityId, dispatch, opportunityUsers]);

  return { opportunityUsers, bookmarkOpportunity };
}
