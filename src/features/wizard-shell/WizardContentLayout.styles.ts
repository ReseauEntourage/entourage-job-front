import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

const SIDE_PANEL_WIDTH = `max(35vw, 480px)`;

export const StyledWizardPageContent = styled.div<{
  $hasSidePanel: boolean;
  $side: 'left' | 'right';
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

    .section-container {
      max-width: unset;
    }
  }
`;

export const StyledWizardStepHeader = styled.div`
  background-color: ${COLORS.white};

  .custom-page {
    padding-top: 16px;
    padding-bottom: 16px;
  }
`;

export const StyledWizardSidePanel = styled.aside<{ $side: 'left' | 'right' }>`
  position: fixed;
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  top: 0;
  width: ${SIDE_PANEL_WIDTH};
  height: 100vh;
  background: linear-gradient(
    135deg,
    ${COLORS.extraDarkBlue},
    ${COLORS.darkBlue}
  );
  box-shadow: ${({ $side }) =>
    $side === 'left'
      ? '4px 0 12px rgba(0, 0, 0, 0.1)'
      : '-4px 0 12px rgba(0, 0, 0, 0.1)'};
  color: ${COLORS.white};
  z-index: 10;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;

export const StyledWizardSidePanelLogo = styled.div`
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const StyledWizardSidePanelBody = styled.div`
  padding: ${HEIGHTS.DEFAULT_SECTION_PADDING}px 32px;
  overflow-y: auto;
  height: calc(100vh - 84px);
`;

export const StyledWizardContentTopBar = styled.div<{ $hasLogo: boolean }>`
  display: flex;
  justify-content: ${({ $hasLogo }) =>
    $hasLogo ? 'space-between' : 'flex-end'};
  align-items: center;
  height: ${HEIGHTS.HEADER}px;
  padding: 0 15px;
  background-color: ${COLORS.white};
  border-bottom: 1px solid ${COLORS.lightGray};

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;
