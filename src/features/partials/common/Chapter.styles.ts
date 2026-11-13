import { styled } from 'styled-components';
import { BREAKPOINTS, SHADOWS } from '@/src/constants/styles';

/** Centered column holding the title and the chapter grid. */
export const StyledChapterContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

/** Centered title above the grid, half as wide as the page on desktop. */
export const StyledChapterTitle = styled.h2`
  display: block;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  font-weight: 700;
  margin-left: auto;
  margin-right: auto;
  text-align: center !important;
  margin-top: 0 !important;
  margin-bottom: 40px !important;

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    width: 50%;
  }
`;

/** Title placed in the text column, next to the picture. */
export const StyledChapterSmallTitle = styled.h2`
  font-weight: 700;
  text-align: left !important;
  margin-top: 0 !important;
  margin-bottom: 40px !important;
`;

export const StyledChapterText = styled.div`
  margin-top: 0 !important;
  margin-bottom: 0 !important;
`;

export const StyledChapterCta = styled.div`
  display: flex;
  margin-top: 40px !important;
`;

/** Framed picture, cropped to its box. */
export const StyledChapterPicture = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 450px;
  overflow: hidden;
  border-radius: 5px;
  box-shadow: ${SHADOWS.block};
`;
