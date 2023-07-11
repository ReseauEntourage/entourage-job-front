import React from 'react'
import { Swiper } from 'swiper/react';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { StyledSwiperSlide, StyledSwiperContainer } from './CarouselSwiper.styles';

interface CarouselSwiperProps {
    slides: React.ReactNode[];
}

export const CarouselSwiper = ({
    slides
}: CarouselSwiperProps) => {
    if (slides.length === 0) {
        return null;
    }
    return (

    <StyledSwiperContainer>
        <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            threshold={2}
            navigation={true}
            autoplay={true}
            pagination={{
                clickable: true,
            }}
        >
                {slides.map((slide) => {
                    return (<StyledSwiperSlide>
                        {slide}
                    </StyledSwiperSlide>)
                })}
        </Swiper>
    </StyledSwiperContainer>
    )
}
