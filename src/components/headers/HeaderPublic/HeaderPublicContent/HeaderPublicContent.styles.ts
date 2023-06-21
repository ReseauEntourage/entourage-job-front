import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledPublicItem = styled.a`
  border-bottom: ${({ color, selected }) => {
      return selected ? COLORS[color] || COLORS.white : 'transparent';
    }}
    solid 1px;
  color: ${({ color }) => {
    return COLORS[color] || COLORS.white;
  }};
`;
