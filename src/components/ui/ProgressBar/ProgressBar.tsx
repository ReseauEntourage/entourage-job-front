import { Color } from '@/src/constants/styles';
import { StyledProgressBar } from './ProgressBar.styles';

export interface ProgressBarProps {
  value: number;
  color: Color;
}

export const ProgressBar = ({ value, color }: ProgressBarProps) => {
  return (
    <StyledProgressBar.Container>
      <StyledProgressBar.Fill color={color} width={`${value}%`} />
    </StyledProgressBar.Container>
  );
};
