import styled from 'styled-components';
import { LINE_HEIGHT_MULTIPLIER } from '../Text/Text.utils';
import { COLORS } from 'src/constants/styles';
import { ButtonProps, ButtonSize } from './Button.types';
import {
  BUTTON_CIRCLE_RADIUS,
  BUTTON_DEFAULT_RADIUS,
  BUTTON_ROUNDED_RADIUS,
  BUTTON_SIZES,
  BUTTON_STYLES,
} from './button.constants';

export const StyledButton = styled.button<{
  variant: ButtonProps['variant'];
  size: ButtonSize;
  rounded: ButtonProps['rounded'];
  color?: ButtonProps['color'];
}>`
  &.button {
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    font-family: 'Poppins', sans-serif;
    font-weight: 400;
    text-align: center;
    line-height: ${({ size }) =>
      BUTTON_SIZES[size].fontSize * LINE_HEIGHT_MULTIPLIER}px;

    border: ${(props) => {
        return BUTTON_STYLES.border[props.variant || 'default'] || COLORS.white;
      }}
      solid
      ${(props) => {
        return BUTTON_STYLES.borderSize[props.variant || 'default'] || '1px';
      }} !important;

    background-color: ${({ variant }) => {
      return (
        BUTTON_STYLES.backgroundColor[variant || 'default'] || COLORS.white
      );
    }} !important;

    color: ${({ color, variant }) => {
      if (color) {
        return COLORS[color];
      }
      return BUTTON_STYLES.color[variant || 'default'] || COLORS.white;
    }} !important;

    border-radius: ${({ rounded }) => {
      if (rounded === 'circle') {
        return BUTTON_CIRCLE_RADIUS;
      }
      return rounded ? BUTTON_ROUNDED_RADIUS : BUTTON_DEFAULT_RADIUS;
    }};

    padding: ${({ rounded, variant, size }) => {
      if (rounded === 'circle') {
        return `6px`;
      }
      if (variant === 'text') {
        return `0px`;
      }
      return BUTTON_SIZES[size].padding;
    }};

    font-size: ${({ size }) => {
      return `${BUTTON_SIZES[size].fontSize}px`;
    }};

    &:hover {
      transition: 0.2s ease-in-out;

      background-color: ${({ variant }) => {
        return (
          BUTTON_STYLES.hoverBackgroundColor[variant || 'default'] ||
          COLORS.white
        );
      }} !important;

      border: ${({ variant }) => {
          return (
            BUTTON_STYLES.hoverBorder[variant || 'default'] || COLORS.white
          );
        }}
        solid 1px !important;

      color: ${({ variant }) => {
        return BUTTON_STYLES.hoverColor[variant || 'default'] || COLORS.white;
      }} !important;
    }

    &:disabled {
      background-color: ${COLORS.gray} !important;
      color: ${COLORS.darkGray} !important;
      border: ${COLORS.gray} solid 1px !important;
      cursor: not-allowed;
      pointer-events: none;
    }
  }
`;

export const StyledCenteredButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 0px;
`;
