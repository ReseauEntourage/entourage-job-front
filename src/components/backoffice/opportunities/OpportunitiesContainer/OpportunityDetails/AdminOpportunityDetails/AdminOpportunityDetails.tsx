import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {
  OpportunitySection,
  OpportunitySectionCandidates,
} from '../OpportunitySection';
import { StyledOpportunitySectionList } from '../OpportunitySection/OpportunitySection.styles';
import { useOpportunityDetailsHeight } from '../useOpportunityDetailsHeight';
import { AdminOpportunityWithOpportunityUsers } from 'src/api/types';
import { AdminActionLabelContainer as ActionLabels } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
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
import { HEIGHTS } from 'src/constants/styles';
import { findConstantFromValue } from 'src/utils';
import { AdminOpportunityDetailsCTAs } from './AdminOpportunityDetailsCTAs';
import {
  CTAsByTag,
  getOpportunityCurrentTag,
} from './AdminOpportunityDetailsCTAs/AdminOpportunityDetailsCTAs.utils';

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

  const [hasCTAContainer, setHasCTAContainer] = useState(true);

  const { containerHeight } = useOpportunityDetailsHeight(
    HEIGHTS.TABS_HEIGHT + HEIGHTS.SEARCH_BAR_HEIGHT,
    ref,
    hasCTAContainer
  );

  useEffect(() => {
    const hasCTAs =
      CTAsByTag.find(({ tag }) => {
        return tag === getOpportunityCurrentTag(opportunity);
      }).ctas.length > 0;

    setHasCTAContainer(hasCTAs);
  }, [hasCTAContainer, opportunity]);

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

      {hasCTAContainer && (
        <StyledOpportunityDetailsCTAContainer>
          <AdminOpportunityDetailsCTAs
            opportunity={opportunity}
            oppRefreshCallback={oppRefreshCallback}
            fetchOpportunities={fetchOpportunities}
          />
        </StyledOpportunityDetailsCTAContainer>
      )}

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
          {opportunity?.opportunityUsers?.length > 0 && (
            <OpportunitySection
              title="Candidats associés"
              content={
                <OpportunitySectionCandidates opportunity={opportunity} />
              }
            />
          )}
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
  );
};
