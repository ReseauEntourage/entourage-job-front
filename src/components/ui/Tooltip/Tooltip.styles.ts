import styled, { css } from 'styled-components';
import { COLORS } from 'src/constants/styles';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export const StyledTooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const placementStyles = (placement: TooltipPlacement) => {
  switch (placement) {
    case 'top':
      return css`
        bottom: calc(100% + 8px);
        right: 0;
      `;
    case 'left':
      return css`
        right: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      `;
    case 'right':
      return css`
        left: calc(100% + 8px);
        top: 50%;
        transform: translateY(-50%);
      `;
    case 'bottom':
    default:
      return css`
        top: calc(100% + 8px);
        right: 0;
      `;
  }
};

export const StyledTooltipContent = styled.div<{
  width?: number;
  placement: TooltipPlacement;
}>`
  position: absolute;
  width: ${({ width }) => (width ? `${width}px` : '300px')};
  padding: 14px 16px;
  background: ${COLORS.lightGray};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.24);
  font-size: 13px;
  line-height: 1.5;
  color: ${COLORS.black};
  z-index: 10;
  ${({ placement }) => placementStyles(placement)}
`;
