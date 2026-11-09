import { styled } from 'styled-components';
import { Grid } from '@/src/components/ui';

/** Slide grid: its cells wrap and are centered vertically when they do. */
export const StyledCarouselItemGrid = styled(Grid)`
  flex-wrap: wrap;
  align-content: center;
`;
