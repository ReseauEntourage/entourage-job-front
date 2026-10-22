import { styled } from 'styled-components';
import { COLORS } from '@/src/constants/styles';

// Light grey page background, under the white cards of the help groups pages
export const StyledHelpGroupsPageBackground = styled.div`
  /* Down to the bottom of the screen, even for a short page */
  min-height: 100vh;
  background-color: ${COLORS.lightGray};
`;
