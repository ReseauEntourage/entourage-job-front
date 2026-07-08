import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

const SIDE_PANEL_WIDTH = `max(35vw, 480px)`;
const PROGRESS_STRIP_HEIGHT = 4;

export const StyledWizardPageContent = styled.div<{
  $hasSidePanel: boolean;
  $side: 'left' | 'right';
  $mobileBottomSheet?: boolean;
}>`
  width: ${({ $hasSidePanel }) =>
    $hasSidePanel ? `calc(100% - ${SIDE_PANEL_WIDTH})` : '100%'};
  margin-left: ${({ $hasSidePanel, $side }) =>
    $hasSidePanel && $side === 'left' ? SIDE_PANEL_WIDTH : '0'};
  margin-right: ${({ $hasSidePanel, $side }) =>
    $hasSidePanel && $side === 'right' ? SIDE_PANEL_WIDTH : '0'};
  min-height: 100vh;
  background-color: ${COLORS.lightGray};

  && input,
  && textarea {
    background-color: ${COLORS.white};
  }

  && .Select__control,
  && .Select__control--is-focused {
    background-color: ${COLORS.white} !important;
  }

  && .select .placeholder,
  && .select .selected-value {
    background-color: ${COLORS.white};
  }

  .section-container {
    max-width: 860px;
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: ${({ $mobileBottomSheet }) =>
      $mobileBottomSheet
        ? 'var(--wizard-bottom-sheet-collapsed-height, 80px)'
        : '0'};

    .section-container {
      max-width: unset;
    }
  }
`;

export const StyledWizardStepHeader = styled.div`
  .custom-page {
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

export const StyledWizardSidePanel = styled.aside<{
  $side: 'left' | 'right';
}>`
  position: fixed;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  top: ${({ $side }) =>
    $side === 'right' ? `${HEIGHTS.HEADER + PROGRESS_STRIP_HEIGHT}px` : '0'};
  width: ${SIDE_PANEL_WIDTH};
  height: ${({ $side }) =>
    $side === 'right'
      ? `calc(100vh - ${HEIGHTS.HEADER + PROGRESS_STRIP_HEIGHT}px)`
      : '100vh'};
  display: flex;
  flex-direction: column;
  z-index: 10;
  border-${({ $side }) => ($side === 'left' ? 'right' : 'left')}: 1px solid ${
  COLORS.gray
};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledWizardMobileHeader = styled.div`
  display: none;
  background-color: ${COLORS.extraDarkBlue};
  padding: 16px 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  && * {
    color: ${COLORS.white};
  }

  && svg {
    color: ${COLORS.white};
    fill: ${COLORS.white};
  }

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: flex;
  }
`;

export const StyledWizardSidePanelBody = styled.div<{
  $side: 'left' | 'right';
}>`
  overflow-y: auto;
  flex: 1;
  min-height: 0;
`;

export const StyledWizardTopBarProgressStrip = styled.div<{
  $hasSidePanel: boolean;
  $side: 'left' | 'right';
}>`
  position: sticky;
  top: ${HEIGHTS.HEADER}px;
  z-index: 10;
  height: ${PROGRESS_STRIP_HEIGHT}px;
  width: ${({ $hasSidePanel, $side }) =>
    $hasSidePanel && $side === 'right'
      ? `calc(100% + ${SIDE_PANEL_WIDTH})`
      : '100%'};
  background-color: ${COLORS.gray};
  overflow: hidden;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledWizardTopBarProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background-color: ${COLORS.primaryBlue};
  transition: width 0.3s ease;
`;

export const StyledWizardContentTopBar = styled.div<{
  $hasLogo: boolean;
  $hasSidePanel: boolean;
  $side: 'left' | 'right';
}>`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: ${({ $hasLogo }) =>
    $hasLogo ? 'space-between' : 'flex-end'};
  align-items: center;
  height: ${HEIGHTS.HEADER}px;
  padding: 0 15px;
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.lightGray};
  width: ${({ $hasSidePanel, $side }) =>
    $hasSidePanel && $side === 'right'
      ? `calc(100% + ${SIDE_PANEL_WIDTH})`
      : '100%'};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
    width: 100%;
  }
`;
