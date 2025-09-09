import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackLink = styled.a`
  display: flex !important;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  color: ${COLORS.darkGray} !important;
  font-size: 12px;
  &:visited {
    color: ${COLORS.darkGray} !important;
  }
`;
