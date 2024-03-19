import styled from 'styled-components';

export const StyledLoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  > * {
    max-width: 700px;
  }
`;

export const StyledLoginFooter = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > * {
    :first-child {
      margin-bottom: 8px;
    }
  }
`;
