import styled from 'styled-components';
import { TextSize } from '../Text';
import { sizesPx } from '../Text/Text.utils';
import { COLORS } from 'src/constants/styles';

export const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledDropdownMenu = styled.div<{
  openDirection: 'left' | 'right';
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
  ${({ openDirection }) => {
    return openDirection === 'right' ? 'left: 0;' : '';
  }}
  ${({ openDirection }) => {
    return openDirection === 'left' ? 'right: 0;' : '';
  }}
  overflow: hidden;
`;

export const StyledDropdownMenuItem = styled.div<{
  device: string;
  size?: TextSize;
}>`
  color: ${COLORS.black};
  font-size: ${({ device, size }) =>
    sizesPx[device][size] || sizesPx[device].normal}px;
  cursor: pointer;
  padding: 15px 20px;
  &:hover {
    color: ${COLORS.primaryBlue};
    background-color: ${COLORS.hoverBlue};
  }
`;

export const StyledDropdownMenuItemSeparator = styled.div`
  border-top: 1px solid #ececec;
`;

export const StyledDropdownToggleContainer = styled.div`
  display: flex;
  height: 100%;
`;
