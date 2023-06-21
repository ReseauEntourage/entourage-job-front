import React from 'react';
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
import {
  StyledActionContainer,
  StyledBottomContainer,
  StyledContainer,
  StyledDescription,
  StyledInfoContainer,
  StyledTitleContainer,
  StyledTopContainer,
} from './CandidateOpportunityItem.styles';
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
    <StyledContainer>
      <StyledTopContainer>
        {/*
          <Icon>
            <IconNoSSR name="home" ratio={1.5} />
          </Icon>
        */}
        <StyledTitleContainer>
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
            <StyledInfoContainer>
              <ContractLabel
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledInfoContainer>
          </InfoText>
        </StyledTitleContainer>
        <StyledActionContainer>
          <ActionLabels
            isBookmarked={!!opportunityUsers?.bookmarked}
            isRecommended={!!opportunityUsers?.recommended}
            isPublic={isPublic}
            isExternal={isExternal}
            bookmarkOpportunity={bookmarkOpportunity}
          />
        </StyledActionContainer>
      </StyledTopContainer>
      <ProgressBarStatus
        status={opportunityUsers?.status}
        archived={opportunityUsers?.archived}
        isBookmarked={opportunityUsers?.bookmarked}
        isRecommended={opportunityUsers?.recommended}
        isPublic={isPublic}
      />
      <StyledBottomContainer>
        <SubtitleText>Description mission</SubtitleText>
        <StyledDescription>
          <DescriptionText>{description}</DescriptionText>
        </StyledDescription>
      </StyledBottomContainer>
    </StyledContainer>
  );
};
