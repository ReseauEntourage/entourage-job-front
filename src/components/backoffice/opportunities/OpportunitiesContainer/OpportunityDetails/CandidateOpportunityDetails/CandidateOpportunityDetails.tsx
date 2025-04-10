import moment from 'moment';
import React, { Ref } from 'react';
import { OpportunityWithOpportunityUsers, Event } from 'src/api/types';
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
import { findConstantFromValue } from 'src/utils/Finding';
import { mapEventDateFromStatus } from './CandidateOpportunityDetails.utils';
import { CandidateOpportunityDetailsCTAs } from './CandidateOpportunityDetailsCTAs';

interface CandidateOpportunityDetailsProps
  extends Partial<OpportunityWithOpportunityUsers> {
  fetchOpportunities: () => void;
  candidateId: string;
  oppRefreshCallback: () => void;
  events?: Event[];
  createdAt: string;
  hasCTAContainer: boolean;
  containerHeight: number;
  innerRef: Ref<HTMLElement>;
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
  hasCTAContainer,
  containerHeight,
  innerRef,
}: CandidateOpportunityDetailsProps) => {
  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  const event = mapEventDateFromStatus(opportunityUsers.status, events);

  return (
    <StyledOpportunityDetailsContainer
      ref={innerRef}
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
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            isPublic={isPublic}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
            opportunityUsers.status === null ||
            !!(
              opportunityUsers.status === -1 &&
              isPublic &&
              !opportunityUsers.bookmarked &&
              !opportunityUsers.recommended &&
              !opportunityUsers.archived
            )
          }
        />
      </StyledOpportunityDetailsTopContainer>
      {/* check if there are CTAS on the current tab to render ctas container */}
      {hasCTAContainer && (
        <StyledOpportunityDetailsCTAContainer>
          <CandidateOpportunityDetailsCTAs
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            event={event}
            candidateId={candidateId}
            tab={renderTabFromStatus(
              opportunityUsers.status,
              opportunityUsers.archived
            )}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            OpportunityId={id}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            contract={contract}
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
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
