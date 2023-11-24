import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useOpportunityDetailsHeight } from '../useOpportunityDetailsHeight';
import { OpportunityWithOpportunityUsers, Event } from 'src/api/types';
import { tabs } from 'src/components/backoffice/candidate/CandidateOpportunities/CandidateOffersTab/CandidateOffersTab.utils';
import { ActionLabelContainer as ActionLabels } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import {
  InfoText,
  RightAlignText,
  StyledTitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { renderTabFromStatus } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.utils';
import { DetailsProgressBar } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/CandidateOpportunityDetails/DetailsProgressBar';
import {
  StyledOpportunityDetailsCTAContainer,
  StyledOpportunityDetailsContainer,
  StyledOpportunityDetailsDetailsContentContainer,
  StyledOpportunityDetailsInfoContainer,
  StyledOpportunityDetailsRightContainer,
  StyledOpportunityDetailsTitleContainer,
  StyledOpportunityDetailsTopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { OpportunitySection } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunitySection';
import { useBookmarkOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useBookmarkOpportunity';
import { BUSINESS_LINES } from 'src/constants';
import { HEIGHTS } from 'src/constants/styles';
import { findConstantFromValue } from 'src/utils/Finding';
import { mapEventDateFromStatus } from './CandidateOpportunityDetails.utils';
import { CandidateOpportunityDetailsCTAs } from './CandidateOpportunityDetailsCTAs';
import { CTAsByTab } from './CandidateOpportunityDetailsCTAs/CandidateOpportunityDetailsCTAs.utils';

interface CandidateOpportunityDetailsProps
  extends Partial<OpportunityWithOpportunityUsers> {
  fetchOpportunities: () => void;
  candidateId: string;
  oppRefreshCallback: () => void;
  events?: Event[];
  createdAt: string;
}

export const CandidateOpportunityDetails = ({
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
  events = [],
  createdAt,
  oppRefreshCallback,
  candidateId,
}: CandidateOpportunityDetailsProps) => {
  const ref = useRef();

  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  const [hasCTAContainer, setHasCTAContainer] = useState(true);

  useEffect(() => {
    const index = tabs.findIndex(
      ({ status }: { status: (string | number)[] }) => {
        if (opportunityUsers.archived) {
          return status.includes('archived');
        }
        return status.includes(opportunityUsers.status);
      }
    );

    const hasCTAs =
      CTAsByTab.find((tab) => {
        return tab.tab === index;
      }).ctas.length > 0;

    setHasCTAContainer(hasCTAs);
  }, [hasCTAContainer, opportunityUsers.archived, opportunityUsers.status]);

  const event = mapEventDateFromStatus(opportunityUsers.status, events);

  const { containerHeight } = useOpportunityDetailsHeight(
    HEIGHTS.TABS_HEIGHT,
    ref,
    hasCTAContainer
  );

  return (
    <StyledOpportunityDetailsContainer
      ref={ref}
      data-testid="candidat-offer-details"
    >
      <StyledOpportunityDetailsTopContainer>
        <StyledOpportunityDetailsTitleContainer>
          <StyledTitleText data-testid="candidat-offer-details-title">
            {title}
          </StyledTitleText>
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
            <StyledOpportunityDetailsInfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledOpportunityDetailsInfoContainer>
          </InfoText>
          <InfoText>{moment(createdAt).format('DD/MM/YYYY')}</InfoText>
        </StyledOpportunityDetailsTitleContainer>
        <StyledOpportunityDetailsRightContainer>
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
        </StyledOpportunityDetailsRightContainer>
        <DetailsProgressBar
          tab={renderTabFromStatus(
            opportunityUsers.status,
            opportunityUsers.archived
          )}
          noProcess={
            _.isNil(opportunityUsers.status) ||
            (opportunityUsers.status === -1 &&
              isPublic &&
              !opportunityUsers.bookmarked &&
              !opportunityUsers.recommended &&
              !opportunityUsers.archived)
          }
        />
      </StyledOpportunityDetailsTopContainer>
      {/* check if there are CTAS on the current tab to render ctas container */}
      {hasCTAContainer && (
        <StyledOpportunityDetailsCTAContainer>
          <CandidateOpportunityDetailsCTAs
            event={event}
            candidateId={candidateId}
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
        </StyledOpportunityDetailsCTAContainer>
      )}
      {(companyDescription || description) && (
        <StyledOpportunityDetailsDetailsContentContainer
          height={containerHeight === 0 ? '100%' : containerHeight}
        >
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
        </StyledOpportunityDetailsDetailsContentContainer>
      )}
    </StyledOpportunityDetailsContainer>
    /* <ModalOffer
      currentOffer={opportunity}
      onOfferUpdated={fetchOpportunities}
    /> */
  );
};
