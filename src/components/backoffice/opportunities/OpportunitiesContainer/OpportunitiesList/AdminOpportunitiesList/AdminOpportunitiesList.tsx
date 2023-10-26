// import { useWindowHeight } from '@react-hook/window-size';
import Link from 'next/link';
import React from 'react';
import { v4 as uuid } from 'uuid';
import { useOpportunityId } from '../../../useOpportunityId';
import { useQueryParamsOpportunities } from '../../../useQueryParamsOpportunities';
import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
  StyledListItemContainer,
} from '../OpportunitiesList.styles';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
// import { usePrevious } from 'src/hooks/utils';
import { AdminOpportunityItem } from './AdminOpportunityItem';

interface AdminOpportunitiesListProps {
  opportunities: Partial<AdminOpportunityWithOpportunityUsers>[];
  // fetchOpportunities: () => void;
  // setOffset: Dispatch<SetStateAction<number>>;
  // hasFetchedAll: boolean;
}

const uuidValue = uuid();

export const AdminOpportunitiesList = ({
  opportunities,
}: // fetchOpportunities,
// setOffset,
// hasFetchedAll,
AdminOpportunitiesListProps) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  // const [isAtBottom, setIsAtBottom] = useState(false);
  // const windowHeight = useWindowHeight();
  // const prevIsAtBottom = usePrevious(isAtBottom);
  // const prevOpportunitiesLength = usePrevious(opportunities.length);

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
                    title={opportunity.title}
                    company={opportunity.company}
                    description={opportunity.description}
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
      })}
    </StyledListContent>
  );
};
