import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledReportTargetPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const StyledReportBreadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${COLORS.darkGray};

  [aria-current='page'] {
    color: ${COLORS.black};
  }
`;

export const StyledReportTargetTitle = styled.h1`
  margin: 0;
  font-size: 28px;
  line-height: 1.5;
  font-weight: 600;
  color: ${COLORS.black};
`;

export const StyledReportTargetHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
`;

type LayoutArea = 'context' | 'decision' | 'versions' | 'reports';

/**
 * Two columns on desktop: the message, the decision and the versions on the
 * left, the reports on the right. One column below the desktop breakpoint:
 * message, decision, reports, then versions.
 */
export const StyledReportTargetLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
  grid-template-rows: auto auto 1fr;
  grid-template-areas:
    'context reports'
    'decision reports'
    'versions reports';
  align-items: start;
  gap: 20px 24px;

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    grid-template-areas:
      'context'
      'decision'
      'reports'
      'versions';
    gap: 16px;
  }
`;

export const StyledReportPanel = styled.section<{
  $area: LayoutArea;
  // The banner of the content touches the edges of the card
  $isFlush?: boolean;
}>`
  grid-area: ${({ $area }) => $area};
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: ${({ $isFlush }) => ($isFlush ? 0 : '24px')};
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};
  overflow: ${({ $isFlush }) => ($isFlush ? 'hidden' : 'visible')};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: ${({ $isFlush }) => ($isFlush ? 0 : '16px')};
  }
`;
