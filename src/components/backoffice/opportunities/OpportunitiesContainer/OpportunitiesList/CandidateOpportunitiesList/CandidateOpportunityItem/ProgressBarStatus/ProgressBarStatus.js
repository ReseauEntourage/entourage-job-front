import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { StyledContainer, StyledStep } from './ProgressBarStatus.styles';

const ProgressBarStatus = ({
  status,
  archived,
  isBookmarked,
  isRecommended,
  isPublic,
}) => {
  const abandonned = archived || status === 3 || status === 4;
  const hired = !archived && status === 2;
  const noStatus = _.isNil(status);

  let color = 'primaryOrange';
  if (abandonned) {
    color = 'noRed';
  }
  if (hired) {
    color = 'yesGreen';
  }

  return (
    <StyledContainer>
      <StyledStep
        activate={
          !noStatus &&
          (status >= 0 ||
            abandonned ||
            hired ||
            (status === -1 && isPublic && (isBookmarked || isRecommended)) ||
            (status === -1 && !isPublic))
        }
        color={color}
      />
      <StyledStep
        activate={!noStatus && (status >= 0 || abandonned || hired)}
        color={color}
      />
      <StyledStep
        activate={!noStatus && (status >= 1 || abandonned || hired)}
        color={color}
      />
      <StyledStep
        activate={!noStatus && (status >= 2 || abandonned || hired)}
        color={color}
      />
    </StyledContainer>
  );
};

ProgressBarStatus.defaultProps = {
  status: null,
  archived: false,
};

ProgressBarStatus.propTypes = {
  status: PropTypes.number,
  archived: PropTypes.bool,
  isBookmarked: PropTypes.bool.isRequired,
  isRecommended: PropTypes.bool.isRequired,
  isPublic: PropTypes.bool.isRequired,
};

export default ProgressBarStatus;
