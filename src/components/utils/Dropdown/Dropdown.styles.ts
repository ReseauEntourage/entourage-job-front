import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

export const StyledDropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: absolute;
  top: calc(100% + 10px);
  background-color: white;
  border: 1px solid #ececec;
  border-radius: 20px;
  box-shadow: 0 4px 4px 0px #0000000d;
  padding: 25px;
  z-index: 1000;
  min-width: 200px;
  ${({ openDirection }) => {
    return openDirection === 'right' ? 'left: 0;' : '';
  }}
  ${({ openDirection }) => {
    return openDirection === 'left' ? 'right: 0;' : '';
  }}
`;

export const StyledDropdownMenuItem = styled.div`
  color: ${COLORS.black};
  font-size: 14px;
  cursor: pointer;
  :hover {
    color: ${COLORS.primaryBlue};
  }
`;

export const StyledDropdownMenuItemSeparator = styled.div`
  border-top: 1px solid #ececec;
`;

export const StyledDropdownToggleContainer = styled.div`
  display: flex;
  height: 100%;
`;
