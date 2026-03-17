import styled from 'styled-components';
import { Color, COLORS } from '@/src/constants/styles';

export const StyledBadgeContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const StyledIconContainer = styled.div<{ $bgColor?: Color }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $bgColor }) =>
    $bgColor ? COLORS[$bgColor] : 'transparent'};
  border-radius: 6px;
  flex-shrink: 0;
  padding: 4px;
`;

export const StyledBadgeContent = styled.div`
  display: flex;
  flex-direction: column;
`;
