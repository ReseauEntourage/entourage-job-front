import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { CONTRACTS } from 'src/constants';
import { StyledContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel.styles';
import { InfoText } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { Container } from './ContractLabel.styles';

const ContractLabel = ({ contract, endOfContract, startOfContract }) => {
  if (contract) {
    let dates = '';
    if (startOfContract || endOfContract) {
      dates += ` - `;
      if (startOfContract) {
        if (endOfContract) {
          dates += `du ${moment(startOfContract).format('DD/MM/YYYY')} au `;
        } else {
          dates += `à partir du ${moment(startOfContract).format(
            'DD/MM/YYYY'
          )}`;
        }
      } else {
        dates += `jusqu'au `;
      }

      if (endOfContract) {
        dates += `${moment(endOfContract).format('DD/MM/YYYY')}`;
      }
    }

    return (
      <StyledContainer>
        <InfoText>
          {findConstantFromValue(contract, CONTRACTS)?.label}
          {dates}
        </InfoText>
      </StyledContainer>
    );
  }

  return null;
};

ContractLabel.propTypes = {
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
};

ContractLabel.defaultProps = {
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
};

export default ContractLabel;
