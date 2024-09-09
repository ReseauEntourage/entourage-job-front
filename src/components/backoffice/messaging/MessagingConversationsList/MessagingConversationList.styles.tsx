import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
  width: 100%;
  color: ${COLORS.black};
`;

export const StyledConversationsContainer = styled.div`
  overflow: hidden;
  > *:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
  :not(.mobile) {
    border-radius: 30px;
  }
`;
