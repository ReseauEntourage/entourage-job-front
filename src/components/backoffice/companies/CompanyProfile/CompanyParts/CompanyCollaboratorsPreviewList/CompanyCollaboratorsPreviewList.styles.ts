import styled from 'styled-components';
import { COLORS } from '@/src/constants/styles';

export const StyledFallbackContentContainer = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: column;
`;

export const StyledSwiperContainer = styled.div`
  width: 100%;
  max-width: 100%; /* limite à la largeur du parent */
  min-width: 0; /* permet le shrink */
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .swiper {
    width: 100%;
  }
  .swiper-wrapper {
    display: flex;
    align-items: stretch;
  }
  .swiper-slide {
    flex-shrink: 0;
    min-width: 0;
  }
`;

export const StyledSwiperItemContainer = styled.div`
  padding-bottom: 55px;
  width: 100%;
  height: 100%;
`;

export const StyledPrevButton = styled.div`
  background: ${COLORS.primaryBlue};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${COLORS.white};
  position: absolute;
  transform: translateY(-50%);
  bottom: 0;
  left: 0;
  z-index: 11; // over the pagination element
  cursor: pointer;

  &.swiper-button-disabled {
    background: ${COLORS.gray} !important;
  }
`;

export const StyledNextButton = styled.div`
  background: ${COLORS.primaryBlue};
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: ${COLORS.white};
  position: absolute;
  transform: translateY(-50%);
  bottom: 0;
  right: 0;
  z-index: 11; // over the pagination element
  cursor: pointer;

  &.swiper-button-disabled {
    background: ${COLORS.gray} !important;
  }
`;

export const StyledPaginationDot = styled.div`
  position: absolute;
  text-align: center;
  transition: 300ms opacity;
  transform: translate3d(0, 0, 0);
  z-index: 10;
  bottom: var(--swiper-pagination-bottom, 8px);
  top: var(--swiper-pagination-top, auto);
  left: 0;
  width: 100%;

  .swiper-pagination-bullet {
    align-items: center;
    background: ${COLORS.black};
    margin: 0 var(--swiper-pagination-bullet-horizontal-gap, 4px);
    cursor: pointer;

    &.swiper-pagination-bullet-active {
      background: ${COLORS.primaryBlue};
    }
  }
`;
