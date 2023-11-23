import moment from 'moment';
// import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { OpportunitySection } from '../OpportunitySection';
import { StyledOpportunitySectionList } from '../OpportunitySection/OpportunitySection.styles';
import { OpportunitySectionCandidates } from '../OpportunitySection/OpportunitySectionCandidates';
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
import { HEIGHTS_ADMIN } from 'src/constants/styles';
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

  // // if candidate Id exists in query params, it means we are on the candidate list page
  // const {
  //   query: { memberId: candidateId },
  // } = useRouter();

  const ref = useRef();

  const { containerHeight } = useOpportunityDetailsHeight(
    HEIGHTS_ADMIN,
    ref,
    true
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
          oppRefreshCallback={oppRefreshCallback}
          fetchOpportunities={fetchOpportunities}
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
