import { css } from 'styled-components';
import { BREAKPOINTS } from '@/src/constants/styles';

/**
 * Large vertical margins of the public pages: 40px, 70px on wide screens.
 * The `!important` flag is kept on purpose: these margins always won over the
 * default margins of titles, paragraphs and buttons.
 */
export const marginLargeBottom = css`
  margin-bottom: 40px !important;
  @media (min-width: ${BREAKPOINTS.large}px) {
    margin-bottom: 70px !important;
  }
`;

export const marginLargeTop = css`
  margin-top: 40px !important;
  @media (min-width: ${BREAKPOINTS.large}px) {
    margin-top: 70px !important;
  }
`;
