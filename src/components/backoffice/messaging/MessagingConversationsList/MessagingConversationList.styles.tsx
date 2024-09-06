import styled from 'styled-components';

export const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  flex: 1;
  width: 100%;
`;

export const StyledConversationsContainer = styled.div`
  border-radius: 30px;
  overflow: hidden;
  > *:not(:last-child) {
    border-bottom: 1px solid #e0e0e0;
  }
`;
