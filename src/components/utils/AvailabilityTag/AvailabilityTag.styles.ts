import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledAvailabilityTagContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 40px;
  background-color: ${COLORS.white};
  padding: 2px 8px;
  font-size: 12px;
  border: 1px solid ${COLORS.gray};
  overflow-wrap: normal;
`;

export const StyledAvailabilityTagDot = styled.div<{ isAvailable: boolean }>`
  height: 10px;
  width: 10px;
  background-color: ${({ isAvailable }) => {
    return isAvailable ? COLORS.green : COLORS.red;
  }};
  border-radius: 50%;
  margin-right: 8px;
`;
