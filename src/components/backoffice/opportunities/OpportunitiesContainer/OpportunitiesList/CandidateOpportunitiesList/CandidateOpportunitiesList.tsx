import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import PlusIcon from 'assets/icons/plus.svg';
import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
  StyledListItemContainer,
} from '../OpportunitiesList.styles';
import { OpportunityWithOpportunityUsers } from 'src/api/types';
import { openModal } from 'src/components/modals/Modal';
import { ModalExternalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { Button } from 'src/components/utils';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useOpportunityType } from 'src/hooks/queryParams/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import { useOpportunityId } from 'src/hooks/queryParams/useOpportunityId';
import { useOpportunityType } from 'src/hooks/queryParams/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/hooks/queryParams/useQueryParamsOpportunities';
import { CandidateOpportunityItem } from './CandidateOpportunityItem';

const uuidValue = uuid();

interface CandidateOpportunitiesListProps {
  opportunities: Partial<OpportunityWithOpportunityUsers>[];
  fetchOpportunities: () => void;
  setOffset: (offset: ((prevOffset: number) => number) | number) => void;
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
  useIsAtBottom(setOffset);

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
          <PlusIcon />
          Ajouter une offre externe
        </Button>
      )}
    </StyledListContent>
  );
};
