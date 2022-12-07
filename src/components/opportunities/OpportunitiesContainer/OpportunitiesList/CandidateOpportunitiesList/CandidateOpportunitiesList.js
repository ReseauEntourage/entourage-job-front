import Link from 'next/link';
import React from 'react';
import { useOnScroll } from 'src/hooks/utils/useOnScroll';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/opportunities/useQueryParamsOpportunities';
import { ListItem, Scroll } from '../OpportunitiesList.styles';

const CandidateOpportunitiesList = ({ opportunities }) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      console.log('BOTTOM');
      // TODO MANAGE PAGINATION
    },
  });

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <ListItem key={opportunity.id}>
        <Link
          href={{
            pathname: `/backoffice/candidat/offres/${opportunity.id}`,
            query: queryParamsOpportunities,
          }}
          scroll={false}
          shallow
        >
          {opportunity.title}
        </Link>
      </ListItem>
    );
  });

  return <Scroll onScroll={onScroll}>{opportunitiesListContent}</Scroll>;
};

CandidateOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default CandidateOpportunitiesList;
