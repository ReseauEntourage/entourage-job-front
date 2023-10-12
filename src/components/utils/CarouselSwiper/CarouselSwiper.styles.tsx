/* eslint import/no-unresolved: "off" */
import styled from 'styled-components';
import { SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { COLORS } from 'src/constants/styles';

export const StyledSwiperSlide = styled(SwiperSlide)`
  padding-bottom: 50px;
`;

export const StyledSwiperContainer = styled.div`
  background-color: ${(props) => {
    return props.backgroundColor;
  }};
  .swiper-pagination-bullet-active {
    background-color: ${COLORS.primaryOrange};
    height: 15px;
    width: 15px;
    opacity: 100%;
  }
  .swiper-pagination-bullet {
    background-color: ${COLORS.primaryOrange};
    height: 15px;
    width: 15px;
  }
`;