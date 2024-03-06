import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
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
import { BUSINESS_LINES, OfferStatus } from 'src/constants';
import { findConstantFromValue } from 'src/utils';
import {
  StyledAdminOpportunityItemSeparator,
  StyledAdminOpportunityItemContainer,
} from './AdminOpportunityItem.styles';

interface AdminOpportunityItemProps
  extends Partial<AdminOpportunityWithOpportunityUsers> {
  selectOpportunity: ({ id }: { id: string }) => void;
  isSelected?: boolean;
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
  isSelected = false,
}: AdminOpportunityItemProps) => {
  // if candidate Id exists in query params, it means we are on the candidate list page => then find the correct OpportunityUser
  const {
    query: { memberId: candidateId },
  } = useRouter();
  const [opportunityUser, setOpportunityUser] = useState<OpportunityUser>();
  useEffect(() => {
    if (candidateId) {
      const oppUs =
        // @ts-expect-error after enable TS strict mode. Please, try to fix it
        opportunityUsers.find((oppUser) => {
          return oppUser.user.id === candidateId;
        });
      if (oppUs) {
        setOpportunityUser(oppUs);
      }
    }
  }, [candidateId, opportunityUsers]);

  const statusToColor: { [K in OfferStatus]: ActionLabelColor } = {
    '-1': 'primaryBlue',
    '0': 'primaryBlue',
    '1': 'primaryBlue',
    '2': 'yesGreen',
    '3': 'noRed',
    '4': 'noRed',
  };

  const handleCheckbox = useCallback(() => {
    selectOpportunity({
      // @ts-expect-error after enable TS strict mode. Please, try to fix it
      id,
    });
  }, [id, selectOpportunity]);

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
          <InfoText>
            <StyledOpportunityItemInfoContainer>
              <ContractLabel
                // @ts-expect-error after enable TS strict mode. Please, try to fix it
                contract={contract}
                endOfContract={endOfContract}
                startOfContract={startOfContract}
              />
              &nbsp;-&nbsp;{department}
            </StyledOpportunityItemInfoContainer>
          </InfoText>
        </StyledOpportunityItemTitleContainer>
        <StyledOpportunityItemActionContainer>
          {
            // @ts-expect-error after enable TS strict mode. Please, try to fix it
            selectOpportunity && (
              <CheckBox
                useOutsideOfForm
                id={`checkbox-${id}`}
                name={`checkbox-${id}`}
                onChange={handleCheckbox}
                value={isSelected}
              />
            )
          }
          {candidateId && opportunityUser && (
            <ActionLabel
              disabled
              color={statusToColor[opportunityUser.status]}
              label={statusToTitle(opportunityUser.status)}
            />
          )}
        </StyledOpportunityItemActionContainer>
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
