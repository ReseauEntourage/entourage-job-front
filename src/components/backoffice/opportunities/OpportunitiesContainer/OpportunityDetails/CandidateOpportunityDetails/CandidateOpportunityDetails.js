import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { BUSINESS_LINES } from 'src/constants';
import ContractLabel from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import {
  StyledCTAContainer,
  StyledDetailsContainer,
  StyledDetailsContentContainer,
  StyledInfoContainer,
  StyledRightContainer,
  StyledTitleContainer,
  StyledTopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import OpportunitySection from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunitySection';
import ActionLabels from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { useBookmarkOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useBookmarkOpportunity';
import {
  InfoText,
  RightAlignText,
  StyledTitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import moment from 'moment';
import { useWindowHeight } from '@react-hook/window-size';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { HEIGHTS } from 'src/constants/styles';
import DetailsProgressBar from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/DetailsProgressBar';
import CandidateOpportunityDetailsCTAs from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs';
import { renderTabFromStatus } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.utils';
import { CTAsByTab } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';
import { tabs } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import { mapEventDateFromStatus } from './CandidateOpportunityDetails.utils';

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
  events,
  createdAt,
  oppRefreshCallback,
}) => {
  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  let currentTab;
  for (let i = 0; i < tabs.length; i += 1) {
    if (tabs[i].status.includes(opportunityUsersProp.status)) {
      currentTab = i;
    }
  }

  const ref = useRef();
  const windowHeight = useWindowHeight();

  const [containerHeight, setContainerHeight] = useState(
    2 * HEIGHTS.SECTION_PADDING
  );

  const event = mapEventDateFromStatus(opportunityUsers.status, events);

  useScrollPosition(
    ({ currPos }) => {
      const bottom =
        windowHeight -
        HEIGHTS.HEADER -
        HEIGHTS.TABS_HEIGHT -
        2 * HEIGHTS.SECTION_PADDING;

      const calculatedContainerHeight = bottom - currPos.y;
      setContainerHeight(
        calculatedContainerHeight < 2 * HEIGHTS.SECTION_PADDING
          ? 2 * HEIGHTS.SECTION_PADDING
          : calculatedContainerHeight
      );
    },
    [windowHeight],
    ref
  );

  return (
    <StyledDetailsContainer ref={ref}>
      <StyledTopContainer>
        <StyledTitleContainer>
          <StyledTitleText>{title}</StyledTitleText>
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
            <StyledInfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledInfoContainer>
          </InfoText>
          <InfoText>{moment(createdAt).format('DD/MM/YYYY')}</InfoText>
        </StyledTitleContainer>
        <StyledRightContainer>
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
          {event && event.date && (
            <InfoText>
              <RightAlignText>{event.label}</RightAlignText>
              <RightAlignText>{event.date}</RightAlignText>
            </InfoText>
          )}
        </StyledRightContainer>
        <DetailsProgressBar
          tab={renderTabFromStatus(
            opportunityUsers.status,
            opportunityUsers.archived
          )}
        />
      </StyledTopContainer>
      {/* check if there are CTAS on the current tab to render ctas container */}
      {CTAsByTab.filter((tab) => {
        return tab.tab === currentTab;
      })[0].ctas.length > 0 && (
        <StyledCTAContainer>
          <CandidateOpportunityDetailsCTAs
            event={event}
            tab={renderTabFromStatus(
              opportunityUsers.status,
              opportunityUsers.archived
            )}
            OpportunityId={id}
            contract={contract}
            isExternal={isExternal}
            oppRefreshCallback={() => {
              oppRefreshCallback();
            }}
            fetchOpportunities={async () => {
              await fetchOpportunities();
            }}
          />
        </StyledCTAContainer>
      )}
      {(companyDescription || description) && (
        <StyledDetailsContentContainer height={containerHeight}>
          {companyDescription && (
            <OpportunitySection
              title="Information sur l'entreprise"
              content={companyDescription}
            />
          )}
          {description && (
            <OpportunitySection
              title="Détail de l'offre"
              content={description}
            />
          )}
        </StyledDetailsContentContainer>
      )}
    </StyledDetailsContainer>
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
  events: [],
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
  events: PropTypes.arrayOf([
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      OpportunityUserId: PropTypes.string.isRequired,
      ContractId: PropTypes.string,
      type: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired,
      contract: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
        updatedAt: PropTypes.string.isRequired,
      }),
    }),
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
  oppRefreshCallback: PropTypes.func.isRequired,
};

export default CandidateOpportunityDetails;
