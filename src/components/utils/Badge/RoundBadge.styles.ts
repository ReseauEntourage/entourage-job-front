import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledRoundBadge = styled.div<{ color: keyof typeof COLORS }>`
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
