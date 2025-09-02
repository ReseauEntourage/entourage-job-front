/* eslint import/no-unresolved: "off" */
import React from 'react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import { Swiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { v4 as uuid } from 'uuid';
import {
  StyledSwiperSlide,
  StyledSwiperContainer,
} from './CarouselSwiper.styles';

const uuidValue = uuid();

interface CarouselSwiperProps {
  slides: React.ReactNode[];
  backgroundColor?: string;
  slidesPerView?: number;
}

export const CarouselSwiper = ({
  slides,
  backgroundColor,
  slidesPerView,
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
        slidesPerView={slidesPerView || 1}
      >
        {slides.map((slide) => {
          return <StyledSwiperSlide key={uuidValue}>{slide}</StyledSwiperSlide>;
        })}
      </Swiper>
    </StyledSwiperContainer>
  );
};
