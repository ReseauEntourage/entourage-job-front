import React from 'react';
import {
  StyledOpportunityItemActionContainer,
  StyledOpportunityItemBottomContainer,
  StyledOpportunityItemContainer,
  StyledOpportunityItemDescription,
  StyledOpportunityItemInfoContainer,
  StyledOpportunityItemTitleContainer,
  StyledOpportunityItemTopContainer,
} from '../../OpportunitiesList.styles';
import { OpportunityWithOpportunityUsers } from 'src/api/types';
import { ActionLabelContainer as ActionLabels } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel';
import {
  DescriptionText,
  InfoText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { useBookmarkOpportunity } from 'src/components/backoffice/opportunities/OpportunitiesContainer/useBookmarkOpportunity';
import { BUSINESS_LINES } from 'src/constants';
import { findConstantFromValue } from 'src/utils/Finding';
import { ProgressBarStatus } from './ProgressBarStatus';

export const CandidateOpportunityItem = ({
  id,
  title,
  company,
  description,
  isExternal,
  isPublic,
  opportunityUsers: opportunityUsersProp,
  department,
  contract,
  endOfContract,
  startOfContract,
  businessLines,
}: Partial<OpportunityWithOpportunityUsers>) => {
  const { opportunityUsers, bookmarkOpportunity } = useBookmarkOpportunity(
    id,
    opportunityUsersProp
  );

  return (
    <StyledOpportunityItemContainer>
      <StyledOpportunityItemTopContainer>
        {/*
          <Icon>
            <Icon name="home" ratio={1.5} />
          </Icon>
        */}
        <StyledOpportunityItemTitleContainer>
          <SubtitleText>{title}</SubtitleText>
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
            <StyledOpportunityItemInfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledOpportunityItemInfoContainer>
          </InfoText>
        </StyledOpportunityItemTitleContainer>
        <StyledOpportunityItemActionContainer>
          <ActionLabels
            isBookmarked={!!opportunityUsers?.bookmarked}
            isRecommended={!!opportunityUsers?.recommended}
            isPublic={isPublic}
            isExternal={isExternal}
            bookmarkOpportunity={bookmarkOpportunity}
          />
        </StyledOpportunityItemActionContainer>
      </StyledOpportunityItemTopContainer>
      <ProgressBarStatus
        status={opportunityUsers?.status}
        archived={opportunityUsers?.archived}
        isBookmarked={opportunityUsers?.bookmarked}
        isRecommended={opportunityUsers?.recommended}
        isPublic={isPublic}
      />
      <StyledOpportunityItemBottomContainer>
        <SubtitleText>Description mission</SubtitleText>
        <StyledOpportunityItemDescription>
          <DescriptionText>{description}</DescriptionText>
        </StyledOpportunityItemDescription>
      </StyledOpportunityItemBottomContainer>
    </StyledOpportunityItemContainer>
  );
};
