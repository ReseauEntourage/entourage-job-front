import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities.ts';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId.ts';

import {
  StyledLinkCard,
  StyledListContent,
  StyledListItem,
} from '../OpportunitiesList.styles';

const AdminOpportunitiesList = ({ opportunities }) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();

  /* const opportunityUsers =
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
      }; */

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <StyledListItem
        key={opportunity.id}
        isSelected={opportunityId === opportunity.id}
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
            {/* <OfferCard
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
            /> */}
          </StyledLinkCard>
        </Link>
      </StyledListItem>
    );
  });

  return <StyledListContent>{opportunitiesListContent}</StyledListContent>;
};

AdminOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default AdminOpportunitiesList;
