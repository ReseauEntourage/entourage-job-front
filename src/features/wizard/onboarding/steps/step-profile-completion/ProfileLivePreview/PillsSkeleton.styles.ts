import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledPill = styled.div<{ $width: string }>`
  height: 10px;
  width: ${({ $width }) => $width};
  border-radius: 12px;
  background: ${COLORS.extraLightGray};
  background-size: 200px 100%;
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 8px;
`;
