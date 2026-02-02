import styled from 'styled-components';
import { Color, COLORS } from '@/src/constants/styles';

export const StyledRoundBadge = styled.div<{
  size: number;
  active?: boolean;
  borderColor: Color;
  bgColor: Color;
  borderSize: number;
}>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  border-radius: 50%;
  background-color: ${({ bgColor }) => COLORS[bgColor]};
  border: ${({ borderSize }) => borderSize}px solid
    ${({ borderColor }) => COLORS[borderColor]};
  display: flex;
  align-items: center;
  justify-content: center;
`;
