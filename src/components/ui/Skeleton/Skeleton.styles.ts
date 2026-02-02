import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledSkeletonLoader = styled.div<{
  width?: string;
  height?: string;
  inverted?: boolean;
}>`
  display: flex;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => props.height || '100%'};
  border-radius: 16px;
  border: 1px solid ${COLORS.gray};
  background: linear-gradient(
    90deg,
    ${(props) => (props.inverted ? COLORS.skeletonDark : COLORS.skeletonLight)}
      25%,
    ${(props) => (props.inverted ? COLORS.skeletonLight : COLORS.skeletonDark)}
      50%,
    ${(props) => (props.inverted ? COLORS.skeletonDark : COLORS.skeletonLight)}
      75%
  );
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;
