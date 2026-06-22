import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledSubProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
`;

export const StyledSubProgressBarTrack = styled.div`
  width: 100%;
  height: 4px;
  background-color: ${COLORS.gray};
  border-radius: 2px;
  overflow: hidden;
`;

export const StyledSubProgressBarFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${COLORS.primaryBlue};
  border-radius: 2px;
  transition: width 0.3s ease;
`;

export const StyledSubProgressBarLabel = styled.span`
  font-family: Poppins, sans-serif;
  font-size: 12px;
  color: ${COLORS.darkGray};
`;
