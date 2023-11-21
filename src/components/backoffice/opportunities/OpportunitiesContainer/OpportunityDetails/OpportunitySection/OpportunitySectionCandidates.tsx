import React from 'react';
import { ActionLabel } from '../../ActionLabel/ActionLabel';
import {
  AdminOpportunityWithOpportunityUsers,
  UserCandidateWithUsers,
} from 'src/api/types';
import { Icon } from 'src/components/utils';
import { OFFER_STATUS } from 'src/constants';
import { StyledOpportunitySectionList } from './OpportunitySection.styles';

interface OpportunitySectionCandidatesProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
}

const statusToTitle = (status) => {
  return OFFER_STATUS.find((offerStatus) => offerStatus.value === status).label;
};

export const OpportunitySectionCandidates = ({
  opportunity,
}: OpportunitySectionCandidatesProps) => {
  const { opportunityUsers } = opportunity;
  return (
    <StyledOpportunitySectionList>
      {opportunityUsers.map((opportunityUser) => {
        const { recommended, user, status } = opportunityUser;

        const userInfo = user as UserCandidateWithUsers;

        return (
          <li>
            <span>
              {userInfo?.firstName} {userInfo?.lastName}
            </span>
            <span>{statusToTitle(status)}</span>
            <span>
              {recommended && (
                <ActionLabel
                  disabled
                  fill
                  color="primaryOrange"
                  label="Recommandé"
                  icon={<Icon name="entourage" ratio={0.8} />}
                />
              )}
            </span>
          </li>
        );
      })}
    </StyledOpportunitySectionList>
  );
};
