import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQueryParamsOpportunities } from 'src/components/backoffice/opportunities/useQueryParamsOpportunities';
import { useOpportunityId } from 'src/components/backoffice/opportunities/useOpportunityId';
import CandidateOpportunityItem from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/CandidateOpportunitiesList/CandidateOpportunityItem';
import { Button } from 'src/components/utils';
import { openModal } from 'src/components/modals/Modal';
import ModalExternalOffer from 'src/components/modals/Modal/ModalGeneric/OfferModals/ModalOffer/ModalExternalOffer';
import { IconNoSSR } from 'src/components/utils/Icon';
import { useOpportunityType } from 'src/components/backoffice/opportunities/useOpportunityType';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import { usePrevious } from 'src/hooks/utils';
import { LinkCard, ListContent, ListItem } from '../OpportunitiesList.styles';

const CandidateOpportunitiesList = ({
  opportunities,
  fetchOpportunities,
  setOffset,
}) => {
  const queryParamsOpportunities = useQueryParamsOpportunities();
  const opportunityId = useOpportunityId();
  const opportunityType = useOpportunityType();

  const [isAtBottom, setIsAtBottom] = useState(false);
  const windowHeight = useWindowHeight();

  const prevIsAtBottom = usePrevious(isAtBottom);

  useEffect(() => {
    if (isAtBottom && isAtBottom !== prevIsAtBottom) {
      setOffset((prevOffset) => {
        return prevOffset + 1;
      });
    }
  }, [setOffset, isAtBottom, prevIsAtBottom]);

  useScrollPosition(
    ({ currPos }) => {
      if (
        !isAtBottom &&
        currPos.y * -1 === document.body.offsetHeight - windowHeight
      ) {
        setIsAtBottom(true);
      } else {
        setIsAtBottom(false);
      }
    },
    [windowHeight]
  );

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
      {opportunityType === 'private' && (
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
          <IconNoSSR
            name="plus"
            ratio="0.8"
            className="uk-margin-small-right"
          />
          Ajouter une offre externe
        </Button>
      )}
    </ListContent>
  );
};

CandidateOpportunitiesList.propTypes = {
  opportunities: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fetchOpportunities: PropTypes.func.isRequired,
  setOffset: PropTypes.func.isRequired,
};

export default CandidateOpportunitiesList;
