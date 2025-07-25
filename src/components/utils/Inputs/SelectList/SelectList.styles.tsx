import styled from 'styled-components';
import { commonInputContainerStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledSelectListContainer = styled.div`
  ${() => commonInputContainerStyles}
`;
export const StyledSelectList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 0;
  margin-bottom: 8px;

  > li {
    list-style: none;
    width: 100%;
    :not(:last-child) {
      margin-bottom: 30px;
    }

    &.selected {
      > button {
        border: 1px solid ${COLORS.primaryBlue};
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

export const StyledListOption = styled.div`
  display: flex;
  gap: 20px;
  flex-direction: row;
  font-family: Poppins, sans-serif;
  padding: 20px;
  > .img-container {
    box-sizing: border-box;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    > svg {
      height: 55px;
      width: 55px;
    }
  }
  > .text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    text-align: left;
  }
`;

export const StyledButton = styled.button`
  width: 100%;
  border: 1px solid ${COLORS.gray};
  background-color: ${COLORS.white};
  border-radius: 20px;
  padding: 0;

  &:hover {
    cursor: pointer;
  }
`;
