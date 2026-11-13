import { keyframes, styled } from 'styled-components';

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
`;

const dash = keyframes`
  0% {
    stroke-dashoffset: 88px;
  }
  50% {
    stroke-dashoffset: 22px;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 88px;
    transform: rotate(450deg);
  }
`;

/** Circle whose arc grows and shrinks while it turns. It takes the color of the text. */
export const StyledDashSpinner = styled.div`
  display: inline-block;
  color: inherit;
  fill: currentcolor;
  line-height: 0;

  > svg {
    animation: ${rotate} 1.4s linear infinite;
  }

  > svg > circle {
    stroke: currentcolor;
    stroke-width: 1;
    stroke-linecap: round;
    stroke-dasharray: 88px;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: ${dash} 1.4s ease-in-out infinite;
  }
`;
