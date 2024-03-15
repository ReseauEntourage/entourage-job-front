import styled from 'styled-components';

export const StyledImageTitle = styled.section`
  width: 100%;
  color: white;
  box-sizing: border-box;
  padding: 20px 20% 20px 0;
  margin: 0 20px;

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  h1 {
    margin: 0;
  }
  p {
    font-size: 14px;
    line-height: 20px;
    padding-right: 40px;
    margin-top: 16px;
    color: ${(props) => props.textColor};
    flex: 1;
    display: flex;
    align-items: center;
  }
  &.desktop {
    padding: 40px 55% 40px 40px;
    p {
      font-size: 20px;
      line-height: 30px;
    }
  }
`;

export const StyledImageTitleCTAsContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  button:first-child {
    margin-right: 8px;
  }
  button {
    margin-top: 4px;
  }
`;
