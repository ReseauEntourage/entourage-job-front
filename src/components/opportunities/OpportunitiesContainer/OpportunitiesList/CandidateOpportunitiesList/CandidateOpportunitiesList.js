import Link from 'next/link';
import React from 'react';
import { useOnScroll } from 'src/hooks/utils/useOnScroll';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/opportunities/useQueryParamsOpportunities';
import { useOpportunityId } from 'src/components/opportunities/OpportunitiesContainer/useOpportunityId';
import CandidateOpportunityItem from 'src/components/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem';
import { Button } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { IconNoSSR } from 'src/components/utils/Icon';
import { ListItem, Scroll } from '../OpportunitiesList.styles';

const CandidateOpportunitiesList = ({ opportunities, fetchOpportunities }) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();

  const { onScroll } = useOnScroll({
    onScrollBottomEnd: () => {
      console.log('BOTTOM');
      // TODO MANAGE PAGINATION
    },
  });

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <ListItem
        key={opportunity.id}
        isSelected={opportunityId === opportunity.id}
      >
        <Link
          href={{
            pathname: `/backoffice/candidat/offres/${opportunity.id}`,
            query: queryParamsOpportunities,
          }}
          scroll={false}
          shallow
          passHref
        >
          <CandidateOpportunityItem
            title={opportunity.title}
            company={opportunity.company}
            description={opportunity.description}
            date={opportunity.date}
            isValidated={opportunity.isValidated}
            isPublic={opportunity.isPublic}
            opportunityUsers={opportunity.opportunityUsers}
            businessLines={opportunity.businessLines}
            contract={opportunity.contract}
            startOfContract={opportunity.startOfContract}
            endOfContract={opportunity.endOfContract}
            isNew={
              !opportunity.opportunityUsers ||
              !opportunity.opportunityUsers.seen
            }
            isExternal={opportunity.isExternal}
            archived={
              opportunity.opportunityUsers &&
              opportunity.opportunityUsers.archived
            }
            bookmarked={
              opportunity.opportunityUsers &&
              opportunity.opportunityUsers.bookmarked
            }
            recommended={
              opportunity.opportunityUsers &&
              opportunity.opportunityUsers.recommended
            }
            department={opportunity.department}
          />
        </Link>
      </ListItem>
    );
  });

  return (
    <Scroll onScroll={onScroll}>
      {opportunitiesListContent}{' '}
      <Button
        style="primary"
        color="primaryOrange"
        dataTestId="candidat-add-offer"
        onClick={() => {
          openModal(
            <ModalExternalOffer fetchOpportunities={fetchOpportunities} />
          );
        }}
      >
        <IconNoSSR name="plus" ratio="0.8" className="uk-margin-small-right" />
        Ajouter une offre externe
      </Button>
    </Scroll>
  );
};

CandidateOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchOpportunities: PropTypes.func.isRequired,
};

export default CandidateOpportunitiesList;
