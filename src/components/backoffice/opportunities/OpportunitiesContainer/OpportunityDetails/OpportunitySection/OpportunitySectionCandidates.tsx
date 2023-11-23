import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import UIkit from 'uikit';
import { ActionLabel } from '../../ActionLabel/ActionLabel';
import { Api } from 'src/api';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { Icon } from 'src/components/utils';
import { OFFER_STATUS } from 'src/constants';
import {
  StyledOpportunitySectionCandidateLi,
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
  const {
    query: { memberId: candidateId },
  } = useRouter();

  const handleSelect = async (e, OpportunityId, UserId) => {
    try {
      await Api.putJoinOpportunity({
        status: e.target.value,
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

        return (
          <StyledOpportunitySectionCandidateLi
            className={user.id === candidateId ? 'orange' : ''}
          >
            {user.id === candidateId ? (
              <span>
                {user?.firstName} {user?.lastName}
              </span>
            ) : (
              <Link href={`/backoffice/admin/membres/${user.id}`}>
                <span>
                  {user?.firstName} {user?.lastName}
                </span>
              </Link>
            )}
            <StyledOpportunitySectionCandidateSelect
              onChange={(e) => {
                handleSelect(e, opportunity.id, user.id);
              }}
            >
              {OFFER_STATUS.map((offerStatus) => {
                return (
                  <option
                    value={offerStatus.value}
                    selected={offerStatus.value === status}
                  >
                    {offerStatus.label}
                  </option>
                );
              })}
            </StyledOpportunitySectionCandidateSelect>
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
          </StyledOpportunitySectionCandidateLi>
        );
      })}
    </StyledOpportunitySectionList>
  );
};
