import { ModalOffer } from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer';
import React from 'react';
import PropTypes from 'prop-types';

const CandidateOpportunityDetails = ({ opportunity, fetchOpportunities }) => {
  return (
    <ModalOffer
      currentOffer={opportunity}
      onOfferUpdated={fetchOpportunities}
    />
  );
};

CandidateOpportunityDetails.propTypes = {
  fetchOpportunities: PropTypes.func.isRequired,
  opportunity: PropTypes.shape({}).isRequired,
};

export default CandidateOpportunityDetails;
