import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledItem = styled.div`
  background: ${COLORS.hoverBlue};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  padding: 20px 10px;
`;

export const StyledContentContainer = styled.div`
  flex: 1;
`;

export const StyledButtonContainer = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;
