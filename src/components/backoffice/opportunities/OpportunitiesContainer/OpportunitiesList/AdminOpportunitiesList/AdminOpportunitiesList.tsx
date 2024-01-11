import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { v4 as uuid } from 'uuid';
import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
  StyledListItemContainer,
} from '../OpportunitiesList.styles';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { useIsAtBottom } from 'src/hooks/useIsAtBottom';
import { AdminOpportunityItem } from './AdminOpportunityItem';

interface AdminOpportunitiesListProps {
  opportunities: Partial<AdminOpportunityWithOpportunityUsers>[];
  setOffset?: (offset: ((prevOffset: number) => number) | number) => void;
  selectOpportunity?: ({ id }: { id: string }) => void;
  isOpportunitySelected?: ({ id }: { id: string }) => boolean;
}

const uuidValue = uuid();

export const AdminOpportunitiesList = ({
  opportunities,
  setOffset,
  selectOpportunity,
  isOpportunitySelected,
}: AdminOpportunitiesListProps) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  useIsAtBottom(setOffset);

  // if candidate Id exists in query params, it means we are on the candidate list page
  const {
    query: { memberId: candidateId },
  } = useRouter();

  const opportunitiesListContent = opportunities.map((opportunity, index) => {
    return (
      <StyledListItemContainer
        data-testid="admin-offer-list-element"
        key={`${index}-${uuidValue}`}
      >
        <Link
          href={{
            pathname: candidateId
              ? `/backoffice/admin/membres/${candidateId}/offres/${opportunity.id}`
              : `/backoffice/admin/offres/${opportunity.id}`,
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
              <AdminOpportunityItem
                id={opportunity.id}
                title={opportunity.title}
                company={opportunity.company}
                description={opportunity.description}
                businessLines={opportunity.businessLines}
                contract={opportunity.contract}
                startOfContract={opportunity.startOfContract}
                endOfContract={opportunity.endOfContract}
                isExternal={opportunity.isExternal}
                department={opportunity.department}
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                selectOpportunity={selectOpportunity}
                isSelected={
                  isOpportunitySelected &&
                  isOpportunitySelected({
                    // @ts-expect-error after enable TS strict mode. Please, try to fix it
                    id: opportunity.id,
                  })
                }
                opportunityUsers={opportunity.opportunityUsers}
              />
            </StyledListItem>
          </StyledLinkCard>
        </Link>
      </StyledListItemContainer>
    );
  });

  return (
    <StyledListContent data-testid="admin-offer-list-container">
      {opportunitiesListContent}
    </StyledListContent>
  );
};
