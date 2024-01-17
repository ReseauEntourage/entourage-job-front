import styled from 'styled-components';

export const StyledHelpModalSelectOption = styled.div`
  display: flex;
  flex-direction: row;
  > .img-container {
    min-width: 100px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    > svg {
      height: 45px;
      width: 45px;
    }
  }
  > .text-container {
    padding: 10px;
    text-align: left;
    h6 {
      margin-bottom: 10px;
    }
    p {
      margin: 0;
      line-height: 24px;
    }
  }
`;
