import { styled } from 'styled-components';
import { BACKGROUND_COLORS } from '@/src/components/ui/Background.styles';
import type { SECTION_STYLES } from '@/src/components/variables';
import { BREAKPOINTS } from '@/src/constants/styles';

/** Carousel with its two arrows, set 40px in from the sides to leave them room. */
export const StyledCarousel = styled.div`
  position: relative;
  min-width: 0;
  max-width: 100%;
  margin-left: 40px !important;
  margin-right: 40px !important;
`;

/** Rounded frame cropping the slides. */
export const StyledCarouselViewport = styled.div<{ $style?: SECTION_STYLES }>`
  overflow: hidden;
  border-radius: 5px;
  background-color: ${({ $style }) =>
    ($style && BACKGROUND_COLORS[$style]) || 'transparent'};
`;

export const StyledCarouselSlides = styled.div<{ $maxWidth: number }>`
  max-width: ${({ $maxWidth }) => $maxWidth}px;

  /* Same compositing as the slider it replaces: keeps the text anti-aliasing unchanged. */
  .swiper-wrapper {
    will-change: transform;
  }

  /* Slides never get wider than the carousel, whatever their content. */
  .swiper-slide {
    max-width: 100%;
  }
`;

/** Arrows are placed beside the carousel and only shown from the desktop breakpoint. */
export const StyledCarouselArrows = styled.div`
  display: none;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    display: block;
  }
`;

export const StyledCarouselArrow = styled.a<{ $side: 'left' | 'right' }>`
  position: absolute !important;
  top: 50%;
  ${({ $side }) => ($side === 'left' ? 'right: 100%;' : 'left: 100%;')}
  width: max-content;
  max-width: calc(100% - 30px);
  margin: 15px;
  transform: translateY(-50%) translateY(-15px);
`;
