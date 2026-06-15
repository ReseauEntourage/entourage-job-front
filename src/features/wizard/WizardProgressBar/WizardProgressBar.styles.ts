import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProgressContainer = styled.div`
  margin-bottom: 32px;
`;

export const StyledProgressLabel = styled.p`
  font-size: 13px;
  color: ${COLORS.darkGray};
  margin-bottom: 8px;
`;

export const StyledProgressTrack = styled.div`
  height: 6px;
  background-color: ${COLORS.lightGray};
  border-radius: 3px;
  overflow: hidden;
`;

export const StyledProgressFill = styled.div<{ percent: number }>`
  height: 100%;
  width: ${({ percent }) => percent}%;
  background-color: ${COLORS.primaryBlue};
  border-radius: 3px;
  transition: width 0.3s ease;
`;
