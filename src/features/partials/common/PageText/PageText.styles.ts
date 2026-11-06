import { css, styled } from 'styled-components';
import { Button, SimpleLink } from '@/src/components/ui';
import { COLORS } from '@/src/constants/styles';
import { marginLargeBottom, marginLargeTop } from '@/src/styles/margins';

/**
 * Text and title styles shared by the public pages. The values (and their `!important`
 * flags) are those these pages have always rendered with: do not "clean them up", the
 * pages must stay pixel-identical.
 */

const bold = css`
  font-weight: 700;
`;

const primaryColor = css`
  color: ${COLORS.primaryBlue} !important;
`;

/** Centered, horizontally auto-margined block. */
const centeredBlock = css`
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
`;

/** Space above a centered block that follows another element. */
const spacedAfterSibling = css`
  &:not(:first-child) {
    margin-top: 30px;
  }
`;

export const StyledBold = styled.span`
  ${bold}
`;

export const StyledBoldPrimary = styled.span`
  ${bold}
  ${primaryColor}
`;

export const StyledPrimary = styled.span`
  ${primaryColor}
`;

export const StyledBoldH3 = styled.h3`
  ${bold}
`;

/** Bold h2 with a 40px bottom margin. */
export const StyledBoldH2 = styled.h2`
  ${bold}
  margin-bottom: 40px !important;
`;

/** Centered bold title without top margin. */
export const StyledCenteredTitleH1 = styled.h1`
  ${bold}
  ${centeredBlock}
  margin-top: 0 !important;
  ${marginLargeBottom}
`;

export const StyledCenteredTitleH2 = styled.h2`
  ${bold}
  ${centeredBlock}
  margin-top: 0 !important;
  ${marginLargeBottom}
`;

/** Same as the centered title, with a fixed 40px bottom margin. */
export const StyledCenteredTitleH2Medium = styled.h2`
  ${bold}
  ${centeredBlock}
  margin-top: 0 !important;
  margin-bottom: 40px !important;
`;

/** Centered sub-title. */
export const StyledCenteredSubtitleH3 = styled.h3`
  ${centeredBlock}
  ${spacedAfterSibling}
  ${marginLargeBottom}
`;

export const StyledCenteredSubtitleH4 = styled.h4`
  ${centeredBlock}
  ${spacedAfterSibling}
  ${marginLargeBottom}
`;

/** Centered italic paragraph. */
export const StyledCenteredItalicP = styled.p`
  text-align: center !important;
  font-style: italic;
`;

export const StyledItalicPrimary = styled.span`
  font-style: italic;
  ${primaryColor}
`;

export const StyledCenteredText = styled.div`
  text-align: center !important;
`;

/** Bold link. */
export const StyledBoldLink = styled(SimpleLink)`
  ${bold}
`;

/** Button with a large top margin. */
export const StyledLargeTopButton = styled(Button)`
  ${marginLargeTop}
`;

/** Primary-colored link: the primary color also wins on hover. */
export const StyledPrimaryLink = styled(SimpleLink)`
  ${primaryColor}
`;
