import styled, { keyframes, css } from 'styled-components';
import { COLORS } from 'src/constants/styles';
import {
  colorToHoverBackgroundColor,
  colorToHoverColor,
} from 'src/components/utils/Button/styles';

const slideInRight = keyframes`
  0% {
    transform: translateX(1000px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const Container = styled.div`
  font-family: Poppins, sans-serif;
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  font-size: 12px;
  line-height: 12px;
  border: 0.5px solid
    ${({ color }) => {
      return COLORS[color] || COLORS.primaryOrange;
    }};
  color: ${({ color }) => {
    return COLORS[color] || COLORS.primaryOrange;
  }} !important;

  polygon {
    fill: ${({ fill, color }) => {
      return fill ? COLORS[color] || COLORS.primaryOrange : 'transparent';
    }};
  }

  border-radius: 25px;

  &:hover {
    ${({ disabled }) => {
      return (
        !disabled &&
        css`
          cursor: pointer;
          background-color: ${({ color }) => {
            return colorToHoverBackgroundColor[color];
          }};
          color: ${({ color }) => {
            return colorToHoverColor[color];
          }} !important;
        `
      );
    }}
        //animation: ${slideInRight} 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;;;;;;;;;;;
  }
  /*

  ${({ hoverAnimation }) => {
    return (
      hoverAnimation &&
      css`
        &:hover {
          position: fixed;
          transform: translate(0%, -30%);
          transition: 0.3s ease-out;
        }
      `
    );
  }} */
`;

export const LabelContainer = styled.div`
  flex: 1;
`;

export const IconContainer = styled.div`
  margin-left: 8px;
`;
