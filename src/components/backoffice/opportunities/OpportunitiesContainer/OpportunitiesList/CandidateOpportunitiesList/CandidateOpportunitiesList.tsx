import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import Link from 'next/link';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
  StyledListItemContainer,
} from '../OpportunitiesList.styles';
import { OpportunityWithOpportunityUsers } from 'src/api/types';
import CandidateOpportunityItem from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { openModal } from 'src/components/modals/Modal';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { Button } from 'src/components/utils';
import { IconNoSSR } from 'src/components/utils/Icon';
import { usePrevious } from 'src/hooks/utils';

const uuidValue = uuid();

interface CandidateOpportunitiesListProps {
  opportunities: Partial<OpportunityWithOpportunityUsers>[];
  fetchOpportunities: () => void;
  setOffset: Dispatch<SetStateAction<number>>;
  hasFetchedAll: boolean;
  candidateId: string;
}

const CandidateOpportunitiesList = ({
  opportunities,
  fetchOpportunities,
  setOffset,
  hasFetchedAll,
  candidateId,
}: CandidateOpportunitiesListProps) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();

  const [isAtBottom, setIsAtBottom] = useState(false);
  const windowHeight = useWindowHeight();

  const prevIsAtBottom = usePrevious(isAtBottom);

  const prevOpportunitiesLength = usePrevious(opportunities.length);

  useEffect(() => {
    if (isAtBottom && isAtBottom !== prevIsAtBottom) {
      setOffset((prevOffset) => {
        return prevOffset + 1;
      });
    }
  }, [
    setOffset,
    isAtBottom,
    prevIsAtBottom,
    opportunities.length,
    prevOpportunitiesLength,
  ]);

  useScrollPosition(
    ({ currPos }) => {
      if (
        !isAtBottom &&
        currPos.y * -1 === document.body.offsetHeight - windowHeight
      ) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    },
    [windowHeight]
  );

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
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Ajouter une offre externe
        </Button>
      )}
    </StyledListContent>
  );
};

export default CandidateOpportunitiesList;
