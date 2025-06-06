import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackLink = styled.a`
  display: flex !important;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  color: ${COLORS.darkGray} !important;
  &:visited {
    color: ${COLORS.darkGray} !important;
  }
  &:hover {
    color: ${COLORS.primaryBlue} !important;
    svg {
      fill: ${COLORS.primaryBlue} !important;
    }
  }
  svg {
    height: 100%
    margin-right: 8px;
    fill: ${COLORS.darkGray};
  }
`;
