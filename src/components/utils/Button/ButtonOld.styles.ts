import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const colorToHoverBackgroundColor = {
  primaryBlue: COLORS.hoverBlue,
  darkGray: 'transparent',
  white: 'transparent',
};

export const colorToHoverColor = {
  primaryBlue: COLORS.primaryBlue,
  darkGray: COLORS.primaryBlue,
  white: COLORS.primaryBlue,
};

export const colorToBackgroundColor = {
  primaryBlue: COLORS.white,
  darkGray: COLORS.white,
  white: 'transparent',
};

export const ButtonStyle = css`
  font-size: 14px;
  line-height: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  :not(.rounded) {
    padding: 11px 22px !important;
  }
  scroll-behavior: smooth;

  :not(.rounded) {
    > svg:first-child {
      margin-right: 8px;
    }

    > svg:last-child {
      margin-left: 8px;
    }
  }

  &:hover {
    transition: 0.2s ease-in-out;
  }

  &.uk-button-primary,
  &.uk-button-secondary {
    border: 0.5px solid ${COLORS.primaryBlue};

    &:hover {
      background: none;
      color: ${COLORS.primaryBlue};
    }

    &.banner-btn {
      &:hover {
        background-color: rgba(250, 250, 250, 0.8);
        border-color: ${COLORS.primaryBlue};
      }
    }
  }

  &.uk-button-default {
    &:hover {
      /* background-color: ${COLORS.primaryBlue}; */
      border-color: ${COLORS.primaryBlue};
      /* color: white; */
      color: ${COLORS.primaryBlue};
    }
  }

  &.custom-primary {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryBlue;
      }};
    color: white;
    background-color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryBlue;
    }} !important;

    border-radius: 40px;

    @media (hover: hover) {
      &:hover {
        cursor: pointer;
        background-color: white !important;
        color: ${(props) => {
          return COLORS[props.color] || COLORS.primaryBlue;
        }} !important;
      }
    }
  }

  &.custom-primary-inverted {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryBlue;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryBlue;
    }} !important;

    border-radius: 40px;
    background-color: transparent;

    @media (hover: hover) {
      &:hover {
        cursor: pointer;
        background-color: ${(props) => {
          return colorToHoverBackgroundColor[props.color] || COLORS.hoverBlue;
        }};
        color: ${(props) => {
          return colorToHoverColor[props.color] || COLORS.primaryBlue;
        }} !important;
        border: 0.5px solid
          ${(props) => {
            return colorToHoverColor[props.color] || COLORS.primaryBlue;
          }};
      }
    }
  }

  &.custom-text {
    font-family: Poppins, sans-serif;
    padding: 8px 20px;
    border: none;
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryBlue;
    }} !important;

    background-color: transparent;

    @media (hover: hover) {
      &:hover {
        cursor: pointer;
        opacity: 0.6 !important;
      }
    }
  }

  &.custom-secondary {
    font-family: Poppins, sans-serif;
    padding: 6px 15px;
    background-color: ${(props) => {
      return colorToBackgroundColor[props.color] || COLORS.white;
    }} !important;

    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryBlue;
      }};
    color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryBlue;
    }} !important;

    border-radius: 40px;

    @media (hover: hover) {
      &:hover {
        cursor: pointer;
        background-color: ${(props) => {
          return colorToHoverBackgroundColor[props.color] || COLORS.hoverBlue;
        }} !important;

        color: ${(props) => {
          return colorToHoverColor[props.color] || COLORS.primaryBlue;
        }} !important;

        border: 0.5px solid
          ${(props) => {
            return colorToHoverColor[props.color] || COLORS.primaryBlue;
          }};
      }
    }
  }

  &.custom-secondary-inverted {
    font-family: Poppins, sans-serif;
    padding: 6px 15px;
    color: white;

    border: 0.5px solid
      ${(props) => {
        return COLORS[props.color] || COLORS.primaryBlue;
      }};
    background-color: ${(props) => {
      return COLORS[props.color] || COLORS.primaryBlue;
    }} !important;

    border-radius: 40px;

    @media (hover: hover) {
      &:hover {
        cursor: pointer;
        background-color: white !important;
        color: ${(props) => {
          return COLORS[props.color] || COLORS.primaryBlue;
        }} !important;
      }
    }
  }

  &.disabled {
    border-color: ${COLORS.gray} !important;
    color: ${COLORS.mediumGray} !important;
    background-color: ${COLORS.lightGray} !important;

    @media (hover: hover) {
      &:hover {
        color: ${COLORS.mediumGray} !important;
        background-color: ${COLORS.lightGray} !important;
        cursor: default !important;
      }
    }
  }

  &.small {
    :not(.rounded) {
      padding: 10px 10px !important;
    }
    font-size: 13px;
    line-height: 16px;
  }

  &.rounded {
    border-radius: 50%;
    padding: 11px !important;
  }
`;

export const StyledButtonOld = styled.button`
  ${ButtonStyle}
`;
