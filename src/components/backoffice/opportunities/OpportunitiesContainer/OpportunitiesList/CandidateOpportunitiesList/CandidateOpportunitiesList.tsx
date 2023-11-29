import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
  StyledListItemContainer,
} from '../OpportunitiesList.styles';
import { useIsAtBottom } from '../useIsAtBottom';
import { OpportunityWithOpportunityUsers } from 'src/api/types';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { Button, Icon } from 'src/components/utils';
import { CandidateOpportunityItem } from './CandidateOpportunityItem';

const uuidValue = uuid();

interface CandidateOpportunitiesListProps {
  opportunities: Partial<OpportunityWithOpportunityUsers>[];
  fetchOpportunities: () => void;
  setOffset: (offset: number) => void;
  hasFetchedAll: boolean;
  candidateId: string;
}

export const CandidateOpportunitiesList = ({
  opportunities,
  fetchOpportunities,
  setOffset,
  hasFetchedAll,
  candidateId,
}: CandidateOpportunitiesListProps) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();
  useIsAtBottom(setOffset, opportunities);

  const opportunitiesListContent = opportunities.map((opportunity, index) => {
    return (
      <StyledListItemContainer
        data-testid="candidat-offer-list-element"
        key={`${index}-${uuidValue}`}
      >
        <Link
          href={{
            pathname: `/backoffice/candidat/${candidateId}/offres/${opportunityType}/${opportunity.id}`,
            query: queryParamsOpportunities,
          }}
          scroll={false}
          shallow
          passHref
          legacyBehavior
        >
          <StyledLinkCard>
            <StyledListItem
              key={opportunity.id}
              isSelected={opportunityId === opportunity.id}
            >
              <CandidateOpportunityItem
                id={opportunity.id}
                title={opportunity.title}
                company={opportunity.company}
                description={opportunity.description}
                isPublic={opportunity.isPublic}
                opportunityUsers={opportunity.opportunityUsers}
                businessLines={opportunity.businessLines}
                contract={opportunity.contract}
                startOfContract={opportunity.startOfContract}
                endOfContract={opportunity.endOfContract}
                isExternal={opportunity.isExternal}
                department={opportunity.department}
              />
            </StyledListItem>
          </StyledLinkCard>
        </Link>
      </StyledListItemContainer>
    );
  });

  return (
    <StyledListContent data-testid="candidat-offer-list-container">
      {opportunitiesListContent}
      {opportunityType === 'private' && hasFetchedAll && (
        <Button
          style="primary"
          color="primaryOrange"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalExternalOffer
                fetchOpportunities={fetchOpportunities}
                candidateId={candidateId}
              />
            );
          }}
        >
          <Icon name="plus" ratio="0.8" className="uk-margin-small-right" />
          Ajouter une offre externe
        </Button>
      )}
    </StyledListContent>
  );
};
