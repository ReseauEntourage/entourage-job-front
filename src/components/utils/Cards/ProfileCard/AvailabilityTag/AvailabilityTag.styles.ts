import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledAvailabilityTagContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 40px;
  background-color: ${COLORS.white};
  padding: 2px 8px;
  font-size: 12px;
`;

export const StyledAvailabilityTagDot = styled.div<{ isAvailable: boolean }>`
  height: 10px;
  width: 10px;
  background-color: ${({ isAvailable }) => {
    return isAvailable ? COLORS.yesGreen : COLORS.noRed;
  }};
  border-radius: 50%;
  margin-right: 8px;
`;
