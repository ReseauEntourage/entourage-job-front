import { useCallback, useEffect, useState } from 'react';
import { useCandidateId } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useCandidateId';
import Api from 'src/api/index.ts';
import UIkit from 'uikit';

export function useBookmarkOpportunity(opportunityId, opportunityUsersProp) {
  const [opportunityUsers, setOpportunityUsers] =
    useState(opportunityUsersProp);

  const candidateId = useCandidateId();

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
      UIkit.notification(
        "Une erreur s'est produite lors de l'ajout de l'offre aux favoris",
        'danger'
      );
    }
  }, [candidateId, opportunityId, opportunityUsers]);

  return { opportunityUsers, bookmarkOpportunity };
}
