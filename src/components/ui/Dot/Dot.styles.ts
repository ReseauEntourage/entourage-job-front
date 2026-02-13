import styled from 'styled-components';
import { Color, COLORS } from 'src/constants/styles';

export const StyledDot = styled.div<{ color: Color }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ color }) => COLORS[color]};
  color: ${COLORS.white};
  font-size: 8px;
  font-weight: bold;
`;
