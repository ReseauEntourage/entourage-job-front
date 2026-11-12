import { css, styled } from 'styled-components';
import { SimpleLink } from '@/src/components/ui';
import { BREAKPOINTS, COLORS } from '@/src/constants/styles';
import { marginLargeBottom } from '@/src/styles/margins';

type Side = 'left' | 'right';

/** Margin of 40px (70px on wide screens) on the given side. */
const marginLargeOnSide = (side: Side) => css`
  margin-${side}: 40px !important;
  @media (min-width: ${BREAKPOINTS.large}px) {
    margin-${side}: 70px !important;
  }
`;

const flexColumn = css`
  display: flex;
  flex-direction: column;
`;

const textColor = css`
  color: ${COLORS.black} !important;
`;

/** Full-height banner: a cover picture, its overlay and a centered content. */
export const StyledPartnersBanner = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  vertical-align: middle;
  backface-visibility: hidden;
  overflow: hidden;
`;

const fillBanner = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

/** Picture covering the banner (the image is given inline). */
export const StyledPartnersBannerPicture = styled.div`
  ${fillBanner}
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

export const StyledPartnersBannerOverlay = styled.div<{
  $variant: 'primary' | 'dark';
}>`
  ${fillBanner}
  background: ${({ $variant }) =>
    $variant === 'primary' ? COLORS.overlayPrimary : COLORS.overlayDark};
`;

/** Content centered over the banner. */
export const StyledPartnersBannerContent = styled.div`
  position: absolute !important;
  top: 50%;
  left: 50%;
  box-sizing: border-box;
  width: max-content;
  max-width: 100%;
  padding: 30px;
  transform: translate(-50%, -50%);

  > :last-child {
    margin-bottom: 0;
  }
`;

export const StyledPartnersBannerTitle = styled.h1`
  display: block;
  font-weight: 700;
  text-align: center !important;
  margin: 0 !important;
`;

export const StyledPartnersCarouselTitle = styled.h2`
  display: block;
  font-weight: 700;
  margin: 0 auto 30px;
  text-align: center !important;
`;

/** Column of logos (the carousel of 5 partners is narrower than the page). */
export const StyledPartnersLogosColumn = styled.div`
  ${flexColumn}
  align-items: center;
`;

export const StyledPartnersLogos = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 450px;
  }
`;

/** Content of a partner section: at least a screen high, centered. */
export const StyledPartnerItemContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

export const StyledPartnerItemLink = styled(SimpleLink)`
  ${flexColumn}
  justify-content: center;
  align-items: center;
`;

export const StyledPartnerItemTitle = styled.h2`
  font-weight: 700;
  color: ${COLORS.primaryBlue} !important;
  text-align: center !important;
  ${marginLargeBottom}
`;

export const StyledPartnerItemLogoCell = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledPartnerItemLogos = styled.div`
  ${flexColumn}
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 300px;
  max-width: 100%;
`;

export const StyledPartnerItemTextCell = styled.div`
  ${flexColumn}
  align-items: center;
`;

export const StyledPartnerItemDescription = styled.div`
  ${flexColumn}
`;

export const StyledPartnerItemDescriptionText = styled.h4<{
  $side: Side;
  $hasAnswer: boolean;
}>`
  text-align: ${({ $side }) => $side} !important;
  ${({ $hasAnswer }) =>
    $hasAnswer &&
    css`
      margin-bottom: 40px !important;
    `}
`;

/** Testimonial of the partner, pushed away from the picture side. */
export const StyledPartnerItemTestimonial = styled.div<{ $side: Side }>`
  ${flexColumn}
  align-items: stretch;
  ${textColor}
  ${({ $side }) => marginLargeOnSide($side)}
  margin-top: 40px !important;
`;

export const StyledPartnerItemQuestion = styled.p<{ $side: Side }>`
  flex: 1;
  font-weight: 700;
  text-align: ${({ $side }) => $side} !important;
`;

export const StyledPartnerItemAnswerRow = styled.div`
  display: flex;
`;

export const StyledPartnerItemOpeningQuote = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: 10px !important;
`;

export const StyledPartnerItemAnswer = styled.div`
  flex: 1;
`;

export const StyledPartnerItemAnswerText = styled.p<{ $side: Side }>`
  font-style: italic;
  text-align: ${({ $side }) => $side} !important;
  margin-top: 10px !important;
  margin-bottom: 10px !important;
`;

export const StyledPartnerItemAuthor = styled.div<{ $side: Side }>`
  flex: 1;
  text-align: ${({ $side }) => $side} !important;
  margin-top: 10px !important;
  ${textColor}
`;

export const StyledPartnerItemClosingQuote = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 10px !important;
`;
