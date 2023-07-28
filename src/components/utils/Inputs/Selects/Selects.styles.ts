import styled from 'styled-components';
import { commonMenuOptionStyles } from '../Inputs.styles';
import { COLORS } from 'src/constants/styles';

export const StyledSelectContainer = styled.div`
  min-width: 300px;
  width: 100%;
  max-width: 100%;
`;
export const StyledSelect = styled.div`
  margin-bottom: 30px;
  font-family: Poppins, Arial, sans-serif !important;
  & .Select__control--is-disabled {
    background-color: ${COLORS.lightgray} !important;

    & .Select__loading-indicator {
      display: none;
    }
  }

  & .Select__control--is-focused {
    background-color: ${COLORS.white} !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    box-sizing: border-box;
  }

  & .Select__input {
    color: ${COLORS.black};
    visibility: ${(props) =>
      !props.value ||
      !Array.isArray(props.value) ||
      !props.maxSelectedItems ||
      props.value.length < props.maxSelectedItems
        ? 'visible'
        : 'hidden'};
  }

  & .Select__value-container {
    padding: 0 !important;
  }

  & .Select__single-value {
    display: flex;
    align-items: center;
  }

  & .Select__dropdown-indicator {
    color: ${COLORS.primaryOrange};
    padding: 0 !important;
    display: ${(props) =>
      !props.value ||
      !Array.isArray(props.value) ||
      !props.maxSelectedItems ||
      props.value.length < props.maxSelectedItems
        ? 'flex'
        : 'none'};

    :hover {
      color: ${COLORS.primaryOrange} !important;
      cursor: pointer;
    }
  }

  & .Select__indicator-separator {
    display: none;
  }

  & .Select__loading-indicator {
    color: ${(props) => props.theme.textColor};
  }

  & .Select__control {
    background-color: ${COLORS.white};
    min-height: 30px;
    border: none;
    border-bottom: solid 2px ${COLORS.gray} !important;
    box-sizing: border-box;
    border-radius: 0 !important;
    :hover {
      cursor: text;
    }
  }

  & .Select__clear-indicator {
    color: ${COLORS.darkGray};
    visibility: visible;
    cursor: pointer;
    padding-bottom: 0 !important;
    padding-top: 0 !important;
    :hover {
      color: ${COLORS.gray};
      opacity: 0.6 !important;
    }
  }

  & .Select__placeholder {
    color: ${COLORS.darkGray};
    font-style: italic;
    font-size: 14px;
    font-family: Poppins, sans-serif !important;
  }

  & .Select__menu {
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  & .Select__menu-list {
    border-radius: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  & .Select__option {
    :hover {
      border: 0.5px solid ${COLORS.primaryOrange};
      color: ${COLORS.primaryOrange};
      cursor: pointer;
    }
  }

  & .Select__option,
  .Select__menu-notice--no-options,
  .Select__menu-notice--loading {
    ${() => commonMenuOptionStyles}
    & svg {
      margin-right: 4px !important;
    }
  }
  & .Select__option--is-selected {
    color: ${COLORS.black} !important;
    :hover {
      color: ${COLORS.primaryOrange} !important;
    }
  }

  & .Select__multi-value {
    background-color: ${COLORS.white};
    border: 1px solid ${COLORS.gray};
    border-radius: 50px;
    padding: 0 8px !important;
  }

  & .Select__multi-value__label {
    border-radius: 0 !important;
    padding: 0 !important;
  }

  & .Select__multi-value__remove {
    color: ${COLORS.primaryOrange};
    padding-right: 0 !important;
    :hover {
      background-color: white !important;
      opacity: 0.6 !important;
      cursor: pointer;
    }
  }

  & .Select__single-value {
    color: ${COLORS.black} !important;
    font-size: 14px !important;
    display: flex;
    align-items: center;
    & svg {
      margin-right: 4px !important;
    }
  }

  & .Select__input > input {
    font-size: 14px !important;
    line-height: 17px !important;
    font-family: Poppins, sans-serif !important;
  }
`;
