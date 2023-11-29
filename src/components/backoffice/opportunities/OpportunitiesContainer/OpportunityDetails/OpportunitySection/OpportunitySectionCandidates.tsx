import Link from 'next/link';
import React from 'react';
import UIkit from 'uikit';
import { Api } from 'src/api';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { useMemberId } from 'src/components/backoffice/admin/members/MemberDetails/useMemberId';
import { ActionLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
import { Icon } from 'src/components/utils';
import { SelectSimple } from 'src/components/utils/Inputs';
import { OFFER_STATUS } from 'src/constants';
import {
  StyledActionLabelContainer,
  StyledOpportunitySectionCandidateLi,
  StyledOpportunitySectionCandidateName,
  StyledOpportunitySectionCandidateSelect,
  StyledOpportunitySectionList,
} from './OpportunitySection.styles';

interface OpportunitySectionCandidatesProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
}

export const statusToTitle = (status) => {
  return OFFER_STATUS.find((offerStatus) => offerStatus.value === status).label;
};

export const OpportunitySectionCandidates = ({
  opportunity,
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
      return UIkit.notification('Statut mis à jour', 'success');
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
                    fill
                    color="primaryOrange"
                    label="Recommandé"
                    icon={<Icon name="entourage" ratio={0.8} />}
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
