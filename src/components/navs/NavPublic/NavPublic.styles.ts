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
  font-weight: ${({ selected }) => (selected ? '600' : '400')};
  text-decoration: ${({ selected }) => (selected ? 'underline' : 'none')};
  color: ${({ color }) => {
    return COLORS[color] || COLORS.white;
  }};
  font-size: 12px;
  ${({ isMenu }) => (isMenu ? 'cursor: pointer;' : '')}
  height: 100%;
  width: 100%;
`;
