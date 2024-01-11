import React from 'react';
import { StyledContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel.styles';
import { InfoText } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { Contract } from 'src/constants';
import { buildContractLabel } from 'src/utils/Formatting';

interface ContractLabelProps {
  contract: Contract | null;
  endOfContract?: string | null;
  startOfContract?: string;
  textWrap?: boolean;
}
export function ContractLabel({
  contract,
  endOfContract,
  startOfContract,
  textWrap,
}: ContractLabelProps) {
  if (contract) {
    const content = buildContractLabel(
      contract,
      endOfContract,
      startOfContract
    );

    return (
      <StyledContainer textWrap={textWrap}>
        <InfoText>{content}</InfoText>
      </StyledContainer>
    );
  }

  return null;
}

ContractLabel.defaultProps = {
  endOfContract: undefined,
  startOfContract: undefined,
  textWrap: false,
};
