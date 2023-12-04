import styled from 'styled-components';
import { COLORS } from 'src/constants/styles';

export const StyledBackLink = styled.a`
  display: flex !important;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  color: ${COLORS.darkGrayFont} !important;
  &:visited {
    color: ${COLORS.darkGrayFont} !important;
  }
  &:hover {
    color: ${COLORS.primaryOrange} !important;
    svg {
      fill: ${COLORS.primaryOrange} !important;
    }
  }
  svg {
    width: 8px;
    fill: ${COLORS.darkGrayFont};
  }
`;
