import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledButtonIcon = styled.a`
  color: ${COLORS.black};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    // opacity: 0.6;
  }
`;
