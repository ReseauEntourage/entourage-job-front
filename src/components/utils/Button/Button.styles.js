import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const colorToHoverBackgroundColor = {
  primaryOrange: COLORS.hoverOrange,
  darkGrayFont: 'white',
  black: COLORS.hoverOrange,
  white: 'transparent',
};

export const colorToHoverColor = {
  primaryOrange: COLORS.primaryOrange,
  darkGrayFont: COLORS.primaryOrange,
  black: COLORS.black,
  white: COLORS.primaryOrange,
};

export const StyledButton = styled.button`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 11px 20px !important;

  > svg {
    margin-right: 8px;
  }

  &:hover {
    transition: 0.2s ease-in-out;
  }

  &.uk-button-primary,
  &.uk-button-secondary {
    border: 0.5px solid ${COLORS.primaryOrange};

    &:hover {
      background: none;
      color: ${COLORS.primaryOrange};
    }

    &.banner-btn {
      &:hover {
        background-color: rgba(250, 250, 250, 0.8);
        border-color: ${COLORS.primaryOrange};
      }
    }
  }

  &.uk-button-default {
    &:hover {
      /* background-color: ${COLORS.primaryOrange}; */
      border-color: ${COLORS.primaryOrange};
      /* color: white; */
      color: ${COLORS.primaryOrange};
    }
  }

  &.custom-primary {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: 1px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: white;
    background-color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;

    path {
      fill: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;
    }

    border-radius: 5px;

    &:hover {
      cursor: pointer;
      background-color: white !important;
      color: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;

      path {
        transition: 0.2s ease-in-out;
        fill: ${(props) => {
          return COLORS[props.color] || COLORS.primaryOrange;
        }} !important;
      }
    }
  }

  &.custom-primary-inverted {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: 1px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;

    path {
      fill: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;
    }

    border-radius: 5px;
    background-color: transparent;

    &:hover {
      cursor: pointer;
      background-color: ${(props) => {
        return colorToHoverBackgroundColor[props.color] || COLORS.primaryOrange;
      }};
      color: ${(props) => {
        return colorToHoverColor[props.color] || COLORS.primaryOrange;
      }} !important;
      border: 1px solid
        ${(props) => {
          return colorToHoverColor[props.color] || COLORS.primaryOrange;
        }};

      path {
        transition: 0.2s ease-in-out;
        fill: ${(props) => {
          return colorToHoverColor[props.color] || COLORS.primaryOrange;
        }} !important;
      }
    }
  }

  &.custom-text {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: none;
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;

    path {
      fill: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;
    }
    background-color: transparent;

    &:hover {
      cursor: pointer;
      background-color: ${(props) => {
        return colorToHoverBackgroundColor[props.color] || COLORS.primaryOrange;
      }};
      path {
        transition: 0.2s ease-in-out;
        fill: ${(props) => {
          return colorToHoverColor[props.color] || COLORS.primaryOrange;
        }} !important;
      }
    }
  }

  &.custom-secondary {
    font-family: Poppins, sans-serif;
    padding: 6px 15px;
    background-color: white;

    &.transparentBG {
      background-color: unset;
    }

    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;

    path {
      transition: 0.2s ease-in-out;
      fill: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;
    }

    border-radius: 25px;

    &:hover {
      cursor: pointer;
      background-color: ${(props) => {
        return colorToHoverBackgroundColor[props.color];
      }};
      color: ${(props) => {
        return colorToHoverColor[props.color];
      }} !important;

      path {
        transition: 0.2s ease-in-out;
        fill: ${(props) => {
          return colorToHoverColor[props.color];
        }} !important;
      }
    }
  }

  &.disabled {
    border-color: ${COLORS.gray} !important;
    color: ${COLORS.darkGray} !important;
    background-color: ${COLORS.lightgray} !important;

    path {
      fill: ${COLORS.darkGray} !important;
    }

    &:hover {
      color: ${COLORS.darkGray} !important;
      background-color: ${COLORS.lightgray} !important;
      cursor: default !important;

      path {
        fill: ${COLORS.darkGray} !important;
      }
    }
  }

  &.small {
    padding: 6px 10px !important;
    font-size: 13px;
    line-height: 16px;
  }
`;