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
}

export const CarouselSwiper = ({ slides, backgroundColor }: CarouselSwiperProps) => {
  if (slides.length === 0) {
    return null;
  }
  return (
    <StyledSwiperContainer backgroundColor={backgroundColor}>
      <Swiper
        modules={[Pagination, Autoplay, Navigation]}
        threshold={2}
        navigation
        autoplay
        pagination={{
          clickable: true,
        }}
      >
        {slides.map((slide) => {
          return <StyledSwiperSlide>{slide}</StyledSwiperSlide>;
        })}
      </Swiper>
    </StyledSwiperContainer>
  );
};
