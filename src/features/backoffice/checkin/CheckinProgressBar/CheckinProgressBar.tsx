import React from 'react';
import { Text } from '@/src/components/ui';
import {
  StyledCheckinProgressBar,
  StyledCheckinProgressFill,
  StyledCheckinProgressTrack,
} from './CheckinProgressBar.styles';

interface CheckinProgressBarProps {
  current: number;
  total: number;
}

export const CheckinProgressBar = ({
  current,
  total,
}: CheckinProgressBarProps) => {
  const percent = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <StyledCheckinProgressBar>
      <StyledCheckinProgressTrack>
        <StyledCheckinProgressFill $percent={percent} />
      </StyledCheckinProgressTrack>
      <Text size="small" color="darkGray">
        Étape {current} sur {total}
      </Text>
    </StyledCheckinProgressBar>
  );
};
