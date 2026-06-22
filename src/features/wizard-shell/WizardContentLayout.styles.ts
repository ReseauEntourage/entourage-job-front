import styled from 'styled-components';
import { BREAKPOINTS, COLORS, HEIGHTS } from '@/src/constants/styles';

const SIDE_PANEL_WIDTH = `min(40vw, 600px)`;

export const StyledWizardPageContent = styled.div`
  width: calc(100% - ${SIDE_PANEL_WIDTH});
  min-height: calc(100vh - ${HEIGHTS.HEADER}px);
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

    .section-container {
      max-width: unset;
    }
  }
`;

export const StyledWizardStepHeader = styled.div`
  background-color: ${COLORS.white};
`;

export const StyledWizardSidePanel = styled.aside`
  position: fixed;
  right: 0;
  top: ${HEIGHTS.HEADER}px;
  width: ${SIDE_PANEL_WIDTH};
  height: calc(100vh - ${HEIGHTS.HEADER}px);
  overflow-y: auto;
  background-color: ${COLORS.white};
  border-left: 1px solid #e5e5e5;
  padding: ${HEIGHTS.DEFAULT_SECTION_PADDING}px 32px;
  z-index: 10;

  @media (max-width: ${BREAKPOINTS.desktop}px) {
    display: none;
  }
`;
