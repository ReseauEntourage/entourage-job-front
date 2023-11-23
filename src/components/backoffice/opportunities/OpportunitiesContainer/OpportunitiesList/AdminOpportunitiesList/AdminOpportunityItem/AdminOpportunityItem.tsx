import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  OpportunityUser,
  AdminOpportunityWithOpportunityUsers,
} from 'src/api/types';
import {
  ActionLabel,
  ActionLabelColor,
} from 'src/components/backoffice/opportunities/OpportunitiesContainer/ActionLabel/ActionLabel';
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
import { statusToTitle } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunityDetails/OpportunitySection';
import { CheckBox } from 'src/components/utils/Inputs';
import { BUSINESS_LINES } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
import {
  StyledAdminOpportunityItemCheckboxContainer,
  StyledAdminOpportunityItemSeparator,
  StyledAdminOpportunityItemContainer,
  StyledAdminStatusOpportunityItemContainer,
} from './AdminOpportunityItem.styles';

interface AdminOpportunityItemProps
  extends Partial<AdminOpportunityWithOpportunityUsers> {
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
  opportunityUsers,
}: AdminOpportunityItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>();

  // if candidate Id exists in query params, it means we are on the candidate list page => then find the correct OpportunityUser
  const {
    query: { memberId: candidateId },
  } = useRouter();
  const [opportunityUser, setOpportunityUser] = useState<OpportunityUser>();
  useEffect(() => {
    if (candidateId) {
      const oppUs = opportunityUsers.find((oppUser) => {
        return oppUser.user.id === candidateId;
      });
      if (oppUs) {
        setOpportunityUser(oppUs);
      }
    }
  }, [candidateId, opportunityUsers]);

  const statusToColor: { [key: string]: ActionLabelColor } = {
    '-1': 'primaryOrange',
    '0': 'primaryOrange',
    '1': 'primaryOrange',
    '2': 'yesGreen',
    '3': 'noRed',
    '4': 'noRed',
  };

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
          {selectOpportunity && (
            <StyledAdminOpportunityItemCheckboxContainer>
              <CheckBox
                id={`checkbox-${id}`}
                name={`checkbox-${id}`}
                onChange={() => handleCheckbox()}
                value={isChecked}
              />
            </StyledAdminOpportunityItemCheckboxContainer>
          )}
          {candidateId && opportunityUser && (
            <StyledAdminStatusOpportunityItemContainer>
              <ActionLabel
                disabled
                fill
                color={statusToColor[opportunityUser.status]}
                label={statusToTitle(opportunityUser.status)}
              />
            </StyledAdminStatusOpportunityItemContainer>
          )}
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
