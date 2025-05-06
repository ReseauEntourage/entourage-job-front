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
    secondary: COLORS.white,
  },
  color: {
    default: COLORS.black,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
  },
  hoverBackgroundColor: {
    default: COLORS.hoverWhite,
    primary: COLORS.darkBlue,
    secondary: COLORS.hoverBlue,
  },
  hoverColor: {
    default: COLORS.primaryBlue,
    primary: COLORS.white,
    secondary: COLORS.primaryBlue,
  },
  hoverBorder: {
    default: COLORS.primaryBlue,
    primary: COLORS.darkBlue,
    secondary: COLORS.primaryBlue,
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
      if (props.rounded === 'circle') {
        return `50%`;
      }
      return props.rounded ? `20px` : `5px`;
    }}!important;

    padding: ${(props: ButtonProps) => {
      if (props.rounded === 'circle') {
        return `6px`;
      }
      return props.size === 'large' ? `11px 20px` : `6px 10px`;
    }}!important;

    font-size: ${(props: ButtonProps) => {
      return props.size === 'large' ? `14px` : `12px`;
    }}!important;

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
