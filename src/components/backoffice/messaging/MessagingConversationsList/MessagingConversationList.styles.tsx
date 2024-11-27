import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  color: ${COLORS.black};
  height: 100%;
`;

export const StyledSearchBarContainer = styled.div`
  padding: 30px 15px;
`;

export const StyledConversationsContainer = styled.div`
  overflow: hidden;
  overflow-y: auto;
  box-sizing: border-box;
  > *:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
  :not(.mobile) {
    height: 100%;
  }
`;
