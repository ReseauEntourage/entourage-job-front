import _ from 'lodash';
import React from 'react';
import { OfferStatus } from 'src/constants';
import { StyledContainer, StyledStep } from './ProgressBarStatus.styles';

interface ProgressBarStatusProps {
  status: OfferStatus;
  archived: boolean;
  isBookmarked: bigint;
  isRecommended: boolean;
  isPublic: boolean;
}
export const ProgressBarStatus = ({
  status,
  archived = false,
  isBookmarked,
  isRecommended,
  isPublic,
}: ProgressBarStatusProps) => {
  const abandonned = archived || status === 3 || status === 4;
  const hired = !archived && status === 2;
  const noStatus = _.isNil(status);

  let color = 'primaryBlue';
  if (abandonned) {
    color = 'red';
  }
  if (hired) {
    color = 'green';
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
