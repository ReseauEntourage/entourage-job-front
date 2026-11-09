import { styled } from 'styled-components';
import { Grid } from '@/src/components/ui';
import { BREAKPOINTS } from '@/src/constants/styles';

/** Site map, shown on desktop only or on mobile only. */
export const StyledSiteMapGrid = styled(Grid)<{ $mobileOnly: boolean }>`
  ${({ $mobileOnly }) =>
    $mobileOnly
      ? `@media (min-width: ${BREAKPOINTS.desktop}px) {
          display: none !important;
        }`
      : `@media (max-width: ${BREAKPOINTS.desktop - 1}px) {
          display: none !important;
        }`}
`;

/**
 * Cell holding both site maps. On mobile it is followed by a 30px gap more than on desktop:
 * the hidden desktop site map used to sit in a cell of its own, which was spaced like a row.
 */
export const StyledSiteMaps = styled.div`
  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding-bottom: 30px;
  }
`;
