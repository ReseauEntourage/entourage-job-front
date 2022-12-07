import React, { useContext, useRef } from 'react';
import HeaderBackoffice from 'src/components/headers/HeaderBackoffice';
import { USER_ROLES } from 'src/constants';
import OpportunityList from 'src/components/opportunities/OpportunityList';
import PropTypes from 'prop-types';

import { UserContext } from 'src/components/store/UserProvider';
import { openModal } from 'src/components/modals/Modal';
import { IconNoSSR } from 'src/components/utils/Icon';
import { Button } from 'src/components/utils';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';

const CandidateOpportunityList = ({
  search,
  filters,
  setFilters,
  setSearch,
  resetFilters,
  candidateId,
  tabFilters,
  setTabFilters,
}) => {
  const { user } = useContext(UserContext);
  const opportunityListRef = useRef();

  return (
    <>
      <HeaderBackoffice
        title={
          user.role === USER_ROLES.CANDIDAT
            ? 'Consultez toutes les opportunités de travail'
            : 'Consultez les opportunités de travail du candidat'
        }
        description={
          user.role === USER_ROLES.CANDIDAT
            ? 'Parcourez les offres qui vous sont directement adressées ainsi que celles communes aux différents candidats du parcours LinkedOut.'
            : 'Parcourez les offres qui ont été adressées à votre candidat ainsi que celles communes aux différents candidats du parcours LinkedOut.'
        }
      >
        <Button
          style="primary"
          dataTestId="candidat-add-offer"
          onClick={() => {
            openModal(
              <ModalExternalOffer
                fetchOpportunities={opportunityListRef.current.fetchData}
              />
            );
          }}
        >
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Ajouter une offre externe à LinkedOut
        </Button>
      </HeaderBackoffice>
      <OpportunityList
        ref={opportunityListRef}
        candidateId={candidateId}
        tabFilters={tabFilters}
        setTabFilters={setTabFilters}
        search={search}
        filters={filters}
        resetFilters={resetFilters}
        setSearch={setSearch}
        setFilters={setFilters}
        userRole="candidat"
      />
    </>
  );
};

CandidateOpportunityList.propTypes = {
  candidateId: PropTypes.string.isRequired,
  search: PropTypes.string,
  filters: PropTypes.shape(),
  setFilters: PropTypes.func,
  setSearch: PropTypes.func,
  resetFilters: PropTypes.func,
  tabFilters: PropTypes.arrayOf(PropTypes.shape()),
  setTabFilters: PropTypes.func,
};

CandidateOpportunityList.defaultProps = {
  search: undefined,
  filters: {},
  setFilters: () => {},
  setSearch: () => {},
  resetFilters: () => {},
  tabFilters: {},
  setTabFilters: () => {},
};

export default CandidateOpportunityList;
