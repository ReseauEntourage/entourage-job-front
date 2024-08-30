import styled from 'styled-components';

export const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    background-color: #f9f9f9;
  }
  * {
    margin: 0;
  }
  > .addressee-name {
    font-weight: 700;
    font-size: 16px;
  }
  > .addressee-role {
    font-size: 12px;
    font-weight: 400;
  }
  > .last-message-preview {
    font-size: 12px;
    font-weight: 400;
    color: #979797;
  }
`;
