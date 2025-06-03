import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
`;

export const StyledProfileFormImageContainer = styled.div`
  height: ${(props) => `${props.size}px`};
  margin-bottom: 20px;
  border-radius: 50%;
  background-color: ${COLORS.primaryBlue};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledProfileFormImageInputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledOnboardingSpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
`;
