import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export type PopoverPlacement = 'top' | 'bottom';
export type PopoverAlign = 'left' | 'right';

export const StyledPopoverWrapper = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
`;

export const StyledPopoverContent = styled.div<{
  placement: PopoverPlacement;
  align: PopoverAlign;
}>`
  position: absolute;
  ${({ placement }) =>
    placement === 'bottom' ? 'top: 100%;' : 'bottom: 100%;'}
  ${({ align }) => (align === 'right' ? 'right: 0;' : 'left: 0;')}
  background: ${COLORS.white};
  border: 1px solid ${COLORS.gray};
  border-radius: 10px;
  padding: 12px 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;
