import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { useOpportunityId } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useOpportunityId';
import CandidateOpportunityItem from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem';
import { Button } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { IconNoSSR } from 'src/components/utils/Icon';
import { useOpportunityType } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useOpportunityType';
import { LinkCard, ListContent, ListItem } from '../OpportunitiesList.styles';

const CandidateOpportunitiesList = ({ opportunities, fetchOpportunities }) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();

  const opportunitiesListContent = opportunities.map((opportunity) => {
    return (
      <ListItem
        key={opportunity.id}
        isSelected={opportunityId === opportunity.id}
      >
        <Link
          href={{
            pathname: `/backoffice/candidat/offres/${opportunityType}/${opportunity.id}`,
            query: queryParamsOpportunities,
          }}
          scroll={false}
          shallow
          passHref
          legacyBehavior
        >
          <LinkCard>
            <CandidateOpportunityItem
              id={opportunity.id}
              title={opportunity.title}
              company={opportunity.company}
              description={opportunity.description}
              isPublic={opportunity.isPublic}
              opportunityUsers={opportunity.opportunityUsers}
              businessLines={opportunity.businessLines}
              contract={opportunity.contract}
              startOfContract={opportunity.startOfContract}
              endOfContract={opportunity.endOfContract}
              isExternal={opportunity.isExternal}
              department={opportunity.department}
            />
          </LinkCard>
        </Link>
      </ListItem>
    );
  });

  return (
    <ListContent>
      {opportunitiesListContent}
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
    </ListContent>
  );
};

CandidateOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchOpportunities: PropTypes.func.isRequired,
};

export default CandidateOpportunitiesList;
