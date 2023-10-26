import React from 'react';
import { ContractLabel } from '../../../ContractLabel';
import {
  DescriptionText,
  InfoText,
  SubtitleText,
} from '../../../OpportunitiesContainer.styles';
import {
  StyledOpportunityItemActionContainer,
  StyledOpportunityItemBottomContainer,
  StyledOpportunityItemContainer,
  StyledOpportunityItemDescription,
  StyledOpportunityItemInfoContainer,
  StyledOpportunityItemTitleContainer,
  StyledOpportunityItemTopContainer,
} from '../../OpportunitiesList.styles';
import { Opportunity } from 'src/api/types';
import { BUSINESS_LINES } from 'src/constants';
// import { ActionsLabels } from 'src/constants/utils';
import { findConstantFromValue } from 'src/utils';
import { StyledAdminOpportunityItemSeparator } from './AdminOpportunityItem.styles';

export const AdminOpportunityItem = ({
  title,
  company,
  description,
  // isExternal,
  department,
  contract,
  endOfContract,
  startOfContract,
  businessLines,
}: Partial<Opportunity>) => {
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
          {/* <ActionsLabels
            isBookmarked={!!opportunityUsers?.bookmarked}
            isRecommended={!!opportunityUsers?.recommended}
            isPublic={isPublic}
            isExternal={isExternal}
            bookmarkOpportunity={bookmarkOpportunity}
          /> */}
        </StyledOpportunityItemActionContainer>
      </StyledOpportunityItemTopContainer>
      <StyledAdminOpportunityItemSeparator />
      <StyledOpportunityItemBottomContainer>
        <SubtitleText>Description mission</SubtitleText>
        <StyledOpportunityItemDescription>
          <DescriptionText>{description}</DescriptionText>
        </StyledOpportunityItemDescription>
      </StyledOpportunityItemBottomContainer>
    </StyledOpportunityItemContainer>
  );
};
