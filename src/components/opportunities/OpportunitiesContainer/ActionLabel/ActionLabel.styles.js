import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';
import {
  colorToHoverBackgroundColor,
  colorToHoverColor,
} from 'src/components/utils/Button/styles';

export const Container = styled.div`
  font-family: Poppins, sans-serif;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  font-size: 12px;
  line-height: 12px;
  border-radius: 25px;

  border: 0.5px solid
    ${({ color, hoverAnimation }) => {
      return hoverAnimation
        ? 'transparent'
        : COLORS[color] || COLORS.primaryOrange;
    }};
  color: ${({ color }) => {
    return COLORS[color] || COLORS.primaryOrange;
  }} !important;
  path {
    fill: ${({ fill, color }) => {
      return fill ? COLORS[color] || COLORS.primaryOrange : 'transparent';
    }} !important;
  }

  .action-label {
    ${({ disabled, hoverAnimation }) => {
      return (
        !disabled &&
        hoverAnimation &&
        css`
          max-width: 0;
          white-space: nowrap;
          text-align: right;
          overflow: hidden;
          opacity: 0;
        `
      );
    }}
  }

  &:hover {
    ${({ disabled, hoverAnimation }) => {
      if (!disabled && !hoverAnimation) {
        return css`
          cursor: pointer;
          background-color: ${({ color }) => {
            return colorToHoverBackgroundColor[color];
          }};
          color: ${({ color }) => {
            return colorToHoverColor[color];
          }} !important;
        `;
      }
      if (!disabled && hoverAnimation) {
        return css`
          &:hover {
            cursor: pointer;
            transition: 0.6s ease-out;
            border-color: ${({ color }) => {
              return COLORS[color] || COLORS.primaryOrange;
            }};

            .action-label {
              max-width: 100%;
              transition: max-width 0.6s;
              opacity: 1;
            }
          }
        `;
      }
    }}
  }
`;

export const LabelContainer = styled.div`
  flex: 1;
`;

export const IconContainer = styled.div`
  margin-left: 8px;
`;
