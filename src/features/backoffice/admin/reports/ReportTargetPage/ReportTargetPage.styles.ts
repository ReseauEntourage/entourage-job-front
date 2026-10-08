import { styled } from 'styled-components';
import { BREAKPOINTS, COLORS, SHADOWS } from '@/src/constants/styles';

export const StyledReportTargetPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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

export const StyledReportPanel = styled.section<{ $area: LayoutArea }>`
  grid-area: ${({ $area }) => $area};
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 24px;
  border-radius: 10px;
  background-color: ${COLORS.white};
  box-shadow: ${SHADOWS.card};

  @media (max-width: ${BREAKPOINTS.desktop - 1}px) {
    padding: 16px;
  }
`;
