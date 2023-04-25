import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { findConstantFromValue } from 'src/utils';
import { CONTRACTS } from 'src/constants';
import { StyledContainer } from 'src/components/backoffice/opportunities/OpportunitiesContainer/ContractLabel/ContractLabel.styles';
import { InfoText } from 'src/components/backoffice/opportunities/OpportunitiesContainer/OpportunitiesContainer.styles';
import { Tooltip } from 'react-tooltip';

const tooltipId = 'contract-tooltip';
const ContractLabel = ({
  contract,
  endOfContract,
  startOfContract,
  textWrap,
}) => {
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

    const content = `${
      findConstantFromValue(contract, CONTRACTS)?.label
    }${dates}`;

    return (
      <>
        <StyledContainer textWrap={textWrap}>
          <InfoText
            data-tooltip-id={tooltipId}
            data-tooltip-content={content}
            data-tooltip-place="top"
          >
            {content}
          </InfoText>
        </StyledContainer>
        <Tooltip id={tooltipId} />
      </>
    );
  }

  return null;
};

ContractLabel.propTypes = {
  contract: PropTypes.string,
  endOfContract: PropTypes.string,
  startOfContract: PropTypes.string,
  textWrap: PropTypes.bool,
};

ContractLabel.defaultProps = {
  contract: undefined,
  endOfContract: undefined,
  startOfContract: undefined,
  textWrap: false,
};

export default ContractLabel;
