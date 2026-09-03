import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '../../../../constants/styles';

// On mobile, tinted background is reserved for the intro and final screens — question
// steps in between stay on a plain white background. On desktop, the background is
// always tinted regardless of step.
export const StyledCheckinFlow = styled.div<{ $tinted?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - ${HEIGHTS.HEADER}px);
  background: ${({ $tinted }) => ($tinted ? COLORS.hoverBlue : COLORS.white)};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    min-height: calc(100vh - ${HEIGHTS.HEADER_MOBILE}px);
  }

  @media (min-width: ${BREAKPOINTS.desktop}px) {
    background: ${COLORS.hoverBlue};
  }
`;

export const StyledCheckinFlowCentered = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 64px 16px;
  text-align: center;
`;

// Nested inside a SelectList option's label: stops clicks from bubbling up to the
// option's own button, which would otherwise toggle/deselect it.
export const StyledCheckinEmploymentTypeContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;
