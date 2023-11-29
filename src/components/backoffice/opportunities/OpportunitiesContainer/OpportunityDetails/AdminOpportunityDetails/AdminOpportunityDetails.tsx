import moment from 'moment';
import React, { Ref } from 'react';
import {
  OpportunitySection,
  OpportunitySectionCandidates,
} from '../OpportunitySection';
import { StyledOpportunitySectionList } from '../OpportunitySection/OpportunitySection.styles';
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
import { findConstantFromValue } from 'src/utils';
import { AdminOpportunityDetailsCTAs } from './AdminOpportunityDetailsCTAs';

interface AdminOpportunityDetailsProps {
  opportunity: AdminOpportunityWithOpportunityUsers;
  fetchOpportunities: () => void;
  oppRefreshCallback: () => void;
  hasCTAContainer: boolean;
  containerHeight: number;
  innerRef: Ref<HTMLElement>;
}

export const AdminOpportunityDetails = ({
  opportunity,
  fetchOpportunities,
  oppRefreshCallback,
  hasCTAContainer,
  containerHeight,
  innerRef,
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
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledOpportunityDetailsInfoContainer>
          </InfoText>
          <InfoText>{moment(createdAt).format('DD/MM/YYYY')}</InfoText>
          <InfoText>Salaire&nbsp;: {salary || 'Non renseigné'}</InfoText>
          <InfoText>
            Jours et horaires&nbsp;: {workingHours || 'Non renseigné'}
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
