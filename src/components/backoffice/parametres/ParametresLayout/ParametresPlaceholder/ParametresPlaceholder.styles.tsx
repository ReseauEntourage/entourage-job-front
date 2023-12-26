import styled from 'styled-components';

export const StyledParametresCardPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    > div.illu-container {
      margin-right: 40px;
      svg {
        min-width: 70px;
      }
    }
  }
  button {
    display: none;
  }
`;
