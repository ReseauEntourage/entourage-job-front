// import { useWindowHeight } from '@react-hook/window-size';
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
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
// import { usePrevious } from 'src/hooks/utils';
import { AdminOpportunityItem } from './AdminOpportunityItem';

interface AdminOpportunitiesListProps {
  opportunities: Partial<AdminOpportunityWithOpportunityUsers>[];
  setOffset: (offset: number) => void;
  selectOpportunity: ({ id }: { id: string }) => void;
}

const uuidValue = uuid();

export const AdminOpportunitiesList = ({
  opportunities,
  setOffset,
  selectOpportunity,
}: AdminOpportunitiesListProps) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  useIsAtBottom(setOffset, opportunities);
  return (
    <StyledListContent data-testid="admin-offer-list-container">
      {opportunities.map((opportunity, index) => {
        return (
          <StyledListItemContainer
            data-testid="admin-offer-list-element"
            key={`${index}-${uuidValue}`}
          >
            <Link
              href={{
                pathname: `/backoffice/admin/offres/${opportunity.id}`,
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
                    selectOpportunity={selectOpportunity}
                  />
                </StyledListItem>
              </StyledLinkCard>
            </Link>
          </StyledListItemContainer>
        );
      })}
    </StyledListContent>
  );
};
