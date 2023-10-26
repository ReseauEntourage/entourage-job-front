import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { useWindowHeight } from '@react-hook/window-size';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { ContractLabel } from '../../ContractLabel';
import { OpportunitySection } from '../OpportunitySection';
import { StyledOpportunitySectionList } from '../OpportunitySection/OpportunitySection.styles';
import { OpportunitySectionCandidates } from '../OpportunitySection/OpportunitySectionCandidates';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { AdminActionLabelContainer as ActionLabels } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import {
  InfoText,
  StyledTitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  StyledOpportunityDetailsCTAContainer,
  StyledOpportunityDetailsContainer,
  StyledOpportunityDetailsDetailsContentContainer,
  StyledOpportunityDetailsInfoContainer,
  StyledOpportunityDetailsRightContainer,
  StyledOpportunityDetailsTitleContainer,
  StyledOpportunityDetailsTopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunityDetails.styles';
import { BUSINESS_LINES } from 'src/constants';
import { HEIGHTS_ADMIN as HEIGHTS } from 'src/constants/styles';
import { findConstantFromValue } from 'src/utils';
import { AdminOpportunityDetailsCTAs } from './AdminOpportunityDetailsCTAs';

interface AdminOpportunityDetailsProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
  fetchOpportunities: () => void;
  oppRefreshCallback: () => void;
}

export const AdminOpportunityDetails = ({
  opportunity,
  fetchOpportunities,
  oppRefreshCallback,
}: AdminOpportunityDetailsProps) => {
  const {
    // id,
    title,
    workingHours,
    company,
    businessLines,
    contract,
    endOfContract,
    startOfContract,
    department,
    companyDescription,
    description,
    // opportunityUsers: opportunityUsersProp,
    isPublic,
    isExternal,
    createdAt,
    salary,
    recruiterFirstName,
    recruiterMail,
    recruiterName,
    recruiterPhone,
    recruiterPosition,
    otherInfo,
  } = opportunity;

  const ref = useRef();

  const windowHeight = useWindowHeight();

  const [containerHeight, setContainerHeight] = useState(0);

  useScrollPosition(
    ({ currPos }) => {
      const conditionalHeight = HEIGHTS.OFFER_CTA_HEIGHT;
      const bottom =
        windowHeight - HEIGHTS.HEADER - HEIGHTS.TABS_HEIGHT - conditionalHeight;

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
          <InfoText>Salaire: {salary || 'Non renseigné'}</InfoText>
          <InfoText>
            Jours et horaires: {workingHours || 'Non renseigné'}
          </InfoText>
        </StyledOpportunityDetailsTitleContainer>

        <StyledOpportunityDetailsRightContainer>
          <ActionLabels isPublic={isPublic} isExternal={isExternal} />
        </StyledOpportunityDetailsRightContainer>
      </StyledOpportunityDetailsTopContainer>

      {/* check if there are CTAS on the current tab to render ctas container */}
      <StyledOpportunityDetailsCTAContainer>
        <AdminOpportunityDetailsCTAs
          opportunity={opportunity}
          oppRefreshCallback={() => {
            oppRefreshCallback();
          }}
          fetchOpportunities={async () => {
            await fetchOpportunities();
          }}
        />
      </StyledOpportunityDetailsCTAContainer>

      {(companyDescription || description) && (
        <StyledOpportunityDetailsDetailsContentContainer
          height={containerHeight === 0 ? '100%' : containerHeight}
        >
          <OpportunitySection
            title="Contact du recruteur"
            content={
              <StyledOpportunitySectionList>
                <li>
                  <span>Nom et prénom du recruteur</span>
                  <span>
                    {recruiterFirstName} {recruiterName}
                  </span>
                </li>
                {recruiterPosition && (
                  <li>
                    <span>Position du recruteur</span>
                    <span>{recruiterPosition}</span>
                  </li>
                )}
                {recruiterPhone && (
                  <li>
                    <span>Contact téléphone</span>
                    <span>{recruiterPhone}</span>
                  </li>
                )}
                {recruiterMail && (
                  <li>
                    <span>Contact email</span>
                    <span>{recruiterMail}</span>
                  </li>
                )}
              </StyledOpportunitySectionList>
            }
          />
          <OpportunitySection
            title="Candidats associés"
            content={<OpportunitySectionCandidates opportunity={opportunity} />}
          />
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
          {otherInfo && (
            <OpportunitySection
              title="Informations complémentaires"
              content={otherInfo}
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
