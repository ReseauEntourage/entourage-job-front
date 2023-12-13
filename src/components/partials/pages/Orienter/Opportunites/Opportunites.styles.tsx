import styled from 'styled-components';

export const StyledOrienterOpportunitesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: stretch;
`;

export const StyledOrienterOpportunitesItem = styled.div`
  width: 25%;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  > .text-container {
    padding-top: 20px;
    height: 45px;
  }
  > .image-container {
    height: 150px;
    width: 150px;
    position: relative;
  }
  &.mobile {
    width: 100%;
    > .image-container {
      height: 100px;
      width: 100px;
      position: relative;
    }
  }
`;
