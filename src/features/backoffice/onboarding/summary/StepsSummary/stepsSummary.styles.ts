import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledStepsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledStepItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

export const StyledStepItemCounterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledStepItemCounter = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${COLORS.darkBlue};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledStepItemCounterLinker = styled.div`
  flex-grow: 1;
  height: 24px;
  border-left: 2px solid ${COLORS.gray};
`;

export const StyledStepItemContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 30px;
`;
