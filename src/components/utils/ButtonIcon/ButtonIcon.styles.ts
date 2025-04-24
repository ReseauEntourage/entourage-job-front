import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledButtonIcon = styled.a`
  color: ${({ color }) => {
    return COLORS[color] || COLORS.primaryBlue;
  }};
  display: flex;
  align-items: center;
  justify-content: center;
`;
