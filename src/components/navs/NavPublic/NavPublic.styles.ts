import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledPublicItem = styled.div<{
  color: string;
  selected: boolean;
  isMenu: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: ${({ color, selected }) => {
      return selected ? COLORS[color] || COLORS.white : 'transparent';
    }}
    solid 1px;
  font-weight: ${({ selected }) => (selected ? '600' : '400')};
  color: ${({ color }) => {
    return COLORS[color] || COLORS.white;
  }};
  font-size: 12px;
  ${({ isMenu }) => (isMenu ? 'cursor: pointer;' : '')}
  height: 100%;
  width: 100%;
`;
