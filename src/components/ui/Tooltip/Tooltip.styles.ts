import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledTooltipWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

export const StyledTooltipContent = styled.div<{ width?: number }>`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: ${({ width }) => (width ? `${width}px` : '300px')};
  padding: 14px 16px;
  background: ${COLORS.lightGray};
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.24);
  font-size: 13px;
  line-height: 1.5;
  color: ${COLORS.black};
  z-index: 10;
`;
