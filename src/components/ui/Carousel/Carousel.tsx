/* eslint import-x/no-unresolved: "off" */
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import type { SECTION_STYLES } from '@/src/components/variables';
import { GA_TAGS } from '@/src/constants/tags';
import { gaEvent } from '@/src/lib/gtag';
import { LucidIcon } from '../Icons/LucidIcon';
import {
  StyledCarousel,
  StyledCarouselArrow,
  StyledCarouselArrows,
  StyledCarouselSlides,
  StyledCarouselViewport,
} from './Carousel.styles';

/** Delay between two slides, paused while the pointer is over the carousel. */
const AUTOPLAY_DELAY_MS = 2000;

interface CarouselProps {
  style?: SECTION_STYLES;
  children: React.ReactNode;
  /** Widest the slides can get, in px. */
  maxWidth?: number;
}

export const Carousel = ({
  style,
  children,
  maxWidth = 900,
}: CarouselProps) => {
  const { asPath } = useRouter();
  const swiperRef = useRef<SwiperType | null>(null);

  let tag;

  if (asPath.includes('/recruter')) {
    tag = GA_TAGS.PAGE_RECRUTER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/candidat')) {
    tag = GA_TAGS.PAGE_TRAVAILLER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/orienter')) {
    tag = GA_TAGS.PAGE_ORIENTER_CARROUSEL_CLIC;
  }
  if (asPath.includes('/entreprises')) {
    tag = GA_TAGS.PAGE_ENTREPRISES_CARROUSEL_CLIC;
  }

  const go = (direction: 'previous' | 'next') => (event: React.MouseEvent) => {
    event.preventDefault();
    if (direction === 'previous') {
      swiperRef.current?.slidePrev();
    } else {
      swiperRef.current?.slideNext();
    }
    if (tag) {
      gaEvent(tag);
    }
  };

  return (
    <StyledCarousel>
      <StyledCarouselViewport $style={style}>
        <StyledCarouselSlides $maxWidth={maxWidth}>
          <Swiper
            modules={[Autoplay]}
            loop
            slidesPerView={1}
            speed={500}
            autoplay={{
              delay: AUTOPLAY_DELAY_MS,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
          >
            {React.Children.map(children, (child) => (
              <SwiperSlide>{child}</SwiperSlide>
            ))}
          </Swiper>
        </StyledCarouselSlides>
      </StyledCarouselViewport>
      <StyledCarouselArrows>
        <StyledCarouselArrow
          href="#"
          $side="left"
          aria-label="Précédent"
          data-testid="carousel-previous"
          onClick={go('previous')}
        >
          <LucidIcon name="ChevronLeft" size={30} />
        </StyledCarouselArrow>
        <StyledCarouselArrow
          href="#"
          $side="right"
          aria-label="Suivant"
          data-testid="carousel-next"
          onClick={go('next')}
        >
          <LucidIcon name="ChevronRight" size={30} />
        </StyledCarouselArrow>
      </StyledCarouselArrows>
    </StyledCarousel>
  );
};
