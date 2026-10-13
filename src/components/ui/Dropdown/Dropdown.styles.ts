import { styled } from 'styled-components';
import { Color, COLORS } from '@/src/constants/styles';
import { TextSize } from '../Text';
import { sizesPx } from '../Text/Text.utils';

export const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledDropdownMenu = styled.div<{
  $openDirection: 'left' | 'right';
  size?: 'small' | 'large';
}>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 10px);
  background-color: white;
  border: 1px solid #ececec;
  border-radius: 20px;
  box-shadow: 0 4px 4px 0px #0000000d;
  z-index: 1000;
  min-width: ${({ size }) => {
    return size === 'large' ? '250px' : '200px';
  }};
  ${({ $openDirection }) => {
    return $openDirection === 'right' ? 'left: 0;' : '';
  }}
  ${({ $openDirection }) => {
    return $openDirection === 'left' ? 'right: 0;' : '';
  }}
  overflow: hidden;
`;

export const StyledDropdownMenuItem = styled.div<{
  $device: 'desktop' | 'mobile';
  size?: TextSize;
  $color?: Color;
}>`
  color: ${({ $color }) => {
    return $color ? COLORS[$color] : COLORS.black;
  }};
  font-size: ${({ $device, size }) =>
    (size ? sizesPx[$device][size] : undefined) || sizesPx[$device].normal}px;
  cursor: pointer;
  padding: 15px 20px;
  &:hover,
  &:focus-visible {
    color: ${({ $color }) => {
      return $color ? COLORS[$color] : COLORS.primaryBlue;
    }};
    background-color: ${COLORS.hoverBlue};
  }
  &:focus-visible {
    outline: 2px solid ${COLORS.primaryBlue};
    outline-offset: -2px;
  }
`;

export const StyledDropdownMenuItemContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

export const StyledDropdownMenuItemSeparator = styled.div`
  border-top: 1px solid #ececec;
`;

export const StyledDropdownToggleContainer = styled.div`
  display: flex;
  height: 100%;
`;

// Toggle rendered as a native button: same box as the container above
export const StyledDropdownToggleButton = styled.button`
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  &:focus-visible {
    outline: 2px solid ${COLORS.primaryBlue};
    outline-offset: 2px;
  }
`;
