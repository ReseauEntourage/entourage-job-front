import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
`;

export const StyledProfileFormTextAreaContainer = styled.div`
  max-width: 655px;
`;

export const StyledProfileFormImageContainer = styled.div`
  height: ${(props) => `${props.size}px`};
  width: ${(props) => `${props.size}px`};
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
