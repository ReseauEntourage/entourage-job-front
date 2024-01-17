import Link from 'next/link';
import React from 'react';
import UIkit from 'uikit';
import EntourageIcon from 'assets/icons/entourage.svg';
import { Api } from 'src/api';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
import { SelectSimple } from 'src/components/utils/Inputs';
import { OFFER_STATUS } from 'src/constants';
import { useMemberId } from 'src/hooks/queryParams/useMemberId';
import {
  StyledActionLabelContainer,
  StyledOpportunitySectionCandidateLi,
  StyledOpportunitySectionCandidateName,
  StyledOpportunitySectionCandidateSelect,
  StyledOpportunitySectionList,
} from './OpportunitySection.styles';

interface OpportunitySectionCandidatesProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
  oppRefreshCallback: () => void;
}

export const statusToTitle = (status) => {
  // @ts-expect-error after enable TS strict mode. Please, try to fix it
  return OFFER_STATUS.find((offerStatus) => offerStatus.value === status).label;
};

export const OpportunitySectionCandidates = ({
  opportunity,
  oppRefreshCallback,
}: OpportunitySectionCandidatesProps) => {
  const { opportunityUsers } = opportunity;

  // check if we're on a candidate's page
  const candidateId = useMemberId();

  const handleSelect = async (value, OpportunityId, UserId) => {
    try {
      await Api.putJoinOpportunity({
        status: value,
        OpportunityId,
        UserId,
      });
      UIkit.notification('Statut mis à jour', 'success');
      oppRefreshCallback();
    } catch (err) {
      console.error(err);
      return UIkit.notification('Erreur', 'danger');
    }
  };

  return (
    <StyledOpportunitySectionList>
      {opportunityUsers.map((opportunityUser) => {
        const { recommended, user, status } = opportunityUser;
        if (user) {
          return (
            <StyledOpportunitySectionCandidateLi
              key={user.id}
              className={user.id === candidateId ? 'orange' : ''}
            >
              <StyledOpportunitySectionCandidateName>
                {user.id === candidateId ? (
                  <span>
                    {user.firstName} {user.lastName}
                  </span>
                ) : (
                  <Link href={`/backoffice/admin/membres/${user.id}`}>
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </Link>
                )}
              </StyledOpportunitySectionCandidateName>
              <StyledActionLabelContainer>
                {recommended && (
                  <ActionLabel
                    disabled
                    color="primaryOrange"
                    label="Recommandé"
                    icon={<EntourageIcon height={16} width={10} />}
                  />
                )}
              </StyledActionLabelContainer>
              <StyledOpportunitySectionCandidateSelect>
                <SelectSimple
                  options={OFFER_STATUS}
                  id="user-opportunity-status"
                  name="user-opportunity-status"
                  title="Statut"
                  showLabel={false}
                  value={status}
                  onChange={(value) =>
                    handleSelect(value, opportunity.id, user.id)
                  }
                />
              </StyledOpportunitySectionCandidateSelect>
            </StyledOpportunitySectionCandidateLi>
          );
        }
        return null;
      })}
    </StyledOpportunitySectionList>
  );
};
