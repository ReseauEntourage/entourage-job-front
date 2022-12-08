import Link from 'next/link';
import React from 'react';
import { useOnScroll } from 'src/hooks/utils/useOnScroll';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/opportunities/useQueryParamsOpportunities';
import { ListItem, Scroll } from '../OpportunitiesList.styles';
import OfferCard from "src/components/cards/OfferCard";
import {
  useOpportunityId
} from "src/components/opportunities/OpportunitiesContainer/useOpportunityId";

const AdminOpportunitiesList = ({ opportunities }) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      console.log('BOTTOM');
      // TODO MANAGE PAGINATION
    },
  });

  const opportunityUsers =
    role === 'candidateAsAdmin'
      ? getOpportunityUserFromOffer(offer, candidateId)
      : offer.opportunityUsers;

  const isSelected = isElementSelected(offer);

  const linkPropsDependingOnMode = selectionModeActivated
    ? {
      isExternal: true,
      onClick: () => {
        selectElement(offer);
      },
    }
    : {
      href: {
        pathname: `${currentPath}/${offer.id}`,
        query,
      },
    };

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <ListItem key={opportunity.id} isSelected={opportunityId === opportunity.id}>
        <Link
          href={{
            pathname: `/backoffice/admin/offres/${opportunity.id}`,
            query: queryParamsOpportunities,
          }}
          scroll={false}
          shallow
        >
          <OfferCard
            title={opportunity.title}
            from={opportunity.recruiterName}
            shortDescription={opportunity.company}
            date={opportunity.date}
            archived={opportunity.isArchived}
            isPublic={opportunity.isPublic}
            isValidated={opportunity.isValidated}
            department={opportunity.department}
            opportunityUsers={opportunityUsers}
            isExternal={opportunity.isExternal}
            isNew={
              role === 'candidateAsAdmin' &&
              opportunityUsers &&
              !opportunityUsers.seen
            }
            isAdmin
            isSelected={isSelected}
          />
        </Link>
      </ListItem>
    );
  });

  return <Scroll onScroll={onScroll}>{opportunitiesListContent}</Scroll>;
};

AdminOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AdminOpportunitiesList;
