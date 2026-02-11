import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: ${COLORS.gray} 1px solid;
  border-radius: 20px;
`;

export const StyledStepImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 55px;
`;

export const StyledStepBtnContainer = styled.div`
  display: flex;
  justify-content: center;
`;
