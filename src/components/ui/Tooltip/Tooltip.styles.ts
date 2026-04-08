import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export const StyledTooltipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

// Each placement anchors to a specific edge of the trigger via top/left,
// then uses transform to shift the tooltip away without needing its own dimensions.
const placementTransform = (placement: TooltipPlacement) => {
  switch (placement) {
    case 'top':
      return css`
        transform: translateY(-100%);
      `;
    case 'left':
      return css`
        transform: translate(-100%, -50%);
      `;
    case 'right':
      return css`
        transform: translateY(-50%);
      `;
    case 'bottom':
    default:
      return css``;
  }
};

export const StyledTooltipContent = styled.div<{
  width?: number;
  top: number;
  left: number;
  placement: TooltipPlacement;
}>`
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  width: ${({ width }) => (width ? `${width}px` : '300px')};
  padding: 14px 16px;
  background: ${COLORS.lightGray};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.24);
  font-size: 13px;
  line-height: 1.5;
  color: ${COLORS.black};
  z-index: 9999;
  ${({ placement }) => placementTransform(placement)}
`;
