import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledIconContainer = styled.div<{ isCompleted: boolean }>`
  display: flex;
  background: ${({ isCompleted }) =>
    isCompleted ? COLORS.green : COLORS.lightRed};
  border-radius: 50%;
  width: 20px;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

export const StyledCardTitle = styled.div`
  display: flex;
  gap: 10px;
  cursor: pointer;
`;
