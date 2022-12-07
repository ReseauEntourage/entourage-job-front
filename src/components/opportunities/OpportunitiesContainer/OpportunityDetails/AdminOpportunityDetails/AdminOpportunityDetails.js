import ModalOfferAdmin from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOfferAdmin';
import React from 'react';
import PropTypes from 'prop-types';

const AdminOpportunityDetails = ({ opportunity, fetchOpportunities }) => {
  return (
    <ModalOfferAdmin
      currentOffer={opportunity}
      onOfferUpdated={fetchOpportunities}
    />
  );
};

AdminOpportunityDetails.propTypes = {
  fetchOpportunities: PropTypes.func.isRequired,
  opportunity: PropTypes.shape({}).isRequired,
};

export default AdminOpportunityDetails;
