import styled from 'styled-components';

export const StyledHelpCardList = styled.ul`
  padding-left: 0;
  li {
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    color: #484848;
    &:not(:last-child) {
      margin-bottom: 30px;
    }
  }
`;

export const StyledHelpCardImgContainer = styled.div`
  height: 45px;
  max-width: 45px;
  margin-right: 15px;
  position: relative;
  > svg {
    height: 45px;
    width: 45px;
    max-width: 45px;
  }
`;

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
