import styled from 'styled-components';
// import { COLORS } from 'src/constants/styles';
import { COLORS } from '../../../constants/styles';

export const colorToHoverBackgroundColor = {
  primaryOrange: COLORS.hoverOrange,
  darkGrayFont: 'white',
  white: 'transparent',
};

export const colorToHoverColor = {
  primaryOrange: COLORS.primaryOrange,
  darkGrayFont: COLORS.primaryOrange,
  white: COLORS.primaryOrange,
};

export const StyledButton = styled.button`
  font-size: 14px;

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
    padding: 8px 20px;
    border: 1px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: white;
    background-color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;
    border-radius: 5px;
    background-color: white;

    &:hover {
      cursor: pointer;
      background-color: white !important;
      color: ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }} !important;
    }
  }


  &.custom-primary-inverted {
    padding: 8px 20px;
    border: 1px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryOrange;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryOrange;
    }} !important;
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
    border-radius: 25px;

    &:hover {
      cursor: pointer;
      background-color: ${(props) => {
        return colorToHoverBackgroundColor[props.color];
      }};
      color: ${(props) => {
        return colorToHoverColor[props.color];
      }} !important;
    }

    &.disabled {
      border-color: ${COLORS.gray};
      color: ${COLORS.gray} !important;

      &:hover {
        background-color: white;
        cursor: default;
      }
    }
  }
`;
