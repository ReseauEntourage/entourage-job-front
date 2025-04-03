import styled, { css } from 'styled-components';
import {
  colorToHoverBackgroundColor,
  colorToHoverColor,
} from 'src/components/utils/Button/ButtonOld.styles';
import { COLORS } from 'src/constants/styles';

export const StyledContainer = styled.div`
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
        : COLORS[color] || COLORS.primaryBlue;
    }};
  color: ${({ color }) => {
    return COLORS[color] || COLORS.primaryBlue;
  }} !important;

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
              return COLORS[color] || COLORS.primaryBlue;
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

export const StyledLabelContainer = styled.div`
  flex: 1;
`;

export const StyledIconContainer = styled.div`
  margin-left: 8px;
`;
