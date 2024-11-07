import styled from 'styled-components';
import { commonInputContainerStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledCheckbox = styled.div`
  ${() => commonInputContainerStyles}
  justify-content: center;
  .checkbox-label {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-left: 16px;
    font-size: 14px;
    line-height: 17px;

    input {
      position: absolute;
      opacity: 0;
      cursor: pointer;
      height: 0;
      width: 0;
    }

    &.disabled .checkmark {
      border: 0.5px solid ${COLORS.gray};
      cursor: default;
      background-color: ${COLORS.gray};
    }

    &.disabled:hover input ~ .checkmark {
      opacity: 1;
    }

    .checkmark {
      position: absolute;
      top: 0;
      bottom: 0;
      margin-top: auto;
      margin-bottom: auto;
      left: 0;
      height: 16px;
      width: 16px;
      border-radius: 4px;
      background-color: white;
      border: 0.5px solid ${COLORS.mediumGray};
    }

    &:hover input ~ .checkmark {
      opacity: 0.7;
    }

    input:checked ~ .checkmark {
      background-color: ${COLORS.primaryBlue};
    }

    .checkmark:after {
      content: '';
      position: absolute;
      display: none;
      left: 5px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      -webkit-transform: rotate(45deg);
      -ms-transform: rotate(45deg);
      transform: rotate(45deg);
    }

    input:checked ~ .checkmark:after {
      display: block;
    }
  }

  .label {
    margin-left: 8px;
  }
`;
