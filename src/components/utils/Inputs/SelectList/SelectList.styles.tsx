import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledSelectList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 30px;
  > li {
    list-style: none;
    width: 100%;
    > button {
      width: 100%;
      border: 2px solid #ffeadc;
      background-color: #ffffff;
      border-radius: 20px;
      padding: 11px 1px;
      &:hover {
        cursor: pointer;
      }
    }
    &.selected {
      > button {
        padding: 10px 0px;
        border: 3px solid #f55f24;
        background-color: #fef8f5;
      }
      position: relative;
    }
  }
`;

export const StyledCheckIconContainer = styled.div`
  display: none;
  &.selected {
    position: absolute;
    right: -8px;
    top: -8px;
    background-color: ${COLORS.primaryOrange};
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    width: 25px;
    svg {
      color: white;
      height: 19px;
      width: 19px;
    }
  }
`;

export const StyledSelectOption = styled.div`
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
