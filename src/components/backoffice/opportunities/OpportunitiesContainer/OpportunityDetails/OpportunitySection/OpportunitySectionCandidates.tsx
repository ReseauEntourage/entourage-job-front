import React from 'react';
import { ActionLabel } from '../../ActionLabel/ActionLabel';
import {
  AdminOpportunityWithOpportunityUsers,
  UserCandidateWithUsers,
} from 'src/api/types';
import { Icon } from 'src/components/utils';
import { StyledOpportunitySectionList } from './OpportunitySection.styles';

interface OpportunitySectionCandidatesProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
}

const CANDIDATE_OPPORTUNITY_TITLES = {
  A_TRAITER: 'A traiter',
  CONTACTEE: 'Contactée',
  ENTRETIEN: "En phase d'entretien",
  ABANDONNEE: 'Abandonnée',
  ACCEPTEE: 'Acceptée',
};

const statusToTitle = (status) => {
  const titles = {
    '-1': CANDIDATE_OPPORTUNITY_TITLES.A_TRAITER,
    '0': CANDIDATE_OPPORTUNITY_TITLES.CONTACTEE,
    '1': CANDIDATE_OPPORTUNITY_TITLES.ENTRETIEN,
    '2': CANDIDATE_OPPORTUNITY_TITLES.ABANDONNEE,
    '3': CANDIDATE_OPPORTUNITY_TITLES.ACCEPTEE,
  };
  return titles[status.toString()];
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
