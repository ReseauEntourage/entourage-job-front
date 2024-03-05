import styled from 'styled-components';
import { commonInputContainerStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledSelectListContainer = styled.div`
  ${() => commonInputContainerStyles}
`;
export const StyledSelectList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-bottom: 8px;

  > li {
    list-style: none;
    width: 100%;
    :not(:last-child) {
      margin-bottom: 30px;
    }

    > button {
      width: 100%;
      border: 2px solid ${COLORS.lightgray};
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
        border: 3px solid ${COLORS.primaryBlue};
        background-color: ${COLORS.hoverBlue};
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
    background-color: ${COLORS.primaryBlue};
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
  font-family: Poppins, sans-serif;
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
