import { css, styled } from 'styled-components';
import { Button, Grid, SimpleLink } from '@/src/components/ui';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';

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

/** Column of the site map: the title and its links, centered in their cell. */
export const StyledSiteMapColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px !important;
`;

export const StyledSiteMapColumnContent = styled.div<{ $centered: boolean }>`
  display: flex;
  flex-direction: column;
  ${({ $centered }) =>
    $centered &&
    css`
      align-items: center;
    `}
`;

export const StyledSiteMapTitle = styled.span`
  font-weight: 700;
`;

const mutedLink = css`
  color: ${COLORS.mutedText} !important;
`;

const smallLink = css`
  font-size: 0.875rem;
  line-height: 1.5;
`;

/** Link under a title of the site map. */
export const StyledSiteMapLink = styled(SimpleLink)`
  ${mutedLink}
  margin-top: 10px !important;
`;

/** Link that is a title of its own in the site map. */
export const StyledSiteMapBoldLink = styled(SimpleLink)`
  font-weight: 700;
`;

/** Sub-link, indented on desktop. */
export const StyledSiteMapSubLink = styled(SimpleLink)<{ $indent: boolean }>`
  ${smallLink}
  ${mutedLink}
  margin-top: 10px !important;
  ${({ $indent }) =>
    $indent &&
    css`
      margin-left: 10px !important;
    `}
`;

/** Legal link at the bottom of the footer. */
export const StyledFooterLegalLink = styled(SimpleLink)`
  ${smallLink}
  ${mutedLink}
`;

export const StyledFooterLoginButton = styled(Button)`
  margin-top: 40px !important;
`;
