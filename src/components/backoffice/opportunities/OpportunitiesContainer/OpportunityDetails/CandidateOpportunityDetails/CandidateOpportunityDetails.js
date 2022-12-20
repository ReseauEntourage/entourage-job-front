import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { BUSINESS_LINES } from 'src/constants';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import {
  ActionContainer,
  DetailsContainer,
  DetailsContentContainer,
  InfoContainer,
  StyledCTAContainer,
  TitleContainer,
  TopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import OpportunitySection from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunitySection';
import ActionLabels from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { useBookmarkOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useBookmarkOpportunity';
import {
  InfoText,
  TitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import moment from 'moment';
import { useWindowHeight } from '@react-hook/window-size';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { HEIGHTS } from 'src/constants/styles';
import DetailsProgressBar from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/DetailsProgressBar';
import CandidateOpportunityDetailsCTAs from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs';
import { renderTabFromStatus } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.utils';

const CandidateOpportunityDetails = ({
  id,
  title,
  company,
  businessLines,
  contract,
  endOfContract,
  startOfContract,
  department,
  companyDescription,
  description,
  opportunityUsers: opportunityUsersProp,
  isPublic,
  isExternal,
  fetchOpportunities,
  createdAt,
}) => {
  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  const ref = useRef();
  const windowHeight = useWindowHeight();

  const [containerHeight, setContainerHeight] = useState(0);

  useScrollPosition(
    ({ currPos }) => {
      const bottom =
        windowHeight -
        HEIGHTS.HEADER -
        HEIGHTS.TABS_HEIGHT -
        2 * HEIGHTS.SECTION_PADDING;

      setContainerHeight(bottom - currPos.y);
    },
    [windowHeight],
    ref
  );

  return (
    <DetailsContainer ref={ref}>
      <TopContainer>
        <TitleContainer>
          <TitleText>{title}</TitleText>
          <InfoText>
            {company}
            {businessLines && businessLines.length > 0 && (
              <>
                &nbsp;-&nbsp;
                {businessLines
                  .map(({ name }) => {
                    return findConstantFromValue(name, BUSINESS_LINES).label;
                  })
                  .join(' | ')}
              </>
            )}
          </InfoText>
          <InfoText>
            <InfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </InfoContainer>
          </InfoText>
          <InfoText>{moment(createdAt).format('DD/MM/YYYY')}</InfoText>
        </TitleContainer>
        <ActionContainer>
          <ActionLabels
            isBookmarked={!!opportunityUsers?.bookmarked}
            isRecommended={!!opportunityUsers?.recommended}
            isPublic={isPublic}
            isExternal={isExternal}
            bookmarkOpportunity={async () => {
              await bookmarkOpportunity();
              await fetchOpportunities();
            }}
          />
        </ActionContainer>
        <DetailsProgressBar
          tab={renderTabFromStatus(
            opportunityUsersProp.status,
            opportunityUsersProp.archived
          )}
        />
      </TopContainer>
      <StyledCTAContainer>
        <CandidateOpportunityDetailsCTAs
          tab={renderTabFromStatus(
            opportunityUsersProp.status,
            opportunityUsersProp.archived
          )}
        />
      </StyledCTAContainer>
      <DetailsContentContainer height={containerHeight}>
        {companyDescription && (
          <OpportunitySection
            title="Information sur l'entreprise"
            content={companyDescription}
          />
        )}
        {description && (
          <OpportunitySection title="Détail de l'offre" content={description} />
        )}
      </DetailsContentContainer>
    </DetailsContainer>
    /* <ModalOffer
      currentOffer={opportunity}
      onOfferUpdated={fetchOpportunities}
    /> */
  );
};

CandidateOpportunityDetails.defaultProps = {
  opportunityUsers: null,
  companyDescription: null,
  businessLines: null,
  fetchOpportunities: () => {},
  contract: null,
  endOfContract: null,
  startOfContract: null,
};

CandidateOpportunityDetails.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  companyDescription: PropTypes.string,
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  opportunityUsers: PropTypes.oneOfType([
    PropTypes.shape({
      status: PropTypes.number,
      bookmarked: PropTypes.bool,
      recommended: PropTypes.bool,
      note: PropTypes.string,
      archived: PropTypes.bool,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.number,
        bookmarked: PropTypes.bool,
        recommended: PropTypes.bool,
        note: PropTypes.string,
        archived: PropTypes.bool,
      })
    ),
  ]),
  department: PropTypes.string.isRequired,
  isPublic: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
  createdAt: PropTypes.string.isRequired,
  businessLines: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      order: PropTypes.number.isRequired,
    })
  ),
  fetchOpportunities: PropTypes.func,
};

export default CandidateOpportunityDetails;
