import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledCheckinProgressBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const StyledCheckinProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  border-radius: 999px;
  background-color: ${COLORS.gray};
  overflow: hidden;
`;

export const StyledCheckinProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  border-radius: 999px;
  background-color: ${COLORS.primaryBlue};
  width: ${({ $percent }) => $percent}%;
  transition: width 0.3s ease;
`;
