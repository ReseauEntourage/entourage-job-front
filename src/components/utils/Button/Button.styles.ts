import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';
import { ButtonProps } from './ButtonProps';

// Color config
const buttonStyles = {
  border: {
    default: COLORS.gray,
    primary: COLORS.primaryBlue,
    secondary: COLORS.primaryBlue,
  },
  backgroundColor: {
    default: COLORS.white,
    primary: COLORS.primaryBlue,
    secondary: COLORS.transparent,
  },
  color: {
    default: COLORS.black,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
  },
  hoverBackgroundColor: {
    default: COLORS.hoverWhite,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
  },
  hoverColor: {
    default: COLORS.primaryBlue,
    primary: COLORS.primaryBlue,
    secondary: COLORS.white,
  },
  hoverBorder: {
    default: COLORS.primaryBlue,
    primary: COLORS.primaryBlue,
    secondary: COLORS.white,
  },
};

export const StyledButton = styled.button<ButtonProps>`
  &.button {
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    text-align: center;
    line-height: 17px;

    border: ${(props: ButtonProps) => {
        return buttonStyles.border[props.variant || 'default'] || COLORS.white;
      }}
      solid 1px !important;

    background-color: ${(props: ButtonProps) => {
      return (
        buttonStyles.backgroundColor[props.variant || 'default'] || COLORS.white
      );
    }} !important;

    color: ${(props: ButtonProps) => {
      return buttonStyles.color[props.variant || 'default'] || COLORS.white;
    }} !important;

    border-radius: ${(props: ButtonProps) => {
      return props.rounded ? `20px` : `5px`;
    }}!important;

    // SIZES
    &.button-small {
      padding: 6px 10px;
      font-size: 12px;
    }
    &.button-large {
      padding: 11px 20px;
      font-size: 14px;
    }

    &:hover {
      transition: 0.2s ease-in-out;

      background-color: ${(props: ButtonProps) => {
        return (
          buttonStyles.hoverBackgroundColor[props.variant || 'default'] ||
          COLORS.white
        );
      }} !important;

      border: ${(props: ButtonProps) => {
          return (
            buttonStyles.hoverBorder[props.variant || 'default'] || COLORS.white
          );
        }}
        solid 1px !important;

      color: ${(props: ButtonProps) => {
        return (
          buttonStyles.hoverColor[props.variant || 'default'] || COLORS.white
        );
      }} !important;
    }
  }
`;

export const StyledButtonMock = styled.div`
  ${StyledButton}
`;

export const StyledCenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 16px;
`;
