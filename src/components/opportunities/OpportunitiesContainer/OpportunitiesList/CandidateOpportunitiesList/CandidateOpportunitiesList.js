import Link from 'next/link';
import React from 'react';
import { useOnScroll } from 'src/hooks/utils/useOnScroll';
import PropTypes from 'prop-types';
import { ListItem, Scroll } from '../OpportunitiesList.styles';

const CandidateOpportunitiesList = ({ opportunities }) => {
  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      // TODO MANAGE PAGINATION
    },
  });

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <ListItem key={opportunity.id}>
        <Link
          as={`/backoffice/admin/offres/${opportunity.id}`}
          href="/backoffice/admin/offres/[offerId]"
          passHref
        >
          {opportunity.title}
        </Link>
      </ListItem>
    );
  });

  return (
    <Scroll onScroll={onScroll}>
      <ul>{opportunitiesListContent}</ul>
    </Scroll>
  );
}

CandidateOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default CandidateOpportunitiesList
