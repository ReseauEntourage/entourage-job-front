import React, { useEffect, useState } from 'react';
import { Opportunity } from 'src/api/types';
import { ContractLabel } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel';
import {
  DescriptionText,
  InfoText,
  SubtitleText,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import {
  StyledOpportunityItemActionContainer,
  StyledOpportunityItemBottomContainer,
  StyledOpportunityItemDescription,
  StyledOpportunityItemInfoContainer,
  StyledOpportunityItemTitleContainer,
  StyledOpportunityItemTopContainer,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesList/OpportunitiesList.styles';
import { CheckBox } from 'src/components/utils/Inputs';
import { BUSINESS_LINES } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
import {
  StyledAdminOpportunityItemCheckboxContainer,
  StyledAdminOpportunityItemSeparator,
  StyledAdminOpportunityItemContainer,
} from './AdminOpportunityItem.styles';

interface AdminOpportunityItemProps extends Partial<Opportunity> {
  selectOpportunity: ({ id }: { id: string }) => void;
}

export const AdminOpportunityItem = ({
  id,
  title,
  company,
  description,
  department,
  contract,
  endOfContract,
  startOfContract,
  businessLines,
  selectOpportunity,
}: AdminOpportunityItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>();

  const handleCheckbox = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (isChecked !== undefined) {
      selectOpportunity({ id });
    }
  }, [isChecked, id, selectOpportunity]);

  return (
    <StyledAdminOpportunityItemContainer>
      <StyledOpportunityItemTopContainer>
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
          <StyledAdminOpportunityItemCheckboxContainer>
            <CheckBox
              id={`checkbox-${id}`}
              name={`checkbox-${id}`}
              onChange={() => handleCheckbox()}
              value={isChecked}
            />
          </StyledAdminOpportunityItemCheckboxContainer>
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
        <StyledOpportunityItemActionContainer />
      </StyledOpportunityItemTopContainer>
      <StyledAdminOpportunityItemSeparator />
      <StyledOpportunityItemBottomContainer>
        <SubtitleText>Description mission</SubtitleText>
        <StyledOpportunityItemDescription>
          <DescriptionText>{description}</DescriptionText>
        </StyledOpportunityItemDescription>
      </StyledOpportunityItemBottomContainer>
    </StyledAdminOpportunityItemContainer>
  );
};
