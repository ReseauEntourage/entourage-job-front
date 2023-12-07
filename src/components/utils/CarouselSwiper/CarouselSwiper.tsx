/* eslint import/no-unresolved: "off" */
import React from 'react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {
  StyledSwiperSlide,
  StyledSwiperContainer,
} from './CarouselSwiper.styles';

interface CarouselSwiperProps {
  slides: React.ReactNode[];
  backgroundColor?: string;
  slidesPerview?: number;
}

export const CarouselSwiper = ({
  slides,
  backgroundColor,
  slidesPerview,
}: CarouselSwiperProps) => {
  if (slides.length === 0) {
    return null;
  }
  return (
    <StyledSwiperContainer backgroundColor={backgroundColor}>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        navigation
        threshold={2}
        autoplay
        pagination={{
          clickable: true,
        }}
        slidesPerView={slidesPerview || 1}
      >
        {slides.map((slide) => {
          return <StyledSwiperSlide>{slide}</StyledSwiperSlide>;
        })}
      </Swiper>
    </StyledSwiperContainer>
  );
};
