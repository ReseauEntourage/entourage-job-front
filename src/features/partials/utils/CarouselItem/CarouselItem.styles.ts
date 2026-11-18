import { styled } from 'styled-components';
import { Grid } from '@/src/components/ui';
import { BREAKPOINTS } from '@/src/constants/styles';

/** Slide grid: its cells wrap and are centered vertically when they do. */
export const StyledCarouselItemGrid = styled(Grid)`
  flex-wrap: wrap;
  align-content: center;
`;

/** Picture of the slide, covering its box (the image is given inline). */
export const StyledCarouselItemPicture = styled.div`
  flex: 1;
  height: 450px;
  background-size: cover;
  background-position: 50% 50%;
  background-repeat: no-repeat;
`;

/** Text cell of the slide, with a padding that grows on wide screens. */
export const StyledCarouselItemTextCell = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 30px;

  @media (min-width: ${BREAKPOINTS.large}px) {
    padding: 70px;
  }
`;

export const StyledCarouselItemText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;
